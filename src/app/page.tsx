import Link from 'next/link';
import Image from 'next/image';
import site from '../../data/site.json';
import services from '../../data/services.json';
import portfolio from '../../data/portfolio.json';
import partners from '../../data/partners.json';
import programmes from '../../data/programmes.json';
import { Counter, Icon, WorkRail } from '@/components/ui';
import HeroStage from '@/components/HeroStage';
import People from '@/components/People';
import VisitorSelector from '@/components/VisitorSelector';

const eco = site.ecosystem;
const liveWork = portfolio.filter((p) => p.live && p.shot).slice(0, 6);

export const metadata = {
  title: 'KR8 Digitals — The Academy teaches. The Tribe holds. Services deliver.',
  description:
    'KR8 Digitals is a creative institution in Nigeria. A tuition-free academy, a working community, an event series and a studio that builds websites, brands, video and AI systems for clients.',
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
              <span className="badge"><span className="badge-dot" /> A school · a community · a studio</span>
              <h1 className="hero-title">
                <span className="line">Raw talent is</span>
                <span className="line">everywhere.</span>
                <span className="line text-grad">Access was not.</span>
              </h1>
              <p className="hero-copy">
                KR8 Digitals is a creative institution in Nigeria. We train people free, hold them in a
                community that answers, and put the best of them on real client work. One company, five
                doors, no gatekeeper.
              </p>
              <div className="hero-actions">
                <a href="#who" className="btn-primary">
                  Work with us <Icon name="arrow" size={18} />
                </a>
                <a href={eco.academy.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Learn free <span className="arrow-out">↗</span>
                </a>
              </div>
              <div className="hero-note">
                <span>Tuition-free since the first cohort</span><i />
                <span>7 tracks · 8 weeks</span><i />
                <span>Lagos &amp; Abakaliki</span>
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
              {['Design', 'Video', 'Web', 'AI', 'Search', 'Teaching', 'Community', 'Partnership'].map((w) => (
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
          <div className="reveal up">
            <div className="eyebrow">What KR8 Digitals is</div>
            <h2 className="section-title">
              Five doors. One institution.<br />
              <span style={{ color: 'var(--t-muted)' }}>Pick the one that is actually you.</span>
            </h2>
          </div>
          <div className="doors reveal up" data-delay="80">
            {site.doors.map((d) => (
              <Link key={d.verb} href={d.href} className="door">
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
                Five services, delivered by the same people who teach them. Every engagement starts with
                what the work has to make happen — not with a template.
              </p>
            </div>
            <Link href="/services" className="btn-link">All services <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="grid g3" style={{ marginTop: 48 }}>
            {services.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="card card--hover reveal up" data-delay={i * 70}>
                <div className="icon-box"><Icon name={s.icon} /></div>
                <h3>{s.name}</h3>
                <p>{s.summary}</p>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--magenta)' }}>
                  See the detail <Icon name="arrow" size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- 5 · WORK */}
      <section className="section section--tight" style={{ borderTop: '1px solid var(--hair-soft)', borderBottom: '1px solid var(--hair-soft)' }} id="work">
        <div className="wrap">
          <div className="sec-head reveal up">
            <div>
              <div className="eyebrow">Our work</div>
              <h2 className="section-title">
                We have built <span className="text-grad">{site.proof.websitesLive} live sites</span> for{' '}
                {site.proof.clients} clients.
              </h2>
              <p className="section-lede">
                Not mockups and not concepts. Every one of these is deployed, indexed and in use by the
                people who paid for it. Open one and judge the thing itself.
              </p>
            </div>
            <Link href="/services/website-design#work" className="btn-link">Full portfolio <Icon name="arrow" size={15} /></Link>
          </div>
        </div>
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <WorkRail
            items={liveWork.map((w) => ({
              name: w.name,
              category: w.category,
              shot: w.shot,
              href: w.url || undefined,
              meta: `${w.kind} · ${w.year}`,
            }))}
          />
        </div>
        <div className="wrap">
          <p style={{ marginTop: 26, fontSize: 13, color: 'var(--t-faint)' }}>
            Hover to pause. Each card opens the live site in a new tab.
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
                Training is where almost everybody starts, and it is genuinely free. If you already
                know what you want, three doors below.
              </p>
            </div>
            <Link href="/programs" className="btn-link">All programmes <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="grid g3" style={{ marginTop: 48 }}>
            {programmes.programmes.slice(0, 3).map((p, i) => (
              <article key={p.slug} className="card reveal up" data-delay={i * 70}>
                <div className="card-top">
                  <span className="pill">{programmes.tiers.find((t) => t.id === p.tier)?.label}</span>
                  <span className="tag">{p.commitment.split('·')[0]}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.lede}</p>
                <div style={{ marginTop: 18 }}>
                  {p.action.outbound ? (
                    <a href={p.action.href} target="_blank" rel="noopener noreferrer" className="btn-link">
                      {p.action.label} <span className="arrow-out">↗</span>
                    </a>
                  ) : (
                    <Link href={p.action.href} className="btn-link">{p.action.label} <Icon name="arrow" size={15} /></Link>
                  )}
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
                Two of our partners are co-founders. They teach their craft to our students for free, and
                they are why the training is taught by people who do the work rather than people who read
                about it.
              </p>
            </div>
            <Link href="/partners" className="btn-link">The partnership record <Icon name="arrow" size={15} /></Link>
          </div>

          <div className="grid g3" style={{ marginTop: 48 }}>
            {partners.filter((p) => p.featured).map((p, i) => (
              <Link key={p.slug} href={p.href} className="card card--hover reveal up" data-delay={i * 70}>
                <div className="card-top">
                  <span className="pill">{p.type}</span>
                  <span className="tag">{p.partnershipSince}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <div style={{ marginTop: 14, fontSize: 12.5, color: 'var(--lilac)' }}>
                  {p.person || p.role}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- 8 · TEAM */}
      <People compact />

      {/* -------------------------------------------------------- 9 · REFERRALS */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal up">
            <div className="eyebrow eyebrow--lilac">Referrals</div>
            <h2>You may not have the skill.<br /><span className="text-grad">You have the people.</span></h2>
            <p>
              You know a school that needs a website. A bakery that needs a brand. A founder nobody can
              find on Google. Introduce them. When the work is paid, you are paid.
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

      {/* -------------------------------------------------------- 10 · SELECTOR */}
      <VisitorSelector />
    </>
  );
}
