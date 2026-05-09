const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const paymentsService = require('./payments.service');

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const result = await paymentsService.createRazorpayOrder(
    req.validated?.body ?? req.body
  );

  return sendResponse(res, {
    status: 201,
    message: 'Razorpay order created.',
    data: result
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const result = await paymentsService.verifyPayment(req.validated?.body ?? req.body);

  return sendResponse(res, {
    message: 'Payment verified.',
    data: result
  });
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const result = await paymentsService.getPaymentStatus(
    req.validated?.params ?? req.params
  );

  return sendResponse(res, {
    message: 'Payment status loaded.',
    data: result
  });
});

const quickOrder = asyncHandler(async (req, res) => {
  const result = await paymentsService.quickOrder(req.validated?.body ?? req.body);
  return sendResponse(res, { status: 201, message: 'Razorpay order created.', data: result });
});

const quickVerify = asyncHandler(async (req, res) => {
  const result = await paymentsService.quickVerify(req.validated?.body ?? req.body);
  return sendResponse(res, { message: 'Payment verified.', data: result });
});

module.exports = {
  createRazorpayOrder,
  getPaymentStatus,
  verifyPayment,
  quickOrder,
  quickVerify
};
