const crypto = require('crypto');

const env = require('../../config/env');
const ApiError = require('../../core/errors/api-error');
const { getRazorpayClient } = require('../../integrations/payments/razorpay.client');
const { getOrderById, updateStatus: updateOrderStatus } = require('../orders/orders.repository');
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

  // Send confirmation emails after payment is verified
  const orderData = await getOrderById(orderId);
  if (orderData) {
    const { sendOrderConfirmation, sendAdminOrderAlert } = require('../notifications/notifications.service');
    const addr = orderData.shipping_address || {};
    const shippingAddress = {
      full_name: addr.full_name,
      line1: addr.line_1,
      line2: addr.line_2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country
    };
    const items = (orderData.order_items || []).map(i => ({
      productName: i.product_name,
      quantity: i.quantity,
      unitPrice: Number(i.unit_price),
      subtotal: Number(i.subtotal)
    }));
    const invoiceUrl = `${env.app.storefrontUrl}/order-success/${orderId}`;
    Promise.allSettled([
      sendOrderConfirmation({ to: orderData.customer_email, orderNumber: orderData.order_number, total: Number(orderData.total), items, invoiceUrl }),
      sendAdminOrderAlert({ order: orderData, items, customerEmail: orderData.customer_email, customerPhone: orderData.customer_phone, shippingAddress, total: Number(orderData.total) })
    ]).catch(() => {});
  }

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

async function handleRazorpayWebhook(rawBody, signature) {
  const secret = env.razorpay.webhookSecret;

  if (!secret) {
    throw new ApiError(500, 'RAZORPAY_WEBHOOK_SECRET not configured');
  }

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (expectedSig !== signature) {
    const err = new ApiError(400, 'Invalid webhook signature');
    throw err;
  }

  const event = JSON.parse(rawBody.toString());
  const eventType = event.event;

  if (eventType === 'payment.captured') {
    const payment = event.payload.payment.entity;
    await paymentsRepository.updateByRazorpayOrderId(payment.order_id, {
      status: 'captured',
      razorpay_payment_id: payment.id,
      method: payment.method || 'unknown',
      raw_response: event
    });
    const paymentRecord = await paymentsRepository.findByRazorpayOrderId(payment.order_id);
    if (paymentRecord?.order_id) {
      await updateOrderStatus(paymentRecord.order_id, { status: 'confirmed' });
    }
  } else if (eventType === 'payment.failed') {
    const payment = event.payload.payment.entity;
    await paymentsRepository.updateByRazorpayOrderId(payment.order_id, {
      status: 'failed',
      raw_response: event
    });
  }

  return { received: true, event: eventType };
}

module.exports = { createRazorpayOrder, getPaymentStatus, verifyPayment, quickOrder, quickVerify, handleRazorpayWebhook };
