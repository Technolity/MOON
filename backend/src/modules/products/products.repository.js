const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function listProducts({ category, theme, limit = 50 } = {}) {
  const db = getSupabaseAdminClient();
  let query = db
    .from('products')
    .select(
      'id, name, slug, description, price, discount_price, image_url, category, theme, meta_title, meta_description'
    )
    .eq('is_active', true)
    .order('name');

  if (category) query = query.eq('category', category);
  if (theme) query = query.eq('theme', theme);
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);
  return data ?? [];
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
  return data;
}

async function searchProducts({ q, limit = 20 } = {}) {
  const db = getSupabaseAdminClient();
  const term = `%${q}%`;

  const { data, error } = await db
    .from('products')
    .select('id, name, slug, description, price, discount_price, image_url, category, theme')
    .eq('is_active', true)
    .or(`name.ilike.${term},description.ilike.${term}`)
    .limit(limit);

  if (error) throw new ApiError(500, error.message);
  return data ?? [];
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

module.exports = { findProductById, findProductsByIds, listProducts, searchProducts };
