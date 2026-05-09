const { z } = require('zod');

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address.'),
  name: z.string().max(100).optional()
});

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address.')
});

const broadcastSchema = z.object({
  subject: z.string().min(1).max(200),
  html: z.string().min(1)
});

module.exports = { subscribeSchema, unsubscribeSchema, broadcastSchema };
