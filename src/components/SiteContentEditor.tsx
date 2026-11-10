'use client';
import { useEffect, useState } from 'react';

export default function SiteContentEditor() {
  const [docs, setDocs] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState('home');
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'fields' | 'json'>('fields');
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    fetch('/api/admin/content', { cache: 'no-store' }).then(async r => {
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Unable to load content');
      setDocs(j.documents); setText(JSON.stringify(j.documents.home, null, 2));
    }).catch(e => setMessage(e.message));
  }, []);
  async function save() {
    setBusy(true); setMessage('');
    try {
      const values = JSON.parse(text);
      const r = await fetch('/api/admin/content', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: selected, values }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Unable to save content');
      setDocs(d => ({ ...d, [selected]: values })); setDirty(false);
      setMessage('Saved. Public pages use this database content on their next request; refresh an already open page to see it.');
    } catch (e: any) { setMessage(e.message); }
    finally { setBusy(false); }
  }
  let draft: any = null; try { draft = JSON.parse(text); } catch { /* Raw JSON mode displays the validation error on save. */ }
  const label = (key: string) => docs[key]?.label || ({ home: 'Homepage hero', site: 'Global identity, ecosystem & business settings',
    catalog: 'Portfolio, galleries & order prices', pricing: 'Service pricing', 'programme-data': 'Programme introductions & tiers' } as Record<string,string>)[key] || key;
  function updateField(key: string, value: string) {
    const next = selected.startsWith('copy:') ? { ...draft, texts: { ...draft.texts, [key]: value } } : { ...draft, [key]: value };
    setText(JSON.stringify(next, null, 2)); setDirty(true);
  }
  const fields = selected.startsWith('copy:') ? draft?.texts : selected === 'home' ? draft : null;
  return <section className="kr8-cms-panel" style={{ marginBottom: 24 }}>
    <h2>Website content manager</h2>
    <p>Edit page copy, legal content, mobile panels, service cards, calls to action, gallery content and business settings. Use the existing Services, Team, Partners, Navigation and Pages modules for their structured records. Presentation code and security controls are not editable here.</p>
    <label htmlFor="content-document">Page or content area</label>
    <select id="content-document" className="select" value={selected} onChange={e => {
      if (dirty && !window.confirm('Discard unsaved changes?')) return;
      setSelected(e.target.value); setText(JSON.stringify(docs[e.target.value] || {}, null, 2)); setMessage(''); setSearch(''); setDirty(false);
    }}>
      {Object.keys(docs).map(key => <option key={key} value={key}>{label(key)}</option>)}
    </select>
    <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
      <button className="btn-ghost" type="button" onClick={() => setMode('fields')}>Text fields</button>
      <button className="btn-ghost" type="button" onClick={() => setMode('json')}>Advanced structured content</button>
    </div>
    {mode === 'fields' && fields ? <>
      <label htmlFor="content-search">Find text</label>
      <input id="content-search" className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the current content area" />
      <div style={{ maxHeight: 520, overflow: 'auto', margin: '14px 0', display: 'grid', gap: 14 }}>
        {Object.entries(fields).filter(([key,value]) => `${key} ${value}`.toLowerCase().includes(search.toLowerCase())).map(([key,value]) => <label key={key} className="field">
          <span>{selected === 'home' ? key : String(docs[selected]?.texts?.[key] || key).slice(0, 95)}</span>
          <textarea className="input" rows={String(value).length > 100 ? 3 : 2} value={String(value)} onChange={e => updateField(key,e.target.value)} />
        </label>)}
      </div>
      {draft?.blocks && Object.keys(draft.blocks).length > 0 && <p>Card lists, profile sections and metadata are available under Advanced structured content → blocks.</p>}
    </> : <>
      <label htmlFor="content-json">Structured content JSON — keep field names/types; edit list entries and text values</label>
      <textarea id="content-json" className="input" rows={18} value={text} onChange={e => { setText(e.target.value); setDirty(true); }} spellCheck={false}
        style={{ width: '100%', fontFamily: 'monospace', margin: '12px 0' }} />
    </>}
    <button className="btn-primary" type="button" onClick={save} disabled={busy || !Object.keys(docs).length}>{busy ? 'Saving…' : 'Save content'}</button>
    {dirty && <span style={{ marginLeft: 12 }}>Unsaved changes</span>}
    {message && <p role="status" style={{ marginTop: 12 }}>{message}</p>}
  </section>;
}
