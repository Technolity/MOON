const { z } = require('zod');

const listProductsQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  theme: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().positive().max(100).optional()
});

const searchProductsQuerySchema = z.object({
  q: z.string().trim().min(1),
  limit: z.coerce.number().int().positive().max(100).optional()
});

const productParamsSchema = z.object({
  id: z.string().trim().min(1)
});

module.exports = {
  listProductsQuerySchema,
  productParamsSchema,
  searchProductsQuerySchema
};
