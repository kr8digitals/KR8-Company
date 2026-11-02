import Link from 'next/link';
import type { Metadata } from 'next';
import programmes from '../../../data/programmes.json';
import site from '../../../data/site.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';
import Duo from '@/components/Duo';

export const metadata: Metadata = {
  title: 'Programs — free training, the Tribe, Mindset Shift, Join the Team',
  description:
    'Four KR8 Digitals programmes: free training in digital skills and academics, the Tribe community, the Mindset Shift gathering, and the route into working with the company.',
  alternates: { canonical: '/programs' },
};

type Prog = {
  slug: string;
  name: string;
  kicker: string;
  type: string;
  image: string;
  imageAlt: string;
  lede: string;
  body: string;
  commitment: string;
  action: { label: string; href: string; outbound: boolean };
  doors: { name: string; line: string; partner: string; href: string; outbound: boolean; cta: string }[];
  tracks: string[];
  editions?: { title: string; date: string; note: string }[];
  editionsNote?: string;
  openRoles?: { title: string; line: string }[];
  rolesNote?: string;
};

const P = programmes.programmes as unknown as Prog[];
const byslug = (s: string) => P.find((p) => p.slug === s)!;

export default function Programs() {
  const intro = programmes.intro;
  const ft = byslug('free-training');
  const tribe = byslug('tribe');
  const mindset = byslug('mindset-shift');
  const join = byslug('join-the-team');

  return (
    <>
      <PageHero
        eyebrow={intro.eyebrow}
        title={<>Four programmes.<br /><span className="text-grad">One of them is a classroom.</span></>}
        lede={intro.lede}
        aside={
          <figure style={{ margin: 0 }}>
            <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={intro.image} alt={intro.imageAlt} />
            </div>
            <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>{intro.imageAlt}</figcaption>
          </figure>
        }
      />

      {/* ------------------------------------------------------------ OVERVIEW */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="gal__grid gal__grid--brand">
            {P.map((p) => (
              <article className="gal-card" key={p.slug}>
                <div className="gal-card__shot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.imageAlt} loading="lazy" decoding="async" />
                </div>
                <div className="gal-card__body">
                  <div className="gal-card__top"><span className="tag">{p.type}</span></div>
                  <h3>{p.name}</h3>
                  <p>{p.lede}</p>
                  <div className="gal-card__foot">
                    <a href={`#${p.slug}`} className="btn-link">Read the section <Icon name="arrow" size={14} /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- FREE TRAINING */}
      <section className="section" id="free-training" style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 90 }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Programme 01 · {ft.kicker}</div>
              <h2 className="section-title">{ft.name}</h2>
              <p className="section-lede">{ft.body}</p>
            </div>
            <Link href="https://academy.kr8digitals.com" target="_blank" rel="noopener noreferrer" className="btn-link">
              academy.kr8digitals.com <span aria-hidden>↗</span>
            </Link>
          </div>

          <div className="grid g2 grid--loose" style={{ marginTop: 40 }}>
            {ft.doors.map((d) => (
              <div className="card reveal up" key={d.name} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-top">
                  <span className="pill">{d.name}</span>
                  <span className="tag">{ft.commitment}</span>
                </div>
                <h3 style={{ marginTop: 12 }}>{d.name === 'Digital Skills' ? 'Learn a craft' : 'Pass the exams'}</h3>
                <p style={{ marginTop: 8 }}>{d.line}</p>
                <div className="panel" style={{ marginTop: 18, padding: '14px 16px' }}>
                  <div className="eyebrow" style={{ fontSize: 10 }}>Who teaches it</div>
                  <p style={{ fontSize: 13, color: 'var(--t-muted)', marginTop: 6 }}>{d.partner}</p>
                </div>
                <div style={{ marginTop: 20 }}>
                  {d.outbound ? (
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
                      {d.cta} <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <Link href={d.href} className="btn-primary btn-sm">{d.cta} <Icon name="arrow" size={15} /></Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="panel reveal up" style={{ marginTop: 22, padding: 26 }}>
            <div className="eyebrow">The digital tracks</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              {ft.tracks.map((t) => (
                <span className="chip" key={t}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--t-faint)', marginTop: 14 }}>
              Seven tracks in total across the Academy. Applications, admissions and student verification all
              happen on the Academy site — this page does not take registrations.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- TRIBE */}
      <Duo
        eyebrow={`Programme 02 · ${tribe.kicker}`}
        title={<>The Tribe keeps the room open.</>}
        body={
          <>
            <p>{tribe.body}</p>
            <p>
              There is no form on this page and no registration. The Tribe&rsquo;s own site
              (tribe.kr8digitals.com) is still in preparation, so the link below opens our holding page rather
              than a dead address.
            </p>
          </>
        }
        bullets={tribe.tracks}
        media={[
          { src: tribe.image, alt: tribe.imageAlt, caption: 'A member of the community, filmed for their story' },
          { src: '/img/work/p-grant.jpg', alt: 'A community member photographed for their story' },
        ]}
        cta={{ label: 'Open the Tribe page', href: '/tribe' }}
      />

      {/* -------------------------------------------------------- MINDSET SHIFT */}
      <section className="section" id="mindset-shift" style={{ borderTop: '1px solid var(--hair-soft)', scrollMarginTop: 90 }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Programme 03 · {mindset.kicker}</div>
              <h2 className="section-title">{mindset.name}</h2>
              <p className="section-lede">{mindset.body}</p>
            </div>
            <Link href="/programs/mindset-shift/invite" className="btn-link">Register interest <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="grid g2 grid--loose" style={{ marginTop: 40 }}>
            <div className="panel reveal up" style={{ padding: 26 }}>
              <div className="eyebrow">This edition</div>
              <p style={{ marginTop: 12, fontSize: 15, color: '#fff', lineHeight: 1.65 }}>
                Dates, venue and speakers are set per edition and published here as soon as the team confirms
                them.
              </p>
              <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
                <div className="meta-row"><span>Date &amp; time</span><span className="pending-tag">To confirm</span></div>
                <div className="meta-row"><span>Venue</span><span className="pending-tag">To confirm</span></div>
                <div className="meta-row"><span>Speakers</span><span className="pending-tag">To confirm</span></div>
                <div className="meta-row"><span>Cost</span><span className="pending-tag">To confirm</span></div>
              </div>
              <Link href="/programs/mindset-shift/invite" className="btn-primary btn-sm" style={{ marginTop: 22 }}>
                Register interest <Icon name="arrow" size={15} />
              </Link>
            </div>

            <div className="reveal up">
              <div className="duo__frame" style={{ aspectRatio: '16 / 11' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mindset.image} alt={mindset.imageAlt} loading="lazy" />
              </div>
              <div className="eyebrow" style={{ marginTop: 26 }}>Past editions</div>
              <div className="empty-state" style={{ marginTop: 12 }}>
                {mindset.editions && mindset.editions.length > 0 ? (
                  mindset.editions.map((e) => (
                    <div className="meta-row" key={e.title}><b>{e.title}</b><span>{e.date}</span></div>
                  ))
                ) : (
                  <p style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>{mindset.editionsNote}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- JOIN THE TEAM */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            <div className="reveal up">
              <div className="eyebrow">Programme 04 · {join.kicker}</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>{join.name}</h2>
              <p className="prose-lg" style={{ marginTop: 16 }}>{join.body}</p>
              <div className="meta-row" style={{ marginTop: 22 }}><span>Commitment</span><b>{join.commitment}</b></div>
              <Link href="/about/join-the-team" className="btn-primary" style={{ marginTop: 24 }}>
                How to join <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="reveal up">
              <div className="duo__frame" style={{ aspectRatio: '16 / 11' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={join.image} alt={join.imageAlt} loading="lazy" />
              </div>
              <div className="eyebrow" style={{ marginTop: 26 }}>Open roles</div>
              <div style={{ marginTop: 12 }}>
                {join.openRoles && join.openRoles.length > 0 ? (
                  join.openRoles.map((r) => (
                    <div className="panel panel--row" key={r.title} style={{ marginBottom: 8 }}>
                      <b>{r.title}</b><span style={{ fontSize: 13, color: 'var(--t-muted)' }}>{r.line}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>{join.rolesNote}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- PRINCIPLES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="grid g3">
            {programmes.principles.map((p, i) => (
              <div className="card reveal up" key={p.t} data-delay={i * 70}>
                <div className="tag" style={{ color: 'var(--magenta)' }}>0{i + 1}</div>
                <h3 style={{ marginTop: 10 }}>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Ready to start?"
        copy="Free training happens on the Academy site. Everything else — the Tribe, Mindset Shift, joining the team — is one page away."
        cta="Apply for free training"
        href="https://academy.kr8digitals.com/apply"
        secondary={{ label: 'Talk to us first', href: '/contact' }}
      />
    </>
  );
}
