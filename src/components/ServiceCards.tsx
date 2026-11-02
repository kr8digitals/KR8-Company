import Link from 'next/link';
import services from '../../data/services.json';
import { Icon } from './ui';

const SAMPLE: Record<string, { img?: string; alt?: string; label: string }> = {
  'website-design': { img: '/img/sites/cirenes-card.webp', alt: 'Cirenes Hotels — a live site built by KR8 Digitals', label: 'Live site · Cirenes Hotels' },
  'brand-graphic-design': { img: '/img/brand/zoey-perfume-card.webp', alt: 'Zoey Perfume flyer — KR8 Digitals in association with Motion Verse', label: 'Client flyer · Zoey Perfume' },
  'video-editing': { img: '/video/story-elizabeth-poster.webp', alt: 'Poster frame from a student story film edited by KR8 Digitals', label: 'Real cut · student story' },
  'ai-automation': { img: '/img/sites/jev-card.webp', alt: 'The Jev form router — a working AI routing demo', label: 'Working demo · form router' },
  seo: { label: 'Process · audit to report' },
};

export default function ServiceCards() {
  return (
    <div className="svc-grid">
      {services.map((s, i) => {
        const sample = SAMPLE[s.slug];
        return (
          <Link key={s.slug} href={`/services/${s.slug}`} className={`svc-card reveal up ${i === 0 ? 'svc-card--wide' : ''}`} data-delay={i * 60}>
            <div className="svc-card__media">
              {sample?.img ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sample.img} alt={sample.alt} loading="lazy" decoding="async" />
                  <span className="svc-card__label">{sample.label}</span>
                </>
              ) : (
                <div className="svc-card__diagram" aria-hidden>
                  {['Audit', 'Fix', 'Structure', 'Report'].map((t, k) => (
                    <span key={t} style={{ ['--i' as string]: k }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="svc-card__body">
              <div className="svc-card__icon"><Icon name={s.icon} size={18} /></div>
              <h3>{s.name}</h3>
              <p>{s.tagline}</p>
              <span className="svc-card__go">See the work <Icon name="arrow" size={14} /></span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
