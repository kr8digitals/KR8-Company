import Link from 'next/link';
import site from '../../data/site.json';
import { getCmsNavigation, getCmsServices, getCmsTeam } from '@/lib/cms';

export default async function Footer() {
  const [navCfg, services, teamBundle] = await Promise.all([
    getCmsNavigation(),
    getCmsServices(),
    getCmsTeam(),
  ]);

  const year = new Date().getFullYear();
  const socials = (navCfg.socials || site.company.socials || []).filter((s: any) => s.href);
  const eco = site.ecosystem;
  const email = navCfg.companyEmail || site.company.email;
  const phone = navCfg.companyPhone || site.company.phone;
  const whatsapp = navCfg.companyWhatsapp || site.company.whatsapp;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-map">
          {/* Column 1: Brand Identity & Direct Contact */}
          <div className="foot-brand">
            <Link href="/" className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="logo__mark"
                src="/img/brand/kr8-mark-256.webp"
                alt=""
                width={38}
                height={38}
              />
              <span className="logo__type">
                {site.company.wordmark.a}
                <span className="g" style={{ marginLeft: 7 }}>
                  {site.company.wordmark.b}
                </span>
              </span>
              <span className="sr-only"> — home</span>
            </Link>

            <p>
              {navCfg.shortDescription ||
                'A creative technology company engineering websites, brand systems, commercial graphics, films, SEO, and AI workflows — while empowering the next generation of digital builders for free.'}
            </p>

            <div style={{ marginTop: 18, display: 'grid', gap: 6, fontSize: 13.5 }}>
              <a
                href={`mailto:${email}`}
                style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}
              >
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                style={{ color: 'var(--t-muted)', textDecoration: 'none' }}
              >
                {phone}
              </a>
            </div>

            {socials.length > 0 ? (
              <div className="foot-socials">
                {socials.map((s: any) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: '1px solid var(--hair)',
                    color: 'var(--t-body)',
                  }}
                >
                  WhatsApp Studio ↗
                </a>
                <a
                  href={eco.academy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: '1px solid var(--hair)',
                    color: 'var(--t-body)',
                  }}
                >
                  KR8 Academy ↗
                </a>
              </div>
            )}
          </div>

          {/* Column 2: Commercial Services */}
          <div className="foot-col">
            <h4>Services</h4>
            {services.map((s: any) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                {s.short || s.nav || s.name}
              </Link>
            ))}
          </div>

          {/* Column 3: Ecosystem Programs & Network */}
          <div className="foot-col">
            <h4>Programs &amp; Network</h4>
            <a href={eco.academy.url} target="_blank" rel="noopener noreferrer">
              {eco.academy.name} <span className="out">↗</span>
            </a>
            <Link href="/programs#free-training">Free Digital Training</Link>
            <Link href="/tribe">KR8 DIGITALS TRIBE</Link>
            <Link href="/programs/mindset-shift/invite">Mindset Shift</Link>
            <Link href="/partners">Partner / Sponsor</Link>
            <Link href="/referrals">Referral Network</Link>
            <a href={eco.academy.verifyUrl} target="_blank" rel="noopener noreferrer">
              Verify Certificate <span className="out">↗</span>
            </a>
          </div>

          {/* Column 4: Company & Leadership */}
          <div className="foot-col">
            <h4>Company &amp; Founders</h4>
            <Link href="/about">About KR8 DIGITALS</Link>
            {teamBundle.founders.map((f: any) => (
              <Link key={f.slug} href={f.readAbout || `/about/${f.slug}`}>
                {f.name}
              </Link>
            ))}
            <Link href="/about/join-the-team">Join the Team</Link>
            <Link href={navCfg.ctaHref || '/contact'}>{navCfg.ctaLabel || 'Work With Us'}</Link>
          </div>
        </div>

        <div className="foot-bottom" style={{ paddingBottom: 36 }}>
          <span>
            © {year} {site.company.legalName}.{' '}
            {navCfg.tagline || 'Whoever you are, whatever you do, we exist because of you.'}
          </span>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Engagement</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true as const };
  switch (name) {
    case 'instagram':
      return (
        <svg {...p}>
          <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.9.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.1-.2 1.8-.4 2.2-.2.5-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.1.2-1.8.4-2.2.2-.5.5-1 .9-1.4.4-.4.9-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.1a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zm0 7.75a3.05 3.05 0 110-6.1 3.05 3.05 0 010 6.1zm6-7.94a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
        </svg>
      );
    case 'x':
      return (
        <svg {...p}>
          <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.6L18.9 2zm-1.1 18h1.8L7.3 3.9H5.4L17.8 20z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...p}>
          <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.8c.2.9.9 1.6 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...p}>
          <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.06c.53-.95 1.83-1.95 3.76-1.95C20.9 8.75 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21H9z" />
        </svg>
      );
    default:
      return null;
  }
}
