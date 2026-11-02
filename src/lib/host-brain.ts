/**
 * The Host's brain.
 *
 * Rules-based on purpose: it answers only from KR8's own knowledge, it cannot
 * hallucinate a price or a statistic, it costs nothing per message, and it keeps
 * working when every external service is down. Anything it does not know is
 * routed to a human. (Section 16.)
 */

export type Chip = { label: string; value: string };
export type Link = { label: string; href: string; outbound?: boolean };
export type HostState =
  | 'start' | 'business' | 'business_web' | 'business_revenue' | 'business_seo' | 'business_budget'
  | 'learner' | 'learner_track' | 'job' | 'community' | 'exploring' | 'human' | 'done';

export type HostReply = {
  say: string;
  chips: Chip[];
  links?: Link[];
  state: HostState;
  handoff?: boolean;
  suggestHuman?: boolean;
};

type Ctx = { state: HostState; name?: string; topic?: string };

const ACADEMY = 'https://academy.kr8digitals.com';
const APPLY = `${ACADEMY}/apply`;
const TRACKS = `${ACADEMY}/tracks`;

const KNOWLEDGE: { k: string[]; a: string; links?: Link[] }[] = [
  {
    k: ['price', 'cost', 'how much', 'charge', 'rate', 'fee', 'budget'],
    a: 'Websites start at a fixed price per build, and design, video and search work are quoted per scope. I can pass your project to the team for an exact figure — prices are approved by Timfire before they are published, so I will not invent one.',
    links: [{ label: 'Get a quote', href: '/contact' }],
  },
  {
    k: ['free', 'tuition', 'scholarship', 'pay for school', 'academy cost'],
    a: 'KR8 Academy is free. Seven tracks including graphic design, video editing, web development, content creation, social media management and digital marketing. No tuition, and no fee for the certificate or the verifiable KR8 ID at the end.',
    links: [{ label: 'Apply to the Academy', href: APPLY, outbound: true }],
  },
  {
    k: ['track', 'course', 'learn what', 'curriculum', 'design', 'video', 'coding', 'develop'],
    a: 'The Academy runs seven tracks, including Graphic Design with Stevenson of Motion Verse, Video Editing with Daniel of CHIGOMA, Website Development, Front-End Development, Content Creation, Social Media Management and Digital Marketing. Every one is free.',
    links: [{ label: 'See the seven tracks', href: TRACKS, outbound: true }],
  },
  {
    k: ['verify', 'certificate', 'check id', 'kr8 id', 'credential'],
    a: 'Every graduate gets a verifiable KR8 ID. Anyone — an employer included — can check one at the Academy verify page without asking us first.',
    links: [{ label: 'Verify a certificate', href: `${ACADEMY}/verify`, outbound: true }],
  },
  {
    k: ['partner', 'sponsor', 'collaborate', 'hire graduates', 'csr'],
    a: 'Partners teach, fund, hire or host with us. Motion Verse and CHIGOMA teach their crafts free, Next Gen Scholars runs the academic door, and brands fund cohorts, host sessions or hire from the training. There is a page that lays out all four routes.',
    links: [{ label: 'Partnership routes', href: '/partners' }],
  },
  {
    k: ['job', 'work', 'hiring', 'apply team', 'vacancy', 'role', 'salary', 'paid'],
    a: 'The route in is a portfolio review, then live projects with people who have shipped. Open roles are published on the Join the Team page — and if none are listed, write to us anyway; we are always looking at work.',
    links: [{ label: 'Join the team', href: '/about/join-the-team' }],
  },
  {
    k: ['referral', 'commission', 'refer', 'earn', 'affiliate'],
    a: 'Anyone can refer work. You get a personal link and a dashboard. Websites and projects pay 10%, design, video and search pay 8%, small jobs pay 10% with a $20 minimum, and the rate rises to 12% after three paid referrals. Commission is credited once the client has actually paid.',
    links: [{ label: 'How referrals work', href: '/referrals' }],
  },
  {
    k: ['website', 'web', 'site', 'redesign', 'build me'],
    a: 'We build websites that open fast on a phone and are written to make one thing happen — a booking, an enquiry, a sale. Most clients come to us with a site that is losing them customers. We audit it, then rebuild the parts that leak.',
    links: [{ label: 'Website service', href: '/services/website-design' }],
  },
  {
    k: ['video', 'edit', 'motion', 'advert', 'reel'],
    a: 'Video work is led by Daniel under the name CHIGOMA: adverts, social cutdowns, testimonials and motion graphics, cut for retention rather than for a showreel. Four real cuts play on the video service page.',
    links: [{ label: 'Video service', href: '/services/video-editing' }],
  },
  {
    k: ['design', 'brand', 'logo', 'flyer', 'poster'],
    a: 'Brand and graphic design is led by Stevenson of Motion Verse — identity systems, flyers, posters and campaign creative, credited as KR8 Digitals in association with Motion Verse.',
    links: [{ label: 'Brand & design service', href: '/services/brand-graphic-design' }],
  },
  {
    k: ['ai', 'automation', 'agent', 'bot', 'workflow', 'chatbot'],
    a: 'We build AI agents and automated workflows: answering enquiries, qualifying leads, booking appointments and following up. They answer from your own information, hand over to a human mid-conversation, and run inside a spending cap you set. I am a small demonstration of the same idea.',
    links: [{ label: 'AI & automation service', href: '/services/ai-automation' }],
  },
  {
    k: ['seo', 'google', 'found', 'search', 'rank', 'visibility'],
    a: 'Search work starts with the technical foundation — speed, indexing, structure — because nothing else matters if Google cannot read the site. Then local and intent-led pages, then measurable reporting monthly. No one can honestly guarantee a ranking; we guarantee the work.',
    links: [{ label: 'SEO Optimisation', href: '/services/seo' }],
  },
  {
    k: ['tribe', 'community', 'belong', 'friends', 'network'],
    a: 'The Tribe is the community where people who train with us keep working together after the cohort ends: critique, leads, and the company of people building the same thing. It lives at tribe.kr8digitals.com.',
    links: [{ label: 'About the Tribe', href: '/programs#tribe' }],
  },
  {
    k: ['mindset', 'event', 'session', 'speak', 'shift'],
    a: 'Mindset Shift is the gathering we run to change what a young person believes is possible for themselves. Dates, venue and speakers are published on the Programs page as each edition is confirmed.',
    links: [{ label: 'Mindset Shift', href: '/programs#mindset-shift' }],
  },
  {
    k: ['who', 'about', 'founder', 'timfire', 'stevenson', 'daniel', 'company'],
    a: 'KR8 Digitals was founded by Kenneth Timothy Iziogo — Timfire — with co-founders Stevenson of Motion Verse and Daniel of CHIGOMA. Three practitioners, one company.',
    links: [{ label: 'About KR8', href: '/about' }],
  },
  {
    k: ['where', 'location', 'lagos', 'abakaliki', 'address', 'office'],
    a: 'We work with clients and students wherever they are, and the team works round the clock across time zones — so a message at an odd hour is not wasted. I do not have a street address to give you.',
    links: [{ label: 'Contact', href: '/contact' }],
  },
  {
    k: ['contact', 'phone', 'whatsapp', 'email', 'call', 'reach'],
    a: 'The fastest route is WhatsApp — +234 812 568 7509. You can also email kr8digitals01@gmail.com, or send the form on the contact page and the team answers in the order messages arrive.',
    links: [{ label: 'Contact the team', href: '/contact' }],
  },
];

