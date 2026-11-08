import { store, newId, type Collection } from './store';
import siteSeed from '../../data/site.json';
import servicesSeed from '../../data/services.json';
import programmesSeed from '../../data/programmes.json';
import teamSeed from '../../data/team.json';
import partnersSeed from '../../data/partners.json';
import sitesSeed from '../../data/sites.json';

export type PublishState = 'published' | 'draft' | 'archived';

export type CmsPageSection = {
  id: string;
  type: 'text' | 'cards' | 'split' | 'cta' | 'faq';
  eyebrow?: string;
  title: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: { title: string; body: string; tag?: string }[];
};

export type CmsPage = {
  id: string;
  slug: string; // e.g. 'about', 'services', or custom 'impact-report'
  title: string;
  isSystem: boolean;
  status: PublishState;
  eyebrow: string;
  heroTitle: string;
  heroHighlight?: string;
  heroLede: string;
  heroImage?: string;
  heroImageAlt?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  sections: CmsPageSection[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  noindex?: boolean;
  updatedAt?: string;
  createdAt?: string;
};

export type CmsNavConfig = {
  id: string;
  headerLinks: { id: string; label: string; href: string; visible: boolean; order: number }[];
  ctaLabel: string;
  ctaHref: string;
  companyEmail: string;
  companyPhone: string;
  companyWhatsapp: string;
  tagline: string;
  shortDescription: string;
  socials: { label: string; href: string; icon: string }[];
};

export type CmsSeoEntry = {
  id: string;
  route: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonical: string;
  noindex: boolean;
  updatedAt?: string;
};

export type CmsMediaItem = {
  id: string;
  title: string;
  url: string;
  category: 'team' | 'services' | 'programs' | 'partners' | 'portfolio' | 'uploads';
  mimeType: string;
  alt: string;
  status: 'active' | 'archived';
  dataBase64?: string;
  createdAt?: string;
  updatedAt?: string;
};

const SYSTEM_PAGES_SEED: Omit<CmsPage, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'About KR8 DIGITALS',
    isSystem: true,
    status: 'published',
    eyebrow: 'About KR8 DIGITALS',
    heroTitle: 'We are writing a story,',
    heroHighlight: 'and you can be a big part of it.',
    heroLede:
      'KR8 DIGITALS is a home for builders, dreamers, and organisations shaping what comes next. Whether you come to solve an important business challenge, master a digital craft for free, collaborate inside our creative community, or partner for lasting impact — there is a meaningful place for you in what we are building together.',
    heroImage: '/img/about/kr8-ecosystem-studio.webp',
    heroImageAlt: 'Engineers, brand designers, and video editors collaborating inside the KR8 DIGITALS studio ecosystem',
    primaryCtaLabel: 'Work With Us',
    primaryCtaHref: '/contact',
    secondaryCtaLabel: 'Explore Services',
    secondaryCtaHref: '/services',
    sections: [],
    metaTitle: 'About KR8 DIGITALS — Our Story, Founders, Mission & Ecosystem',
    metaDescription:
      'We are writing a story, and you can be a big part of it. Discover how KR8 DIGITALS brings distinct minds and capabilities together as problem solvers across commercial craft and tuition-free training.',
    ogImage: '/img/about/kr8-ecosystem-studio.webp',
    noindex: false,
  },
  {
    id: 'page-services',
    slug: 'services',
    title: 'Commercial Services',
    isSystem: true,
    status: 'published',
    eyebrow: 'Six Commercial Disciplines · One Standard',
    heroTitle: 'Every digital layer that makes your organisation',
    heroHighlight: 'found, trusted, and chosen.',
    heroLede:
      'KR8 DIGITALS brings engineering, brand strategy, graphic design, film editing, search visibility, and applied AI under one accountable roof. Explore our six commercial services below — each backed by real, inspectable client deliverables.',
    heroImage: '/img/sites/afristem-full.webp',
    heroImageAlt: 'Live commercial digital platform engineered by KR8 DIGITALS',
    primaryCtaLabel: 'Request a Written Scope',
    primaryCtaHref: '/contact',
    secondaryCtaLabel: 'Compare All 6 Services',
    secondaryCtaHref: '#service-matrix',
    sections: [],
    metaTitle: 'Services — Websites, Branding, Graphic Design, Video Editing, SEO & AI | KR8 DIGITALS',
    metaDescription:
      'Explore all six commercial disciplines at KR8 DIGITALS: Website Design & Development, Branding, Graphic Design, Video Editing, SEO Optimization, and AI Agent & Automation.',
    ogImage: '/img/services/brand-identity.webp',
    noindex: false,
  },
  {
    id: 'page-programs',
    slug: 'programs',
    title: 'Ecosystem Programs',
    isSystem: true,
    status: 'published',
    eyebrow: programmesSeed.intro.eyebrow,
    heroTitle: 'Human capacity built alongside',
    heroHighlight: 'commercial craft.',
    heroLede: programmesSeed.intro.lede,
    heroImage: programmesSeed.intro.image,
    heroImageAlt: programmesSeed.intro.imageAlt,
    primaryCtaLabel: 'Explore KR8 Academy',
    primaryCtaHref: 'https://academy.kr8digitals.com',
    secondaryCtaLabel: 'Compare All 4 Programs',
    secondaryCtaHref: '#program-lineup',
    sections: [],
    metaTitle: 'Programs — Free Digital Training, KR8 DIGITALS TRIBE, Mindset Shift & Studio Pathway',
    metaDescription:
      'Explore KR8 DIGITALS ecosystem programs: 100% tuition-free digital skills and academic training, KR8 DIGITALS TRIBE community, Mindset Shift leadership forum, and Join the Team.',
    ogImage: '/img/programs/free-training-academy.webp',
    noindex: false,
  },
  {
    id: 'page-partners',
    slug: 'partners',
    title: 'Partnerships & Alliances',
    isSystem: true,
    status: 'published',
    eyebrow: 'Strategic Alliances · KR8 DIGITALS',
    heroTitle: 'Why partner with',
    heroHighlight: 'KR8 DIGITALS?',
    heroLede:
      'Ambitious outcomes move faster when complementary strengths share one roof. Whether you lead a specialist creative studio, an academic institution, a corporate impact initiative, or a growing company — partnering with KR8 DIGITALS connects your mission to full-stack digital execution and an active talent ecosystem.',
    heroImage: '/img/partners/partnership-collaboration.webp',
    heroImageAlt: 'Strategic partnership alignment session with KR8 DIGITALS leadership',
    primaryCtaLabel: 'Propose a Partnership',
    primaryCtaHref: '#propose',
    secondaryCtaLabel: 'Meet Active Partners',
    secondaryCtaHref: '#existing-partners',
    sections: [],
    metaTitle: 'Partner With KR8 DIGITALS — Strategic Alliances, Studio & Academic Partnerships',
    metaDescription:
      'Why partner with KR8 DIGITALS? Discover mutual benefits, collaboration tracks, existing partners (Motionverse, Chigoma, Next Gen Scholars), and submit a partnership proposal.',
    ogImage: '/img/partners/partnership-collaboration.webp',
    noindex: false,
  },
];

