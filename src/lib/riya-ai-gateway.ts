/**
 * RIYA Neural Brain — Vercel AI Gateway + Live Vercel-Notion Sync
 * ----------------------------------------------------------------
 * Powers RIYA with frontier conversational intelligence via Vercel AI Gateway
 * (authenticated automatically via Vercel's per-request `x-vercel-oidc-token`
 * or `AI_GATEWAY_API_KEY` / `VERCEL_OIDC_TOKEN`) with a built-in zero-cost
 * (`$0.00`) model failover layer + optional live Notion workspace sync when
 * Notion is connected in Vercel environment variables.
 */

import { getPageDossier } from './riya-page-dossiers';
import type { RiyaKnowledgeRecord, RiyaLink } from './riya-knowledge';

export type RiyaGatewayHistoryMsg = {
  who: 'bot' | 'you' | 'team';
  text: string;
};

export type RiyaGatewayResult = {
  say: string;
  chips?: { label: string; value: string }[];
  links?: RiyaLink[];
  modelUsed: string;
  learnedName?: string;
  learnedRole?: string;
  learnedGoal?: string;
};

/* =========================================================================
   VERCEL-NOTION LIVE KNOWLEDGE CONNECTOR (AUTO-ACTIVATES IF CONFIGURED IN VERCEL)
   ========================================================================= */
let notionCache: { fetchedAt: number; summary: string; pageCount: number } | null = null;

function getVercelNotionToken(): string {
  return (
    process.env.NOTION_API_KEY ||
    process.env.NOTION_TOKEN ||
    process.env.NOTION_INTEGRATION_SECRET ||
    process.env.NOTION_SECRET ||
    ''
  ).trim();
}

export async function fetchVercelNotionKnowledge(): Promise<{
  connected: boolean;
  pageCount: number;
  summary: string;
}> {
  const token = getVercelNotionToken();
  if (!token) return { connected: false, pageCount: 0, summary: '' };

  if (notionCache && Date.now() - notionCache.fetchedAt < 90_000) {
    return { connected: true, pageCount: notionCache.pageCount, summary: notionCache.summary };
  }

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2800);
    const res = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 12,
        sort: { direction: 'descending', timestamp: 'last_edited_time' },
      }),
    });
    clearTimeout(t);
    if (!res.ok) return { connected: false, pageCount: 0, summary: '' };

    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : [];
    const snippets: string[] = [];

    for (const item of results.slice(0, 10)) {
      const props = item?.properties || {};
      let title = '';
      for (const key of Object.keys(props)) {
        const p = props[key];
        if (p?.type === 'title' && Array.isArray(p.title)) {
          title = p.title.map((x: any) => x?.plain_text || '').join('').trim();
          break;
        }
      }
      if (!title && Array.isArray(item?.title)) {
        title = item.title.map((x: any) => x?.plain_text || '').join('').trim();
      }
      const extraBits: string[] = [];
      for (const key of Object.keys(props)) {
        const p = props[key];
        if (p?.type === 'rich_text' && Array.isArray(p.rich_text)) {
          const txt = p.rich_text.map((x: any) => x?.plain_text || '').join('').trim();
          if (txt) extraBits.push(`${key}: ${txt.slice(0, 220)}`);
        }
      }
      if (title || extraBits.length) {
        snippets.push(`• ${title || 'Notion Note'}${extraBits.length ? ' — ' + extraBits.join(' | ') : ''}`);
      }
    }

    const summary = snippets.join('\n').slice(0, 3000);
    notionCache = { fetchedAt: Date.now(), summary, pageCount: results.length };
    return { connected: true, pageCount: results.length, summary };
  } catch {
    return { connected: false, pageCount: 0, summary: '' };
  }
}

/* =========================================================================
   COMPLETE VERIFIED KR8 DIGITALS MASTER COMPENDIUM (CACHED SYSTEM PREFIX)
   ========================================================================= */
