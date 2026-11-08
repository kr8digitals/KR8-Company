import { NextResponse } from 'next/server';
import { isAuthed, adminConfigured } from '@/lib/auth';
import { store, newId } from '@/lib/store';
import {
  RIYA_CATEGORY_LABELS,
  getRiyaKnowledgeSnapshot,
  syncRiyaKnowledgeBase,
  type RiyaCategory,
} from '@/lib/riya-knowledge';
import { probeLocalLlmStatus } from '@/lib/riya-local-llm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ ok: false, authed: false, error: 'locked' }, { status: 403 });
  if (!isAuthed(req)) return NextResponse.json({ ok: false, authed: false, error: 'unauthorised' }, { status: 401 });

  const [
    snap,
    runtimeStatus,
    customRecords,
    submissions,
    knowledgeGaps,
    syncLogs,
    ratings,
    securityEvents,
    sessions,
    messages,
    events,
  ] = await Promise.all([
    getRiyaKnowledgeSnapshot(),
    probeLocalLlmStatus(req.headers.get('x-vercel-oidc-token')),
    store.all('riya_kb_custom', 400),
    store.all('riya_submissions', 400),
    store.all('riya_knowledge_gaps', 400),
    store.all('riya_sync_log', 50),
    store.all('riya_feedback_ratings', 500),
    store.all('riya_security_events', 100),
    store.all('host_sessions', 300),
    store.all('host_messages', 800),
    store.all('events', 1000),
  ]);

  // Aggregate real visitor questions, interests, and page engagement
  const userMsgs = messages.filter((m) => m.who === 'you');
  const botMsgs = messages.filter((m) => m.who === 'bot');

  const byPage: Record<string, number> = {};
  const byTopic: Record<string, number> = {};
  const byIntent: Record<string, number> = {};
  const questionFreq: Record<string, { text: string; count: number; lastPage: string }> = {};

  for (const m of userMsgs) {
    const pg = m.pagePath || '/';
    byPage[pg] = (byPage[pg] || 0) + 1;
    const key = String(m.text || '').trim().toLowerCase().slice(0, 120);
    if (key.length >= 4) {
      if (!questionFreq[key]) {
        questionFreq[key] = { text: String(m.text).trim().slice(0, 140), count: 0, lastPage: pg };
      }
      questionFreq[key].count++;
    }
  }

  for (const m of botMsgs) {
    if (m.topicKey) byTopic[m.topicKey] = (byTopic[m.topicKey] || 0) + 1;
    if (m.intent) byIntent[m.intent] = (byIntent[m.intent] || 0) + 1;
  }

  const topQuestions = Object.values(questionFreq)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const helpfulCount = ratings.filter((r) => r.helpful).length;
  const unhelpfulCount = ratings.filter((r) => !r.helpful).length;
  const satisfactionPct =
    ratings.length > 0 ? Math.round((helpfulCount / ratings.length) * 100) : null;

  const proactiveFunnel = {
    shown: events.filter((e) => e.name === 'riya_proactive_shown').length,
    engaged: events.filter((e) => e.name === 'riya_proactive_engaged').length,
    dismissed: events.filter((e) => e.name === 'riya_proactive_dismissed').length,
    muted: events.filter((e) => e.name === 'riya_proactive_muted').length,
  };

  const categorySummary = Object.entries(RIYA_CATEGORY_LABELS).map(([slug, label]) => ({
    slug,
    label,
    count: snap.categoryCounts[slug] || 0,
  }));

  const byRoute: Record<string, number> = {};
  for (const p of snap.pagesAnalyzed) byRoute[p.route] = p.recordCount;

  return NextResponse.json({
    ok: true,
    runtime: runtimeStatus,
    knowledgeBase: {
      version: snap.version,
      syncedAt: snap.syncedAt,
      contentHash: snap.fingerprint.slice(0, 16),
      totalRecords: snap.records.length,
      totalDistinctQaPairs: snap.qaPairs.length,
      totalCategoriesActive: Object.values(snap.categoryCounts).filter((n) => n > 0).length,
      totalCategoriesDefined: Object.keys(RIYA_CATEGORY_LABELS).length,
      totalRoutesIndexed: snap.pagesAnalyzed.length,
      byCategory: categorySummary,
      byRoute,
      pagesAnalyzed: snap.pagesAnalyzed,
      sourceCounts: snap.sourceCounts,
      records: snap.records.map((r) => ({
        id: r.id,
        category: r.category,
        categoryLabel: r.categoryLabel,
        route: r.route,
        source: r.source,
        title: r.title,
        summary: r.summary,
        content: r.content,
        questionsCount: r.questions.length,
        sampleQuestions: r.questions.slice(0, 5),
        verifiedAt: r.verifiedAt,
        version: r.version,
      })),
      customRecords,
      syncLogs: syncLogs.slice(0, 20),
    },
    submissions,
    knowledgeGaps,
    conversations: {
      sessions,
      messages,
    },
    analytics: {
      totalSessions: sessions.length,
      totalUserMessages: userMsgs.length,
      totalRiyaReplies: botMsgs.length,
      activeEscalations: sessions.filter((s) => s.handoff).length,
      submissionsNew: submissions.filter((s) => s.status === 'new').length,
      complaintsCount: submissions.filter((s) =>
        ['complaint', 'registration_problem', 'technical_problem'].includes(s.category)
      ).length,
      suggestionsCount: submissions.filter((s) => s.category === 'suggestion').length,
      openGapsCount: knowledgeGaps.filter((g) => g.status === 'open').length,
      helpfulCount,
      unhelpfulCount,
      satisfactionPct,
      proactiveFunnel,
      byPage,
      byTopic,
      byIntent,
      topQuestions,
      securityBlocksCount: securityEvents.length,
      recentSecurityEvents: securityEvents.slice(0, 15),
    },
  });
}

