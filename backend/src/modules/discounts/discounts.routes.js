const express = require('express');

const validateRequest = require('../../core/middleware/validate-request');
const discountsController = require('./discounts.controller');
const { validateDiscountSchema } = require('./discounts.validator');

const router = express.Router();

router.post(
  '/validate',
  validateRequest({ body: validateDiscountSchema }),
  discountsController.validateDiscount
);

module.exports = router;
