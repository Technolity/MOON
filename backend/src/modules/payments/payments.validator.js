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

const quickOrderSchema = z.object({
  amount: z.number().int().min(100),
  currency: z.string().default('INR'),
  receipt: z.string().trim().min(1).max(40),
  notes: z.record(z.string()).optional()
});

const quickVerifySchema = z.object({
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  razorpaySignature: z.string().trim().min(1)
});

module.exports = {
  createRazorpayOrderSchema,
  paymentStatusParamsSchema,
  verifyPaymentSchema,
  quickOrderSchema,
  quickVerifySchema
};
