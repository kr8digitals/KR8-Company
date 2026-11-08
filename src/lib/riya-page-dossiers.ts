/**
 * RIYA Page-by-Page Deep Dossiers & Activity-Sensitive Proactive Question Engine
 * ------------------------------------------------------------------------------
 * Gives RIYA deep, differentiated situational awareness on EVERY route of
 * KR8 DIGITALS — powering both:
 *   1. Unique, non-welcome, behavior-sensitive popup questions per page & section
 *   2. Deep page-specific context injected into RIYA's conversational brain
 */

export type PageProactiveQuestion = {
  id: string;
  title: string;
  question: string;
  ctaLabel: string;
  quickReplies: { label: string; value: string }[];
  sectionMatch?: string[];
};

export type RiyaPageDossier = {
  routePattern: string;
  pageName: string;
  chatOpener: string;
  pageContextFacts: string;
  defaultChips: { label: string; value: string }[];
  proactivePool: PageProactiveQuestion[];
};

export const RIYA_PAGE_DOSSIERS: RiyaPageDossier[] = [
  {
    routePattern: '/',
    pageName: 'Homepage',
    chatOpener:
      "Hey there! I'm **RIYA**. What brought you to KR8 DIGITALS today — building something for your brand, learning a digital skill for free, or exploring how to earn and partner with us?",
    pageContextFacts:
      'Visitor is on the Homepage (/). Highlights: Dual-engine company (Commercial Creative-Tech Studio + 100% Free Human Capacity Engine). 200+ works delivered, 100+ active clients, 22 deployed custom websites + 18 ready-built websites for immediate purchase ($450, $900, $1,900), 6 core commercial services (Website Design, Branding, Graphic Design, Video Editing, SEO, AI Automation), 4 free ecosystem programs (KR8 Academy 7 free tracks, Next Gen Scholars WAEC/JAMB, KR8 Tribe 3,000+ creatives, Mindset Shift twice-monthly live sessions), 4 partnership tracks, and 8%–12% referral commissions.',
    defaultChips: [
      { label: 'Build or buy a website', value: 'I need a website for my business — what are my options?' },
      { label: 'Learn a digital skill free', value: 'How does your 100% free digital skills training work?' },
      { label: 'How can I earn with KR8?', value: 'How can I earn through KR8 DIGITALS?' },
      { label: 'What are your bestsellers?', value: 'What are your bestsellers?' },
    ],
    proactivePool: [
      {
        id: 'home_showcase',
        sectionMatch: ['showcase', 'work', 'portfolio', 'sites'],
        title: 'Spotted a website style you like?',
        question:
          "Did one of those live builds catch your eye? Tell me what your business does and I'll point you to the closest match — or one of our $450+ ready-built sites.",
        ctaLabel: 'Tell RIYA my industry',
        quickReplies: [
          { label: 'Show $450–$1,900 ready-built sites', value: 'Tell me about your ready-built websites for sale.' },
          { label: 'I want a custom website', value: 'I want a custom website built for my brand.' },
          { label: 'What are your bestsellers?', value: 'What are your bestsellers?' },
        ],
      },
      {
        id: 'home_ecosystem',
        sectionMatch: ['programs', 'ecosystem', 'academy', 'training'],
        title: 'Curious how the training stays 100% free?',
        question:
          "Noticed our free Academy & Tribe section? Tell me your current background (even if it's zero tech!) and I'll show you where you fit best.",
        ctaLabel: 'Match my background',
        quickReplies: [
          { label: 'I have zero tech background', value: 'I come from a non-tech background — do I have a place here?' },
          { label: 'Which free skills can I learn?', value: 'What free digital skills can I learn at KR8 Academy?' },
          { label: 'Can I register someone else?', value: 'Can I register someone else for your training?' },
        ],
      },
      {
        id: 'home_intent',
        title: 'Quick question while you browse',
        question:
          'Are you visiting KR8 today to launch a project for your business, pick up a free digital skill, or explore ways to earn with us?',
        ctaLabel: 'Answer RIYA',
        quickReplies: [
          { label: 'Launch a business project', value: 'I want to hire KR8 DIGITALS for a project.' },
          { label: 'Learn a skill for free', value: "I'd love to learn a digital skill for free." },
          { label: 'Earn through referrals', value: 'How can I earn through KR8 DIGITALS?' },
        ],
      },
    ],
  },
  {
    routePattern: '/about/timfire',
    pageName: 'Founder Profile — Timfire',
    chatOpener:
      "You're reading about **Timfire** (Kenneth Timothy Iziogo), our Founder & Chief Executive! Curious about commissioning a custom web platform, building an AI agent like me, or joining his Mindset Shift sessions?",
    pageContextFacts:
      'Visitor is on /about/timfire — profile of Timfire (Kenneth Timothy Iziogo), Website Developer, AI Agent Developer, Founder & Chief Executive of KR8 DIGITALS, and host of Mindset Shift (1st & 3rd Sundays at 9 PM). Leads custom web engineering, full-stack portals, and AI workflow automation (including RIYA).',
    defaultChips: [
      { label: 'Build a custom AI agent like RIYA', value: 'Can Timfire and KR8 build a custom AI agent like RIYA for my business?' },
      { label: 'Commission a web platform', value: 'I want to commission a custom website or web portal.' },
      { label: 'Join Timfire on Mindset Shift', value: 'How do I join Timfire on Mindset Shift?' },
    ],
    proactivePool: [
      {
        id: 'timfire_ai_web',
        title: 'Exploring Timfire’s web & AI builds?',
        question:
          'Thinking of commissioning a custom web platform — or having Timfire’s team build an intelligent AI representative like me for your own website?',
        ctaLabel: 'Let’s talk possibilities',
        quickReplies: [
          { label: 'Build an AI agent for my site', value: 'Can you build an AI agent like RIYA for my own website?' },
          { label: 'Commission a custom website', value: 'How does commissioning a custom website work?' },
          { label: 'Join Mindset Shift live', value: 'Tell me about Timfire’s Mindset Shift sessions.' },
        ],
      },
    ],
  },
  {
    routePattern: '/about/steveoking',
    pageName: 'Co-Founder Profile — Steveoking',
    chatOpener:
      "You're on **Steveoking**'s profile (Stevenson — Co-Founder of KR8 DIGITALS & Founder of Motionverse)! Are you thinking about a brand identity refresh, campaign flyers, or learning graphic design?",
    pageContextFacts:
      'Visitor is on /about/steveoking — profile of Steveoking (Stevenson), Professional Graphic Designer, Brand Designer, Founder of Motionverse, and Co-Founder of KR8 DIGITALS. Leads visual identity systems, logos, brand guidelines, commercial flyers, and Graphic Design mentorship.',
    defaultChips: [
      { label: 'Start a brand identity project', value: 'What is included in a KR8 brand identity project?' },
      { label: 'Order campaign flyers', value: 'How fast can you design commercial or event flyers?' },
      { label: 'Learn Graphic Design free', value: 'How do I learn Graphic Design for free at KR8?' },
    ],
    proactivePool: [
      {
        id: 'steveoking_brand',
        title: 'Looking at Steveoking’s visual craft?',
        question:
          'Does your business need a complete brand identity from scratch, or fast, high-converting campaign visuals for an upcoming launch?',
        ctaLabel: 'Tell RIYA what I need',
        quickReplies: [
          { label: 'Full brand identity', value: 'I need a complete brand identity for my business.' },
          { label: 'Fast campaign / event flyers', value: 'I need flyers and social media graphics.' },
          { label: 'Learn design with Motionverse', value: 'How can I learn graphic design under Motionverse?' },
        ],
      },
    ],
  },
  {
    routePattern: '/about/creative-expression',
    pageName: 'Co-Founder Profile — Creative Expression',
    chatOpener:
      "You're checking out **Creative Expression** (Daniel Akachukwu Augustine — Co-Founder of KR8 DIGITALS & Founder of Chigoma)! Planning retention reels, a brand film, or hoping to learn video editing?",
    pageContextFacts:
      'Visitor is on /about/creative-expression — profile of Creative Expression (Daniel Akachukwu Augustine), Professional Video Editor, Founder of CHIGOMA, and Co-Founder of KR8 DIGITALS. Leads retention-cut reels, launch films, documentaries, sound design, and Video Editing mentorship.',
    defaultChips: [
      { label: 'Edit reels or launch video', value: 'How does your video editing service work?' },
      { label: 'Turnaround time for edits', value: 'How fast do you deliver video edits and reels?' },
      { label: 'Learn Video Editing free', value: 'Can I learn video editing for free with Chigoma?' },
    ],
    proactivePool: [
      {
        id: 'ce_video',
        title: 'Planning video content right now?',
        question:
          'Do you have raw footage waiting to be turned into high-retention Reels/TikToks, or are you planning a bigger brand story film?',
        ctaLabel: 'Share my video plan',
        quickReplies: [
          { label: 'Short-form Reels / TikToks', value: 'I need retention-cut Reels and short-form videos.' },
          { label: 'Brand film / documentary', value: 'I want a brand launch film or documentary edited.' },
          { label: 'Learn video editing free', value: 'How do I join the free Video Editing track?' },
        ],
      },
    ],
  },
  {
    routePattern: '/about/join-the-team',
    pageName: 'Join the Studio Team',
    chatOpener:
      "Love seeing you on **Join the Team**! Which discipline do you build in — web engineering, brand/graphic design, video editing, SEO, or AI workflows?",
    pageContextFacts:
      'Visitor is on /about/join-the-team. Joining the KR8 DIGITALS studio team is 100% free ($0 application fee — we never charge talent to apply). Open to disciplined practitioners with inspectable portfolio links AND top KR8 Academy graduates. Not a beginner classroom — beginners start free at KR8 Academy first, then graduate into Tribe and studio gigs.',
    defaultChips: [
      { label: 'What do you look for in applicants?', value: 'What does KR8 look for when joining the studio team?' },
      { label: "I'm still a beginner — can I join?", value: "I'd love to join you guys, even though I'm still learning." },
      { label: 'Is there any fee to join?', value: 'Do I pay anything to join the KR8 team?' },
    ],
    proactivePool: [
      {
        id: 'join_team_craft',
        title: 'Thinking of building with our studio?',
        question:
          "Are you already shipping client-ready work with a portfolio, or are you looking to build your skills from scratch first? Either way, there's a door for you!",
        ctaLabel: 'Tell RIYA my level',
        quickReplies: [
          { label: 'I have a portfolio ready', value: 'I already have a portfolio — how does the studio team review work?' },
          { label: "I'm a beginner eager to learn", value: "I'm a beginner — how can I grow into the KR8 team?" },
          { label: 'Can I work remotely?', value: 'Is working with the KR8 studio team remote?' },
        ],
      },
    ],
  },
  {
    routePattern: '/about',
    pageName: 'About KR8 DIGITALS',
    chatOpener:
      '*"We are writing a story, and you can be a big part of it."* Tell me a bit about what you do — I’d love to show you how people in your field fit into KR8 DIGITALS!',
    pageContextFacts:
      'Visitor is on /about. Hero: "We are writing a story, and you can be a big part of it." Our Story: "We are problem solvers — uniting distinct minds to solve what no one can solve alone." Unites Timfire (Web & AI), Steveoking (Motionverse — Branding & Graphics), Creative Expression (Chigoma — Video), and Next Gen Scholars (Academics). Welcomes everyone regardless of profession (nurses, teachers, founders, students, creatives, sponsors).',
    defaultChips: [
      { label: "I'm from a non-tech field — do I fit?", value: 'I work in a non-tech profession — do I have a place here?' },
      { label: "I'd love to join KR8", value: "I'd love to join you guys" },
      { label: 'Meet the 3 founders', value: 'Who founded KR8 DIGITALS?' },
    ],
    proactivePool: [
      {
        id: 'about_belonging',
        title: 'Where do you fit into our story?',
        question:
          "We bring problem solvers from every profession together — nurses, founders, students, creatives, and sponsors. What do you do? I'll show you your best spot here!",
        ctaLabel: 'Tell RIYA what I do',
        quickReplies: [
          { label: "I'm in a non-tech career", value: 'I am in a non-tech career — do I have a place here?' },
          { label: 'I run a business / organisation', value: 'I run a business — how can KR8 help me grow?' },
          { label: "I'd love to join KR8", value: "I'd love to join you guys" },
        ],
      },
    ],
  },
  {
    routePattern: '/services/website-design',
    pageName: 'Website Design & Development',
    chatOpener:
      "Looking at **Website Design**! Are you leaning toward a custom-built platform tailored from scratch, or one of our **18 ready-built websites** ($450–$1,900) that can launch in just days?",
    pageContextFacts:
      'Visitor is on /services/website-design. Offers both: (1) Custom Website Design & Full-Stack Portals (22 deployed live sites across hospitality, healthcare, education, corporate, dining — fixed milestone quotes in USD or NGN, 2–6 weeks typical, structured revisions + milestone sign-off, 100% client IP & code ownership on settlement), and (2) 18 Ready-Built Websites for immediate purchase & rapid branding customization at $450 (boutique hotels, cafés, fast-food, AI form routers), $900 (resorts, hotel estates, digital schools, restaurant-bakeries), and $1,900 (STEM championship + past-questions + admin portal).',
    defaultChips: [
      { label: 'Compare $450 / $900 / $1,900 sites', value: 'How do the $450, $900, and $1,900 ready-built websites differ?' },
      { label: 'What if I want revisions / redesign?', value: 'Can I request a redesign if I am not satisfied with the project you handle for me?' },
      { label: 'How fast can my site launch?', value: 'How fast can you build or customize my website?' },
    ],
    proactivePool: [
      {
        id: 'web_custom_vs_ready',
        title: 'Custom build or launch-in-days?',
        question:
          'Need a custom web platform engineered around your workflow, or want to grab one of our 18 live ready-built sites ($450–$1,900) and go live this week?',
        ctaLabel: 'Help me pick',
        quickReplies: [
          { label: 'Launch fast ($450–$1,900 ready-built)', value: 'Tell me how buying a ready-built website works.' },
          { label: 'Custom website from scratch', value: 'How do custom website quotes and milestones work?' },
          { label: 'What if I want changes?', value: 'Can I request revisions or a redesign if I am not satisfied?' },
        ],
      },
    ],
  },
  {
    routePattern: '/services/branding',
    pageName: 'Branding & Visual Identity',
    chatOpener:
      "Welcome to **Branding & Visual Identity** (co-led with Motionverse)! Are you launching a brand-new venture from zero, or upgrading an existing look so clients take you more seriously?",
    pageContextFacts:
      'Visitor is on /services/branding. Led with Motionverse (Steveoking). Covers category positioning, logo architecture, typography, color psychology, brand guidelines book, packaging/mockups, and brand audits. Distinct from Graphic Design (Branding builds the permanent identity system; Graphic Design produces ongoing flyers/ads). Includes milestone reviews and revisions.',
    defaultChips: [
      { label: 'Branding vs Graphic Design?', value: 'What is the difference between Branding and Graphic Design?' },
      { label: 'Starting a brand from scratch', value: "I'm launching a new brand — what do I get in a branding package?" },
      { label: 'Rebranding an existing business', value: 'Can you rebrand my existing business without confusing current customers?' },
    ],
    proactivePool: [
      {
        id: 'branding_stage',
        title: 'New venture or brand refresh?',
        question:
          "Are you naming and designing a brand from day one, or refreshing a business that has outgrown its old logo? Tell me your industry and let's map it out!",
        ctaLabel: 'Share my brand stage',
        quickReplies: [
          { label: 'Brand-new business', value: 'I am starting a new business and need full branding.' },
          { label: 'Refreshing an old logo/brand', value: 'I want to rebrand my existing business.' },
          { label: 'Just need a flyer for now', value: 'What if I only need flyers and social graphics right now?' },
        ],
      },
    ],
  },
  {
    routePattern: '/services/graphic-design',
    pageName: 'Commercial Graphic Design',
    chatOpener:
      "You're on **Commercial Graphic Design**! Got an upcoming product drop, church/corporate event, or social campaign that needs sharp flyers in 24–72 hours?",
    pageContextFacts:
      'Visitor is on /services/graphic-design. High-converting retail, event, church, institutional, and social campaign flyers, pitch decks, carousels, and print collateral. Typical turnaround: 24–72 hours depending on volume, with revision rounds included.',
    defaultChips: [
      { label: 'How fast are flyers delivered?', value: 'How fast can you deliver campaign or event flyers?' },
      { label: 'Monthly social design retainer?', value: 'Can KR8 handle ongoing social media graphics for my brand?' },
      { label: 'What if I dislike the first draft?', value: 'Can I request a redesign if I am not satisfied with a design?' },
    ],
    proactivePool: [
      {
        id: 'graphics_deadline',
        title: 'Working toward a launch deadline?',
        question:
          'When is your campaign or event going live? Most flyers ship in 24–72 hours — tell me what you’re promoting!',
        ctaLabel: 'Tell RIYA my deadline',
        quickReplies: [
          { label: 'Urgent (next 24–48 hrs)', value: 'I have an urgent flyer deadline in the next 48 hours — can you help?' },
          { label: 'Upcoming campaign / event', value: 'I need a set of flyers and social media designs for a launch.' },
          { label: 'Pitch deck / brochure', value: 'Do you design corporate pitch decks and brochures?' },
        ],
      },
    ],
  },
  {
    routePattern: '/services/video-editing',
    pageName: 'Video Editing & Post-Production',
    chatOpener:
      "Welcome to **Video Editing** (powered with Chigoma)! What kind of footage are we cutting — short-form Reels/TikToks, YouTube episodes, or a flagship launch film?",
    pageContextFacts:
      'Visitor is on /services/video-editing. Led with Chigoma (Creative Expression). Retention-cut short-form Reels/TikToks/Shorts (2–5 business days), YouTube edits, corporate documentaries, event recaps, motion captions, color grading, and sound design. Structured review/revision cycles included.',
    defaultChips: [
      { label: 'Short-form Reels & TikToks', value: 'How do your short-form Reel and TikTok editing packages work?' },
      { label: 'Brand launch / documentary', value: 'Can you edit a full brand documentary or launch video?' },
      { label: 'How do I send raw footage?', value: 'How do I send raw video files and request revisions?' },
    ],
    proactivePool: [
      {
        id: 'video_platform',
        title: 'Where will your video live?',
        question:
          'Cutting vertical Reels/TikToks to hook viewers in the first 2 seconds, or a horizontal YouTube / website hero film?',
        ctaLabel: 'Tell RIYA my format',
        quickReplies: [
          { label: 'Vertical Reels / TikTok', value: 'I need punchy vertical Reels edited for social growth.' },
          { label: 'Website / YouTube film', value: 'I need a polished horizontal brand or YouTube video.' },
          { label: 'How fast is turnaround?', value: 'How long does video editing take?' },
        ],
      },
    ],
  },
  {
    routePattern: '/services/seo',
    pageName: 'Technical & Local SEO',
    chatOpener:
      "Checking out **SEO Optimization**! If someone searches Google for what you sell in your city right now, does your business show up on page one?",
    pageContextFacts:
      'Visitor is on /services/seo. Technical Core Web Vitals optimization, Google Business Profile & local search ranking, schema markup, keyword architecture, and conversion copywriting. Honest policy: we never promise fake "#1 overnight" guarantees; we ship inspectable technical fixes and measurable organic ranking growth.',
    defaultChips: [
      { label: 'Rank my business locally on Google', value: 'How can you help my business show up on Google locally?' },
      { label: 'My current site gets zero traffic', value: 'I already have a website, but nobody finds it on Google.' },
      { label: 'How long until SEO shows results?', value: 'How soon do SEO improvements start bringing leads?' },
    ],
    proactivePool: [
      {
        id: 'seo_visibility',
        title: 'Invisible on Google right now?',
        question:
          'Already have a website that gets zero search enquiries, or launching a new one you want indexed fast? Tell me your niche!',
        ctaLabel: 'Check my SEO path',
        quickReplies: [
          { label: 'Fix an existing website’s SEO', value: 'Can you audit and fix SEO on my existing website?' },
          { label: 'Local Google Maps ranking', value: 'Do you set up and optimize Google Business Profiles?' },
        ],
      },
    ],
  },
  {
    routePattern: '/services/ai-automation',
    pageName: 'AI Agent & Workflow Automation',
    chatOpener:
      "You're on **AI & Workflow Automation** — the exact studio discipline that built me (**RIYA**)! Want a 24/7 AI representative or automated lead workflow working for your own organisation?",
    pageContextFacts:
      'Visitor is on /services/ai-automation. Led by Timfire. Builds custom conversational AI representatives (like RIYA), automated WhatsApp/web enquiry triage, school/clinic intake routers, and internal ops automations grounded strictly in client knowledge bases with zero hallucinated pricing.',
    defaultChips: [
      { label: 'Build an AI agent like RIYA for me', value: 'How can I get a custom AI agent like RIYA on my own website?' },
      { label: 'Automate client intake & bookings', value: 'What business workflows can KR8 automate with AI?' },
      { label: 'Do I own the system 100%?', value: 'If you build an AI system for us, do we own it?' },
    ],
    proactivePool: [
      {
        id: 'ai_like_riya',
        title: 'Want an agent like me on your site?',
        question:
          'Imagine visitors on your website getting instant, accurate answers 24/7 without you typing a word. What repetitive questions does your team answer every day?',
        ctaLabel: 'Automate my enquiries',
        quickReplies: [
          { label: 'Customer enquiries & quotes', value: 'I want an AI agent to answer customer questions and capture leads.' },
          { label: 'School / clinic / hotel bookings', value: 'Can you build an AI intake assistant for a school, clinic, or hotel?' },
        ],
      },
    ],
  },
  {
    routePattern: '/services',
    pageName: 'Commercial Services Hub',
    chatOpener:
      "Welcome to our **Services Hub**! Tell me in plain words what you're trying to launch, fix, or grow — I'll point you straight to the best studio option.",
    pageContextFacts:
      'Visitor is on /services. 6 commercial disciplines: Website Design (custom + 18 ready-built sites at $450/$900/$1,900), Branding (Motionverse), Graphic Design, Video Editing (Chigoma), Technical/Local SEO, and AI Automation. Milestone billing in USD or NGN, structured revision rounds & milestone sign-off, 100% IP ownership on settlement.',
    defaultChips: [
      { label: 'What are your bestsellers?', value: 'What are your bestsellers?' },
      { label: 'Ready-built sites ($450–$1,900)', value: 'Tell me about your 18 ready-built websites for sale.' },
      { label: 'What if I want revisions / redesign?', value: 'Can I request a redesign if I am not satisfied with the project you handle for me?' },
      { label: 'Tight budget — where do I start?', value: 'I have a small budget — how can I start working with KR8?' },
    ],
    proactivePool: [
      {
        id: 'services_bottleneck',
        title: 'Comparing studio options?',
        question:
          "What's the biggest thing holding your brand back right now — no high-converting website, outdated visuals, or slow lead flow?",
        ctaLabel: 'Tell RIYA my goal',
        quickReplies: [
          { label: 'Need a website that converts', value: 'I need a high-converting website for my business.' },
          { label: 'Need sharper branding / flyers', value: 'I need stronger branding and marketing visuals.' },
          { label: 'What are your bestsellers?', value: 'What are your bestsellers?' },
        ],
      },
    ],
  },
  {
    routePattern: '/programs/mindset-shift/invite',
    pageName: 'Mindset Shift Leadership Forum',
    chatOpener:
      "Welcome to **Mindset Shift**! Hosted live by **Timfire** on the **1st & 3rd Sundays at 9 PM** — completely free. Want to grab an invite for yourself or bring a friend along?",
    pageContextFacts:
      'Visitor is on /programs/mindset-shift/invite. Mindset Shift is a 100% free live conversation series hosted by Timfire twice monthly (1st and 3rd Sundays at 9 PM) challenging limiting beliefs around money, business, career longevity, and wealth creation. Anyone from any profession (nurses, students, founders, creatives, employees) can register themselves or invite/register friends.',
    defaultChips: [
      { label: 'Who can attend Mindset Shift?', value: 'Is Mindset Shift open to people outside tech?' },
      { label: 'Can I invite or register a friend?', value: 'Can I register someone else for Mindset Shift?' },
      { label: 'Does it cost anything?', value: 'Is Mindset Shift completely free to attend?' },
    ],
    proactivePool: [
      {
        id: 'mindset_sunday',
        title: 'Free this 1st or 3rd Sunday at 9 PM?',
        question:
          'Curious what Timfire and guest speakers unpack inside a live Mindset Shift session — or want to save a seat for a friend too?',
        ctaLabel: 'Ask about Mindset Shift',
        quickReplies: [
          { label: 'What topics do you discuss?', value: 'What happens inside a Mindset Shift live session?' },
          { label: 'Can I register a friend too?', value: 'Can I register someone else?' },
        ],
      },
    ],
  },
  {
    routePattern: '/programs',
    pageName: 'Free Programs & KR8 Academy',
    chatOpener:
      "Exploring our **100% free programs**! Tell me a little about yourself (student, working professional, beginner, or registering for someone else) and I'll match the right track in seconds.",
    pageContextFacts:
      'Visitor is on /programs. All 4 ecosystem programs are 100% FREE ($0 / ₦0): (1) KR8 Academy — 8-week practical cohorts across 7 tracks (Website Development, Front-End Development, Graphic Design, Video Editing & Animation, Content Creation, Social Media Management, Digital Marketing) with free verifiable graduation certificates & KR8 IDs at academy.kr8digitals.com; (2) Next Gen Scholars — free WAEC & JAMB prep in Sciences & Arts; (3) KR8 DIGITALS TRIBE — 3,000+ creative community; (4) Mindset Shift — 1st & 3rd Sundays at 9 PM. People from ANY career (nurses, teachers, students, career switchers) are welcome, and you CAN help register a child, friend, or relative using their own name/email/WhatsApp.',
    defaultChips: [
      { label: 'Match a free skill to me', value: "I'm not sure which free digital skill fits me best — can you help?" },
      { label: 'Can I register someone else?', value: 'Can I register someone else?' },
      { label: "I'm in a non-tech job — do I fit?", value: 'I am a nurse, do I have a place here?' },
      { label: 'Can I learn with just my phone?', value: 'Can I join KR8 Academy using only my smartphone?' },
    ],
    proactivePool: [
      {
        id: 'programs_matcher',
        title: 'Unsure which free track fits your life?',
        question:
          'Signing up for yourself or helping a friend/child register? Tell me your current job or schedule and I’ll pick the easiest 100% free track to start with!',
        ctaLabel: 'Match my track',
        quickReplies: [
          { label: 'Picking for myself', value: 'Help me pick the right free digital skill for my schedule.' },
          { label: 'Registering someone else', value: 'Can I register someone else?' },
          { label: 'WAEC / JAMB student prep', value: 'How does the free WAEC and JAMB prep work?' },
        ],
      },
    ],
  },
  {
    routePattern: '/tribe',
    pageName: 'KR8 DIGITALS TRIBE',
    chatOpener:
      "Welcome to **KR8 DIGITALS TRIBE** — our 3,000+ creative family! What's your craft (or the craft you're learning right now)?",
    pageContextFacts:
      'Visitor is on /tribe. KR8 DIGITALS TRIBE is 100% free to join — 3,000+ designers, video editors, web developers, writers, and founders. Four pillars: Critique Over Clout (honest senior feedback), Internal Gig Flow (paid client overflow shared inside), Interdisciplinary Sprints, and Mindset & Industry Shifts.',
    defaultChips: [
      { label: 'How do members get paid gigs?', value: 'How does Internal Gig Flow work inside KR8 Tribe?' },
      { label: 'Can beginners join the Tribe?', value: 'Can I join KR8 Tribe even if I am still a beginner?' },
      { label: 'Is KR8 Tribe free?', value: 'Is joining KR8 DIGITALS TRIBE completely free?' },
    ],
    proactivePool: [
      {
        id: 'tribe_craft',
        title: 'Building solo right now?',
        question:
          'Tired of creating alone with zero real feedback? Tell me what you design, code, or edit — I’ll show you how our 3,000+ Tribe plugs you into critiques and gigs.',
        ctaLabel: 'Show me how Tribe works',
        quickReplies: [
          { label: 'How gig sharing works', value: 'How do Tribe members get referred for paid gigs?' },
          { label: 'I want to join the Tribe', value: "I'd love to join KR8 Tribe — how do I get in?" },
        ],
      },
    ],
  },
  {
    routePattern: '/partners/next-gen-scholars',
    pageName: 'Partner Chapter — Next Gen Scholars',
    chatOpener:
      "You're viewing **Next Gen Scholars**, our academic partner chapter! Are you looking for free WAEC/JAMB prep for a student, or hoping to partner as a school or sponsor?",
    pageContextFacts:
      'Visitor is on /partners/next-gen-scholars. Next Gen Scholars delivers 100% free WAEC & JAMB examination preparation across Sciences & Arts, plus academic mentorship. Parents, guardians, and teachers can help register students using the student’s details, and schools/foundations can co-host or sponsor cohorts.',
    defaultChips: [
      { label: 'Register a WAEC / JAMB student', value: 'Can I register my child or younger sibling for Next Gen Scholars?' },
      { label: 'Partner our secondary school', value: 'How can our school partner with Next Gen Scholars and KR8?' },
    ],
    proactivePool: [
      {
        id: 'ngs_student_or_school',
        title: 'Parent, student, or school leader?',
        question:
          'Enrolling a teenager for free WAEC/JAMB prep, or exploring a school partnership with Next Gen Scholars?',
        ctaLabel: 'Tell RIYA',
        quickReplies: [
          { label: 'Enrolling a student', value: 'Can I register a student for free WAEC and JAMB prep?' },
          { label: 'School / sponsor inquiry', value: 'How can a school or sponsor work with Next Gen Scholars?' },
        ],
      },
    ],
  },
  {
    routePattern: '/partners',
    pageName: 'Partnerships & Sponsorships',
    chatOpener:
      "Welcome to **Partnerships**! Are you exploring **sponsoring free youth cohorts**, **white-label studio collaboration**, a **school/NGO alliance**, or launching a **specialist chapter**?",
    pageContextFacts:
      'Visitor is on /partners. Four structured Written Charter tracks: Track 01 Specialist Chapters (like Motionverse & Chigoma — retain 100% brand attribution), Track 02 Institutional & School Alliances (co-hosted bootcamps), Track 03 Impact Sponsors & Foundations (prominent public co-branding across cohorts & Mindset Shift, student data/laptops/seats impact, verified graduation ID impact reports, first-look talent hiring), and Track 04 White-Label Agency Overflow.',
    defaultChips: [
      { label: 'What do sponsors get in return?', value: 'What do I get for sponsoring KR8 DIGITALS?' },
      { label: 'Agency white-label overflow', value: 'Can our agency use KR8 DIGITALS as a white-label production partner?' },
      { label: 'Church / NGO / School partnership', value: 'Can our school, church, or NGO partner with KR8?' },
    ],
    proactivePool: [
      {
        id: 'partners_track',
        title: 'Thinking of partnering or sponsoring?',
        question:
          'Tell me what kind of organisation you lead — agency, company, school, church, or foundation — and I’ll show you what you get under our Written Charter!',
        ctaLabel: 'Match our track',
        quickReplies: [
          { label: 'Sponsoring KR8 (Track 03)', value: 'What do I get for sponsoring KR8 DIGITALS?' },
          { label: 'Agency / Studio partner', value: 'How do specialist and white-label partnerships work?' },
          { label: 'School / Community alliance', value: 'How do institutional and school partnerships work?' },
        ],
      },
    ],
  },
  {
    routePattern: '/referrals',
    pageName: 'Referral Network & Earnings',
    chatOpener:
      '*"You may not have the skill. You have the people."* Want to see how a single introduction can earn you **8%–12% cash commission**?',
    pageContextFacts:
      'Visitor is on /referrals or /referrals/dashboard. Free signup gives an instant personal referral code and /r/[code] link. Commissions: 10% on websites, web apps & AI systems (e.g., $200 on a $2,000 website), 8% on branding/graphics/video/SEO, 10% on small jobs ($20 min floor), rising to 12% loyalty bonus after 3 paid referrals. Minimum withdrawal: $20 USD paid via direct bank transfer (USD or NGN equivalent) once client invoice settles. Excludes self-referrals.',
    defaultChips: [
      { label: 'How do I start earning today?', value: 'How can I earn through you?' },
      { label: 'Can I withdraw in Naira (NGN)?', value: 'Can referral commissions be paid to my Nigerian bank account?' },
      { label: 'How do you track my referrals?', value: 'How do I know my referral will be credited to me?' },
    ],
    proactivePool: [
      {
        id: 'referrals_calc',
        title: 'Know one founder, clinic, or hotel?',
        question:
          'Referring just one $2,000 website pays you $200 cash once settled. Want me to walk you through getting your personal referral link in 30 seconds?',
        ctaLabel: 'Show me how to earn',
        quickReplies: [
          { label: 'How referral payouts work', value: 'How can I earn through you?' },
          { label: 'Get my referral link', value: 'How do I get my referral code and track earnings?' },
        ],
      },
    ],
  },
  {
    routePattern: '/contact',
    pageName: 'Contact & Project Brief',
    chatOpener:
      "You're on **Contact**! If you aren't sure how to describe your scope or budget on the form, tell me your idea in plain words here first and I'll help shape it.",
    pageContextFacts:
      'Visitor is on /contact. Direct channels: kr8digitals01@gmail.com (studio), academy@kr8digitals.com (Academy), +234 812 568 7509 / WhatsApp 2348125687509. Human response within 1 business day. No obligation to ask for a quote.',
    defaultChips: [
      { label: 'Help me figure out my scope', value: "I have a project idea, can you help me figure out what I need?" },
      { label: 'How fast will the team reply?', value: 'How quickly does KR8 respond after I submit the contact form?' },
      { label: 'Chat on WhatsApp instead', value: '__whatsapp' },
    ],
    proactivePool: [
      {
        id: 'contact_helper',
        title: 'Unsure what to put in the form?',
        question:
          "Don't stress over technical jargon — tell me what you're trying to achieve in one sentence and I'll suggest the cleanest scope!",
        ctaLabel: 'Test my idea with RIYA',
        quickReplies: [
          { label: 'Help me describe my project', value: 'I have an idea but I am not sure which service to pick.' },
          { label: 'Can I pay in milestones / Naira?', value: 'How do payments and milestones work for projects?' },
        ],
      },
    ],
  },
  {
    routePattern: '/terms',
    pageName: 'Terms, Revisions & IP Ownership',
    chatOpener:
      "Reading our **Terms**! Want the plain-English summary on **revision rounds**, **milestone payments**, or **100% code & brand ownership**?",
    pageContextFacts:
      'Visitor is on /terms, /privacy, or /accessibility. Key policies: Clients receive 100% full IP, source code, domain, and brand asset ownership upon final milestone settlement. Structured revision rounds & milestone sign-off protect clients from ever getting stuck with work they dislike. Privacy-first data handling; zero selling of personal data.',
    defaultChips: [
      { label: 'What if I am not satisfied?', value: 'Can I request a redesign if I am not satisfied with the project you handle for me?' },
      { label: 'Do I own 100% of my code & files?', value: 'Do I own 100% of my website source code and design files?' },
    ],
    proactivePool: [
      {
        id: 'terms_plain',
        title: 'Want the plain-English version?',
        question:
          'Wondering what happens if you want a redesign mid-project, or who owns your source code when we finish? Ask me straight!',
        ctaLabel: 'Ask about guarantees',
        quickReplies: [
          { label: 'Redesign / revision policy', value: 'Can I request a redesign if I am not satisfied with the project you handle for me?' },
          { label: 'Source code & IP ownership', value: 'Who owns the code and design files after delivery?' },
        ],
      },
    ],
  },
];

