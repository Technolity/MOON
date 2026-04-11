const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  phone: z.string().trim().min(10).max(15).optional(),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional()
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1).optional()
});

module.exports = {
  loginSchema,
  refreshTokenSchema,
  registerSchema
};
