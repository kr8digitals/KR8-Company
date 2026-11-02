import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { adminConfigured, issueToken, COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 8;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (throttled(ip)) return NextResponse.json({ ok: false, error: 'Too many attempts. Wait ten minutes.' }, { status: 429 });

  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Admin is locked: set ADMIN_PASSWORD (8+ characters) in the environment and redeploy.' },
      { status: 503 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: '' }));
  const expected = process.env.ADMIN_PASSWORD!;
  const a = Buffer.from(String(password || ''));
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) return NextResponse.json({ ok: false, error: 'That password is not right.' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, issueToken(), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: 60 * 60 * 12,
  });
  return res;
}
