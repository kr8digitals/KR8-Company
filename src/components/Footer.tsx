import Link from 'next/link';
import site from '../../data/site.json';
import services from '../../data/services.json';

const eco = site.ecosystem;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-map">
          <div className="foot-brand">
            <Link href="/" className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo__mark" src="/img/brand/kr8-mark-256.webp" alt="" width={38} height={38} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo__mark" src={site.company.mark} alt="" width={40} height={40} />
              <span className="logo__type">KR8<span className="g" style={{ marginLeft: 7 }}>Digitals</span></span>
              <span className="sr-only"> — home</span>
            </Link>
            <p>
              A creative company building websites, brands, films, AI systems and SEO optimisation — and
              training the people who build them next. Work with us, learn with us, or partner with us.
            </p>
            <div className="foot-parent" style={{ marginTop: 16 }}>
              <b>KR8 Digitals</b> · {site.company.email}<br /><span className="foot-tagline">{site.company.tagline}</span>
            </div>
            <div className="foot-socials">
              {site.company.socials.filter((s) => s.href).map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <SocialIcon name={s.icon} />
                </a>
              ))}
              {site.company.socials.filter((s) => s.href).length === 0 && (
                <span style={{ fontSize: 12, color: 'var(--t-faint)', letterSpacing: '.02em' }}>
                  Social links to be added
                </span>
              )}
            </div>
          </div>

          <div className="foot-col">
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/about#team">Team</Link>
            <Link href="/about/join-the-team">Join the team</Link>
            <Link href="/services">Services</Link>
            <Link href="/partners">Partners</Link>
            <Link href="/referrals">Referrals</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="foot-col">
            <h4>Services</h4>
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>{s.short}</Link>
            ))}
          </div>

          <div className="foot-col">
            <h4>KR8 network</h4>
            <a href={eco.academy.url} target="_blank" rel="noopener noreferrer">
              KR8 Academy <span className="out">↗</span>
            </a>
            <a href={eco.tribe.status === 'live' ? eco.tribe.url : '/tribe'}
               target={eco.tribe.status === 'live' ? '_blank' : undefined}
               rel={eco.tribe.status === 'live' ? 'noopener noreferrer' : undefined}>
              The Tribe <span className="out">{eco.tribe.status === 'live' ? '↗' : ''}</span>
            </a>
            <Link href="/programs#mindset-shift">Mindset Shift</Link>
            <a href={eco.academy.verifyUrl} target="_blank" rel="noopener noreferrer">
              Verify a certificate <span className="out">↗</span>
            </a>
            <a href={`https://wa.me/${site.company.whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp <span className="out">↗</span>
            </a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {year} KR8 Digitals. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
            <a href={`mailto:${site.company.email}`}>{site.company.email}</a>
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
      return <svg {...p}><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.9.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.1-.2 1.8-.4 2.2-.2.5-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.1.2-1.8.4-2.2.2-.5.5-1 .9-1.4.4-.4.9-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.1a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zm0 7.75a3.05 3.05 0 110-6.1 3.05 3.05 0 010 6.1zm6-7.94a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" /></svg>;
    case 'x':
      return <svg {...p}><path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.6L18.9 2zm-1.1 18h1.8L7.3 3.9H5.4L17.8 20z" /></svg>;
    case 'youtube':
      return <svg {...p}><path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12 2 12s0 3 .4 4.8c.2.9.9 1.6 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" /></svg>;
    case 'linkedin':
      return <svg {...p}><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.06c.53-.95 1.83-1.95 3.76-1.95C20.9 8.75 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21H9z" /></svg>;
    default:
      return null;
  }
}
