const express = require('express');

const { requireAuth } = require('../../core/middleware/require-auth');
const { authLimiter } = require('../../core/middleware/rate-limit');
const validateRequest = require('../../core/middleware/validate-request');
const authController = require('./auth.controller');
const {
  loginSchema,
  refreshTokenSchema,
  registerSchema
} = require('./auth.validator');

const router = express.Router();

// Strict rate limiting on all mutation endpoints to prevent brute-force and credential stuffing
router.post(
  '/register',
  authLimiter,
  validateRequest({ body: registerSchema }),
  authController.register
);
router.post(
  '/login',
  authLimiter,
  validateRequest({ body: loginSchema }),
  authController.login
);
router.post(
  '/refresh-token',
  authLimiter,
  validateRequest({ body: refreshTokenSchema }),
  authController.refreshToken
);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;
