// backend/utils/sendEmail.js
// Sends email through Brevo's HTTPS API. (Render's free plan blocks SMTP ports, so
// nodemailer/Gmail SMTP would time out in production; an HTTPS API always works.)
// If BREVO_API_KEY / EMAIL_FROM are not set, nothing is sent and { delivered:false } is returned.
export async function sendEmail({ to, toName, subject, html, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.log('📧 Email is not configured (set BREVO_API_KEY and EMAIL_FROM). Email NOT sent to', to);
    return { delivered: false };
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: process.env.EMAIL_FROM_NAME || 'ACADEXA', email: from },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }
  return { delivered: true };
}
