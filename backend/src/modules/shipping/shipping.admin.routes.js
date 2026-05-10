const express = require('express');
const { requireAuth, requireAdmin } = require('../../core/middleware/require-auth');
const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const shippingService = require('./shipping.service');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', asyncHandler(async (req, res) => {
  const zones = await shippingService.listZones();
  return sendResponse(res, { message: 'Shipping zones loaded.', data: zones });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cost, estimatedDays } = req.body;
  const result = await shippingService.updateZone(id, { cost, estimatedDays });
  return sendResponse(res, { message: 'Shipping zone updated.', data: result });
}));

module.exports = router;
