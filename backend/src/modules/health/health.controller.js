const sendResponse = require('../../core/utils/send-response');
const env = require('../../config/env');

function getHealth(req, res) {
  return sendResponse(res, {
    message: 'Service healthy.',
    data: {
      service: env.app.name,
      environment: env.app.nodeEnv,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = {
  getHealth
};
