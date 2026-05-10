const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');
const { enrichWithFallbackImages } = require('./product-fallback-images');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function listProducts({ category, theme, limit = 50 } = {}) {
  const db = getSupabaseAdminClient();
  let query = db
    .from('products')
    .select(
      'id, name, slug, description, price, discount_price, image_url, images, category, theme, meta_title, meta_description, inventory(quantity, reserved)'
    )
    .eq('is_active', true)
    .order('name');

  if (category) query = query.eq('category', category);
  if (theme) query = query.eq('theme', theme);
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  return enrichWithFallbackImages((data ?? []).map(p => {
    const inv = Array.isArray(p.inventory) ? p.inventory[0] : p.inventory;
    const available = inv ? (inv.quantity - inv.reserved) : null;
    const inStock = available === null ? true : available > 0;
    delete p.inventory;
    return { ...p, inStock, stockCount: available ?? undefined };
  }));
}

async function findProductById(id) {
  const db = getSupabaseAdminClient();
  const column = UUID_RE.test(id) ? 'id' : 'slug';

  const { data, error } = await db
    .from('products')
    .select('*, inventory(quantity, reserved, sku)')
    .eq(column, id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);
  if (!data) return null;

  const inv = Array.isArray(data.inventory) ? data.inventory[0] : data.inventory;
  data.inStock = inv ? (inv.quantity - inv.reserved > 0) : true;

  return enrichWithFallbackImages(data);
}

async function searchProducts({ q, limit = 20 } = {}) {
  const db = getSupabaseAdminClient();
  const term = `%${q}%`;

  const { data, error } = await db
    .from('products')
    .select('id, name, slug, description, price, discount_price, image_url, images, category, theme, inventory(quantity, reserved)')
    .eq('is_active', true)
    .or(`name.ilike.${term},description.ilike.${term}`)
    .limit(limit);

  if (error) throw new ApiError(500, error.message);

  return enrichWithFallbackImages((data ?? []).map(p => {
    const inv = Array.isArray(p.inventory) ? p.inventory[0] : p.inventory;
    const available = inv ? (inv.quantity - inv.reserved) : null;
    const inStock = available === null ? true : available > 0;
    delete p.inventory;
    return { ...p, inStock, stockCount: available ?? undefined };
  }));
}

async function findProductsByIds(ids) {
  if (!ids.length) return [];
  const db = getSupabaseAdminClient();

  const { data, error } = await db
    .from('products')
    .select('id, name, price, discount_price, is_active, inventory(quantity, reserved)')
    .in('id', ids)
    .eq('is_active', true);

  if (error) throw new ApiError(500, error.message);
  return data ?? [];
}

async function adminListProducts({ limit = 100, offset = 0 } = {}) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('products')
    .select('id, name, slug, description, price, discount_price, image_url, images, category, theme, meta_title, meta_description, is_active, created_at, updated_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new ApiError(500, error.message);
  return enrichWithFallbackImages(data ?? []);
}

async function adminCreateProduct(fields) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('products')
    .insert(fields)
    .select()
    .single();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function adminUpdateProduct(id, fields) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('products')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, 'Product not found.');
  return data;
}

async function adminDeleteProduct(id) {
  const db = getSupabaseAdminClient();
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) throw new ApiError(500, error.message);
}

module.exports = {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
  findProductById,
  findProductsByIds,
  listProducts,
  searchProducts,
};
