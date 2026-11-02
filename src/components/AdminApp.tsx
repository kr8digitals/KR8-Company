'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatMoney } from '@/lib/rates';
import site from '../../data/site.json';
import sitesData from '../../data/sites.json';

type Lead = any;
type Data = {
  driver: string;
  settings?: Record<string, unknown>;
  leads: Lead[];
  referrals: any[];
  commissions: any[];
  host_sessions: any[];
  host_messages: any[];
  orders: any[];
  analytics: { total: number; byName: Record<string, number>; recent: any[] };
  counts: Record<string, number>;
};

const TABS = ['Overview', 'Leads', 'Referrals', 'Orders', 'Conversations', 'Analytics', 'Content'] as const;
type Tab = (typeof TABS)[number];

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];

export default function AdminApp({ configured }: { configured: boolean }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<Tab>('Overview');
  const [filter, setFilter] = useState('all');
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/data', { cache: 'no-store' });
      const json = await res.json();
      if (json.ok) { setData(json); setAuthed(true); }
      else if (json.authed === false) { setAuthed(false); }
      else setErr(json.error || 'Could not load.');
    } catch { setErr('Network problem.'); }
    setBusy(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!json.ok) { setErr(json.error); setBusy(false); return; }
      setPw('');
      await load();
    } catch { setErr('Network problem.'); setBusy(false); }
  }

  const act = useCallback(async (op: string, payload: Record<string, any>) => {
    const res = await fetch('/api/admin/action', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ op, ...payload }),
    });
    const json = await res.json();
    if (!json.ok) { setToast(json.error || 'That did not work.'); return null; }
    setToast('Saved.');
    setTimeout(() => setToast(''), 2400);
    await load();
    return json.doc;
  }, [load]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!configured) {
    return (
      <div className="admin-overlay"><section className="section" style={{ paddingTop: 120, minHeight: '100vh' }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <div className="panel" style={{ padding: 34 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>Locked by default</div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 800, marginTop: 10, letterSpacing: '-.02em' }}>
              Set a password to open the dashboard
            </h1>
            <p style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.7, color: 'var(--t-muted)' }}>
              There is deliberately no default password in this codebase — the last build had one, and it
              was the worst bug in it. Add <code style={{ color: '#fff' }}>ADMIN_PASSWORD</code> (8+
              characters) to the environment, redeploy, and this page unlocks.
            </p>
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--t-faint)' }}>
              Locally: create <code>.env.local</code> with <code>ADMIN_PASSWORD=…</code> and restart.
            </p>
          </div>
        </div>
      </section></div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-overlay"><section className="section" style={{ paddingTop: 120, minHeight: '100vh' }}>
        <div className="wrap" style={{ maxWidth: 460 }}>
          <form className="panel" onSubmit={login} style={{ padding: 32 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>KR8 Digitals · admin</div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 26, fontWeight: 800, marginTop: 10 }}>Sign in</h1>
            <div className="field" style={{ marginTop: 20 }}>
              <label htmlFor="pw">Password</label>
              <input id="pw" className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus required />
            </div>
            {err && <div className="form-status err">{err}</div>}
            <button className="btn-primary" type="submit" disabled={busy} style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>
              {busy ? <><span className="spinner" /> Checking…</> : 'Open dashboard'}
            </button>
            <p className="form-note">Twelve-hour session, http-only cookie, throttled after eight attempts.</p>
          </form>
        </div>
      </section></div>
    );
  }

  if (!data) return <div className="admin-overlay"><section className="section" style={{ paddingTop: 160 }}><div className="wrap"><span className="spinner" /></div></section></div>;

  return (
    <div className="admin-overlay"><div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-side__brand">
          <span style={{ fontWeight: 800, fontFamily: 'Montserrat,sans-serif' }}>KR8<span style={{ color: 'var(--magenta)' }}>Admin</span></span>
          <small style={{ display: 'block', fontSize: 10.5, color: 'var(--t-faint)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 4 }}>
            {data.driver} store
          </small>
        </div>
        <div className="admin-side__grp">
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'is-active' : ''} onClick={() => setTab(t)}>
              {t}
              {t === 'Leads' && data.counts.leadsNew > 0 && <span className="pill" style={{ marginLeft: 8 }}>{data.counts.leadsNew}</span>}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'grid', gap: 8 }}>
          <button onClick={() => fetch('/api/admin/logout', { method: 'POST' }).then(() => setAuthed(false))}>Sign out</button>
          <a href="/" style={{ fontSize: 13, color: 'var(--t-faint)', padding: '8px 12px' }}>← Back to site</a>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <h1>{tab}</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--t-faint)' }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <button className="btn-ghost btn-sm" onClick={load} disabled={busy}>{busy ? 'Loading…' : 'Refresh'}</button>
          </div>
        </div>

        {toast && <div className="form-status ok" style={{ marginBottom: 16 }}>{toast}</div>}

        {tab === 'Overview' && <Overview data={data} onOpen={(l) => { setOpenLead(l); setTab('Leads'); }} />}
        {tab === 'Leads' && <Leads data={data} filter={filter} setFilter={setFilter} openId={openLead?.id} onOpen={setOpenLead} act={act} />}
        {tab === 'Referrals' && <Referrals data={data} act={act} />}
        {tab === 'Orders' && <Orders data={data} act={act} />}
        {tab === 'Conversations' && <Conversations data={data} act={act} />}
        {tab === 'Analytics' && <Analytics data={data} />}
        {tab === 'Content' && <Content data={data} />}
      </main>
    </div></div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="admin-stat">
      <div className="tag">{label}</div>
      <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--t-faint)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Overview({ data, onOpen }: { data: Data; onOpen: (l: Lead) => void }) {
  const latest = data.leads.slice(0, 6);
  const pipeline = data.commissions.filter((c) => c.status === 'pending').length;
  return (
    <>
      <div className="grid g4" style={{ gap: 14 }}>
        <Stat label="New leads" value={data.counts.leadsNew} sub={`${data.counts.leadsTotal} total`} />
        <Stat label="Referrers" value={data.counts.referrers} sub="accounts created" />
        <Stat label="Commissions pending" value={pipeline} sub="awaiting confirmation" />
        <Stat label="Host handoffs" value={data.counts.handoffs} sub="visitors asking for a human" />
      </div>

      <div className="grid g2" style={{ marginTop: 18, gap: 18 }}>
        <div className="admin-card">
          <div className="admin-row" style={{ borderBottom: '1px solid var(--hair)', paddingBottom: 12 }}>
            <b>Latest submissions</b>
            <span className="tag">{latest.length}</span>
          </div>
          {latest.length === 0 && <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--t-faint)' }}>Nothing yet. Submissions appear here the moment a form is sent.</p>}
          {latest.map((l) => (
            <button key={l.id} className="admin-row" style={{ width: '100%', textAlign: 'left' }} onClick={() => onOpen(l)}>
              <span>
                <b>{l.name}</b>
                <small style={{ display: 'block', color: 'var(--t-faint)', fontSize: 12 }}>{l.type} · {l.service || l.role || '—'}</small>
              </span>
              <span className="pill">{l.status}</span>
            </button>
          ))}
        </div>

        <div className="admin-card">
          <div className="admin-row" style={{ borderBottom: '1px solid var(--hair)', paddingBottom: 12 }}>
            <b>Traffic, last 60 events</b>
            <span className="tag">{data.analytics.total} total</span>
          </div>
          {Object.entries(data.analytics.byName).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => (
            <div className="admin-row" key={k}>
              <span style={{ fontSize: 13.5 }}>{k}</span>
              <b style={{ fontSize: 13.5 }}>{v}</b>
            </div>
          ))}
          {Object.keys(data.analytics.byName).length === 0 && (
            <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--t-faint)' }}>No events recorded yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

function Leads({ data, filter, setFilter, openId, onOpen, act }: any) {
  const rows = useMemo(
    () => data.leads.filter((l: Lead) => filter === 'all' || l.status === filter),
    [data.leads, filter]
  );
  const open = data.leads.find((l: Lead) => l.id === openId);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');

  useEffect(() => { setNotes(open?.notes || ''); setStatus(open?.status || 'new'); }, [open]);

  return (
    <div className="grid" style={{ gridTemplateColumns: open ? '1.15fr .85fr' : '1fr', gap: 18, alignItems: 'start' }}>
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="filters" style={{ padding: 16, borderBottom: '1px solid var(--hair)' }}>
          {['all', ...STATUSES].map((s) => (
            <button key={s} className={`pill${filter === s ? ' is-active' : ''}`} onClick={() => setFilter(s)} style={filter === s ? { background: 'var(--grad)', borderColor: 'transparent', color: '#fff' } : undefined}>
              {s}{s !== 'all' && <span style={{ opacity: 0.6 }}> {data.leads.filter((l: Lead) => l.status === s).length}</span>}
            </button>
          ))}
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Name</th><th>Type</th><th>Service</th><th>When</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((l: Lead) => (
                <tr key={l.id} onClick={() => onOpen(l)} style={{ cursor: 'pointer' }} className={openId === l.id ? 'is-feature' : ''}>
                  <td><b>{l.name}</b><div style={{ fontSize: 11.5, color: 'var(--t-faint)' }}>{l.email || l.phone}</div></td>
                  <td>{l.type}</td>
                  <td style={{ color: 'var(--t-muted)' }}>{l.service || l.role || '—'}</td>
                  <td>{new Date(l.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                  <td><span className="pill">{l.status}</span></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} style={{ color: 'var(--t-faint)' }}>Nothing in this filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="admin-card">
          <div className="admin-row" style={{ borderBottom: '1px solid var(--hair)', paddingBottom: 10 }}>
            <b>{open.name}</b>
            <span className="tag">{new Date(open.createdAt).toLocaleString('en-GB')}</span>
          </div>
          {[
            ['Type', open.type], ['Email', open.email], ['Phone', open.phone],
            ['Organisation', open.organisation], ['Service', open.service], ['Budget', open.budget],
            ['Role', open.role], ['Portfolio', open.portfolio], ['Referral', open.referrer || open.ref],
            ['Source', open.source],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div className="kv" key={k as string}><span>{k}</span><span>{String(v)}</span></div>
          ))}
          {open.message && (
            <div style={{ marginTop: 14 }}>
              <div className="tag">Message</div>
              <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{open.message}</p>
            </div>
          )}
          <div className="field" style={{ marginTop: 18 }}>
            <label>Status</label>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Internal notes</label>
            <textarea className="textarea" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Quoted ₦450,000 on 3 Nov. Waiting on logo." />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-primary btn-sm" onClick={() => act('lead.update', { id: open.id, patch: { status, notes } })}>Save</button>
            {open.email && <a className="btn-ghost btn-sm" href={`mailto:${open.email}?subject=${encodeURIComponent('KR8 Digitals — your enquiry')}`}>Email</a>}
            {open.phone && <a className="btn-ghost btn-sm" href={`https://wa.me/${String(open.phone).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          </div>
        </div>
      )}
    </div>
  );
}

function Referrals({ data, act }: { data: Data; act: any }) {
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="admin-card" style={{ padding: 0 }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--hair)' }}><b>Commission queue</b> <span className="tag" style={{ marginLeft: 8 }}>{data.commissions.length}</span></div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Referrer</th><th>Lead</th><th>Type</th><th className="num">Value</th><th className="num">Commission</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {data.commissions.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.referrerCode}</b></td>
                  <td>{c.leadName || '—'}</td>
                  <td style={{ color: 'var(--t-muted)' }}>{c.type || '—'}</td>
                  <td className="num">
                    <input
                      className="input" style={{ width: 96, padding: '6px 8px', fontSize: 13 }}
                      value={values[c.id] ?? (c.valueUsd ?? '')}
                      onChange={(e) => setValues((v) => ({ ...v, [c.id]: e.target.value }))}
                      placeholder="0"
                    />
                  </td>
                  <td className="num">{c.commissionUsd ? `$${formatMoney(c.commissionUsd)}` : '—'}</td>
                  <td><span className="pill">{c.status}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {c.status === 'pending' && (
                      <button className="btn-ghost btn-sm" onClick={() => act('commission.confirm', { id: c.id, patch: { valueUsd: Number(values[c.id] ?? c.valueUsd) || 0 } })}>
                        Confirm
                      </button>
                    )}
                    {c.status === 'earned' && (
                      <button className="btn-ghost btn-sm" onClick={() => act('commission.pay', { id: c.id })}>Mark paid</button>
                    )}
                    {c.status === 'paid' && <span style={{ fontSize: 12, color: 'var(--t-faint)' }}>settled</span>}
                  </td>
                </tr>
              ))}
              {data.commissions.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--t-faint)' }}>No referrals yet. They appear here automatically when a referred visitor submits a form.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--hair)' }}><b>Referrers</b></div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Name</th><th>Code</th><th>Email</th><th className="num">Earned</th><th className="num">Paid out</th><th>Joined</th></tr></thead>
            <tbody>
              {data.referrals.map((r) => (
                <tr key={r.id}>
                  <td><b>{r.name}</b></td>
                  <td><code style={{ fontSize: 12 }}>{r.code}</code></td>
                  <td style={{ color: 'var(--t-muted)' }}>{r.email}</td>
                  <td className="num">${formatMoney(Number(r.earnedUsd) || 0)}</td>
                  <td className="num">${formatMoney(Number(r.withdrawnUsd) || 0)}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
              {data.referrals.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--t-faint)' }}>No referrers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Orders({ data, act }: { data: Data; act: any }) {
  return (
    <div className="admin-card" style={{ padding: 0 }}>
      <div style={{ padding: 16, borderBottom: '1px solid var(--hair)' }}>
        <b>Orders</b> <span className="tag" style={{ marginLeft: 8 }}>manual reconciliation</span>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Reference</th><th>Item</th><th>Client</th><th className="num">USD</th><th className="num">NGN</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {data.orders.map((o) => (
              <tr key={o.id}>
                <td><code style={{ fontSize: 12 }}>{o.reference}</code></td>
                <td><b>{o.item}</b></td>
                <td style={{ color: 'var(--t-muted)' }}>{o.name || '—'}<div style={{ fontSize: 11.5 }}>{o.phone || o.email}</div></td>
                <td className="num">${formatMoney(Number(o.amountUsd) || 0)}</td>
                <td className="num">₦{formatMoney(Number(o.amountNgn) || 0)}</td>
                <td><span className={`badge-status ${o.status === 'paid' ? 'paid' : 'pending'}`}>{o.status === 'paid' ? 'Paid' : 'Awaiting transfer'}</span></td>
                <td>
                  {o.status !== 'paid' && <button className="btn-ghost btn-sm" onClick={() => act('order.paid', { id: o.id })}>Mark paid</button>}
                </td>
              </tr>
            ))}
            {data.orders.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--t-faint)' }}>No orders yet. A buyer creates one from the ready-built site block.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Conversations({ data, act }: { data: Data; act: any }) {
  const [sel, setSel] = useState<string | null>(data.host_sessions[0]?.visitorId || null);
  const [reply, setReply] = useState('');
  const msgs = data.host_messages.filter((m) => m.visitorId === sel).reverse();

  return (
    <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: 18, alignItems: 'start' }}>
      <div className="admin-card" style={{ padding: 0, maxHeight: 640, overflow: 'auto' }}>
        {data.host_sessions.map((s) => (
          <button key={s.id} className="admin-row" style={{ width: '100%', textAlign: 'left' }} onClick={() => setSel(s.visitorId)}>
            <span>
              <b style={{ fontSize: 13 }}>{s.visitorId.slice(0, 12)}…</b>
              <small style={{ display: 'block', color: 'var(--t-faint)', fontSize: 11.5 }}>{s.state} · {s.messages || 0} msgs {s.handoff ? '· handoff' : ''}</small>
            </span>
            <span className="pill">{new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
          </button>
        ))}
        {data.host_sessions.length === 0 && <p style={{ padding: 16, fontSize: 13, color: 'var(--t-faint)' }}>No conversations yet.</p>}
      </div>

      <div className="admin-card">
        <div style={{ display: 'grid', gap: 10, maxHeight: 420, overflow: 'auto', paddingRight: 6 }}>
          {msgs.map((m) => (
            <div key={m.id} style={{
              padding: '10px 14px', borderRadius: 12, fontSize: 13.5, lineHeight: 1.55,
              background: m.who === 'visitor' ? 'rgba(255,255,255,.05)' : 'rgba(255,45,155,.12)',
              marginLeft: m.who === 'visitor' ? 0 : 24,
            }}>
              <div style={{ fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t-faint)', marginBottom: 4 }}>
                {m.who === 'visitor' ? 'Visitor' : m.who === 'team' ? 'Team' : 'Ada'}
              </div>
              {m.text}
            </div>
          ))}
          {msgs.length === 0 && <p style={{ fontSize: 13.5, color: 'var(--t-faint)' }}>Select a conversation.</p>}
        </div>
        {sel && (
          <div style={{ marginTop: 16 }}>
            <div className="field">
              <label>Reply as the team</label>
              <textarea className="textarea" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="This appears inside the visitor's chat panel." />
            </div>
            <button
              className="btn-primary btn-sm"
              onClick={async () => { if (!reply.trim()) return; await act('lead.reply', { leadId: sel, text: reply }); setReply(''); }}
            >
              Send into chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Analytics({ data }: { data: Data }) {
  const entries = Object.entries(data.analytics.byName).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <div className="grid g2" style={{ gap: 18, alignItems: 'start' }}>
      <div className="admin-card">
        <b>Events by name</b>
        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          {entries.map(([k, v]) => (
            <div key={k}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                <span>{k}</span><b>{v}</b>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,.06)' }}>
                <div style={{ height: '100%', width: `${(v / max) * 100}%`, borderRadius: 4, background: 'var(--grad)' }} />
              </div>
            </div>
          ))}
          {entries.length === 0 && <p style={{ fontSize: 13, color: 'var(--t-faint)' }}>No events yet.</p>}
        </div>
      </div>
      <div className="admin-card" style={{ padding: 0 }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--hair)' }}><b>Recent events</b></div>
        <div className="tbl-wrap" style={{ maxHeight: 460, overflow: 'auto' }}>
          <table className="tbl">
            <thead><tr><th>Event</th><th>Path</th><th>Country</th><th>When</th></tr></thead>
            <tbody>
              {data.analytics.recent.map((e) => (
                <tr key={e.id}>
                  <td><b>{e.name}</b></td>
                  <td style={{ color: 'var(--t-muted)' }}>{e.path}</td>
                  <td>{e.country || '—'}</td>
                  <td>{new Date(e.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const CONTENT_FIELDS = [
  { k: 'hostName', label: 'Host display name', hint: 'Currently "Ada" — three candidates were proposed. Timfire picks the final one.', type: 'text' },
  { k: 'hostAvatar', label: 'Host avatar asset', hint: 'A face needs a real person or an approved illustration. Until then the host uses an abstract mark.', type: 'text' },
  { k: 'teamFeeUsd', label: 'Team enrolment fee (USD)', hint: 'Unapproved. Nothing is charged before this is published and shown on the join page.', type: 'number' },
  { k: 'priceListApproved', label: 'Public price list approved? (yes / no)', hint: 'Flipping this to yes also publishes prices on the services pages once settings.publicPriceDisplay is on.', type: 'text' },
  { k: 'founderPhotos', label: 'Founder photography confirmed?', hint: 'The three portraits are the ones KR8 publishes. Confirm they are the images to keep using.', type: 'text' },
  { k: 'partnerLogos', label: 'Partner logo files', hint: 'Upload links for Motion Verse, CHIGOMA and Next Gen Scholars. Slots hold the monogram until then.', type: 'text' },
  { k: 'socialLinks', label: 'Social links (comma separated)', hint: 'Instagram, X, YouTube, LinkedIn. The footer hides any that are empty.', type: 'text' },
  { k: 'openRoles', label: 'Open roles (one per line)', hint: 'Shown on Join the Team and Programs. Empty means the page says no roles are published.', type: 'text' },
];

function Content({ data }: { data: Data }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [invStatus, setInvStatus] = useState<'all' | 'live' | 'for-sale'>('all');

  useEffect(() => {
    const st = (data.settings || {}) as Record<string, unknown>;
    const c: Record<string, boolean> = {};
    for (const item of site.neededFromClient) c[item.id] = Boolean(st[`received:${item.id}`]);
    setChecked(c);
  }, [data.settings]);

  const toggle = async (id: string) => {
    const next = !checked[id];
    setChecked((c) => ({ ...c, [id]: next }));
    await fetch('/api/admin/action', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ op: 'settings.save', patch: { [`received:${id}`]: next } }),
    });
  };

  const sites = invStatus === 'all' ? sitesData.sites : sitesData.sites.filter((s) => s.status === invStatus);

  return (
    <>
    <div className="admin-card">
      <div className="tag" style={{ color: 'var(--magenta)' }}>Content registry</div>
      <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 22, fontWeight: 800, marginTop: 8 }}>
        Needed from Timfire — {Object.values(checked).filter(Boolean).length} of {site.neededFromClient.length} received
      </h2>
      <p style={{ marginTop: 10, fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.65, maxWidth: 700 }}>
        Each row is a place the public site refuses to invent something. Tick it when the answer arrives; the
        tick is stored against the settings record, so the team can see what is still outstanding.
      </p>
      <div className="tbl-wrap" style={{ marginTop: 18 }}>
        <table className="tbl">
          <thead><tr><th>Got it</th><th>Area</th><th>What is needed</th><th>Status</th></tr></thead>
          <tbody>
            {site.neededFromClient.map((n) => (
              <tr key={n.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Mark ${n.item} as received`}
                    checked={Boolean(checked[n.id])}
                    onChange={() => toggle(n.id)}
                  />
                </td>
                <td><b>{n.area}</b></td>
                <td style={{ color: 'var(--t-muted)' }}>{n.item}</td>
                <td>
                  <span className={`badge-status ${checked[n.id] ? 'paid' : 'pending'}`}>
                    {checked[n.id] ? 'received' : 'pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="admin-card">
      <div className="tag" style={{ color: 'var(--magenta)' }}>Portfolio inventory</div>
      <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 22, fontWeight: 800, marginTop: 8 }}>
        {sitesData.sites.length} deployed sites · {sitesData.sites.filter((s) => s.status === 'for-sale').length} for sale
      </h2>
      <p style={{ marginTop: 10, fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.65, maxWidth: 700 }}>
        The public portfolio is generated from <code>data/sites.json</code>. Status and price are edited there
        and deployed — this table is the live check that the account and the site agree.
      </p>
      <div className="filters" style={{ marginTop: 16 }}>
        {(['all', 'live', 'for-sale'] as const).map((k) => (
          <button key={k} aria-pressed={invStatus === k} onClick={() => setInvStatus(k)}>
            {k === 'all' ? 'Everything' : k === 'live' ? 'Live for clients' : 'For sale'}
          </button>
        ))}
      </div>
      <div className="tbl-wrap" style={{ marginTop: 14 }}>
        <table className="tbl">
          <thead><tr><th>Site</th><th>Category</th><th>Status</th><th className="num">Price (USD)</th><th>Open</th></tr></thead>
          <tbody>
            {sites.map((x) => (
              <tr key={x.slug}>
                <td><b>{x.name}</b></td>
                <td style={{ color: 'var(--t-muted)' }}>{x.category}</td>
                <td><span className={`badge-status ${x.status === 'live' ? 'paid' : 'pending'}`}>{x.status === 'live' ? 'live' : 'for sale'}</span></td>
                <td className="num">{x.priceUsd ? `$${x.priceUsd}` : '—'}</td>
                <td><a href={x.url} target="_blank" rel="noopener noreferrer">↗</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="admin-card">
      <div className="tag" style={{ color: 'var(--magenta)' }}>Needed from Timfire</div>
      <h2 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 22, fontWeight: 800, marginTop: 8 }}>
        Fields that are deliberately blank on the site
      </h2>
      <p style={{ marginTop: 10, fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.65, maxWidth: 640 }}>
        Every value below is either unapproved or missing. Nothing here is invented on the public site —
        each one shows as a considered alternative until it is filled in. Saving writes to the datastore and
        marks the field ready; publishing it to the live site is a deploy step.
      </p>
      <div className="grid g2" style={{ marginTop: 24, gap: 18 }}>
        {CONTENT_FIELDS.map((f) => (
          <div className="field" key={f.k}>
            <label htmlFor={f.k}>{f.label}</label>
            <input
              id={f.k} className="input" type={f.type}
              value={vals[f.k] ?? ''}
              onChange={(e) => setVals((v) => ({ ...v, [f.k]: e.target.value }))}
              placeholder="Not set"
            />
            <span style={{ fontSize: 11.5, color: 'var(--t-faint)', marginTop: 4, display: 'block', lineHeight: 1.5 }}>{f.hint}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 22, alignItems: 'center' }}>
        <button
          className="btn-primary btn-sm"
          onClick={async () => {
            await fetch('/api/admin/action', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ op: 'settings.save', patch: vals }),
            });
            setSaved(true); setTimeout(() => setSaved(false), 2600);
          }}
        >
          Save fields
        </button>
        {saved && <span style={{ fontSize: 13, color: 'var(--lilac)' }}>Saved to the datastore.</span>}
      </div>
    </div>
    </>
  );
}
