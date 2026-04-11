const express = require('express');

const validateRequest = require('../../core/middleware/validate-request');
const cartController = require('./cart.controller');
const {
  addCartItemSchema,
  cartItemParamsSchema,
  updateCartItemSchema
} = require('./cart.validator');

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/add', validateRequest({ body: addCartItemSchema }), cartController.addItem);
router.put(
  '/update/:itemId',
  validateRequest({
    params: cartItemParamsSchema,
    body: updateCartItemSchema
  }),
  cartController.updateItem
);
router.delete(
  '/remove/:itemId',
  validateRequest({ params: cartItemParamsSchema }),
  cartController.removeItem
);
router.post('/clear', cartController.clearCart);

module.exports = router;
