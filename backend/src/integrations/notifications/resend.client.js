const { Resend } = require('resend');

const env = require('../../config/env');

let resendClient = null;

function getResendClient() {
  if (!env.resend.apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(env.resend.apiKey);
  }

  return resendClient;
}

module.exports = { getResendClient };
