'use client';

import { useState } from 'react';
import { Icon } from './ui';
import { getCtaAttribution } from '@/lib/cta-attribution';

export default function BuySite({ siteId, name, priceUsd, approved = false }: { siteId: string; name: string; priceUsd: number; approved?: boolean }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [ref, setRef] = useState('');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(''); setState('busy');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          item: `${name} — ready-built site`, amountUsd: priceUsd, siteId,
          name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), note: fd.get('note'),
          cta: getCtaAttribution(`buy-site:${siteId}`),
        }),
      });
      const data = await res.json();
      if (!data.ok) { setErr(data.error || 'Could not create the order.'); setState('idle'); return; }
      setRef(data.reference); setState('done');
      const q = data.token ? `?t=${encodeURIComponent(data.token)}` : '';
      window.location.href = `/order/${data.reference}${q}`;
    } catch { setErr('Network problem. Try again.'); setState('idle'); }
  }

  if (state === 'done') return <p style={{ fontSize: 14, color: 'var(--lilac)' }}>Order created — taking you to the transfer instructions <b>{ref}</b>…</p>;

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <div className="form-row">
        <div className="field"><label htmlFor="bn">Name <span className="req">*</span></label><input id="bn" name="name" className="input" required /></div>
        <div className="field"><label htmlFor="be">Email <span className="req">*</span></label><input id="be" name="email" type="email" className="input" required /></div>
      </div>
      <div className="field"><label htmlFor="bp">WhatsApp</label><input id="bp" name="phone" className="input" inputMode="tel" /></div>
      <div className="field"><label htmlFor="bnote">Anything we should know?</label><input id="bnote" name="note" className="input" placeholder="Business name, colours, when you need it" /></div>
      {err && <div className="form-status err">{err}</div>}
      <button className="btn-primary btn-sm" type="submit" disabled={state === 'busy'} style={{ justifySelf: 'start' }}>
        {state === 'busy'
          ? <><span className="spinner" /> Creating…</>
          : approved
            ? <>Reserve for ${priceUsd} <Icon name="arrow" size={15} /></>
            : <>Reserve this build <Icon name="arrow" size={15} /></>}
      </button>
      <p style={{ fontSize: 11.5, color: 'var(--t-faint)' }}>
        {approved
          ? 'This creates an order with transfer instructions. Nothing is charged automatically.'
          : 'The team confirms the exact figure with you before anything is transferred. Nothing is charged automatically.'}
      </p>
    </form>
  );
}
