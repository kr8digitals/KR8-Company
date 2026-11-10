'use client';
import { useEditableContent } from '@/components/EditableContentProvider';

import { useState } from 'react';
import { Icon } from './ui';

export default function BuySite({ siteId, name, priceUsd, approved = false }: { siteId: string; name: string; priceUsd: number; approved?: boolean }) {
  const editableContent = useEditableContent("components:BuySite");

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
        }),
      });
      const data = await res.json();
      if (!data.ok) { setErr(data.error || 'Could not create the order.'); setState('idle'); return; }
      setRef(data.reference); setState('done');
      const q = data.token ? `?t=${encodeURIComponent(data.token)}` : '';
      window.location.href = `/order/${data.reference}${q}`;
    } catch { setErr('Network problem. Try again.'); setState('idle'); }
  }

  if (state === 'done') return <p style={{ fontSize: 14, color: 'var(--lilac)' }}>{editableContent.texts.text_f4118aad2d}<b>{ref}</b>…</p>;

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <div className="form-row">
        <div className="field"><label htmlFor="bn">{editableContent.texts.text_d297e206e6}<span className="req">*</span></label><input id="bn" name="name" className="input" required /></div>
        <div className="field"><label htmlFor="be">{editableContent.texts.text_009557a4da}<span className="req">*</span></label><input id="be" name="email" type="email" className="input" required /></div>
      </div>
      <div className="field"><label htmlFor="bp">{editableContent.texts.text_6a40edf1fc}</label><input id="bp" name="phone" className="input" inputMode="tel" /></div>
      <div className="field"><label htmlFor="bnote">{editableContent.texts.text_e87784a647}</label><input id="bnote" name="note" className="input" placeholder={editableContent.texts.field_9d6e358550} /></div>
      {err && <div className="form-status err">{err}</div>}
      <button className="btn-primary btn-sm" type="submit" disabled={state === 'busy'} style={{ justifySelf: 'start' }}>
        {state === 'busy'
          ? <><span className="spinner" /> {editableContent.texts.text_c79ed9492e}</>
          : approved
            ? <>{editableContent.texts.text_27f24a3fcc}{priceUsd} <Icon name="arrow" size={15} /></>
            : <>{editableContent.texts.text_1d079b2e76}<Icon name="arrow" size={15} /></>}
      </button>
      <p style={{ fontSize: 11.5, color: 'var(--t-faint)' }}>
        {approved
          ? editableContent.texts.copy_c8dcbd5cc1
          : editableContent.texts.copy_ae47e82ea9}
      </p>
    </form>
  );
}
