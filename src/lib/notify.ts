import site from '../../data/site.json';

/**
 * Notifications.
 *
 * Email goes through Resend when RESEND_API_KEY is set. When it is not — local
 * development, preview builds — the submission is still stored and the request
 * still succeeds; we simply report `emailed: false` so the report is honest.
 * WhatsApp forwarding can be added by filling KR8_WHATSAPP_WEBHOOK without
 * touching any caller (Section 18: "build so WhatsApp forwarding can be wired in later").
 */
const FROM = process.env.RESEND_FROM || site.settings.notifications.resendFrom;
const TO = (process.env.KR8_ADMIN_EMAILS || site.company.email).split(',').map((s) => s.trim()).filter(Boolean);

export async function sendMail(opts: { subject: string; html: string; replyTo?: string; to?: string[] }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { emailed: false, reason: 'RESEND_API_KEY not configured' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: opts.to || TO,
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });
    if (!res.ok) return { emailed: false, reason: `resend ${res.status}` };
    return { emailed: true };
  } catch (e) {
    return { emailed: false, reason: 'network' };
  }
}

export async function forwardWhatsApp(payload: Record<string, unknown>) {
  const hook = process.env.KR8_WHATSAPP_WEBHOOK;
  if (!hook) return { forwarded: false };
  try {
    await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    return { forwarded: true };
  } catch {
    return { forwarded: false };
  }
}

export function row(k: string, v: unknown) {
  if (v === undefined || v === null || v === '') return '';
  return `<tr><td style="padding:6px 16px 6px 0;color:#8b7f9e;font:600 11px/1.4 system-ui;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#1a1526;font:400 14px/1.5 system-ui">${esc(String(v))}</td></tr>`;
}

export function shell(title: string, rows: string, foot = '') {
  return `<div style="background:#f4f1f8;padding:28px"><div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e3dced">
  <div style="background:linear-gradient(90deg,#ff2d9b,#7c3aed);padding:18px 24px;color:#fff;font:800 17px/1.2 system-ui">KR8 Digitals</div>
  <div style="padding:24px"><h1 style="margin:0 0 16px;font:800 21px/1.3 system-ui;color:#120a24">${esc(title)}</h1>
  <table style="border-collapse:collapse;width:100%">${rows}</table>
  ${foot ? `<p style="margin:18px 0 0;color:#6b6478;font:400 13px/1.6 system-ui">${foot}</p>` : ''}
  </div></div></div>`;
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
