import { NextResponse } from 'next/server';
import { isAuthed, adminConfigured } from '@/lib/auth';
import { store } from '@/lib/store';
import {
  getCmsPages,
  getCmsServices,
  getCmsPrograms,
  getCmsTeam,
  getCmsPartners,
  getPartnerProposals,
  getCmsMedia,
  getCmsNavigation,
  getCmsSeoAll,
  getCmsRevisions,
} from '@/lib/cms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ ok: false, authed: false, error: 'locked' });
  if (!isAuthed(req)) return NextResponse.json({ ok: false, authed: false, error: 'unauthorised' });

  const [
    leads,
    referrals,
    commissions,
    host_sessions,
    host_messages,
    events,
    orders,
    settingsRows,
    pages,
    services,
    programs,
    teamBundle,
    partners,
    partner_proposals,
    mediaRaw,
    navigation,
    seo,
    revisions,
    riyaSubmissions,
    riyaGaps,
  ] = await Promise.all([
    store.all('leads', 400),
    store.all('referrals', 300),
    store.all('commissions', 400),
    store.all('host_sessions', 200),
    store.all('host_messages', 600),
    store.all('events', 800),
    store.all('orders', 200),
    store.find('settings', { id: 'site' }, 1),
    getCmsPages({ includeDrafts: true }),
    getCmsServices({ includeDrafts: true }),
    getCmsPrograms({ includeDrafts: true }),
    getCmsTeam({ includeDrafts: true }),
    getCmsPartners({ includeDrafts: true }),
    getPartnerProposals(),
    getCmsMedia({ includeArchived: true }),
    getCmsNavigation(),
    getCmsSeoAll(),
    getCmsRevisions(80),
    store.all('riya_submissions', 300),
    store.all('riya_knowledge_gaps', 300),
  ]);

  // Strip raw base64 payloads from list response so dashboard JSON stays lightweight
  const media = mediaRaw.map(({ dataBase64, ...rest }) => rest);

  const byName: Record<string, number> = {};
  for (const e of events) byName[e.name] = (byName[e.name] || 0) + 1;

  return NextResponse.json({
    ok: true,
    authed: true,
    settings: settingsRows[0]?.values || {},
    leads,
    referrals,
    commissions,
    host_sessions,
    host_messages,
    orders,
    cms: {
      pages,
      services,
      programs,
      team: teamBundle.all,
      partners,
      partner_proposals,
      media,
      navigation,
      seo,
      revisions,
    },
    analytics: { total: events.length, byName, recent: events.slice(0, 60) },
    counts: {
      leadsNew: leads.filter((l) => l.status === 'new').length,
      leadsTotal: leads.length,
      proposalsNew: partner_proposals.filter((p) => p.status === 'new').length,
      proposalsTotal: partner_proposals.length,
      referrers: referrals.length,
      pending: commissions.filter((c) => c.status === 'pending').length,
      handoffs: host_sessions.filter((s) => s.handoff).length,
      riyaSubmissionsNew: riyaSubmissions.filter((s) => s.status === 'new').length,
      riyaGapsOpen: riyaGaps.filter((g) => g.status === 'open').length,
      pagesPublished: pages.filter((p) => p.status === 'published').length,
      servicesPublished: services.filter((s: any) => s.status === 'published').length,
      programsActive: programs.filter((p: any) => p.visibility !== 'archived').length,
      teamCount: teamBundle.all.filter((m: any) => m.status === 'published').length,
      partnersCount: partners.filter((p: any) => p.status === 'published').length,
      mediaCount: media.filter((m) => m.status === 'active').length,
    },
  });
}
