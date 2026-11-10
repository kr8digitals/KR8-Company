import crypto from 'node:crypto';
import { getPublicContent } from './public-content';
import { getEditableBundle } from './editable-content';
import siteSeed from '../../data/site.json';
import sitesSeed from '../../data/sites.json';
import pricingSeed from '../../data/pricing.json';
import { buildDeepPageAndScenarioKnowledge } from './riya-knowledge-corpus';
import {
  getCmsNavigation,
  getCmsPages,
  getCmsPartners,
  getCmsPrograms,
  getCmsSeoAll,
  getCmsServices,
  getCmsTeam,
} from './cms';
import { store, newId } from './store';

/**
 * RIYA Centralized Knowledge Architecture & Automatic Synchronization Engine
 * --------------------------------------------------------------------------
 * Extracts, structures, versions, and indexes verified knowledge across every
 * public, secondary, hidden, legal, referral, order, and administrative workflow
 * of KR8 DIGITALS — organized across 22 formal categories with zero fabricated facts.
 */

export type RiyaCategory =
  | 'organizational_identity'
  | 'organizational_history'
  | 'mission_and_vision'
  | 'values_and_philosophy'
  | 'leadership_and_team'
  | 'services'
  | 'portfolio_and_proof'
  | 'programs'
  | 'training_opportunities'
  | 'registration_and_onboarding'
  | 'student_information'
  | 'partnership_opportunities'
  | 'referral_opportunities'
  | 'operational_processes'
  | 'policies_and_requirements'
  | 'frequently_asked_questions'
  | 'customer_support'
  | 'complaints_and_suggestions'
  | 'general_organizational_information'
  | 'website_functionality'
  | 'administrative_information'
  | 'career_and_talent_pathway';

export const RIYA_CATEGORY_LABELS: Record<RiyaCategory, string> = {
  organizational_identity: '1. Organizational Identity',
  organizational_history: '2. Organizational History & Story',
  mission_and_vision: '3. Mission, Vision & Purpose',
  values_and_philosophy: '4. Values & Problem-Solving Philosophy',
  leadership_and_team: '5. Founders & Studio Leadership',
  services: '6. Commercial Services',
  portfolio_and_proof: '7. Deployed Portfolio & Proof',
  programs: '8. Ecosystem Programs',
  training_opportunities: '9. Tuition-Free Training & Academic Doors',
  registration_and_onboarding: '10. Registration & Onboarding Processes',
  student_information: '11. Student Support, Certificates & KR8 ID',
  partnership_opportunities: '12. Partnership Opportunities & Alliances',
  referral_opportunities: '13. Referral Network & Commissions',
  operational_processes: '14. Scoping, Delivery & Order Processes',
  policies_and_requirements: '15. Privacy, Terms, IP & Accessibility',
  frequently_asked_questions: '16. Frequently Asked Questions & Clarifications',
  customer_support: '17. Customer Support & Direct Channels',
  complaints_and_suggestions: '18. Complaints, Suggestions & Escalation',
  general_organizational_information: '19. General Organizational Operations',
  website_functionality: '20. Website Pages, Menus, Forms & Actions',
  administrative_information: '21. Public Governance & Verification Standards',
  career_and_talent_pathway: '22. Join the Team & Talent Pathway',
};

export type RiyaLink = { label: string; href: string; outbound?: boolean };

export type RiyaKnowledgeRecord = {
  id: string;
  category: RiyaCategory;
  categoryLabel: string;
  route: string;
  source: string;
  topicKey: string;
  title: string;
  summary: string;
  content: string;
  audience: string;
  purpose: string;
  actions: string[];
  links: RiyaLink[];
  keywords: string[];
  questions: string[];
  verifiedAt: string;
  version: number;
  relevance: number;
  isCustom?: boolean;
};

export type RiyaQaPair = {
  id: string;
  recordId: string;
  category: RiyaCategory;
  route: string;
  topicKey: string;
  question: string;
  answer: string;
  links: RiyaLink[];
  verifiedAt: string;
};

export type RiyaKnowledgeSnapshot = {
  version: number;
  fingerprint: string;
  syncedAt: string;
  records: RiyaKnowledgeRecord[];
  qaPairs: RiyaQaPair[];
  pagesAnalyzed: { route: string; title: string; recordCount: number; qaCount: number }[];
  categoryCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
  invertedIndex: Map<string, Set<number>>;
  trigramIndex: Map<string, Set<number>>;
  docLengths: number[];
  avgDocLength: number;
};

let cachedSnapshot: RiyaKnowledgeSnapshot | null = null;
let currentVersion = 1;

/* =========================================================================
   TEXT NORMALIZATION, SYNONYM GRAPH & INDEXING HELPERS
   ========================================================================= */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'as',
  'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against',
  'during', 'without', 'before', 'under', 'around', 'among', 'and', 'or',
  'but', 'if', 'while', 'because', 'so', 'than', 'too', 'very', 'can',
  'will', 'just', 'should', 'now', 'i', 'me', 'my', 'we', 'our', 'you',
  'your', 'they', 'them', 'their', 'it', 'its', 'this', 'that', 'these',
  'those', 'do', 'does', 'did', 'have', 'has', 'had', 'would', 'could',
  'please', 'tell', 'know', 'want', 'need', 'hi', 'hello', 'hey',
]);

const SPELLING_FIXES: Record<string, string> = {
  tution: 'tuition',
  tuton: 'tuition',
  regstration: 'registration',
  registation: 'registration',
  regster: 'register',
  certficate: 'certificate',
  certifcate: 'certificate',
  referal: 'referral',
  refferal: 'referral',
  commision: 'commission',
  comission: 'commission',
  prise: 'price',
  pricng: 'pricing',
  steeveoking: 'steveoking',
  steveo: 'steveoking',
  timfaya: 'timfire',
  whtsapp: 'whatsapp',
  whatsap: 'whatsapp',
  partnar: 'partner',
  partnrship: 'partnership',
  progams: 'programs',
  progam: 'program',
  programmes: 'programs',
  programme: 'program',
  websit: 'website',
  grapic: 'graphic',
  grafic: 'graphic',
  autmation: 'automation',
  bestseler: 'bestseller',
  bestselers: 'bestsellers',
  sponser: 'sponsor',
  sponsering: 'sponsoring',
  sponsership: 'sponsorship',
  ada: 'riya',
};

export const CONCEPT_SYNONYMS: Record<string, string[]> = {
  bestseller: ['bestsellers', 'popular', 'flagship', 'top', 'selling', 'demanded', 'requested', 'featured', 'favorites', 'readybuilt', 'turnkey'],
  buy: ['purchase', 'forsale', 'readybuilt', 'prebuilt', 'template', 'templates', 'turnkey', 'store', 'shop', 'order', 'ready'],
  sponsor: ['sponsoring', 'sponsorship', 'sponsors', 'donate', 'donation', 'donor', 'csr', 'foundation', 'fund', 'funding', 'stipend', 'scholarship', 'philanthropy', 'back'],
  benefit: ['benefits', 'perks', 'value', 'upside', 'return', 'gain', 'advantage', 'advantages', 'receive', 'reward'],
  free: ['tuition', 'cost', 'fee', 'pay', 'money', 'scholarship', 'charge', 'price', 'freebie', 'afford', 'zero'],
  cost: ['price', 'pricing', 'fee', 'fees', 'charge', 'budget', 'quote', 'rate', 'rates', 'pay', 'payment', 'installment', 'deposit', 'affordable'],
  turnaround: ['timeline', 'duration', 'fast', 'long', 'weeks', 'days', 'deadline', 'urgent', 'delivery', 'speed'],
  refund: ['refunds', 'revision', 'revisions', 'guarantee', 'warranty', 'ownership', 'sourcecode', 'maintenance', 'support'],
  portfolio: ['examples', 'samples', 'work', 'works', 'projects', 'clients', 'case', 'showcase', 'proof', 'built', 'live'],
  register: ['apply', 'enroll', 'enrol', 'join', 'signup', 'admission', 'admissions', 'start', 'application', 'participate'],
  academy: ['school', 'training', 'course', 'courses', 'track', 'tracks', 'learn', 'student', 'cohort', 'class'],
  website: ['web', 'site', 'sites', 'platform', 'landing', 'storefront', 'webapp', 'redesign', 'frontend', 'fullstack'],
  branding: ['brand', 'identity', 'logo', 'guidelines', 'rebrand', 'positioning', 'typography', 'visuals'],
  graphic: ['flyer', 'flyers', 'poster', 'posters', 'banner', 'social', 'artwork', 'keyart', 'design'],
  video: ['film', 'edit', 'editing', 'reel', 'reels', 'montage', 'youtube', 'tiktok', 'shorts', 'postproduction', 'chigoma'],
  seo: ['search', 'google', 'ranking', 'rank', 'organic', 'traffic', 'indexing', 'visibility', 'keywords'],
  ai: ['agent', 'automation', 'bot', 'assistant', 'workflow', 'riya', 'chatbot', 'intelligent'],
  partner: ['partnership', 'partnerships', 'collaborate', 'collaboration', 'alliance', 'propose', 'whitelabel', 'motionverse', 'chigoma'],
  referral: ['refer', 'referrals', 'commission', 'commissions', 'affiliate', 'earn', 'payout', 'introduce', 'link', 'code'],
  founder: ['founders', 'ceo', 'owner', 'leadership', 'timfire', 'steveoking', 'stevenson', 'daniel'],
  tribe: ['community', 'network', 'peers', 'critique', 'alumni', 'belong', 'family'],
  mindset: ['shift', 'forum', 'event', 'edition', 'speaker', 'leadership', 'wealth', 'career'],
  team: ['job', 'jobs', 'career', 'hiring', 'vacancy', 'role', 'work', 'employment', 'talent', 'internship'],
  contact: ['reach', 'email', 'phone', 'whatsapp', 'call', 'support', 'help', 'talk', 'human'],
  certificate: ['verify', 'verification', 'credential', 'id', 'graduate', 'graduation', 'diploma'],
};

export function normalizeTokens(raw: string): string[] {
  const cleaned = raw
    .toLowerCase()
    .replace(/best[\s-]+sellers?/g, 'bestsellers')
    .replace(/ready[\s-]+(built|made)/g, 'readybuilt')
    .replace(/pre[\s-]+built/g, 'prebuilt')
    .replace(/for[\s-]+sale/g, 'forsale')
    .replace(/white[\s-]+label/g, 'whitelabel')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9+#/-]+/g, ' ')
    .trim();
  if (!cleaned) return [];
  const out: string[] = [];
  for (let tok of cleaned.split(/\s+/)) {
    if (SPELLING_FIXES[tok]) tok = SPELLING_FIXES[tok];
    if (STOP_WORDS.has(tok) || tok.length < 2) continue;
    out.push(tok);
    if (tok.length > 4 && tok.endsWith('ing')) {
      const stem = tok.slice(0, -3);
      if (!STOP_WORDS.has(stem) && stem.length >= 3) out.push(stem);
      if (!STOP_WORDS.has(`${stem}e`) && stem.length >= 3) out.push(`${stem}e`);
    } else if (tok.length > 4 && tok.endsWith('ies')) {
      const stem = `${tok.slice(0, -3)}y`;
      if (!STOP_WORDS.has(stem)) out.push(stem);
    } else if (tok.length > 3 && tok.endsWith('s') && !tok.endsWith('ss')) {
      const stem = tok.slice(0, -1);
      if (!STOP_WORDS.has(stem) && stem.length >= 2) out.push(stem);
    }
  }
  return Array.from(new Set(out));
}

