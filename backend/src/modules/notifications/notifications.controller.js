const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const notificationsService = require('./notifications.service');

const sendEmail = asyncHandler(async (req, res) => {
  const result = await notificationsService.sendEmail(req.validated?.body ?? req.body);

  return sendResponse(res, {
    status: 202,
    message: 'Email notification queued.',
    data: result
  });
});

const sendSms = asyncHandler(async (req, res) => {
  const result = await notificationsService.sendSms(req.validated?.body ?? req.body);

  return sendResponse(res, {
    status: 202,
    message: 'SMS notification queued.',
    data: result
  });
});

const sendWhatsApp = asyncHandler(async (req, res) => {
  const result = await notificationsService.sendWhatsApp(
    req.validated?.body ?? req.body
  );

  return sendResponse(res, {
    status: 202,
    message: 'WhatsApp notification queued.',
    data: result
  });
});

module.exports = {
  sendEmail,
  sendSms,
  sendWhatsApp
};