const MEDIA_SEED: Omit<CmsMediaItem, 'createdAt' | 'updatedAt'>[] = [
  { id: 'med-timfire', title: 'Timfire — Founder Portrait', url: '/img/team/founder-timfire.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Timfire (Kenneth Timothy Iziogo), Founder and Chief Executive of KR8 DIGITALS', status: 'active' },
  { id: 'med-timfire-wide', title: 'Timfire — Studio Working Session', url: '/img/team/founder-timfire-wide.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Timfire in a technical working session at KR8 DIGITALS', status: 'active' },
  { id: 'med-steveoking', title: 'Steveoking (Stevenson) — Co-Founder Portrait', url: '/img/team/stevenson.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Steveoking (Stevenson), Co-Founder of KR8 DIGITALS and Founder of Motionverse', status: 'active' },
  { id: 'med-creative-exp', title: 'Creative Expression — Co-Founder Portrait', url: '/img/team/daniel.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Creative Expression (Daniel Akachukwu Augustine), Co-Founder of KR8 DIGITALS and Founder of Chigoma', status: 'active' },
  { id: 'med-nicodemus', title: 'Odobe Nicodemus C — Financial Strategist', url: '/img/team/nicodemus.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Odobe Nicodemus C — Financial Strategist at KR8 DIGITALS', status: 'active' },
  { id: 'med-mercy', title: 'Chimnonyerem Mercy — Project Director', url: '/img/team/nonye.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Chimnonyerem Mercy — Project Director at KR8 DIGITALS', status: 'active' },
  { id: 'med-favour', title: 'Nwefuru Favour Chizurum — General Manager', url: '/img/team/favour.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Nwefuru Favour Chizurum — General Manager at KR8 DIGITALS', status: 'active' },
  { id: 'med-covenant', title: 'Covenant Afinidi — Accountability Lead', url: '/img/team/covenant.jpg', category: 'team', mimeType: 'image/jpeg', alt: 'Covenant Afinidi — Accountability Lead at KR8 DIGITALS', status: 'active' },
  { id: 'med-about-studio', title: 'KR8 Ecosystem Studio Architecture', url: '/img/about/kr8-ecosystem-studio.webp', category: 'services', mimeType: 'image/webp', alt: 'KR8 DIGITALS multi-disciplinary creative technology studio', status: 'active' },
  { id: 'med-svc-brand', title: 'Brand Identity & Guidelines System', url: '/img/services/brand-identity.webp', category: 'services', mimeType: 'image/webp', alt: 'Brand identity guidelines crafted by KR8 DIGITALS with Motionverse', status: 'active' },
  { id: 'med-svc-graphic', title: 'Commercial Graphic Design Showcase', url: '/img/services/graphic-design-showcase.webp', category: 'services', mimeType: 'image/webp', alt: 'Commercial campaign flyers designed with Motionverse', status: 'active' },
  { id: 'med-svc-video', title: 'Video Editing & Post-Production Suite', url: '/img/services/video-editing-suite.webp', category: 'services', mimeType: 'image/webp', alt: 'Video editing suite directed with Chigoma', status: 'active' },
  { id: 'med-svc-seo', title: 'SEO Optimization & Search Architecture', url: '/img/services/seo-optimization.webp', category: 'services', mimeType: 'image/webp', alt: 'Technical SEO and organic search visibility system', status: 'active' },
  { id: 'med-svc-ai', title: 'AI Agent & Workflow Automation', url: '/img/services/ai-automation.webp', category: 'services', mimeType: 'image/webp', alt: 'Custom AI assistant and operational workflow architecture', status: 'active' },
  { id: 'med-prog-academy', title: 'Free Digital Skills Training Cohort', url: '/img/programs/free-training-academy.webp', category: 'programs', mimeType: 'image/webp', alt: 'Learners collaborating inside KR8 Academy free digital training', status: 'active' },
  { id: 'med-prog-tribe', title: 'KR8 DIGITALS TRIBE Community', url: '/img/programs/tribe-community.webp', category: 'programs', mimeType: 'image/webp', alt: 'KR8 DIGITALS TRIBE peer critique and creative meetup', status: 'active' },
  { id: 'med-prog-mindset', title: 'Mindset Shift Leadership Forum', url: '/img/programs/mindset-shift-forum.webp', category: 'programs', mimeType: 'image/webp', alt: 'Mindset Shift forum hosted by KR8 DIGITALS', status: 'active' },
  { id: 'med-prog-jointeam', title: 'Join the Team Studio Portfolio Review', url: '/img/programs/join-team-studio.webp', category: 'programs', mimeType: 'image/webp', alt: 'Engineers, designers, and editors reviewing portfolios inside KR8 DIGITALS', status: 'active' },
  { id: 'med-svc-webeng', title: 'Website Engineering & Responsive Studio', url: '/img/services/website-engineering.webp', category: 'services', mimeType: 'image/webp', alt: 'Full-stack developers testing responsive web builds at KR8 DIGITALS', status: 'active' },
  { id: 'med-svc-motionverse', title: 'Motionverse × KR8 Design Studio', url: '/img/services/motionverse-studio.webp', category: 'services', mimeType: 'image/webp', alt: 'Motionverse × KR8 DIGITALS campaign art direction studio', status: 'active' },
  { id: 'med-about-roundtable', title: 'Our Story Multidisciplinary Roundtable', url: '/img/about/our-story-roundtable.webp', category: 'services', mimeType: 'image/webp', alt: 'Engineers, designers, and filmmakers collaborating at KR8 DIGITALS', status: 'active' },
  { id: 'med-partners-collab', title: 'Strategic Partnership Boardroom', url: '/img/partners/partnership-collaboration.webp', category: 'partners', mimeType: 'image/webp', alt: 'Strategic partnership alignment with KR8 DIGITALS leadership', status: 'active' },
  { id: 'med-ref-lounge', title: 'Referral Network Introduction', url: '/img/referrals/referral-lounge-share.webp', category: 'partners', mimeType: 'image/webp', alt: 'Sharing a referral link in the KR8 DIGITALS Referral Network', status: 'active' },
  { id: 'med-contact-scope', title: 'Client Project Scoping Session', url: '/img/contact/scoping-session.webp', category: 'services', mimeType: 'image/webp', alt: 'KR8 DIGITALS leads scoping a client project', status: 'active' },
  ...sitesSeed.sites.slice(0, 6).map((s) => ({
    id: `med-site-${s.slug}`,
    title: `Web Build · ${s.name}`,
    url: s.card,
    category: 'portfolio' as const,
    mimeType: 'image/webp',
    alt: `${s.name} live web platform built by KR8 DIGITALS`,
    status: 'active' as const,
  })),
];

