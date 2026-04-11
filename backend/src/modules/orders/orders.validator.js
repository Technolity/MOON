const { z } = require('zod');

const ORDER_STATUS = require('../../constants/order-status');

const addressSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(10).max(15),
  line1: z.string().trim().min(1).max(255),
  line2: z.string().trim().max(255).optional(),
  city: z.string().trim().min(1).max(120),
  state: z.string().trim().min(1).max(120),
  postalCode: z.string().trim().min(4).max(12),
  country: z.string().trim().min(2).max(80).default('India')
});

const createOrderSchema = z.object({
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(10).max(15),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.coerce.number().int().positive().max(20)
      })
    )
    .min(1),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'wallet']).optional(),
  notes: z.string().trim().max(1000).optional()
});

const orderParamsSchema = z.object({
  id: z.string().trim().min(1)
});

const updateOrderStatusParamsSchema = z.object({
  id: z.string().trim().min(1)
});

const updateOrderStatusBodySchema = z.object({
  status: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED
  ]),
  trackingNumber: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(1000).optional()
});

module.exports = {
  createOrderSchema,
  orderParamsSchema,
  updateOrderStatusBodySchema,
  updateOrderStatusParamsSchema
};
