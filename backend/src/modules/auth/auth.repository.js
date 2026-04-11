const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

async function findUserByEmail(email) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function findUserById(id) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('users')
    .select('id, email, phone, first_name, last_name, role, avatar_url, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function createUser({ email, passwordHash, phone, firstName, lastName }) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('users')
    .insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      phone: phone || null,
      first_name: firstName || null,
      last_name: lastName || null,
      role: 'customer'
    })
    .select('id, email, phone, first_name, last_name, role, created_at')
    .single();

  if (error) {
    if (error.code === '23505') throw new ApiError(409, 'Email already registered.');
    throw new ApiError(500, error.message);
  }
  return data;
}

module.exports = { createUser, findUserByEmail, findUserById };
