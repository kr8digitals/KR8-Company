import Link from 'next/link';
import type { Metadata } from 'next';
import site from '../../../data/site.json';
import team from '../../../data/team.json';
import partners from '../../../data/partners.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';
import Duo from '@/components/Duo';

export const metadata: Metadata = {
  title: 'About — the company, the people, the reason it exists',
  description:
    'KR8 Digitals is a creative company that builds websites, brands, films, AI systems and SEO optimisation — and trains the people who build them next. Meet the founders and the team behind it.',
  alternates: { canonical: '/about' },
};

const TIMELINE = [
  { when: 'First', t: 'A company that builds', d: 'KR8 Digitals starts as a delivery company: clients, deadlines, work that has to survive being used by real customers.' },
  { when: 'Then', t: 'A school inside it', d: 'The work needed people who could do it. Rather than complain about the market, the team started training — free.' },
  { when: 'Then', t: 'A community', d: 'The people who finished training did not want to stop. The Tribe keeps the room open after the cohort ends.' },
  { when: 'Now', t: 'An umbrella', d: 'Brands and practices build inside KR8 Digitals and keep their own name: Motion Verse for design, CHIGOMA for video, Next Gen Scholars for academics.' },
];

export default function About() {
  const coFounders = partners.filter((p) => p.group === 'co-founders');
  return (
    <>
      <PageHero
        eyebrow="About KR8 Digitals"
        title={<>We build the thing<br /><span className="text-grad">that makes people act.</span></>}
        lede="KR8 Digitals is a creative company. A website that loads, a brand people remember, a film that holds attention, a system that takes the boring work off a human. Everything else we do exists to keep that possible."
        aside={
          <figure style={{ margin: 0 }}>
            <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/team/founder-timfire-wide.jpg" alt="Kenneth Timothy Iziogo, founder of KR8 Digitals, at work" />
            </div>
            <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>
              Kenneth Timothy Iziogo — founder. The company is named for him.
            </figcaption>
          </figure>
        }
      />

      {/* ------------------------------------------------------------ STORY */}
      <Duo
        eyebrow="The company"
        title="An umbrella, not a pipe."
        body={
          <>
            <p>
              Most creative companies try to be one brand with one look and one voice. KR8 Digitals works the
              other way round. It is the company clients hire, and the roof that practices build under — the way
              Google is the company, and YouTube, Android and DeepMind live inside it with their own names and
              their own people.
            </p>
            <p>
              <strong>Motion Verse</strong> is design. <strong>CHIGOMA</strong> is video and creative
              expression. <strong>Next Gen Scholars</strong> is academics. Each keeps its name, its credit and
              its own standard — and each delivers through the company, to the same client, on the same
              invoice.
            </p>
            <p>
              That is why the training can be free and still be good: the people teaching it run the practices
              that take the work.
            </p>
          </>
        }
        media={[
          { src: '/img/brand/city-fashion-stores-full.webp', alt: 'A client flyer designed in association with Motion Verse', caption: 'Design · Motion Verse' },
          { src: '/img/sites/afristem-full.webp', alt: 'The AFRISTEM Global website built by KR8 Digitals' },
        ]}
        cta={{ label: 'See the work', href: '/services' }}
      />

      {/* ------------------------------------------------------ MISSION/VISION */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            <div className="reveal up">
              <div className="eyebrow">Mission</div>
              <h2 className="section-title" style={{ marginTop: 10, fontSize: 30 }}>Build work that earns its place.</h2>
              <p className="prose-lg" style={{ marginTop: 14 }}>{site.company.mission}</p>
            </div>
            <div className="reveal up">
              <div className="eyebrow">Vision</div>
              <h2 className="section-title" style={{ marginTop: 10, fontSize: 30 }}>A company the next person can walk into.</h2>
              <p className="prose-lg" style={{ marginTop: 14 }}>
                Not an agency that guards its clients, and not a charity that hands out hope. A company where
                somebody with talent and no money can learn the craft, get held to a real standard, and end up
                on the invoice. The training is not marketing — it is the supply chain.
              </p>
            </div>
          </div>

          <div className="timeline reveal up" style={{ marginTop: 40 }}>
            {TIMELINE.map((t) => (
              <div className="timeline__row" key={t.t}>
                <div className="timeline__when">{t.when}</div>
                <div className="timeline__what">
                  <b>{t.t}</b>
                  <p>{t.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- FOUNDERS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }} id="founders">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">The founders</div>
              <h2 className="section-title">Three people, three crafts,<br /><span className="text-grad">one company.</span></h2>
              <p className="section-lede">
                Their names are on the work. Each one has a section below with their role, what they are
                responsible for and where to find them.
              </p>
            </div>
          </div>

          {team.founders.map((f, i) => (
            <div id={f.slug} key={f.slug} style={{ scrollMarginTop: 96 }}>
              <Duo
                flip={i % 2 === 1}
                eyebrow={`Founder ${String(i + 1).padStart(2, '0')} · ${f.role}`}
                title={<>{f.name}<span style={{ display: 'block', fontSize: 15, fontWeight: 500, letterSpacing: 0, color: 'var(--t-faint)', marginTop: 10, fontFamily: 'Sora, sans-serif' }}>{f.fullName}</span></>}
                body={
                  <>
                    <p>{f.bio}</p>
                    {f.bio.toLowerCase().startsWith('placeholder') && (
                      <p><span className="pending-tag">Bio needed</span></p>
                    )}
                    <p style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
                      {f.links.map((l) => (
                        <a key={l.label} href={l.href} className="btn-link" {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                          {l.label} <Icon name="arrow" size={14} />
                        </a>
                      ))}
                      <Link href="/contact" className="btn-link">Work with us <Icon name="arrow" size={14} /></Link>
                    </p>
                  </>
                }
                media={[
                  { src: f.photo, alt: `${f.name} — ${f.role} at KR8 Digitals`, caption: `${f.name} · ${f.role}` },
                  ...(f.photoWide !== f.photo ? [{ src: f.photoWide, alt: `${f.name} at work` }] : []),
                ]}
              />
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- TEAM */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }} id="team">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">The team</div>
              <h2 className="section-title">The people who run it.</h2>
              <p className="section-lede">
                Beyond the founders, four people hold the company together. Roles are as published by KR8
                Digitals; biographies are being collected.
              </p>
            </div>
            <Link href="/about/join-the-team" className="btn-link">Join the team <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="gal__grid gal__grid--brand" style={{ marginTop: 40 }}>
            {team.team.map((p) => (
              <article className="gal-card" key={p.name}>
                <div className="gal-card__shot" style={{ background: '#140b29' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.photo} alt={`${p.name}, ${p.role}`} loading="lazy" decoding="async" />
                </div>
                <div className="gal-card__body">
                  <div className="gal-card__top"><span className="tag">{p.role}</span></div>
                  <h3>{p.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- CO-FOUNDING */}
      <Duo
        eyebrow="Built with"
        title="The practices under the roof."
        body={
          <>
            <p>
              Motion Verse and CHIGOMA are our co-founding partners — design and video, working together on the
              same projects and credited on the work. Next Gen Scholars runs the academic door of the free
              training.
            </p>
            <p>
              Brands join the company rather than sit beside it: same client, same standard, their own name on
              the piece.
            </p>
          </>
        }
        bullets={coFounders.map((p) => `${p.name} — ${p.role}`)}
        media={[
          { src: '/img/brand/zoey-perfume-full.webp', alt: 'Zoey Perfume flyer by KR8 Digitals in association with Motion Verse', caption: 'Client work · Motion Verse' },
          { src: '/video/story-elizabeth-poster.webp', alt: 'Poster frame from a film cut by CHIGOMA' },
        ]}
        cta={{ label: 'See our partners', href: '/partners' }}
        flip
      />

      {/* ---------------------------------------------------------- JOIN TEAM */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band reveal up">
            <div className="eyebrow eyebrow--lilac">Join the team</div>
            <h2>We are always looking at work.</h2>
            <p>
              The people who build our client work came through the same training. If you can show the work,
              there is a route in: a portfolio review first, then live projects with people who have shipped.
            </p>
            <div className="actions" style={{ marginTop: 28 }}>
              <Link href="/about/join-the-team" className="btn-primary">How to join <Icon name="arrow" size={17} /></Link>
              <Link href="/programs" className="btn-ghost">Start with free training</Link>
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="If you run a school, a business, or a brand, we should talk."
        copy="One form, a real reply, and a price in writing before you commit to anything."
        cta="Work with us"
      />
    </>
  );
}
