const ApiError = require('../../core/errors/api-error');
const repo = require('./discounts.repository');

function money(value) {
  return Math.max(0, Number(Number(value || 0).toFixed(2)));
}

function assertUsable(discount, subtotal) {
  if (!discount) throw new ApiError(404, 'Discount code not found.');
  if (!discount.is_active) throw new ApiError(400, 'Discount code is inactive.');

  const now = Date.now();
  if (discount.starts_at && new Date(discount.starts_at).getTime() > now) {
    throw new ApiError(400, 'Discount code is not active yet.');
  }
  if (discount.ends_at && new Date(discount.ends_at).getTime() < now) {
    throw new ApiError(400, 'Discount code has expired.');
  }
  if (discount.usage_limit != null && Number(discount.usage_count || 0) >= Number(discount.usage_limit)) {
    throw new ApiError(400, 'Discount code usage limit reached.');
  }
  if (subtotal < Number(discount.minimum_subtotal || 0)) {
    throw new ApiError(400, `Discount requires a minimum subtotal of ₹${Number(discount.minimum_subtotal || 0)}.`);
  }
}

function calculateDiscount(discount, subtotal) {
  const baseSubtotal = money(subtotal);
  let amount = 0;

  if (discount.type === 'percent') {
    amount = baseSubtotal * (Number(discount.value) / 100);
    if (discount.max_discount != null) {
      amount = Math.min(amount, Number(discount.max_discount));
    }
  } else if (discount.type === 'fixed') {
    amount = Number(discount.value);
  }

  return money(Math.min(amount, baseSubtotal));
}

async function validateDiscount({ code, subtotal, shippingCost = 0 }) {
  const normalizedCode = repo.normalizeCode(code);
  const baseSubtotal = money(subtotal);
  const discount = await repo.findDiscountByCode(normalizedCode);

  assertUsable(discount, baseSubtotal);

  const effectiveShipping = discount.free_shipping ? 0 : money(shippingCost);
  const discountAmount = calculateDiscount(discount, baseSubtotal);
  const discountedSubtotal = money(baseSubtotal - discountAmount);

  return {
    id: discount.id,
    code: discount.code,
    type: discount.type,
    value: Number(discount.value),
    discountAmount,
    subtotal: baseSubtotal,
    discountedSubtotal,
    shippingCost: effectiveShipping,
    freeShipping: Boolean(discount.free_shipping),
    totalAfterDiscount: money(discountedSubtotal + effectiveShipping),
    message: discount.free_shipping ? 'Discount applied — free shipping included!' : 'Discount applied.'
  };
}

async function listDiscounts() {
  return repo.listDiscounts();
}

async function createDiscount(input) {
  return repo.createDiscount(input);
}

async function updateDiscount(id, input) {
  return repo.updateDiscount(id, input);
}

async function deleteDiscount(id) {
  await repo.deleteDiscount(id);
}

module.exports = {
  calculateDiscount,
  createDiscount,
  deleteDiscount,
  listDiscounts,
  updateDiscount,
  validateDiscount
};