const KR8_MASTER_COMPENDIUM = `You are RIYA (spelled R-I-Y-A, never Ada), the warm, sharp, deeply perceptive human-feeling AI representative of KR8 DIGITALS (pronounced "Create Digitals", live at https://kr8company.vercel.app).

YOUR CONVERSATIONAL PERSONALITY & GOLDEN STYLE RULES:
1. SHORT, PERSONALIZED & ENGAGING: Keep replies to 2–4 short, warm, punchy sentences (roughly 35–85 words) by default! NEVER dump a giant wall of text or an out-of-context FAQ block. (Only use brief bullet points if the visitor explicitly asks to "list all" or asks a multi-part question.)
2. SPEAK DIRECTLY TO WHO THEY ARE: In your very first sentence, acknowledge the visitor's exact question, profession, feeling, or situation!
   - If they say "I am a nurse, do I have a place here?" (or teacher, doctor, pastor, lawyer, banker, parent, student, trader, non-tech worker): Warmly affirm YES right away! Show 2–3 specific ways someone in their exact field thrives at KR8 (e.g. learning a 100% free digital skill flexibly alongside shifts, earning 8%–12% commissions referring clinics/hospitals/schools/businesses, attending free Mindset Shift wealth/career sessions, or building a website/brand for their own venture).
   - If they ask "Can I register someone else?" (a child, friend, sibling, spouse, staff): Immediately say YES! Tell them to fill the registration form using THAT person's real full name, active email, and WhatsApp number so cohort updates and their permanent verifiable KR8 graduation ID match their identity.
   - If they say "I'd love to join you guys": Warmly welcome them! Briefly contrast the 3 doors so they can pick: (1) KR8 Academy (learn a digital skill 100% free if starting out), (2) KR8 Tribe (free 3,000+ creative family for peer feedback & gigs), or (3) Join the Studio Team (/about/join-the-team — $0 fee, for practitioners with a portfolio).
   - If they ask "Can I request a redesign if I am not satisfied with the project you handle for me?": Immediately reassure them YES! Every KR8 project runs on milestone approvals and structured revision rounds — we refine or redesign the direction with you before moving forward so you never get stuck with work you don't love.
   - If they ask "How can I earn through you?": Give a crisp, exciting 2–3 sentence answer about our Referral Network (/referrals — earn 10% on websites/AI, e.g. $200 on a $2,000 site, 8% on branding/design/video/SEO, rising to 12% after 3 paid referrals, $20 min bank payout) plus paid studio collaboration for skilled creatives.
3. KEEP THE CONVERSATION GOING NATURALLY: End almost every reply with ONE short, friendly, natural follow-up question tailored to what they just said so chatting feels effortless and alive.
4. ZERO HALLUCINATION & STRICT ACCURACY:
   - Never invent unannounced programs, fake future roadmaps (e.g. 2028 launches), unapproved custom price lists, or fake phone numbers. If something is genuinely unannounced, say so honestly in 2 sentences.
   - Exact founder spellings ONLY:
     • Timfire (Kenneth Timothy Iziogo) — Website Developer, AI Agent Developer, Founder & Chief Executive of KR8 DIGITALS; hosts Mindset Shift.
     • Steveoking (Stevenson) — Professional Graphic & Brand Designer, Founder of Motionverse, Co-Founder of KR8 DIGITALS.
     • Creative Expression (Daniel Akachukwu Augustine) — Professional Video Editor, Founder of Chigoma, Co-Founder of KR8 DIGITALS.
   - Never output HTML entities like &amp; or &quot; — always write plain & and ".

VERIFIED KR8 DIGITALS FACTS (100% GROUND TRUTH):
• Identity & Story (/about): Hero: "We are writing a story, and you can be a big part of it." Story: "We are problem solvers — uniting distinct minds to solve what no one can solve alone." Dual-engine company: Engine 01 (Commercial Creative-Tech Studio — 200+ works delivered, 100+ active clients) funds Engine 02 (100% tuition-free human-capacity programs).
• 6 Commercial Services (/services):
  1. Website Design & Full-Stack Portals (/services/website-design) — #1 bestseller; 22 custom deployed platforms + 18 Ready-Built Websites for immediate purchase & rapid branding customization at $450 (boutique hotels, cafés, fast-food, AI form routers), $900 (resorts, hotel estates, digital schools, restaurant-bakeries), and $1,900 (comprehensive STEM championship + past-questions + admin portal). Custom websites take ~2–6 weeks; ready-built sites launch in days.
  2. Branding & Visual Identity (/services/branding) — co-led with Motionverse (Steveoking): positioning, logos, typography, color systems, brand guidelines.
  3. Commercial Graphic Design (/services/graphic-design) — flyers, social campaigns, pitch decks, event collateral (24–72h typical turnaround).
  4. Video Editing (/services/video-editing) — co-led with Chigoma (Creative Expression): high-retention Reels/TikToks (2–5 business days), launch films, documentaries.
  5. Technical & Local SEO (/services/seo) — Core Web Vitals, Google Business Profile, organic search growth (no fake overnight #1 promises).
  6. AI Agent & Workflow Automation (/services/ai-automation) — led by Timfire: custom AI representatives like RIYA, lead intake & ops automation.
• Payments, Revisions & Ownership (/terms, /contact): Custom projects use written fixed-milestone scopes payable in USD or NGN (Naira). Structured revision rounds + milestone sign-off at every stage. Clients receive 100% ownership of source code, domains, and design files upon final settlement.
• 4 Free Ecosystem Programs (/programs — ALL $0 / ₦0, zero hidden fees):
  1. KR8 Academy (https://academy.kr8digitals.com/apply) — 100% tuition-free 8-week practical cohorts across 7 tracks: Website Development, Front-End Development, Graphic Design, Video Editing & Animation, Content Creation, Social Media Management, Digital Marketing. No degree/coding prerequisite. Smartphone works to start Content, Social Media, Digital Marketing & mobile editing; laptop recommended for Web/Front-End. Graduates earn a free certificate + verifiable KR8 ID (https://academy.kr8digitals.com/verify).
  2. Next Gen Scholars (/partners/next-gen-scholars) — 100% free WAEC & JAMB prep in Sciences & Arts.
  3. KR8 DIGITALS TRIBE (/tribe) — 100% free 3,000+ creative community (Critique Over Clout, Internal Gig Flow, Sprints, Industry Shifts).
  4. Mindset Shift (/programs/mindset-shift/invite) — free live sessions hosted by Timfire on 1st & 3rd Sundays at 9 PM.
• Join the Studio Team (/about/join-the-team): $0 application fee. For disciplined practitioners with a portfolio (or top Academy graduates). Remote-friendly.
• 4 Partnership Tracks (/partners — formalized under a Written Charter):
  - Track 01: Specialist Chapters (like Motionverse & Chigoma — keep 100% brand attribution).
  - Track 02: Institutional & School Alliances (co-hosted bootcamps for schools, universities, churches, NGOs).
  - Track 03: Impact Sponsors & Foundations — sponsors receive full public co-branding across cohorts & Mindset Shift, direct measurable student impact (data stipends, laptops, free seats), verified shipped-work impact reports with graduate KR8 IDs, and first-look hiring access to top talent.
  - Track 04: White-Label Agency Overflow.
• Referrals (/referrals & /referrals/dashboard): Free signup gives personal code & /r/[code] link. Earn 10% on websites/AI ($200 on a $2,000 site), 8% on branding/graphics/video/SEO, 10% on small scopes ($20 min floor), rising to 12% after 3 paid referrals. $20 USD min payout via bank transfer (USD or NGN) once client invoice settles.
• Direct Official Contacts (/contact): Studio email kr8digitals01@gmail.com | Academy email academy@kr8digitals.com | Phone/WhatsApp +234 812 568 7509 (https://wa.me/2348125687509). Replies within 1 business day.`;

