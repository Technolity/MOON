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

module.exports = { findZoneByState, listZones };
