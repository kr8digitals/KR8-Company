import { getEditableDocument } from '@/lib/editable-content';
import Link from 'next/link';
import { Icon } from './ui';

type HomeServiceCard = {
  slug: string;
  title: string;
  description: string;
  mobileDescription: string;
  href: string;
  cta: string;
  icon: string;
  label: string;
  img: string;
  alt: string;
  video?: string;
};

const HOME_SERVICES: HomeServiceCard[] = [
  {
    slug: 'website-design',
    title: 'Website Design & Development',
    description:
      'High-speed custom websites, portals, and booking platforms engineered to command instant trust on mobile and turn visitors into paying clients.',
    mobileDescription:
      'Fast custom websites, portals, and 18 ready-built sites engineered to convert mobile visitors into clients.',
    href: '/services#websites',
    cta: 'Explore website builds',
    icon: 'monitor',
    label: 'Live build · AfriSTEM Global',
    img: '/img/sites/afristem-full.webp',
    alt: 'AfriSTEM Global — responsive client website designed and deployed by KR8 Digitals',
  },
  {
    slug: 'branding',
    title: 'Branding',
    description:
      'Category positioning, distinctive logo architecture, typography, colour psychology, and complete visual identity guidelines so clients choose you on authority, not price.',
    mobileDescription:
      'Logo systems, brand positioning, and visual guidelines so buyers choose you on authority — not price.',
    href: '/services/branding',
    cta: 'Explore brand strategy',
    icon: 'layers',
    label: 'Identity systems · Brand strategy',
    img: '/img/services/brand-identity.webp',
    alt: 'KR8 Digitals brand identity guidelines book, colour swatches, and luxury collateral in warm studio daylight',
  },
  {
    slug: 'graphic-design',
    title: 'Graphic Design',
    description:
      'Scroll-stopping campaign flyers, product and retail promotions, event key visuals, and social creative suites crafted in association with Motionverse.',
    mobileDescription:
      'Scroll-stopping campaign flyers, product launches, and social visual suites crafted with Motionverse.',
    href: '/services#graphic-design',
    cta: 'See graphic design work',
    icon: 'palette',
    label: 'Client campaigns · Motionverse × KR8',
    img: '/img/services/motionverse-studio.webp',
    alt: 'Art director crafting vibrant campaign posters and commercial graphics inside Motionverse × KR8 Digitals studio',
  },
  {
    slug: 'video-editing',
    title: 'Video Editing',
    description:
      'High-retention short-form reels, commercial cuts, motion graphics, colour grading, and sound-designed stories built for how audiences actually watch.',
    mobileDescription:
      'Retention-cut reels, commercial edits, colour grading, and motion stories crafted with Chigoma.',
    href: '/services#video',
    cta: 'Watch video edits',
    icon: 'film',
    label: 'Chigoma × KR8 · Post-Production',
    img: '/img/services/video-editing-suite.webp',
    alt: 'Film director colour-grading documentary and commercial footage in a sunlit KR8 × Chigoma editing studio',
  },
  {
    slug: 'seo',
    title: 'SEO Optimization',
    description:
      'Technical site architecture, structured schema data, local search visibility, and intent-driven content systems that put your organisation first when buyers search.',
    mobileDescription:
      'Technical SEO, schema structure, and local search authority so buyers find you first on Google.',
    href: '/services#seo',
    cta: 'See our SEO approach',
    icon: 'search',
    label: 'Search authority · Organic growth',
    img: '/img/services/seo-optimization.webp',
    alt: 'Digital strategists reviewing organic search growth and ranking analytics in a bright strategy studio',
  },
  {
    slug: 'ai-automation',
    title: 'AI Agent & Automation',
    description:
      'Custom 24/7 AI customer agents, smart enquiry routing, automated booking pipelines, and real-time CRM workflows that remove repetitive work from your team.',
    mobileDescription:
      '24/7 AI customer agents, instant enquiry routing, and automated booking & CRM workflows.',
    href: '/services#ai',
    cta: 'Explore AI systems',
    icon: 'cpu',
    label: 'Autonomous agents · 24/7 workflows',
    img: '/img/services/ai-automation.webp',
    alt: 'Software engineers collaborating over a custom AI agent and workflow automation system at KR8 Digitals',
  },
];

export default async function ServiceCards() {
  const editableContent = await getEditableDocument("components:ServiceCards");
  const HOME_SERVICES = editableContent.blocks.HOME_SERVICES as EditableBlockTypes["HOME_SERVICES"];

  return (
    <div className="svc-grid">
      {HOME_SERVICES.map((s, i) => (
        <Link key={s.slug} href={s.href} className="svc-card reveal up" data-delay={i * 60}>
          <div className="svc-card__media">
            {s.video ? (
              <video
                src={s.video}
                poster={s.img}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={s.alt}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={s.img} alt={s.alt} loading="lazy" decoding="async" />
            )}
            <span className="svc-card__label">{s.label}</span>
          </div>
          <div className="svc-card__body">
            <div className="svc-card__icon">
              <Icon name={s.icon} size={18} />
            </div>
            <h3>{s.title}</h3>
            <p className="kr8-desk-only">{s.description}</p>
            <p className="kr8-mob-only">{s.mobileDescription}</p>
            <span className="svc-card__go">
              {s.cta} <Icon name="arrow" size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

type EditableBlockTypes = { HOME_SERVICES: typeof HOME_SERVICES };