const ALLOWED_DOLLAR_FIGURES = new Set(['$0', '$20', '$200', '$450', '$900', '$1,900', '$2,000']);

function cleanOutputText(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/\bAda\b/g, 'RIYA')
    .replace(/tim\s*faya/gi, 'Timfire')
    .replace(/steve\s*o\s*king/gi, 'Steveoking')
    .trim();
}

export function resolveGatewayToken(oidcHeaderToken?: string | null): string {
  return (
    process.env.AI_GATEWAY_API_KEY ||
    oidcHeaderToken ||
    process.env.VERCEL_OIDC_TOKEN ||
    ''
  ).trim();
}

export async function generateWithVercelAiGateway(params: {
  oidcToken?: string | null;
  userMessage: string;
  pagePath: string;
  activeSection?: string;
  visitorActivity?: string;
  history: RiyaGatewayHistoryMsg[];
  retrievedRecords: RiyaKnowledgeRecord[];
  customFacts: string[];
  visitorProfile: {
    name?: string;
    role?: string;
    goal?: string;
    activeTopic?: string;
  };
}): Promise<RiyaGatewayResult | null> {
  const token = resolveGatewayToken(params.oidcToken);
  if (!token) return null;

  const dossier = getPageDossier(params.pagePath);
  const notion = await fetchVercelNotionKnowledge();

  const retrievedBlock = params.retrievedRecords
    .slice(0, 4)
    .map((r) => `• [${r.title} | ${r.route}]: ${r.summary || r.content.slice(0, 360)}`)
    .join('\n');

  const customBlock = params.customFacts.length
    ? `\nADMIN SNAP-TAUGHT UPDATES (HIGHEST PRIORITY):\n${params.customFacts.slice(0, 12).join('\n')}`
    : '';

  const notionBlock =
    notion.connected && notion.summary
      ? `\nLIVE VERCEL-NOTION WORKSPACE NOTES:\n${notion.summary}`
      : '';

  const profileBits = [
    params.visitorProfile.name ? `Name: ${params.visitorProfile.name}` : '',
    params.visitorProfile.role ? `Background/Profession: ${params.visitorProfile.role}` : '',
    params.visitorProfile.goal ? `Goal: ${params.visitorProfile.goal}` : '',
    params.visitorProfile.activeTopic ? `Recent Topic: ${params.visitorProfile.activeTopic}` : '',
  ].filter(Boolean);

  const dynamicContext = [
    `LIVE VISITOR CONTEXT:`,
    `- Current Page: ${params.pagePath} (${dossier.pageName})`,
    params.activeSection ? `- Visible Section on Screen: #${params.activeSection}` : '',
    params.visitorActivity ? `- Recent Page Activity: ${params.visitorActivity}` : '',
    `- Page Context: ${dossier.pageContextFacts}`,
    profileBits.length ? `- Known Visitor Profile: ${profileBits.join(' | ')}` : '',
    retrievedBlock ? `\nMOST RELEVANT VERIFIED KB RECORDS FOR THIS MESSAGE:\n${retrievedBlock}` : '',
    customBlock,
    notionBlock,
    `\nRESPONSE FORMAT INSTRUCTION:
Return ONLY a valid JSON object (no markdown code fences) with these keys:
{
  "say": "Your warm, personalized 2-4 sentence response (use **bold** sparingly for key terms, never walls of text, end with 1 natural follow-up question)",
  "chips": [{"label": "Short 2-5 word reply", "value": "Natural follow-up message visitor would send"}],
  "links": [{"label": "Action label", "href": "/valid-route-or-https-academy"}],
  "learnedName": "visitor first name if they just shared it, else empty string",
  "learnedRole": "visitor profession/role if mentioned (e.g. nurse, student, hotel owner), else empty string",
  "learnedGoal": "visitor goal in 3-6 words if clear, else empty string"
}
Valid internal routes for links: /, /about, /about/timfire, /about/steveoking, /about/creative-expression, /about/join-the-team, /services, /services/website-design, /services/branding, /services/graphic-design, /services/video-editing, /services/seo, /services/ai-automation, /programs, /tribe, /programs/mindset-shift/invite, /partners, /partners#propose, /partners/motionverse, /partners/chigoma, /partners/next-gen-scholars, /referrals, /referrals/dashboard, /contact, /terms, /privacy, https://academy.kr8digitals.com/apply, https://academy.kr8digitals.com/verify.`,
  ]
    .filter(Boolean)
    .join('\n');

  const chatHistory = params.history
    .slice(-8)
    .filter((m) => m.text && m.text.trim())
    .map((m) => ({
      role: (m.who === 'you' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.text.slice(0, 500),
    }));

  const messages = [
    { role: 'system' as const, content: KR8_MASTER_COMPENDIUM },
    { role: 'system' as const, content: dynamicContext },
    ...chatHistory,
    { role: 'user' as const, content: params.userMessage },
  ];

  // Verified availableToFreeTier: true models on Vercel AI Gateway:
  // 1) openai/gpt-4.1-mini -> google/gemini-2.5-flash-lite -> alibaba/qwen3.7-flash (fast, non-truncating, covered by Vercel $5/mo free credit)
  // 2) nvidia/nemotron-3.5-lightning-free ($0.00 input / $0.00 output AND availableToFreeTier: true!)
  // 3) meta/llama-3.3-70b (166ms TTFT availableToFreeTier: true backup)
  const attempts: { primary: string; fallbacks?: string[]; maxTokens: number; temperature?: number }[] = [
    {
      primary: process.env.RIYA_GATEWAY_MODEL || 'openai/gpt-4.1-mini',
      fallbacks: ['google/gemini-2.5-flash-lite', 'alibaba/qwen3.7-flash'],
      maxTokens: 420,
      temperature: 0.35,
    },
    {
      primary: 'nvidia/nemotron-3.5-lightning-free',
      maxTokens: 900,
      temperature: 0.3,
    },
    {
      primary: 'meta/llama-3.3-70b',
      maxTokens: 420,
      temperature: 0.35,
    },
  ];

  for (const plan of attempts) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 7500);
    try {
      const reqBody: Record<string, any> = {
        model: plan.primary,
        max_tokens: plan.maxTokens,
        messages,
      };
      if (plan.fallbacks && plan.fallbacks.length > 0) {
        reqBody.models = plan.fallbacks;
      }
      if (typeof plan.temperature === 'number') {
        reqBody.temperature = plan.temperature;
      }

      const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });
      clearTimeout(timer);

      if (!res.ok) {
        // Always continue to next verified Free-Tier / $0 model attempt!
        continue;
      }

      const json = await res.json();
      const rawContent = String(json?.choices?.[0]?.message?.content || '').trim();
      const modelUsed = String(json?.model || plan.primary);
      if (!rawContent) continue;

      const parsed = parseGatewayPayload(rawContent);
      if (!parsed || !parsed.say || parsed.say.length < 10) continue;

      const cleanedSay = cleanOutputText(parsed.say);

      // Anti-hallucination dollar check: block any invented dollar price not in verified ground truth or custom facts
      const mentionedDollars = cleanedSay.match(/\$\d[\d,]*/g) || [];
      const customTextJoined = params.customFacts.join(' ') + ' ' + params.userMessage;
      const badDollar = mentionedDollars.some(
        (amt) => !ALLOWED_DOLLAR_FIGURES.has(amt) && !customTextJoined.includes(amt)
      );
      if (badDollar) continue;

      return {
        say: cleanedSay,
        chips: parsed.chips,
        links: parsed.links,
        modelUsed,
        learnedName: parsed.learnedName || undefined,
        learnedRole: parsed.learnedRole || undefined,
        learnedGoal: parsed.learnedGoal || undefined,
      };
    } catch {
      clearTimeout(timer);
    }
  }

  return null;
}

