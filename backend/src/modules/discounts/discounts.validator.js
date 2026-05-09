const { z } = require('zod');

const discountParamsSchema = z.object({
  id: z.string().uuid()
});

const nullableDateSchema = z
  .string()
  .datetime()
  .nullable()
  .optional();

const discountWriteSchema = z.object({
  code: z.string().trim().min(2).max(40).regex(/^[a-zA-Z0-9_-]+$/, 'Code can only contain letters, numbers, hyphens, and underscores.'),
  type: z.enum(['percent', 'fixed']),
  value: z.number().positive(),
  minimumSubtotal: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  startsAt: nullableDateSchema,
  endsAt: nullableDateSchema,
  isActive: z.boolean().default(true)
});

const discountUpdateSchema = discountWriteSchema.partial();

const validateDiscountSchema = z.object({
  code: z.string().trim().min(1).max(40),
  subtotal: z.number().min(0),
  shippingCost: z.number().min(0).optional()
});

module.exports = {
  discountParamsSchema,
  discountUpdateSchema,
  discountWriteSchema,
  validateDiscountSchema
};
