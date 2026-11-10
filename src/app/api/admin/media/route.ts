import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthed } from '@/lib/auth';
import { store, newId } from '@/lib/store';
import { getCmsMedia } from '@/lib/cms';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export async function POST(req: Request) {
  if (!isAuthed(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorised' }, { status: 401 });
  }

  try {
    await getCmsMedia({ includeArchived: true });
    const body = await req.json();
    const { action } = body;

    if (action === 'upload') {
      const { title, alt, category, mimeType, dataBase64, replaceId } = body;
      if (!mimeType || !ALLOWED_TYPES.has(mimeType)) {
        return NextResponse.json(
          { ok: false, error: 'Unsupported file type. Upload PNG, JPG, WEBP, or GIF.' },
          { status: 400 }
        );
      }
      if (!dataBase64 || String(dataBase64).length > 2_600_000) {
        return NextResponse.json(
          { ok: false, error: 'File too large (max ~1.9 MB).' },
          { status: 400 }
        );
      }

      const id = replaceId || newId('med_');
      const url = `/api/media/${id}?v=${Date.now().toString(36)}`;

      const existing = replaceId ? await store.findOne('cms_media', { id: replaceId }) : null;
      let saved;
      if (existing) {
        saved = await store.update('cms_media', id, {
          title: title || existing.title,
          alt: alt ?? existing.alt,
          category: category || existing.category,
          mimeType,
          url,
          dataBase64,
          status: 'active',
        });
      } else {
        saved = await store.insert('cms_media', {
          id,
          title: title || 'Uploaded Media',
          alt: alt || title || 'KR8 DIGITALS media asset',
          category: category || 'uploads',
          mimeType,
          url,
          dataBase64,
          status: 'active',
        });
      }

      revalidatePath('/', 'layout');
      const { dataBase64: _omit, ...clean } = saved as any;
      return NextResponse.json({ ok: true, doc: clean });
    }

    if (action === 'update' && body.id) {
      const saved = await store.update('cms_media', body.id, {
        title: body.title,
        alt: body.alt,
        category: body.category,
        status: body.status || 'active',
      });
      revalidatePath('/', 'layout');
      const { dataBase64: _omit, ...clean } = (saved || {}) as any;
      return NextResponse.json({ ok: true, doc: clean });
    }

    if (action === 'delete' && body.id) {
      await store.remove('cms_media', body.id);
      revalidatePath('/', 'layout');
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: 'Invalid media action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Media operation failed' }, { status: 400 });
  }
}