export async function POST(req: Request) {
  if (!isAuthed(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.op) {
    return NextResponse.json({ ok: false, error: 'Missing operation' }, { status: 400 });
  }

  try {
    switch (body.op) {
      case 'kb.sync': {
        const res = await syncRiyaKnowledgeBase('manual_admin_sync');
        return NextResponse.json({ ok: true, sync: res });
      }

      case 'kb.snap_teach': {
        const fact = String(body.fact || '').trim();
        if (fact.length < 6) throw new Error('Enter at least a short sentence for RIYA to learn.');
        const route = String(body.route || '/').trim() || '/';
        const words = fact
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length >= 3)
          .slice(0, 14);
        const title = fact.split(/[.!?]/)[0].trim().slice(0, 72) || 'Snap-Taught Update';
        const saved = await store.insert('riya_kb_custom', {
          id: newId('kb_snap_'),
          category: 'frequently_asked_questions' as RiyaCategory,
          route,
          title,
          summary: fact.slice(0, 200),
          content: fact,
          audience: 'All website visitors',
          purpose: 'Instant Snap-Taught fact from Administrator',
          questions: [title],
          keywords: words,
          links: route !== '/' ? [{ label: 'Learn More', href: route }] : [],
          status: 'active',
        });
        const sync = await syncRiyaKnowledgeBase('admin_snap_teach');
        return NextResponse.json({ ok: true, doc: saved, sync });
      }

      case 'kb.save_custom': {
        const d = body.data || {};
        if (!d.title || !d.content) {
          throw new Error('Title and verified knowledge content are required.');
        }
        const targetId = d.id || newId('kb_adm_');
        const questions = Array.isArray(d.questions)
          ? d.questions
          : String(d.questions || '')
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
        const keywords = Array.isArray(d.keywords)
          ? d.keywords
          : String(d.keywords || '')
              .split(',')
              .map((s) => s.trim().toLowerCase())
              .filter(Boolean);

        const payload = {
          id: targetId,
          category: (d.category || 'frequently_asked_questions') as RiyaCategory,
          route: String(d.route || '/').trim() || '/',
          title: String(d.title).trim(),
          summary: String(d.summary || d.content).trim().slice(0, 200),
          content: String(d.content).trim(),
          audience: String(d.audience || 'All website visitors').trim(),
          purpose: String(d.purpose || 'Administrator-verified knowledge entry').trim(),
          questions,
          keywords,
          links: Array.isArray(d.links) ? d.links : [],
          status: d.status || 'active',
        };

        const existing = await store.findOne('riya_kb_custom', { id: targetId });
        const saved = existing
          ? await store.update('riya_kb_custom', targetId, payload)
          : await store.insert('riya_kb_custom', payload);

        const sync = await syncRiyaKnowledgeBase('admin_custom_kb_saved');
        return NextResponse.json({ ok: true, doc: saved, sync });
      }

      case 'kb.delete_custom': {
        if (!body.id) throw new Error('Missing record ID');
        await store.remove('riya_kb_custom', body.id);
        const sync = await syncRiyaKnowledgeBase('admin_custom_kb_deleted');
        return NextResponse.json({ ok: true, sync });
      }

      case 'gap.resolve_to_kb': {
        const { id, title, content, category, route } = body;
        if (!id || !content) throw new Error('Gap ID and verified answer are required.');
        const gap = await store.findOne('riya_knowledge_gaps', { id });
        if (!gap) throw new Error('Knowledge gap record not found');

        const kbDoc = await store.insert('riya_kb_custom', {
          id: newId('kb_gap_'),
          category: (category || 'frequently_asked_questions') as RiyaCategory,
          route: String(route || gap.pagePath || '/').trim(),
          title: String(title || gap.question).trim().slice(0, 140),
          summary: String(content).trim().slice(0, 200),
          content: String(content).trim(),
          audience: 'Visitors asking verified follow-up questions',
          purpose: 'Promoted from RIYA Knowledge Gap Queue after admin verification',
          questions: [String(gap.question).trim()],
          keywords: [],
          links: route ? [{ label: 'View Official Page', href: String(route).trim() }] : [],
          status: 'active',
        });

        await store.update('riya_knowledge_gaps', id, {
          status: 'resolved_to_kb',
          resolvedKbId: kbDoc.id,
          resolvedAt: new Date().toISOString(),
        });

        const sync = await syncRiyaKnowledgeBase('knowledge_gap_promoted');
        return NextResponse.json({ ok: true, kbDoc, sync });
      }

      case 'gap.dismiss': {
        if (!body.id) throw new Error('Missing gap ID');
        const updated = await store.update('riya_knowledge_gaps', body.id, {
          status: 'dismissed',
          adminNote: String(body.adminNote || '').slice(0, 300),
        });
        return NextResponse.json({ ok: true, doc: updated });
      }

      case 'submission.update': {
        if (!body.id) throw new Error('Missing submission ID');
        const patch = body.patch || {};
        const allowed: Record<string, any> = {};
        if ('status' in patch) allowed.status = patch.status;
        if ('priority' in patch) allowed.priority = patch.priority;
        if ('assignedTo' in patch) allowed.assignedTo = patch.assignedTo;
        if ('adminNotes' in patch) allowed.adminNotes = patch.adminNotes;
        if (patch.status === 'resolved') allowed.resolvedAt = new Date().toISOString();
        const updated = await store.update('riya_submissions', body.id, allowed);
        return NextResponse.json({ ok: true, doc: updated });
      }

      case 'conversation.reply': {
        const { visitorId, sessionId, text, senderName } = body;
        if (!visitorId || !String(text || '').trim()) {
          throw new Error('Visitor ID and message text are required.');
        }
        const doc = await store.insert('host_messages', {
          id: newId('msg_'),
          visitorId: String(visitorId),
          sessionId: sessionId ? String(sessionId) : undefined,
          who: 'team',
          name: String(senderName || 'KR8 DIGITALS Studio'),
          text: String(text).trim(),
        });
        return NextResponse.json({ ok: true, doc });
      }

      default:
        return NextResponse.json({ ok: false, error: `Unknown op: ${body.op}` }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Operation failed' }, { status: 400 });
  }
}
