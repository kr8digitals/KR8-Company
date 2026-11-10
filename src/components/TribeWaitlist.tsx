'use client';
import { useEditableContent } from '@/components/EditableContentProvider';

import { useState } from 'react';
import { track } from '@/lib/track';
import { Icon } from './ui';

export default function TribeWaitlist() {
  const editableContent = useEditableContent("components:TribeWaitlist");

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
        <div className="tag" style={{ color: 'var(--magenta)' }}>{editableContent.texts.text_3e9aa25fac}</div>
        <p style={{ marginTop: 10, fontSize: 14.5, color: 'var(--t-body)' }}>
          {editableContent.texts.text_4250ad0359}</p>
      </div>
    );
  }

  return (
    <form className="panel" onSubmit={submit} style={{ padding: 26 }}>
      <div className="tag" style={{ color: 'var(--magenta)' }}>{editableContent.texts.text_414700b996}</div>
      <div className="form-row" style={{ marginTop: 14 }}>
        <div className="field">
          <label htmlFor="tw-name">{editableContent.texts.text_d297e206e6}<span className="req">*</span></label>
          <input id="tw-name" name="name" className="input" required placeholder={editableContent.texts.field_2c6b2e253c} />
        </div>
        <div className="field">
          <label htmlFor="tw-email">{editableContent.texts.text_009557a4da}<span className="req">*</span></label>
          <input id="tw-email" name="email" type="email" className="input" required placeholder={editableContent.texts.field_8d12b7f58c} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="tw-phone">{editableContent.texts.text_6a40edf1fc}</label>
        <input id="tw-phone" name="phone" className="input" inputMode="tel" placeholder={editableContent.texts.field_a8e68c0396} />
      </div>
      <div className="field">
        <label htmlFor="tw-msg">{editableContent.texts.text_14fa222a5f}</label>
        <input id="tw-msg" name="message" className="input" placeholder={editableContent.texts.field_a92ec83bbd} />
      </div>
      {err && <div className="form-status err">{err}</div>}
      <button className="btn-primary" type="submit" disabled={busy} style={{ marginTop: 6 }}>
        {busy ? <><span className="spinner" /> {editableContent.texts.text_c6de6f45c8}</> : <>{editableContent.texts.text_929b93b84c}<Icon name="arrow" size={16} /></>}
      </button>
    </form>
  );
}