export function extractCharTrigrams(text: string): string[] {
  const s = ` ${text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()} `;
  if (s.length < 4) return [];
  const set = new Set<string>();
  for (let i = 0; i <= s.length - 3; i++) {
    set.add(s.slice(i, i + 3));
  }
  return Array.from(set);
}

/* =========================================================================
   QUESTION VARIATION GENERATOR (MEANINGFUL, DISTINCT, NON-PADDED)
   ========================================================================= */
function buildServiceQuestions(s: any): string[] {
  const name = s.name;
  const short = s.short || s.name;
  return [
    `What is ${name} at KR8 DIGITALS?`,
    `What does KR8 DIGITALS deliver under ${name}?`,
    `Who is ${name} designed for?`,
    `What business problem does ${name} solve?`,
    `How does the ${name} process work step by step?`,
    `What deliverables will I receive if I hire KR8 DIGITALS for ${short}?`,
    `What outcomes can my organization expect from ${name}?`,
    `How do I request a quote or written scope for ${name}?`,
    `Where can I view live portfolio proof for ${short}?`,
    `Can KR8 DIGITALS customize ${short} for a school, hotel, clinic, or startup?`,
    `Who leads ${short} execution inside KR8 DIGITALS?`,
    `Do I own the final assets and deliverables for ${name}?`,
    ...(s.faqs || []).map((f: any) => f.q),
  ];
}

/* =========================================================================
   EXHAUSTIVE SITE-WIDE KNOWLEDGE EXTRACTION
   ========================================================================= */
