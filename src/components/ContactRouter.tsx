'use client';
import { useEditableContent } from '@/components/EditableContentProvider';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LeadForm from './LeadForm';

type V = 'quote' | 'partner' | 'team' | 'contact';

const TABS: { id: V; label: string; sub: string }[] = [
  { id: 'quote', label: 'A project', sub: 'Website, brand, video, AI, search' },
  { id: 'partner', label: 'A partnership', sub: 'Teach, fund, hire or host' },
  { id: 'team', label: 'A job application', sub: 'Portfolio first, then live work' },
  { id: 'contact', label: 'Something else', sub: 'Anything not covered above' },
];

export default function ContactRouter() {
  const editableContent = useEditableContent("components:ContactRouter");
  const TABS = editableContent.blocks.TABS as EditableBlockTypes["TABS"];

  const params = useSearchParams();
  const [tab, setTab] = useState<V>('quote');
  const [ref, setRef] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    const q = params.get('type');
    if (q === 'partner' || q === 'team' || q === 'quote' || q === 'contact') setTab(q);
    const s = params.get('service');
    if (s) setService(s);
    let r = params.get('ref') || '';
    if (!r) { try { r = localStorage.getItem('kr8.ref') || ''; } catch { /* noop */ } }
    setRef(r);
  }, [params]);

  return (
    <div id="form">
      <div className="tabs" role="tablist" aria-label={editableContent.texts.field_797ecfc26d}>
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <b>{t.label}</b>
            <span>{t.sub}</span>
          </button>
        ))}
      </div>

      {ref && (
        <div className="form-status ok" style={{ marginTop: 18 }}>
          {editableContent.texts.text_50d83f9694}<b>{ref}</b> {editableContent.texts.text_947113dc63}</div>
      )}

      <div style={{ marginTop: 26 }}>
        {tab === 'quote' && <LeadForm key="q" variant="quote" siteId={service || 'contact'} defaultService={service} />}
        {tab === 'partner' && <LeadForm key="p" variant="partner" siteId="contact-partner" />}
        {tab === 'team' && <LeadForm key="t" variant="team" siteId="contact-team" />}
        {tab === 'contact' && <LeadForm key="c" variant="contact" siteId="contact-general" />}
      </div>
    </div>
  );
}

type EditableBlockTypes = { TABS: typeof TABS };
