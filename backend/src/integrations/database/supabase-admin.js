const { createClient } = require('@supabase/supabase-js');

const env = require('../../config/env');

let supabaseAdminClient = null;

function getSupabaseAdminClient() {
  if (!env.supabase.url || !env.supabase.serviceRoleKey) {
    return null;
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  return supabaseAdminClient;
}

module.exports = {
  getSupabaseAdminClient
};
