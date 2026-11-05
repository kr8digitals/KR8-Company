import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import services from '../../../../data/services.json';
import { getSettings } from '@/lib/settings';
import site from '../../../../data/site.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon, Price, WhatsAppLink } from '@/components/ui';
import Showcase from '@/components/Showcase';
import Duo from '@/components/Duo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return { title: 'Service not found' };
  return {
    title: `${s.name} — KR8 Digitals`,
    description: s.summary,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

const HERO_ART: Record<string, { src: string; alt: string }> = {
  'website-design': { src: '/img/sites/cirenes-card.webp', alt: 'Cirenes Hotels — a live site built by KR8 Digitals' },
  'brand-graphic-design': { src: '/img/brand/city-fashion-stores-card.webp', alt: 'City Fashion Stores flyer by KR8 Digitals in association with Motionverse' },
  'video-editing': { src: '/video/story-03-poster.webp', alt: 'Poster frame from a KR8 Digitals film' },
  'ai-automation': { src: '/img/sites/jev-card.webp', alt: 'The Jev form router' },
  seo: { src: '/img/sites/prime-stem-full.webp', alt: 'Prime STEM Nigeria — a structured multi-page site' },
};

const GALLERY_TITLE: Record<string, { eyebrow: string; title: string; lede: string }> = {
  'website-design': {
    eyebrow: 'The portfolio',
    title: 'Every site, from the live deployment.',
    lede: 'Screenshots taken from the running sites, not from design files. 22 deployments across hotels, food, organisations, businesses and personal brands. Live for a client or for sale — the badge tells you which.',
  },
  'brand-graphic-design': {
    eyebrow: 'The gallery',
    title: 'Client artwork, credited to the people who made it.',
    lede: 'Event, product, retail and social work for named businesses. Open any piece full size — the artwork carries the credit: KR8 Digitals in association with Motionverse.',
  },
  'video-editing': {
    eyebrow: 'The films',
    title: 'Real cuts. They play here.',
    lede: 'Shot on a phone, cut properly: captions, pacing and a poster frame that earns the tap. CHIGOMA’s video work joins this gallery once the files are supplied.',
  },
  'ai-automation': {
    eyebrow: 'Working systems',
    title: 'Two things that are actually running.',
    lede: 'Not a slide about AI. The assistant in the corner of this site and the form router that decides where a message belongs — both live, both pressable.',
  },
  seo: {
    eyebrow: 'The method',
    title: 'The process, in the open.',
    lede: 'What we do, in the order we do it. No mystery, no black box, no promise about a position we cannot control.',
  },
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  const art = HERO_ART[s.slug];
  const g = GALLERY_TITLE[s.slug];
  const display = (await getSettings()).publicPriceDisplay;

  return (
    <>
      <PageHero
        eyebrow={`Service · ${s.short}`}
        title={<>{s.name.split(' ').slice(0, 2).join(' ')}<br /><span className="text-grad">{s.name.split(' ').slice(2).join(' ') || s.tagline}</span></>}
        lede={s.summary}
        aside={
          <figure style={{ margin: 0, position: 'relative' }}>
            <div className="duo__frame" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art.src} alt={art.alt} />
            </div>
            <figcaption style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t-faint)' }}>{art.alt}</figcaption>
          </figure>
        }
      />

      {/* ------------------------------------------------------- WHAT IT IS FOR */}
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            <div className="reveal up">
              <div className="eyebrow">Who it is for</div>
              <p className="prose-lg" style={{ marginTop: 14 }}>{s.forWhom}</p>
            </div>
            <div className="reveal up">
              <div className="eyebrow">The problem it solves</div>
              <p className="prose-lg" style={{ marginTop: 14 }}>{s.problem}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- THE GALLERY */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }} id="work">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">{g.eyebrow}</div>
              <h2 className="section-title">{g.title}</h2>
              <p className="section-lede">{g.lede}</p>
            </div>
          </div>
          <Showcase
            mode={s.gallery as 'sites' | 'flyers' | 'videos' | 'ai' | 'seo'}
            showPrices={display}
            filters={s.gallery === 'sites' || s.gallery === 'flyers'}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------- HOW */}
      <Duo
        eyebrow="How we work"
        title="Four steps, and you know where you are at each one."
        body={<p>{s.approach[0]}</p>}
        bullets={s.approach.slice(1)}
        media={[
          { src: '/img/sites/monabliss-full.webp', alt: 'Monabliss Hotels — a live site built by KR8 Digitals', caption: 'Built, deployed, handed over' },
          { src: '/img/team/founder-timfire-wide.jpg', alt: 'A working session at KR8 Digitals' },
        ]}
        flip
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="steps steps--row reveal up">
            {s.process.map((p) => (
              <div className="step" key={p.n}>
                <div className="step-num">{p.n}</div>
                <div className="step-title">{p.t}</div>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- OUTCOMES */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            <div className="reveal up">
              <div className="eyebrow">What you end up with</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>Outcomes</h2>
              <ul className="price-list" style={{ marginTop: 20 }}>
                {s.outcomes.map((o) => (
                  <li key={o}><Icon name="check" size={16} /> {o}</li>
                ))}
              </ul>
            </div>
            <div className="reveal up">
              <div className="eyebrow">Deliverables</div>
              <h2 className="section-title" style={{ marginTop: 10 }}>In the box</h2>
              <ul className="price-list" style={{ marginTop: 20 }}>
                {s.deliverables.map((d) => (
                  <li key={d}><Icon name="check" size={16} /> {d}</li>
                ))}
              </ul>
              <div className="panel" style={{ marginTop: 24, padding: 22 }}>
                <div className="eyebrow">Price</div>
                {display ? (
                  <div style={{ marginTop: 10 }}>
                    <Price usd={s.slug === 'seo' ? 250 : 900} code="USD" rates={{ USD: 1 }} showUsd={false} />
                    <p style={{ fontSize: 12.5, color: 'var(--t-faint)', marginTop: 6 }}>
                      Starting price. Final quote depends on scope; switch currency at checkout.
                    </p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 14, color: 'var(--t-body)', marginTop: 10, lineHeight: 1.6 }}>
                      <b>Fixed prices are set and waiting on approval.</b> They are not published yet. Ask and
                      you will get the number in writing, the same day.
                    </p>
                    <Link href={`/contact?service=${s.slug}`} className="btn-primary btn-sm" style={{ marginTop: 16 }}>
                      Request a quote <Icon name="arrow" size={15} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQS */}
      <section className="section" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="split reveal up" style={{ alignItems: 'end', marginBottom: 26 }}>
            <div>
              <div className="eyebrow">Questions</div>
              <h2 className="section-title">Answered before you ask.</h2>
            </div>
          </div>
          <div className="faq reveal up">
            {s.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <div className="faq-body">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band reveal up">
            <div className="eyebrow eyebrow--lilac">Next step</div>
            <h2>{s.cta}.</h2>
            <p>
              Tell us what has to happen and when. You will get a reply from a person, a price in writing and
              a date — not a discovery call that goes nowhere.
            </p>
            <div className="actions" style={{ marginTop: 28 }}>
              <Link href={`/contact?service=${s.slug}`} className="btn-primary">
                Work with us <Icon name="arrow" size={17} />
              </Link>
              <WhatsAppLink
                number={site.company.whatsapp}
                text={`Hi KR8 Digitals — I need help with ${s.name.toLowerCase()}.`}
                label="WhatsApp the team"
              />
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Not this one?"
        copy="Not this one? Every other service is open. If the thing you need lives on another page, open it here."
        cta="All services"
        href="/services"
        secondary={{ label: 'See the portfolio', href: '/services#websites' }}
      />
    </>
  );
}
