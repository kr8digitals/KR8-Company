import { NextResponse } from 'next/server';
import { store, newId } from '@/lib/store';
import { sendMail, forwardWhatsApp, row, shell } from '@/lib/notify';

export const runtime = 'nodejs';

const TYPES = ['quote', 'buy-site', 'partner', 'team', 'contact', 'host-handoff', 'mindshift', 'tribe'] as const;
type LeadType = (typeof TYPES)[number];

const LIMIT = 6; // submissions per IP per 10 minutes
const WINDOW = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > LIMIT;
}

function clean(v: unknown, max = 2000) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
}

const LABEL: Record<LeadType, string> = {
  quote: 'New quote request',
  'buy-site': 'Site purchase request',
  partner: 'Partnership enquiry',
  team: 'Team application',
  contact: 'Contact message',
  'host-handoff': 'Host handoff — visitor asked for a person',
  mindshift: 'Mindset Shift invitation request',
  tribe: 'Tribe waitlist',
};

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many submissions. Please try again in a few minutes.' }, { status: 429 });
  }

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // honeypot: bots fill hidden fields, humans never see them
  if (body._hp) return NextResponse.json({ ok: true, id: 'ignored' });

  const type = (TYPES as readonly string[]).includes(body.type) ? (body.type as LeadType) : null;
  if (!type) return NextResponse.json({ ok: false, error: 'Unknown request type.' }, { status: 400 });

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 4000);

  if (name.length < 2) return NextResponse.json({ ok: false, error: 'Please tell us your name.' }, { status: 422 });
  if (email && !validEmail(email)) return NextResponse.json({ ok: false, error: 'That email address does not look right.' }, { status: 422 });
  if (!email && !phone) return NextResponse.json({ ok: false, error: 'Add an email or a phone number so we can reply.' }, { status: 422 });
  if (type === 'quote' && message.length < 12) {
    return NextResponse.json({ ok: false, error: 'Tell us a little about the project — a sentence is enough.' }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: 'Please accept the privacy notice so we can store and reply to this.' }, { status: 422 });
  }

  const record = {
    id: newId('ld_'),
    type,
    name,
    email,
    phone,
    organisation: clean(body.organisation, 160),
    service: clean(body.service, 120),
    budget: clean(body.budget, 60),
    role: clean(body.role, 120),
    portfolio: clean(body.portfolio, 300),
    partnerType: clean(body.partnerType, 80),
    siteId: clean(body.siteId, 80),
    message,
    status: 'new' as const,
    assignee: '',
    notes: '',
    source: clean(body.source, 80) || 'site',
    referrer: clean(body.referrer, 120),
    ip,
    ua: clean(req.headers.get('user-agent') || '', 300),
  };

  const saved = await store.insert('leads', record);

  // If this arrived through a referral link, attach it to the referrer's ledger.
  const refCode = clean(body.ref, 40);
  if (refCode) {
    const referrer = await store.findOne('referrals', { code: refCode });
    if (referrer) {
      await store.insert('commissions', {
        id: newId('cm_'),
        referralId: referrer.id,
        referrerCode: refCode,
        leadId: saved.id,
        leadName: name,
        type: record.service || record.type,
        valueUsd: Number(body.valueUsd) || 0,
        status: 'pending', // pending → earned only when admin confirms payment
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await store.update('referrals', referrer.id, { lastLeadAt: new Date().toISOString() });
    }
  }

  const rows = [
    row('Type', LABEL[type]),
    row('Name', name),
    row('Email', email),
    row('Phone', phone),
    row('Organisation', record.organisation),
    row('Service', record.service),
    row('Budget', record.budget),
    row('Role', record.role),
    row('Portfolio', record.portfolio),
    row('Partner type', record.partnerType),
    row('Referring site', record.siteId),
    row('Referral code', refCode),
    row('Message', message),
  ].join('');

  const mail = await sendMail({
    subject: `${LABEL[type]} — ${name}`,
    html: shell(LABEL[type], rows, `Submitted ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} WAT · ID ${saved.id}`),
    replyTo: email || undefined,
  });

  await forwardWhatsApp({ type, name, phone, message, id: saved.id });

  return NextResponse.json({
    ok: true,
    id: saved.id,
    emailed: mail.emailed,
    message:
      type === 'team'
        ? 'Application received. We read every one — you will hear back either way.'
        : 'Sent. The team replies within one working day — usually sooner.',
  });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed' }, { status: 405 });
}
