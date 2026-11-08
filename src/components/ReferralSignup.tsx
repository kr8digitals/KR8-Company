'use client';

import { useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/track';
import { Icon } from './ui';

export default function ReferralSignup() {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'existing'>('idle');
  const [err, setErr] = useState('');
  const [out, setOut] = useState<{ link: string; code: string; key: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kr8digitals.com';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    const fd = new FormData(e.currentTarget);
    setState('busy');
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
          focus: fd.get('focus'), consent: fd.get('consent') === 'on',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setErr(data.error || 'Could not create the account.'); setState('idle'); return; }
      if (data.key) {
        try {
          localStorage.setItem('kr8.ref.key', data.key);
          localStorage.setItem('kr8.ref.code', data.code);
        } catch { /* noop */ }
      }
      setOut({ link: `${origin}/r/${data.code}`, code: data.code, key: data.key || '' });
      setState(data.existing ? 'existing' : 'done');
      track('referral_signup', { existing: Boolean(data.existing) });
    } catch {
      setErr('Network problem. Try again, or message us on WhatsApp.');
      setState('idle');
    }
  }

  if (state === 'done' || state === 'existing') {
    return (
      <div className="panel" style={{ padding: 30 }}>
        <div className="tag" style={{ color: 'var(--magenta)' }}>
          {state === 'existing' ? 'You already had an account' : 'Account created'}
        </div>
        <h3 style={{ fontSize: 22, marginTop: 10 }}>This is your link</h3>
        <div
          style={{
            marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            border: '1px solid var(--hair)', borderRadius: 12, padding: '12px 14px',
            background: 'var(--surface-subtle)', fontFamily: 'ui-monospace,monospace', fontSize: 13,
          }}
        >
          <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-all' }}>{out?.link}</span>
          <button
            className="btn-ghost btn-sm"
            onClick={async () => {
              try { await navigator.clipboard.writeText(out!.link); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch { /* noop */ }
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p style={{ marginTop: 16, fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.65 }}>
          Anyone who reaches us through that link is credited to you for the life of their first project.
          Your ledger lives at{' '}
          <Link href="/referrals/dashboard" style={{ color: 'var(--magenta)', fontWeight: 600 }}>the dashboard</Link>
          {' '}— it needs this device, or your code and key.
        </p>
        {out?.key && (
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--t-faint)' }}>
            Private key (kept on this device, shown once): <code style={{ color: 'var(--t-body)' }}>{out.key}</code>
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <a
            className="btn-primary btn-sm"
            target="_blank" rel="noopener noreferrer"
            href={`https://wa.me/?text=${encodeURIComponent(`I think this is worth your time — KR8 Digitals builds websites and brands that actually earn. Start here: ${out?.link}`)}`}
          >
            <Icon name="wa" size={16} /> Share on WhatsApp
          </a>
          <Link href="/referrals/dashboard" className="btn-ghost btn-sm">Open my dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit} id="join" style={{ padding: 30 }}>
      <div className="tag" style={{ color: 'var(--magenta)' }}>Free · no minimum followers</div>
      <h3 style={{ fontSize: 24, marginTop: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800 }}>
        Create your referral account
      </h3>
      <p style={{ marginTop: 8, fontSize: 14, color: 'var(--t-muted)', lineHeight: 1.6 }}>
        Thirty seconds. You get a personal link and a ledger that shows every introduction, its status and
        what it is worth.
      </p>
      <div className="form-row" style={{ marginTop: 20 }}>
        <div className="field">
          <label htmlFor="rn">Name <span className="req">*</span></label>
          <input id="rn" name="name" className="input" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="re">Email <span className="req">*</span></label>
          <input id="re" name="email" type="email" className="input" required autoComplete="email" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="rp">WhatsApp</label>
          <input id="rp" name="phone" className="input" inputMode="tel" placeholder="Optional" />
        </div>
        <div className="field">
          <label htmlFor="rf">Who do you know?</label>
          <select id="rf" name="focus" className="select">
            <option value="">A bit of everything</option>
            <option value="Schools">Schools and colleges</option>
            <option value="Hospitals & clinics">Hospitals and clinics</option>
            <option value="Retail & fashion">Retail and fashion</option>
            <option value="Churches & NGOs">Churches and NGOs</option>
            <option value="Founders">Founders and startups</option>
          </select>
        </div>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          I accept the referral terms below, and that KR8 Digitals may contact me about introductions.
        </span>
      </label>
      {err && <div className="form-status err">{err}</div>}
      <button className="btn-primary" type="submit" disabled={state === 'busy'} style={{ marginTop: 8 }}>
        {state === 'busy' ? <><span className="spinner" /> Creating…</> : <>Create my account <Icon name="arrow" size={16} /></>}
      </button>
      <p className="form-note">No card, no fee, no quota. You only earn on work that is actually paid for.</p>
    </form>
  );
}
