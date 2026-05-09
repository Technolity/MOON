const Razorpay = require('razorpay');

const env = require('../../config/env');

let razorpayClient = null;

function getRazorpayClient() {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    console.warn('[razorpay] RAZORPAY_KEY / RAZORPAY_SECRET not set — client unavailable');
    return null;
  }

  if (!razorpayClient) {
    console.log(`[razorpay] Initializing client — key: ${env.razorpay.keyId.slice(0, 12)}…`);
    razorpayClient = new Razorpay({
      key_id: env.razorpay.keyId,
      key_secret: env.razorpay.keySecret
    });
  }

  return razorpayClient;
}

module.exports = {
  getRazorpayClient
};
