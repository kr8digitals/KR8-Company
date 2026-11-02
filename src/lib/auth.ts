import crypto from 'node:crypto';

/**
 * Admin auth.
 *
 * One password, held in ADMIN_PASSWORD, exchanged for an HMAC-signed cookie.
 * No password is ever stored in the repository and no session lives on the
 * client beyond an opaque token. If ADMIN_PASSWORD is unset the dashboard is
 * locked and says so — it does not fall back to a default password.
 */
export const COOKIE = 'kr8_admin';

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

function sign(value: string) {
  const secret = process.env.ADMIN_PASSWORD || 'unset';
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function issueToken() {
  const issued = Date.now().toString(36);
  const nonce = crypto.randomBytes(8).toString('hex');
  const payload = `${issued}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string | null) {
  if (!token || !adminConfigured()) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  if (expected.length !== parts[2].length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))) return false;
  const issued = parseInt(parts[0], 36);
  if (!Number.isFinite(issued)) return false;
  return Date.now() - issued < 12 * 60 * 60 * 1000; // 12 hours
}

export function isAuthed(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
  return verifyToken(match?.[1]);
}
