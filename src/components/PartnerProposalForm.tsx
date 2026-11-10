'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';

import { useState } from 'react';
import { Icon } from './ui';

const TRACKS = [
  'Creative & Specialist Studio Practice',
  'School, University or Academic Institution',
  'Free Training Cohort & Youth Impact Sponsor',
  'Agency / Commercial Delivery Alliance',
  'Community, Event or Mindset Shift Partner',
];

export default function PartnerProposalForm() {
  const editableContent = useEditableContent("components:PartnerProposalForm");
  const TRACKS = editableContent.blocks.TRACKS as EditableBlockTypes["TRACKS"];

  const [organisation, setOrganisation] = useState('');
  const [contactName, setContactName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [track, setTrack] = useState(TRACKS[0]);
  const [timeline, setTimeline] = useState('Ready within 30 days');
  const [summary, setSummary] = useState('');
  const [mutualValue, setMutualValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/partners/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organisation,
          contactName,
          roleTitle,
          email,
          phone,
          website,
          track,
          timeline,
          summary,
          mutualValue,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not submit your proposal. Please check your entries.');
      } else {
        setSubmittedId(data.id);
      }
    } catch {
      setError('Network error while submitting your proposal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <div className="kr8-form-shell" role="status" aria-live="polite">
        <span className="kr8-pill kr8-pill--green">
          <i className="kr8-pill__dot" /> {editableContent.texts.text_d4a8c2fdda}</span>
        <h3 className="section-title" style={{ fontSize: 28, marginTop: 16 }}>
          {editableContent.texts.text_00062849b3}{contactName}{editableContent.texts.text_3d1b4b3905}{organisation} {editableContent.texts.text_84071ee7bb}</h3>
        <p className="prose-lg" style={{ marginTop: 12 }}>
          {editableContent.texts.text_70815632e1}<code style={{ color: 'var(--t-accent-soft)' }}>{submittedId}</code>{editableContent.texts.text_58ce981aab}<strong>{email}</strong>
          {phone ? formatEditableText(editableContent.texts.copy_ebe26e8b71, [phone]) : ''} {editableContent.texts.text_199ede8f01}</p>
        <button
          type="button"
          className="btn-ghost"
          style={{ marginTop: 22 }}
          onClick={() => {
            setSubmittedId('');
            setSummary('');
            setMutualValue('');
          }}
        >
          {editableContent.texts.text_ca920fcec6}</button>
      </div>
    );
  }

  return (
    <form className="kr8-form-shell" onSubmit={onSubmit}>
      <div style={{ marginBottom: 24 }}>
        <span className="kr8-pill">{editableContent.texts.text_8385f85431}</span>
        <h3 className="kr8-card__title" style={{ fontSize: 26, marginTop: 12 }}>
          {editableContent.texts.text_42fee335b0}</h3>
        <p className="kr8-card__body" style={{ marginTop: 8 }}>
          {editableContent.texts.text_9c6ab64844}</p>
      </div>

      <div className="kr8-grid-2" style={{ gap: 18 }}>
        <label className="field">
          <span>{editableContent.texts.text_5385eb1027}</span>
          <input
            type="text"
            required
            placeholder={editableContent.texts.field_8a6003e820}
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{editableContent.texts.text_12e4aee36c}</span>
          <input
            type="text"
            required
            placeholder={editableContent.texts.field_538b411179}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{editableContent.texts.text_5a718ab96c}</span>
          <input
            type="text"
            placeholder={editableContent.texts.field_0dcee1b9d4}
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{editableContent.texts.text_1b72562c82}</span>
          <input
            type="email"
            required
            placeholder={editableContent.texts.field_e82b5491b0}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{editableContent.texts.text_a75c8258e5}</span>
          <input
            type="tel"
            placeholder="+234 ..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{editableContent.texts.text_14cb640d85}</span>
          <input
            type="text"
            placeholder={editableContent.texts.field_e98a62ef23}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{editableContent.texts.text_15a29eaf68}</span>
          <select value={track} onChange={(e) => setTrack(e.target.value)}>
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{editableContent.texts.text_124bca88f6}</span>
          <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
            <option value="Immediate (Next 2–4 weeks)">{editableContent.texts.text_1186ba59a0}</option>
            <option value="Ready within 30–60 days">{editableContent.texts.text_bc4c089b16}</option>
            <option value="Next Academic Term / Quarter">{editableContent.texts.text_e9a71fe4fe}</option>
            <option value="Exploratory Strategic Conversation">{editableContent.texts.text_2f685f430e}</option>
          </select>
        </label>
      </div>

      <label className="field" style={{ marginTop: 18 }}>
        <span>{editableContent.texts.text_e23340bb65}</span>
        <textarea
          rows={4}
          required
          placeholder={editableContent.texts.field_02774ea415}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </label>

      <label className="field" style={{ marginTop: 16 }}>
        <span>{editableContent.texts.text_5d0f09757d}</span>
        <textarea
          rows={3}
          placeholder={editableContent.texts.field_0aca16b836}
          value={mutualValue}
          onChange={(e) => setMutualValue(e.target.value)}
        />
      </label>

      {error && (
        <p role="alert" style={{ marginTop: 14, color: 'var(--status-err-fg)', fontSize: 14 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? editableContent.texts.copy_e5788fda9c : editableContent.texts.copy_4f0919423a} <Icon name="arrow" size={17} />
        </button>
        <span style={{ fontSize: 13, color: 'var(--t-sub)' }}>
          {editableContent.texts.text_9a5eaad1dd}</span>
      </div>
    </form>
  );
}

type EditableBlockTypes = { TRACKS: typeof TRACKS };
