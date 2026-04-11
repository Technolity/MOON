const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

async function createAddress(addressData) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('addresses')
    .insert({
      full_name: addressData.fullName,
      phone: addressData.phone,
      line_1: addressData.line1,
      line_2: addressData.line2 || null,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.postalCode,
      country: addressData.country || 'India',
      user_id: addressData.userId || null
    })
    .select('id')
    .single();
  if (error) throw new ApiError(500, error.message);
  return data.id;
}

async function createOrder({
  userId,
  orderNumber,
  subtotal,
  shippingCost,
  total,
  shippingAddressId,
  billingAddressId,
  customerEmail,
  customerPhone,
  notes,
  items
}) {
  const db = getSupabaseAdminClient();

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      user_id: userId || null,
      order_number: orderNumber,
      status: 'pending',
      subtotal,
      shipping_cost: shippingCost,
      tax: 0,
      total,
      shipping_address_id: shippingAddressId,
      billing_address_id: billingAddressId,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      notes: notes || null
    })
    .select('*')
    .single();

  if (orderError) throw new ApiError(500, orderError.message);

  const orderItems = items.map(i => ({
    order_id: order.id,
    product_id: i.productId,
    product_name: i.productName,
    quantity: i.quantity,
    unit_price: i.unitPrice,
    subtotal: i.subtotal
  }));

  const { error: itemsError } = await db.from('order_items').insert(orderItems);
  if (itemsError) throw new ApiError(500, itemsError.message);

  return order;
}

async function getOrderById(id) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('orders')
    .select(
      '*, order_items(id, product_id, product_name, quantity, unit_price, subtotal), payments(status, method, razorpay_order_id, razorpay_payment_id)'
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function listOrdersByUser(userId) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('orders')
    .select('id, order_number, status, total, created_at, order_items(product_name, quantity)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new ApiError(500, error.message);
  return data ?? [];
}

async function updateStatus(id, { status, trackingNumber, notes }) {
  const db = getSupabaseAdminClient();
  const patch = { status };
  if (trackingNumber !== undefined) patch.tracking_number = trackingNumber;
  if (notes !== undefined) patch.notes = notes;

  const { data, error } = await db
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select('id, order_number, status, tracking_number, updated_at')
    .single();

  if (error) throw new ApiError(500, error.message);
  return data;
}

async function reserveInventory(items) {
  const db = getSupabaseAdminClient();
  for (const item of items) {
    const { error } = await db.rpc('increment_reserved', {
      p_product_id: item.productId,
      p_quantity: item.quantity
    });
    // Non-fatal: log but don't block order creation
    if (error) console.error(`inventory reserve failed for ${item.productId}:`, error.message);
  }
}

module.exports = { createAddress, createOrder, getOrderById, listOrdersByUser, reserveInventory, updateStatus };
