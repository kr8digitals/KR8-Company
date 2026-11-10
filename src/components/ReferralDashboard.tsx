'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';

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
  const editableContent = useEditableContent("components:ReferralDashboard");

  const [code, setCode] = useState('');
  const [key, setKey] = useState('');
  const [data, setData] = useState<Ledger | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (c: string, k: string) => {
    setBusy(true); setErr('');
    try {
      const res = await fetch(`/api/referrals?code=${encodeURIComponent(c)}`, { headers: { authorization: `Bearer ${k}` }, cache: 'no-store' });
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
            { k: 'In the pipeline', v: `$${formatMoney(totals.pendingUsd)}`, s: formatEditableText(editableContent.texts.copy_28d4406919, [totals.leads, totals.leads === 1 ? '' : 's']) },
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
              <div className="tag" style={{ color: 'var(--magenta)' }}>{editableContent.texts.text_0afdb9bcf8}</div>
              <code style={{ display: 'block', marginTop: 8, fontSize: 13.5, wordBreak: 'break-all' }}>
                {typeof window !== 'undefined' ? formatEditableText(editableContent.texts.copy_64fdf1d123, [window.location.origin, data.referrer.code]) : formatEditableText("/r/{0}", [data.referrer.code])}
              </code>
            </div>
            <button
              className="btn-ghost btn-sm"
              onClick={() => { try { navigator.clipboard.writeText(`${window.location.origin}/r/${data.referrer.code}`); } catch { /* noop */ } }}
            >{editableContent.texts.text_dbf362d4f2}</button>
          </div>
          {data.rate && (
            <p style={{ marginTop: 14, fontSize: 13, color: 'var(--lilac)' }}>
              {editableContent.texts.text_32af3b73dc}{data.rate}{editableContent.texts.text_e7cf9dd98e}</p>
          )}
        </div>

        <div className="tbl-wrap" style={{ marginTop: 26 }}>
          <table className="tbl">
            <thead><tr><th>{editableContent.texts.text_99c40ab405}</th><th>{editableContent.texts.text_b605350bc0}</th><th>{editableContent.texts.text_d677190e0a}</th><th className="num">{editableContent.texts.text_8e37953d23}</th><th className="num">{editableContent.texts.text_3d41e1a66a}</th><th>{editableContent.texts.text_920e413c7d}</th></tr></thead>
            <tbody>
              {commissions.length === 0 && (
                <tr><td colSpan={6} style={{ color: 'var(--t-faint)' }}>{editableContent.texts.text_a85623a0e1}</td></tr>
              )}
              {commissions.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><b>{c.lead || '—'}</b></td>
                  <td style={{ color: 'var(--t-muted)' }}>{c.type || editableContent.texts.copy_0e3416f5f2}</td>
                  <td className="num">${formatMoney(c.value || 0)}</td>
                  <td className="num">${formatMoney(c.commission || 0)}</td>
                  <td>
                    <span className={`badge-status ${c.status}`}>
                      {c.status === 'paid' ? editableContent.texts.copy_fb81b961af : c.status === 'earned' ? editableContent.texts.copy_fe00b67b6d : editableContent.texts.copy_7c2788959f}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <Link href={editableContent.texts.field_5c28ab56d1} className="btn-ghost btn-sm">{editableContent.texts.text_b3815df11a}</Link>
          <button className="btn-ghost btn-sm" onClick={() => { setData(null); try { localStorage.removeItem('kr8.ref.key'); localStorage.removeItem('kr8.ref.code'); } catch { /* noop */ } }}>
            {editableContent.texts.text_b4e09a6437}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="split" style={{ alignItems: 'start', gap: 48 }}>
      <form className="panel" onSubmit={submit} style={{ padding: 30, maxWidth: 520 }}>
        <div className="tag" style={{ color: 'var(--magenta)' }}>{editableContent.texts.text_bfd402b2f6}</div>
        <h3 style={{ fontSize: 22, marginTop: 10 }}>{editableContent.texts.text_719eefb7a0}</h3>
        <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.6 }}>
          {editableContent.texts.text_085851a073}</p>
        <div className="field" style={{ marginTop: 18 }}>
          <label htmlFor="dc">{editableContent.texts.text_64f124b1f0}</label>
          <input id="dc" className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder={editableContent.texts.field_b88d3ce662} required />
        </div>
        <div className="field">
          <label htmlFor="dk">{editableContent.texts.text_477bf990a2}</label>
          <input id="dk" className="input" value={key} onChange={(e) => setKey(e.target.value)} placeholder={editableContent.texts.field_2f644f33c0} required />
        </div>
        {err && <div className="form-status err">{err}</div>}
        <button className="btn-primary" disabled={busy} type="submit" style={{ marginTop: 8 }}>
          {busy ? <><span className="spinner" /> {editableContent.texts.text_ba3bbbe10d}</> : <>{editableContent.texts.text_ae038b75bb}<Icon name="arrow" size={16} /></>}
        </button>
        <p className="form-note">
          {editableContent.texts.text_b8daa0a70d}<Link href={editableContent.texts.field_4eb9506365} style={{ color: 'var(--magenta)' }}>{editableContent.texts.text_85e6c8fa30}</Link> {editableContent.texts.text_f4f15ddebc}</p>
      </form>
      <div className="panel" style={{ padding: 30 }}>
        <h3 style={{ fontSize: 20 }}>{editableContent.texts.text_7316cc510f}</h3>
        <p style={{ marginTop: 10, fontSize: 14, color: 'var(--t-muted)', lineHeight: 1.65 }}>
          {editableContent.texts.text_e6e8949d42}</p>
        <Link href={editableContent.texts.field_3edf20c5af} className="btn-primary btn-sm" style={{ marginTop: 18 }}>{editableContent.texts.text_ce5ae38e5f}<Icon name="arrow" size={15} /></Link>
      </div>
    </div>
  );
}
