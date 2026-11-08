import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await store.findOne('cms_media', { id });
  if (!item || !item.dataBase64) {
    return new NextResponse('Media not found', { status: 404 });
  }

  const cleanB64 = String(item.dataBase64).replace(/^data:[^;]+;base64,/, '');
  const buf = Buffer.from(cleanB64, 'base64');

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': item.mimeType || 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