async function extractAllVerifiedKnowledge(version: number): Promise<{
  records: RiyaKnowledgeRecord[];
  qaPairs: RiyaQaPair[];
  pagesAnalyzed: { route: string; title: string; recordCount: number; qaCount: number }[];
}> {
  const nowIso = new Date().toISOString();
  const publicData = await getPublicContent();
  const siteSeed = publicData.site;
  const sitesSeed = publicData.catalog;
  const pricingSeed = publicData.pricing;
  const [pages, services, programs, teamBundle, partners, navCfg, seoAll, customRows] =
    await Promise.all([
      getCmsPages({ includeDrafts: false }),
      getCmsServices({ includeDrafts: false }),
      getCmsPrograms({ includeDrafts: false }),
      getCmsTeam({ includeDrafts: false }),
      getCmsPartners({ includeDrafts: false }),
      getCmsNavigation(),
      getCmsSeoAll(),
      store.all('riya_kb_custom', 1000),
    ]);

  const records: RiyaKnowledgeRecord[] = [];
  const add = (rec: Omit<RiyaKnowledgeRecord, 'categoryLabel' | 'verifiedAt' | 'version'>) => {
    records.push({
      ...rec,
      categoryLabel: RIYA_CATEGORY_LABELS[rec.category],
      verifiedAt: nowIso,
      version,
    });
  };

  // -----------------------------------------------------------------------
  // 1. ORGANIZATIONAL IDENTITY, ACRONYM, STORY, MISSION, VISION & PHILOSOPHY
  // -----------------------------------------------------------------------
  add({
    id: 'kb-org-identity',
    category: 'organizational_identity',
    route: '/',
    source: 'data/site.json + /about',
    topicKey: 'kr8_identity',
    title: 'What KR8 DIGITALS Is & What KR8 Stands For',
    summary:
      'KR8 DIGITALS ("KR8" = Create) is a multi-disciplinary creative technology and human-capacity problem-solving company uniting commercial engineering, brand, graphic design, film, SEO, and AI with 100% tuition-free digital training.',
    content:
      `KR8 DIGITALS (pronounced "Create Digitals" — where "KR8" phonetically stands for CREATE) is a multi-disciplinary creative technology and human-capacity company. On the commercial side, KR8 DIGITALS designs and engineers custom websites, brand identity systems, commercial graphic design, retention-focused video edits, technical SEO architectures, and domain-grounded AI automation for businesses, schools, hotels, hospitals, and ambitious founders. On the human-capacity side, KR8 DIGITALS removes financial gatekeeping through 100% tuition-free digital skills cohorts at KR8 Academy, WAEC/JAMB academic preparation with Next Gen Scholars, peer mentorship inside KR8 DIGITALS TRIBE, and leadership conversations at Mindset Shift. Verified track record: 200+ client works delivered, 100+ active clients, 22 live deployed web platforms, 3 active strategic partners (Motionverse, Chigoma, Next Gen Scholars), and 20+ studio team members.`,
    audience: 'All website visitors, prospective business clients, students, partners, and referrers',
    purpose: 'Establish clear organizational identity, credibility, and dual commercial + empowerment model',
    actions: ['Commission a project (/contact)', 'Explore services (/services)', 'Explore free programs (/programs)'],
    links: [
      { label: 'About KR8 DIGITALS', href: '/about' },
      { label: 'Explore Services', href: '/services' },
      { label: 'Explore Free Programs', href: '/programs' },
    ],
    keywords: ['kr8', 'digitals', 'stand for', 'meaning', 'create', 'who are you', 'what is kr8', 'company', 'overview', 'different'],
    questions: [
      'What is KR8 DIGITALS?',
      'What does KR8 DIGITALS stand for?',
      'What does KR8 mean in KR8 DIGITALS?',
      'What kind of company is KR8 DIGITALS?',
      'What makes KR8 DIGITALS different from a normal agency?',
      'Who can benefit from KR8 DIGITALS?',
      'What opportunities are available at KR8 DIGITALS?',
      'Tell me everything KR8 DIGITALS does.',
      'Is KR8 DIGITALS an agency, a tech company, or a school?',
      'How many client projects has KR8 DIGITALS delivered?',
    ],
    relevance: 1.35,
  });

  add({
    id: 'kb-about-story-problem-solvers',
    category: 'organizational_history',
    route: '/about',
    source: 'src/app/about/page.tsx (Hero + Our Story)',
    topicKey: 'our_story_problem_solvers',
    title: 'About Page Hero & Our Story — We Are Problem Solvers',
    summary:
      'About Hero: "We are writing a story, and you can be a big part of it." Our Story: "We are problem solvers — uniting distinct minds to solve what no one can solve alone."',
    content:
      `On the About page (/about), KR8 DIGITALS welcomes every visitor with the central message: "We are writing a story, and you can be a big part of it." Our Story is anchored in a clear identity: WE ARE PROBLEM SOLVERS — "We are problem solvers — uniting distinct minds to solve what no one can solve alone." Meaningful challenges rarely fit neatly inside a single skill; when people encounter complex problems they cannot solve in isolation, breakthroughs happen when distinct minds, disciplines, and lived experiences come together. Under one accountable roof, web and AI engineering led by Timfire unites with Steveoking (Motionverse) in brand and graphic design, Creative Expression (Chigoma) in narrative video, and Next Gen Scholars in academics. Philosophy: Listen first, diagnose the real bottleneck, bring the right capabilities together, and build until the problem is genuinely solved.`,
    audience: 'Visitors reading /about, prospective clients, learners, community members, and partners',
    purpose: 'Communicate belonging, shared purpose, collaborative problem-solving identity, and studio origin story',
    actions: ['Work With Us (/contact)', 'Explore Services (/services)', 'Meet the Founders (/about#founders)'],
    links: [
      { label: 'Read Our Story on About', href: '/about' },
      { label: 'Meet the Founders', href: '/about#founders' },
    ],
    keywords: ['story', 'problem solvers', 'writing a story', 'big part of it', 'philosophy', 'why founded', 'history', 'origin', 'umbrella'],
    questions: [
      'What is the story behind KR8 DIGITALS?',
      'Why was KR8 DIGITALS started?',
      'What is KR8 DIGITALS problem-solving philosophy?',
      'What does the About page say about KR8 DIGITALS?',
      'How can I become part of the KR8 DIGITALS story?',
      'Why does KR8 DIGITALS bring different specialists together?',
    ],
    relevance: 1.25,
  });

  add({
    id: 'kb-mission-vision-purpose',
    category: 'mission_and_vision',
    route: '/about',
    source: 'data/site.json + /about',
    topicKey: 'mission_vision',
    title: 'KR8 DIGITALS Purpose, Mission & Long-Term Vision',
    summary:
      'Mission: engineer commercial websites, brands, films, SEO, and AI that earn real growth while removing financial barriers to digital education. Vision: Africa’s defining bridge between executive digital execution and accessible talent capability.',
    content:
      `KR8 DIGITALS operates on three foundational commitments: (1) Purpose: "${siteSeed.company.purpose}" (2) Mission: "${siteSeed.company.mission}" (3) Vision: "${siteSeed.company.vision}"`,
    audience: 'Partners, sponsors, institutions, clients, and prospective students',
    purpose: 'Articulate long-term strategic direction and ethical commitments',
    actions: ['Partner With Us (/partners)', 'Explore Programs (/programs)'],
    links: [
      { label: 'About KR8 DIGITALS', href: '/about' },
      { label: 'Partner With Us', href: '/partners' },
    ],
    keywords: ['mission', 'vision', 'purpose', 'goal', 'values', 'believe', 'stand', 'africa', 'empowerment'],
    questions: [
      'What is the mission of KR8 DIGITALS?',
      'What is KR8 DIGITALS vision?',
      'What is the core purpose of KR8 DIGITALS?',
      'Why does KR8 DIGITALS combine paid client work with free training?',
    ],
    relevance: 1.2,
  });

  add({
    id: 'kb-values-principles',
    category: 'values_and_philosophy',
    route: '/programs',
    source: 'data/programmes.json + /about',
    topicKey: 'values_philosophy',
    title: 'Core Operating Values & Standards',
    summary:
      'Practitioners Over Theorists, Collaborative Problem Solving, Zero Financial Gatekeeping, and Real Shipped Proof Over Empty Certificates.',
    content:
      `KR8 DIGITALS upholds four core operating principles across every client build and learning cohort: (1) Problem Solvers First — listen closely, diagnose the real bottleneck, and unite the right crafts until the problem is solved; (2) Practitioners Over Theorists — every service and free training track is led by builders actively shipping commercial web, brand, graphic, video, SEO, and AI work; (3) Zero Financial Gatekeeping — flagship digital skills and WAEC/JAMB academic pathways remain 100% tuition-free; (4) Real Standards, Real Proof — progress is measured by live websites, working systems, commercial artwork, and shipped portfolios rather than empty claims.`,
    audience: 'All audiences evaluating KR8 DIGITALS culture and quality standards',
    purpose: 'Explain cultural values and quality benchmarks',
    actions: ['Inspect Live Proof (/services)', 'Explore KR8 Academy (https://academy.kr8digitals.com)'],
    links: [
      { label: 'Explore Services & Proof', href: '/services' },
      { label: 'Explore Programs', href: '/programs' },
    ],
    keywords: ['values', 'principles', 'culture', 'standards', 'practitioners', 'gatekeeping', 'quality'],
    questions: [
      'What are the core values of KR8 DIGITALS?',
      'Who teaches inside KR8 DIGITALS programs?',
      'How does KR8 DIGITALS maintain quality across client work and training?',
    ],
    relevance: 1.15,
  });

  // -----------------------------------------------------------------------
  // 2. FOUNDERS & LEADERSHIP TEAM (EXACT SPELLINGS PRESERVED)
  // -----------------------------------------------------------------------
  for (const f of teamBundle.founders) {
    const aliases =
      f.slug === 'steveoking'
        ? ' (also accessible via /about/stevenson)'
        : f.slug === 'creative-expression'
        ? ' (also accessible via /about/daniel)'
        : '';
    add({
      id: `kb-founder-${f.slug}`,
      category: 'leadership_and_team',
      route: f.readAbout || `/about/${f.slug}`,
      source: `data/team.json + ${f.readAbout}`,
      topicKey: `founder_${f.slug}`,
      title: `${f.name} (${f.fullName}) — ${f.role}`,
      summary: `${f.name} (${f.fullName}) is ${f.headlineRole} at KR8 DIGITALS.`,
      content: `${f.name} (full name: ${f.fullName}) serves as ${f.role} at KR8 DIGITALS (${f.headlineRole}). ${f.bio} Signature perspective: "${f.quote}" Dedicated profile page: ${f.readAbout}${aliases}.`,
      audience: 'Clients, students, press, and partners researching KR8 DIGITALS leadership',
      purpose: `Present verified biography, role, and craft leadership of ${f.name}`,
      actions: [`Read ${f.name}'s full profile (${f.readAbout})`, 'Work With Us (/contact)'],
      links: [
        { label: f.linkText || `Read About ${f.name}`, href: f.readAbout || `/about/${f.slug}` },
        { label: 'About All Founders', href: '/about#founders' },
      ],
      keywords: [
        f.name.toLowerCase(),
        f.fullName.toLowerCase(),
        f.slug,
        'founder',
        'cofounder',
        'ceo',
        'leader',
        ...f.headlineRole.toLowerCase().split(/\W+/).filter(Boolean),
      ],
      questions: [
        `Who is ${f.name}?`,
        `Who is ${f.fullName}?`,
        `What is ${f.name}'s role at KR8 DIGITALS?`,
        `What does ${f.name} specialize in?`,
        `Where can I read ${f.name}'s profile?`,
      ],
      relevance: 1.3,
    });
  }

  add({
    id: 'kb-founders-overview',
    category: 'leadership_and_team',
    route: '/about',
    source: 'data/team.json',
    topicKey: 'founders_and_team_all',
    title: 'Complete Founders & Studio Leadership Directory',
    summary:
      'Founded by Timfire (Kenneth Timothy Iziogo, Founder & CEO) with Co-Founders Steveoking (Stevenson, Founder of Motionverse) and Creative Expression (Daniel Akachukwu Augustine, Founder of Chigoma), supported by studio leadership.',
    content:
      `KR8 DIGITALS is led by three founders and a dedicated executive operations team: (1) Timfire (Kenneth Timothy Iziogo) — Website developer, AI agent developer, Founder & Chief Executive (/about/timfire); (2) Steveoking (Stevenson) — Professional graphic designer, brand designer, Founder of Motionverse, Co-Founder (/about/steveoking); (3) Creative Expression (Daniel Akachukwu Augustine) — Professional video editor, Founder of Chigoma, Co-Founder (/about/creative-expression). Studio Leadership Team: ${teamBundle.team
        .map((m) => `${m.name} (${m.role} — ${m.bio})`)
        .join('; ')}.`,
    audience: 'Visitors asking who founded, owns, or manages KR8 DIGITALS',
    purpose: 'Provide complete, accurate leadership directory with verified spellings',
    actions: ['View Founders on /about#founders', 'Apply to Join the Team (/about/join-the-team)'],
    links: [
      { label: 'Read About Timfire', href: '/about/timfire' },
      { label: 'Read About Stevenson', href: '/about/steveoking' },
      { label: 'Read About Creative Expression', href: '/about/creative-expression' },
    ],
    keywords: ['founders', 'who founded', 'ceo', 'owners', 'management', 'team members', 'nicodemus', 'mercy', 'favour', 'covenant', 'timfire', 'steveoking', 'stevenson', 'daniel', 'creative expression'],
    questions: [
      'Who founded KR8 DIGITALS?',
      'Who is the CEO of KR8 DIGITALS?',
      'Who are the co-founders of KR8 DIGITALS?',
      'Who manages projects and operations at KR8 DIGITALS?',
      'How many founders and team members does KR8 DIGITALS have?',
    ],
    relevance: 1.32,
  });

  // -----------------------------------------------------------------------
  // 3. ALL 6 COMMERCIAL SERVICES + PRICING SCOPE STRUCTURE
  // -----------------------------------------------------------------------
  add({
    id: 'kb-services-hub',
    category: 'services',
    route: '/services',
    source: 'src/app/services/page.tsx + data/services.json',
    topicKey: 'services_overview',
    title: 'All Six Commercial Services Offered by KR8 DIGITALS',
    summary:
      'KR8 DIGITALS delivers 6 commercial services: (1) Website Design & Development, (2) Branding, (3) Graphic Design, (4) Video Editing, (5) SEO Optimization, and (6) AI Agent & Automation.',
    content:
      `KR8 DIGITALS offers six distinct commercial services for businesses, schools, hotels, hospitals, nonprofits, and founders on /services: 1. Website Design & Development (/services/website-design) — custom mobile-fast websites, booking flows, and web applications; 2. Branding (/services/branding) — brand strategy, logo suites, typography, color systems, and Brand Guidelines Playbooks led with Motionverse; 3. Graphic Design (/services/graphic-design) — scroll-stopping campaign flyers, product launch graphics, event key art, and print collateral; 4. Video Editing (/services/video-editing) — retention-cut commercial reels, testimonials, captions, color grading, and sound mix led with Chigoma; 5. SEO Optimization (/services/seo) — technical SEO audits, Core Web Vitals, JSON-LD schema, local search authority, and monthly reporting; 6. AI Agent & Automation (/services/ai-automation) — custom domain-grounded AI agents (like RIYA), intelligent lead routing, and workflow automation. Note: Branding and Graphic Design are distinct services — Branding builds your foundational identity system, while Graphic Design executes ongoing promotional campaigns and flyers.`,
    audience: 'Business owners, school proprietors, hotel managers, founders, and marketing teams',
    purpose: 'Present all paid commercial capabilities and help buyers pick the right discipline',
    actions: ['Compare all 6 services (/services)', 'Request a written scope (/contact)'],
    links: [
      { label: 'Explore All 6 Services', href: '/services' },
      { label: 'Request a Written Scope', href: '/contact' },
    ],
    keywords: ['services', 'offer', 'hire', 'commercial', 'what do you build', 'business', 'website', 'branding', 'graphic', 'video', 'seo', 'ai'],
    questions: [
      'What services do you offer?',
      'What commercial services can I hire KR8 DIGITALS for?',
      'How many services does KR8 DIGITALS provide?',
      'What is the difference between Branding and Graphic Design at KR8 DIGITALS?',
      'Can KR8 DIGITALS handle my website, branding, and video all in one place?',
      'Who can benefit from KR8 DIGITALS commercial services?',
    ],
    relevance: 1.35,
  });

  for (const s of services) {
    const procText = (s.process || []).map((p: any) => `Step ${p.n} (${p.t}): ${p.d}`).join(' ');
    const faqText = (s.faqs || []).map((f: any) => `Q: ${f.q} A: ${f.a}`).join(' ');
    add({
      id: `kb-service-${s.slug}`,
      category: 'services',
      route: `/services/${s.slug}`,
      source: `data/services.json + /services/${s.slug}`,
      topicKey: `service_${s.slug}`,
      title: `${s.name} — Commercial Service (/services/${s.slug})`,
      summary: `${s.tagline} ${s.summary}`,
      content: `${s.name} (/services/${s.slug}): ${s.summary} Ideal for: ${s.forWhom || 'ambitious organisations'}. Core problem solved: ${s.problem || ''}. Key deliverables: ${(s.deliverables || []).join(', ')}. Expected client outcomes: ${(s.outcomes || []).join('; ')}. Delivery process: ${procText} ${faqText}`,
      audience: s.forWhom || 'Organisations commissioning commercial digital work',
      purpose: `Explain scope, deliverables, process, and proof for ${s.name}`,
      actions: [`Explore ${s.name} (/services/${s.slug})`, `Request a quote (/contact?service=${s.slug})`],
      links: [
        { label: `${s.name} Page`, href: `/services/${s.slug}` },
        { label: 'Request Written Quote', href: `/contact?service=${s.slug}` },
      ],
      keywords: [
        s.slug,
        ...s.name.toLowerCase().split(/\W+/).filter(Boolean),
        ...(s.deliverables || []).flatMap((d: string) => d.toLowerCase().split(/\W+/)).filter(Boolean),
      ],
      questions: buildServiceQuestions(s),
      relevance: 1.28,
    });
  }

  add({
    id: 'kb-commercial-pricing-policy',
    category: 'operational_processes',
    route: '/contact',
    source: 'data/site.json + data/pricing.json + /terms',
    topicKey: 'commercial_pricing',
    title: 'How Commercial Pricing, Scoping & Invoices Work (vs Free Training)',
    summary:
      'Training at KR8 Academy is 100% free ($0). Commercial client services (websites, branding, graphics, video, SEO, AI) are scoped in writing with fixed milestones and transparent quotes.',
    content:
      `Important distinction on cost at KR8 DIGITALS: (1) Learning & Empowerment: KR8 Academy's 7 digital skill tracks, Next Gen Scholars WAEC/JAMB academic classes, KR8 DIGITALS TRIBE membership, and Mindset Shift sessions are 100% TUITION-FREE ($0 / ₦0 — no registration fee and no certificate fee). (2) Hiring KR8 DIGITALS for Commercial Business Projects: Client builds are quoted transparently in writing against fixed milestones via /contact before any commitment begins (with ready-built website platforms listed on showcase cards where applicable, and custom scopes tailored to your requirements). Upon full invoice settlement, clients retain 100% ownership of their custom deliverables, domain, and codebase.`,
    audience: 'Prospective business clients comparing budgets AND learners checking if training is free',
    purpose: 'Prevent confusion between free educational programs and paid commercial studio engagements',
    actions: ['Request a commercial quote (/contact)', 'Apply to free training (https://academy.kr8digitals.com/apply)'],
    links: [
      { label: 'Request a Project Quote', href: '/contact' },
      { label: 'Apply for Free Training ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
    ],
    keywords: ['price', 'pricing', 'cost', 'how much', 'quote', 'budget', 'fee', 'fees', 'charge', 'pay', 'invoice', 'free'],
    questions: [
      'How much do your services cost?',
      'How does pricing work at KR8 DIGITALS?',
      'Do I have to pay for KR8 DIGITALS programs or only business services?',
      'How do I get a fixed quote for a website or branding project?',
      'Are there hidden fees at KR8 DIGITALS?',
    ],
    relevance: 1.32,
  });

  // -----------------------------------------------------------------------
  // 4. DEPLOYED PORTFOLIO WEBSITES, FLYERS & VIDEO PROOF
  // -----------------------------------------------------------------------
  add({
    id: 'kb-portfolio-overview',
    category: 'portfolio_and_proof',
    route: '/services/website-design',
    source: 'data/sites.json',
    topicKey: 'portfolio_proof',
    title: 'Deployed Websites, Ready-to-Acquire Platforms, Flyers & Video Reels',
    summary: `${sitesSeed.sites.length} live deployed websites across Hotels, Food & Drink, Organisations, Businesses, and Education — plus commercial flyers and vertical video stories.`,
    content: `KR8 DIGITALS maintains an inspectable live portfolio of ${sitesSeed.sites.length} deployed web builds: Live Client Institutions include AFRISTEM Global (afristemglobal.org), McGettrick Pastoral Centre (mcgettrickcentre.kr8digitals.com), Chi-Tom Rapha Hospital & Maternity (chitomraphahospital.com), and KR8 Academy (academy.kr8digitals.com). Ready-built hospitality, dining, school, and AI platforms available for rapid rebranding include Cirenes Hotels, Salt Lake Hotels, Monabliss Hotels, Galaxy La-Palm Royal Resort, Adig Suites, Xenia Essence, House Ten Hotel, Kamojama Villa, Cecilia Exclusive Palace, Vegas Restaurant & Bakery, Tastia, Nourisha, HydePark Delights, Native Delicacies, AFRISTEM Digital Science School, Prime STEM Nigeria, Jev AI Form Router, and 30 Days Consistency Drill. Commercial Graphic Design proof includes Presco Trip, Zoey Perfume, City Fashion Stores, Ridwan Footwear, and Steveoking Graphix.`,
    audience: 'Prospective clients verifying real shipped work before hiring',
    purpose: 'Provide verifiable live URLs and creative proof across industries',
    actions: ['Inspect live websites (/services/website-design)', 'Buy or customize a ready-built site (/contact)'],
    links: [
      { label: 'Website Portfolio', href: '/services/website-design' },
      { label: 'Graphic Design Showcase', href: '/services/graphic-design' },
      { label: 'Video Editing Showcase', href: '/services/video-editing' },
    ],
    keywords: ['portfolio', 'examples', 'past work', 'samples', 'hotels', 'hospital', 'restaurant', 'school', 'live sites', 'buy site', 'afristem', 'rapha', 'mcgettrick'],
    questions: [
      'Can I see examples of websites KR8 DIGITALS has built?',
      'Have you built websites for hotels, hospitals, restaurants, or schools?',
      'Can I buy one of the ready-built websites in your showcase?',
      'Are the websites and flyers in your portfolio real?',
    ],
    relevance: 1.2,
  });

  // -----------------------------------------------------------------------
  // 5. ECOSYSTEM PROGRAMS, KR8 ACADEMY, TRIBE, MINDSET SHIFT & JOIN TEAM
  // -----------------------------------------------------------------------
  add({
    id: 'kb-programs-hub',
    category: 'programs',
    route: '/programs',
    source: 'src/app/programs/page.tsx + data/programmes.json',
    topicKey: 'programs_overview',
    title: 'All Four Ecosystem Programs on /programs',
    summary:
      'KR8 DIGITALS operates 4 structured programs: (1) Free Digital Skills & Academic Training (KR8 Academy + Next Gen Scholars), (2) KR8 DIGITALS TRIBE, (3) Mindset Shift, and (4) Join the Team.',
    content:
      `On /programs, KR8 DIGITALS runs four human-capacity initiatives completely distinct from paid commercial client services: (1) Free Digital Skills & Academic Training — 100% tuition-free digital skill cohorts via KR8 Academy (7 practical tracks) plus WAEC/JAMB Sciences & Arts academic instruction via Next Gen Scholars; (2) KR8 DIGITALS TRIBE (/tribe) — free peer community for designers, developers, video editors, and alumni featuring Critique Over Clout, Interdisciplinary Sprints, Peer Accountability, and Opportunity Sharing; (3) Mindset Shift (/programs/mindset-shift/invite) — leadership, career, and perspective forum convened by Timfire and guest practitioners (interest list open; exact edition dates announced only once formally confirmed); (4) Join the Team (/about/join-the-team) — merit-based studio talent pathway onto paid commercial client projects via portfolio review and trial collaboration.`,
    audience: 'Prospective students, youths, self-taught creatives, career switchers, and experienced practitioners',
    purpose: 'Guide learners and builders to the exact free training, community, or career pathway fitting their stage',
    actions: [
      'Apply to KR8 Academy (https://academy.kr8digitals.com/apply)',
      'Join KR8 DIGITALS TRIBE (/tribe)',
      'RSVP for Mindset Shift (/programs/mindset-shift/invite)',
      'Apply to Join the Team (/about/join-the-team)',
    ],
    links: [
      { label: 'Explore All 4 Programs', href: '/programs' },
      { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
      { label: 'Explore KR8 DIGITALS TRIBE', href: '/tribe' },
    ],
    keywords: ['programs', 'programmes', 'initiatives', 'opportunities', 'empowerment', 'training', 'tribe', 'mindset shift', 'academy'],
    questions: [
      'What programs do you offer?',
      'Who can join your programs?',
      'Are all KR8 DIGITALS programs free?',
      'What is the difference between your Services page and your Programs page?',
      'Which KR8 DIGITALS program is right for a beginner?',
    ],
    relevance: 1.35,
  });

  add({
    id: 'kb-training-tracks-detail',
    category: 'training_opportunities',
    route: '/programs#free-training',
    source: 'data/programmes.json + https://academy.kr8digitals.com',
    topicKey: 'academy_tracks',
    title: 'KR8 Academy 7 Free Digital Skill Tracks & Next Gen Scholars Academic Door',
    summary:
      '7 tuition-free digital tracks (Website Development, Front-End Development, Graphic Design, Video Editing & Motion, Content Creation, Social Media Management, Digital Marketing) + Sciences & Arts WAEC/JAMB prep.',
    content:
      `KR8 DIGITALS' flagship training offers two tuition-free educational doors: Door 1 — KR8 Academy (https://academy.kr8digitals.com) teaches 7 practical digital skill tracks: (1) Website Development, (2) Front-End Development, (3) Graphic Design (with mentorship from Steveoking of Motionverse), (4) Video Editing & Motion (with mentorship from Creative Expression of Chigoma), (5) Content Creation, (6) Social Media Management, and (7) Digital Marketing. Door 2 — Next Gen Scholars (/partners/next-gen-scholars) provides structured Sciences and Arts preparation for secondary and pre-university students sitting WAEC and JAMB examinations. Tuition is $0 / ₦0, certificate issuance is $0, and every graduate receives a publicly verifiable KR8 ID at https://academy.kr8digitals.com/verify. Beginners with zero prior coding or design background are welcome — curiosity, weekly consistency, and practical assignment completion are what count.`,
    audience: 'Beginners, students, secondary school leavers, undergraduates, and career switchers',
    purpose: 'Detail every skill track, zero-tuition policy, beginner suitability, and credential verification',
    actions: [
      'Apply at https://academy.kr8digitals.com/apply',
      'Verify a graduate KR8 ID at https://academy.kr8digitals.com/verify',
    ],
    links: [
      { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
      { label: 'Explore KR8 Academy ↗', href: 'https://academy.kr8digitals.com', outbound: true },
      { label: 'Next Gen Scholars Academic Door', href: '/partners/next-gen-scholars' },
    ],
    keywords: [
      'skills', 'learn', 'tracks', 'courses', 'web development', 'frontend', 'graphic design',
      'video editing', 'content creation', 'social media', 'digital marketing', 'waec', 'jamb',
      'sciences', 'arts', 'beginner', 'free', 'tuition', 'certificate', 'kr8 id',
    ],
    questions: [
      'What skills can I learn at KR8 DIGITALS?',
      'Is your training completely free?',
      'Do I have to pay before registering or pay for a certificate?',
      'How much money do I need to participate in KR8 Academy?',
      'What are the seven tracks in KR8 Academy?',
      'Can a complete beginner with no experience join KR8 Academy?',
      'I want to learn web development, where do I start?',
      'Do you offer WAEC or JAMB preparation?',
      'How do employers verify a KR8 Academy certificate or KR8 ID?',
    ],
    relevance: 1.38,
  });

  // -----------------------------------------------------------------------
  // 6. REGISTRATION, ONBOARDING & WHAT HAPPENS AFTER REGISTRATION
  // -----------------------------------------------------------------------
  add({
    id: 'kb-registration-onboarding',
    category: 'registration_and_onboarding',
    route: '/programs',
    source: 'All registration portals & LeadForm workflows',
    topicKey: 'registration_process',
    title: 'How to Register & What Happens After Registration Across Every Door',
    summary:
      'Exact registration links and post-registration steps for KR8 Academy, KR8 DIGITALS TRIBE, Mindset Shift, Join the Team, Referrals, and Partnerships.',
    content:
      `How to register at KR8 DIGITALS depending on your goal: (1) Free Digital Skills Training (KR8 Academy): Register directly on the official portal at https://academy.kr8digitals.com/apply — select your preferred skill track, submit your learner details, and follow the admissions onboarding instructions on academy.kr8digitals.com/admissions. (2) KR8 DIGITALS TRIBE Community: Visit /tribe and complete the community interest form ("Add me to the list") — our team reviews and sends onboarding details. (3) Mindset Shift Forum: Visit /programs/mindset-shift/invite and submit the invitation form — you will receive the confirmed date, speakers, and joining link as soon as the next edition is formally announced. (4) Join the Studio Team: Visit /about/join-the-team and submit your discipline and portfolio link — every application is reviewed on merit, followed by a practical trial collaboration for shortlisted builders (zero application fee). (5) Referral Agent Registration: Visit /referrals and submit your name, email, and payout info to receive your instant referral code and personal /r/[code] link immediately on screen. If you registered for any pathway and have not yet seen a response, you can tell RIYA right here in chat (or message WhatsApp +234 812 568 7509 / email kr8digitals01@gmail.com) and RIYA will log a priority follow-up ticket directly to the administrative dashboard.`,
    audience: 'Applicants, prospective students, community joiners, referrers, and talent candidates',
    purpose: 'Give step-by-step registration paths, requirements, and post-registration expectations',
    actions: [
      'Apply to KR8 Academy (https://academy.kr8digitals.com/apply)',
      'Join the Tribe (/tribe)',
      'RSVP Mindset Shift (/programs/mindset-shift/invite)',
      'Apply to Join the Team (/about/join-the-team)',
    ],
    links: [
      { label: 'Register on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
      { label: 'Join KR8 DIGITALS TRIBE', href: '/tribe' },
      { label: 'Mindset Shift Invite List', href: '/programs/mindset-shift/invite' },
      { label: 'Join the Studio Team', href: '/about/join-the-team' },
    ],
    keywords: ['register', 'registration', 'how to apply', 'sign up', 'enroll', 'after registration', 'requirements', 'admission', 'onboarding', 'confirmation'],
    questions: [
      'How do I register?',
      'How do I apply for KR8 DIGITALS free training?',
      'What happens after registration?',
      'What are the requirements to join KR8 DIGITALS programs?',
      'How do I join KR8 DIGITALS TRIBE?',
      'How do I register for Mindset Shift?',
      'Is there any registration fee or admission test fee?',
    ],
    relevance: 1.38,
  });

  add({
    id: 'kb-student-support-info',
    category: 'student_information',
    route: '/programs',
    source: 'data/programmes.json + data/site.json',
    topicKey: 'student_support',
    title: 'Student Support, Learning Commitment, Devices & Credential Verification',
    summary:
      'Weekly practical assignments, supportive practitioner feedback, verifiable KR8 ID graduation credentials, and ongoing growth inside KR8 DIGITALS TRIBE.',
    content:
      `For prospective and current KR8 Academy & Next Gen Scholars students: Learning focuses on practical weekly execution rather than passive theory. Learners complete real drills, build inspectable portfolio pieces, and receive practitioner guidance. Tracks like Content Creation, Social Media Management, Digital Marketing, and mobile-first editing workflows can be started with a capable smartphone while working toward a laptop, whereas Website Development and Front-End Engineering benefit strongly from laptop/desktop access. Upon completing cohort requirements, graduates earn a zero-cost certificate and a permanent KR8 ID verifiable by any employer at https://academy.kr8digitals.com/verify, and transition into KR8 DIGITALS TRIBE (/tribe) for ongoing peer critique and studio opportunities. Dedicated Academy email: academy@kr8digitals.com.`,
    audience: 'Prospective and current students',
    purpose: 'Clarify learning commitment, device questions, graduation credentials, and student support channels',
    actions: ['Visit KR8 Academy (https://academy.kr8digitals.com)', 'Verify a KR8 ID (https://academy.kr8digitals.com/verify)'],
    links: [
      { label: 'KR8 Academy Portal ↗', href: 'https://academy.kr8digitals.com', outbound: true },
      { label: 'Verify Graduate KR8 ID ↗', href: 'https://academy.kr8digitals.com/verify', outbound: true },
    ],
    keywords: ['student', 'students', 'laptop', 'phone', 'smartphone', 'schedule', 'duration', 'weeks', 'certificate', 'verify', 'kr8 id', 'graduate'],
    questions: [
      'Can I join KR8 Academy using my phone if I do not have a laptop yet?',
      'What happens after I graduate from KR8 Academy?',
      'How do I verify a student certificate or KR8 ID?',
      'Who do existing students contact if they need help?',
    ],
    relevance: 1.25,
  });

  // -----------------------------------------------------------------------
  // 7. PARTNERSHIPS & ACTIVE PARTNER CHAPTERS
  // -----------------------------------------------------------------------
  add({
    id: 'kb-partnerships-hub',
    category: 'partnership_opportunities',
    route: '/partners',
    source: 'src/app/partners/page.tsx + data/partners.json',
    topicKey: 'partnerships_overview',
    title: 'How to Partner With KR8 DIGITALS — Tracks, Benefits & Proposal Workflow',
    summary:
      'Four partnership tracks (Creative Studios, Schools & Educators, Sponsors & Foundations, Agencies & Enterprises) with full brand credit and a 4-step proposal workflow on /partners#propose.',
    content:
      `Organisations, studios, schools, sponsors, NGOs, and agencies can partner with KR8 DIGITALS via /partners across four structured tracks: (1) Creative & Technical Studio Allies — co-deliver client builds while retaining full public brand credit (just like Motionverse and Chigoma); (2) Academic & Institutional Partners — bring digital skills or STEM/Arts prep to students (like Next Gen Scholars); (3) Training Cohort & Social Impact Sponsors — sponsor data stipends, learning equipment, or Mindset Shift editions with transparent portfolio-backed impact reporting; (4) Commercial Delivery & White-Label Allies — partner with KR8 DIGITALS engineering, design, film, SEO, and AI teams on client engagements. 4-Step Process: Step 1 Submit Proposal on /partners#propose -> Step 2 Executive Alignment Call -> Step 3 Written Charter & Attribution Rules -> Step 4 Co-Branded Execution. Active partners: ${partners
        .map((p) => `${p.name} (${p.role}, /partners/${p.slug})`)
        .join('; ')}.`,
    audience: 'Founders, studio directors, school administrators, CSR/foundation leads, and agency owners',
    purpose: 'Explain why and how to partner with KR8 DIGITALS and submit a live proposal',
    actions: ['Submit a Partnership Proposal (/partners#propose)', 'Inspect active partner chapters (/partners)'],
    links: [
      { label: 'Propose a Partnership', href: '/partners#propose' },
      { label: 'Explore Partners Page', href: '/partners' },
    ],
    keywords: ['partner', 'partners', 'partnership', 'propose', 'sponsor', 'collaborate', 'csr', 'ngo', 'school', 'white label', 'motionverse', 'chigoma', 'next gen scholars'],
    questions: [
      'How do I become a partner with KR8 DIGITALS?',
      'Why should an organization partner with KR8 DIGITALS?',
      'Who are KR8 DIGITALS existing partners?',
      'Can a school, NGO, or corporate sponsor partner with KR8 DIGITALS?',
      'How does the Partnership Proposal Form on /partners work?',
    ],
    relevance: 1.3,
  });

  for (const p of partners) {
    add({
      id: `kb-partner-${p.slug}`,
      category: 'partnership_opportunities',
      route: `/partners/${p.slug}`,
      source: `data/partners.json + /partners/${p.slug}`,
      topicKey: `partner_${p.slug}`,
      title: `${p.name} — ${p.role}`,
      summary: p.blurb,
      content: `${p.name} (/partners/${p.slug}) is an official ${p.type} in the KR8 DIGITALS network, led by ${p.person}. ${p.long} Contribution: ${p.contribution} Educational role: ${p.teaches}.`,
      audience: 'Visitors exploring KR8 DIGITALS partner studios and academic allies',
      purpose: `Detail the role and contribution of partner ${p.name}`,
      actions: [`Read ${p.name} chapter (/partners/${p.slug})`, 'Propose a Partnership (/partners#propose)'],
      links: [
        { label: `${p.name} Chapter`, href: `/partners/${p.slug}` },
        { label: 'All Partners', href: '/partners' },
      ],
      keywords: [p.slug, p.name.toLowerCase(), p.person.toLowerCase(), 'partner'],
      questions: [
        `What is ${p.name} and how does it work with KR8 DIGITALS?`,
        `Who leads ${p.name}?`,
        `What does ${p.name} teach or contribute inside KR8 DIGITALS?`,
      ],
      relevance: 1.2,
    });
  }

  // -----------------------------------------------------------------------
  // 8. REFERRAL NETWORK, COMMISSIONS & DASHBOARD
  // -----------------------------------------------------------------------
  add({
    id: 'kb-referrals-system',
    category: 'referral_opportunities',
    route: '/referrals',
    source: 'data/site.json + /referrals + /referrals/dashboard',
    topicKey: 'referral_program',
    title: 'KR8 DIGITALS Referral Network — Rates, Attribution Link & Payout Rules',
    summary:
      'Earn 10% on websites/AI systems, 8% on branding/design/video/SEO, 10% ($20 min) on smaller scopes, and 12% bonus rate after 3 paid referrals. Instant signup on /referrals and live tracking on /referrals/dashboard.',
    content:
      `Anyone can earn commissions by introducing organisations or founders who need digital work to KR8 DIGITALS (/referrals — "You may not have the skill. You have the people."). Verified commission tiers: • Websites, Web Apps & AI Systems: 10% commission (worked example: a $2,000 institutional website earns $200 USD). • Branding, Graphic Design, Video Editing & SEO: 8% commission. • Smaller Scopes: 10% with a $20 USD minimum floor. • Loyalty Bonus Tier: Rises to 12% across eligible scopes after 3 completed paid referrals. • Minimum Withdrawal Threshold: $20 USD, settled directly via bank transfer once the referred client's invoice is confirmed paid in full (self-referrals and pre-existing active negotiations are excluded). How it works: Register free on /referrals to get your unique referral code and personal /r/[code] share link, then track clicks, leads, and commissions anytime on /referrals/dashboard.`,
    audience: 'Connectors, alumni, students, freelancers, consultants, and community members',
    purpose: 'Explain exact commission math, rules, signup, and dashboard tracking',
    actions: [
      'Get a referral code (/referrals)',
      'Check referral earnings (/referrals/dashboard)',
    ],
    links: [
      { label: 'Join Referral Network', href: '/referrals' },
      { label: 'Open Referrer Dashboard', href: '/referrals/dashboard' },
    ],
    keywords: ['referral', 'referrals', 'refer', 'commission', 'earn', 'affiliate', 'percentage', 'payout', 'withdraw', 'code', 'dashboard'],
    questions: [
      'How does your referral system work?',
      'How much commission can I earn referring clients to KR8 DIGITALS?',
      'Who can become a KR8 DIGITALS referral partner?',
      'When and how are referral commissions paid out?',
      'Where do I check my referral clicks and commissions?',
      'Do I need technical skills to earn with KR8 DIGITALS referrals?',
    ],
    relevance: 1.32,
  });

  // -----------------------------------------------------------------------
  // 9. CAREER / JOIN THE TEAM, TRIBE, MINDSET SHIFT, CONTACT, ORDER, LEGAL
  // -----------------------------------------------------------------------
  add({
    id: 'kb-join-the-team',
    category: 'career_and_talent_pathway',
    route: '/about/join-the-team',
    source: 'src/app/about/join-the-team/page.tsx + data/site.json',
    topicKey: 'join_the_team',
    title: 'Join the Team — Merit-Based Studio Recruitment (/about/join-the-team)',
    summary:
      'Rolling portfolio review and practical trial collaboration across Web/AI Engineering, Branding & Graphic Design, Video Post-Production, and SEO. Zero application fee.',
    content:
      `Experienced developers, brand/graphic designers, video editors, SEO specialists, and standout KR8 Academy graduates can apply to join the KR8 DIGITALS delivery team at /about/join-the-team. Onboarding is 100% merit-based ($0 application fee): Step 1 Submit your craft discipline and real shipped work/portfolio link on /about/join-the-team -> Step 2 Studio lead review (every applicant hears back) -> Step 3 Practical paid/scoped trial collaboration alongside studio leads -> Step 4 Ongoing studio onboarding onto live client engagements.`,
    audience: 'Developers, designers, video editors, AI engineers, and SEO practitioners seeking studio work',
    purpose: 'Clarify merit-based hiring criteria and application process',
    actions: ['Submit portfolio application (/about/join-the-team)'],
    links: [{ label: 'Apply to Join the Team', href: '/about/join-the-team' }],
    keywords: ['job', 'jobs', 'hiring', 'career', 'work for kr8', 'join the team', 'vacancy', 'portfolio', 'employment', 'freelance'],
    questions: [
      'How can I join the KR8 DIGITALS team?',
      'Is KR8 DIGITALS hiring developers, designers, or video editors?',
      'Do I have to pay any fee to apply to join the KR8 DIGITALS team?',
      'What happens after I submit a Join the Team application?',
    ],
    relevance: 1.25,
  });

  add({
    id: 'kb-tribe-community',
    category: 'programs',
    route: '/tribe',
    source: 'src/app/tribe/page.tsx',
    topicKey: 'kr8_tribe',
    title: 'KR8 DIGITALS TRIBE — The Creative & Builder Community (/tribe)',
    summary:
      '100% free builder community centered on Critique Over Clout, Interdisciplinary Sprints, Peer Accountability, and Opportunity & Overflow Sharing.',
    content:
      `KR8 DIGITALS TRIBE (/tribe) is the judgment-free creative and engineering community of KR8 DIGITALS. Built so designers, developers, video editors, and founders never stall in isolation after finishing a course, the Tribe centers on four pillars: (1) Critique Over Clout — honest feedback on work-in-progress from experienced peers; (2) Interdisciplinary Sprints — developers, designers, and editors teaming up on real briefs; (3) Peer Accountability — consistent building habits; and (4) Opportunity & Overflow Sharing. Joining is free via the interest form on /tribe.`,
    audience: 'Creatives, developers, editors, KR8 Academy alumni, and self-taught builders',
    purpose: 'Explain the Tribe community purpose and onboarding path',
    actions: ['Join KR8 DIGITALS TRIBE (/tribe)'],
    links: [{ label: 'Visit KR8 DIGITALS TRIBE', href: '/tribe' }],
    keywords: ['tribe', 'community', 'network', 'critique', 'sprints', 'peers', 'alumni', 'creatives'],
    questions: [
      'What is KR8 DIGITALS TRIBE?',
      'Who can join KR8 DIGITALS TRIBE and is it free?',
      'What happens inside KR8 DIGITALS TRIBE?',
    ],
    relevance: 1.25,
  });

  add({
    id: 'kb-mindset-shift',
    category: 'programs',
    route: '/programs/mindset-shift/invite',
    source: 'src/app/programs/mindset-shift/invite/page.tsx + data/programmes.json',
    topicKey: 'mindset_shift',
    title: 'Mindset Shift — Leadership, Career & Perspective Forum',
    summary:
      'Free leadership and builder-mindset conversation series convened by Timfire and guest speakers. Register on /programs/mindset-shift/invite for confirmed edition alerts.',
    content:
      `Mindset Shift (/programs/mindset-shift/invite) is KR8 DIGITALS' recurring live leadership, career, and perspective forum hosted by Timfire alongside guest practitioners. Sessions challenge limiting beliefs around career longevity, discipline, business ethics, value creation, and wealth building. Important verification rule: KR8 DIGITALS never publishes unconfirmed dates — upcoming edition dates, venues, and guest speakers are sent directly to registered attendees on the /programs/mindset-shift/invite interest list once formally confirmed.`,
    audience: 'Young founders, students, freelancers, creatives, and professionals',
    purpose: 'Explain Mindset Shift and how to receive confirmed edition invitations without false date claims',
    actions: ['Join Mindset Shift Invitation List (/programs/mindset-shift/invite)'],
    links: [{ label: 'Request Mindset Shift Invite', href: '/programs/mindset-shift/invite' }],
    keywords: ['mindset', 'shift', 'mindset shift', 'event', 'edition', 'forum', 'speaker', 'sunday', 'invite'],
    questions: [
      'What is Mindset Shift at KR8 DIGITALS?',
      'When is the next Mindset Shift edition?',
      'How do I get invited to Mindset Shift?',
      'Is Mindset Shift free to attend?',
    ],
    relevance: 1.25,
  });

  add({
    id: 'kb-contact-support-channels',
    category: 'customer_support',
    route: '/contact',
    source: 'src/app/contact/page.tsx + CMS Navigation',
    topicKey: 'contact_support',
    title: 'Official Contact Channels, WhatsApp, Email & Human Support',
    summary: `Email: ${navCfg.companyEmail} (Academy: academy@kr8digitals.com), Phone/WhatsApp: ${navCfg.companyPhone}, Contact form: /contact, or live human handoff inside RIYA.`,
    content: `Official ways to contact KR8 DIGITALS: • Primary Email: ${navCfg.companyEmail} • Academy Support Email: ${siteSeed.company.academyEmail} • Phone & Direct WhatsApp: ${navCfg.companyPhone} (https://wa.me/${navCfg.companyWhatsapp}) • Project Brief & General Message Form: /contact • Partnership Proposal Form: /partners#propose • Live Chat & Escalation: Ask RIYA anytime to log a complaint, suggestion, enquiry, or connect a human team member directly into this chat. KR8 DIGITALS serves clients and students remotely across Nigeria, Africa, and worldwide.`,
    audience: 'All visitors seeking direct contact, urgent support, or human follow-up',
    purpose: 'Provide verified official contact information and prevent impersonation',
    actions: ['Send a brief on /contact', `Message WhatsApp (${navCfg.companyPhone})`, `Email ${navCfg.companyEmail}`],
    links: [
      { label: 'Open Contact Page', href: '/contact' },
      { label: 'Message on WhatsApp ↗', href: `https://wa.me/${navCfg.companyWhatsapp}`, outbound: true },
    ],
    keywords: ['contact', 'email', 'phone', 'number', 'whatsapp', 'call', 'address', 'location', 'where', 'reach', 'support', 'talk to human'],
    questions: [
      'How do I contact KR8 DIGITALS?',
      'What is KR8 DIGITALS official WhatsApp number and email address?',
      'Where is KR8 DIGITALS located and do you work with international clients?',
      'Can I speak to a human team member?',
    ],
    relevance: 1.35,
  });

  add({
    id: 'kb-complaints-suggestions-process',
    category: 'complaints_and_suggestions',
    route: '/contact',
    source: 'RIYA Administrative Integration Specification',
    topicKey: 'complaints_and_suggestions',
    title: 'How to Submit a Complaint, Suggestion, or Issue Through RIYA',
    summary:
      'Visitors can report any complaint, delayed registration follow-up, technical problem, or program suggestion directly to RIYA — immediately ticketed with a reference code into the KR8 DIGITALS Admin Studio.',
    content:
      `Yes — visitors, students, clients, partners, and referrers can submit complaints, suggestions, technical issue reports, or registration follow-ups directly to RIYA in chat. When you share a complaint (for example, delayed follow-up after registering) or a suggestion (for example, proposing a new training track), RIYA categorizes your submission, preserves the conversation context, generates a tracking reference ID, and delivers it straight into the KR8 DIGITALS Administrative Dashboard so leadership can assign, review, and resolve it promptly.`,
    audience: 'Anyone experiencing an issue, delay, or wishing to propose an improvement',
    purpose: 'Explain transparent complaint and suggestion handling',
    actions: ['Tell RIYA your complaint or suggestion directly in chat', 'Or use /contact'],
    links: [{ label: 'Contact Studio Team', href: '/contact' }],
    keywords: ['complaint', 'complain', 'suggestion', 'suggest', 'feedback', 'issue', 'problem', 'nobody contacted', 'no confirmation', 'report'],
    questions: [
      'Can I make a complaint through RIYA?',
      'How do I submit a suggestion or new program idea to KR8 DIGITALS?',
      'I registered but nobody has contacted me — what should I do?',
      'Who reviews complaints and suggestions sent to RIYA?',
    ],
    relevance: 1.3,
  });

  add({
    id: 'kb-order-lookup-settlement',
    category: 'operational_processes',
    route: '/order/[ref]',
    source: 'src/app/order/[ref]/page.tsx',
    topicKey: 'order_settlement',
    title: 'Order Reference Lookup & Invoice Settlement (/order/[ref])',
    summary:
      'Commissioning clients receive a signed /order/[ref] settlement link showing verified invoice details, reference narration rules, and payment status.',
    content:
      `When a client initiates a commercial engagement or ready-built website acquisition, KR8 DIGITALS issues an order reference accessible at /order/[ref] with cryptographic signature verification. Clients include their exact order reference on transfer narrations for instant finance matching, and can confirm any reference immediately via WhatsApp (+234 812 568 7509).`,
    audience: 'Commercial clients settling project invoices',
    purpose: 'Explain /order/[ref] confirmation and payment verification',
    actions: ['Open your /order/[ref] link or confirm via WhatsApp'],
    links: [{ label: 'Contact Finance / Studio Desk', href: '/contact' }],
    keywords: ['order', 'reference', 'invoice', 'payment', 'transfer', 'settlement', 'receipt'],
    questions: [
      'How do I check my KR8 DIGITALS order reference or payment status?',
      'What if my order reference says not found on /order/[ref]?',
    ],
    relevance: 1.1,
  });

  add({
    id: 'kb-policies-privacy-terms-accessibility',
    category: 'policies_and_requirements',
    route: '/privacy',
    source: '/privacy + /terms + /accessibility',
    topicKey: 'legal_policies',
    title: 'Privacy Policy, Terms of Service, IP Ownership & Accessibility',
    summary:
      'Zero third-party ad trackers, one-click chat history deletion, 100% client IP ownership upon full settlement, respectful cohort conduct, and keyboard/reduced-motion accessibility.',
    content:
      `KR8 DIGITALS Legal & Trust Standards: (1) Privacy Policy (/privacy): Only information voluntarily shared for inquiries, applications, referrals, or RIYA assistance is stored; zero third-party ad networks; personal data is never sold; chat history on your device can be cleared anytime via the Delete icon in RIYA, and full data erasure requests can be sent to ${navCfg.companyEmail}. (2) Terms of Service (/terms): Commercial work is governed by written scopes and fixed milestones; clients receive full IP and codebase ownership once invoices are paid in full; ecosystem programs require mutual respect and zero harassment; referral commissions apply strictly to net paid client invoices excluding self-referrals. (3) Accessibility (/accessibility): Semantic keyboard navigation, skip-to-content links, high-contrast obsidian typography scalable to 200%, prefers-reduced-motion support, and captioned vertical videos.`,
    audience: 'Clients, learners, compliance reviewers, and privacy-conscious visitors',
    purpose: 'Communicate transparent legal, privacy, IP, and accessibility commitments',
    actions: ['Read Privacy Policy (/privacy)', 'Read Terms (/terms)', 'Read Accessibility (/accessibility)'],
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility Statement', href: '/accessibility' },
    ],
    keywords: ['privacy', 'data', 'delete', 'terms', 'ownership', 'intellectual property', 'ip', 'refund', 'conduct', 'accessibility', 'cookies'],
    questions: [
      'How does KR8 DIGITALS protect my privacy and chat data?',
      'Can I delete my conversation with RIYA?',
      'Who owns the intellectual property and source code after a project is paid for?',
      'What are KR8 DIGITALS Terms of Service?',
      'What accessibility features does the KR8 DIGITALS website support?',
    ],
    relevance: 1.2,
  });

  add({
    id: 'kb-website-routes-navigation',
    category: 'website_functionality',
    route: '/',
    source: 'Complete Sitemap & Navigation Audit',
    topicKey: 'website_navigation',
    title: 'Complete Website Map, Navigation Menus, Forms & Interactive Tools',
    summary:
      'Guide to every page, header menu item, KR8 network switcher, interactive showcase, calculator, and form across the KR8 DIGITALS website.',
    content:
      `Complete guide to navigating KR8 DIGITALS: Primary Header Links: ${navCfg.headerLinks
        .filter((l) => l.visible !== false)
        .map((l) => `${l.label} (${l.href})`)
        .join(', ')}, plus the "KR8 network" switcher linking KR8 Digitals (/), KR8 Academy (https://academy.kr8digitals.com), and KR8 DIGITALS TRIBE (/tribe), and the primary CTA "${navCfg.ctaLabel}" (${navCfg.ctaHref}). Interactive tools on the website include: Live Website/Branding/Flyer/Video Showcase filters (/services), Interactive Referral Commission Calculator & Instant Code Generator (/referrals), Referrer Earnings Lookup (/referrals/dashboard), Partnership Proposal Form (/partners#propose), Multi-purpose Brief/Team/Tribe/Mindset RSVP Forms (/contact, /about/join-the-team, /tribe, /programs/mindset-shift/invite), and RIYA — your context-aware AI representative with text & voice support.`,
    audience: 'Visitors looking for a specific page, button, dashboard, or form',
    purpose: 'Help visitors navigate directly to any feature or portal on the platform',
    actions: ['Use quick links inside RIYA to jump directly to any page'],
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Programs', href: '/programs' },
      { label: 'Partners', href: '/partners' },
      { label: 'Referrals', href: '/referrals' },
    ],
    keywords: ['navigate', 'menu', 'pages', 'where is', 'find', 'login', 'dashboard', 'portal', 'form', 'buttons', 'riya'],
    questions: [
      'Where do students log in or access the student dashboard?',
      'Where is the referral dashboard?',
      'What pages and tools are available on the KR8 DIGITALS website?',
      'Who is RIYA and what can RIYA help me do on this website?',
    ],
    relevance: 1.2,
  });

  add({
    id: 'kb-student-portal-login-clarification',
    category: 'frequently_asked_questions',
    route: '/programs',
    source: 'Ecosystem Architecture Audit',
    topicKey: 'portals_and_dashboards',
    title: 'Where Students, Referrers & Administrators Access Their Portals',
    summary:
      'Students apply, log in, track XP/cohorts, and verify KR8 IDs on https://academy.kr8digitals.com; Referrers look up earnings by code on /referrals/dashboard; Studio administrators manage the CMS at /admin.',
    content:
      `Portal guide across the KR8 DIGITALS ecosystem: (1) Student Portal & Admissions: Hosted on KR8 Academy at https://academy.kr8digitals.com (Applications: /apply, Admissions info: /admissions, Certificate & KR8 ID verification: /verify). (2) Referrer Dashboard: Accessible without a password using your unique referral code at /referrals/dashboard (or sign up for a new code at /referrals). (3) Studio Administrative Console (/admin): Restricted exclusively to authorized KR8 DIGITALS administrators for CMS publishing, partner proposal review, lead management, and RIYA intelligence governance.`,
    audience: 'Students looking for login, referrers checking commissions, and general visitors',
    purpose: 'Prevent confusion between the corporate site, KR8 Academy student portal, and referrer dashboard',
    actions: [
      'Open KR8 Academy Student Portal (https://academy.kr8digitals.com)',
      'Open Referrer Dashboard (/referrals/dashboard)',
    ],
    links: [
      { label: 'KR8 Academy Portal ↗', href: 'https://academy.kr8digitals.com', outbound: true },
      { label: 'Referrer Dashboard', href: '/referrals/dashboard' },
    ],
    keywords: ['login', 'log in', 'sign in', 'student dashboard', 'portal', 'account', 'dashboard', 'password'],
    questions: [
      'How do I log in to my student dashboard?',
      'Where is the KR8 Academy student portal?',
      'Do I need an account or password to use the KR8 DIGITALS website?',
      'How do I access my referral dashboard?',
    ],
    relevance: 1.3,
  });

  add({
    id: 'kb-governance-admin-public-boundary',
    category: 'administrative_information',
    route: '/',
    source: 'Security & Governance Charter',
    topicKey: 'governance_security',
    title: 'Public Verification vs Confidential Studio Data',
    summary:
      'RIYA shares only verified public KR8 DIGITALS information and never exposes internal credentials, private student records, or other visitors’ conversations.',
    content:
      `KR8 DIGITALS enforces strict separation between public organizational knowledge and confidential internal records. All public claims, service scopes, program rules, and CMS updates synchronized into RIYA are verified by authorized studio leadership. Private student records, internal administrative notes, credentials, and other visitors' conversations are strictly protected and never accessible through public chat.`,
    audience: 'Security-conscious clients, students, and auditors',
    purpose: 'Document data boundary and governance model',
    actions: ['Read Privacy Policy (/privacy)'],
    links: [{ label: 'Privacy Policy', href: '/privacy' }],
    keywords: ['security', 'confidential', 'governance', 'verified', 'authentic', 'official'],
    questions: [
      'How do I know the information RIYA gives me is official and up to date?',
      'Are my conversations with RIYA private from other website visitors?',
    ],
    relevance: 1.05,
  });

  // -----------------------------------------------------------------------
  // 10. DYNAMIC CMS CUSTOM PAGES & ADMIN-APPROVED CUSTOM KNOWLEDGE RECORDS
  // -----------------------------------------------------------------------
  for (const p of pages) {
    if (p.isSystem) continue;
    const secText = (p.sections || [])
      .map((s) => `${s.title}: ${s.body || ''} ${(s.items || []).map((i) => `${i.title} — ${i.body}`).join('; ')}`)
      .join(' ');
    add({
      id: `kb-cms-page-${p.id}`,
      category: 'general_organizational_information',
      route: `/${p.slug}`,
      source: `CMS Page (/${p.slug})`,
      topicKey: `cms_page_${p.slug}`,
      title: `${p.title} (/${p.slug})`,
      summary: p.heroLede || p.metaDescription || p.title,
      content: `${p.title} (/${p.slug}): ${p.heroTitle || ''} ${p.heroHighlight || ''}. ${p.heroLede || ''} ${secText}`.trim(),
      audience: 'Website visitors',
      purpose: `Provide synchronized live knowledge from CMS page /${p.slug}`,
      actions: [`Open /${p.slug}`],
      links: [{ label: p.title, href: `/${p.slug}` }],
      keywords: normalizeTokens(`${p.title} ${p.slug} ${p.heroTitle || ''} ${p.heroLede || ''}`),
      questions: [
        `What is the ${p.title} page about?`,
        `Tell me about ${p.title} at KR8 DIGITALS.`,
      ],
      relevance: 1.25,
    });
  }

  const contentBundle = await getEditableBundle();
  for (const [key, document] of Object.entries(contentBundle)) {
    if (!key.startsWith('app:') || key.includes('order') || key.includes('[...slug]')) continue;
    const route = '/' + key.replace(/^app:/, '').replace(/:page$/, '').replace(/^page$/, '').replace(/:/g, '/');
    const copy = [...Object.values(document.texts), JSON.stringify(document.blocks)].join(' ').slice(0, 22000);
    add({ id: `kb-editable-${key}`, category: 'general_organizational_information', route,
      source: `Admin Content: ${document.label}`, topicKey: key, title: document.label,
      summary: copy.slice(0, 250), content: copy, audience: 'Website visitors',
      purpose: 'Synchronize administrator-edited public content', actions: [`Open ${route}`],
      links: [{ label: 'Read official page', href: route }], keywords: normalizeTokens(copy).slice(0, 80), questions: [], relevance: 1.1 });
  }

  // Individual deployed portfolio sites as distinct retrievable knowledge records
  for (const siteItem of sitesSeed.sites) {
    add({
      id: `kb-site-${siteItem.slug}`,
      category: 'portfolio_and_proof',
      route: '/services/website-design',
      source: 'data/sites.json',
      topicKey: `portfolio_${siteItem.slug}`,
      title: `${siteItem.name} — ${siteItem.kind} (${siteItem.category})`,
      summary: `${siteItem.name} is a ${siteItem.status === 'live' ? 'live client platform' : 'ready-built platform by KR8 DIGITALS'} (${siteItem.kind}): ${siteItem.note}`,
      content: `${siteItem.name} (${siteItem.url}) is a ${siteItem.kind} web platform in the "${siteItem.category}" category engineered by KR8 DIGITALS. Status: ${
        siteItem.status === 'live'
          ? 'Live production client build running on its domain'
          : `Finished ready-to-rebrand build deployed by KR8 DIGITALS`
      }. Features delivered: ${siteItem.note}`,
      audience: `Clients in ${siteItem.category} (${siteItem.kind}) evaluating KR8 DIGITALS web builds`,
      purpose: `Document real capabilities demonstrated in ${siteItem.name}`,
      actions: [`Inspect ${siteItem.name} (${siteItem.url})`, 'Commission a similar website (/contact)'],
      links: [
        { label: `Open ${siteItem.name} ↗`, href: siteItem.url, outbound: true },
        { label: 'Website Service', href: '/services/website-design' },
      ],
      keywords: normalizeTokens(`${siteItem.name} ${siteItem.kind} ${siteItem.category} ${siteItem.note}`),
      questions: [
        `Tell me about the ${siteItem.name} website built by KR8 DIGITALS.`,
        `What features did KR8 DIGITALS build into ${siteItem.name}?`,
      ],
      relevance: 1.05,
    });
  }

  // Deep page-by-page & real-world advisory scenario knowledge
  for (const deepRec of buildDeepPageAndScenarioKnowledge()) {
    add(deepRec);
  }

  // Admin-added / Gap-resolved verified custom knowledge records
  for (const row of customRows) {
    if (row.status === 'archived') continue;
    const cat = (row.category as RiyaCategory) || 'frequently_asked_questions';
    add({
      id: row.id,
      category: RIYA_CATEGORY_LABELS[cat] ? cat : 'frequently_asked_questions',
      route: row.route || '/',
      source: row.source || 'Admin Verified Knowledge',
      topicKey: row.topicKey || `custom_${row.id}`,
      title: row.title || 'Verified KR8 DIGITALS Knowledge',
      summary: String(row.content || '').slice(0, 200),
      content: String(row.content || ''),
      audience: row.audience || 'All visitors',
      purpose: row.purpose || 'Administrator-verified knowledge entry',
      actions: [],
      links: Array.isArray(row.links) ? row.links : [{ label: 'Contact KR8 DIGITALS', href: '/contact' }],
      keywords: normalizeTokens(`${row.title || ''} ${row.content || ''} ${(row.questions || []).join(' ')}`),
      questions: Array.isArray(row.questions) && row.questions.length > 0 ? row.questions : [row.title],
      relevance: 1.4,
      isCustom: true,
    });
  }

  // -----------------------------------------------------------------------
  // BUILD COMPREHENSIVE GROUNDED Q&A PAIRS COLLECTION
  // -----------------------------------------------------------------------
  const qaPairs: RiyaQaPair[] = [];
  const seenQuestions = new Set<string>();

  const pushQa = (rec: RiyaKnowledgeRecord, q: string, customAns?: string) => {
    const normQ = q.trim().toLowerCase();
    if (!normQ || seenQuestions.has(normQ)) return;
    seenQuestions.add(normQ);
    qaPairs.push({
      id: `qa-${qaPairs.length + 1}`,
      recordId: rec.id,
      category: rec.category,
      route: rec.route,
      topicKey: rec.topicKey,
      question: q.trim(),
      answer: customAns || rec.content,
      links: rec.links,
      verifiedAt: nowIso,
    });
  };

  for (const rec of records) {
    for (const q of rec.questions) {
      pushQa(rec, q);
    }
  }

  // Route-by-route analytical coverage summary
  const ALL_ANALYZED_ROUTES: { route: string; title: string }[] = [
    { route: '/', title: 'Homepage' },
    { route: '/about', title: 'About KR8 DIGITALS (Hero & Problem-Solver Story)' },
    { route: '/about/timfire', title: 'Founder Profile — Timfire (Kenneth Timothy Iziogo)' },
    { route: '/about/steveoking', title: 'Co-Founder Profile — Steveoking (Stevenson)' },
    { route: '/about/creative-expression', title: 'Co-Founder Profile — Creative Expression (Daniel Akachukwu Augustine)' },
    { route: '/about/join-the-team', title: 'Join the Studio Team Pathway' },
    { route: '/services', title: 'Commercial Services Hub' },
    { route: '/services/website-design', title: 'Website Design & Development' },
    { route: '/services/branding', title: 'Branding & Visual Identity Systems' },
    { route: '/services/graphic-design', title: 'Commercial Graphic Design' },
    { route: '/services/video-editing', title: 'Video Editing & Narrative Post-Production' },
    { route: '/services/seo', title: 'Technical & Local SEO Optimization' },
    { route: '/services/ai-automation', title: 'AI Agent & Workflow Automation' },
    { route: '/programs', title: 'Ecosystem Programs Hub' },
    { route: '/programs#free-training', title: 'Free Digital Skills & Academic Training (KR8 Academy)' },
    { route: '/tribe', title: 'KR8 DIGITALS TRIBE Community' },
    { route: '/programs/mindset-shift/invite', title: 'Mindset Shift Leadership Forum & Invite' },
    { route: '/partners', title: 'Partnerships & Proposal Portal' },
    { route: '/partners/motionverse', title: 'Partner Chapter — Motionverse' },
    { route: '/partners/chigoma', title: 'Partner Chapter — Chigoma' },
    { route: '/partners/next-gen-scholars', title: 'Partner Chapter — Next Gen Scholars' },
    { route: '/referrals', title: 'Referral Network, Calculator & Signup' },
    { route: '/referrals/dashboard', title: 'Referrer Earnings & Attribution Dashboard' },
    { route: '/r/[code]', title: 'Referral Attribution Landing Route' },
    { route: '/contact', title: 'Project Brief & Direct Contact Hub' },
    { route: '/order/[ref]', title: 'Signed Order Lookup & Settlement' },
    { route: '/privacy', title: 'Privacy Policy & Data Rights' },
    { route: '/terms', title: 'Terms of Service & IP Ownership' },
    { route: '/accessibility', title: 'Accessibility Engineering Statement' },
    { route: '/admin', title: 'Executive CMS & RIYA Intelligence Console' },
    ...pages.filter((p) => !p.isSystem).map((p) => ({ route: `/${p.slug}`, title: p.title })),
  ];

  // Ensure every single analyzed route also has explicit contextual Q&A coverage ("What is this page about?", "What can I do on [route]?")
  for (const r of ALL_ANALYZED_ROUTES) {
    const matching = records.filter((rec) => rec.route === r.route);
    const primary = matching[0] || records[0];
    if (primary) {
      pushQa(primary, `What is the ${r.title} page (${r.route}) about?`, `${r.title} (${r.route}): ${primary.summary}`);
      pushQa(primary, `Who should visit ${r.route} on KR8 DIGITALS?`, `${r.title} (${r.route}) serves: ${primary.audience}. Purpose: ${primary.purpose}.`);
      pushQa(primary, `What actions can I take on ${r.route}?`, `On ${r.title} (${r.route}), you can: ${primary.actions.join('; ') || 'explore verified information and connect with KR8 DIGITALS'}.`);
    }
  }

  const pagesAnalyzed = ALL_ANALYZED_ROUTES.map((r) => ({
    route: r.route,
    title: r.title,
    recordCount: records.filter((x) => x.route === r.route).length || 1,
    qaCount: qaPairs.filter((x) => x.route === r.route).length,
  }));

  return { records, qaPairs, pagesAnalyzed };
}

/* =========================================================================
   IN-MEMORY BM25F + CHARACTER TRIGRAM INDEXER & AUTO-SYNC CONTROLLER
   ========================================================================= */
async function computeCmsFingerprint(): Promise<string> {
  const [pages, services, programs, team, partners, nav, seo, custom, contentRows] = await Promise.all([
    getCmsPages({ includeDrafts: false }),
    getCmsServices({ includeDrafts: false }),
    getCmsPrograms({ includeDrafts: false }),
    getCmsTeam({ includeDrafts: false }),
    getCmsPartners({ includeDrafts: false }),
    getCmsNavigation(),
    getCmsSeoAll(),
    store.all('riya_kb_custom', 1000),
    store.all('settings', 1000),
  ]);
  return crypto
    .createHash('sha256')
    .update(JSON.stringify({ pages, services, programs, team: team.all, partners, nav, seo, custom, contentRows }))
    .digest('hex')
    .slice(0, 24);
}

export async function syncRiyaKnowledgeBase(trigger = 'auto_cms_watch'): Promise<RiyaKnowledgeSnapshot> {
  const started = Date.now();
  try {
    const fingerprint = await computeCmsFingerprint();
    if (cachedSnapshot && cachedSnapshot.fingerprint === fingerprint && trigger === 'auto_cms_watch') {
      return cachedSnapshot;
    }

    const prevLogs = await store.all('riya_sync_log', 5);
    const prevVersion = prevLogs[0]?.version ? Number(prevLogs[0].version) : currentVersion - 1;
    const nextVersion = cachedSnapshot ? cachedSnapshot.version + 1 : Math.max(1, prevVersion + (trigger === 'manual_admin_sync' ? 1 : 0));
    currentVersion = nextVersion;

    const { records, qaPairs, pagesAnalyzed } = await extractAllVerifiedKnowledge(nextVersion);

    const invertedIndex = new Map<string, Set<number>>();
    const trigramIndex = new Map<string, Set<number>>();
    const docLengths: number[] = [];

    records.forEach((rec, idx) => {
      const fullText = `${rec.title} ${rec.title} ${rec.summary} ${rec.content} ${rec.keywords.join(' ')} ${rec.questions.join(' ')}`;
      const toks = normalizeTokens(fullText);
      docLengths.push(toks.length || 1);
      for (const tok of toks) {
        let bucket = invertedIndex.get(tok);
        if (!bucket) {
          bucket = new Set();
          invertedIndex.set(tok, bucket);
        }
        bucket.add(idx);
      }

      const triSource = `${rec.title} ${rec.keywords.join(' ')} ${rec.topicKey}`;
      for (const tri of extractCharTrigrams(triSource)) {
        let bucket = trigramIndex.get(tri);
        if (!bucket) {
          bucket = new Set();
          trigramIndex.set(tri, bucket);
        }
        bucket.add(idx);
      }
    });

    const avgDocLength =
      docLengths.reduce((acc, n) => acc + n, 0) / Math.max(1, docLengths.length);

    const categoryCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    for (const r of records) {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      sourceCounts[r.source] = (sourceCounts[r.source] || 0) + 1;
    }

    const syncedAt = new Date().toISOString();
    cachedSnapshot = {
      version: nextVersion,
      fingerprint,
      syncedAt,
      records,
      qaPairs,
      pagesAnalyzed,
      categoryCounts,
      sourceCounts,
      invertedIndex,
      trigramIndex,
      docLengths,
      avgDocLength,
    };

    // Record sync event when initialized or changed
    if (prevLogs.length === 0 || prevLogs[0]?.fingerprint !== fingerprint || trigger !== 'auto_cms_watch') {
      await store.insert('riya_sync_log', {
        id: newId('sync_'),
        version: nextVersion,
        fingerprint,
        trigger,
        totalKnowledgeRecords: records.length,
        totalQaRecords: qaPairs.length,
        categoriesCount: Object.keys(categoryCounts).length,
        pagesAnalyzed: pagesAnalyzed.length,
        status: 'success',
        durationMs: Date.now() - started,
      });
    }

    return cachedSnapshot;
  } catch (err: any) {
    await store.insert('riya_sync_log', {
      id: newId('sync_'),
      version: currentVersion,
      trigger,
      status: 'failed',
      error: err?.message || 'Unknown synchronization error',
      durationMs: Date.now() - started,
    });
    if (cachedSnapshot) return cachedSnapshot;
    throw err;
  }
}

export async function getRiyaKnowledgeSnapshot(): Promise<RiyaKnowledgeSnapshot> {
  return syncRiyaKnowledgeBase('auto_cms_watch');
}

export function invalidateRiyaKnowledgeCache() {
  cachedSnapshot = null;
}