const SEO_SEED: Omit<CmsSeoEntry, 'updatedAt'>[] = [
  {
    id: 'seo-home',
    route: '/',
    metaTitle: 'KR8 Digitals — Whoever you are, whatever you do, we exist because of you.',
    metaDescription: siteSeed.company.positioning,
    ogImage: '/opengraph-image',
    canonical: '/',
    noindex: false,
  },
  {
    id: 'seo-about',
    route: '/about',
    metaTitle: 'About KR8 DIGITALS — Our Story, Founders, Mission & Ecosystem',
    metaDescription: 'Discover KR8 DIGITALS: our story, mission, vision, founders Timfire, Steveoking, and Creative Expression, and our tuition-free training ecosystem.',
    ogImage: '/img/about/kr8-ecosystem-studio.webp',
    canonical: '/about',
    noindex: false,
  },
  {
    id: 'seo-services',
    route: '/services',
    metaTitle: 'Services — Websites, Branding, Graphic Design, Video Editing, SEO & AI | KR8 DIGITALS',
    metaDescription: 'Explore all six commercial disciplines at KR8 DIGITALS backed by live client work.',
    ogImage: '/img/services/brand-identity.webp',
    canonical: '/services',
    noindex: false,
  },
  {
    id: 'seo-programs',
    route: '/programs',
    metaTitle: 'Programs — Free Digital Training, KR8 DIGITALS TRIBE, Mindset Shift & Studio Pathway',
    metaDescription: 'Explore KR8 DIGITALS ecosystem initiatives: 100% tuition-free training, KR8 Tribe, Mindset Shift, and Join the Team.',
    ogImage: '/img/programs/free-training-academy.webp',
    canonical: '/programs',
    noindex: false,
  },
  {
    id: 'seo-partners',
    route: '/partners',
    metaTitle: 'Partner With KR8 DIGITALS — Strategic Alliances, Studio & Academic Partnerships',
    metaDescription: 'Why partner with KR8 DIGITALS? Explore mutual benefits, active partners, and submit a partnership proposal.',
    ogImage: '/img/partners/partnership-collaboration.webp',
    canonical: '/partners',
    noindex: false,
  },
];

