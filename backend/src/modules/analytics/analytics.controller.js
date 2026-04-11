const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const analyticsService = require('./analytics.service');

const getDashboard = asyncHandler(async (req, res) => {
  const result = await analyticsService.getDashboard(req.validated?.query ?? req.query);

  return sendResponse(res, {
    message: 'Dashboard analytics loaded.',
    data: result
  });
});

const getOrderMetrics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getOrderMetrics(
    req.validated?.query ?? req.query
  );

  return sendResponse(res, {
    message: 'Order analytics loaded.',
    data: result
  });
});

const getRevenueMetrics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getRevenueMetrics(
    req.validated?.query ?? req.query
  );

  return sendResponse(res, {
    message: 'Revenue analytics loaded.',
    data: result
  });
});

const getCustomerMetrics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getCustomerMetrics(
    req.validated?.query ?? req.query
  );

  return sendResponse(res, {
    message: 'Customer analytics loaded.',
    data: result
  });
});

const getProductMetrics = asyncHandler(async (req, res) => {
  const result = await analyticsService.getProductMetrics(
    req.validated?.query ?? req.query
  );

  return sendResponse(res, {
    message: 'Product analytics loaded.',
    data: result
  });
});

module.exports = {
  getCustomerMetrics,
  getDashboard,
  getOrderMetrics,
  getProductMetrics,
  getRevenueMetrics
};
