import crypto from 'node:crypto';

/**
 * Signed order links.
 *
 * The order record still lives in the store, but the confirmation page must
 * never dead-end for someone who has just been told to transfer money. The
 * link therefore carries its own signed copy of the order: if the store has
 * the row we use it, if it does not we verify the signature and render from
 * the token. No customer ever sees a 404 after checkout.
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
  return (
    process.env.ORDER_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'kr8-order-link-secret'
  );
}

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function signOrder(o: OrderPayload): string {
  const payload = b64url(JSON.stringify(o));
  return `${payload}.${sign(payload)}`;
}

export function verifyOrder(token: string | undefined | null): OrderPayload | null {
  if (!token || !token.includes('.')) return null;
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
