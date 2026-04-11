const { z } = require('zod');

const calculateShippingSchema = z.object({
  state: z.string().trim().min(1).max(120),
  postalCode: z.string().trim().min(4).max(12),
  orderSubtotal: z.coerce.number().nonnegative().optional()
});

module.exports = {
  calculateShippingSchema
};
