'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from './ui';
import RiyaAdminPanel from './RiyaAdminPanel';
import ThemeToggle from './ThemeToggle';

type Tab =
  | 'overview'
  | 'pages'
  | 'services'
  | 'programs'
  | 'team'
  | 'partners'
  | 'media'
  | 'navigation'
  | 'seo'
  | 'leads'
  | 'host'
  | 'referrals'
  | 'orders'
  | 'revisions';

export default function AdminApp({ configured }: { configured: boolean }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ text: string; tone?: 'ok' | 'err' } | null>(null);

  // Module selections & forms
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [partnerSubTab, setPartnerSubTab] = useState<'proposals' | 'partners'>('proposals');
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [mediaFilter, setMediaFilter] = useState('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [navDraft, setNavDraft] = useState<any>(null);
  const [selectedSeo, setSelectedSeo] = useState<any>(null);
  const [leadFilter, setLeadFilter] = useState('all');
  const [leadCtaFilter, setLeadCtaFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [settingsDraft, setSettingsDraft] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const flash = (text: string, tone: 'ok' | 'err' = 'ok') => {
    setToast({ text, tone });
    setTimeout(() => setToast(null), 3400);
  };

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/data', { cache: 'no-store' });
    const j = await r.json();
    if (!j.authed) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    setData(j);
    if (j.cms?.navigation && !navDraft) setNavDraft(j.cms.navigation);
    if (j.settings && Object.keys(settingsDraft).length === 0) setSettingsDraft(j.settings);
  }, [navDraft, settingsDraft]);

  useEffect(() => {
    if (configured) load();
    else setAuthed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setErr(j.error || 'Incorrect administrator password.');
      } else {
        setPw('');
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setData(null);
  }

  async function cmsMutate(payload: {
    entity?: string;
    action: string;
    id?: string;
    data?: any;
  }) {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        flash(j.error || 'Could not save changes', 'err');
        return null;
      }
      flash('Saved & synced to live site');
      await load();
      return j.doc || true;
    } finally {
      setBusy(false);
    }
  }

  async function legacyAction(body: Record<string, any>) {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        flash(j.error || 'Action failed', 'err');
        return false;
      }
      flash('Updated');
      await load();
      return true;
    } finally {
      setBusy(false);
    }
  }

  async function handleFileUpload(file: File, replaceId?: string) {
    setBusy(true);
    try {
      const reader = new FileReader();
      const b64: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      const cleanTitle = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      const r = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload',
          replaceId,
          title: replaceId ? selectedMedia?.title : cleanTitle,
          alt: replaceId ? selectedMedia?.alt : `${cleanTitle} — KR8 DIGITALS`,
          category: replaceId ? selectedMedia?.category : 'uploads',
          mimeType: file.type,
          dataBase64: b64,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        flash(j.error || 'Upload failed', 'err');
        return;
      }
      flash(replaceId ? 'Media file replaced' : 'Media uploaded to library');
      await load();
      if (j.doc) setSelectedMedia(j.doc);
    } finally {
      setBusy(false);
    }
  }

  // ========================================================= UNLOCK / LOGIN
  if (!configured) {
    return (
      <div className="kr8-cms-login">
        <div className="kr8-cms-login__card">
          <span className="kr8-pill">
            <i className="kr8-pill__dot" /> Administrator Setup
          </span>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 28, marginTop: 16 }}>
            Admin Studio Locked
          </h1>
          <p className="prose-lg" style={{ marginTop: 10, fontSize: 15 }}>
            Set <code>ADMIN_PASSWORD</code> (at least 8 characters) in your environment variables to
            enable authenticated access to the KR8 DIGITALS CMS &amp; Admin Studio.
          </p>
          <div style={{ marginTop: 22 }}>
            <Link href="/" className="btn-ghost">
              ← Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authed === null) {
    return (
      <div className="kr8-cms-login">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--t-muted)' }}>
          Verifying administrator session…
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="kr8-cms-login">
        <div className="kr8-cms-login__card kr8-form-shell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <span className="kr8-pill">
              <i className="kr8-pill__dot" /> KR8 DIGITALS · CMS
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ThemeToggle variant="pill" />
              <Link href="/" style={{ fontSize: 13, color: 'var(--t-muted)' }}>
                Public Site ↗
              </Link>
            </div>
          </div>
          <h1
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginTop: 18,
            }}
          >
            Executive CMS &amp; Operations
          </h1>
          <p style={{ marginTop: 8, fontSize: 14.5, color: 'var(--t-muted)', lineHeight: 1.6 }}>
            Sign in to manage pages, services, ecosystem programs, founder profiles, partner
            proposals, media assets, navigation, SEO, and incoming studio enquiries.
          </p>

          <form onSubmit={login} style={{ marginTop: 24, display: 'grid', gap: 16 }}>
            <label className="field">
              <span>Administrator Password</span>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Enter executive password"
                  autoFocus
                  required
                  style={{ paddingRight: 74 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--t-strong)',
                    borderRadius: 8,
                    padding: '4px 9px',
                    fontSize: 11.5,
                    cursor: 'pointer',
                  }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {err && (
              <div
                role="alert"
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(239, 68, 68, 0.16)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: 'var(--status-err-fg)',
                  fontSize: 13.5,
                }}
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={busy || !pw}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {busy ? 'Signing in…' : 'Unlock CMS Studio'} <Icon name="arrow" size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const c = data?.counts || {};
  const cms = data?.cms || {};
  const pages: any[] = cms.pages || [];
  const services: any[] = cms.services || [];
  const programs: any[] = cms.programs || [];
  const team: any[] = cms.team || [];
  const partners: any[] = cms.partners || [];
  const proposals: any[] = cms.partner_proposals || [];
  const media: any[] = cms.media || [];
  const seoList: any[] = cms.seo || [];
  const revisions: any[] = cms.revisions || [];

  const switchTab = (next: Tab) => {
    setTab(next);
    setDrawerOpen(false);
  };

  // ========================================================= DASHBOARD SHELL
  return (
    <div className="kr8-cms-shell kr8-form-shell">
      {/* ================================================= SIDEBAR */}
      <aside className={`kr8-cms-aside${drawerOpen ? ' is-open' : ''}`}>
        <div className="kr8-cms-brand">
          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontWeight: 800, fontSize: 17 }}>
              KR8 <span className="text-grad">DIGITALS</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 10.5,
                letterSpacing: '0.12em',
                color: 'var(--t-muted)',
                marginTop: 2,
              }}
            >
              CMS &amp; STUDIO CONSOLE
            </div>
          </div>
          <button
            type="button"
            className="kr8-cms-burger btn-ghost"
            style={{ padding: '6px 10px', fontSize: 12 }}
            onClick={() => setDrawerOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="kr8-cms-navgroup">
          <div className="kr8-cms-navlbl">Command</div>
          <button
            className={`kr8-cms-navbtn${tab === 'overview' ? ' is-active' : ''}`}
            onClick={() => switchTab('overview')}
          >
            <span>Executive Overview</span>
          </button>
        </div>

        <div className="kr8-cms-navgroup">
          <div className="kr8-cms-navlbl">Content Management (CMS)</div>
          <button
            className={`kr8-cms-navbtn${tab === 'pages' ? ' is-active' : ''}`}
            onClick={() => switchTab('pages')}
          >
            <span>Pages &amp; Sections</span>
            <span className="kr8-cms-badge">{pages.length}</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'services' ? ' is-active' : ''}`}
            onClick={() => switchTab('services')}
          >
            <span>Commercial Services</span>
            <span className="kr8-cms-badge">{services.length}</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'programs' ? ' is-active' : ''}`}
            onClick={() => switchTab('programs')}
          >
            <span>Programs &amp; Status</span>
            <span className="kr8-cms-badge">{programs.length}</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'team' ? ' is-active' : ''}`}
            onClick={() => switchTab('team')}
          >
            <span>Founders &amp; Team</span>
            <span className="kr8-cms-badge">{team.length}</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'partners' ? ' is-active' : ''}`}
            onClick={() => switchTab('partners')}
          >
            <span>Partners &amp; Proposals</span>
            <span className={`kr8-cms-badge${c.proposalsNew ? ' is-alert' : ''}`}>
              {c.proposalsNew ? `${c.proposalsNew} new` : partners.length}
            </span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'media' ? ' is-active' : ''}`}
            onClick={() => switchTab('media')}
          >
            <span>Media Library</span>
            <span className="kr8-cms-badge">{c.mediaCount || 0}</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'navigation' ? ' is-active' : ''}`}
            onClick={() => switchTab('navigation')}
          >
            <span>Navigation &amp; Global</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'seo' ? ' is-active' : ''}`}
            onClick={() => switchTab('seo')}
          >
            <span>SEO &amp; OpenGraph</span>
            <span className="kr8-cms-badge">{seoList.length}</span>
          </button>
        </div>

        <div className="kr8-cms-navgroup">
          <div className="kr8-cms-navlbl">Studio Operations</div>
          <button
            className={`kr8-cms-navbtn${tab === 'leads' ? ' is-active' : ''}`}
            onClick={() => switchTab('leads')}
          >
            <span>Leads &amp; Applications</span>
            <span className={`kr8-cms-badge${c.leadsNew ? ' is-alert' : ''}`}>
              {c.leadsNew ? `${c.leadsNew} new` : c.leadsTotal || 0}
            </span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'host' ? ' is-active' : ''}`}
            onClick={() => switchTab('host')}
          >
            <span>RIYA Intelligence</span>
            <span
              className={`kr8-cms-badge${
                (c.riyaSubmissionsNew || 0) + (c.handoffs || 0) > 0 ? ' is-alert' : ''
              }`}
            >
              {(c.riyaSubmissionsNew || 0) + (c.handoffs || 0) || c.riyaGapsOpen || 'AI'}
            </span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'referrals' ? ' is-active' : ''}`}
            onClick={() => switchTab('referrals')}
          >
            <span>Referrals &amp; Payouts</span>
            <span className="kr8-cms-badge">{c.referrers || 0}</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'orders' ? ' is-active' : ''}`}
            onClick={() => switchTab('orders')}
          >
            <span>Orders &amp; Settings</span>
          </button>
          <button
            className={`kr8-cms-navbtn${tab === 'revisions' ? ' is-active' : ''}`}
            onClick={() => switchTab('revisions')}
          >
            <span>Revision History</span>
            <span className="kr8-cms-badge">{revisions.length}</span>
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'grid', gap: 8 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ justifyContent: 'center', fontSize: 13, padding: '9px 14px' }}
          >
            View Live Website ↗
          </a>
          <button
            type="button"
            onClick={logout}
            className="btn-ghost"
            style={{ justifyContent: 'center', fontSize: 13, padding: '9px 14px', opacity: 0.8 }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================================================= MAIN WORKSPACE */}
      <div className="kr8-cms-main">
        <header className="kr8-cms-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="kr8-cms-burger btn-ghost"
              style={{ padding: '8px 12px', fontSize: 13 }}
              onClick={() => setDrawerOpen(true)}
            >
              ☰ Menu
            </button>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 18 }}>
                {tab === 'overview' && 'Executive Command Overview'}
                {tab === 'pages' && 'Pages, Slugs & Section Builder'}
                {tab === 'services' && 'Commercial Services Manager'}
                {tab === 'programs' && 'Ecosystem Programs & Availability'}
                {tab === 'team' && 'Founders & Studio Team Profiles'}
                {tab === 'partners' && 'Strategic Partners & Incoming Proposals'}
                {tab === 'media' && 'Brand & Media Asset Library'}
                {tab === 'navigation' && 'Global Navigation & Contact Identity'}
                {tab === 'seo' && 'Search Engine & OpenGraph Metadata'}
                {tab === 'leads' && 'Client Enquiries, RSVPs & Team Applications'}
                {tab === 'host' && 'RIYA Intelligence, Knowledge Base & Visitor Submissions'}
                {tab === 'referrals' && 'Referral Affiliates & Commission Ledger'}
                {tab === 'orders' && 'Orders & Notification Settings'}
                {tab === 'revisions' && 'Version History & One-Click Restore'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {toast && (
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  background:
                    toast.tone === 'err' ? 'rgba(239,68,68,0.22)' : 'rgba(34,197,94,0.2)',
                  border: `1px solid ${
                    toast.tone === 'err' ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.45)'
                  }`,
                  color: toast.tone === 'err' ? 'var(--status-err-fg)' : 'var(--status-ok-fg)',
                }}
              >
                {toast.text}
              </span>
            )}
            <ThemeToggle variant="pill" />
            <button
              type="button"
              onClick={load}
              className="btn-ghost"
              style={{ padding: '8px 14px', fontSize: 13 }}
              disabled={busy}
            >
              {busy ? 'Syncing…' : '↻ Refresh'}
            </button>
          </div>
        </header>

        <div className="kr8-cms-body">
          {/* ================================================= 1. OVERVIEW */}
          {tab === 'overview' && (
            <div style={{ display: 'grid', gap: 24 }}>
              <div className="kr8-cms-kpis">
                {[
                  { k: 'Published Pages', v: c.pagesPublished ?? pages.length, s: 'Core + custom routes', go: 'pages' as Tab },
                  { k: 'Commercial Services', v: c.servicesPublished ?? 6, s: 'Live on /services', go: 'services' as Tab },
                  { k: 'Active Programs', v: c.programsActive ?? 4, s: 'Ecosystem pathways', go: 'programs' as Tab },
                  { k: 'Founders & Team', v: c.teamCount ?? 4, s: 'Verified spellings', go: 'team' as Tab },
                  { k: 'Partner Proposals', v: c.proposalsNew ?? 0, s: `${c.proposalsTotal ?? 0} total received`, go: 'partners' as Tab },
                  { k: 'New Enquiries', v: c.leadsNew ?? 0, s: `${c.leadsTotal ?? 0} total submissions`, go: 'leads' as Tab },
                  { k: 'Media Assets', v: c.mediaCount ?? 0, s: 'Curated & uploaded', go: 'media' as Tab },
                  {
                    k: 'RIYA Intelligence',
                    v: (c.riyaSubmissionsNew ?? 0) + (c.handoffs ?? 0),
                    s: `${c.riyaGapsOpen ?? 0} open KB gaps · ${data?.analytics?.total ?? 0} events`,
                    go: 'host' as Tab,
                  },
                ].map((card) => (
                  <div
                    key={card.k}
                    className="kr8-cms-kpi"
                    onClick={() => switchTab(card.go)}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--f-mono)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--t-muted)',
                      }}
                    >
                      {card.k}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--f-display)',
                        fontSize: 32,
                        fontWeight: 800,
                        marginTop: 6,
                      }}
                    >
                      {card.v}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--magenta)', marginTop: 4 }}>
                      {card.s} →
                    </div>
                  </div>
                ))}
              </div>

              <div className="kr8-grid-2">
                <div className="kr8-cms-panel">
                  <div className="eyebrow">Quick Publishing Actions</div>
                  <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 8 }}>
                    Create or Update Live Content
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--t-muted)', marginTop: 6 }}>
                    Every published change in this console immediately updates the public KR8
                    DIGITALS website. Use Draft mode to stage and preview pages privately first.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ fontSize: 13, padding: '10px 16px' }}
                      onClick={() => {
                        setSelectedPage({
                          title: '',
                          slug: '',
                          status: 'draft',
                          isSystem: false,
                          eyebrow: 'KR8 DIGITALS',
                          heroTitle: '',
                          heroHighlight: '',
                          heroLede: '',
                          primaryCtaLabel: 'Work With Us',
                          primaryCtaHref: '/contact',
                          sections: [],
                        });
                        switchTab('pages');
                      }}
                    >
                      + Create Custom Page
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ fontSize: 13, padding: '10px 16px' }}
                      onClick={() => {
                        setPartnerSubTab('proposals');
                        switchTab('partners');
                      }}
                    >
                      Review Partner Proposals ({c.proposalsNew || 0})
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ fontSize: 13, padding: '10px 16px' }}
                      onClick={() => switchTab('media')}
                    >
                      Upload Media Asset
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ fontSize: 13, padding: '10px 16px' }}
                      onClick={() => switchTab('navigation')}
                    >
                      Edit Header &amp; Contact Info
                    </button>
                  </div>
                </div>

                <div className="kr8-cms-panel">
                  <div className="eyebrow">Recent Audit Trail</div>
                  <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 8 }}>
                    Latest Content Revisions
                  </h2>
                  {revisions.length === 0 ? (
                    <p style={{ fontSize: 14, color: 'var(--t-muted)', marginTop: 12 }}>
                      All collections hydrated and synced. Edits made in this console are
                      automatically versioned here for one-click rollback.
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
                      {revisions.slice(0, 4).map((rev: any) => (
                        <div
                          key={rev.id}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 12,
                            background: 'var(--surface-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: 13,
                          }}
                        >
                          <div>
                            <strong>{rev.entityLabel}</strong>{' '}
                            <span style={{ color: 'var(--t-muted)' }}>
                              ({rev.entityType} · {rev.action})
                            </span>
                          </div>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--t-muted)' }}>
                            {new Date(rev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= 2. PAGES & SECTIONS */}
          {tab === 'pages' && (
            <div className="kr8-cms-split">
              <div className="kr8-cms-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>All Pages</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '7px 13px', fontSize: 12.5 }}
                    onClick={() =>
                      setSelectedPage({
                        title: '',
                        slug: '',
                        status: 'draft',
                        isSystem: false,
                        eyebrow: 'KR8 DIGITALS',
                        heroTitle: '',
                        heroHighlight: '',
                        heroLede: '',
                        heroImage: '',
                        heroImageAlt: '',
                        primaryCtaLabel: 'Work With Us',
                        primaryCtaHref: '/contact',
                        secondaryCtaLabel: 'Explore Services',
                        secondaryCtaHref: '/services',
                        metaTitle: '',
                        metaDescription: '',
                        noindex: false,
                        sections: [
                          {
                            id: `sec_${Date.now()}`,
                            type: 'text',
                            eyebrow: 'Overview',
                            title: 'Section Headline',
                            body: 'Write executive copy for this section.',
                          },
                        ],
                      })
                    }
                  >
                    + New Page
                  </button>
                </div>

                <div className="kr8-cms-list">
                  {pages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`kr8-cms-item${selectedPage?.id === p.id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedPage(structuredClone(p))}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                        <strong style={{ fontSize: 14 }}>{p.title}</strong>
                        <span className={`kr8-cms-status ${p.status}`}>{p.status}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4, fontFamily: 'var(--f-mono)' }}>
                        /{p.slug === '/' ? '' : p.slug} {p.isSystem ? '· Core Route' : '· Custom CMS Page'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="kr8-cms-panel">
                {!selectedPage ? (
                  <p style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>
                    Select any core route or custom page on the left to edit its hero copy, SEO
                    metadata, publication status, or dynamic page sections — or click{' '}
                    <strong>+ New Page</strong> to publish a brand-new URL on KR8 DIGITALS.
                  </p>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const saved = await cmsMutate({
                        entity: 'page',
                        action: 'save',
                        id: selectedPage.id,
                        data: selectedPage,
                      });
                      if (saved && typeof saved === 'object') setSelectedPage(saved);
                    }}
                    style={{ display: 'grid', gap: 18 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <span className="eyebrow">
                          {selectedPage.isSystem ? 'Core Route Hero & Metadata' : 'Custom CMS Page Builder'}
                        </span>
                        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 4 }}>
                          {selectedPage.title || 'Untitled Page'}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {selectedPage.slug && (
                          <a
                            href={`/${selectedPage.slug === '/' ? '' : selectedPage.slug}${
                              selectedPage.status === 'draft' ? '?preview=1' : ''
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost"
                            style={{ padding: '8px 13px', fontSize: 12.5 }}
                          >
                            {selectedPage.status === 'draft' ? 'Preview Draft ↗' : 'Open Live Page ↗'}
                          </a>
                        )}
                        {!selectedPage.isSystem && selectedPage.id && (
                          <button
                            type="button"
                            className="btn-ghost"
                            style={{ padding: '8px 13px', fontSize: 12.5, color: 'var(--status-err-fg)' }}
                            onClick={async () => {
                              await cmsMutate({ entity: 'page', action: 'delete', id: selectedPage.id });
                              setSelectedPage(null);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="kr8-grid-3">
                      <label className="field">
                        <span>Page Title *</span>
                        <input
                          required
                          value={selectedPage.title || ''}
                          onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>URL Slug *</span>
                        <input
                          required
                          disabled={Boolean(selectedPage.isSystem)}
                          placeholder="e.g. enterprise-brief"
                          value={selectedPage.slug || ''}
                          onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Publication Status</span>
                        <select
                          value={selectedPage.status || 'published'}
                          onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value })}
                        >
                          <option value="published">Published (Live)</option>
                          <option value="draft">Draft (Admin Preview Only)</option>
                          <option value="archived">Archived (Hidden)</option>
                        </select>
                      </label>
                    </div>

                    {selectedPage.slug !== '/' && (
                      <>
                        <div className="kr8-grid-3">
                          <label className="field">
                            <span>Hero Eyebrow</span>
                            <input
                              value={selectedPage.eyebrow || ''}
                              onChange={(e) => setSelectedPage({ ...selectedPage, eyebrow: e.target.value })}
                            />
                          </label>
                          <label className="field">
                            <span>Hero Headline</span>
                            <input
                              value={selectedPage.heroTitle || ''}
                              onChange={(e) => setSelectedPage({ ...selectedPage, heroTitle: e.target.value })}
                            />
                          </label>
                          <label className="field">
                            <span>Highlighted Phrase (Gradient)</span>
                            <input
                              value={selectedPage.heroHighlight || ''}
                              onChange={(e) => setSelectedPage({ ...selectedPage, heroHighlight: e.target.value })}
                            />
                          </label>
                        </div>

                        <label className="field">
                          <span>Hero Lead Paragraph</span>
                          <textarea
                            rows={3}
                            value={selectedPage.heroLede || ''}
                            onChange={(e) => setSelectedPage({ ...selectedPage, heroLede: e.target.value })}
                          />
                        </label>

                        {!selectedPage.isSystem && (
                          <>
                            <div className="kr8-grid-2">
                              <label className="field">
                                <span>Hero Image URL (optional)</span>
                                <input
                                  placeholder="/img/about/kr8-ecosystem-studio.webp"
                                  value={selectedPage.heroImage || ''}
                                  onChange={(e) => setSelectedPage({ ...selectedPage, heroImage: e.target.value })}
                                />
                              </label>
                              <label className="field">
                                <span>Hero Image Alt Text</span>
                                <input
                                  value={selectedPage.heroImageAlt || ''}
                                  onChange={(e) => setSelectedPage({ ...selectedPage, heroImageAlt: e.target.value })}
                                />
                              </label>
                            </div>

                            <div className="kr8-grid-2">
                              <label className="field">
                                <span>Primary CTA Label &amp; Link</span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <input
                                    placeholder="Label"
                                    value={selectedPage.primaryCtaLabel || ''}
                                    onChange={(e) =>
                                      setSelectedPage({ ...selectedPage, primaryCtaLabel: e.target.value })
                                    }
                                  />
                                  <input
                                    placeholder="/contact"
                                    value={selectedPage.primaryCtaHref || ''}
                                    onChange={(e) =>
                                      setSelectedPage({ ...selectedPage, primaryCtaHref: e.target.value })
                                    }
                                  />
                                </div>
                              </label>
                              <label className="field">
                                <span>Secondary CTA Label &amp; Link</span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <input
                                    placeholder="Label"
                                    value={selectedPage.secondaryCtaLabel || ''}
                                    onChange={(e) =>
                                      setSelectedPage({ ...selectedPage, secondaryCtaLabel: e.target.value })
                                    }
                                  />
                                  <input
                                    placeholder="/services"
                                    value={selectedPage.secondaryCtaHref || ''}
                                    onChange={(e) =>
                                      setSelectedPage({ ...selectedPage, secondaryCtaHref: e.target.value })
                                    }
                                  />
                                </div>
                              </label>
                            </div>

                            {/* SECTION BUILDER */}
                            <div
                              style={{
                                padding: 18,
                                borderRadius: 16,
                                background: 'var(--surface-subtle)',
                                border: '1px solid var(--border-subtle)',
                                display: 'grid',
                                gap: 14,
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                <strong>Page Content Sections ({(selectedPage.sections || []).length})</strong>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                  {(['text', 'split', 'cards', 'cta'] as const).map((t) => (
                                    <button
                                      key={t}
                                      type="button"
                                      className="btn-ghost"
                                      style={{ padding: '5px 10px', fontSize: 11.5 }}
                                      onClick={() =>
                                        setSelectedPage({
                                          ...selectedPage,
                                          sections: [
                                            ...(selectedPage.sections || []),
                                            {
                                              id: `sec_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
                                              type: t,
                                              eyebrow: 'Section',
                                              title: 'New Section Heading',
                                              body: 'Supporting details.',
                                              items:
                                                t === 'cards'
                                                  ? [
                                                      { tag: '01', title: 'Key Pillar', body: 'Description' },
                                                      { tag: '02', title: 'Second Pillar', body: 'Description' },
                                                    ]
                                                  : undefined,
                                            },
                                          ],
                                        })
                                      }
                                    >
                                      + {t.toUpperCase()}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {(selectedPage.sections || []).map((sec: any, idx: number) => (
                                <div
                                  key={sec.id}
                                  style={{
                                    padding: 14,
                                    borderRadius: 12,
                                    background: 'var(--surface-input)',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'grid',
                                    gap: 10,
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--magenta)' }}>
                                      SECTION {idx + 1} · {sec.type.toUpperCase()}
                                    </span>
                                    <button
                                      type="button"
                                      style={{ background: 'none', border: 0, color: 'var(--status-err-fg)', fontSize: 12, cursor: 'pointer' }}
                                      onClick={() => {
                                        const next = [...selectedPage.sections];
                                        next.splice(idx, 1);
                                        setSelectedPage({ ...selectedPage, sections: next });
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <div className="kr8-grid-2">
                                    <input
                                      placeholder="Eyebrow"
                                      value={sec.eyebrow || ''}
                                      onChange={(e) => {
                                        const next = [...selectedPage.sections];
                                        next[idx] = { ...sec, eyebrow: e.target.value };
                                        setSelectedPage({ ...selectedPage, sections: next });
                                      }}
                                    />
                                    <input
                                      placeholder="Section Heading"
                                      value={sec.title || ''}
                                      onChange={(e) => {
                                        const next = [...selectedPage.sections];
                                        next[idx] = { ...sec, title: e.target.value };
                                        setSelectedPage({ ...selectedPage, sections: next });
                                      }}
                                    />
                                  </div>
                                  <textarea
                                    rows={2}
                                    placeholder="Section body text"
                                    value={sec.body || ''}
                                    onChange={(e) => {
                                      const next = [...selectedPage.sections];
                                      next[idx] = { ...sec, body: e.target.value };
                                      setSelectedPage({ ...selectedPage, sections: next });
                                    }}
                                  />
                                  {(sec.type === 'split' || sec.type === 'cta') && (
                                    <div className="kr8-grid-3">
                                      {sec.type === 'split' && (
                                        <input
                                          placeholder="Image URL"
                                          value={sec.image || ''}
                                          onChange={(e) => {
                                            const next = [...selectedPage.sections];
                                            next[idx] = { ...sec, image: e.target.value };
                                            setSelectedPage({ ...selectedPage, sections: next });
                                          }}
                                        />
                                      )}
                                      <input
                                        placeholder="CTA Button Label"
                                        value={sec.ctaLabel || ''}
                                        onChange={(e) => {
                                          const next = [...selectedPage.sections];
                                          next[idx] = { ...sec, ctaLabel: e.target.value };
                                          setSelectedPage({ ...selectedPage, sections: next });
                                        }}
                                      />
                                      <input
                                        placeholder="CTA Link (/contact)"
                                        value={sec.ctaHref || ''}
                                        onChange={(e) => {
                                          const next = [...selectedPage.sections];
                                          next[idx] = { ...sec, ctaHref: e.target.value };
                                          setSelectedPage({ ...selectedPage, sections: next });
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    <div className="kr8-grid-2">
                      <label className="field">
                        <span>SEO Meta Title</span>
                        <input
                          value={selectedPage.metaTitle || ''}
                          onChange={(e) => setSelectedPage({ ...selectedPage, metaTitle: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>SEO Meta Description</span>
                        <input
                          value={selectedPage.metaDescription || ''}
                          onChange={(e) => setSelectedPage({ ...selectedPage, metaDescription: e.target.value })}
                        />
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="submit" className="btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Save Page & Sync Live'} <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================================================= 3. SERVICES */}
          {tab === 'services' && (
            <div className="kr8-cms-split">
              <div className="kr8-cms-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>Services ({services.length})</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '7px 13px', fontSize: 12.5 }}
                    onClick={() =>
                      setSelectedService({
                        slug: '',
                        num: `0${services.length + 1}`,
                        order: services.length + 1,
                        status: 'published',
                        name: '',
                        short: '',
                        nav: '',
                        tagline: '',
                        summary: '',
                        body: '',
                        deliverables: ['Custom strategy & architecture', 'Production implementation'],
                        outcomes: ['Faster client conversion', 'Executive visual authority'],
                        showcase: 'none',
                        startingUsd: 450,
                        image: '/img/services/website-engineering.webp',
                        imageAlt: 'KR8 DIGITALS commercial service',
                      })
                    }
                  >
                    + Add Service
                  </button>
                </div>

                <div className="kr8-cms-list">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`kr8-cms-item${selectedService?.id === s.id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedService(structuredClone(s))}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>
                          {s.num} · {s.name}
                        </strong>
                        <span className={`kr8-cms-status ${s.status || 'published'}`}>
                          {s.status || 'published'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4 }}>
                        /services/{s.slug} · Order #{s.order}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="kr8-cms-panel">
                {!selectedService ? (
                  <p style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>
                    Select a commercial service to edit its positioning, deliverables, outcomes,
                    display order, image, or publication status — or add a new service line.
                  </p>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const saved = await cmsMutate({
                        entity: 'service',
                        action: 'save',
                        id: selectedService.id,
                        data: selectedService,
                      });
                      if (saved && typeof saved === 'object') setSelectedService(saved);
                    }}
                    style={{ display: 'grid', gap: 16 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>
                        {selectedService.name || 'New Commercial Service'}
                      </h3>
                      {selectedService.slug && (
                        <a
                          href={`/services/${selectedService.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost"
                          style={{ padding: '7px 12px', fontSize: 12.5 }}
                        >
                          View /services/{selectedService.slug} ↗
                        </a>
                      )}
                    </div>

                    <div className="kr8-grid-3">
                      <label className="field">
                        <span>Service Name *</span>
                        <input
                          required
                          value={selectedService.name || ''}
                          onChange={(e) =>
                            setSelectedService({
                              ...selectedService,
                              name: e.target.value,
                              short: selectedService.short || e.target.value,
                              nav: selectedService.nav || e.target.value,
                            })
                          }
                        />
                      </label>
                      <label className="field">
                        <span>URL Slug *</span>
                        <input
                          required
                          value={selectedService.slug || ''}
                          onChange={(e) => setSelectedService({ ...selectedService, slug: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Status &amp; Order</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 84px', gap: 8 }}>
                          <select
                            value={selectedService.status || 'published'}
                            onChange={(e) => setSelectedService({ ...selectedService, status: e.target.value })}
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>
                          <input
                            type="number"
                            value={selectedService.order ?? 1}
                            onChange={(e) =>
                              setSelectedService({ ...selectedService, order: Number(e.target.value) })
                            }
                          />
                        </div>
                      </label>
                    </div>

                    <div className="kr8-grid-2">
                      <label className="field">
                        <span>Tagline *</span>
                        <input
                          required
                          value={selectedService.tagline || ''}
                          onChange={(e) => setSelectedService({ ...selectedService, tagline: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Feature Image Path / URL</span>
                        <input
                          value={selectedService.image || ''}
                          onChange={(e) => setSelectedService({ ...selectedService, image: e.target.value })}
                        />
                      </label>
                    </div>

                    <label className="field">
                      <span>Executive Summary</span>
                      <textarea
                        rows={2}
                        value={selectedService.summary || ''}
                        onChange={(e) => setSelectedService({ ...selectedService, summary: e.target.value })}
                      />
                    </label>

                    <label className="field">
                      <span>Detailed Service Description</span>
                      <textarea
                        rows={4}
                        value={selectedService.body || ''}
                        onChange={(e) => setSelectedService({ ...selectedService, body: e.target.value })}
                      />
                    </label>

                    <div className="kr8-grid-2">
                      <label className="field">
                        <span>Deliverables (one per line)</span>
                        <textarea
                          rows={5}
                          value={(selectedService.deliverables || []).join('\n')}
                          onChange={(e) =>
                            setSelectedService({
                              ...selectedService,
                              deliverables: e.target.value.split('\n').filter((x) => x.trim()),
                            })
                          }
                        />
                      </label>
                      <label className="field">
                        <span>Client Outcomes (one per line)</span>
                        <textarea
                          rows={5}
                          value={(selectedService.outcomes || []).join('\n')}
                          onChange={(e) =>
                            setSelectedService({
                              ...selectedService,
                              outcomes: e.target.value.split('\n').filter((x) => x.trim()),
                            })
                          }
                        />
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="submit" className="btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Save Service'} <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================================================= 4. PROGRAMS */}
          {tab === 'programs' && (
            <div className="kr8-cms-split">
              <div className="kr8-cms-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>Programs ({programs.length})</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '7px 13px', fontSize: 12.5 }}
                    onClick={() =>
                      setSelectedProgram({
                        slug: '',
                        num: `0${programs.length + 1}`,
                        order: programs.length + 1,
                        visibility: 'active',
                        name: '',
                        tag: 'Ecosystem Initiative',
                        status: 'Active Initiative',
                        headline: '',
                        body: '',
                        tracks: [],
                        cadence: '',
                        image: '/img/programs/free-training-academy.webp',
                        imageAlt: 'KR8 DIGITALS program',
                        cta: { label: 'Learn More', href: '/contact', external: false },
                      })
                    }
                  >
                    + Add Program
                  </button>
                </div>
                <div className="kr8-cms-list">
                  {programs.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`kr8-cms-item${selectedProgram?.id === p.id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedProgram(structuredClone(p))}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{p.name}</strong>
                        <span className={`kr8-cms-status ${p.visibility || 'active'}`}>
                          {p.visibility || 'active'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4 }}>{p.status}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="kr8-cms-panel">
                {!selectedProgram ? (
                  <p style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>
                    Select a program to update its availability badge, cohort status, tracks, CTA
                    destination, or visibility on <code>/programs</code>.
                  </p>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const saved = await cmsMutate({
                        entity: 'program',
                        action: 'save',
                        id: selectedProgram.id,
                        data: selectedProgram,
                      });
                      if (saved && typeof saved === 'object') setSelectedProgram(saved);
                    }}
                    style={{ display: 'grid', gap: 16 }}
                  >
                    <div className="kr8-grid-3">
                      <label className="field">
                        <span>Program Name *</span>
                        <input
                          required
                          value={selectedProgram.name || ''}
                          onChange={(e) => setSelectedProgram({ ...selectedProgram, name: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Public Availability Badge *</span>
                        <input
                          required
                          placeholder="e.g. Recurring Live Editions · Twice Monthly"
                          value={selectedProgram.status || ''}
                          onChange={(e) => setSelectedProgram({ ...selectedProgram, status: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Visibility State</span>
                        <select
                          value={selectedProgram.visibility || 'active'}
                          onChange={(e) => setSelectedProgram({ ...selectedProgram, visibility: e.target.value })}
                        >
                          <option value="active">Active on /programs</option>
                          <option value="coming_soon">Coming Soon</option>
                          <option value="archived">Archived (Hidden)</option>
                        </select>
                      </label>
                    </div>

                    <div className="kr8-grid-2">
                      <label className="field">
                        <span>Program Tag / Pillar</span>
                        <input
                          value={selectedProgram.tag || ''}
                          onChange={(e) => setSelectedProgram({ ...selectedProgram, tag: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Headline</span>
                        <input
                          value={selectedProgram.headline || ''}
                          onChange={(e) => setSelectedProgram({ ...selectedProgram, headline: e.target.value })}
                        />
                      </label>
                    </div>

                    <label className="field">
                      <span>Program Description</span>
                      <textarea
                        rows={4}
                        value={selectedProgram.body || ''}
                        onChange={(e) => setSelectedProgram({ ...selectedProgram, body: e.target.value })}
                      />
                    </label>

                    <label className="field">
                      <span>Tracks / Pillars (one per line)</span>
                      <textarea
                        rows={4}
                        value={(selectedProgram.tracks || []).join('\n')}
                        onChange={(e) =>
                          setSelectedProgram({
                            ...selectedProgram,
                            tracks: e.target.value.split('\n').filter((x) => x.trim()),
                          })
                        }
                      />
                    </label>

                    <div className="kr8-grid-3">
                      <label className="field">
                        <span>CTA Button Label</span>
                        <input
                          value={selectedProgram.cta?.label || ''}
                          onChange={(e) =>
                            setSelectedProgram({
                              ...selectedProgram,
                              cta: { ...(selectedProgram.cta || {}), label: e.target.value },
                            })
                          }
                        />
                      </label>
                      <label className="field">
                        <span>CTA Destination URL</span>
                        <input
                          value={selectedProgram.cta?.href || ''}
                          onChange={(e) =>
                            setSelectedProgram({
                              ...selectedProgram,
                              cta: { ...(selectedProgram.cta || {}), href: e.target.value },
                            })
                          }
                        />
                      </label>
                      <label className="field">
                        <span>Program Image Path</span>
                        <input
                          value={selectedProgram.image || ''}
                          onChange={(e) => setSelectedProgram({ ...selectedProgram, image: e.target.value })}
                        />
                      </label>
                    </div>

                    <div>
                      <button type="submit" className="btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Save Program'} <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================================================= 5. TEAM & FOUNDERS */}
          {tab === 'team' && (
            <div className="kr8-cms-split">
              <div className="kr8-cms-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>Founders &amp; Team</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '7px 13px', fontSize: 12.5 }}
                    onClick={() =>
                      setSelectedMember({
                        slug: '',
                        name: '',
                        fullName: '',
                        role: '',
                        group: 'leadership',
                        order: team.length + 1,
                        status: 'published',
                        photo: '',
                        headline: '',
                        bio: '',
                        quote: '',
                        focus: [],
                      })
                    }
                  >
                    + Add Member
                  </button>
                </div>
                <div className="kr8-cms-list">
                  {team.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`kr8-cms-item${selectedMember?.id === m.id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedMember(structuredClone(m))}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{m.name}</strong>
                        <span className={`kr8-cms-status ${m.status || 'published'}`}>
                          {m.group === 'founder' ? 'Founder' : 'Team'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4 }}>
                        {m.fullName} · {m.role}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="kr8-cms-panel">
                {!selectedMember ? (
                  <p style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>
                    Select a founder or team member to edit their profile, bio, executive quote,
                    portrait URL, or role. Exact display spellings (<code>Timfire</code>,{' '}
                    <code>Steveoking</code> / <code>Stevenson</code>,{' '}
                    <code>Creative Expression</code>) are strictly preserved without character
                    splitting.
                  </p>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const saved = await cmsMutate({
                        entity: 'team',
                        action: 'save',
                        id: selectedMember.id,
                        data: selectedMember,
                      });
                      if (saved && typeof saved === 'object') setSelectedMember(saved);
                    }}
                    style={{ display: 'grid', gap: 16 }}
                  >
                    <div className="kr8-grid-3">
                      <label className="field">
                        <span>Display Name * (Exact Spelling)</span>
                        <input
                          required
                          value={selectedMember.name || ''}
                          onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Full Legal / Personal Name</span>
                        <input
                          value={selectedMember.fullName || ''}
                          onChange={(e) => setSelectedMember({ ...selectedMember, fullName: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Group &amp; Status</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <select
                            value={selectedMember.group || 'leadership'}
                            onChange={(e) => setSelectedMember({ ...selectedMember, group: e.target.value })}
                          >
                            <option value="founder">Founder</option>
                            <option value="leadership">Leadership / Team</option>
                          </select>
                          <select
                            value={selectedMember.status || 'published'}
                            onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value })}
                          >
                            <option value="published">Published</option>
                            <option value="archived">Hidden</option>
                          </select>
                        </div>
                      </label>
                    </div>

                    <div className="kr8-grid-2">
                      <label className="field">
                        <span>Official Role Title *</span>
                        <input
                          required
                          value={selectedMember.role || ''}
                          onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Portrait Image Path / Media URL</span>
                        <input
                          value={selectedMember.photo || ''}
                          onChange={(e) => setSelectedMember({ ...selectedMember, photo: e.target.value })}
                        />
                      </label>
                    </div>

                    <label className="field">
                      <span>Profile Headline</span>
                      <input
                        value={selectedMember.headline || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, headline: e.target.value })}
                      />
                    </label>

                    <label className="field">
                      <span>Biography</span>
                      <textarea
                        rows={4}
                        value={selectedMember.bio || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, bio: e.target.value })}
                      />
                    </label>

                    <div className="kr8-grid-2">
                      <label className="field">
                        <span>Executive Quote</span>
                        <textarea
                          rows={3}
                          value={selectedMember.quote || ''}
                          onChange={(e) => setSelectedMember({ ...selectedMember, quote: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Focus Disciplines (one per line)</span>
                        <textarea
                          rows={3}
                          value={(selectedMember.focus || []).join('\n')}
                          onChange={(e) =>
                            setSelectedMember({
                              ...selectedMember,
                              focus: e.target.value.split('\n').filter((x) => x.trim()),
                            })
                          }
                        />
                      </label>
                    </div>

                    <div>
                      <button type="submit" className="btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Save Profile'} <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================================================= 6. PARTNERS & PROPOSALS */}
          {tab === 'partners' && (
            <div style={{ display: 'grid', gap: 18 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className={partnerSubTab === 'proposals' ? 'btn-primary' : 'btn-ghost'}
                  style={{ padding: '9px 16px', fontSize: 13 }}
                  onClick={() => setPartnerSubTab('proposals')}
                >
                  Incoming Proposals ({proposals.length})
                </button>
                <button
                  type="button"
                  className={partnerSubTab === 'partners' ? 'btn-primary' : 'btn-ghost'}
                  style={{ padding: '9px 16px', fontSize: 13 }}
                  onClick={() => setPartnerSubTab('partners')}
                >
                  Published Partners ({partners.length})
                </button>
              </div>

              {partnerSubTab === 'proposals' ? (
                <div className="kr8-cms-split">
                  <div className="kr8-cms-panel">
                    <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18, marginBottom: 12 }}>
                      Submitted Proposals
                    </h3>
                    {proposals.length === 0 ? (
                      <p style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>
                        Proposals submitted via <code>/partners#propose</code> appear here in real time.
                      </p>
                    ) : (
                      <div className="kr8-cms-list">
                        {proposals.map((pr) => (
                          <button
                            key={pr.id}
                            type="button"
                            className={`kr8-cms-item${selectedProposal?.id === pr.id ? ' is-selected' : ''}`}
                            onClick={() => setSelectedProposal(structuredClone(pr))}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong>{pr.organisation}</strong>
                              <span className={`kr8-cms-status ${pr.status || 'new'}`}>
                                {pr.status || 'new'}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4 }}>
                              {pr.contactName} · {pr.track}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="kr8-cms-panel">
                    {!selectedProposal ? (
                      <p style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>
                        Select an incoming partnership proposal to review alignment, record internal
                        notes, update status, or promote the organisation directly to a published
                        KR8 DIGITALS Partner.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 10 }}>
                          <div>
                            <span className="eyebrow">{selectedProposal.track}</span>
                            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 24, marginTop: 4 }}>
                              {selectedProposal.organisation}
                            </h3>
                            <div style={{ fontSize: 13.5, color: 'var(--t-muted)', marginTop: 4 }}>
                              Contact: <strong style={{ color: 'var(--t-strong)' }}>{selectedProposal.contactName}</strong>
                              {selectedProposal.role ? ` (${selectedProposal.role})` : ''} ·{' '}
                              <a href={`mailto:${selectedProposal.email}`} style={{ color: 'var(--magenta)' }}>
                                {selectedProposal.email}
                              </a>
                          {selectedProposal.phone ? ` · ${selectedProposal.phone}` : ''}
                          <div style={{ marginTop: 5, fontSize: 12 }}>
                            CTA: <strong>{selectedProposal.ctaLabel || selectedProposal.ctaId || 'Direct / legacy'}</strong>
                            {selectedProposal.ctaSourcePath ? ` · FROM: ${selectedProposal.ctaSourcePath}` : ''}
                            {selectedProposal.ctaId ? ` · ID: ${selectedProposal.ctaId}` : ''}
                          </div>
                        </div>
                          </div>
                          <span className={`kr8-cms-status ${selectedProposal.status || 'new'}`}>
                            {selectedProposal.status || 'new'}
                          </span>
                        </div>

                        <div style={{ padding: 16, borderRadius: 14, background: 'var(--surface-subtle)' }}>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--magenta)' }}>
                            PROPOSAL SUMMARY
                          </div>
                          <p style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.65 }}>
                            {selectedProposal.summary}
                          </p>
                          {selectedProposal.mutualValue && (
                            <>
                              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--magenta)', marginTop: 14 }}>
                                MUTUAL VALUE &amp; TIMELINE
                              </div>
                              <p style={{ marginTop: 6, fontSize: 14, color: 'var(--t-body)' }}>
                                {selectedProposal.mutualValue}
                                {selectedProposal.timeline ? ` — Timeline: ${selectedProposal.timeline}` : ''}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="kr8-grid-2">
                          <label className="field">
                            <span>Review Status</span>
                            <select
                              value={selectedProposal.status || 'new'}
                              onChange={(e) =>
                                setSelectedProposal({ ...selectedProposal, status: e.target.value })
                              }
                            >
                              <option value="new">New</option>
                              <option value="reviewing">In Executive Review</option>
                              <option value="approved">Approved</option>
                              <option value="declined">Declined</option>
                            </select>
                          </label>
                          <label className="field">
                            <span>Internal Review Notes</span>
                            <input
                              value={selectedProposal.adminNotes || ''}
                              onChange={(e) =>
                                setSelectedProposal({ ...selectedProposal, adminNotes: e.target.value })
                              }
                              placeholder="Notes for founders…"
                            />
                          </label>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={busy}
                            onClick={() =>
                              cmsMutate({
                                action: 'proposal_status',
                                id: selectedProposal.id,
                                data: {
                                  status: selectedProposal.status,
                                  adminNotes: selectedProposal.adminNotes,
                                },
                              })
                            }
                          >
                            Save Review Status
                          </button>
                          <button
                            type="button"
                            className="btn-ghost"
                            disabled={busy}
                            onClick={async () => {
                              await cmsMutate({
                                action: 'proposal_promote',
                                id: selectedProposal.id,
                              });
                              setPartnerSubTab('partners');
                            }}
                          >
                            ★ Approve &amp; Publish to /partners
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="kr8-cms-split">
                  <div className="kr8-cms-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>Active Partners</h3>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '7px 13px', fontSize: 12.5 }}
                        onClick={() =>
                          setSelectedPartner({
                            slug: '',
                            name: '',
                            person: '',
                            role: 'Strategic Partner',
                            type: 'Strategic Partner',
                            mark: 'KP',
                            order: partners.length + 1,
                            status: 'published',
                            blurb: '',
                            long: '',
                            contribution: '',
                            teaches: '',
                          })
                        }
                      >
                        + Add Partner
                      </button>
                    </div>
                    <div className="kr8-cms-list">
                      {partners.map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          className={`kr8-cms-item${selectedPartner?.id === pt.id ? ' is-selected' : ''}`}
                          onClick={() => setSelectedPartner(structuredClone(pt))}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>{pt.name}</strong>
                            <span className={`kr8-cms-status ${pt.status || 'published'}`}>
                              {pt.status || 'published'}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4 }}>
                            {pt.role} · /partners/{pt.slug}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="kr8-cms-panel">
                    {!selectedPartner ? (
                      <p style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>
                        Select a partner to edit its chapter details on <code>/partners</code> and{' '}
                        <code>/partners/[slug]</code>.
                      </p>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const saved = await cmsMutate({
                            entity: 'partner',
                            action: 'save',
                            id: selectedPartner.id,
                            data: selectedPartner,
                          });
                          if (saved && typeof saved === 'object') setSelectedPartner(saved);
                        }}
                        style={{ display: 'grid', gap: 16 }}
                      >
                        <div className="kr8-grid-3">
                          <label className="field">
                            <span>Partner Name *</span>
                            <input
                              required
                              value={selectedPartner.name || ''}
                              onChange={(e) => setSelectedPartner({ ...selectedPartner, name: e.target.value })}
                            />
                          </label>
                          <label className="field">
                            <span>Lead Person / Founder</span>
                            <input
                              value={selectedPartner.person || ''}
                              onChange={(e) => setSelectedPartner({ ...selectedPartner, person: e.target.value })}
                            />
                          </label>
                          <label className="field">
                            <span>Monogram &amp; Status</span>
                            <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 8 }}>
                              <input
                                maxLength={3}
                                value={selectedPartner.mark || ''}
                                onChange={(e) =>
                                  setSelectedPartner({ ...selectedPartner, mark: e.target.value.toUpperCase() })
                                }
                              />
                              <select
                                value={selectedPartner.status || 'published'}
                                onChange={(e) => setSelectedPartner({ ...selectedPartner, status: e.target.value })}
                              >
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                          </label>
                        </div>

                        <div className="kr8-grid-2">
                          <label className="field">
                            <span>Partner Role / Discipline</span>
                            <input
                              value={selectedPartner.role || ''}
                              onChange={(e) => setSelectedPartner({ ...selectedPartner, role: e.target.value })}
                            />
                          </label>
                          <label className="field">
                            <span>Partnership Category</span>
                            <input
                              value={selectedPartner.type || ''}
                              onChange={(e) => setSelectedPartner({ ...selectedPartner, type: e.target.value })}
                            />
                          </label>
                        </div>

                        <label className="field">
                          <span>Card Summary (Blurb)</span>
                          <textarea
                            rows={2}
                            value={selectedPartner.blurb || ''}
                            onChange={(e) => setSelectedPartner({ ...selectedPartner, blurb: e.target.value })}
                          />
                        </label>

                        <label className="field">
                          <span>Full Chapter Narrative (/partners/[slug])</span>
                          <textarea
                            rows={4}
                            value={selectedPartner.long || ''}
                            onChange={(e) => setSelectedPartner({ ...selectedPartner, long: e.target.value })}
                          />
                        </label>

                        <div>
                          <button type="submit" className="btn-primary" disabled={busy}>
                            {busy ? 'Saving…' : 'Save Partner'} <Icon name="arrow" size={16} />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================= 7. MEDIA LIBRARY */}
          {tab === 'media' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div className="kr8-cms-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    placeholder="Search title or alt text…"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    style={{ width: 240 }}
                  />
                  <select value={mediaFilter} onChange={(e) => setMediaFilter(e.target.value)} style={{ width: 170 }}>
                    <option value="all">All Categories</option>
                    <option value="founders">Founders</option>
                    <option value="services">Services</option>
                    <option value="programs">Programs</option>
                    <option value="about">About &amp; Studio</option>
                    <option value="partners">Partners</option>
                    <option value="uploads">Uploaded Assets</option>
                  </select>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: 13 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy}
                  >
                    + Upload Image Asset
                  </button>
                </div>
              </div>

              <div className="kr8-cms-split kr8-cms-media-split">
                <div className="kr8-cms-panel">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 12 }}>
                    {media
                      .filter((m) => mediaFilter === 'all' || m.category === mediaFilter)
                      .filter(
                        (m) =>
                          !mediaSearch ||
                          `${m.title} ${m.alt}`.toLowerCase().includes(mediaSearch.toLowerCase())
                      )
                      .map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMedia(structuredClone(m))}
                          style={{
                            padding: 8,
                            borderRadius: 14,
                            background:
                              selectedMedia?.id === m.id
                                ? 'rgba(124,58,237,0.28)'
                                : 'var(--surface-input)',
                            border: `1px solid ${
                              selectedMedia?.id === m.id
                                ? 'rgba(232,121,249,0.6)'
                                : 'var(--border-subtle)'
                            }`,
                            cursor: 'pointer',
                            textAlign: 'left',
                            color: 'var(--t-strong)',
                          }}
                        >
                          <div
                            style={{
                              aspectRatio: '4 / 3',
                              borderRadius: 9,
                              overflow: 'hidden',
                              background: 'var(--surface-elevated)',
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.url}
                              alt={m.alt}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              marginTop: 7,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {m.title}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                <div className="kr8-cms-panel">
                  {!selectedMedia ? (
                    <p style={{ color: 'var(--t-muted)', fontSize: 14 }}>
                      Click any visual asset to inspect its preview, copy its URL for Pages/Services,
                      replace the image file, or update accessibility alt text.
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: 14 }}>
                      <div
                        style={{
                          maxHeight: 280,
                          borderRadius: 14,
                          overflow: 'hidden',
                          background: 'var(--surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedMedia.url}
                          alt={selectedMedia.alt}
                          style={{ width: '100%', maxHeight: 280, objectFit: 'contain' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ padding: '7px 12px', fontSize: 12 }}
                          onClick={() => {
                            navigator.clipboard?.writeText(selectedMedia.url);
                            flash('Asset URL copied to clipboard');
                          }}
                        >
                          Copy URL ({selectedMedia.url})
                        </button>

                        <input
                          ref={replaceInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileUpload(f, selectedMedia.id);
                            e.target.value = '';
                          }}
                        />
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ padding: '7px 12px', fontSize: 12 }}
                          onClick={() => replaceInputRef.current?.click()}
                        >
                          Replace File
                        </button>
                      </div>

                      <label className="field">
                        <span>Asset Title</span>
                        <input
                          value={selectedMedia.title || ''}
                          onChange={(e) => setSelectedMedia({ ...selectedMedia, title: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Accessibility Alt Text</span>
                        <input
                          value={selectedMedia.alt || ''}
                          onChange={(e) => setSelectedMedia({ ...selectedMedia, alt: e.target.value })}
                        />
                      </label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          type="button"
                          className="btn-primary"
                          disabled={busy}
                          onClick={async () => {
                            const r = await fetch('/api/admin/media', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'update',
                                id: selectedMedia.id,
                                title: selectedMedia.title,
                                alt: selectedMedia.alt,
                                category: selectedMedia.category,
                                status: selectedMedia.status || 'active',
                              }),
                            });
                            if (r.ok) {
                              flash('Media metadata saved');
                              await load();
                            }
                          }}
                        >
                          Save Alt &amp; Title
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= 8. NAVIGATION & GLOBAL */}
          {tab === 'navigation' && navDraft && (
            <form
              className="kr8-cms-panel"
              onSubmit={async (e) => {
                e.preventDefault();
                const saved = await cmsMutate({
                  entity: 'navigation',
                  action: 'save',
                  id: navDraft.id || 'global-nav',
                  data: { ...navDraft, id: navDraft.id || 'global-nav' },
                });
                if (saved && typeof saved === 'object') setNavDraft(saved);
              }}
              style={{ display: 'grid', gap: 20 }}
            >
              <div>
                <span className="eyebrow">Live Header &amp; Footer Control</span>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 4 }}>
                  Global Navigation, CTA &amp; Contact Channels
                </h3>
              </div>

              <div className="kr8-grid-2">
                <label className="field">
                  <span>Header Primary CTA Label</span>
                  <input
                    value={navDraft.ctaLabel || ''}
                    onChange={(e) => setNavDraft({ ...navDraft, ctaLabel: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Header Primary CTA Destination</span>
                  <input
                    value={navDraft.ctaHref || ''}
                    onChange={(e) => setNavDraft({ ...navDraft, ctaHref: e.target.value })}
                  />
                </label>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <strong>Primary Navigation Links</strong>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={() =>
                      setNavDraft({
                        ...navDraft,
                        headerLinks: [
                          ...(navDraft.headerLinks || []),
                          {
                            id: `nav_${Date.now()}`,
                            label: 'New Link',
                            href: '/',
                            order: (navDraft.headerLinks?.length || 0) + 1,
                            visible: true,
                          },
                        ],
                      })
                    }
                  >
                    + Add Menu Item
                  </button>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {(navDraft.headerLinks || []).map((lnk: any, idx: number) => (
                    <div
                      key={lnk.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 1fr 1fr 110px 70px',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      <input
                        type="number"
                        value={lnk.order ?? idx + 1}
                        onChange={(e) => {
                          const next = [...navDraft.headerLinks];
                          next[idx] = { ...lnk, order: Number(e.target.value) };
                          setNavDraft({ ...navDraft, headerLinks: next });
                        }}
                      />
                      <input
                        value={lnk.label}
                        placeholder="Label"
                        onChange={(e) => {
                          const next = [...navDraft.headerLinks];
                          next[idx] = { ...lnk, label: e.target.value };
                          setNavDraft({ ...navDraft, headerLinks: next });
                        }}
                      />
                      <input
                        value={lnk.href}
                        placeholder="/route"
                        onChange={(e) => {
                          const next = [...navDraft.headerLinks];
                          next[idx] = { ...lnk, href: e.target.value };
                          setNavDraft({ ...navDraft, headerLinks: next });
                        }}
                      />
                      <select
                        value={lnk.visible === false ? 'no' : 'yes'}
                        onChange={(e) => {
                          const next = [...navDraft.headerLinks];
                          next[idx] = { ...lnk, visible: e.target.value === 'yes' };
                          setNavDraft({ ...navDraft, headerLinks: next });
                        }}
                      >
                        <option value="yes">Visible</option>
                        <option value="no">Hidden</option>
                      </select>
                      <button
                        type="button"
                        style={{ background: 'none', border: 0, color: 'var(--status-err-fg)', cursor: 'pointer', fontSize: 12 }}
                        onClick={() => {
                          const next = [...navDraft.headerLinks];
                          next.splice(idx, 1);
                          setNavDraft({ ...navDraft, headerLinks: next });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="kr8-grid-3">
                <label className="field">
                  <span>Official Email</span>
                  <input
                    value={navDraft.companyEmail || ''}
                    onChange={(e) => setNavDraft({ ...navDraft, companyEmail: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Studio Phone</span>
                  <input
                    value={navDraft.companyPhone || ''}
                    onChange={(e) => setNavDraft({ ...navDraft, companyPhone: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>WhatsApp Link</span>
                  <input
                    value={navDraft.companyWhatsapp || ''}
                    onChange={(e) => setNavDraft({ ...navDraft, companyWhatsapp: e.target.value })}
                  />
                </label>
              </div>

              <label className="field">
                <span>Footer Brand Summary</span>
                <textarea
                  rows={2}
                  value={navDraft.shortDescription || ''}
                  onChange={(e) => setNavDraft({ ...navDraft, shortDescription: e.target.value })}
                />
              </label>

              <div>
                <button type="submit" className="btn-primary" disabled={busy}>
                  {busy ? 'Saving…' : 'Save Navigation & Contact Info'} <Icon name="arrow" size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ================================================= 9. SEO & OPENGRAPH */}
          {tab === 'seo' && (
            <div className="kr8-cms-split">
              <div className="kr8-cms-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>Route SEO Rules</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '7px 13px', fontSize: 12.5 }}
                    onClick={() =>
                      setSelectedSeo({
                        route: '/',
                        metaTitle: '',
                        metaDescription: '',
                        ogImage: '/opengraph-image',
                        noindex: false,
                      })
                    }
                  >
                    + Add Route
                  </button>
                </div>
                <div className="kr8-cms-list">
                  {seoList.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`kr8-cms-item${selectedSeo?.id === s.id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedSeo(structuredClone(s))}
                    >
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--magenta)' }}>
                        {s.route}
                      </div>
                      <div style={{ fontSize: 12.5, marginTop: 4 }}>{s.metaTitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="kr8-cms-panel">
                {!selectedSeo ? (
                  <p style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>
                    Select a route to edit its search title, meta description, OpenGraph preview
                    image, and indexing directive.
                  </p>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const saved = await cmsMutate({
                        entity: 'seo',
                        action: 'save',
                        id: selectedSeo.id,
                        data: selectedSeo,
                      });
                      if (saved && typeof saved === 'object') setSelectedSeo(saved);
                    }}
                    style={{ display: 'grid', gap: 16 }}
                  >
                    <div className="kr8-grid-2">
                      <label className="field">
                        <span>Route Path *</span>
                        <input
                          required
                          value={selectedSeo.route || ''}
                          onChange={(e) => setSelectedSeo({ ...selectedSeo, route: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>Search Engine Indexing</span>
                        <select
                          value={selectedSeo.noindex ? 'noindex' : 'index'}
                          onChange={(e) =>
                            setSelectedSeo({ ...selectedSeo, noindex: e.target.value === 'noindex' })
                          }
                        >
                          <option value="index">Index &amp; Follow (Recommended)</option>
                          <option value="noindex">Noindex (Hide from Search)</option>
                        </select>
                      </label>
                    </div>
                    <label className="field">
                      <span>Meta Title *</span>
                      <input
                        required
                        value={selectedSeo.metaTitle || ''}
                        onChange={(e) => setSelectedSeo({ ...selectedSeo, metaTitle: e.target.value })}
                      />
                    </label>
                    <label className="field">
                      <span>Meta Description *</span>
                      <textarea
                        rows={3}
                        required
                        value={selectedSeo.metaDescription || ''}
                        onChange={(e) =>
                          setSelectedSeo({ ...selectedSeo, metaDescription: e.target.value })
                        }
                      />
                    </label>
                    <label className="field">
                      <span>OpenGraph Share Image URL</span>
                      <input
                        value={selectedSeo.ogImage || ''}
                        onChange={(e) => setSelectedSeo({ ...selectedSeo, ogImage: e.target.value })}
                      />
                    </label>
                    <div>
                      <button type="submit" className="btn-primary" disabled={busy}>
                        Save SEO Metadata <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================================================= 10. LEADS & SUBMISSIONS */}
          {tab === 'leads' && (
            <div className="kr8-cms-panel" style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['all', 'new', 'contacted', 'qualified', 'won', 'archived'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={leadFilter === st ? 'btn-primary' : 'btn-ghost'}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => setLeadFilter(st)}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--t-muted)' }}>
                    CTA source
                    <select value={leadCtaFilter} onChange={(e) => setLeadCtaFilter(e.target.value)} style={{ minWidth: 190, padding: '7px 10px', fontSize: 12 }}>
                      <option value="all">All CTA sources</option>
                      {Array.from(new Set((data.leads || []).map((lead: any) => lead.ctaId).filter(Boolean))).map((ctaId: any) => {
                        const lead = (data.leads || []).find((item: any) => item.ctaId === ctaId);
                        return <option key={ctaId} value={ctaId}>{lead?.ctaLabel || ctaId}</option>;
                      })}
                    </select>
                  </label>
                  <a
                  href="/api/admin/export?col=leads"
                  className="btn-ghost"
                  style={{ padding: '7px 13px', fontSize: 12.5 }}
                >
                  Export CSV ↓
                  </a>
                </div>
              </div>

              {(data.leads || []).filter((l: any) => (leadFilter === 'all' || l.status === leadFilter) && (leadCtaFilter === 'all' || l.ctaId === leadCtaFilter)).length ===
              0 ? (
                <p style={{ color: 'var(--t-muted)', fontSize: 14 }}>
                  No submissions match this filter yet. Enquiries from Contact, Join the Team,
                  KR8 DIGITALS TRIBE, and Mindset Shift RSVP appear here automatically.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {(data.leads || [])
                    .filter((l: any) => (leadFilter === 'all' || l.status === leadFilter) && (leadCtaFilter === 'all' || l.ctaId === leadCtaFilter))
                    .map((l: any) => (
                      <div
                        key={l.id}
                        style={{
                          padding: 16,
                          borderRadius: 14,
                          background: 'var(--surface-input)',
                          border: '1px solid var(--border-subtle)',
                          display: 'grid',
                          gap: 8,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <div>
                            <strong>{l.name}</strong> ·{' '}
                            <a href={`mailto:${l.email}`} style={{ color: 'var(--magenta)' }}>
                              {l.email}
                            </a>
                            {l.phone ? ` · ${l.phone}` : ''}
                          </div>
                          <select
                            value={l.status || 'new'}
                            style={{ width: 150, padding: '5px 10px', fontSize: 12.5 }}
                            onChange={(e) =>
                              legacyAction({ op: 'lead.status', id: l.id, status: e.target.value })
                            }
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="won">Won</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--f-mono)', color: 'var(--t-muted)' }}>
                          TYPE: {l.kind || l.type || 'quote'} {l.service ? `· SERVICE: ${l.service}` : ''}{' '}
                          {l.budget ? `· BUDGET: ${l.budget}` : ''}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--t-muted)' }}>
                          CTA: <strong>{l.ctaLabel || l.ctaId || l.siteId || l.source || 'Direct / legacy'}</strong>
                          {l.ctaSourcePath ? ` · FROM: ${l.ctaSourcePath}` : ''}
                          {l.ctaId && l.ctaLabel ? ` · ID: ${l.ctaId}` : ''}
                        </div>
                        {l.message && <p style={{ fontSize: 14, color: 'var(--t-body)' }}>{l.message}</p>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================= 11. RIYA INTELLIGENCE & CONTROL CENTRE */}
          {tab === 'host' && <RiyaAdminPanel onToast={flash} />}

          {/* ================================================= 12. REFERRALS */}
          {tab === 'referrals' && (
            <div className="kr8-cms-panel" style={{ display: 'grid', gap: 18 }}>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 20 }}>
                Registered Referrers ({(data.referrals || []).length}) &amp; Commissions (
                {(data.commissions || []).length})
              </h3>
              {(data.referrals || []).length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--t-muted)' }}>
                  Partners who register on <code>/referrals</code> appear here with their unique
                  tracking codes and payout details.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {(data.referrals || []).map((r: any) => (
                    <div
                      key={r.id}
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        background: 'var(--surface-input)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      <div>
                        <strong>{r.name}</strong> ({r.email}) · Code:{' '}
                        <code style={{ color: 'var(--magenta)' }}>{r.code}</code>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--t-muted)' }}>
                        Clicks: {r.clicks || 0} · Leads: {r.leads || 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================= 13. ORDERS & SETTINGS */}
          {tab === 'orders' && (
            <div className="kr8-grid-2">
              <div className="kr8-cms-panel">
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 20, marginBottom: 12 }}>
                  Client Orders ({(data.orders || []).length})
                </h3>
                {(data.orders || []).length === 0 ? (
                  <p style={{ fontSize: 14, color: 'var(--t-muted)' }}>
                    Checkout and milestone orders appear here with live status verification.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {(data.orders || []).map((o: any) => (
                      <div
                        key={o.id}
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          background: 'var(--surface-subtle)',
                          fontSize: 13.5,
                        }}
                      >
                        <strong>{o.reference || o.ref}</strong> · {o.item || o.service || o.tier} · {o.name || 'Customer'} ·{' '}
                        <span className={`kr8-cms-status ${o.status || 'pending'}`}>{o.status}</span>
                        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--t-muted)' }}>
                          CTA: {o.ctaLabel || o.ctaId || o.siteId || 'Direct / legacy'}
                          {o.ctaSourcePath ? ` · FROM: ${o.ctaSourcePath}` : ''}
                          {o.ctaId ? ` · ID: ${o.ctaId}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form
                className="kr8-cms-panel"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await legacyAction({ op: 'settings.save', values: settingsDraft });
                }}
                style={{ display: 'grid', gap: 14 }}
              >
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 20 }}>
                  Studio Notifications &amp; Gateways
                </h3>
                <label className="field">
                  <span>Notification Email</span>
                  <input
                    value={settingsDraft.notify_email || ''}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, notify_email: e.target.value })
                    }
                    placeholder="hello@kr8digitals.com"
                  />
                </label>
                <label className="field">
                  <span>Instant Webhook URL (Slack / Discord / Telegram)</span>
                  <input
                    value={settingsDraft.notify_webhook_url || ''}
                    onChange={(e) =>
                      setSettingsDraft({ ...settingsDraft, notify_webhook_url: e.target.value })
                    }
                    placeholder="https://hooks.slack.com/..."
                  />
                </label>
                <div>
                  <button type="submit" className="btn-primary" disabled={busy}>
                    Save Studio Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================= 14. REVISION HISTORY */}
          {tab === 'revisions' && (
            <div className="kr8-cms-panel" style={{ display: 'grid', gap: 14 }}>
              <div>
                <span className="eyebrow">Audit Log &amp; Instant Rollback</span>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 4 }}>
                  CMS Version History ({revisions.length})
                </h3>
              </div>

              {revisions.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--t-muted)' }}>
                  Every content save, creation, deletion, or partner promotion is automatically
                  snapshotted here so you can restore any previous state with one click.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {revisions.map((rev: any) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 14,
                        background: 'var(--surface-input)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 10,
                      }}
                    >
                      <div>
                        <strong>{rev.entityLabel}</strong>{' '}
                        <span className="kr8-cms-status active" style={{ marginLeft: 6 }}>
                          {rev.entityType} · {rev.action}
                        </span>
                        <div style={{ fontSize: 12, color: 'var(--t-muted)', marginTop: 4 }}>
                          {new Date(rev.created_at).toLocaleString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ padding: '7px 13px', fontSize: 12.5 }}
                        disabled={busy}
                        onClick={() => cmsMutate({ action: 'restore', id: rev.id })}
                      >
                        ↺ Restore This Snapshot
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
