const express = require('express');

const {
  requireAdmin,
  requireAuth
} = require('../../core/middleware/require-auth');
const validateRequest = require('../../core/middleware/validate-request');
const ordersController = require('./orders.controller');
const {
  createOrderSchema,
  orderParamsSchema,
  updateOrderStatusBodySchema,
  updateOrderStatusParamsSchema
} = require('./orders.validator');

const router = express.Router();

router.post('/', validateRequest({ body: createOrderSchema }), ordersController.createOrder);
router.get('/', requireAuth, ordersController.listOrders);
router.get(
  '/:id',
  validateRequest({ params: orderParamsSchema }),
  ordersController.getOrderById
);
router.put(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validateRequest({
    params: updateOrderStatusParamsSchema,
    body: updateOrderStatusBodySchema
  }),
  ordersController.updateStatus
);

module.exports = router;
