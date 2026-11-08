import { NextResponse } from 'next/server';
import { store, newId } from '@/lib/store';
import { getContextualChipsForPage, runRiyaTurn, type RiyaMemory } from '@/lib/riya-engine';
import { recordRiyaAdaptiveLearning } from '@/lib/riya-oss-ensemble';
import { sendMail, row, shell } from '@/lib/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* In-memory sliding-window rate limiter (protects site performance & prevents abuse) */
const rateBuckets = new Map<string, number[]>();
function allowRate(key: string, maxReq = 18, windowMs = 20_000): boolean {
  const now = Date.now();
  const prev = (rateBuckets.get(key) || []).filter((t) => now - t < windowMs);
  if (prev.length >= maxReq) {
    rateBuckets.set(key, prev);
    return false;
  }
  prev.push(now);
  rateBuckets.set(key, prev);
  if (rateBuckets.size > 2000) {
    const first = rateBuckets.keys().next().value;
    if (first) rateBuckets.delete(first);
  }
  return true;
}

function sanitizeVisitorId(v: unknown): string {
  const s = String(v || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return s.length >= 6 ? s : '';
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const visitorId = sanitizeVisitorId(u.searchParams.get('visitorId'));
  const since = u.searchParams.get('since') || '';
  const pagePath = (u.searchParams.get('pagePath') || '/').slice(0, 140);

  if (!visitorId) {
    return NextResponse.json({
      ok: true,
      messages: [],
      contextualChips: getContextualChipsForPage(pagePath),
    });
  }

  const [allMsgs, sessions] = await Promise.all([
    store.find('host_messages', { visitorId }, 120),
    store.find('host_sessions', { visitorId }, 1),
  ]);

  const ordered = allMsgs
    .slice()
    .reverse()
    .filter((m) => !since || m.createdAt > since)
    .map((m) => ({
      id: m.id,
      who: m.who,
      name: m.who === 'bot' ? 'RIYA' : m.name || (m.who === 'team' ? 'KR8 Team' : 'You'),
      text: m.text,
      links: m.links || [],
      submissionRef: m.submissionRef || undefined,
      createdAt: m.createdAt,
    }));

  const session = sessions[0] || null;

  return NextResponse.json({
    ok: true,
    agent: 'RIYA',
    messages: ordered,
    handoff: Boolean(session?.handoff),
    contextualChips: getContextualChipsForPage(pagePath),
  });
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anon';

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  const visitorId = sanitizeVisitorId(body.visitorId) || newId('vis_');
  if (!allowRate(`${ip}:${visitorId}`)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'rate_limited',
        reply: {
          say: "You're sending messages very quickly — give me just a few seconds and ask again.",
          chips: [],
          links: [],
        },
      },
      { status: 429 }
    );
  }

  const pagePath = String(body.page || body.pagePath || '/').slice(0, 160);
  const pageTitle = String(body.pageTitle || '').slice(0, 140);
  const activeSection = String(body.activeSection || '').slice(0, 120);
  const action = String(body.action || 'chat');

  // 1. Helpfulness rating feedback on a RIYA reply (drives Online Bandit Self-Learning!)
  if (action === 'rate') {
    const helpful = Boolean(body.helpful);
    const intentStr = String(body.intent || '').slice(0, 80);
    const ratingDoc = await store.insert('riya_feedback_ratings', {
      id: newId('rate_'),
      visitorId,
      messageId: String(body.messageId || '').slice(0, 64),
      helpful,
      intent: intentStr,
      pagePath,
    });
    await recordRiyaAdaptiveLearning({
      topicKey: intentStr.replace(/^kb_/, '').replace(/^ai_gateway_/, ''),
      reward: helpful ? 'positive' : 'negative',
    });
    return NextResponse.json({ ok: true, id: ratingDoc.id });
  }

  // 2. Privacy-respecting conversation memory reset
  if (action === 'clear_memory') {
    const existing = (await store.find('host_sessions', { visitorId }, 1))[0];
    if (existing) {
      await store.update('host_sessions', existing.id, {
        memory: {},
        handoff: false,
        clearedAt: new Date().toISOString(),
      });
    }
    return NextResponse.json({
      ok: true,
      cleared: true,
      contextualChips: getContextualChipsForPage(pagePath),
    });
  }

  // 3. Proactive prompt telemetry (impression / engaged / dismissed / muted)
  if (action === 'proactive_event') {
    await store.insert('events', {
      name: `riya_proactive_${String(body.state || 'shown').replace(/[^a-z_]/gi, '')}`,
      visitorId,
      path: pagePath,
      meta: {
        trigger: String(body.trigger || '').slice(0, 80),
        section: activeSection,
      },
    });
    return NextResponse.json({ ok: true });
  }

  // 4. Locate or initialize persistent visitor session + memory
  let session = (await store.find('host_sessions', { visitorId }, 1))[0];
  if (!session) {
    session = await store.insert('host_sessions', {
      id: newId('ses_'),
      visitorId,
      page: pagePath,
      lastPage: pagePath,
      qualifier: body.qualifier || 'start',
      handoff: false,
      turnCount: 0,
      memory: {} as RiyaMemory,
    });
  }

  const qualifier = body.qualifier ? String(body.qualifier).slice(0, 40) : undefined;
  const rawMessage = String(body.message || '').trim().slice(0, 1400);

  if (!qualifier && !rawMessage) {
    return NextResponse.json({ ok: false, error: 'Empty message' }, { status: 400 });
  }

  const recentStored = await store.find('host_messages', { visitorId }, 10);
  const history = recentStored
    .slice()
    .reverse()
    .map((m) => ({
      who: (m.who === 'you' ? 'you' : m.who === 'team' ? 'team' : 'bot') as 'you' | 'bot' | 'team',
      text: String(m.text || ''),
    }));

  if (rawMessage) {
    await store.insert('host_messages', {
      id: newId('msg_'),
      visitorId,
      sessionId: session.id,
      who: 'you',
      name: session.memory?.visitorName || 'Visitor',
      text: rawMessage,
      pagePath,
    });
  }

  const turn = await runRiyaTurn({
    message: rawMessage,
    qualifier,
    visitorId,
    sessionId: session.id,
    pagePath,
    pageTitle,
    activeSection,
    visitorActivity: String(body.visitorActivity || '').slice(0, 220),
    oidcToken: req.headers.get('x-vercel-oidc-token'),
    history,
    memory: (session.memory || {}) as RiyaMemory,
  });

  const botMsg = await store.insert('host_messages', {
    id: newId('msg_'),
    visitorId,
    sessionId: session.id,
    who: 'bot',
    name: 'RIYA',
    text: turn.say,
    links: turn.links,
    intent: turn.intent,
    topicKey: turn.topicKey,
    confidence: turn.confidence,
    submissionRef: turn.submissionRef,
    pagePath,
  });

  await store.update('host_sessions', session.id, {
    lastPage: pagePath,
    lastIntent: turn.intent,
    lastTopic: turn.topicKey,
    lastMessagePreview: (rawMessage || qualifier || '').slice(0, 120),
    turnCount: (Number(session.turnCount) || 0) + 1,
    memory: turn.memory,
    ...(turn.handoff ? { handoff: true } : {}),
  });

  await store.insert('events', {
    name: 'riya_turn',
    visitorId,
    path: pagePath,
    meta: {
      intent: turn.intent,
      topicKey: turn.topicKey,
      confidence: turn.confidence,
      submissionCategory: turn.submissionCategory || null,
      knowledgeGapLogged: Boolean(turn.knowledgeGapLogged),
    },
  });

  if (turn.handoff) {
    await sendMail({
      subject: `Live Visitor Escalation Requested via RIYA (${pagePath})`,
      html: shell(
        'Visitor requested live human assistance via RIYA',
        [
          row('Visitor Session', visitorId),
          row('Current Page', pagePath),
          row('Latest Message', rawMessage || '(qualifier)'),
          row('Known Contact', `${turn.memory.visitorName || 'Visitor'} · ${turn.memory.visitorEmail || turn.memory.visitorPhone || 'In chat'}`),
        ].join(''),
        'Open /admin -> RIYA Intelligence -> Live Conversations to reply directly inside the visitor widget.'
      ),
    });
  }

  return NextResponse.json({
    ok: true,
    visitorId,
    agent: 'RIYA',
    messageId: botMsg.id,
    reply: {
      say: turn.say,
      chips: turn.chips,
      links: turn.links,
      handoff: turn.handoff,
      intent: turn.intent,
      confidence: turn.confidence,
      submissionRef: turn.submissionRef,
      submissionCategory: turn.submissionCategory,
      kbVersion: turn.kbVersion,
    },
  });
}
