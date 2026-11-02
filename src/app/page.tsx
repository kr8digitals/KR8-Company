import Link from 'next/link';
import site from '../../data/site.json';
import partners from '../../data/partners.json';
import programmes from '../../data/programmes.json';
import team from '../../data/team.json';
import { Counter, Icon } from '@/components/ui';
import HeroStage from '@/components/HeroStage';
import ServiceCards from '@/components/ServiceCards';
import MixedRail from '@/components/MixedRail';
import Duo from '@/components/Duo';
import VisitorSelector from '@/components/VisitorSelector';

const eco = site.ecosystem;
const coFounders = partners.filter((p) => p.group === 'co-founders');
const others = partners.filter((p) => p.group !== 'co-founders');
const progs = programmes.programmes;

export const metadata = {
  title: 'KR8 Digitals — Whoever you are, whatever you do, we exist because of you.',
  description:
    'KR8 Digitals designs and builds websites, brands, films, AI systems and search visibility for organisations that need to be found, trusted and chosen.',
};

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden>
          <div className="blob-1" /><div className="blob-2" /><div className="vignette" />
        </div>
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="badge"><span className="badge-dot" /> A creative company</span>
              <h1 className="hero-title">
                <span className="line">Whoever you are,</span>
                <span className="line">whatever you do,</span>
                <span className="line text-grad">we exist because of you.</span>
              </h1>
              <p className="hero-copy">{site.hero.copy}</p>
              <div className="hero-actions">
                <Link href={site.hero.primary.href} className="btn-primary">
                  {site.hero.primary.label} <Icon name="arrow" size={18} />
                </Link>
                <a href={site.hero.secondary.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  {site.hero.secondary.label} <span className="arrow-out">↗</span>
                </a>
              </div>
              <div className="hero-note">
                <span>Websites, brand, video, AI and SEO</span><i />
                <span>{site.proof.sitesLive} sites live</span><i />
                <span>Free training alongside</span>
              </div>
            </div>
            <div>
              <HeroStage />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- MARQUEE */}
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="marquee-item" style={{ display: 'flex' }}>
              {['Websites', 'Brand', 'Video', 'AI', 'SEO', 'Training', 'Community', 'Partnership'].map((w) => (
                <span key={w} className="marquee-item"><span className="marquee-text">{w}</span><span className="diamond" /></span>
              ))}
            </div>
          ))}
        </div>
        <div className="fade-l" /><div className="fade-r" />
      </div>

      {/* ------------------------------------------------------ 2 · WHAT WE ARE */}
      <section className="section" id="who">
        <div className="wrap">
          <div className="reveal up" style={{ maxWidth: 860 }}>
            <div className="eyebrow">What KR8 Digitals is</div>
            <h2 className="section-title">
              A company that builds.<br />
              <span style={{ color: 'var(--t-muted)' }}>And a school that makes builders.</span>
            </h2>
            <p className="section-lede">
              The work comes first. Everything else — the training, the community, the gathering — exists
              because the work needs people who can do it, and because talent should not need money to prove
              itself.
            </p>
          </div>
          <div className="doors reveal up" data-delay="80">
            {site.pillars.map((d) => (
              <Link key={d.name} href={d.href} className="door">
                <span className="door__verb text-grad">{d.verb}</span>
                <span className="door__name">{d.name}</span>
                <span className="door__desc">{d.desc}</span>
                <span className="door__go">Open <Icon name="arrow" size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ 3 · PROOF STRIP */}
      <section className="proof" aria-label="KR8 Digitals in numbers">
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="proof-grid">
            {site.stats.map((s, i) => (
              <div className="proof-cell reveal up" data-delay={i * 60} key={s.id}>
                <div className="proof-num text-grad"><Counter value={s.value} suffix={s.suffix} /></div>
                <div className="proof-label">{s.label}</div>
                <div className="proof-src">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- 4 · SERVICES */}
      <section className="section" id="services">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Services</div>
              <h2 className="section-title">What we build for clients</h2>
              <p className="section-lede">
                Five things, one company, one standard. Every card below is a real piece of work you can open
                — a live site, a client flyer, a film that plays, a working system.
              </p>
            </div>
            <Link href="/services" className="btn-link">All services <Icon name="arrow" size={15} /></Link>
          </div>
          <ServiceCards />
        </div>
      </section>

      {/* ------------------------------------------------------------- 5 · WORK */}
      <section
        className="section section--tight"
        style={{ borderTop: '1px solid var(--hair-soft)', borderBottom: '1px solid var(--hair-soft)' }}
        id="work"
      >
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Our work</div>
              <h2 className="section-title">
                <span className="text-grad">{site.proof.sitesLive} sites</span> deployed. {site.proof.sitesForSale} of them are still for sale.
              </h2>
              <p className="section-lede">
                Not mockups and not concepts. Websites running on their own domains, flyers designed for real
                clients, films cut from real footage. Open one and judge the thing itself.
              </p>
            </div>
            <Link href="/services/website-design#portfolio" className="btn-link">
              Full portfolio <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>

        <MixedRail />

        <div className="wrap">
          <p style={{ marginTop: 10, fontSize: 13, color: 'var(--t-faint)' }}>
            Hover to pause. A website opens in a new tab; a flyer opens full size; a film plays on the spot.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- 6 · PROGRAMS */}
      <section className="section" id="programs">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Programs</div>
              <h2 className="section-title">What we run for people</h2>
              <p className="section-lede">
                Four programmes, and only one of them is a classroom. Free training, a community, a
                gathering, and a route into working with us.
              </p>
            </div>
            <Link href="/programs" className="btn-link">All programmes <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="gal__grid" style={{ marginTop: 44 }}>
            {progs.map((p, i) => (
              <article className="gal-card" key={p.slug}>
                <Link className="gal-card__shot" href={p.slug === 'free-training' ? '/programs#free-training' : `/programs#${p.slug}`} aria-label={p.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.imageAlt} loading="lazy" decoding="async" />
                </Link>
                <div className="gal-card__body">
                  <div className="gal-card__top"><span className="tag">{p.type}</span><span className="tag">{p.kicker}</span></div>
                  <h3>{p.name}</h3>
                  <p>{p.lede}</p>
                  <div className="gal-card__foot">
                    <Link href={`/programs#${p.slug}`} className="btn-link">Read more <Icon name="arrow" size={14} /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- 7 · PARTNERS */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Partners</div>
              <h2 className="section-title">We do not build alone</h2>
              <p className="section-lede">
                Two of our partners are co-founders, and one of them is a co-founding pair. They make the work
                with us — and they are how the training is taught by people who ship.
              </p>
            </div>
            <Link href="/partners" className="btn-link">See all partners <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="gal__grid gal__grid--brand" style={{ marginTop: 40 }}>
            <div className="logo-slot">
              <span className="logo-slot__mark">{coFounders.map((p) => p.mark).join(' · ')}</span>
              <b>{coFounders.map((p) => p.name).join(' + ')}</b>
              <small>Co-founding group · logo files pending</small>
            </div>
            {others.map((p) => (
              <div className="logo-slot" key={p.slug}>
                <span className="logo-slot__mark">{p.mark}</span>
                <b>{p.name}</b>
                <small>Logo slot ready</small>
              </div>
            ))}
            <div className="logo-slot" style={{ borderStyle: 'dotted' }}>
              <span className="logo-slot__mark">+</span>
              <b>Your logo here</b>
              <small>Tell us what you can bring</small>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- 8 · TEAM */}
      <section className="section" id="team">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">The team</div>
              <h2 className="section-title">Three founders. One company.</h2>
              <p className="section-lede">
                The people whose names are on the work. Each one has a page of their own.
              </p>
            </div>
            <Link href="/about" className="btn-link">About KR8 <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="founders" style={{ marginTop: 42 }}>
            {team.founders.map((f) => (
              <article className="founder" key={f.slug}>
                <div className="founder__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo} alt={`${f.name}, ${f.role}`} loading="lazy" decoding="async" />
                </div>
                <div className="founder__body">
                  <h3 className="founder__name">{f.name}</h3>
                  <div className="founder__role">{f.role}</div>
                  <div className="founder__full">{f.fullName}</div>
                  <Link href={f.readAbout} className="founder__link">
                    Read about {f.name} <Icon name="arrow" size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- 9 · JOIN TEAM */}
      <Duo
        eyebrow="Join the team"
        title="If you can build, we want to meet you."
        body={
          <p>
            The people who build our client work came through the same training. If you can show the work,
            there is a route in — a portfolio review first, then live projects with people who have shipped.
            Roles are published as they open; if none are listed, write to us anyway.
          </p>
        }
        media={[
          { src: '/img/team/founder-timfire-wide.jpg', alt: 'A KR8 Digitals founder at work', caption: 'Working session, KR8 Digitals' },
          { src: '/img/sites/academy-full.webp', alt: 'The KR8 Academy site' },
        ]}
        cta={{ label: 'How to join', href: '/about/join-the-team' }}
        secondary={{ label: 'See open roles', href: '/about/join-the-team#roles' }}
        flip
      />

      {/* -------------------------------------------------------- 10 · REFERRALS */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal up">
            <div className="eyebrow eyebrow--lilac">Referrals</div>
            <h2>You may not have the skill.<br /><span className="text-grad">You have the people.</span></h2>
            <p>
              You know a school that needs a website. A bakery that needs a brand. A founder nobody can find
              on Google. Introduce them. When the work is paid, you are paid.
            </p>
            <div className="actions" style={{ marginTop: 28 }}>
              <Link href="/referrals" className="btn-primary" data-track="become_referrer">
                Become a referrer <Icon name="arrow" size={17} />
              </Link>
              <span style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>10% on projects · 8% on creative · 12% after three</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- 11 · SELECTOR */}
      <VisitorSelector />

      {/* ------------------------------------------------------- 12 · PRE-FOOTER */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)' }}>
        <div className="wrap">
          <div className="split reveal up" style={{ alignItems: 'center', gap: 28 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 10 }}>
                If you run a school, a business, or a brand, we should talk.
              </h2>
              <p className="section-lede" style={{ margin: 0 }}>
                One form. A real reply. A price you can hold us to.
              </p>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn-primary">Work with us <Icon name="arrow" size={17} /></Link>
              <a
                href={`https://wa.me/${site.company.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Icon name="wa" size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
