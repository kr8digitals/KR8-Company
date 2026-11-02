import { NextResponse } from 'next/server';
import { reply, openers, type HostState } from '@/lib/host-brain';
import { store, newId } from '@/lib/store';
import { sendMail, row, shell } from '@/lib/notify';

export const runtime = 'nodejs';

const WINDOW = 60 * 1000;
const MAX_PER_MIN = 14;
const MAX_LEN = 600;
const hits = new Map<string, number[]>();

function limited(key: string) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < WINDOW);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 8000) hits.clear();
  return arr.length > MAX_PER_MIN;
}

const QUAL: Record<string, HostState> = {
  business: 'business', learner: 'learner', job: 'job', community: 'community', exploring: 'exploring',
};

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate', say: "Let's take a breath — try again in a minute, or message the team on WhatsApp.", chips: [], state: 'start' }, { status: 429 });
  }

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 }); }

  const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_LEN) : '';
  const state: HostState = (body.state as HostState) || 'start';
  const qualifier = typeof body.qualifier === 'string' ? body.qualifier : '';
  let visitorId = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 40) : '';

  if (!visitorId) visitorId = newId('v_');

  // A session is created once per visitor and updated as the conversation moves.
  let session = await store.findOne('host_sessions', { visitorId });
  if (!session) {
    session = await store.insert('host_sessions', {
      id: newId('hs_'), visitorId, state: qualifier || state, name: '', country: req.headers.get('x-vercel-ip-country') || '',
      messages: 0, handoff: false,
    });
  }

  let out;
  if (qualifier && QUAL[qualifier]) {
    out = openers(QUAL[qualifier]);
  } else if (!message) {
    out = openers('start');
  } else {
    out = reply(message, { state, name: body.name });
  }

  await store.insert('host_messages', {
    id: newId('hm_'), visitorId, sessionId: session.id,
    who: 'visitor', text: message || `[${qualifier || 'opened'}]`,
  });
  await store.insert('host_messages', {
    id: newId('hm_'), visitorId, sessionId: session.id, who: 'host', text: out.say,
  });
  await store.update('host_sessions', session.id, {
    state: out.state,
    messages: ((session.messages as number) || 0) + 2,
    handoff: Boolean(out.handoff) || Boolean(session.handoff),
    lastAt: new Date().toISOString(),
  });

  if (out.handoff) {
    await sendMail({
      subject: 'Host handoff — a visitor asked for a person',
      html: shell('Host handoff', [
        row('Visitor', visitorId),
        row('Last thing they said', message),
        row('Conversation state', out.state),
        row('Time', new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })),
      ].join(''), 'Open the dashboard to reply inside the same chat.'),
    });
  }

  return NextResponse.json({ ...out, visitorId, sessionId: session.id });
}

export async function GET(req: Request) {
  // The visitor polls this to see whether a team member has joined the chat.
  const url = new URL(req.url);
  const visitorId = url.searchParams.get('visitorId') || '';
  if (!visitorId) return NextResponse.json({ ok: false }, { status: 400 });
  const msgs = await store.find('host_messages', { visitorId, who: 'team' }, 50);
  return NextResponse.json({ ok: true, messages: msgs.map((m) => ({ id: m.id, text: m.text, name: m.name || 'KR8 team', at: m.createdAt })) });
}
