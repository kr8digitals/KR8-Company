import { NextResponse } from 'next/server';
import { getRates, guessCurrency } from '@/lib/rates';

export const revalidate = 21600;

export async function GET(req: Request) {
  const { rates, source, at } = await getRates();
  const country =
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('cf-ipcountry') ||
    null;
  return NextResponse.json(
    { rates, source, updatedAt: at, suggested: guessCurrency(country), country },
    { headers: { 'cache-control': 'public, max-age=1800, s-maxage=21600' } }
  );
}
