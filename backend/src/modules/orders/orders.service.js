const ApiError = require('../../core/errors/api-error');
const { findProductsByIds } = require('../products/products.repository');
const { calculateShipping } = require('../shipping/shipping.service');
const { validateDiscount } = require('../discounts/discounts.service');
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
    notes,
    discountCode
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

  // 4. Apply discount if provided (re-validate server-side — never trust client amounts)
  let discountAmount = 0;
  let effectiveShipping = shippingCost;
  if (discountCode) {
    try {
      const discount = await validateDiscount({ code: discountCode, subtotal, shippingCost });
      discountAmount = discount.discountAmount;
      effectiveShipping = discount.shippingCost;
    } catch {
      // Invalid/expired discount — proceed with full price
    }
  }
  const total = Math.max(0, subtotal - discountAmount) + effectiveShipping;

  // 5. Persist addresses
  const userId = user?.sub || null;
  const shippingAddressId = await ordersRepository.createAddress({
    ...shippingAddress,
    userId
  });
  const billingAddressId = billingAddress
    ? await ordersRepository.createAddress({ ...billingAddress, userId })
    : shippingAddressId;

  // 6. Create order + items
  const order = await ordersRepository.createOrder({
    userId,
    orderNumber: generateOrderNumber(),
    subtotal,
    shippingCost: effectiveShipping,
    total,
    shippingAddressId,
    billingAddressId,
    customerEmail,
    customerPhone,
    notes,
    items: lineItems
  });

  // 7. Reserve inventory (best-effort)
  await ordersRepository.reserveInventory(lineItems);

  return { ...order, items: lineItems, shippingCost: effectiveShipping, subtotal, total };
}

async function getOrderById({ user, params }) {
  const order = await ordersRepository.getOrderById(params.id);
  if (!order) throw new ApiError(404, 'Order not found.');

  // Customers can only view their own orders; admins see all
  if (user && user.role !== 'admin' && order.user_id !== user.sub) {
    throw new ApiError(403, 'Access denied.');
  }

  return { ...order, items: order.order_items || [] };
}

async function listOrders({ user }) {
  if (!user) throw new ApiError(401, 'Authentication required.');
  return ordersRepository.listOrdersByUser(user.sub);
}

async function updateStatus({ params, input }) {
  const order = await ordersRepository.getOrderById(params.id);
  if (!order) throw new ApiError(404, 'Order not found.');
  const updated = await ordersRepository.updateStatus(params.id, input);
  if (input.status === 'shipped' && order.customer_email) {
    const { sendShippingNotification } = require('../notifications/notifications.service');
    sendShippingNotification({
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      trackingNumber: input.trackingNumber || null
    }).catch(() => {});
  }
  return updated;
}

async function cancelOrder({ params }) {
  const db = require('../../integrations/database/supabase-admin').getSupabaseAdminClient();
  const { data: order, error } = await db
    .from('orders')
    .select('id, status, payments(status)')
    .eq('id', params.id)
    .maybeSingle();

  if (error || !order) throw new ApiError(404, 'Order not found.');
  if (order.status !== 'pending') throw new ApiError(409, 'Only pending orders can be cancelled.');

  const paid = (order.payments || []).some(p => p.status === 'captured');
  if (paid) throw new ApiError(409, 'Order has been paid and cannot be cancelled.');

  // Update status
  await db.from('orders').update({ status: 'cancelled' }).eq('id', params.id);

  // Release reserved inventory
  const { data: items } = await db
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', params.id);
  if (items?.length) {
    await ordersRepository.releaseInventory(
      items.map(i => ({ productId: i.product_id, quantity: i.quantity }))
    );
  }

  return { cancelled: true };
}

module.exports = { createOrder, getOrderById, listOrders, updateStatus, cancelOrder };
