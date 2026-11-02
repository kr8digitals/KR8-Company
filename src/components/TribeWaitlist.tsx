'use client';

import { useState } from 'react';
import { track } from '@/lib/track';
import { Icon } from './ui';

export default function TribeWaitlist() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr('');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'tribe', name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
          message: fd.get('message') || 'Tribe waitlist', consent: true, siteId: 'tribe-waitlist',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setErr(data.error || 'Could not save that.'); setBusy(false); return; }
      setDone(true); track('tribe_waitlist', { ok: true });
    } catch { setErr('Network problem — try again.'); }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="panel" style={{ padding: 26 }}>
        <div className="tag" style={{ color: 'var(--magenta)' }}>You are on the list</div>
        <p style={{ marginTop: 10, fontSize: 14.5, color: 'var(--t-body)' }}>
          When the Tribe site opens you will get the first invitation — before it is posted anywhere public.
        </p>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit} style={{ padding: 26 }}>
      <div className="tag" style={{ color: 'var(--magenta)' }}>Join the first wave</div>
      <div className="form-row" style={{ marginTop: 14 }}>
        <div className="field">
          <label htmlFor="tw-name">Name <span className="req">*</span></label>
          <input id="tw-name" name="name" className="input" required placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="tw-email">Email <span className="req">*</span></label>
          <input id="tw-email" name="email" type="email" className="input" required placeholder="you@email.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="tw-phone">WhatsApp</label>
        <input id="tw-phone" name="phone" className="input" inputMode="tel" placeholder="Optional, but we can reach you faster" />
      </div>
      <div className="field">
        <label htmlFor="tw-msg">What do you make?</label>
        <input id="tw-msg" name="message" className="input" placeholder="Design · video · code · writing · still learning" />
      </div>
      {err && <div className="form-status err">{err}</div>}
      <button className="btn-primary" type="submit" disabled={busy} style={{ marginTop: 6 }}>
        {busy ? <><span className="spinner" /> Adding…</> : <>Add me to the list <Icon name="arrow" size={16} /></>}
      </button>
    </form>
  );
}
