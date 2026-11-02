import { NextResponse } from 'next/server';
import { store, newId } from '@/lib/store';

export const runtime = 'nodejs';

// First-party analytics. We store the event name, the path and coarse props.
// No cookies, no identifiers beyond a session-scoped random id, no IP retention.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = Array.isArray(body?.events) ? body.events.slice(0, 25) : [];
    const country = req.headers.get('x-vercel-ip-country') || '';
    for (const e of events) {
      if (typeof e?.name !== 'string') continue;
      await store.insert('events', {
        id: newId('ev_'),
        name: e.name.slice(0, 60),
        path: String(e.path || '').slice(0, 200),
        props: typeof e.props === 'object' && e.props ? e.props : {},
        country,
      });
    }
  } catch {
    /* analytics must never throw to the client */
  }
  return new NextResponse(null, { status: 204 });
}