function score(text: string, keys: string[]) {
  let s = 0;
  for (const k of keys) if (text.includes(k)) s += k.includes(' ') ? 3 : 2;
  return s;
}

export function reply(userText: string, ctx: Ctx): HostReply {
  const t = userText.toLowerCase().trim();
  const state = ctx.state;

  // ---- explicit human request always wins -----------------------------
  if (/(human|person|real (person|human)|agent|speak to someone|talk to (someone|timfire|a human)|call me)/.test(t)) {
    return {
      state: 'human',
      say: `Of course. I'm letting the team know now — someone will pick this up here, and you'll see their name and photo when they arrive. If you'd rather not wait, WhatsApp is the fastest line: +234 812 568 7509.`,
      chips: [{ label: 'Open WhatsApp now', value: '__whatsapp' }],
      links: [{ label: 'Contact page', href: '/contact' }],
      handoff: true,
    };
  }

  if (/^(hi|hello|hey|good (morning|afternoon|evening)|how are you)\b/.test(t)) {
    return {
      state: state === 'start' ? 'start' : state,
      say: ctx.name ? `Welcome back, ${ctx.name}. Where were we — or shall we start fresh?` : `Hello. I'm ${'Ada'}, the guide here. Everything on this site has one door for it — tell me which one you need and I'll take you straight there.`,
      chips: SKILL_CHIPS,
    };
  }

  // ---- qualification branches ----------------------------------------
  if (state === 'business') {
    if (/(no website|don't have|dont have|none|not yet|nothing)/.test(t)) {
      return {
        state: 'business_revenue',
        say: `Then we start from zero, which is easier than fixing something broken. Before I point you anywhere: what should the site actually produce for you — enquiries, bookings, online sales, or parents finding your school?`,
        chips: [
          { label: 'Enquiries / leads', value: 'enquiries' },
          { label: 'Bookings or appointments', value: 'bookings' },
          { label: 'Online sales', value: 'sales' },
          { label: 'Being found by parents or patients', value: 'found' },
        ],
      };
    }
    if (/(yes|have one|have a website|already|we have|i have)/.test(t)) {
      return {
        state: 'business_web',
        say: `Good — then the question is not whether it exists but whether it earns. Does your current site bring you enquiries you can trace, or does it mostly sit there?`,
        chips: [
          { label: 'It brings enquiries, but fewer than I want', value: 'few' },
          { label: 'It brings nothing', value: 'nothing' },
          { label: 'I honestly cannot tell', value: 'unknown' },
          { label: 'It is slow and I am embarrassed by it', value: 'slow' },
        ],
      };
    }
    return {
      state: 'business',
      say: `Tell me plainly what the business is, and I'll be specific instead of general.`,
      chips: [
        { label: 'School or college', value: 'school' },
        { label: 'Hospital or clinic', value: 'hospital' },
        { label: 'Shop, food or fashion', value: 'retail' },
        { label: 'Something else', value: 'other' },
      ],
    };
  }

  if (state === 'business_web' || state === 'business_revenue' || state === 'business_seo') {
    if (/(yes|want|interest|tell me|how|show|more|seo|found|google)/.test(t)) {
      return {
        state: 'business_budget',
        say: `Here is the honest version. If nobody can find you on Google and your site takes more than three seconds to load on a phone, everything else you spend on marketing is leaking. We fix the foundation first, then the visibility, then the conversion — in that order. What sort of budget are you working with, roughly?`,
        chips: [
          { label: 'Under $500', value: 'b:500' },
          { label: '$500 – $2,000', value: 'b:2000' },
          { label: '$2,000 – $5,000', value: 'b:5000' },
          { label: 'Above $5,000', value: 'b:5001' },
        ],
        links: [{ label: 'See what we build', href: '/services/website-design' }],
      };
    }
    return {
      state: 'business_seo',
      say: `Then let me ask the question that decides the answer: when somebody who needs exactly what you sell searches for it — not your name, the thing you sell — do you appear?`,
      chips: [
        { label: 'No, not at all', value: 'no' },
        { label: 'Sometimes, far down the page', value: 'sometimes' },
        { label: 'Yes, but the traffic does not convert', value: 'noconvert' },
      ],
    };
  }

  if (state === 'business_budget' || /^\$?\d/.test(t) || /(under|above|between|budget)/.test(t)) {
    return {
      state: 'done',
      say: `That is enough to work with. I'll put a short brief in front of the team with what you've told me, and Timfire will reply with a real scope and a fixed figure — not a range designed to sound agreeable. If you leave an email or a WhatsApp number, it reaches them immediately.`,
      chips: [
        { label: 'Send a quote request', value: '__quote' },
        { label: 'Chat on WhatsApp instead', value: '__whatsapp' },
        { label: 'Show me work you have done', value: '__work' },
      ],
      links: [{ label: 'Get a quote', href: '/contact' }],
    };
  }

  if (state === 'learner' || state === 'learner_track') {
    if (/(design|graphic)/.test(t)) {
      return {
        state: 'done',
        say: `Graphic Design is taught by Stevenson, who runs Motion Verse and does this commercially every week. Eight weeks, live, free. Applications for the fifth cohort are open now — the form takes about four minutes.`,
        chips: [{ label: 'Apply for Graphic Design', value: '__apply' }, { label: 'See all seven tracks', value: '__tracks' }],
        links: [{ label: 'Apply free', href: APPLY, outbound: true }],
      };
    }
    if (/(video|edit|motion)/.test(t)) {
      return {
        state: 'done',
        say: `Video Editing & Animation is taught by Daniel of Creative Expression — the same eye he uses on paid client work. Eight weeks, live, free. You will finish with edits you can show a client, not exercises.`,
        chips: [{ label: 'Apply for Video Editing', value: '__apply' }, { label: 'See all seven tracks', value: '__tracks' }],
        links: [{ label: 'Apply free', href: APPLY, outbound: true }],
      };
    }
    if (/(web|code|develop|frontend|program)/.test(t)) {
      return {
        state: 'done',
        say: `Website Development and Front-End Development run inside the free training, taught on real briefs rather than tutorials. The track list and admissions live on the Academy site.`,
        chips: [{ label: 'Apply for a web track', value: '__apply' }, { label: 'See the tracks', value: '__tracks' }],
        links: [{ label: 'Apply free', href: APPLY, outbound: true }],
      };
    }
    return {
      state: 'learner_track',
      say: `Which craft are you drawn to? Be honest rather than strategic — the people who finish are the ones who actually like the work.`,
      chips: [
        { label: 'Graphic design', value: 'design' },
        { label: 'Video editing', value: 'video' },
        { label: 'Web development', value: 'web' },
        { label: 'Not sure yet', value: 'unsure' },
      ],
      links: [{ label: 'Compare the seven tracks', href: TRACKS, outbound: true }],
    };
  }

  if (state === 'job') {
    return {
      state: 'done',
      say: `The route in is a portfolio review, then live projects with people who have shipped. Roles are published on the Join the Team page as they open — and if none are listed, write to us anyway.`,
      chips: [{ label: 'How joining works', value: '__joining' }, { label: 'See open roles', value: '__roles' }],
      links: [{ label: 'Join the team', href: '/about/join-the-team' }],
    };
  }

  if (state === 'community') {
    return {
      state: 'done',
      say: `The Tribe is the room where people who train with us keep working together — critique, leads and company. It has its own address; I can open it for you.`,
      chips: [{ label: 'Open the Tribe site', value: '__tribe' }, { label: 'See what the Tribe does', value: '__tribepage' }],
      links: [{ label: 'About the Tribe', href: '/programs#tribe' }],
    };
  }

  if (state === 'exploring') {
    return {
      state: 'done',
      say: `Then the short version: KR8 Digitals is a creative company that builds websites, brands, films and systems for clients — and runs free training for the people who want to build them next. Which part is most like you?`,
      chips: SKILL_CHIPS,
      links: [{ label: 'Our work', href: '/services/website-design#work' }],
    };
  }

  // ---- knowledge lookup ----------------------------------------------
  let best: { s: number; item: (typeof KNOWLEDGE)[number] } | null = null;
  for (const item of KNOWLEDGE) {
    const s = score(t, item.k);
    if (s > 0 && (!best || s > best.s)) best = { s, item };
  }
  if (best && best.s >= 2) {
    return { state: 'done', say: best.item.a, chips: NEXT_CHIPS, links: best.item.links };
  }

  // ---- fallback: never a dead end ------------------------------------
  return {
    state: state === 'start' ? 'start' : state,
    say: `I don't want to guess at that one. I can take you to the right door in one step, or I can put a person on it — your choice.`,
    chips: [
      ...SKILL_CHIPS,
      { label: 'Actually, get a human', value: '__human' },
    ],
    suggestHuman: true,
  };
}

export const SKILL_CHIPS: Chip[] = [
  { label: 'I run a business', value: 'business' },
  { label: 'I want to learn', value: 'learner' },
  { label: 'I want work', value: 'job' },
  { label: 'I want community', value: 'community' },
  { label: 'Just looking', value: 'exploring' },
];

const NEXT_CHIPS: Chip[] = [
  { label: 'Get a quote', value: '__quote' },
  { label: 'Learn free', value: '__apply' },
  { label: 'Partnership', value: '__partners' },
  { label: 'Get a human', value: '__human' },
];

export function openers(state: HostState): HostReply {
  switch (state) {
    case 'business':
      return {
        state: 'business',
        say: `Good. Two quick questions and I'll know exactly which service you need. First: do you have a website already?`,
        chips: [
          { label: 'Yes, I have one', value: 'yes' },
          { label: 'No, nothing yet', value: 'no' },
          { label: 'It exists but it is dead', value: 'dead' },
        ],
      };
    case 'learner':
      return {
        state: 'learner_track',
        say: `That is the best reason to be here. Everything the Academy teaches is free — a live cohort, and a verifiable certificate at the end. What draws you?`,
        chips: [
          { label: 'Graphic design', value: 'design' },
          { label: 'Video editing', value: 'video' },
          { label: 'Web development', value: 'web' },
          { label: 'Not sure yet', value: 'unsure' },
        ],
        links: [{ label: 'The seven tracks', href: TRACKS, outbound: true }],
      };
    case 'job':
      return {
        state: 'job',
        say: `We are building one paid team, not a roster of freelancers. Do you want the honest version of how joining works?`,
        chips: [{ label: 'Yes, tell me', value: 'yes' }, { label: 'Just show me the roles', value: '__roles' }],
      };
    case 'community':
      return {
        state: 'community',
        say: `Good answer. The Tribe is open to everyone, including people who have not made anything yet. Shall I add your name for the first wave?`,
        chips: [{ label: 'Yes, add me', value: '__tribe' }, { label: 'Tell me more first', value: '__tribepage' }],
      };
    case 'exploring':
      return {
        state: 'exploring',
        say: `Then wander — but let me point first. KR8 is five things under one roof. Which one should I open?`,
        chips: SKILL_CHIPS,
      };
    default:
      return {
        state: 'start',
        say: `Welcome to KR8 Digitals. I'm Ada — I help people find the right door here. Are you hiring for a project, or looking to learn?`,
        chips: SKILL_CHIPS,
      };
  }
}
