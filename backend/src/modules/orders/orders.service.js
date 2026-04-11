const ApiError = require('../../core/errors/api-error');
const { findProductsByIds } = require('../products/products.repository');
const { calculateShipping } = require('../shipping/shipping.service');
const ordersRepository = require('./orders.repository');

function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MOON-${date}-${rand}`;
}

async function createOrder({ user, input }) {
  const {
    customerEmail,
    customerPhone,
    items: requestedItems,
    shippingAddress,
    billingAddress,
    notes
  } = input;

  // 1. Load products from DB — never trust client prices
  const productIds = [...new Set(requestedItems.map(i => i.productId))];
  const products = await findProductsByIds(productIds);

  if (products.length !== productIds.length) {
    throw new ApiError(422, 'One or more products are unavailable.');
  }

  const productMap = Object.fromEntries(products.map(p => [p.id, p]));

  // 2. Build line items using DB prices
  const lineItems = requestedItems.map(req => {
    const product = productMap[req.productId];
    const unitPrice = Number(product.discount_price ?? product.price);
    return {
      productId: product.id,
      productName: product.name,
      quantity: req.quantity,
      unitPrice,
      subtotal: unitPrice * req.quantity
    };
  });

  const subtotal = lineItems.reduce((sum, i) => sum + i.subtotal, 0);

  // 3. Calculate shipping
  const shipping = await calculateShipping({
    state: shippingAddress.state,
    orderSubtotal: subtotal
  });
  const shippingCost = shipping.cost;
  const total = subtotal + shippingCost;

  // 4. Persist addresses
  const userId = user?.sub || null;
  const shippingAddressId = await ordersRepository.createAddress({
    ...shippingAddress,
    userId
  });
  const billingAddressId = billingAddress
    ? await ordersRepository.createAddress({ ...billingAddress, userId })
    : shippingAddressId;

  // 5. Create order + items
  const order = await ordersRepository.createOrder({
    userId,
    orderNumber: generateOrderNumber(),
    subtotal,
    shippingCost,
    total,
    shippingAddressId,
    billingAddressId,
    customerEmail,
    customerPhone,
    notes,
    items: lineItems
  });

  // 6. Reserve inventory (best-effort)
  await ordersRepository.reserveInventory(lineItems);

  return { ...order, items: lineItems, shippingCost, subtotal, total };
}

async function getOrderById({ user, params }) {
  const order = await ordersRepository.getOrderById(params.id);
  if (!order) throw new ApiError(404, 'Order not found.');

  // Customers can only view their own orders; admins see all
  if (user && user.role !== 'admin' && order.user_id !== user.sub) {
    throw new ApiError(403, 'Access denied.');
  }

  return order;
}

async function listOrders({ user }) {
  if (!user) throw new ApiError(401, 'Authentication required.');
  return ordersRepository.listOrdersByUser(user.sub);
}

async function updateStatus({ params, input }) {
  const order = await ordersRepository.getOrderById(params.id);
  if (!order) throw new ApiError(404, 'Order not found.');
  return ordersRepository.updateStatus(params.id, input);
}

module.exports = { createOrder, getOrderById, listOrders, updateStatus };
