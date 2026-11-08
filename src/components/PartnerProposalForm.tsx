'use client';

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
          <i className="kr8-pill__dot" /> Partnership Proposal Logged
        </span>
        <h3 className="section-title" style={{ fontSize: 28, marginTop: 16 }}>
          Thank you, {contactName}. Your proposal for {organisation} is with our executive team.
        </h3>
        <p className="prose-lg" style={{ marginTop: 12 }}>
          Reference ID: <code style={{ color: 'var(--t-accent-soft)' }}>{submittedId}</code>. Founding leadership reviews
          partnership proposals directly and will reach out via <strong>{email}</strong>
          {phone ? ` or ${phone}` : ''} to schedule an alignment conversation.
        </p>
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
          Submit Another Proposal
        </button>
      </div>
    );
  }

  return (
    <form className="kr8-form-shell" onSubmit={onSubmit}>
      <div style={{ marginBottom: 24 }}>
        <span className="kr8-pill">Direct Executive Review</span>
        <h3 className="kr8-card__title" style={{ fontSize: 26, marginTop: 12 }}>
          Submit a Partnership Proposal
        </h3>
        <p className="kr8-card__body" style={{ marginTop: 8 }}>
          Tell us about your organisation, the collaboration model you have in mind, and what we can build or
          teach together. Every proposal routes directly to the KR8 DIGITALS leadership dashboard.
        </p>
      </div>

      <div className="kr8-grid-2" style={{ gap: 18 }}>
        <label className="field">
          <span>Organisation / Brand Name *</span>
          <input
            type="text"
            required
            placeholder="e.g. Horizon Crest Academy"
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Your Full Name *</span>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Your Role / Title</span>
          <input
            type="text"
            placeholder="e.g. Founder, Principal, Head of Partnerships"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Email Address *</span>
          <input
            type="email"
            required
            placeholder="you@organisation.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Phone / WhatsApp Number</span>
          <input
            type="tel"
            placeholder="+234 ..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Website or Portfolio Link</span>
          <input
            type="text"
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Partnership Track *</span>
          <select value={track} onChange={(e) => setTrack(e.target.value)}>
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Target Start Horizon</span>
          <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
            <option value="Immediate (Next 2–4 weeks)">Immediate (Next 2–4 weeks)</option>
            <option value="Ready within 30–60 days">Ready within 30–60 days</option>
            <option value="Next Academic Term / Quarter">Next Academic Term / Quarter</option>
            <option value="Exploratory Strategic Conversation">Exploratory Strategic Conversation</option>
          </select>
        </label>
      </div>

      <label className="field" style={{ marginTop: 18 }}>
        <span>What would you like us to build, co-host, or achieve together? *</span>
        <textarea
          rows={4}
          required
          placeholder="Describe your organisation, the opportunity you see, and how a partnership with KR8 DIGITALS fits your goals..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </label>

      <label className="field" style={{ marginTop: 16 }}>
        <span>What strengths, audience, or resources does your organisation bring to the table?</span>
        <textarea
          rows={3}
          placeholder="e.g. Specialist creative craft, student community, sponsorship capacity, distribution reach, or venue infrastructure..."
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
          {submitting ? 'Submitting Proposal...' : 'Send Partnership Proposal'} <Icon name="arrow" size={17} />
        </button>
        <span style={{ fontSize: 13, color: 'var(--t-sub)' }}>
          Reviewed directly by KR8 DIGITALS leadership · Confidential handling
        </span>
      </div>
    </form>
  );
}
