import type { RiyaCategory, RiyaKnowledgeRecord, RiyaLink } from './riya-knowledge';

type SeedKnowledgeInput = Omit<
  RiyaKnowledgeRecord,
  'categoryLabel' | 'verifiedAt' | 'version'
>;

/**
 * Exhaustive Page-by-Page, Commercial, Sponsor, Buyer, Student & Advisory Corpus
 * ------------------------------------------------------------------------------
 * Written in crisp, direct, human conversational language grounded 100% in
 * verified KR8 DIGITALS services, live sites, partner tracks, and policies.
 */
export function buildDeepPageAndScenarioKnowledge(): SeedKnowledgeInput[] {
  const out: SeedKnowledgeInput[] = [];

  const PAGE_DEEP_DIVES: {
    route: string;
    name: string;
    category: RiyaCategory;
    purpose: string;
    whoItServes: string;
    accomplish: string;
    buttonsAndActions: string[];
    misconceptionsClarified: string;
    connections: string;
    links: RiyaLink[];
    extraQuestions: string[];
  }[] = [
    {
      route: '/',
      name: 'Homepage',
      category: 'website_functionality',
      purpose:
        'Introduce KR8 DIGITALS, showcase live client websites, flyers, and videos, introduce the founders (Timfire, Steveoking, Creative Expression), and route visitors cleanly between hiring for a project or learning for free.',
      whoItServes:
        'First-time visitors, business decision-makers, prospective KR8 Academy learners, partners, and referrers.',
      accomplish:
        'Inspect live websites (including 18 ready-built sites available to buy and 4 live client domains), explore commercial craft vs free education, meet the founders, or jump straight to /contact or academy.kr8digitals.com.',
      buttonsAndActions: [
        '"Work with us" -> opens /contact project brief form',
        '"Learn free" -> opens https://academy.kr8digitals.com in a new tab',
        '"KR8 network" header dropdown -> switches between KR8 Digitals, KR8 Academy, and KR8 DIGITALS TRIBE',
        '"Ask RIYA" floating launcher -> opens context-aware AI representative',
      ],
      misconceptionsClarified:
        'Visitors sometimes assume KR8 DIGITALS is either only a paid agency or only a free school; the homepage shows both operate side by side under one company.',
      connections: 'Connects directly to /about, /services, /programs, /partners, /referrals, /tribe, and /contact.',
      links: [
        { label: 'Visit Homepage', href: '/' },
        { label: 'Work With Us', href: '/contact' },
      ],
      extraQuestions: [
        'What can I do on the KR8 DIGITALS homepage?',
        'What does the KR8 network button in the top navigation bar do?',
        'Where does the "Learn free" button on the homepage take me?',
      ],
    },
    {
      route: '/about',
      name: 'About Page',
      category: 'organizational_identity',
      purpose:
        'Invite visitors into the KR8 DIGITALS story ("We are writing a story, and you can be a big part of it") and articulate our core identity as collaborative problem solvers ("We are problem solvers — uniting distinct minds to solve what no one can solve alone").',
      whoItServes:
        'Clients vetting the company, prospective learners, partners, sponsors, and talent exploring who stands behind KR8 DIGITALS.',
      accomplish:
        'Read Our Story and problem-solving philosophy, review verified company metrics (200+ works, 100+ clients, 3 partners, 20+ team members), compare Commercial Craft vs Human Capacity engines, and meet the 3 founders and leadership team.',
      buttonsAndActions: [
        '"Work With Us" -> /contact',
        '"Explore Services" -> /services',
        '"Meet the Founders" -> scrolls to #founders with links to /about/timfire, /about/steveoking, /about/creative-expression',
      ],
      misconceptionsClarified:
        'KR8 DIGITALS is not a middleman outsourcing agency; the practitioners leading engineering, brand, graphic design, and film actively build client work and mentor learners.',
      connections: 'Links to /about/timfire, /about/steveoking, /about/creative-expression, /about/join-the-team, /services, /programs, and /partners.',
      links: [{ label: 'Open About Page', href: '/about' }],
      extraQuestions: [
        'What is the main message on the KR8 DIGITALS About page?',
        'How does KR8 DIGITALS describe its approach to solving problems?',
      ],
    },
    {
      route: '/services',
      name: 'Commercial Services Hub',
      category: 'services',
      purpose:
        'Present all 6 paid commercial disciplines (Website Design & Development, Branding, Graphic Design, Video Editing, SEO Optimization, and AI Agent & Automation) with a diagnostic problem-to-service matcher and live portfolio proof.',
      whoItServes:
        'Businesses, schools, hotels, clinics, startups, NGOs, and executives commissioning professional digital work.',
      accomplish:
        'Match a business problem to the right service, inspect live websites/branding/flyers/videos/AI systems, and open dedicated service pages or request a written scope.',
      buttonsAndActions: [
        '"Request a Written Scope" -> /contact',
        '"Compare All 6 Services" -> scrolls to #service-matrix',
        'Service cards -> /services/website-design, /services/branding, /services/graphic-design, /services/video-editing, /services/seo, /services/ai-automation',
      ],
      misconceptionsClarified:
        'Branding and Graphic Design are distinct disciplines: Branding defines your lasting identity and guidelines, while Graphic Design delivers campaign flyers, posters, and social key art.',
      connections: 'Connects to all 6 /services/[slug] detail pages and /contact.',
      links: [{ label: 'Explore Services Hub', href: '/services' }],
      extraQuestions: [
        'Which service should I pick if my business website is slow or not converting?',
        'Where can I compare all KR8 DIGITALS commercial services side by side?',
      ],
    },
    {
      route: '/programs',
      name: 'Ecosystem Programs Hub',
      category: 'programs',
      purpose:
        'Present KR8 DIGITALS’ four human-capacity initiatives — Free Digital Skills & Academic Training, KR8 DIGITALS TRIBE, Mindset Shift, and Join the Team — while distinguishing them cleanly from paid commercial services.',
      whoItServes:
        'Aspiring learners, secondary/pre-university students, self-taught creatives, young founders, and practitioners seeking studio roles.',
      accomplish:
        'Identify which program fits your stage, check honest availability badges, explore the 7 KR8 Academy tracks and Next Gen Scholars WAEC/JAMB door, and jump directly to apply or RSVP.',
      buttonsAndActions: [
        '"Explore KR8 Academy" -> https://academy.kr8digitals.com',
        '"Compare All 4 Programs" -> scrolls to #program-lineup',
        'Program CTAs -> https://academy.kr8digitals.com/apply, /tribe, /programs/mindset-shift/invite, /about/join-the-team',
      ],
      misconceptionsClarified:
        'None of our educational or community programs charge tuition or admission fees.',
      connections: 'Connects to academy.kr8digitals.com, /tribe, /programs/mindset-shift/invite, /about/join-the-team, and /partners/next-gen-scholars.',
      links: [{ label: 'Open Programs Page', href: '/programs' }],
      extraQuestions: [
        'What is the Programs page on KR8 DIGITALS about?',
        'How do I know which KR8 DIGITALS program fits me best?',
      ],
    },
    {
      route: '/partners',
      name: 'Strategic Partnerships & Sponsorship Page',
      category: 'partnership_opportunities',
      purpose:
        'Detail mutual benefits across 4 collaboration tracks (Specialist Studios, Education & Schools, Sponsors & Foundations, Agencies & Enterprises), showcase active partners (Motionverse, Chigoma, Next Gen Scholars), and capture Partnership & Sponsorship Proposals.',
      whoItServes:
        'Corporate CSR sponsors, foundations, donors, creative studios, schools, universities, NGOs, and agencies.',
      accomplish:
        'See exactly what partners and sponsors receive in return, review our co-branding commitment, and submit a formal Partnership or Sponsorship Proposal via #propose.',
      buttonsAndActions: [
        '"Propose a Partnership" -> scrolls to #propose PartnershipProposalForm',
        '"Meet Active Partners" -> scrolls to #existing-partners',
        '"Submit Partnership Proposal" -> POSTs to /api/partners/propose and alerts leadership in /admin',
      ],
      misconceptionsClarified:
        'Partnering or sponsoring never erases your brand — KR8 DIGITALS gives full public credit and documented charters.',
      connections: 'Connects to /partners/motionverse, /partners/chigoma, /partners/next-gen-scholars, and /admin.',
      links: [
        { label: 'Explore Partnerships & Sponsorship', href: '/partners' },
        { label: 'Submit a Proposal', href: '/partners#propose' },
      ],
      extraQuestions: [
        'What happens when I submit the Partnership Proposal form on /partners?',
        'What information is required to propose a partnership with KR8 DIGITALS?',
      ],
    },
    {
      route: '/referrals',
      name: 'Referral Network & Commission Calculator',
      category: 'referral_opportunities',
      purpose:
        'Let anyone calculate referral commissions (8%–12%), register in 30 seconds for a unique code, and share an attributed /r/[code] link.',
      whoItServes:
        'Students, alumni, freelancers, consultants, community connectors, and satisfied clients.',
      accomplish:
        'Calculate commissions in real time, generate a personal referral code immediately, and learn payout rules.',
      buttonsAndActions: [
        'Interactive Referral Calculator -> computes 10% / 8% / 12% commissions',
        'Referral Registration Form -> issues a unique code + /r/[code] share URL',
        '"Open Referrer Dashboard" -> /referrals/dashboard',
      ],
      misconceptionsClarified:
        'Registration is 100% free and requires zero technical skills; commissions credit once the referred client settles their invoice.',
      connections: 'Connects to /referrals/dashboard, /r/[code], and /contact.',
      links: [
        { label: 'Referral Program & Signup', href: '/referrals' },
        { label: 'Referrer Dashboard', href: '/referrals/dashboard' },
      ],
      extraQuestions: [
        'How do I get my own referral link on KR8 DIGITALS?',
        'How does the referral calculator on /referrals work?',
      ],
    },
    {
      route: '/referrals/dashboard',
      name: 'Referrer Earnings & Attribution Dashboard',
      category: 'referral_opportunities',
      purpose:
        'Allow registered referrers to enter their referral code and inspect real-time clicks, attributed leads, pending commissions, and paid settlements.',
      whoItServes: 'Registered KR8 DIGITALS referral partners.',
      accomplish: 'Track referral clicks, leads, and payouts instantly using your referral code.',
      buttonsAndActions: [
        'Referral Code Lookup Input -> loads live metrics from /api/referrals?code=...',
        'Copy Referral Link button -> copies your /r/[code] URL',
      ],
      misconceptionsClarified: 'No password account is needed — your referral code unlocks your live attribution ledger.',
      connections: 'Connects to /referrals and /contact.',
      links: [{ label: 'Open Referrer Dashboard', href: '/referrals/dashboard' }],
      extraQuestions: [
        'How do I check how many people clicked my referral link?',
        'Do I need a password to check the Referrer Dashboard?',
      ],
    },
    {
      route: '/contact',
      name: 'Contact & Project Brief Page',
      category: 'customer_support',
      purpose:
        'Provide a fast, zero-friction channel to request a written project quote, buy a ready-made site, or reach the studio via WhatsApp or email.',
      whoItServes: 'Prospective clients, sponsors, partners, and learners.',
      accomplish: 'Submit a plain-English project brief and receive a human reply within 1 business day.',
      buttonsAndActions: [
        '"Send the brief" -> submits LeadForm to /api/leads',
        'Direct WhatsApp CTA -> opens wa.me/2348125687509',
      ],
      misconceptionsClarified:
        'You do not need a formal technical RFP — describing your goal in plain English is enough to get a fixed written scope.',
      connections: 'Linked across all service pages, header, footer, and RIYA.',
      links: [{ label: 'Contact KR8 DIGITALS', href: '/contact' }],
      extraQuestions: [
        'Do I need a detailed technical specification before contacting KR8 DIGITALS?',
        'How quickly does KR8 DIGITALS respond after I submit the contact form?',
      ],
    },
  ];

  for (const p of PAGE_DEEP_DIVES) {
    out.push({
      id: `kb-deep-${p.route.replace(/[^a-z0-9]+/gi, '-') || 'home'}`,
      category: p.category,
      route: p.route,
      source: `Exhaustive Route Audit (${p.route})`,
      topicKey: `route_${p.route}`,
      title: `${p.name} (${p.route}) — Purpose, Actions & Clarifications`,
      summary: p.purpose,
      content: `${p.purpose} It serves ${p.whoItServes.toLowerCase()} Key actions on ${p.route}: ${p.buttonsAndActions.join('; ')}. Clarification: ${p.misconceptionsClarified}`,
      audience: p.whoItServes,
      purpose: p.purpose,
      actions: p.buttonsAndActions,
      links: p.links,
      keywords: p.name.toLowerCase().split(/\W+/).filter(Boolean),
      questions: p.extraQuestions,
      relevance: 1.12,
    });
  }

  /* =========================================================================
     HIGH-SIGNAL COMMERCIAL, SPONSOR, BUYER, STUDENT & REAL-WORLD SCENARIOS
     ========================================================================= */
  const SCENARIO_RECORDS: {
    id: string;
    category: RiyaCategory;
    route: string;
    topicKey: string;
    title: string;
    content: string;
    links: RiyaLink[];
    keywords: string[];
    questions: string[];
    relevance?: number;
  }[] = [
    // 1. BESTSELLERS / MOST POPULAR / FLAGSHIP OFFERINGS & READY-TO-BUY WEBSITES
    {
      id: 'kb-scen-bestsellers-flagship',
      category: 'services',
      route: '/services',
      topicKey: 'bestsellers_and_flagships',
      title: 'KR8 DIGITALS Bestsellers, Most Popular Services & Ready-to-Buy Websites',
      content:
        'Our **bestsellers** at KR8 DIGITALS span both custom studio builds and ready-built websites you can buy right away:\n\n• **#1 Custom Bestseller — Website Design & Full-Stack Development:** Fast, conversion-engineered websites and portals for hotels, hospitals, schools, restaurants, and corporate brands (22 deployed platforms and counting).\n• **Brand Identity & Commercial Flyers:** Complete visual identity systems led with **Motionverse** (Steveoking), plus high-converting retail, product, and event flyers.\n• **Retention-Cut Video Editing:** Short-form reels, documentaries, and launch films cut with **Chigoma** (Creative Expression).\n• **Ready-Built Websites for Immediate Purchase (18 Live Sites):** Pre-engineered, live-previewable platforms ready to customize with your brand — priced transparently at **$450** (boutique hotels, cafés, fast-food & AI form routers), **$900** (full resort/hotel estates, restaurant-bakeries & digital schools), and **$1,900** (comprehensive STEM championship + past-questions + admin portal).',
      links: [
        { label: 'Explore Services & Live Showcase', href: '/services' },
        { label: 'Buy or Commission a Website', href: '/contact' },
      ],
      keywords: [
        'bestseller',
        'bestsellers',
        'best seller',
        'best sellers',
        'top seller',
        'most popular',
        'popular',
        'flagship',
        'most requested',
        'top service',
        'best service',
        'selling',
        'hot',
        'featured',
      ],
      questions: [
        'bestsellers',
        'What are your bestsellers?',
        'What is your most popular service at KR8 DIGITALS?',
        'Which services or products do clients buy the most?',
        'What are your flagship offerings?',
        'What sells the most at KR8 DIGITALS?',
        'Which package is most popular for businesses?',
      ],
      relevance: 1.55,
    },

    // 2. READY-BUILT / FOR-SALE WEBSITES CATALOGUE ($450 / $900 / $1,900)
    {
      id: 'kb-scen-ready-built-for-sale-sites',
      category: 'portfolio_and_proof',
      route: '/services/website-design',
      topicKey: 'ready_built_sites_for_sale',
      title: 'Ready-Built Websites Available for Immediate Purchase ($450 – $1,900)',
      content:
        'Beyond custom from-scratch builds, KR8 DIGITALS offers **18 finished, deployed websites available to purchase and brand immediately**:\n\n• **$450 Turnkey Sites (7 platforms):** *House Ten Hotel*, *Kamojama Villa*, *Cecilia Exclusive Palace*, *Nourisha* (fast food), *HydePark Delights* (café), *Native Delicacies* (restaurant & bar), and *Jev Form Router* (AI lead/issue router).\n• **$900 Full-Feature Sites (10 platforms):** *Cirenes Hotels*, *Salt Lake Hotels*, *Monabliss Hotels*, *Galaxy La-Palm Royal Resort*, *Adig Suites*, *Xenia Essence*, *Vegas Restaurant & Bakery*, *Tastia*, *AFRISTEM Digital Science School*, and *30 Days Consistency Drill*.\n• **$1,900 Enterprise Portal (1 platform):** *Prime STEM Nigeria* (championship registration, past-questions library, academic calendar, and admin console).\n\nEvery site is live so you can click through it before buying, and we adapt the branding, domain, and copy to your business.',
      links: [
        { label: 'Preview Live Websites', href: '/#work' },
        { label: 'Purchase or Customize a Site', href: '/contact' },
      ],
      keywords: [
        'for sale',
        'forsale',
        'ready built',
        'readybuilt',
        'prebuilt',
        'templates',
        'template',
        'buy a website',
        'turnkey',
        '450',
        '900',
        '1900',
        'hotel website',
        'restaurant website',
      ],
      questions: [
        'Do you have ready-made websites for sale?',
        'Can I buy an existing website template from KR8 DIGITALS?',
        'How much are your ready-built hotel and restaurant websites?',
        'What websites do you currently have for sale?',
      ],
      relevance: 1.48,
    },

    // 3. SPONSORING KR8 DIGITALS — WHAT SPONSORS & DONORS GET IN RETURN
    {
      id: 'kb-scen-sponsoring-benefits',
      category: 'partnership_opportunities',
      route: '/partners',
      topicKey: 'sponsorship_benefits',
      title: 'What You Get for Sponsoring KR8 DIGITALS (Sponsor & CSR Benefits)',
      content:
        'When you or your organisation **sponsor KR8 DIGITALS** (under **Track 03 · Sponsors & Foundations** on `/partners`), here is specifically what you receive in return:\n\n• **Full Public Brand Attribution & Co-Branding:** Your company, foundation, or personal name receives prominent sponsor credit across sponsored KR8 Academy cohorts, learning materials, and co-convened **Mindset Shift** editions — we never hide or erase sponsor identity.\n• **Direct, Measurable Youth & Talent Impact:** Your sponsorship funds concrete needs — student data stipends, learning laptops/equipment, or dedicated tuition-free seats in KR8 Academy and Next Gen Scholars WAEC/JAMB prep.\n• **Verified Shipped-Work Impact Reports:** Instead of vague vanity numbers, you receive transparent impact documentation tied to real student graduation IDs, completed projects, and verifiable portfolios.\n• **First-Look Access to Top Emerging Talent:** Early introductions to disciplined, job-ready graduates in web development, graphic design, video editing, and digital marketing — formalized under a **Written Charter** with KR8 DIGITALS leadership.',
      links: [
        { label: 'Submit a Sponsorship Proposal', href: '/partners#propose' },
        { label: 'Explore Partnership Tracks', href: '/partners' },
      ],
      keywords: [
        'sponsor',
        'sponsoring',
        'sponsorship',
        'sponsors',
        'csr',
        'donate',
        'donation',
        'donor',
        'fund',
        'funding',
        'foundation',
        'philanthropy',
        'stipend',
        'what do i get',
        'benefits of sponsoring',
        'sponsor benefits',
      ],
      questions: [
        'What do I get for sponsoring KR8 DIGITALS?',
        'What are the benefits of sponsoring KR8 Academy or KR8 DIGITALS?',
        'How can my company or foundation sponsor students at KR8 DIGITALS?',
        'Can I donate laptops, data stipends, or scholarships to KR8 Academy?',
        'Do sponsors get brand visibility and impact reports?',
        'CSR sponsorship opportunities at KR8 DIGITALS',
      ],
      relevance: 1.58,
    },

    // 4. WHITE-LABEL, AGENCY & STUDIO PARTNERSHIP BENEFITS (TRACKS 01, 02, 04)
    {
      id: 'kb-scen-white-label-and-school-partners',
      category: 'partnership_opportunities',
      route: '/partners',
      topicKey: 'agency_and_school_partnerships',
      title: 'Benefits for Agency White-Label Partners, Specialist Studios & Schools',
      content:
        'Depending on your organisation type, partnering with KR8 DIGITALS unlocks specific upside across our other collaboration tracks:\n\n• **Specialist Studios (Track 01):** Co-deliver larger multi-disciplinary client briefs alongside our engineers and editors while keeping **100% public credit** on your craft (just like Motionverse and Chigoma).\n• **Schools & Universities (Track 02):** Bring practical digital literacy bootcamps and verified certification cohorts to your students alongside academic excellence, and modernize your school’s own web/admissions platform.\n• **Agencies & Enterprises (Track 04):** Plug into KR8 DIGITALS as a reliable **co-branded or white-label execution partner** for web engineering, brand systems, SEO, and AI workflows with predictable written scopes and milestone handoffs.',
      links: [
        { label: 'Propose an Alliance', href: '/partners#propose' },
        { label: 'View Active Partners', href: '/partners#existing-partners' },
      ],
      keywords: [
        'white label',
        'whitelabel',
        'outsource',
        'subcontract',
        'agency partner',
        'school partnership',
        'university partnership',
        'co-brand',
      ],
      questions: [
        'Do you offer white-label web development or design for other agencies?',
        'How can a secondary school or university partner with KR8 DIGITALS?',
        'What do creative studios gain from partnering with KR8 DIGITALS?',
      ],
      relevance: 1.42,
    },

    // 5. TURNAROUND TIME / DELIVERY SPEED
    {
      id: 'kb-scen-turnaround-timelines',
      category: 'operational_processes',
      route: '/services',
      topicKey: 'turnaround_and_timelines',
      title: 'Project Turnaround Times & Delivery Speed at KR8 DIGITALS',
      content:
        'Delivery timelines at KR8 DIGITALS depend on the scope, and every project receives a locked schedule in writing before work begins:\n\n• **Ready-Built Websites (from our 18 finished platforms):** Fastest launch — customized with your branding, copy, and domain in **a few days**.\n• **Campaign Flyers & Social Key Art:** Typically **24–72 hours** depending on asset volume.\n• **Short-Form Video Reels:** Typically **2–5 business days** per edit cycle.\n• **Brand Identity Systems & Custom Websites / Portals:** Scoped into clear milestones (typically **2–6 weeks** depending on custom pages, booking flows, or integrations).\n\nStudio enquiries on `/contact` or WhatsApp receive a human response within **one business day**.',
      links: [
        { label: 'Request a Timeline & Scope', href: '/contact' },
        { label: 'Explore Services', href: '/services' },
      ],
      keywords: [
        'turnaround',
        'timeline',
        'how long',
        'how fast',
        'duration',
        'days',
        'weeks',
        'urgent',
        'rush',
        'deadline',
        'delivery time',
      ],
      questions: [
        'How long does it take KR8 DIGITALS to build a website?',
        'What is your turnaround time for flyers, branding, or video editing?',
        'Can you handle an urgent or fast-track project?',
        'How quickly can I launch a website with KR8 DIGITALS?',
      ],
      relevance: 1.44,
    },

    // 6. PAYMENT TERMS, CURRENCIES, MILESTONES, REVISIONS & CODE OWNERSHIP
    {
      id: 'kb-scen-payments-revisions-ownership',
      category: 'policies_and_requirements',
      route: '/terms',
      topicKey: 'payments_revisions_and_ownership',
      title: 'Payment Milestones, Currencies (USD/NGN), Revisions, Maintenance & Full Ownership',
      content:
        'Here is how commercial billing, revisions, and ownership work at KR8 DIGITALS:\n\n• **Milestone Billing & Currencies:** Custom projects are billed against **written fixed milestones** (never surprise hourly overruns) and can be settled in **USD or NGN**.\n• **Revisions & Quality Assurance:** Every milestone includes structured review cycles against the agreed written brief before sign-off.\n• **100% Client Ownership:** Upon final milestone settlement, **you own 100% of your custom website source code, domain, brand identity files, and final deliverables** — zero vendor lock-in.\n• **Post-Launch Support:** We provide clean deployment handover and can support ongoing updates, SEO growth, or feature expansions whenever needed.',
      links: [
        { label: 'Terms of Engagement', href: '/terms' },
        { label: 'Request a Written Scope', href: '/contact' },
      ],
      keywords: [
        'payment plan',
        'installment',
        'installments',
        'deposit',
        'milestone',
        'naira',
        'ngn',
        'usd',
        'dollars',
        'revisions',
        'refund',
        'own',
        'ownership',
        'code',
        'source code',
        'domain',
        'hosting',
        'maintenance',
      ],
      questions: [
        'Do you accept payment in installments or milestones?',
        'Can I pay in Naira (NGN) or US Dollars (USD)?',
        'Do I own the code after paying, and can I pay in Naira?',
        'Do I own the source code, domain, and design files after paying?',
        'How do revisions and post-launch maintenance work?',
        'What is your refund or revision policy?',
      ],
      relevance: 1.56,
    },

    // 7. DISCOUNTS, SMALL BUDGETS & STARTUP / NGO OPTIONS
    {
      id: 'kb-scen-budgets-and-discounts',
      category: 'operational_processes',
      route: '/contact',
      topicKey: 'budgets_and_affordable_options',
      title: 'Options for Tight Budgets, Startups, Schools & NGOs',
      content:
        'If you are working with a lean startup, school, or NGO budget, KR8 DIGITALS gives you two smart ways to keep costs controlled without sacrificing quality:\n\n1. **Choose a Ready-Built Platform ($450 or $900):** Instead of paying for a custom architecture from zero, pick one of our 18 already-engineered live sites and have us tailor it to your brand.\n2. **Phased Milestone Scope:** Tell us your target budget on `/contact` — we will advise honestly what matters most for Phase 1 so you launch a clean, high-converting foundation now and expand later.',
      links: [
        { label: 'Share Your Budget & Goal', href: '/contact' },
        { label: 'Browse Ready-Built Sites', href: '/#work' },
      ],
      keywords: ['discount', 'discounts', 'cheap', 'cheapest', 'affordable', 'small budget', 'low budget', 'promo', 'ngo rate', 'startup'],
      questions: [
        'Do you offer discounts for startups, schools, or NGOs?',
        'What is the most affordable way to get a website from KR8 DIGITALS?',
        'Can you work within my budget?',
      ],
      relevance: 1.4,
    },

    // 8. HOW IS KR8 ACADEMY FREE? ("WHAT'S THE CATCH?")
    {
      id: 'kb-scen-how-free-training-is-funded',
      category: 'training_opportunities',
      route: '/programs',
      topicKey: 'why_academy_is_free',
      title: 'Why KR8 Academy Is 100% Free ("What’s the Catch?")',
      content:
        'There is **no hidden catch, no deferred tuition loan, and no surprise certificate fee**. KR8 DIGITALS sustains free education through our dual-engine model: **Engine 01 (our paid commercial studio)** builds websites, brand systems, videos, SEO, and AI workflows for paying organisations, while **Track 03 impact sponsors** help expand cohort capacity. That allows **Engine 02 (KR8 Academy & Next Gen Scholars)** to train disciplined learners for **$0 / ₦0** — and standout graduates even become candidates for paid client collaborations and our studio team.',
      links: [
        { label: 'Explore Free Programs', href: '/programs' },
        { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
      ],
      keywords: ['catch', 'hidden fee', 'how do you make money', 'really free', 'truly free', 'scam', 'legit', 'why free'],
      questions: [
        'What is the catch with KR8 Academy being free?',
        'How does KR8 DIGITALS make money if the training is 100% free?',
        'Is KR8 DIGITALS legit and are there any hidden certificate fees?',
      ],
      relevance: 1.45,
    },

    // 9. WHY HIRE KR8 DIGITALS OVER FREELANCERS OR OTHER AGENCIES?
    {
      id: 'kb-scen-why-choose-kr8',
      category: 'organizational_identity',
      route: '/about',
      topicKey: 'why_choose_kr8',
      title: 'Why Clients Choose KR8 DIGITALS Over Solo Freelancers or Traditional Agencies',
      content:
        'Clients choose KR8 DIGITALS because we unite **engineering, brand strategy, graphic design, video editing, SEO, and AI automation under one accountable roof**:\n\n• **No Fragmented Freelancers:** Your developer (**Timfire**), brand/graphic lead (**Steveoking** · Motionverse), and video director (**Creative Expression** · Chigoma) build together from one brief so your website, visuals, and launch reels match seamlessly.\n• **Live, Inspectable Proof:** 200+ client works delivered, 100+ active clients, and 22 live deployed web platforms you can click and test right now — not static mockups.\n• **Written Fixed Scopes & Full Ownership:** Clear deliverables, fixed milestone figures before work starts, and 100% code/asset ownership on completion.',
      links: [
        { label: 'See Live Client Work', href: '/#work' },
        { label: 'Read Our Problem-Solver Story', href: '/about' },
      ],
      keywords: ['why choose', 'why hire', 'different', 'unique', 'better than', 'freelancer', 'agency', 'trust', 'proof', 'reviews', 'testimonials'],
      questions: [
        'Why should I hire KR8 DIGITALS instead of a freelancer or another agency?',
        'What makes KR8 DIGITALS different from other tech companies?',
        'Can I see proof or reviews of your work?',
      ],
      relevance: 1.42,
    },

    // 10. CUSTOM AI AGENTS FOR CLIENT BUSINESSES (LIKE RIYA!)
    {
      id: 'kb-scen-build-ai-like-riya',
      category: 'services',
      route: '/services/ai-automation',
      topicKey: 'service_ai-automation_custom',
      title: 'Building a Custom AI Representative Like RIYA or Automated Workflows for Your Business',
      content:
        'Yes! Under **AI Agent & Automation** (`/services/ai-automation`), **Timfire** and our engineering team build custom, domain-grounded AI representatives (just like **RIYA**), intelligent lead/issue form routers (like our live *Jev Form Router* build), knowledge-base assistants, and WhatsApp/CRM workflow automations tailored strictly to your company’s own verified documents and rules — with human escalation built in so your bot never invents prices or policies.',
      links: [
        { label: 'AI Agent & Automation Service', href: '/services/ai-automation' },
        { label: 'Commission an AI System', href: '/contact?service=ai-automation' },
      ],
      keywords: ['build an ai', 'like riya', 'chatbot for my business', 'whatsapp bot', 'automate my business', 'custom ai agent'],
      questions: [
        'Can KR8 DIGITALS build an AI assistant like RIYA for my website or business?',
        'Do you build custom chatbots and WhatsApp or CRM automations?',
      ],
      relevance: 1.45,
    },

    // 11. WEBSITE REDESIGN / FIXING SLOW OR OUTDATED SITES
    {
      id: 'kb-scen-website-redesign-and-fixes',
      category: 'services',
      route: '/services/website-design',
      topicKey: 'website_redesign_and_optimization',
      title: 'Redesigning, Speeding Up, or Fixing an Existing Website',
      content:
        'Absolutely. If you already have an outdated, slow, broken, or low-converting website (whether on WordPress, Wix, or custom code), KR8 DIGITALS can audit what is hurting conversions or Google rankings, redesign the mobile and desktop UX, and re-engineer it into a fast, modern platform — while preserving your existing domain and search equity.',
      links: [
        { label: 'Website Design & Engineering', href: '/services/website-design' },
        { label: 'Request a Redesign Audit', href: '/contact?service=website-design' },
      ],
      keywords: ['redesign', 'revamp', 'rebuild', 'slow website', 'fix my website', 'wordpress', 'migrate', 'upgrade website'],
      questions: [
        'Can you redesign or fix my existing website?',
        'My current website is slow and not bringing customers — can KR8 DIGITALS revamp it?',
      ],
      relevance: 1.4,
    },

    // 12. CLASS FORMAT, SCHEDULE, ONLINE ACCESS & HIRING GRADUATES
    {
      id: 'kb-scen-class-schedule-and-graduate-hiring',
      category: 'student_information',
      route: '/programs',
      topicKey: 'cohort_format_and_graduates',
      title: 'KR8 Academy Online Format, Weekly Schedule, Certificate Verification & Graduate Opportunities',
      content:
        'Here is how KR8 Academy cohorts run in practice:\n\n• **100% Online & Practical (8-Week Cohorts):** Learners join remotely from anywhere, completing hands-on weekly builds, XP drills, and mentor reviews rather than passive theory exams.\n• **Verifiable Certificates & KR8 ID:** Every graduate earns a digital certificate and unique **KR8 ID** that employers or clients can verify instantly at `academy.kr8digitals.com/verify`.\n• **Career & Talent Pipeline (No Fake Job Promises):** While we never make dishonest "guaranteed automatic job" claims, top graduates gain peer gig flow inside **KR8 DIGITALS TRIBE** and priority consideration for paid trial collaborations with the KR8 DIGITALS studio. Employers can also contact us to hire vetted graduates.',
      links: [
        { label: 'Verify a Graduate Certificate ↗', href: 'https://academy.kr8digitals.com/verify', outbound: true },
        { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
      ],
      keywords: ['online', 'physical', 'remote class', 'schedule', 'hours per week', 'job guarantee', 'internship', 'hire graduates', 'verify certificate'],
      questions: [
        'Are KR8 Academy classes online or physical in-person?',
        'Do you guarantee a job or internship after graduating from KR8 Academy?',
        'How can an employer verify a KR8 Academy certificate?',
        'Can my company hire graduates from KR8 Academy?',
      ],
      relevance: 1.42,
    },

    // 13. BEGINNER TRACK GUIDANCE
    {
      id: 'kb-scen-beginner-guidance',
      category: 'training_opportunities',
      route: '/programs',
      topicKey: 'beginner_track_guidance',
      title: 'Guidance for Complete Beginners Unsure Which Digital Skill to Learn',
      content:
        'If you want to learn a digital skill at KR8 DIGITALS but aren’t sure where to start, match your track to what naturally excites you (all 7 are **100% tuition-free**):\n\n• **Building interactive websites & code:** Front-End Development or Website Development\n• **Logos, posters, colors & visual identity:** Graphic Design (mentored with Motionverse)\n• **Storytelling, pacing, sound & reels:** Video Editing & Motion (mentored with Chigoma)\n• **Writing, campaigns & audience growth:** Content Creation, Social Media Management, or Digital Marketing\n• **Secondary / pre-university exams (WAEC & JAMB):** Sciences & Arts track with Next Gen Scholars.',
      links: [
        { label: 'Explore All Programs', href: '/programs' },
        { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
      ],
      keywords: ['start', 'beginner', 'unsure', 'not sure', 'which skill', 'which track', 'recommend', 'choose', 'advice', 'zero experience'],
      questions: [
        "I want to learn web development, but I don't know where to start.",
        "I'm interested in learning digital skills, but I'm not sure which one is right for me.",
        'Which KR8 Academy track is easiest or best for a total beginner?',
        'Can someone with zero computer science background learn coding or design at KR8 Academy?',
      ],
      relevance: 1.38,
    },

    // 14. SUITABILITY DOUBT / OBJECTION HANDLING
    {
      id: 'kb-scen-suitability-objection',
      category: 'frequently_asked_questions',
      route: '/programs',
      topicKey: 'suitability_concerns',
      title: 'Addressing Doubts About Program Suitability, Background, or Schedule',
      content:
        'Many learners hesitate because they worry about tuition, zero prior experience, or feeling intimidated. At KR8 DIGITALS: tuition and certificates are **$0**, beginners are welcomed alongside intermediate builders, **KR8 DIGITALS TRIBE** is a judgment-free room ("Critique Over Clout"), and if an 8-week skill cohort is too heavy for your schedule right now, you can attend **Mindset Shift** live sessions (1st & 3rd Sundays at 9PM) or earn commissions in our **Referral Network** with zero technical background.',
      links: [
        { label: 'Explore Programs', href: '/programs' },
        { label: 'Visit KR8 DIGITALS TRIBE', href: '/tribe' },
      ],
      keywords: ['suitable', 'not for me', 'too hard', 'busy', 'intimidated', 'doubt'],
      questions: [
        "I don't think your program is suitable for me.",
        'What if I am too busy or feel behind other students?',
      ],
      relevance: 1.35,
    },

    // 15. INDUSTRIES SERVED
    {
      id: 'kb-scen-industries-served',
      category: 'services',
      route: '/services',
      topicKey: 'industries_served',
      title: 'Industries & Organisations Served by KR8 DIGITALS Commercial Studio',
      content:
        'KR8 DIGITALS builds across diverse industries with live, inspectable proof in **Hospitality & Hotels** (9 deployed hotel & resort platforms), **Restaurants, Bakeries & Cafés** (5 platforms), **Schools & STEM Organisations** (*AFRISTEM Global*, *Prime STEM Nigeria*), **Hospitals & Healthcare** (*Chi-Tom Rapha Hospital & Maternity*), **Conference & Retreat Centres** (*McGettrick Pastoral Centre*), and **Retail & Fashion Brands** (*City Fashion Stores*, *Zoey Perfume*, *Ridwan Footwear*).',
      links: [
        { label: 'See Live Industry Work', href: '/#work' },
        { label: 'Request a Custom Scope', href: '/contact' },
      ],
      keywords: ['hotel', 'hotels', 'school', 'hospital', 'clinic', 'restaurant', 'bakery', 'church', 'ngo', 'retail', 'fashion', 'industry', 'sector'],
      questions: [
        'Do you build websites for schools, hotels, hospitals, or restaurants?',
        'What types of businesses hire KR8 DIGITALS?',
      ],
      relevance: 1.38,
    },

    // 16. GENERAL ORGANIZATIONAL OPERATIONS
    {
      id: 'kb-scen-general-org-operations',
      category: 'general_organizational_information',
      route: '/about',
      topicKey: 'general_org_operations',
      title: 'KR8 DIGITALS Location, Remote Global Delivery & Official Ecosystem Domains',
      content:
        'KR8 DIGITALS is rooted in Nigeria and delivers **100% remotely for clients, sponsors, and learners across Africa and internationally**. Commercial scopes can be billed in **USD or NGN**, studio enquiries receive a human reply within **1 business day**, and our official network properties are the main company site, **KR8 Academy** (`academy.kr8digitals.com`), and **KR8 DIGITALS TRIBE** (`/tribe`).',
      links: [
        { label: 'About KR8 DIGITALS', href: '/about' },
        { label: 'Contact the Studio', href: '/contact' },
      ],
      keywords: ['location', 'where are you located', 'address', 'nigeria', 'international', 'remote', 'global', 'working hours', 'domains'],
      questions: [
        'Where is KR8 DIGITALS located and do you work with international clients?',
        'Can clients outside Nigeria hire KR8 DIGITALS remotely?',
        'What are the official websites in the KR8 DIGITALS network?',
      ],
      relevance: 1.35,
    },

    // 17. ABOUT RIYA HERSELF (CONVERSATIONAL META-IDENTITY)
    {
      id: 'kb-scen-about-riya-meta',
      category: 'organizational_identity',
      route: '/',
      topicKey: 'about_riya_agent',
      title: 'Who Is RIYA and What Can RIYA Do?',
      content:
        'I’m **RIYA** (spelled **R-I-Y-A**), KR8 DIGITALS’ intelligent digital representative! You can chat with me naturally about your business goals, our 6 studio services, our 18 ready-built websites ($450–$1,900), our 100% free KR8 Academy skill cohorts, ways to earn 8%–12% referral commissions, or partnerships — and I can also log feedback or connect you with our human team. What can I help you with today?',
      links: [
        { label: 'Explore Services', href: '/services' },
        { label: 'Explore Free Programs', href: '/programs' },
      ],
      keywords: ['riya', 'who are you', 'what can you do', 'are you ai', 'who built you', 'your name'],
      questions: [
        'Who are you?',
        'Who is RIYA and what can you help me with?',
        'Who built RIYA?',
      ],
      relevance: 1.4,
    },

    // 18. REGISTERING SOMEONE ELSE (CHILD, FRIEND, SIBLING, STAFF, SPOUSE)
    {
      id: 'kb-scen-register-someone-else',
      category: 'registration_and_onboarding',
      route: '/programs',
      topicKey: 'register_someone_else',
      title: 'Registering Someone Else (Child, Friend, Sibling, Colleague, or Student)',
      content:
        'Yes — you can definitely help register a friend, child, sibling, or colleague! Just fill out the application using **their own real full name, active email, and WhatsApp number** so their cohort onboarding, updates, and permanent verifiable **KR8 ID** are issued in their name. Are you registering them for **KR8 Academy** digital skills or **Next Gen Scholars** (WAEC/JAMB prep)?',
      links: [
        { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
        { label: 'Explore Free Programs', href: '/programs' },
      ],
      keywords: [
        'register someone else',
        'someone else',
        'another person',
        'my child',
        'my son',
        'my daughter',
        'my friend',
        'my brother',
        'my sister',
        'sibling',
        'on behalf',
        'for a friend',
        'enroll my',
      ],
      questions: [
        'Can I register someone else?',
        'Can I register my child, sibling, or friend for KR8 Academy or Next Gen Scholars?',
        'Can I apply on behalf of someone else?',
      ],
      relevance: 1.62,
    },

    // 19. NON-TECH PROFESSIONS & CAREERS ("I AM A NURSE / TEACHER / BANKER — DO I HAVE A PLACE HERE?")
    {
      id: 'kb-scen-non-tech-professions-belonging',
      category: 'values_and_philosophy',
      route: '/about',
      topicKey: 'non_tech_belonging',
      title: 'How Nurses, Teachers, Doctors, Pastors, Bankers & Non-Tech Professionals Fit Into KR8 DIGITALS',
      content:
        'You **absolutely** have a place here! People from healthcare, teaching, banking, ministry, business, and every non-tech field plug into KR8 DIGITALS in three great ways: learning a **100% free digital skill** flexibly alongside your work shifts, earning **8%–12% cash commissions** referring clinics, schools, or businesses that need websites, or attending our free **Mindset Shift** wealth & career forums (plus we build websites and brands if you ever launch your own venture!). Which of those excites you most?',
      links: [
        { label: 'Explore Free Programs', href: '/programs' },
        { label: 'Earn via Referrals', href: '/referrals' },
        { label: 'Our Story', href: '/about' },
      ],
      keywords: [
        'nurse',
        'nursing',
        'doctor',
        'medical',
        'healthcare',
        'pharmacist',
        'teacher',
        'lecturer',
        'lawyer',
        'banker',
        'accountant',
        'pastor',
        'ministry',
        'civil servant',
        'parent',
        'mom',
        'mother',
        'trader',
        'non-tech',
        'non tech',
        'have a place',
        'fit in',
        'belong here',
        'my profession',
        'different field',
      ],
      questions: [
        'I am a nurse, do I have a place here?',
        'I work in healthcare / teaching / banking with zero tech background — do I belong at KR8 DIGITALS?',
        'Is KR8 DIGITALS only for tech people?',
        'Do I have a place here if I am not a developer or designer?',
      ],
      relevance: 1.64,
    },

    // 20. "I'D LOVE TO JOIN YOU GUYS" — ALL 3 DOORS EXPLAINED WARMLY
    {
      id: 'kb-scen-ways-to-join-kr8',
      category: 'career_and_talent_pathway',
      route: '/about/join-the-team',
      topicKey: 'ways_to_join_kr8',
      title: 'How to Join KR8 DIGITALS (Academy vs KR8 Tribe vs Studio Team)',
      content:
        'We’d love to have you with us! There are three doors into KR8 DIGITALS depending on where you are right now: **KR8 Academy** (learn a digital skill 100% free from scratch), **KR8 Tribe** (join our free 3,000+ creative community for feedback and gig flow), or **Join the Studio Team** (`/about/join-the-team` — $0 fee, if you already ship strong web, design, or video work). Which one sounds most like you?',
      links: [
        { label: 'Join the Studio Team', href: '/about/join-the-team' },
        { label: 'Join KR8 Tribe', href: '/tribe' },
        { label: 'Free KR8 Academy', href: '/programs' },
      ],
      keywords: [
        'love to join',
        'join you guys',
        'join kr8',
        'be part of',
        'become a member',
        'work with you',
        'join your family',
        'join us',
      ],
      questions: [
        "I'd love to join you guys",
        'How can I join KR8 DIGITALS?',
        'I want to be part of what you guys are building — where do I start?',
      ],
      relevance: 1.62,
    },

    // 21. DISSATISFACTION, REVISIONS & REQUESTING A REDESIGN ON CLIENT PROJECTS
    {
      id: 'kb-scen-satisfaction-revisions-redesign',
      category: 'policies_and_requirements',
      route: '/terms',
      topicKey: 'client_satisfaction_revisions',
      title: 'Requesting Revisions or a Redesign If Not Satisfied With a Project Draft',
      content:
        'Yes, 100% — you will never be stuck with work you aren’t happy with! Every KR8 DIGITALS project runs on **milestone check-ins and structured revision rounds**, so if an initial direction doesn’t feel right, we refine or redesign that stage with your feedback before moving forward. Are you planning a project right now, or asking before you commission us?',
      links: [
        { label: 'Start a Project Safely', href: '/contact' },
        { label: 'Read Terms & Guarantees', href: '/terms' },
      ],
      keywords: [
        'not satisfied',
        'unsatisfied',
        'unhappy',
        'dont like',
        "don't like",
        'dislike',
        'request a redesign',
        'revisions',
        'revision',
        'redo',
        'change the design',
        'money back',
        'refund',
        'project you handle',
      ],
      questions: [
        'Can I request a redesign if I am not satisfied with the project you handle for me?',
        'What happens if I do not like the first draft of my website, logo, or video?',
        'How many revisions do I get if I am not satisfied?',
      ],
      relevance: 1.65,
    },

    // 22. HOW TO EARN MONEY THROUGH KR8 DIGITALS (SHORT & CONVERSATIONAL)
    {
      id: 'kb-scen-how-to-earn-with-kr8',
      category: 'referral_opportunities',
      route: '/referrals',
      topicKey: 'earn_through_kr8',
      title: 'Ways to Earn Money With KR8 DIGITALS (Referrals & Creative Collaboration)',
      content:
        'The fastest way to earn with us is our **Referral Network** (`/referrals`) — introduce any business, school, hotel, or founder that needs digital work and earn **10% cash commission** on websites/AI (e.g. **$200** on a $2,000 site) or **8%** on branding, graphics, video, and SEO, rising to **12%** after 3 paid referrals (payouts start at **$20**). And if you already ship strong web, design, or video work, you can also collaborate on paid studio projects! Would you like to grab your free referral link first?',
      links: [
        { label: 'Join Referral Network', href: '/referrals' },
        { label: 'Open Referrer Dashboard', href: '/referrals/dashboard' },
      ],
      keywords: [
        'earn',
        'make money',
        'income',
        'commission',
        'affiliate',
        'side hustle',
        'paid',
        'payout',
        'earn through you',
      ],
      questions: [
        'How can I earn through you?',
        'How can I make money with KR8 DIGITALS?',
        'Can I earn extra income referring clients to KR8?',
      ],
      relevance: 1.6,
    },

    // 23. SMARTPHONE-ONLY LEARNING & BUSY WORK SCHEDULES
    {
      id: 'kb-scen-phone-and-busy-schedule',
      category: 'student_information',
      route: '/programs',
      topicKey: 'phone_and_schedule',
      title: 'Learning With Only a Smartphone or Alongside a Busy Work/School Schedule',
      content:
        'Yes! If you only have a smartphone right now, you can start immediately in **Content Creation**, **Social Media Management**, **Digital Marketing**, or mobile **Video Editing** (while Website & Front-End Development work best with a laptop). Cohorts run 100% online with practical weekly tasks so working professionals, nurses on shifts, and full-time students can keep up comfortably. Which device will you be using?',
      links: [
        { label: 'Explore Free Tracks', href: '/programs' },
        { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
      ],
      keywords: [
        'smartphone',
        'phone only',
        'no laptop',
        'without a laptop',
        'android',
        'iphone',
        'night shift',
        'full time job',
        'working class',
        'flexible schedule',
      ],
      questions: [
        'Can I learn at KR8 Academy with just my phone if I do not have a laptop yet?',
        'Can a full-time worker or student keep up with the weekly schedule?',
      ],
      relevance: 1.52,
    },
  ];

  for (const sc of SCENARIO_RECORDS) {
    out.push({
      id: sc.id,
      category: sc.category,
      route: sc.route,
      source: 'Conversational Advisory Knowledge',
      topicKey: sc.topicKey,
      title: sc.title,
      summary: sc.content.split('\n')[0].slice(0, 200),
      content: sc.content,
      audience: 'Visitors seeking direct, practical answers',
      purpose: 'Deliver smart, specific, human-like responses',
      actions: sc.links.map((l) => `${l.label} (${l.href})`),
      links: sc.links,
      keywords: sc.keywords,
      questions: sc.questions,
      relevance: sc.relevance || 1.35,
    });
  }

  return out;
}
