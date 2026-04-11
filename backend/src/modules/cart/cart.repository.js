const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

async function getCart({ userId, sessionId }) {
  const db = getSupabaseAdminClient();
  let query = db.from('carts').select('*');
  query = userId ? query.eq('user_id', userId) : query.eq('session_id', sessionId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function upsertCart({ userId, sessionId, items }) {
  const db = getSupabaseAdminClient();
  const now = new Date().toISOString();

  if (userId) {
    const { data, error } = await db
      .from('carts')
      .upsert({ user_id: userId, items, updated_at: now }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw new ApiError(500, error.message);
    return data;
  }

  const existing = await getCart({ sessionId });
  if (existing) {
    const { data, error } = await db
      .from('carts')
      .update({ items, updated_at: now })
      .eq('session_id', sessionId)
      .select()
      .single();
    if (error) throw new ApiError(500, error.message);
    return data;
  }

  const { data, error } = await db
    .from('carts')
    .insert({ session_id: sessionId, items })
    .select()
    .single();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function deleteCart({ userId, sessionId }) {
  const db = getSupabaseAdminClient();
  let query = db.from('carts').delete();
  query = userId ? query.eq('user_id', userId) : query.eq('session_id', sessionId);
  const { error } = await query;
  if (error) throw new ApiError(500, error.message);
}

module.exports = { deleteCart, getCart, upsertCart };
