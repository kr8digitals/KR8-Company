import crypto from 'node:crypto';

/** Signed private order links. Customer details remain in PostgreSQL, not URLs.
 * A signed snapshot is not a substitute for a durable, authoritative order row.
 */

export type OrderPayload = {
  id: string;
  reference: string;
  item: string;
  amountUsd: number;
  amountNgn: number;
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  createdAt: string;
};

function secret() {
  const value = process.env.ORDER_SECRET || process.env.ADMIN_PASSWORD;
  if (!value || value.length < 32) throw new Error('Set ORDER_SECRET to at least 32 random characters.');
  return value;
}

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function signOrder(o: OrderPayload): string {
  const { name: _name, email: _email, phone: _phone, note: _note, ...publicOrder } = o;
  const payload = b64url(JSON.stringify(publicOrder));
  return `${payload}.${sign(payload)}`;
}

export function verifyOrder(token: string | undefined | null): OrderPayload | null {
  if (!token || token.split('.').length !== 2) return null;
  const [payload, mac] = token.split('.');
  if (!payload || !mac) return null;
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed?.reference || !parsed?.item || !Number.isFinite(parsed?.amountUsd)) return null;
    return parsed as OrderPayload;
  } catch {
    return null;
  }
}
