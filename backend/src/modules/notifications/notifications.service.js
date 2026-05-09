const env = require('../../config/env');
const { getResendClient } = require('../../integrations/notifications/resend.client');
const ApiError = require('../../core/errors/api-error');

async function sendEmail({ to, subject, html, text }) {
  const resend = getResendClient();
  if (!resend) throw new ApiError(503, 'Email service not configured.');

  const { data, error } = await resend.emails.send({
    from: env.resend.fromEmail,
    to,
    subject,
    html: html || undefined,
    text: text || undefined
  });

  if (error) throw new ApiError(502, `Email delivery failed: ${error.message}`);
  return { id: data.id, to, subject };
}

async function sendOrderConfirmation({ to, orderNumber, total, items }) {
  const itemList = items
    .map(i => `<li>${i.productName} × ${i.quantity} — ₹${i.subtotal.toFixed(2)}</li>`)
    .join('');

  return sendEmail({
    to,
    subject: `Order Confirmed: ${orderNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order <strong>${orderNumber}</strong> has been confirmed.</p>
      <ul>${itemList}</ul>
      <p><strong>Total: ₹${total.toFixed(2)}</strong></p>
      <p>We will notify you once your order is shipped.</p>
    `
  });
}

async function sendAdminOrderAlert({ order, items, customerEmail, customerPhone, shippingAddress, total }) {
  const adminEmail = env.notifications?.adminEmail;
  if (!adminEmail) return;

  const addr = shippingAddress;
  const addressLines = [addr.line1, addr.line2, addr.city, addr.state, addr.postalCode, addr.country]
    .filter(Boolean).join(', ');

  const itemRows = items
    .map(i => `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee">${i.productName}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">₹${i.unitPrice.toFixed(2)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">₹${i.subtotal.toFixed(2)}</td>
    </tr>`)
    .join('');

  return sendEmail({
    to: adminEmail,
    subject: `🛍️ New Order: ${order.order_number} — ₹${total.toFixed(2)}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">New Order Received</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr><td style="color:#666;padding:4px 0">Order #</td><td><strong>${order.order_number}</strong></td></tr>
          <tr><td style="color:#666;padding:4px 0">Time</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
          <tr><td style="color:#666;padding:4px 0">Customer</td><td>${addr.full_name}</td></tr>
          <tr><td style="color:#666;padding:4px 0">Email</td><td>${customerEmail}</td></tr>
          <tr><td style="color:#666;padding:4px 0">Phone</td><td>${customerPhone}</td></tr>
          <tr><td style="color:#666;padding:4px 0">Ship To</td><td>${addressLines}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Product</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Unit</th>
              <th style="padding:8px;text-align:right">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:10px 8px;text-align:right;font-weight:bold">Total</td>
              <td style="padding:10px 8px;text-align:right;font-weight:bold">₹${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `
  });
}

async function sendSms() {
  // SMS via Twilio is not configured — handled manually via WhatsApp community.
  return { queued: false, reason: 'SMS not configured.' };
}

async function sendWhatsApp() {
  // WhatsApp handled manually via brand community channel.
  return { queued: false, reason: 'WhatsApp not configured.' };
}

module.exports = { sendEmail, sendOrderConfirmation, sendAdminOrderAlert, sendSms, sendWhatsApp };
