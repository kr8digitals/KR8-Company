'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';

import { useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/track';
import { Icon } from './ui';

export default function ReferralSignup() {
  const editableContent = useEditableContent("components:ReferralSignup");

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
          {state === 'existing' ? editableContent.texts.copy_8de208bb37 : editableContent.texts.copy_f63879fd69}
        </div>
        <h3 style={{ fontSize: 22, marginTop: 10 }}>{editableContent.texts.text_ad69958e61}</h3>
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
            {copied ? editableContent.texts.copy_8d525e5f15 : editableContent.texts.copy_e21f935f11}
          </button>
        </div>
        <p style={{ marginTop: 16, fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.65 }}>
          {editableContent.texts.text_d55aeb7003}{' '}
          <Link href={editableContent.texts.field_ca3bd633b6} style={{ color: 'var(--magenta)', fontWeight: 600 }}>{editableContent.texts.text_5f142b7c15}</Link>
          {' '}{editableContent.texts.text_21e2899364}</p>
        {out?.key && (
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--t-faint)' }}>
            {editableContent.texts.text_1064d6aef7}<code style={{ color: 'var(--t-body)' }}>{out.key}</code>
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <a
            className="btn-primary btn-sm"
            target="_blank" rel="noopener noreferrer"
            href={formatEditableText("https://wa.me/?text={0}", [encodeURIComponent(`I think this is worth your time — KR8 Digitals builds websites and brands that actually earn. Start here: ${out?.link}`)])}
          >
            <Icon name="wa" size={16} /> {editableContent.texts.text_a0d01c1659}</a>
          <Link href={editableContent.texts.field_ca3bd633b6} className="btn-ghost btn-sm">{editableContent.texts.text_2ede437c87}</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit} id="join" style={{ padding: 30 }}>
      <div className="tag" style={{ color: 'var(--magenta)' }}>{editableContent.texts.text_4b5e91cce4}</div>
      <h3 style={{ fontSize: 24, marginTop: 10, fontFamily: 'Montserrat,sans-serif', fontWeight: 800 }}>
        {editableContent.texts.text_6448c4ef2b}</h3>
      <p style={{ marginTop: 8, fontSize: 14, color: 'var(--t-muted)', lineHeight: 1.6 }}>
        {editableContent.texts.text_3c0a4889f1}</p>
      <div className="form-row" style={{ marginTop: 20 }}>
        <div className="field">
          <label htmlFor="rn">{editableContent.texts.text_d297e206e6}<span className="req">*</span></label>
          <input id="rn" name="name" className="input" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="re">{editableContent.texts.text_009557a4da}<span className="req">*</span></label>
          <input id="re" name="email" type="email" className="input" required autoComplete="email" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="rp">{editableContent.texts.text_6a40edf1fc}</label>
          <input id="rp" name="phone" className="input" inputMode="tel" placeholder={editableContent.texts.field_59be71333c} />
        </div>
        <div className="field">
          <label htmlFor="rf">{editableContent.texts.text_5cd66a272c}</label>
          <select id="rf" name="focus" className="select">
            <option value="">{editableContent.texts.text_a4d70ed9e8}</option>
            <option value="Schools">{editableContent.texts.text_25518b2753}</option>
            <option value="Hospitals & clinics">{editableContent.texts.text_8949196fce}</option>
            <option value="Retail & fashion">{editableContent.texts.text_0f9a7b9e89}</option>
            <option value="Churches & NGOs">{editableContent.texts.text_80c8130d24}</option>
            <option value="Founders">{editableContent.texts.text_f5f7c83807}</option>
          </select>
        </div>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          {editableContent.texts.text_79b41297f4}</span>
      </label>
      {err && <div className="form-status err">{err}</div>}
      <button className="btn-primary" type="submit" disabled={state === 'busy'} style={{ marginTop: 8 }}>
        {state === 'busy' ? <><span className="spinner" /> {editableContent.texts.text_c79ed9492e}</> : <>{editableContent.texts.text_ace851e865}<Icon name="arrow" size={16} /></>}
      </button>
      <p className="form-note">{editableContent.texts.text_30874e5b26}</p>
    </form>
  );
}
