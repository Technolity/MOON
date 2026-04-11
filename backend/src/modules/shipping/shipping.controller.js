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

module.exports = {
  calculateShipping,
  listZones
};
