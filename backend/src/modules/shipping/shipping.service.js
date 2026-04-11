const ApiError = require('../../core/errors/api-error');
const shippingRepository = require('./shipping.repository');

const FREE_SHIPPING_THRESHOLD = 999; // INR — orders above this ship free

async function listZones() {
  return shippingRepository.listZones();
}

async function calculateShipping({ state, orderSubtotal = 0 }) {
  if (orderSubtotal >= FREE_SHIPPING_THRESHOLD) {
    return { cost: 0, estimatedDays: null, zoneName: 'Free Shipping', isFree: true };
  }

  const zone = await shippingRepository.findZoneByState(state);
  if (!zone) {
    throw new ApiError(422, `Shipping is not available to "${state}" yet.`);
  }

  return {
    cost: Number(zone.cost),
    estimatedDays: zone.estimated_days,
    zoneName: zone.zone_name,
    isFree: false
  };
}

module.exports = { calculateShipping, listZones };
