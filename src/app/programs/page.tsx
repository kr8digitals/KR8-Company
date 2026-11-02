import Link from 'next/link';
import type { Metadata } from 'next';
import programmes from '../../../data/programmes.json';
import partners from '../../../data/partners.json';
import site from '../../../data/site.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';
import TribeWaitlist from '@/components/TribeWaitlist';

export const metadata: Metadata = {
  title: 'Programs — free training, the Tribe, Mindset Shift, the team',
  description:
    'KR8 Academy runs tuition-free eight-week tracks. The Tribe holds the community. Mindset Shift convenes the evening. Join the Team is the paid route. Four tiers, one institution.',
  alternates: { canonical: '/programs' },
};

const TIER_INTRO: Record<string, string> = {
  learn: 'Training you can start with nothing but a phone and the willingness to show up three evenings a week.',
  belong: 'Belonging, for as long as you want it. No fee, no gate, no expiry date on your membership.',
  convene: 'A room that changes what a young creative believes is possible before the skill arrives.',
  work: 'The route from trained to paid — contractual, reviewed, and with the terms published.',
};

export default function ProgramsPage() {
  const free = programmes.programmes.find((p) => p.slug === 'free-training')!;
  const tribe = programmes.programmes.find((p) => p.slug === 'the-tribe')!;
  const mindset = programmes.programmes.find((p) => p.slug === 'mindset-shift')!;
  const team = programmes.programmes.find((p) => p.slug === 'join-the-team')!;
  const teacherOf = (slug: string) => partners.find((p) => p.slug === slug);

  return (
    <>
      <PageHero
        eyebrow="Programs"
        title={<>Four ways in.<br /><span className="text-grad">None of them cost tuition.</span></>}
        lede="KR8 runs on four tiers: learn a skill, belong to a community, convene at an event, or work on a paid team. Every one is open to a person who has not made anything yet."
        crumbs={[{ label: 'Programs' }]}
        aside={
          <div className="panel" style={{ minWidth: 280 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>Fifth cohort · registration open</div>
            <p style={{ fontSize: 14.5, color: 'var(--t-body)', marginTop: 10, lineHeight: 1.6 }}>
              Onboarding 30 April. Classes begin 1 May. Seven tracks, eight weeks, Monday/Wednesday/Friday
              from 8pm WAT.
            </p>
            <a href={site.ecosystem.academy.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm" style={{ marginTop: 18 }}>
              Apply free <span className="arrow-out">↗</span>
            </a>
          </div>
        }
      />

      {/* tier map ----------------------------------------------------------- */}
      <section className="section" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="grid g4 reveal up">
            {programmes.tiers.map((t, i) => (
              <div key={t.id} className="panel" style={{ padding: 24 }}>
                <div className="tag" style={{ color: 'var(--magenta)' }}>{String(i + 1).padStart(2, '0')} · {t.commitment}</div>
                <h3 style={{ fontSize: 22, marginTop: 10 }}>{t.label}</h3>
                <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6 }}>{TIER_INTRO[t.id]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE TRAINING ------------------------------------------------------- */}
      <section className="section" id="free-training" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="split" style={{ alignItems: 'end', marginBottom: 44 }}>
            <div className="reveal up">
              <div className="eyebrow">Tier one · Learn</div>
              <h2 className="section-title">{free.name}</h2>
              <p className="section-lede">{free.lede}</p>
            </div>
            <a href={free.action.href} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {free.action.label} <span className="arrow-out">↗</span>
            </a>
          </div>

          <div className="grid g2" style={{ alignItems: 'start' }}>
            <div className="prose-lg reveal up">
              <p>{free.body}</p>
              <ul className="price-list" style={{ marginTop: 26 }}>
                {free.details.map((d) => <li key={d}><Icon name="check" size={15} /> {d}</li>)}
              </ul>
            </div>
            <div className="grid reveal up" data-delay="60" style={{ gap: 14 }}>
              {free.doors!.map((d) => (
                <div className="card" key={d.id}>
                  <div className="card-top">
                    <h3 style={{ fontSize: 19 }}>{d.title}</h3>
                    {d.partner && <span className="pill">{d.partner}</span>}
                  </div>
                  <p style={{ marginTop: 8 }}>{d.desc}</p>
                  <a href={d.href} target="_blank" rel="noopener noreferrer" className="btn-link" style={{ marginTop: 16, display: 'inline-flex' }}>
                    {d.cta} <span className="arrow-out">↗</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* tracks */}
          <div style={{ marginTop: 56 }}>
            <div className="eyebrow reveal up">Seven tracks · taught by practitioners</div>
            <div className="tbl-wrap reveal up" style={{ marginTop: 20 }}>
              <table className="tbl">
                <thead>
                  <tr><th>Track</th><th>Taught by</th><th>Partner</th><th className="num">Weeks</th></tr>
                </thead>
                <tbody>
                  {free.tracks!.map((t) => {
                    const partner = teacherOf(t.partner);
                    return (
                      <tr key={t.slug}>
                        <td><b>{t.name}</b></td>
                        <td>{t.taughtBy}</td>
                        <td>{partner ? <Link href={partner.href} style={{ color: 'var(--lilac)' }}>{partner.name}</Link> : <span style={{ color: 'var(--t-faint)' }}>In-house</span>}</td>
                        <td className="num">8</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--t-faint)' }}>
              Track pages, admissions requirements and the full timetable live on the Academy site — it is a
              separate application system, so applying there is the only way to register.
            </p>
          </div>
        </div>
      </section>

      {/* THE TRIBE ----------------------------------------------------------- */}
      <section className="section" id="tribe" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="story">
            <div className="reveal up">
              <div className="eyebrow">Tier two · Belong</div>
              <h2 className="section-title">{tribe.name}</h2>
              <p className="section-lede">{tribe.lede}</p>
              <div className="panel" style={{ marginTop: 30, padding: 24 }}>
                <div className="tag" style={{ color: 'var(--magenta)' }}>Opening soon</div>
                <p style={{ fontSize: 13.5, color: 'var(--t-muted)', marginTop: 8, lineHeight: 1.6 }}>
                  The Tribe has its own site in build. Until it opens, the waitlist below is the only route
                  in — and it is the first wave, not the queue.
                </p>
              </div>
            </div>
            <div className="reveal up" data-delay="60">
              <div className="prose-lg"><p>{tribe.body}</p></div>
              <ul className="price-list" style={{ marginTop: 24 }}>
                {tribe.details.map((d) => <li key={d}><Icon name="check" size={15} /> {d}</li>)}
              </ul>
              <div id="tribe-waitlist" style={{ marginTop: 30 }}>
                <TribeWaitlist />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MINDSET SHIFT ------------------------------------------------------- */}
      <section className="section" id="mindset-shift" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="split" style={{ alignItems: 'end' }}>
            <div className="reveal up">
              <div className="eyebrow">Tier three · Convene</div>
              <h2 className="section-title">{mindset.name}</h2>
              <p className="section-lede">{mindset.lede}</p>
            </div>
            <Link href={mindset.action.href} className="btn-primary">{mindset.action.label} <Icon name="arrow" size={16} /></Link>
          </div>

          <div className="grid g2 grid--loose" style={{ marginTop: 44, alignItems: 'start' }}>
            <div className="prose-lg reveal up"><p>{mindset.body}</p></div>
            <div className="reveal up" data-delay="60">
              <ul className="price-list">
                {mindset.details.map((d) => <li key={d}><Icon name="check" size={15} /> {d}</li>)}
              </ul>
              <div className="panel" style={{ marginTop: 26, padding: 22 }}>
                <p style={{ fontSize: 13.5, color: 'var(--t-muted)', lineHeight: 1.65 }}>
                  Mindset Shift runs every two weeks, in person in Abakaliki and streamed. There is no
                  ticket price. Invitations are limited by the size of the room, which is the only limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN THE TEAM ------------------------------------------------------- */}
      <section className="section" id="join-the-team" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: 'center', gap: 56 }}>
            <div className="reveal up">
              <div className="eyebrow">Tier four · Work</div>
              <h2 className="section-title" style={{ fontSize: 44 }}>{team.name}</h2>
              <p className="section-lede">{team.lede}</p>
              <ul className="price-list" style={{ marginTop: 26 }}>
                {team.details.map((d) => <li key={d}><Icon name="check" size={15} /> {d}</li>)}
              </ul>
              <Link href="/about/join-the-team" className="btn-primary" style={{ marginTop: 28 }}>
                See open roles <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="panel reveal up" data-delay="60">
              <h3 style={{ fontSize: 20 }}>Why the team route exists</h3>
              <p style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.7 }}>
                {team.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Start with the free one."
        copy="Almost everybody starts at the Academy. Seven tracks, eight weeks, no tuition, and a certificate at the end that an employer can verify without asking us."
        cta="Apply to the Academy"
        href="/programs#free-training"
        secondary={{ label: 'Join the Tribe list', href: '/programs#tribe-waitlist' }}
      />
    </>
  );
}
