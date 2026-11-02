'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { formatMoney } from '@/lib/rates';
import { Icon } from './ui';

type Ledger = {
  referrer: { code: string; name: string; email: string; joined: string };
  totals: { pendingUsd: number; earnedUsd: number; paidUsd: number; leads: number };
  rate: number | null;
  commissions: { id: string; at: string; lead: string; type: string; value: number; commission: number; status: string }[];
};

export default function ReferralDashboard() {
  const [code, setCode] = useState('');
  const [key, setKey] = useState('');
  const [data, setData] = useState<Ledger | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (c: string, k: string) => {
    setBusy(true); setErr('');
    try {
      const res = await fetch(`/api/referrals?code=${encodeURIComponent(c)}&key=${encodeURIComponent(k)}`);
      const json = await res.json();
      if (!res.ok || !json.ok) { setErr(json.error || 'Could not load your ledger.'); setData(null); }
      else setData(json);
    } catch { setErr('Network problem. Try again.'); }
    setBusy(false);
  }, []);

  useEffect(() => {
    let c = '', k = '';
    try {
      c = localStorage.getItem('kr8.ref.code') || '';
      k = localStorage.getItem('kr8.ref.key') || '';
    } catch { /* noop */ }
    if (c && k) { setCode(c); setKey(k); load(c, k); }
  }, [load]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      localStorage.setItem('kr8.ref.code', code.trim());
      localStorage.setItem('kr8.ref.key', key.trim());
    } catch { /* noop */ }
    load(code.trim(), key.trim());
  }

  if (data) {
    const { totals, commissions } = data;
    return (
      <div>
        <div className="grid g3" style={{ gap: 16 }}>
          {[
            { k: 'Earned and confirmed', v: `$${formatMoney(totals.earnedUsd)}`, s: 'cleared, awaiting payout' },
            { k: 'Paid out', v: `$${formatMoney(totals.paidUsd)}`, s: 'settled by bank transfer' },
            { k: 'In the pipeline', v: `$${formatMoney(totals.pendingUsd)}`, s: `${totals.leads} introduction${totals.leads === 1 ? '' : 's'} to date` },
          ].map((c) => (
            <div className="admin-stat" key={c.k}>
              <div className="tag">{c.k}</div>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 34, fontWeight: 800, letterSpacing: '-.03em', marginTop: 6 }}>{c.v}</div>
              <div style={{ fontSize: 12, color: 'var(--t-faint)' }}>{c.s}</div>
            </div>
          ))}
        </div>

        <div className="panel" style={{ marginTop: 22, padding: 24 }}>
          <div className="split" style={{ alignItems: 'center' }}>
            <div>
              <div className="tag" style={{ color: 'var(--magenta)' }}>Your link</div>
              <code style={{ display: 'block', marginTop: 8, fontSize: 13.5, wordBreak: 'break-all' }}>
                {typeof window !== 'undefined' ? `${window.location.origin}/r/${data.referrer.code}` : `/r/${data.referrer.code}`}
              </code>
            </div>
            <button
              className="btn-ghost btn-sm"
              onClick={() => { try { navigator.clipboard.writeText(`${window.location.origin}/r/${data.referrer.code}`); } catch { /* noop */ } }}
            >Copy link</button>
          </div>
          {data.rate && (
            <p style={{ marginTop: 14, fontSize: 13, color: 'var(--lilac)' }}>
              Bonus rate active: {data.rate}% on every new referral.
            </p>
          )}
        </div>

        <div className="tbl-wrap" style={{ marginTop: 26 }}>
          <table className="tbl">
            <thead><tr><th>Date</th><th>Introduction</th><th>Service</th><th className="num">Value</th><th className="num">Commission</th><th>Status</th></tr></thead>
            <tbody>
              {commissions.length === 0 && (
                <tr><td colSpan={6} style={{ color: 'var(--t-faint)' }}>No introductions yet. Share your link — the first one usually lands within a week.</td></tr>
              )}
              {commissions.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><b>{c.lead || '—'}</b></td>
                  <td style={{ color: 'var(--t-muted)' }}>{c.type || 'Enquiry'}</td>
                  <td className="num">${formatMoney(c.value || 0)}</td>
                  <td className="num">${formatMoney(c.commission || 0)}</td>
                  <td>
                    <span className={`badge-status ${c.status}`}>
                      {c.status === 'paid' ? 'Paid' : c.status === 'earned' ? 'Confirmed' : 'Awaiting payment'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <Link href="/referrals" className="btn-ghost btn-sm">How referrals work</Link>
          <button className="btn-ghost btn-sm" onClick={() => { setData(null); try { localStorage.removeItem('kr8.ref.key'); localStorage.removeItem('kr8.ref.code'); } catch { /* noop */ } }}>
            Sign out of this device
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="split" style={{ alignItems: 'start', gap: 48 }}>
      <form className="panel" onSubmit={submit} style={{ padding: 30, maxWidth: 520 }}>
        <div className="tag" style={{ color: 'var(--magenta)' }}>Sign in</div>
        <h3 style={{ fontSize: 22, marginTop: 10 }}>Your code and private key</h3>
        <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.6 }}>
          Both were shown when you created the account, and the key is stored on the device you signed up
          on. No password to forget.
        </p>
        <div className="field" style={{ marginTop: 18 }}>
          <label htmlFor="dc">Referral code</label>
          <input id="dc" className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. chidinma4f2a" required />
        </div>
        <div className="field">
          <label htmlFor="dk">Private key</label>
          <input id="dk" className="input" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Shown when you signed up" required />
        </div>
        {err && <div className="form-status err">{err}</div>}
        <button className="btn-primary" disabled={busy} type="submit" style={{ marginTop: 8 }}>
          {busy ? <><span className="spinner" /> Loading…</> : <>Open my ledger <Icon name="arrow" size={16} /></>}
        </button>
        <p className="form-note">
          Lost your key? <Link href="/contact" style={{ color: 'var(--magenta)' }}>Message the team</Link> from the
          email you signed up with and we will reissue it.
        </p>
      </form>
      <div className="panel" style={{ padding: 30 }}>
        <h3 style={{ fontSize: 20 }}>No account yet?</h3>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--t-muted)', lineHeight: 1.65 }}>
          Creating one takes thirty seconds and there is no approval step. You get the link and the ledger
          immediately.
        </p>
        <Link href="/referrals#join" className="btn-primary btn-sm" style={{ marginTop: 18 }}>Create my link <Icon name="arrow" size={15} /></Link>
      </div>
    </div>
  );
}