async function ensureSeeded<T extends Record<string, any>>(c: Collection, seedFn: () => T[]): Promise<any[]> {
  const existing = await store.all(c, 1000);
  if (existing.length > 0) return existing;
  const seeded = await store.replaceAll(c, seedFn());
  return seeded;
}

export async function logRevision(params: {
  entityType: string;
  entityId: string;
  entityLabel: string;
  action: string;
  snapshot: any;
}) {
  await store.insert('cms_revisions', {
    id: newId('rev_'),
    entityType: params.entityType,
    entityId: params.entityId,
    entityLabel: params.entityLabel,
    action: params.action,
    snapshot: params.snapshot,
  });
}

/* =========================================================================
   1. PAGES (System Overrides + Custom Admin-Created Pages)
   ========================================================================= */
export async function getCmsPages(opts?: { includeDrafts?: boolean }): Promise<CmsPage[]> {
  const rows = (await ensureSeeded('cms_pages', () => SYSTEM_PAGES_SEED)) as CmsPage[];
  const sorted = [...rows].sort((a, b) => (a.isSystem === b.isSystem ? a.title.localeCompare(b.title) : a.isSystem ? -1 : 1));
  if (opts?.includeDrafts) return sorted;
  return sorted.filter((p) => p.status === 'published');
}

