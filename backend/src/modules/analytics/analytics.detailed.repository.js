const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

function dateFilter(query, column, dateFrom, dateTo) {
  if (dateFrom) query = query.gte(column, dateFrom);
  if (dateTo) query = query.lte(column, dateTo);
  return query;
}

/**
 * Get all buyers with aggregated purchase history.
 * Returns: email, name, phone, total orders, total spent, products purchased, last order date.
 */
async function getBuyersSummary({ dateFrom, dateTo, limit = 50, offset = 0 } = {}) {
  const db = getSupabaseAdminClient();

  let query = db
    .from('orders')
    .select(`
      id,
      order_number,
      customer_email,
      customer_phone,
      total,
      status,
      created_at,
      order_items (
        product_id,
        product_name,
        quantity,
        unit_price,
        subtotal
      ),
      shipping_address:addresses!orders_shipping_address_id_fkey (
        full_name,
        city,
        state
      )
    `)
    .in('status', ['confirmed', 'packed', 'shipped', 'delivered', 'pending']);

  query = dateFilter(query, 'created_at', dateFrom, dateTo);
  const { data: orders, error } = await query.order('created_at', { ascending: false });
  if (error) throw new ApiError(500, error.message);

  // Aggregate by buyer email
  const buyerMap = {};
  for (const order of (orders ?? [])) {
    const email = order.customer_email;
    if (!buyerMap[email]) {
      const shippingAddr = Array.isArray(order.shipping_address)
        ? order.shipping_address[0]
        : order.shipping_address;
      buyerMap[email] = {
        email,
        name: shippingAddr?.full_name || email.split('@')[0],
        phone: order.customer_phone || null,
        city: shippingAddr?.city || null,
        state: shippingAddr?.state || null,
        totalOrders: 0,
        totalSpent: 0,
        productsBought: {},
        firstOrderDate: order.created_at,
        lastOrderDate: order.created_at,
        orderStatuses: {},
      };
    }

    const buyer = buyerMap[email];
    buyer.totalOrders += 1;
    buyer.totalSpent += Number(order.total);
    buyer.orderStatuses[order.status] = (buyer.orderStatuses[order.status] || 0) + 1;

    // Track first and last order
    if (order.created_at < buyer.firstOrderDate) buyer.firstOrderDate = order.created_at;
    if (order.created_at > buyer.lastOrderDate) buyer.lastOrderDate = order.created_at;

    // Track products
    for (const item of (order.order_items ?? [])) {
      if (!buyer.productsBought[item.product_id]) {
        buyer.productsBought[item.product_id] = {
          productId: item.product_id,
          productName: item.product_name,
          totalQuantity: 0,
          totalSpent: 0,
        };
      }
      buyer.productsBought[item.product_id].totalQuantity += item.quantity;
      buyer.productsBought[item.product_id].totalSpent += Number(item.subtotal);
    }
  }

  // Convert to array and sort by total spent
  const buyers = Object.values(buyerMap)
    .map(b => ({
      ...b,
      totalSpent: Number(b.totalSpent.toFixed(2)),
      productsBought: Object.values(b.productsBought),
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return {
    buyers: buyers.slice(offset, offset + limit),
    total: buyers.length,
  };
}

/**
 * Get detailed purchase history for a single buyer by email.
 */
async function getBuyerDetail(email) {
  if (!email) throw new ApiError(400, 'Email is required.');
  const db = getSupabaseAdminClient();

  const { data: orders, error } = await db
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      subtotal,
      shipping_cost,
      tax,
      total,
      tracking_number,
      notes,
      created_at,
      updated_at,
      customer_email,
      customer_phone,
      order_items (
        id,
        product_id,
        product_name,
        quantity,
        unit_price,
        subtotal
      ),
      shipping_address:addresses!orders_shipping_address_id_fkey (
        full_name,
        phone,
        line_1,
        line_2,
        city,
        state,
        postal_code,
        country
      ),
      payments (
        status,
        method,
        amount,
        razorpay_order_id,
        razorpay_payment_id
      )
    `)
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (error) throw new ApiError(500, error.message);

  // Compute aggregates
  const totalSpent = (orders ?? [])
    .filter(o => ['confirmed', 'packed', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total), 0);

  const productsSummary = {};
  for (const order of (orders ?? [])) {
    for (const item of (order.order_items ?? [])) {
      if (!productsSummary[item.product_id]) {
        productsSummary[item.product_id] = {
          productId: item.product_id,
          productName: item.product_name,
          totalQuantity: 0,
          totalSpent: 0,
          orderCount: 0,
        };
      }
      productsSummary[item.product_id].totalQuantity += item.quantity;
      productsSummary[item.product_id].totalSpent += Number(item.subtotal);
      productsSummary[item.product_id].orderCount += 1;
    }
  }

  return {
    email,
    totalOrders: orders?.length ?? 0,
    totalSpent: Number(totalSpent.toFixed(2)),
    productsSummary: Object.values(productsSummary),
    orders: orders ?? [],
  };
}

/**
 * Get all buyers who purchased a specific product.
 */
async function getProductBuyers(productId, { dateFrom, dateTo } = {}) {
  if (!productId) throw new ApiError(400, 'Product ID is required.');
  const db = getSupabaseAdminClient();

  let query = db
    .from('order_items')
    .select(`
      product_id,
      product_name,
      quantity,
      unit_price,
      subtotal,
      orders!inner (
        id,
        order_number,
        customer_email,
        customer_phone,
        status,
        created_at,
        shipping_address:addresses!orders_shipping_address_id_fkey (
          full_name,
          city,
          state
        )
      )
    `)
    .eq('product_id', productId)
    .in('orders.status', ['confirmed', 'packed', 'shipped', 'delivered']);

  if (dateFrom) query = query.gte('orders.created_at', dateFrom);
  if (dateTo) query = query.lte('orders.created_at', dateTo);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  // Aggregate by buyer email
  const buyerMap = {};
  const productName = data?.[0]?.product_name || 'Unknown';

  for (const item of (data ?? [])) {
    const order = Array.isArray(item.orders) ? item.orders[0] : item.orders;
    if (!order) continue;
    const email = order.customer_email;
    if (!buyerMap[email]) {
      const addr = Array.isArray(order.shipping_address)
        ? order.shipping_address[0]
        : order.shipping_address;
      buyerMap[email] = {
        email,
        name: addr?.full_name || email.split('@')[0],
        phone: order.customer_phone || null,
        city: addr?.city || null,
        state: addr?.state || null,
        totalQuantity: 0,
        totalSpent: 0,
        orderCount: 0,
        lastPurchaseDate: order.created_at,
      };
    }
    buyerMap[email].totalQuantity += item.quantity;
    buyerMap[email].totalSpent += Number(item.subtotal);
    buyerMap[email].orderCount += 1;
    if (order.created_at > buyerMap[email].lastPurchaseDate) {
      buyerMap[email].lastPurchaseDate = order.created_at;
    }
  }

  return {
    productId,
    productName,
    totalBuyers: Object.keys(buyerMap).length,
    buyers: Object.values(buyerMap)
      .map(b => ({ ...b, totalSpent: Number(b.totalSpent.toFixed(2)) }))
      .sort((a, b) => b.totalSpent - a.totalSpent),
  };
}

/**
 * Revenue and order count broken down by day/week/month.
 */
async function getTimeline({ dateFrom, dateTo, granularity = 'day' } = {}) {
  const db = getSupabaseAdminClient();

  let query = db
    .from('orders')
    .select('id, total, status, created_at')
    .in('status', ['confirmed', 'packed', 'shipped', 'delivered']);
  query = dateFilter(query, 'created_at', dateFrom, dateTo);
  const { data, error } = await query.order('created_at');
  if (error) throw new ApiError(500, error.message);

  const buckets = {};
  for (const order of (data ?? [])) {
    const dt = new Date(order.created_at);
    let key;
    if (granularity === 'month') {
      key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    } else if (granularity === 'week') {
      // ISO week start (Monday)
      const d = new Date(dt);
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      key = d.toISOString().slice(0, 10);
    } else {
      key = dt.toISOString().slice(0, 10);
    }

    if (!buckets[key]) {
      buckets[key] = { period: key, revenue: 0, orders: 0 };
    }
    buckets[key].revenue += Number(order.total);
    buckets[key].orders += 1;
  }

  const timeline = Object.values(buckets)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map(b => ({ ...b, revenue: Number(b.revenue.toFixed(2)) }));

  return { granularity, timeline };
}

/**
 * Geographic breakdown of orders by state/city.
 */
async function getGeoBreakdown({ dateFrom, dateTo } = {}) {
  const db = getSupabaseAdminClient();

  let query = db
    .from('orders')
    .select(`
      id,
      total,
      status,
      created_at,
      shipping_address:addresses!orders_shipping_address_id_fkey (
        state,
        city,
        postal_code
      )
    `)
    .in('status', ['confirmed', 'packed', 'shipped', 'delivered']);

  query = dateFilter(query, 'created_at', dateFrom, dateTo);
  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  const byState = {};
  const byCity = {};

  for (const order of (data ?? [])) {
    const addr = Array.isArray(order.shipping_address)
      ? order.shipping_address[0]
      : order.shipping_address;
    const state = addr?.state || 'Unknown';
    const city = addr?.city || 'Unknown';

    if (!byState[state]) byState[state] = { state, orders: 0, revenue: 0 };
    byState[state].orders += 1;
    byState[state].revenue += Number(order.total);

    const cityKey = `${city}, ${state}`;
    if (!byCity[cityKey]) byCity[cityKey] = { city, state, orders: 0, revenue: 0 };
    byCity[cityKey].orders += 1;
    byCity[cityKey].revenue += Number(order.total);
  }

  return {
    byState: Object.values(byState)
      .map(s => ({ ...s, revenue: Number(s.revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue),
    byCity: Object.values(byCity)
      .map(c => ({ ...c, revenue: Number(c.revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20),
  };
}

module.exports = {
  getBuyerDetail,
  getBuyersSummary,
  getGeoBreakdown,
  getProductBuyers,
  getTimeline,
};