export function getPageDossier(pathname: string): RiyaPageDossier {
  const clean = (pathname || '/').toLowerCase().split('?')[0].replace(/\/+$/, '') || '/';
  if (clean === '/') return RIYA_PAGE_DOSSIERS[0];

  // Match longest specific route prefix first
  const sorted = [...RIYA_PAGE_DOSSIERS]
    .filter((d) => d.routePattern !== '/')
    .sort((a, b) => b.routePattern.length - a.routePattern.length);

  for (const d of sorted) {
    if (clean === d.routePattern || clean.startsWith(d.routePattern + '/') || clean.startsWith(d.routePattern)) {
      return d;
    }
  }
  if (clean.startsWith('/privacy') || clean.startsWith('/accessibility')) {
    return RIYA_PAGE_DOSSIERS.find((d) => d.routePattern === '/terms')!;
  }
  return RIYA_PAGE_DOSSIERS[0];
}

export function selectProactiveQuestion(params: {
  pathname: string;
  activeSection?: string;
  scrollRatio?: number;
  visits?: number;
}): PageProactiveQuestion {
  const dossier = getPageDossier(params.pathname);
  const pool = dossier.proactivePool;
  const sec = (params.activeSection || '').toLowerCase();

  if (sec) {
    const bySection = pool.find((q) => q.sectionMatch?.some((m) => sec.includes(m)));
    if (bySection) return bySection;
  }

  if ((params.scrollRatio || 0) > 0.45 && pool.length > 1) {
    return pool[0];
  }

  const idx = ((params.visits || 1) - 1) % pool.length;
  return pool[pool.length - 1 - idx] || pool[0];
}
