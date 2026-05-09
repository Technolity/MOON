const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const newsletterService = require('./newsletter.service');

const subscribe = asyncHandler(async (req, res) => {
  const result = await newsletterService.subscribe(req.validated?.body ?? req.body);
  return sendResponse(res, { status: 201, message: 'Subscribed successfully.', data: result });
});

const unsubscribe = asyncHandler(async (req, res) => {
  const result = await newsletterService.unsubscribe(req.validated?.body ?? req.body);
  return sendResponse(res, { message: 'Unsubscribed successfully.', data: result });
});

const listSubscribers = asyncHandler(async (req, res) => {
  const result = await newsletterService.listSubscribers();
  return sendResponse(res, { message: 'Subscribers loaded.', data: result });
});

const broadcast = asyncHandler(async (req, res) => {
  const result = await newsletterService.broadcast(req.validated?.body ?? req.body);
  return sendResponse(res, { message: 'Broadcast complete.', data: result });
});

module.exports = { subscribe, unsubscribe, listSubscribers, broadcast };
