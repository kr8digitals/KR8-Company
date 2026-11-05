import Link from 'next/link';
import services from '../../data/services.json';
import { Icon } from './ui';

/**
 * The five groups, one real sample each.
 * Every card opens the matching group on the services page — never a dead end
 * and never a second copy of the same gallery.
 */
const SAMPLE: Record<string, { img?: string; alt?: string; label: string; fit?: 'cover' | 'contain' }> = {
  'website-design': {
    img: '/img/sites/cirenes-card.webp',
    alt: 'Cirenes Hotels — a live site built and deployed by KR8 Digitals',
    label: 'Live site · Cirenes Hotels',
  },
  'brand-graphic-design': {
    img: '/img/brand/zoey-perfume-card.webp',
    alt: 'Zoey Perfume flyer — KR8 Digitals in association with Motionverse',
    label: 'Client flyer · Zoey Perfume',
    fit: 'contain',
  },
  'video-editing': {
    img: '/video/story-elizabeth-poster.webp',
    alt: 'Poster frame from a real client film edited by KR8 Digitals',
    label: 'Real cut · client story',
    fit: 'contain',
  },
  seo: {
    img: '/img/sites/afristem-school-full.webp',
    alt: 'AFRISTEM Digital Science School — a structured multi-page site',
    label: 'Structure · one page per programme',
  },
  'ai-automation': {
    img: '/img/sites/jev-card.webp',
    alt: 'The Jev form router — a working AI routing build',
    label: 'Working build · form router',
  },
};

export default function ServiceCards() {
  return (
    <div className="svc-grid">
      {services.map((s, i) => {
        const sample = SAMPLE[s.slug];
        return (
          <Link
            key={s.slug}
            href={`/services#${s.anchor || s.slug}`}
            className={`svc-card reveal up ${i === 0 ? 'svc-card--wide' : ''}`}
            data-delay={i * 60}
          >
            <div className="svc-card__media">
              {sample?.img ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.img}
                    alt={sample.alt}
                    loading="lazy"
                    decoding="async"
                    style={sample.fit === 'contain' ? { objectFit: 'contain' } : undefined}
                  />
                  <span className="svc-card__label">{sample.label}</span>
                </>
              ) : null}
            </div>
            <div className="svc-card__body">
              <div className="svc-card__icon"><Icon name={s.icon} size={18} /></div>
              <h3>{s.group || s.name}</h3>
              <p>{s.tagline}</p>
              <span className="svc-card__go">See the {s.group?.toLowerCase() || s.name.toLowerCase()} work <Icon name="arrow" size={14} /></span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
