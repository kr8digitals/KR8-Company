import { NextResponse } from 'next/server';
import { adminConfigured, isAuthed } from '@/lib/auth';
import { store } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function csvCell(value: unknown) {
  const text = value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!adminConfigured() || !isAuthed(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorised' }, { status: 401 });
  }
  const col = new URL(req.url).searchParams.get('col') || 'leads';
  if (col !== 'leads') return NextResponse.json({ ok: false, error: 'unsupported collection' }, { status: 400 });

  const rows = await store.all('leads', 4000);
  const columns = [
    'id', 'createdAt', 'status', 'type', 'kind', 'name', 'email', 'phone', 'organisation',
    'service', 'budget', 'projectTiming', 'role', 'experienceLevel', 'availability', 'portfolio',
    'partnerType', 'location', 'interest', 'siteId', 'message', 'ctaId', 'ctaLabel',
    'ctaSourcePath', 'ctaDestination', 'ctaCapturedAt', 'referrer', 'source',
  ];
  const lines = [columns.map(csvCell).join(','), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(','))];
  return new NextResponse(`\uFEFF${lines.join('\r\n')}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="kr8-lead-submissions.csv"',
      'cache-control': 'no-store',
    },
  });
}
