const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  FAILED: 'failed',
  REFUNDED: 'refunded'
});

module.exports = PAYMENT_STATUS;
