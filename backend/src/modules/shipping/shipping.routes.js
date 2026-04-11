const express = require('express');

const validateRequest = require('../../core/middleware/validate-request');
const shippingController = require('./shipping.controller');
const { calculateShippingSchema } = require('./shipping.validator');

const router = express.Router();

router.post(
  '/calculate',
  validateRequest({ body: calculateShippingSchema }),
  shippingController.calculateShipping
);
router.get('/zones', shippingController.listZones);

module.exports = router;
