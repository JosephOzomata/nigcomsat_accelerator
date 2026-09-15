import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendEmail = async ({ to_email, subject, message, image_url }) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS env vars missing. Check your .env file.');
  }

  // Build optional image HTML block that the template can insert
  const image_block = image_url
    ? `<div style="margin: 24px 0; text-align: center;"><img src="${image_url}" alt="" style="max-width: 100%; height: auto; border-radius: 8px;" /></div>`
    : '';

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { to_email, subject, message, image_block, image_url: image_url || '' },
    { publicKey: PUBLIC_KEY }
  );
};

export const sendBulkEmail = async (content, recipients, onProgress) => {
  const results = { success: 0, failed: [] };
  const total = recipients.length;

  for (let i = 0; i < total; i++) {
    const recipient = recipients[i];
    try {
      await sendEmail({ to_email: recipient.email, ...content });
      results.success++;
    } catch (err) {
      results.failed.push({
        email: recipient.email,
        error: err?.text || err?.message || 'Unknown error',
      });
    }
    if (onProgress) onProgress(i + 1, total, recipient.email);
    await new Promise((r) => setTimeout(r, 500));
  }

  return results;
};