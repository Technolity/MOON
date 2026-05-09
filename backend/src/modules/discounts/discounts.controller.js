const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const discountsService = require('./discounts.service');

const listDiscounts = asyncHandler(async (_req, res) => {
  const discounts = await discountsService.listDiscounts();
  return sendResponse(res, {
    message: 'Discounts loaded.',
    data: discounts
  });
});

const createDiscount = asyncHandler(async (req, res) => {
  const discount = await discountsService.createDiscount(req.validated?.body ?? req.body);
  return sendResponse(res, {
    status: 201,
    message: 'Discount created.',
    data: discount
  });
});

const updateDiscount = asyncHandler(async (req, res) => {
  const discount = await discountsService.updateDiscount(
    req.validated?.params.id ?? req.params.id,
    req.validated?.body ?? req.body
  );
  return sendResponse(res, {
    message: 'Discount updated.',
    data: discount
  });
});

const deleteDiscount = asyncHandler(async (req, res) => {
  await discountsService.deleteDiscount(req.validated?.params.id ?? req.params.id);
  return res.status(204).end();
});

const validateDiscount = asyncHandler(async (req, res) => {
  const result = await discountsService.validateDiscount(req.validated?.body ?? req.body);
  return sendResponse(res, {
    message: 'Discount validated.',
    data: result
  });
});

module.exports = {
  createDiscount,
  deleteDiscount,
  listDiscounts,
  updateDiscount,
  validateDiscount
};
