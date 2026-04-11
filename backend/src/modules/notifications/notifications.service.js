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

async function sendSms() {
  // SMS via Twilio is not configured — handled manually via WhatsApp community.
  return { queued: false, reason: 'SMS not configured.' };
}

async function sendWhatsApp() {
  // WhatsApp handled manually via brand community channel.
  return { queued: false, reason: 'WhatsApp not configured.' };
}

module.exports = { sendEmail, sendOrderConfirmation, sendSms, sendWhatsApp };
