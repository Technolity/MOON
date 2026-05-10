const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const shippingService = require('./shipping.service');

const calculateShipping = asyncHandler(async (req, res) => {
  const result = await shippingService.calculateShipping(
    req.validated?.body ?? req.body
  );

  return sendResponse(res, {
    message: 'Shipping calculated.',
    data: result
  });
});

const listZones = asyncHandler(async (req, res) => {
  const result = await shippingService.listZones();

  return sendResponse(res, {
    message: 'Shipping zones loaded.',
    data: result
  });
});

const updateZone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cost, estimatedDays } = req.body;
  const result = await shippingService.updateZone(id, { cost, estimatedDays });
  return sendResponse(res, { message: 'Shipping zone updated.', data: result });
});

module.exports = {
  calculateShipping,
  listZones,
  updateZone
};
