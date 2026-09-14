// src/services/email.js
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Send a single email.
 */
export const sendEmail = async ({ to_email, subject, message }) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS env vars missing. Check your .env file.');
  }
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { to_email, subject, message },
    { publicKey: PUBLIC_KEY }
  );
};

/**
 * Send the same email to many recipients.
 *
 * @param {{ subject: string, message: string }} content
 * @param {Array<{email: string}>} recipients
 * @param {(done: number, total: number, email: string) => void} [onProgress]
 * @returns {Promise<{ success: number, failed: Array<{ email: string, error: string }> }>}
 */
export const sendBulkEmail = async (content, recipients, onProgress) => {
  const results = { success: 0, failed: [] };
  const total = recipients.length;

  for (let i = 0; i < total; i++) {
    const recipient = recipients[i];
    try {
      await sendEmail({
        to_email: recipient.email,
        subject: content.subject,
        message: content.message,
      });
      results.success++;
    } catch (err) {
      results.failed.push({
        email: recipient.email,
        error: err?.text || err?.message || 'Unknown error',
      });
    }
    if (onProgress) onProgress(i + 1, total, recipient.email);

    // Small delay to avoid rate-limit hiccups (EmailJS: ~2 req/sec max)
    await new Promise((r) => setTimeout(r, 500));
  }

  return results;
};