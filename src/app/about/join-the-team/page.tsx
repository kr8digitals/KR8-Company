import Link from 'next/link';
import type { Metadata } from 'next';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import LeadForm from '@/components/LeadForm';
import Duo from '@/components/Duo';
import { Icon } from '@/components/ui';
import programmes from '../../../../data/programmes.json';
import team from '../../../../data/team.json';

export const metadata: Metadata = {
  title: 'Join the team — the professional route',
  description:
    'The route from training with KR8 Digitals to working on real client projects: a portfolio review, then live work with people who have shipped. Roles are published as they open.',
  alternates: { canonical: '/about/join-the-team' },
};

type Prog = {
  name: string;
  lede: string;
  body: string;
  commitment: string;
  image: string;
  imageAlt: string;
  openRoles?: { title: string; line: string }[];
  rolesNote?: string;
};
const join = (programmes.programmes as unknown as Prog[]).find(
  (p) => (p as unknown as { slug: string }).slug === 'join-the-team'
)!;

const STEPS = [
  { n: '01', t: 'Show the work', d: 'A portfolio, a folder of files, a live link — whatever proves you can do the thing. No CV required.' },
  { n: '02', t: 'A conversation', d: 'What you want to be doing in a year, and whether this company can honestly give it to you.' },
  { n: '03', t: 'Work with us on real work', d: 'A live client project, reviewed the way client work is reviewed. You are paid for the work you do.' },
  { n: '04', t: 'The decision', d: 'Both sides decide. You are told either way, in writing, with the reason.' },
];

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the team"
        title={<>If you can build,<br /><span className="text-grad">we want to meet you.</span></>}
        lede={join.lede}
        aside={
          <figure style={{ margin: 0 }}>
            <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={join.image} alt={join.imageAlt} />
            </div>
            <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>{join.imageAlt}</figcaption>
          </figure>
        }
      />

      <section className="section" style={{ paddingTop: 50 }}>
        <div className="wrap">
          <div className="steps steps--row reveal up">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.t}</div>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Duo
        eyebrow="What it is"
        title="The professional route, not a course."
        body={
          <>
            <p>{join.body}</p>
            <p>
              There is no fee to apply and no unpaid trial. If you are working on a client project, you are
              paid for that work. Everything else — the review, the conversation — costs you time and nothing
              else.
            </p>
          </>
        }
        bullets={['A portfolio review, not a CV screen', 'Live client work with review from people who shipped', 'Paid for the work you do', 'An answer in writing either way']}
        media={[
          { src: '/img/team/founder-timfire-wide.jpg', alt: 'A working session at KR8 Digitals', caption: 'Working session · KR8 Digitals' },
          { src: '/img/sites/academy-full.webp', alt: 'The KR8 Academy site, where the training happens' },
        ]}
        cta={{ label: 'See the programmes', href: '/programs' }}
        flip
      />

      {/* --------------------------------------------------------------- ROLES */}
      <section className="section" id="roles" style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 90 }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Open roles</div>
              <h2 className="section-title">What is actually open.</h2>
              <p className="section-lede">
                Roles are published from the dashboard as they open. If the list is empty, that is the true
                state of it — not a page that forgot to be updated.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 34 }}>
            {join.openRoles && join.openRoles.length > 0 ? (
              join.openRoles.map((r) => (
                <div className="panel panel--row" key={r.title} style={{ marginBottom: 10 }}>
                  <b>{r.title}</b>
                  <span style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>{r.line}</span>
                </div>
              ))
            ) : (
              <div className="notice notice--neutral">
                <b>No roles published yet.</b> {join.rolesNote} A speculative application is still read — send
                the work, not the CV.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- FORM */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="grid g2 grid--loose" style={{ gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)' }}>
            <div className="reveal up">
              <div className="eyebrow">Send the work</div>
              <h2 className="section-title" style={{ fontSize: 34, marginTop: 10 }}>One link is enough.</h2>
              <p className="prose-lg" style={{ marginTop: 14 }}>
                A portfolio, a folder, a live site, a reel — anything you can point at. Tell us what you want to
                be doing, and we will tell you whether this is the right place for it.
              </p>
              <div className="meta-row" style={{ marginTop: 24 }}>
                <span>Commitment</span><b>{join.commitment}</b>
              </div>
              <div className="meta-row">
                <span>Fee to apply</span><b>None</b>
              </div>
              <div className="meta-row">
                <span>Answer</span><b>In writing, either way</b>
              </div>
              <div className="actions" style={{ marginTop: 26 }}>
                <Link href="/about" className="btn-ghost">Meet the team first</Link>
              </div>
            </div>
            <div className="reveal up" data-delay="60">
              <LeadForm variant="team" siteId="join-the-team" compact />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- TEAM */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow reveal up">Who you would work with</div>
          <div className="founders" style={{ marginTop: 26 }}>
            {team.founders.map((f) => (
              <article className="founder" key={f.slug}>
                <div className="founder__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo} alt={`${f.name}, ${f.role}`} loading="lazy" />
                </div>
                <div className="founder__body">
                  <h3 className="founder__name">{f.name}</h3>
                  <div className="founder__role">{f.role}</div>
                  <Link href={f.readAbout} className="founder__link">Read about {f.name} <Icon name="arrow" size={14} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Or start where everybody starts."
        copy="The free training is the widest door in this company. It costs nothing and it is how most of this team got here."
        cta="Free training"
        href="/programs#free-training"
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </>
  );
}