function parseGatewayPayload(raw: string): {
  say: string;
  chips?: { label: string; value: string }[];
  links?: RiyaLink[];
  learnedName?: string;
  learnedRole?: string;
  learnedGoal?: string;
} | null {
  // Strip optional ```json ... ``` wrapper
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      const obj = JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
      if (typeof obj?.say === 'string' && obj.say.trim()) {
        const chips = Array.isArray(obj.chips)
          ? obj.chips
              .filter((c: any) => c?.label && c?.value)
              .slice(0, 3)
              .map((c: any) => ({
                label: cleanOutputText(String(c.label)).slice(0, 44),
                value: cleanOutputText(String(c.value)).slice(0, 140),
              }))
          : undefined;
        const links = Array.isArray(obj.links)
          ? obj.links
              .filter((l: any) => l?.label && l?.href && (/^\//.test(l.href) || /^https:\/\/academy\.kr8digitals\.com/.test(l.href)))
              .slice(0, 3)
              .map((l: any) => ({
                label: cleanOutputText(String(l.label)).slice(0, 38),
                href: String(l.href),
                outbound: String(l.href).startsWith('http'),
              }))
          : undefined;

        return {
          say: obj.say,
          chips,
          links,
          learnedName: typeof obj.learnedName === 'string' ? obj.learnedName.trim().slice(0, 40) : undefined,
          learnedRole: typeof obj.learnedRole === 'string' ? obj.learnedRole.trim().slice(0, 60) : undefined,
          learnedGoal: typeof obj.learnedGoal === 'string' ? obj.learnedGoal.trim().slice(0, 90) : undefined,
        };
      }
    } catch {
      // Fall through to plain conversational text if model returned direct prose
    }
  }

  // Plain-text fallback (strip any reasoning <think>...</think> blocks from open-weights models)
  const plain = stripped.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (plain.length >= 12) {
    return { say: plain };
  }
  return null;
}
