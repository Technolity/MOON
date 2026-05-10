const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

async function listZones() {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('shipping_zones')
    .select('id, zone_name, states, cost, estimated_days')
    .eq('is_active', true)
    .order('cost');
  if (error) throw new ApiError(500, error.message);
  return data ?? [];
}

async function findZoneByState(state) {
  const db = getSupabaseAdminClient();
  // states is a text[] column; use the contains operator
  const { data, error } = await db
    .from('shipping_zones')
    .select('id, zone_name, states, cost, estimated_days')
    .eq('is_active', true)
    .contains('states', [state]);

  if (error) throw new ApiError(500, error.message);
  return data?.[0] ?? null;
}

async function updateZone(id, { cost, estimatedDays }) {
  const db = getSupabaseAdminClient();
  const patch = {};
  if (cost !== undefined) patch.cost = Number(cost);
  if (estimatedDays !== undefined) patch.estimated_days = Number(estimatedDays);
  const { data, error } = await db
    .from('shipping_zones')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, zone_name, states, cost, estimated_days, is_active')
    .single();
  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, 'Shipping zone not found.');
  return data;
}

module.exports = { findZoneByState, listZones, updateZone };
