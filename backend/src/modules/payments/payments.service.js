const crypto = require('crypto');

const env = require('../../config/env');
const ApiError = require('../../core/errors/api-error');
const { getRazorpayClient } = require('../../integrations/payments/razorpay.client');
const { getOrderById } = require('../orders/orders.repository');
const paymentsRepository = require('./payments.repository');

async function createRazorpayOrder({ orderId }) {
  const order = await getOrderById(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');
  if (order.status !== 'pending') throw new ApiError(409, 'Order is not in a payable state.');

  const rzp = getRazorpayClient();
  if (!rzp) throw new ApiError(503, 'Payment gateway not configured.');

  const amountInPaise = Math.round(Number(order.total) * 100);

  const rzpOrder = await rzp.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: order.order_number,
    notes: { moon_order_id: orderId }
  });

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

module.exports = { createRazorpayOrder, getPaymentStatus, verifyPayment };
