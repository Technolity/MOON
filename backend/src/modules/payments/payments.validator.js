const { z } = require('zod');

const createRazorpayOrderSchema = z.object({
  orderId: z.string().trim().min(1)
});

const verifyPaymentSchema = z.object({
  orderId: z.string().trim().min(1),
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  razorpaySignature: z.string().trim().min(1)
});

const paymentStatusParamsSchema = z.object({
  orderId: z.string().trim().min(1)
});

module.exports = {
  createRazorpayOrderSchema,
  paymentStatusParamsSchema,
  verifyPaymentSchema
};
