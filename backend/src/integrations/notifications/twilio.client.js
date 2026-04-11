const twilio = require('twilio');

const env = require('../../config/env');

let twilioClient = null;

function getTwilioClient() {
  if (!env.twilio.accountSid || !env.twilio.authToken) {
    return null;
  }

  if (!twilioClient) {
    twilioClient = twilio(env.twilio.accountSid, env.twilio.authToken);
  }

  return twilioClient;
}

module.exports = {
  getTwilioClient
};
