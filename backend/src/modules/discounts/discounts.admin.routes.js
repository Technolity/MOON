const express = require('express');

const { requireAdmin, requireAuth } = require('../../core/middleware/require-auth');
const validateRequest = require('../../core/middleware/validate-request');
const discountsController = require('./discounts.controller');
const {
  discountParamsSchema,
  discountUpdateSchema,
  discountWriteSchema
} = require('./discounts.validator');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', discountsController.listDiscounts);
router.post(
  '/',
  validateRequest({ body: discountWriteSchema }),
  discountsController.createDiscount
);
router.put(
  '/:id',
  validateRequest({ params: discountParamsSchema, body: discountUpdateSchema }),
  discountsController.updateDiscount
);
router.delete(
  '/:id',
  validateRequest({ params: discountParamsSchema }),
  discountsController.deleteDiscount
);

module.exports = router;
