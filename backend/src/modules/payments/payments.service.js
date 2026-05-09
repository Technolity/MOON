const crypto = require('crypto');

const env = require('../../config/env');
const ApiError = require('../../core/errors/api-error');
const { getRazorpayClient } = require('../../integrations/payments/razorpay.client');
const { getOrderById } = require('../orders/orders.repository');
const paymentsRepository = require('./payments.repository');

function mapRazorpayError(error) {
  const providerStatusCode = error?.statusCode;
  const providerCode = error?.error?.code;
  const providerDescription = error?.error?.description || error?.message;

  if (providerStatusCode === 401) {
    return new ApiError(
      502,
      'Payment gateway authentication failed. Check Razorpay key id/secret and live/test mode.',
      {
        provider: 'razorpay',
        providerStatusCode,
        providerCode,
        providerDescription
      }
    );
  }

  return new ApiError(
    502,
    'Payment gateway request failed.',
    {
      provider: 'razorpay',
      providerStatusCode,
      providerCode,
      providerDescription
    }
  );
}

async function createRazorpayOrder({ orderId }) {
  const order = await getOrderById(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');
  if (order.status !== 'pending') throw new ApiError(409, 'Order is not in a payable state.');

  const rzp = getRazorpayClient();
  if (!rzp) throw new ApiError(503, 'Payment gateway not configured.');

  const amountInPaise = Math.round(Number(order.total) * 100);

  let rzpOrder;
  try {
    rzpOrder = await rzp.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.order_number,
      notes: { moon_order_id: orderId }
    });
  } catch (error) {
    throw mapRazorpayError(error);
  }

  // Upsert payment record
  const existing = await paymentsRepository.getPaymentByOrderId(orderId);
  let payment;
  if (existing) {
    payment = await paymentsRepository.updatePaymentStatus({
      orderId,
      razorpayOrderId: rzpOrder.id,
      status: 'pending'
    });
  } else {
    payment = await paymentsRepository.createPaymentRecord({
      orderId,
      amount: order.total
    });
    payment = await paymentsRepository.updatePaymentStatus({
      orderId,
      razorpayOrderId: rzpOrder.id,
      status: 'pending'
    });
  }

  return {
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: env.razorpay.keyId,
    orderId,
    orderNumber: order.order_number,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone
  };
}

async function verifyPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSig = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(body)
    .digest('hex');

  if (expectedSig !== razorpaySignature) {
    throw new ApiError(400, 'Payment signature verification failed.');
  }

  const payment = await paymentsRepository.updatePaymentStatus({
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: 'captured',
    rawResponse: { razorpayOrderId, razorpayPaymentId }
  });

  // Advance order status to confirmed
  const db = require('../../integrations/database/supabase-admin').getSupabaseAdminClient();
  await db.from('orders').update({ status: 'confirmed' }).eq('id', orderId);

  return { payment, verified: true };
}

async function getPaymentStatus({ orderId }) {
  const payment = await paymentsRepository.getPaymentByOrderId(orderId);
  if (!payment) throw new ApiError(404, 'Payment record not found.');
  return payment;
}

const DEV_PAYMENT_MODE = process.env.DEV_PAYMENT_MODE === 'true';

async function quickOrder({ amount, currency = 'INR', receipt, notes }) {
  if (DEV_PAYMENT_MODE) {
    console.log(`[payments] DEV_PAYMENT_MODE — simulating Razorpay order (amount: ${amount} paise)`);
    return {
      razorpayOrderId: `dev_order_${Date.now()}`,
      amount,
      currency,
      keyId: 'dev_key'
    };
  }

  const rzp = getRazorpayClient();
  if (!rzp) throw new ApiError(503, 'Payment gateway not configured.');

  let rzpOrder;
  try {
    rzpOrder = await rzp.orders.create({ amount, currency, receipt, notes });
  } catch (error) {
    throw mapRazorpayError(error);
  }
  return {
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: env.razorpay.keyId
  };
}

async function quickVerify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (DEV_PAYMENT_MODE) {
    console.log(`[payments] DEV_PAYMENT_MODE — skipping signature verification`);
    return { verified: true };
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSig = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(body)
    .digest('hex');

  if (expectedSig !== razorpaySignature) {
    throw new ApiError(400, 'Payment signature verification failed.');
  }

  return { verified: true };
}

module.exports = { createRazorpayOrder, getPaymentStatus, verifyPayment, quickOrder, quickVerify };
