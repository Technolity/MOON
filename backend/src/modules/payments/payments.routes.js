const express = require('express');

const { requireAuth } = require('../../core/middleware/require-auth');
const { paymentsLimiter } = require('../../core/middleware/rate-limit');
const validateRequest = require('../../core/middleware/validate-request');
const paymentsController = require('./payments.controller');
const {
  createRazorpayOrderSchema,
  paymentStatusParamsSchema,
  verifyPaymentSchema
} = require('./payments.validator');

const router = express.Router();

// All payment operations require authentication
router.use(requireAuth);

router.post(
  '/razorpay',
  paymentsLimiter,
  validateRequest({ body: createRazorpayOrderSchema }),
  paymentsController.createRazorpayOrder
);
router.post(
  '/verify',
  paymentsLimiter,
  validateRequest({ body: verifyPaymentSchema }),
  paymentsController.verifyPayment
);
router.get(
  '/:orderId',
  validateRequest({ params: paymentStatusParamsSchema }),
  paymentsController.getPaymentStatus
);

module.exports = router;