export async function getCmsPageBySlug(slug: string, opts?: { preview?: boolean }): Promise<CmsPage | null> {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  const pages = await getCmsPages({ includeDrafts: true });
  const match = pages.find((p) => p.slug.replace(/^\/+|\/+$/g, '') === clean);
  if (!match) return null;
  if (match.status === 'published') return match;
  if (opts?.preview && match.status === 'draft') return match;
  return null;
}

export type CmsService = (typeof servicesSeed)[number] & {
  id: string;
  order: number;
  status: PublishState;
};

export type CmsProgram = (typeof programmesSeed.programmes)[number] & {
  id: string;
  order: number;
  visibility: string;
};

export type CmsPartner = (typeof partnersSeed)[number] & {
  id: string;
  order: number;
  status: PublishState;
};

/* =========================================================================
   2. SERVICES
   ========================================================================= */
export async function getCmsServices(opts?: { includeDrafts?: boolean }): Promise<CmsService[]> {
  const rows = await ensureSeeded('cms_services', () =>
    servicesSeed.map((s, idx) => ({
      id: `svc-${s.slug}`,
      ...s,
      order: s.order ?? idx + 1,
      status: (s.status as PublishState) || 'published',
    }))
  );
  const sorted = [...rows].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  if (opts?.includeDrafts) return sorted as CmsService[];
  return sorted.filter((s) => s.status === 'published') as CmsService[];
}

/* =========================================================================
   3. PROGRAMS
   ========================================================================= */
export async function getCmsPrograms(opts?: { includeDrafts?: boolean }): Promise<CmsProgram[]> {
  const rows = await ensureSeeded('cms_programs', () =>
    programmesSeed.programmes.map((p, idx) => ({
      id: `prog-${p.slug}`,
      ...p,
      order: idx + 1,
      visibility: 'active',
    }))
  );
  const sorted = [...rows].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  if (opts?.includeDrafts) return sorted as CmsProgram[];
  return sorted.filter((p) => p.visibility !== 'archived') as CmsProgram[];
}

/* =========================================================================
   4. TEAM & FOUNDER PROFILES (Preserves exact name spellings!)
   ========================================================================= */
export async function getCmsTeam(opts?: { includeDrafts?: boolean }) {
  const rows = await ensureSeeded('cms_team', () => [
    ...teamSeed.founders.map((f, idx) => ({
      id: `founder-${f.slug}`,
      group: 'founder',
      order: idx + 1,
      status: 'published' as PublishState,
      ...f,
    })),
    ...teamSeed.team.map((m, idx) => ({
      id: `team-${m.slug || idx + 1}`,
      group: 'team',
      order: idx + 10,
      status: 'published' as PublishState,
      fullName: m.name,
      headlineRole: m.role,
      linkText: '',
      readAbout: '/about#team',
      photoWide: m.photo,
      links: [],
      quote: '',
      ...m,
    })),
  ]);
  const sorted = [...rows].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  const filtered = opts?.includeDrafts ? sorted : sorted.filter((m) => (m.status || 'published') === 'published');
  return {
    all: filtered as any[],
    founders: filtered.filter((m) => m.group === 'founder') as (typeof teamSeed.founders)[number][],
    team: filtered.filter((m) => m.group !== 'founder') as (typeof teamSeed.team)[number][],
  };
}

