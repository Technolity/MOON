const Razorpay = require('razorpay');

const env = require('../../config/env');

let razorpayClient = null;

function getRazorpayClient() {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    return null;
  }

  if (!razorpayClient) {
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
