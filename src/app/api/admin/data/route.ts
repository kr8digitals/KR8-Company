import { NextResponse } from 'next/server';
import { isAuthed, adminConfigured } from '@/lib/auth';
import { store } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Deliberately 200 with a state flag: an unauthenticated dashboard should not
  // spray 401s into the console on every visit.
  if (!adminConfigured()) return NextResponse.json({ ok: false, authed: false, error: 'locked' });
  if (!isAuthed(req)) return NextResponse.json({ ok: false, authed: false, error: 'unauthorised' });

  const [leads, referrals, commissions, host_sessions, host_messages, events, orders] = await Promise.all([
    store.all('leads', 400),
    store.all('referrals', 300),
    store.all('commissions', 400),
    store.all('host_sessions', 200),
    store.all('host_messages', 600),
    store.all('events', 800),
    store.all('orders', 200),
  ]);

  const byName: Record<string, number> = {};
  for (const e of events) byName[e.name] = (byName[e.name] || 0) + 1;

  return NextResponse.json({
    ok: true,
    driver: store.driver(),
    leads, referrals, commissions, host_sessions, host_messages, orders,
    analytics: { total: events.length, byName, recent: events.slice(0, 60) },
    counts: {
      leadsNew: leads.filter((l) => l.status === 'new').length,
      leadsTotal: leads.length,
      referrers: referrals.length,
      pending: commissions.filter((c) => c.status === 'pending').length,
      handoffs: host_sessions.filter((s) => s.handoff).length,
    },
  });
}
