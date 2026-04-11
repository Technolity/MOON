const express = require('express');

const {
  requireAdmin,
  requireAuth
} = require('../../core/middleware/require-auth');
const validateRequest = require('../../core/middleware/validate-request');
const analyticsController = require('./analytics.controller');
const { analyticsQuerySchema, productMetricsQuerySchema } = require('./analytics.validator');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get(
  '/dashboard',
  validateRequest({ query: analyticsQuerySchema }),
  analyticsController.getDashboard
);
router.get(
  '/orders',
  validateRequest({ query: analyticsQuerySchema }),
  analyticsController.getOrderMetrics
);
router.get(
  '/revenue',
  validateRequest({ query: analyticsQuerySchema }),
  analyticsController.getRevenueMetrics
);
router.get(
  '/customers',
  validateRequest({ query: analyticsQuerySchema }),
  analyticsController.getCustomerMetrics
);
router.get(
  '/products',
  validateRequest({ query: productMetricsQuerySchema }),
  analyticsController.getProductMetrics
);

module.exports = router;
