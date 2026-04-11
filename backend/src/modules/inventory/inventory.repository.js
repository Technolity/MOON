const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

async function listInventory() {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('inventory')
    .select('id, sku, quantity, reserved, updated_at, products(id, name, slug, category, is_active)')
    .order('updated_at', { ascending: false });
  if (error) throw new ApiError(500, error.message);
  return data ?? [];
}

async function updateInventory(id, { quantity, reserved, sku }) {
  const db = getSupabaseAdminClient();
  const patch = {};
  if (quantity !== undefined) patch.quantity = quantity;
  if (reserved !== undefined) patch.reserved = reserved;
  if (sku !== undefined) patch.sku = sku;

  const { data, error } = await db
    .from('inventory')
    .update(patch)
    .eq('id', id)
    .select('id, sku, quantity, reserved, updated_at')
    .single();

  if (error) throw new ApiError(500, error.message);
  return data;
}

module.exports = { listInventory, updateInventory };
