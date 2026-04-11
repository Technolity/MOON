const { z } = require('zod');

const analyticsQuerySchema = z.object({
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  limit: z.coerce.number().int().positive().max(365).optional()
});

const productMetricsQuerySchema = analyticsQuerySchema.extend({
  limit: z.coerce.number().int().positive().max(50).default(10)
});

module.exports = {
  analyticsQuerySchema,
  productMetricsQuerySchema
};
