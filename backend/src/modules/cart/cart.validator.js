const { z } = require('zod');

const addCartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().positive().max(99).default(1)
});

const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive().max(99)
});

const cartItemParamsSchema = z.object({
  itemId: z.string().trim().min(1)
});

module.exports = {
  addCartItemSchema,
  cartItemParamsSchema,
  updateCartItemSchema
};
