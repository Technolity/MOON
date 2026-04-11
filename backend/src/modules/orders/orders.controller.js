const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const ordersService = require('./orders.service');

const createOrder = asyncHandler(async (req, res) => {
  const result = await ordersService.createOrder({
    user: req.user,
    input: req.validated?.body ?? req.body
  });

  return sendResponse(res, {
    status: 201,
    message: 'Order created.',
    data: result
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const result = await ordersService.getOrderById({
    user: req.user,
    params: req.validated?.params ?? req.params
  });

  return sendResponse(res, {
    message: 'Order loaded.',
    data: result
  });
});

const listOrders = asyncHandler(async (req, res) => {
  const result = await ordersService.listOrders({
    user: req.user,
    query: req.validated?.query ?? req.query
  });

  return sendResponse(res, {
    message: 'Orders loaded.',
    data: result
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const result = await ordersService.updateStatus({
    user: req.user,
    params: req.validated?.params ?? req.params,
    input: req.validated?.body ?? req.body
  });

  return sendResponse(res, {
    message: 'Order status updated.',
    data: result
  });
});

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateStatus
};
