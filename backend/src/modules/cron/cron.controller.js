const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const cronService = require('./cron.service');

const weeklyDigest = asyncHandler(async (req, res) => {
  const result = await cronService.weeklyDigest(req);
  return sendResponse(res, { message: 'Weekly digest sent.', data: result });
});

module.exports = { weeklyDigest };
