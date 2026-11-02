import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../../data/site.json';
import PageHero from '@/components/PageHero';
import LeadForm from '@/components/LeadForm';
import { Icon } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Join the team — sixty days, then paid work',
  description:
    'KR8 Digitals hires one paid team. Thirty days of the Consistency Drill, thirty days of team training on real client work, then a monthly salary. Every role and every term published here.',
  alternates: { canonical: '/about/join-the-team' },
};

const ROLES = [
  { title: 'General Manager', type: 'Full-time · Lagos or remote', d: 'Runs the operating week: client delivery, cohort logistics, and the numbers that keep both honest. Reports to the founder.' },
  { title: 'Tribe (Community) Manager', type: 'Full-time · remote', d: 'Holds 2,400+ members together — onboarding, critique sessions, check-ins, and the reason people stay after their cohort ends.' },
  { title: 'Social Media Manager', type: 'Full-time · remote', d: 'Owns every channel: the calendar, the copy, the cuts, the replies. Not a poster — a publisher with a point of view.' },
  { title: 'Video Editor', type: 'Contract → full-time', d: 'Long-form and short-form for client work and Academy content. Speed matters; taste matters more.' },
  { title: 'Graphic Designer', type: 'Contract → full-time', d: 'Identity systems, campaign creative and social suites for real clients, briefed and reviewed by Stevenson of Motion Verse.' },
  { title: 'Website Designer / Developer', type: 'Contract → full-time', d: 'Next.js, TypeScript, real performance budgets. You will ship client sites, not slides.' },
];

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the team"
        title={<>We hire one team.<br /><span className="text-grad">Then we pay it.</span></>}
        lede="Not a roster of freelancers and not an unpaid internship. Sixty days of proving you can show up, then a monthly salary and real client work — with the terms written down below, in public."
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Join the team' }]}
      />

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="split" style={{ alignItems: 'start', gap: 56 }}>
            <div className="reveal up">
              <div className="eyebrow">The honest version</div>
              <h2 className="section-title" style={{ fontSize: 38 }}>What the sixty days actually are</h2>
            </div>
            <div className="prose-lg reveal up" data-delay="60">
              <p>
                Thirty days of the <strong>Consistency Drill</strong>: you post work every single day and it
                is visible in public. It is not a test of talent. It is a test of whether you will still be
                here on day twenty-nine when the novelty is gone.
              </p>
              <p>
                Then thirty days of <strong>team training</strong> on live client work — briefed, reviewed
                and corrected by the founders. At the end of the sixty days you are either on the paid team
                or you are not, and you will be told which.
              </p>
              <p style={{ color: 'var(--lilac)' }}>
                <strong>The one thing that is not yet published:</strong> the enrolment fee and its terms.
                Timfire has not approved the final figure, so it is not on this page. Nobody will be asked
                for money before that number is written here, in public, in full.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" id="how" style={{ borderTop: '1px solid var(--hair-soft)', borderBottom: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="eyebrow reveal up">The route</div>
          <div className="steps reveal up">
            {[
              { n: '01', t: 'Apply', d: 'One form, portfolio link optional. Applications are read by a person, not filtered by a keyword.' },
              { n: '02', t: 'Thirty days of showing up', d: 'The Consistency Drill. Daily work, public record. Most people stop in week two — that is the whole point of it.' },
              { n: '03', t: 'Thirty days of training', d: 'Live client briefs with review. You are measured on delivery, not on attendance.' },
              { n: '04', t: 'Paid team', d: 'Monthly salary, contract, and a defined role with a named manager. Reviewed every quarter.' },
            ].map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.t}</div>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Open roles</div>
              <h2 className="section-title">Who we are looking for</h2>
              <p className="section-lede">
                These are the roles the team actually needs. If you can do something on this list better
                than we can, apply — the bar is the work, not the CV.
              </p>
            </div>
          </div>
          <div className="grid g2" style={{ marginTop: 40 }}>
            {ROLES.map((r, i) => (
              <article className="card reveal up" data-delay={i * 50} key={r.title}>
                <div className="card-top">
                  <h3 style={{ fontSize: 20 }}>{r.title}</h3>
                  <span className="tag">{r.type}</span>
                </div>
                <p style={{ marginTop: 10 }}>{r.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="apply" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="split">
            <div className="reveal up" style={{ maxWidth: 400 }}>
              <div className="eyebrow">Apply</div>
              <h2 className="section-title" style={{ fontSize: 38 }}>Send the application</h2>
              <p className="section-lede">
                You will hear back either way, including when the answer is &ldquo;not this time&rdquo;.
                Most applications are read within two weeks.
              </p>
              <div className="meta-row" style={{ marginTop: 24 }}>
                <span><b>Where</b> {site.company.locations.join(' · ')}</span>
                <span><b>Reply</b> within two weeks, always</span>
              </div>
            </div>
            <div className="reveal up" data-delay="60">
              <LeadForm variant="team" siteId="team" roles={ROLES.map((r) => r.title).concat(['Something else'])} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="panel reveal up" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 22 }}>Not ready to apply, but want the training?</h3>
              <p style={{ marginTop: 8, maxWidth: 520 }}>
                The Academy is free and open. Many people start there, then come back for the drill.
              </p>
            </div>
            <a href={site.ecosystem.academy.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Apply to the Academy <span className="arrow-out">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
