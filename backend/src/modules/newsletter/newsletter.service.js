const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const { sendEmail } = require('../notifications/notifications.service');
const ApiError = require('../../core/errors/api-error');

async function subscribe({ email, name }) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email, name, is_active: true }, { onConflict: 'email' });

  if (error) throw new ApiError(500, 'Could not subscribe. Please try again.');
  return { subscribed: true, email };
}

async function unsubscribe({ email }) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ is_active: false })
    .eq('email', email);

  if (error) throw new ApiError(500, 'Could not unsubscribe. Please try again.');
  return { unsubscribed: true, email };
}

async function listSubscribers() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, name, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new ApiError(500, 'Could not fetch subscribers.');
  return data;
}

async function broadcast({ subject, html }) {
  const supabase = getSupabaseAdminClient();
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('is_active', true);

  if (error) throw new ApiError(500, 'Could not fetch subscribers.');
  if (!subscribers.length) return { sent: 0, failed: 0 };

  const results = await Promise.allSettled(
    subscribers.map(s => sendEmail({ to: s.email, subject, html }))
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  return { sent, failed, total: subscribers.length };
}

module.exports = { subscribe, unsubscribe, listSubscribers, broadcast };
