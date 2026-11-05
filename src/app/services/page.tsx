import Link from 'next/link';
import type { Metadata } from 'next';
import services from '../../../data/services.json';
import sitesData from '../../../data/sites.json';
import { getSettings } from '@/lib/settings';
import site from '../../../data/site.json';
import PageHero, { ClosingCTA } from '@/components/PageHero';
import { Icon } from '@/components/ui';
import Showcase from '@/components/Showcase';
import Duo from '@/components/Duo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services — websites, brand, video, AI and SEO',
  description:
    'Website design and development, brand and graphic design, video editing, AI automation and SEO optimisation. Every service backed by live work you can open: 22 deployed sites, client flyers, real films.',
  alternates: { canonical: '/services' },
};

const QUESTIONS = [
  { q: 'Nobody can find us online.', a: 'SEO Optimisation', href: '/services/seo' },
  { q: 'Our website is slow and embarrassing.', a: 'Website design', href: '/services/website-design' },
  { q: 'We look like every other business.', a: 'Brand & design', href: '/services/brand-graphic-design' },
  { q: 'Our video gets no engagement.', a: 'Video editing', href: '/services/video-editing' },
  { q: 'We answer the same question all day.', a: 'AI & automation', href: '/services/ai-automation' },
];

export default async function ServicesIndex() {
  const settings = await getSettings();
  const { sitesForSale, sitesLive } = site.proof;
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Already built.<br /><span className="text-grad">Pick the one you need.</span></>}
        lede="We are not going to describe the work and ask you to imagine it. Every service below has live proof attached: websites running on their own domains, flyers designed for named clients, films that play on this page, and systems you can press."
        aside={
          <div className="panel" style={{ minWidth: 280 }}>
            <div className="tag" style={{ color: 'var(--magenta)' }}>On this account now</div>
            <p style={{ fontSize: 14, color: 'var(--t-body)', marginTop: 10, lineHeight: 1.7 }}>
              <b>{sitesLive}</b> sites deployed · <b>{sitesForSale}</b> finished and for sale<br />
              <b>{sitesData.flyers.length}</b> client flyers · <b>{sitesData.videos.length}</b> films on this page
            </p>
            <Link href="/contact" className="btn-primary btn-sm" style={{ marginTop: 18 }}>
              Work with us <Icon name="arrow" size={15} />
            </Link>
          </div>
        }
      />

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="eyebrow reveal up">Start with the symptom</div>
          <div className="grid g3 reveal up" style={{ marginTop: 22, gap: 14 }}>
            {QUESTIONS.map((q) => (
              <Link key={q.q} href={q.href} className="panel panel--row">
                <span style={{ color: 'var(--t-muted)', fontSize: 14.5 }}>&ldquo;{q.q}&rdquo;</span>
                <span className="tag" style={{ color: '#fff', fontWeight: 700 }}>{q.a} <Icon name="arrow" size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="grid g2 grid--loose">
            {services.map((s) => (
              <Link key={s.slug} href={`#${s.anchor}`} className="card card--hover reveal up">
                <div className="icon-box"><Icon name={s.icon} /></div>
                <div className="card-top">
                  <span className="pill">{String(s.order).padStart(2, '0')}</span>
                </div>
                <h3>{s.group}</h3>
                <p style={{ marginTop: 8 }}>{s.tagline}</p>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--magenta)' }}>
                  Jump to the work <Icon name="arrow" size={14} />
                </div>
              </Link>
            ))}
            <div className="card reveal up" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="tag" style={{ color: 'var(--magenta)' }}>Not sure which one</div>
              <h3 style={{ marginTop: 10 }}>Describe the problem instead.</h3>
              <p style={{ marginTop: 8 }}>
                You do not need to know whether it is SEO or a rebuild. Tell us what is not happening and we
                will tell you what it will take — in writing, before you pay anything.
              </p>
              <Link href="/contact" className="btn-primary btn-sm" style={{ marginTop: 20, alignSelf: 'flex-start' }}>
                Work with us <Icon name="arrow" size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ WEBSITES: FULL BOOK */}
      <section className="section" id="websites" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">01 · Websites</div>
              <h2 className="section-title">
                {sitesLive} live sites.<br />
                <span className="text-grad">{sitesForSale} of them are still for sale.</span>
              </h2>
              <p className="section-lede">
                Every card is a real deployment from our own account — hotels, restaurants and bakeries,
                organisations and non-profits, businesses, personal and brand work. Filter it, open one, or buy
                one and we will put your name on it.
              </p>
            </div>
            <Link href="/services/website-design" className="btn-link">Open the website service <Icon name="arrow" size={15} /></Link>
          </div>
          <Showcase mode="sites" showPrices={settings.publicPriceDisplay} />
        </div>
      </section>

      {/* ------------------------------------------------------- BRAND GALLERY */}
      <section className="section" id="graphic-design" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">02 · Graphic design &amp; branding</div>
              <h2 className="section-title">Client flyers, credited to Motionverse.</h2>
              <p className="section-lede">
                Real artwork for named businesses. Open any of them at full size — the credit is on the work
                because it is true: KR8 Digitals in association with Motionverse.
              </p>
            </div>
            <Link href="/services/brand-graphic-design" className="btn-link">Open the design service <Icon name="arrow" size={15} /></Link>
          </div>
          <Showcase mode="flyers" filters={false} />
        </div>
      </section>

      {/* --------------------------------------------------------- FILM GALLERY */}
      <section className="section" id="video" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">03 · Video editing</div>
              <h2 className="section-title">Films that play, not screenshots of films.</h2>
              <p className="section-lede">
                Press play. These are real cuts made from real footage, streaming from this site. CHIGOMA&apos;s
                video work takes its own place in this gallery as soon as the files are supplied.
              </p>
            </div>
            <Link href="/services/video-editing" className="btn-link">Open the video service <Icon name="arrow" size={15} /></Link>
          </div>
          <Showcase mode="videos" filters={false} />
        </div>
      </section>

      <div id="seo" />
      <Duo
        eyebrow="04 · SEO Optimisation"
        title="Be the answer when somebody searches."
        body={
          <p>
            Search rewards structure, not adjectives. We fix the floor first — titles, descriptions,
            structured data, sitemap, speed, mobile — then build a page for every service and every place you
            actually serve. You get a monthly record of what changed and what moved.
          </p>
        }
        bullets={[
          'A real title and description on every route',
          'Structured data so search and social show the right thing',
          'A page per service instead of one crowded home page',
          'Reporting on what was done, not just a rank screenshot',
        ]}
        media={[
          { src: '/img/sites/afristem-school-full.webp', alt: 'AFRISTEM Digital Science School — a structured multi-page site', caption: 'Structure: a page for each programme' },
          { src: '/img/sites/mcgettrick-full.webp', alt: 'McGettrick Pastoral Centre site' },
        ]}
        cta={{ label: 'Ask for an audit', href: '/contact?service=seo' }}
      />

      <section className="section" id="ai" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">05 · AI agents &amp; automation</div>
              <h2 className="section-title">
                Work that answers itself<br />
                <span className="text-grad">while nobody is watching.</span>
              </h2>
              <p className="section-lede">
                Two of these are running in production right now: the routing form below, and the assistant in
                the corner of this site. Both are builds you can press, not promises.
              </p>
            </div>
            <Link href="/services/ai-automation" className="btn-link">Open the AI service <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="grid g2 grid--loose" style={{ marginTop: 40 }}>
            <article className="card reveal up">
              <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--hair-soft)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/sites/jev-card.webp" alt="The Jev AI form router — a live build" loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
              </div>
              <div className="tag" style={{ marginTop: 16, color: 'var(--magenta)' }}>Live build</div>
              <h3 style={{ marginTop: 8 }}>The form that routes itself</h3>
              <p style={{ marginTop: 8 }}>
                A visitor describes what they need in their own words; the system reads it, decides which service
                it belongs to and sends it to the right inbox with a summary attached.
              </p>
              <a href="https://jev-and-ai-sdk-zeta-seven.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-link" style={{ marginTop: 14 }}>
                Open it <span className="arrow-out">↗</span>
              </a>
            </article>

            <article className="card reveal up">
              <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--hair-soft)', background: '#140b29', padding: 22 }}>
                <div className="host-msg host-msg--bot" style={{ maxWidth: '100%' }}>
                  Which service should I send a bakery owner to?
                </div>
                <div className="host-msg host-msg--team" style={{ maxWidth: '100%', marginTop: 10 }}>
                  Websites first — they need one page that takes orders. I have put the quote form in front of
                  them.
                </div>
              </div>
              <div className="tag" style={{ marginTop: 16, color: 'var(--magenta)' }}>Running on this site</div>
              <h3 style={{ marginTop: 8 }}>The assistant you can talk to</h3>
              <p style={{ marginTop: 8 }}>
                Ask Ada answers questions about the work, the prices, the programmes and how to reach a person —
                and hands over to the team the moment a conversation needs one.
              </p>
              <span className="btn-link" style={{ marginTop: 14 }}>Press &ldquo;Ask Ada&rdquo; in the corner</span>
            </article>
          </div>

          <div className="panel reveal up" style={{ marginTop: 34, padding: 30, display: 'flex', gap: 22, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: 22 }}>What could we automate for you?</h3>
              <p style={{ marginTop: 6, color: 'var(--t-muted)', fontSize: 14.5 }}>
                Tell us the job that eats your day and we will tell you what can be taken off it.
              </p>
            </div>
            <Link href="/contact?service=ai-automation" className="btn-primary btn-sm">
              Tell us the job <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
      </section>

      <ClosingCTA
        title="Tell us what has to happen."
        copy="One form, one reply from a person, and a price you can hold us to. If you would rather talk first, WhatsApp is one tap away."
        cta="Work with us"
      />
    </>
  );
}
