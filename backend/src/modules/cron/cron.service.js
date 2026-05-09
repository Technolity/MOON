const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const { sendEmail } = require('../notifications/notifications.service');
const env = require('../../config/env');
const ApiError = require('../../core/errors/api-error');

async function weeklyDigest(req) {
  const secret = req.headers['x-cron-secret'];
  if (!env.cron.secret || secret !== env.cron.secret) {
    throw new ApiError(401, 'Unauthorized.');
  }

  const supabase = getSupabaseAdminClient();

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name, price, discount_price, slug, description')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (prodError) throw new ApiError(500, 'Could not fetch products.');

  const { data: subscribers, error: subError } = await supabase
    .from('newsletter_subscribers')
    .select('email, name')
    .eq('is_active', true);

  if (subError) throw new ApiError(500, 'Could not fetch subscribers.');
  if (!subscribers.length) return { sent: 0, failed: 0, total: 0 };

  const productCards = products.map(p => {
    const price = p.discount_price ?? p.price;
    return `
      <div style="border:1px solid #e8e0d5;border-radius:8px;padding:16px;margin-bottom:12px">
        <h3 style="margin:0 0 6px;color:#1a1a1a">${p.name}</h3>
        <p style="margin:0 0 8px;color:#666;font-size:14px">${p.description || ''}</p>
        <strong style="color:#D2571B">₹${Number(price).toFixed(2)}</strong>
      </div>`;
  }).join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#FAF6EF;padding:32px 24px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:28px;color:#1a1a1a">This Week at MOON</h1>
        <p style="color:#666;margin:8px 0 0">Our featured products, just for you.</p>
      </div>
      <div style="padding:24px">${productCards}</div>
      <div style="padding:16px 24px;background:#f5f0e8;text-align:center;font-size:12px;color:#888;border-radius:0 0 8px 8px">
        You're receiving this because you subscribed to MOON updates.<br>
        <a href="${env.app.storefrontUrl}/newsletter/unsubscribe" style="color:#D2571B">Unsubscribe</a>
      </div>
    </div>`;

  const results = await Promise.allSettled(
    subscribers.map(s => sendEmail({
      to: s.email,
      subject: '🌙 This Week at MOON — New Arrivals & Favourites',
      html
    }))
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  return { sent, failed, total: subscribers.length };
}

module.exports = { weeklyDigest };
