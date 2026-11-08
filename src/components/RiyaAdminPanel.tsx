'use client';

import { useCallback, useEffect, useState } from 'react';

type SubTab = 'analytics' | 'submissions' | 'knowledge' | 'gaps' | 'conversations';

export default function RiyaAdminPanel({ onToast }: { onToast: (msg: string, tone?: 'ok' | 'err') => void }) {
  const [subTab, setSubTab] = useState<SubTab>('analytics');
  const [payload, setPayload] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Knowledge Explorer filters & custom entry editor
  const [kbQuery, setKbQuery] = useState('');
  const [kbCategory, setKbCategory] = useState('all');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customDraft, setCustomDraft] = useState({
    id: '',
    title: '',
    category: 'frequently_asked_questions',
    route: '/',
    content: '',
    questions: '',
    keywords: '',
  });

  // Submissions filter
  const [subFilter, setSubFilter] = useState<'all' | 'complaints' | 'suggestions' | 'feedback'>('all');

  // Gap resolution form
  const [resolvingGapId, setResolvingGapId] = useState<string | null>(null);
  const [gapTitle, setGapTitle] = useState('');
  const [gapAnswer, setGapAnswer] = useState('');
  const [gapCategory, setGapCategory] = useState('frequently_asked_questions');
  const [gapRoute, setGapRoute] = useState('/');

  // Live Conversations
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [teamReply, setTeamReply] = useState('');
  const [snapFact, setSnapFact] = useState('');

  const loadRiya = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/riya', { cache: 'no-store' });
      const j = await r.json();
      if (j.ok) setPayload(j);
    } catch {
      onToast('Could not load RIYA intelligence telemetry', 'err');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    loadRiya();
  }, [loadRiya]);

  async function runOp(body: Record<string, any>, successMsg = 'Updated RIYA') {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/riya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Operation failed');
      onToast(successMsg, 'ok');
      await loadRiya();
      return true;
    } catch (e: any) {
      onToast(e?.message || 'Operation failed', 'err');
      return false;
    } finally {
      setBusy(false);
    }
  }

  if (loading || !payload) {
    return (
      <div className="kr8-cms-panel">
        <p style={{ color: 'var(--t-muted)', fontSize: 14 }}>Loading RIYA Intelligence &amp; Knowledge Base…</p>
      </div>
    );
  }

  const kb = payload.knowledgeBase || {};
  const an = payload.analytics || {};
  const rt = payload.runtime || {};
  const submissions: any[] = payload.submissions || [];
  const gaps: any[] = payload.knowledgeGaps || [];
  const sessions: any[] = payload.conversations?.sessions || [];
  const allMessages: any[] = payload.conversations?.messages || [];

  const filteredKbRecords = (kb.records || []).filter((r: any) => {
    if (kbCategory !== 'all' && r.category !== kbCategory) return false;
    if (!kbQuery.trim()) return true;
    const q = kbQuery.toLowerCase();
    return (
      String(r.title || '').toLowerCase().includes(q) ||
      String(r.content || '').toLowerCase().includes(q) ||
      String(r.route || '').toLowerCase().includes(q) ||
      (r.sampleQuestions || []).some((sq: string) => sq.toLowerCase().includes(q))
    );
  });

  const filteredSubmissions = submissions.filter((s) => {
    if (subFilter === 'complaints') {
      return ['complaint', 'registration_problem', 'technical_problem'].includes(s.category);
    }
    if (subFilter === 'suggestions') return s.category === 'suggestion';
    if (subFilter === 'feedback') return s.category === 'general_feedback';
    return true;
  });

  const maxCatCount = Math.max(1, ...(kb.byCategory || []).map((c: any) => c.count || 0));
  const pageEntries = Object.entries(an.byPage || {}).sort((a: any, b: any) => b[1] - a[1]);
  const maxPageCount = Math.max(1, ...pageEntries.map(([, cnt]) => Number(cnt) || 0));

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {/* TOP RUNTIME & NAVIGATION BAR */}
      <div
        className="kr8-cms-panel"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          background: 'linear-gradient(135deg, rgba(255,45,155,0.1), rgba(124,58,237,0.14))',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 999,
                background: 'rgba(52,211,153,0.18)',
                border: '1px solid rgba(52,211,153,0.45)',
                color: '#6ee7b7',
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              ● RIYA ACTIVE · KB v{kb.version || 1}
            </span>
            <span style={{ fontSize: 12, color: 'var(--t-muted)', fontFamily: 'var(--f-mono)' }}>
              AI Provider: {rt.externalApiDependencies || 'Vercel AI Gateway'}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--t-body)', marginTop: 6 }}>
            <strong>{rt.engineLabel}</strong> · Hash <code>{kb.contentHash}</code>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(
            [
              { id: 'analytics', label: 'Analytics & Insights' },
              {
                id: 'submissions',
                label: `Complaints & Suggestions (${an.submissionsNew || 0} new)`,
              },
              { id: 'knowledge', label: `Knowledge Base (${kb.totalRecords || 0})` },
              { id: 'gaps', label: `Knowledge Gaps (${an.openGapsCount || 0})` },
              { id: 'conversations', label: `Live Chats (${sessions.length})` },
            ] as { id: SubTab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={subTab === t.id ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '8px 14px', fontSize: 12.5 }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* SNAP-TEACH RIYA BAR (INSTANT SELF-LEARNING IN 1 CLICK) */}
      <form
        className="kr8-cms-panel"
        onSubmit={async (e) => {
          e.preventDefault();
          const txt = snapFact.trim();
          if (!txt || busy) return;
          const ok = await runOp({ op: 'kb.snap_teach', fact: txt }, 'RIYA learned that in a snap!');
          if (ok) setSnapFact('');
        }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '14px 18px' }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
          ⚡ Snap-Teach RIYA:
        </div>
        <input
          type="text"
          value={snapFact}
          onChange={(e) => setSnapFact(e.target.value)}
          placeholder="Type any new fact, cohort update, or rule in plain English and RIYA learns it immediately…"
          style={{
            flex: '1 1 320px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.16)',
            background: 'rgba(10,6,20,0.7)',
            padding: '10px 14px',
            fontSize: 13.5,
            color: '#fff',
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={!snapFact.trim() || busy}
          style={{ padding: '9px 16px', fontSize: 12.5 }}
        >
          Teach in a Snap
        </button>
      </form>

      {/* =================================================================
          SUB-TAB 1: ANALYTICS, VISITOR QUESTIONS & VISUALIZATIONS
          ================================================================= */}
      {subTab === 'analytics' && (
        <div style={{ display: 'grid', gap: 18 }}>
          <div className="kr8-cms-kpis">
            {[
              { k: 'Verified KB Records', v: kb.totalRecords ?? 0, s: `${kb.totalCategoriesActive}/${kb.totalCategoriesDefined} categories active` },
              { k: 'Distinct Q&A Pairs', v: kb.totalDistinctQaPairs ?? 0, s: `${kb.totalRoutesIndexed ?? 0} website routes indexed` },
              { k: 'Visitor Sessions', v: an.totalSessions ?? 0, s: `${an.totalUserMessages ?? 0} visitor turns answered` },
              { k: 'Complaints & Issues', v: an.complaintsCount ?? 0, s: `${an.suggestionsCount ?? 0} visitor suggestions logged` },
              { k: 'Open Knowledge Gaps', v: an.openGapsCount ?? 0, s: 'Ready for admin verification' },
              {
                k: 'Helpfulness Rating',
                v: an.satisfactionPct !== null ? `${an.satisfactionPct}%` : 'No votes yet',
                s: `${an.helpfulCount ?? 0} helpful · ${an.unhelpfulCount ?? 0} unhelpful`,
              },
            ].map((card) => (
              <div key={card.k} className="kr8-cms-kpi">
                <div className="kr8-cms-kpi__lbl">{card.k}</div>
                <div className="kr8-cms-kpi__val">{card.v}</div>
                <div className="kr8-cms-kpi__sub">{card.s}</div>
              </div>
            ))}
          </div>

          <div className="kr8-cms-split">
            {/* Visualization 1: Knowledge Base Coverage Across 22 Categories */}
            <div className="kr8-cms-panel">
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 16, marginBottom: 12 }}>
                Structured Knowledge Coverage by Category
              </h3>
              <div style={{ display: 'grid', gap: 8, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
                {(kb.byCategory || []).map((cat: any) => (
                  <div key={cat.slug} style={{ display: 'grid', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                      <span>{cat.label}</span>
                      <strong style={{ fontFamily: 'var(--f-mono)' }}>{cat.count}</strong>
                    </div>
                    <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(4, Math.round((cat.count / maxCatCount) * 100))}%`,
                          background: 'linear-gradient(90deg, var(--magenta), var(--purple))',
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visualization 2: Page Engagement + Proactive Assistance Funnel */}
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="kr8-cms-panel">
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 16, marginBottom: 12 }}>
                  Proactive Assistance Behaviour Funnel
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {[
                    { lbl: 'Shown', val: an.proactiveFunnel?.shown ?? 0, col: '#c4b5fd' },
                    { lbl: 'Engaged', val: an.proactiveFunnel?.engaged ?? 0, col: '#34d399' },
                    { lbl: 'Dismissed', val: an.proactiveFunnel?.dismissed ?? 0, col: '#fbbf24' },
                    { lbl: 'Muted', val: an.proactiveFunnel?.muted ?? 0, col: '#f87171' },
                  ].map((f) => (
                    <div
                      key={f.lbl}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--hair)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 22, fontWeight: 800, color: f.col }}>{f.val}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--t-muted)', marginTop: 2 }}>{f.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="kr8-cms-panel">
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 16, marginBottom: 12 }}>
                  Page-by-Page Visitor Questions
                </h3>
                {pageEntries.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--t-muted)' }}>
                    Page engagement distribution populates automatically as visitors converse with RIYA.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: 8 }}>
                    {pageEntries.slice(0, 8).map(([pg, cnt]: any) => (
                      <div key={pg} style={{ display: 'grid', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                          <code>{pg}</code>
                          <strong>{cnt} turns</strong>
                        </div>
                        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${Math.max(6, Math.round((Number(cnt) / maxPageCount) * 100))}%`,
                              background: '#34d399',
                              borderRadius: 999,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="kr8-cms-split">
            <div className="kr8-cms-panel">
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 16, marginBottom: 10 }}>
                Most Frequently Asked Visitor Questions
              </h3>
              {(an.topQuestions || []).length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--t-muted)' }}>No visitor questions recorded yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {(an.topQuestions || []).map((q: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '8px 12px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        fontSize: 13,
                      }}
                    >
                      <span>
                        {q.text}{' '}
                        <code style={{ fontSize: 11, color: 'var(--t-muted)' }}>({q.lastPage})</code>
                      </span>
                      <strong style={{ color: 'var(--magenta)' }}>×{q.count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="kr8-cms-panel">
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 16, marginBottom: 10 }}>
                Security &amp; Prompt-Injection Firewall ({an.securityBlocksCount ?? 0} blocked)
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--t-muted)', marginBottom: 10 }}>
                RIYA blocks attempts to probe administrator credentials, environment secrets, or private user data.
              </p>
              {(an.recentSecurityEvents || []).length === 0 ? (
                <p style={{ fontSize: 13, color: '#6ee7b7' }}>Zero security boundary violations detected.</p>
              ) : (
                <div style={{ display: 'grid', gap: 6 }}>
                  {(an.recentSecurityEvents || []).map((ev: any) => (
                    <div
                      key={ev.id}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        fontSize: 12,
                      }}
                    >
                      <strong>Blocked ({ev.pagePath}):</strong> {ev.snippet}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          SUB-TAB 2: COMPLAINTS, SUGGESTIONS & FEEDBACK INBOX
          ================================================================= */}
      {subTab === 'submissions' && (
        <div className="kr8-cms-panel" style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>
                Complaints, Registration Issues, Suggestions &amp; Feedback
              </h3>
              <p style={{ fontSize: 13, color: 'var(--t-muted)', marginTop: 4 }}>
                Captured directly by RIYA with reference numbers, page context, assignment, and resolution tracking.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(
                [
                  ['all', `All (${submissions.length})`],
                  ['complaints', 'Complaints & Issues'],
                  ['suggestions', 'Suggestions'],
                  ['feedback', 'General Feedback'],
                ] as const
              ).map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSubFilter(k)}
                  className={subFilter === k ? 'btn-primary' : 'btn-ghost'}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <p style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>No submissions in this view yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filteredSubmissions.map((s) => (
                <SubmissionRow key={s.id} sub={s} busy={busy} onSave={(id, patch) => runOp({ op: 'submission.update', id, patch }, 'Submission updated')} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================
          SUB-TAB 3: CENTRALIZED KNOWLEDGE BASE & AUTO-SYNC MANAGER
          ================================================================= */}
      {subTab === 'knowledge' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="kr8-cms-panel" style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>
                  Centralized Knowledge Base ({kb.totalRecords} Verified Records · {kb.totalDistinctQaPairs} Q&amp;A Pairs)
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--t-muted)', marginTop: 4 }}>
                  Last synced: {kb.syncedAt ? new Date(kb.syncedAt).toLocaleString() : 'Active'} · Automatically updates whenever CMS pages, services, programs, team, or partners change.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={busy}
                  onClick={() => runOp({ op: 'kb.sync' }, 'Knowledge Base synchronized')}
                >
                  ↻ Sync Now
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setCustomDraft({
                      id: '',
                      title: '',
                      category: 'frequently_asked_questions',
                      route: '/',
                      content: '',
                      questions: '',
                      keywords: '',
                    });
                    setShowCustomForm((v) => !v);
                  }}
                >
                  {showCustomForm ? 'Close Editor' : '+ Add Verified Knowledge'}
                </button>
              </div>
            </div>

            {showCustomForm && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const ok = await runOp({ op: 'kb.save_custom', data: customDraft }, 'Verified knowledge saved & indexed');
                  if (ok) setShowCustomForm(false);
                }}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--hair)',
                  display: 'grid',
                  gap: 12,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
                  <input
                    placeholder="Verified Knowledge Title *"
                    required
                    value={customDraft.title}
                    onChange={(e) => setCustomDraft({ ...customDraft, title: e.target.value })}
                  />
                  <select
                    value={customDraft.category}
                    onChange={(e) => setCustomDraft({ ...customDraft, category: e.target.value })}
                  >
                    {(kb.byCategory || []).map((c: any) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Source Route (e.g. /programs)"
                    value={customDraft.route}
                    onChange={(e) => setCustomDraft({ ...customDraft, route: e.target.value })}
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Official verified KR8 DIGITALS statement (RIYA will ground responses strictly in this fact) *"
                  value={customDraft.content}
                  onChange={(e) => setCustomDraft({ ...customDraft, content: e.target.value })}
                />
                <textarea
                  rows={3}
                  placeholder="Sample visitor questions (one per line)"
                  value={customDraft.questions}
                  onChange={(e) => setCustomDraft({ ...customDraft, questions: e.target.value })}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="submit" className="btn-primary" disabled={busy}>
                    Save &amp; Index into RIYA
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              <input
                placeholder="Search verified records, routes, or sample Q&As…"
                value={kbQuery}
                onChange={(e) => setKbQuery(e.target.value)}
              />
              <select value={kbCategory} onChange={(e) => setKbCategory(e.target.value)}>
                <option value="all">All 22 Knowledge Categories ({kb.totalRecords})</option>
                {(kb.byCategory || []).map((c: any) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label} ({c.count})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gap: 10, maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
              {filteredKbRecords.map((r: any) => {
                const isCustom = String(r.id || '').startsWith('kb_adm_') || String(r.id || '').startsWith('kb_gap_');
                return (
                  <div
                    key={r.id}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--hair)',
                      display: 'grid',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <strong>{r.title}</strong>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span className="kr8-cms-badge">{r.categoryLabel}</span>
                        <code style={{ fontSize: 11.5, color: 'var(--magenta)' }}>{r.route}</code>
                        <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>{r.questionsCount} Q&amp;As</span>
                        {isCustom && (
                          <button
                            type="button"
                            className="btn-ghost"
                            style={{ padding: '2px 8px', fontSize: 11 }}
                            onClick={() => runOp({ op: 'kb.delete_custom', id: r.id }, 'Custom entry removed')}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--t-body)', lineHeight: 1.55 }}>{r.content}</p>
                    <div style={{ fontSize: 11.5, color: 'var(--t-muted)' }}>
                      Source: {r.source} · v{r.version}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          SUB-TAB 4: KNOWLEDGE GAPS & UNVERIFIED CLAIMS VERIFICATION QUEUE
          ================================================================= */}
      {subTab === 'gaps' && (
        <div className="kr8-cms-panel" style={{ display: 'grid', gap: 14 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>
              Knowledge Gaps &amp; Quarantined Visitor Claims ({gaps.length})
            </h3>
            <p style={{ fontSize: 13, color: 'var(--t-muted)', marginTop: 4 }}>
              Questions RIYA refused to guess on — plus unverified claims visitors tried to state — wait here until an administrator verifies and publishes official answers.
            </p>
          </div>

          {gaps.length === 0 ? (
            <p style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>No open knowledge gaps or unverified claims.</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {gaps.map((g) => (
                <div
                  key={g.id}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--hair)',
                    display: 'grid',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <span
                        className="kr8-cms-badge"
                        style={{
                          marginRight: 8,
                          background:
                            g.kind === 'candidate_claim' ? 'rgba(251,191,36,0.2)' : 'rgba(255,45,155,0.18)',
                        }}
                      >
                        {g.kind === 'candidate_claim' ? 'Unverified Visitor Claim' : 'Knowledge Gap'}
                      </span>
                      <strong>{g.question}</strong>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--t-muted)' }}>
                      Status: <strong>{g.status}</strong> · Asked ×{g.occurrences || 1} on <code>{g.pagePath}</code>
                    </span>
                  </div>

                  {g.status === 'open' && resolvingGapId !== g.id && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        onClick={() => {
                          setResolvingGapId(g.id);
                          setGapTitle(g.question.slice(0, 110));
                          setGapRoute(g.pagePath || '/');
                          setGapAnswer('');
                        }}
                      >
                        Verify &amp; Promote to KB
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        onClick={() => runOp({ op: 'gap.dismiss', id: g.id }, 'Gap dismissed')}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {resolvingGapId === g.id && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const ok = await runOp(
                          {
                            op: 'gap.resolve_to_kb',
                            id: g.id,
                            title: gapTitle,
                            content: gapAnswer,
                            category: gapCategory,
                            route: gapRoute,
                          },
                          'Promoted into RIYA Verified Knowledge Base'
                        );
                        if (ok) setResolvingGapId(null);
                      }}
                      style={{ display: 'grid', gap: 8, marginTop: 6 }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                        <input
                          required
                          value={gapTitle}
                          onChange={(e) => setGapTitle(e.target.value)}
                          placeholder="Knowledge Title"
                        />
                        <select value={gapCategory} onChange={(e) => setGapCategory(e.target.value)}>
                          {(kb.byCategory || []).map((c: any) => (
                            <option key={c.slug} value={c.slug}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <input
                          value={gapRoute}
                          onChange={(e) => setGapRoute(e.target.value)}
                          placeholder="Route (/programs)"
                        />
                      </div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write the official verified KR8 DIGITALS answer…"
                        value={gapAnswer}
                        onChange={(e) => setGapAnswer(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit" className="btn-primary" disabled={busy}>
                          Publish to RIYA
                        </button>
                        <button type="button" className="btn-ghost" onClick={() => setResolvingGapId(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================
          SUB-TAB 5: LIVE VISITOR CONVERSATIONS & HUMAN TEAM TAKEOVER
          ================================================================= */}
      {subTab === 'conversations' && (
        <div className="kr8-cms-split">
          <div className="kr8-cms-panel">
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 17, marginBottom: 12 }}>
              Visitor Conversations ({sessions.length})
            </h3>
            {sessions.length === 0 ? (
              <p style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>
                Active visitor conversations with RIYA appear here for live inspection and team takeover.
              </p>
            ) : (
              <div className="kr8-cms-list">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`kr8-cms-item${selectedVisitorId === s.visitorId ? ' is-selected' : ''}`}
                    onClick={() => setSelectedVisitorId(s.visitorId)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>
                        {s.memory?.visitorName || `Visitor ${String(s.visitorId || s.id).slice(-6)}`}
                      </strong>
                      {s.handoff && <span className="kr8-cms-status new">Escalated</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4 }}>
                      Page: <code>{s.lastPage || s.page || '/'}</code> · Turns: {s.turnCount || 1}
                    </div>
                    {s.lastMessagePreview && (
                      <div style={{ fontSize: 12, color: 'var(--t-body)', marginTop: 3 }}>
                        “{s.lastMessagePreview}”
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="kr8-cms-panel">
            {!selectedVisitorId ? (
              <p style={{ fontSize: 14, color: 'var(--t-muted)' }}>
                Select any visitor conversation on the left to review RIYA’s transcript or jump in with a live human team reply.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ maxHeight: 400, overflowY: 'auto', display: 'grid', gap: 8, paddingRight: 4 }}>
                  {allMessages
                    .filter((m) => m.visitorId === selectedVisitorId)
                    .slice()
                    .reverse()
                    .map((m) => (
                      <div
                        key={m.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 12,
                          background:
                            m.who === 'you'
                              ? 'rgba(255,255,255,0.06)'
                              : m.who === 'team'
                              ? 'rgba(52,211,153,0.14)'
                              : 'rgba(124,58,237,0.18)',
                          fontSize: 13.5,
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--magenta)' }}>
                          {m.who === 'bot' ? 'RIYA' : m.who === 'team' ? m.name || 'KR8 Team' : 'Visitor'}
                          {m.submissionRef ? ` · ${m.submissionRef}` : ''}
                        </div>
                        <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                      </div>
                    ))}
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!teamReply.trim()) return;
                    const ok = await runOp(
                      {
                        op: 'conversation.reply',
                        visitorId: selectedVisitorId,
                        text: teamReply,
                        senderName: 'KR8 DIGITALS Team',
                      },
                      'Live team reply delivered to visitor chat'
                    );
                    if (ok) setTeamReply('');
                  }}
                  style={{ display: 'flex', gap: 8 }}
                >
                  <input
                    placeholder="Send a live human reply directly into this visitor's RIYA chat…"
                    value={teamReply}
                    onChange={(e) => setTeamReply(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" disabled={busy || !teamReply.trim()}>
                    Send Live
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SubmissionRow({
  sub,
  busy,
  onSave,
}: {
  sub: any;
  busy: boolean;
  onSave: (id: string, patch: Record<string, any>) => Promise<any>;
}) {
  const [status, setStatus] = useState(sub.status || 'new');
  const [priority, setPriority] = useState(sub.priority || 'normal');
  const [assignedTo, setAssignedTo] = useState(sub.assignedTo || 'Unassigned');
  const [adminNotes, setAdminNotes] = useState(sub.adminNotes || '');

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--hair)',
        display: 'grid',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <strong style={{ fontFamily: 'var(--f-mono)', color: 'var(--magenta)' }}>{sub.refCode}</strong>
          <span className="kr8-cms-badge">{String(sub.category || '').replace(/_/g, ' ')}</span>
          <code style={{ fontSize: 12, color: 'var(--t-muted)' }}>{sub.pagePath}</code>
        </div>
        <span style={{ fontSize: 12, color: 'var(--t-muted)' }}>
          {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : ''}
        </span>
      </div>

      <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.6 }}>{sub.message}</p>

      {(sub.visitorName || sub.visitorEmail || sub.visitorPhone) && (
        <div style={{ fontSize: 12.5, color: '#6ee7b7' }}>
          Visitor Contact: {sub.visitorName || 'Visitor'} {sub.visitorEmail ? `· ${sub.visitorEmail}` : ''}{' '}
          {sub.visitorPhone ? `· ${sub.visitorPhone}` : ''}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 2fr auto', gap: 8, alignItems: 'center' }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="new">New</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">High Priority</option>
          <option value="normal">Normal Priority</option>
        </select>
        <input
          placeholder="Assigned to (e.g. Timfire)"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <input
          placeholder="Internal admin note (never visible to visitors)"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: 12.5 }}
          disabled={busy}
          onClick={() => onSave(sub.id, { status, priority, assignedTo, adminNotes })}
        >
          Save
        </button>
      </div>
    </div>
  );
}
