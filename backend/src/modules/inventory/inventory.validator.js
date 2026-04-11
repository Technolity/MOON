const { z } = require('zod');

const inventoryParamsSchema = z.object({
  id: z.string().trim().min(1)
});

const updateInventorySchema = z.object({
  quantity: z.coerce.number().int().nonnegative().optional(),
  reserved: z.coerce.number().int().nonnegative().optional(),
  sku: z.string().trim().min(1).max(100).optional()
});

module.exports = {
  inventoryParamsSchema,
  updateInventorySchema
};