/* =========================================================================
   5. PARTNERS & PARTNERSHIP PROPOSALS
   ========================================================================= */
export async function getCmsPartners(opts?: { includeDrafts?: boolean }): Promise<CmsPartner[]> {
  const rows = await ensureSeeded('cms_partners', () =>
    partnersSeed.map((p, idx) => ({
      id: `partner-${p.slug}`,
      ...p,
      order: p.order ?? idx + 1,
      status: 'published' as PublishState,
    }))
  );
  const sorted = [...rows].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  if (opts?.includeDrafts) return sorted;
  return sorted.filter((p) => (p.status || 'published') === 'published');
}

export async function getPartnerProposals() {
  return store.all('partner_proposals', 500);
}

/* =========================================================================
   6. MEDIA LIBRARY
   ========================================================================= */
export async function getCmsMedia(opts?: { includeArchived?: boolean }): Promise<CmsMediaItem[]> {
  const rows = (await ensureSeeded('cms_media', () => MEDIA_SEED)) as CmsMediaItem[];
  if (opts?.includeArchived) return rows;
  return rows.filter((m) => m.status !== 'archived');
}

/* =========================================================================
   7. NAVIGATION & GLOBAL BRAND LINKS
   ========================================================================= */
export async function getCmsNavigation(): Promise<CmsNavConfig> {
  const rows = await ensureSeeded('cms_navigation', () => [
    {
      id: 'global-nav',
      headerLinks: siteSeed.nav.map((n, i) => ({
        id: `nav-${i + 1}`,
        label: n.label,
        href: n.href,
        visible: true,
        order: i + 1,
      })),
      ctaLabel: 'Work with us',
      ctaHref: '/contact',
      companyEmail: siteSeed.company.email,
      companyPhone: siteSeed.company.phone,
      companyWhatsapp: siteSeed.company.whatsapp,
      tagline: siteSeed.company.tagline,
      shortDescription: siteSeed.company.shortDescription,
      socials: siteSeed.company.socials,
    },
  ]);
  return rows[0] as CmsNavConfig;
}

/* =========================================================================
   8. SEO & OPENGRAPH METADATA
   ========================================================================= */
export async function getCmsSeoAll(): Promise<CmsSeoEntry[]> {
  return (await ensureSeeded('cms_seo', () => SEO_SEED)) as CmsSeoEntry[];
}

export async function getCmsSeoForRoute(route: string): Promise<CmsSeoEntry | null> {
  const all = await getCmsSeoAll();
  return all.find((x) => x.route === route) || null;
}

/* =========================================================================
   9. REVISION HISTORY & RESTORE
   ========================================================================= */
export async function getCmsRevisions(limit = 80) {
  return store.all('cms_revisions', limit);
}

const ENTITY_COLLECTION: Record<string, Collection> = {
  page: 'cms_pages',
  service: 'cms_services',
  program: 'cms_programs',
  team: 'cms_team',
  partner: 'cms_partners',
  navigation: 'cms_navigation',
  seo: 'cms_seo',
};

export async function restoreCmsRevision(revisionId: string) {
  const rev = await store.findOne('cms_revisions', { id: revisionId });
  if (!rev || !rev.snapshot) throw new Error('Revision snapshot not found');
  const col = ENTITY_COLLECTION[rev.entityType];
  if (!col) throw new Error(`Unsupported entity type: ${rev.entityType}`);
  const existing = await store.findOne(col, { id: rev.entityId });
  if (existing) {
    const updated = await store.update(col, rev.entityId, rev.snapshot);
    await logRevision({
      entityType: rev.entityType,
      entityId: rev.entityId,
      entityLabel: rev.entityLabel,
      action: 'restored',
      snapshot: updated,
    });
    return updated;
  } else {
    const inserted = await store.insert(col, { ...rev.snapshot, id: rev.entityId });
    await logRevision({
      entityType: rev.entityType,
      entityId: rev.entityId,
      entityLabel: rev.entityLabel,
      action: 'restored',
      snapshot: inserted,
    });
    return inserted;
  }
}
