const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

function dateFilter(query, column, dateFrom, dateTo) {
  if (dateFrom) query = query.gte(column, dateFrom);
  if (dateTo) query = query.lte(column, dateTo);
  return query;
}

async function getDashboardSummary({ dateFrom, dateTo } = {}) {
  const db = getSupabaseAdminClient();

  let ordersQuery = db
    .from('orders')
    .select('id, total, status', { count: 'exact' });
  ordersQuery = dateFilter(ordersQuery, 'created_at', dateFrom, dateTo);
  const { data: orders, error: ordersErr } = await ordersQuery;
  if (ordersErr) throw new ApiError(500, ordersErr.message);

  const totalOrders = orders?.length ?? 0;
  const revenue = orders
    ?.filter(o => ['confirmed', 'packed', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  const { count: totalCustomers, error: custErr } = await db
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'customer');
  if (custErr) throw new ApiError(500, custErr.message);

  const { data: lowStock, error: stockErr } = await db
    .from('inventory')
    .select('id', { count: 'exact' })
    .lt('quantity', 10);
  if (stockErr) throw new ApiError(500, stockErr.message);

  return {
    totalOrders,
    revenue: Number(revenue.toFixed(2)),
    totalCustomers: totalCustomers ?? 0,
    lowStockCount: lowStock?.length ?? 0
  };
}

async function getOrderMetrics({ dateFrom, dateTo } = {}) {
  const db = getSupabaseAdminClient();
  let query = db.from('orders').select('id, status, created_at');
  query = dateFilter(query, 'created_at', dateFrom, dateTo);
  const { data, error } = await query.order('created_at');
  if (error) throw new ApiError(500, error.message);

  const byStatus = (data ?? []).reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return { total: data?.length ?? 0, byStatus };
}

async function getRevenueMetrics({ dateFrom, dateTo } = {}) {
  const db = getSupabaseAdminClient();
  let query = db
    .from('orders')
    .select('id, total, status, created_at')
    .in('status', ['confirmed', 'packed', 'shipped', 'delivered']);
  query = dateFilter(query, 'created_at', dateFrom, dateTo);
  const { data, error } = await query.order('created_at');
  if (error) throw new ApiError(500, error.message);

  const orders = data ?? [];
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const aov = orders.length ? totalRevenue / orders.length : 0;

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    averageOrderValue: Number(aov.toFixed(2)),
    orderCount: orders.length
  };
}

async function getCustomerMetrics({ dateFrom, dateTo } = {}) {
  const db = getSupabaseAdminClient();
  let query = db.from('users').select('id, created_at').eq('role', 'customer');
  query = dateFilter(query, 'created_at', dateFrom, dateTo);
  const { data, error } = await query.order('created_at');
  if (error) throw new ApiError(500, error.message);

  return { newCustomers: data?.length ?? 0 };
}

async function getProductMetrics({ dateFrom, dateTo, limit = 10 } = {}) {
  const db = getSupabaseAdminClient();
  let query = db
    .from('order_items')
    .select('product_id, product_name, quantity, subtotal, orders!inner(status, created_at)')
    .in('orders.status', ['confirmed', 'packed', 'shipped', 'delivered']);
  if (dateFrom) query = query.gte('orders.created_at', dateFrom);
  if (dateTo) query = query.lte('orders.created_at', dateTo);
  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  const byProduct = (data ?? []).reduce((acc, item) => {
    const key = item.product_id;
    if (!acc[key]) {
      acc[key] = { productId: key, productName: item.product_name, unitsSold: 0, revenue: 0 };
    }
    acc[key].unitsSold += item.quantity;
    acc[key].revenue += Number(item.subtotal);
    return acc;
  }, {});

  return Object.values(byProduct)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit)
    .map(p => ({ ...p, revenue: Number(p.revenue.toFixed(2)) }));
}

module.exports = { getCustomerMetrics, getDashboardSummary, getOrderMetrics, getProductMetrics, getRevenueMetrics };
