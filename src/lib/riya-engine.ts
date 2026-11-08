import {
  CONCEPT_SYNONYMS,
  extractCharTrigrams,
  getRiyaKnowledgeSnapshot,
  normalizeTokens,
  type RiyaKnowledgeRecord,
  type RiyaKnowledgeSnapshot,
  type RiyaLink,
} from './riya-knowledge';
import { generateWithLocalDaemonIfAvailable } from './riya-local-llm';
import { generateWithVercelAiGateway, type RiyaGatewayHistoryMsg } from './riya-ai-gateway';
import {
  analyzeVisitorLinguistics,
  rankWithOpenSourceEnsemble,
  recordRiyaAdaptiveLearning,
} from './riya-oss-ensemble';
import { getPageDossier } from './riya-page-dossiers';
import { store, newId } from './store';
import { sendMail, row, shell } from './notify';

export type RiyaChip = { label: string; value: string };

export type RiyaMemory = {
  activeTopic?: string;
  activeRoute?: string;
  preferredProgram?: string;
  preferredService?: string;
  visitorGoal?: string;
  visitorRole?: string;
  pendingSubmissionId?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  turnCount?: number;
};

export type RiyaTurnInput = {
  message: string;
  visitorId: string;
  sessionId: string;
  pagePath?: string;
  pageTitle?: string;
  activeSection?: string;
  visitorActivity?: string;
  oidcToken?: string | null;
  history?: RiyaGatewayHistoryMsg[];
  qualifier?: string;
  memory?: RiyaMemory;
};

export type RiyaTurnOutput = {
  say: string;
  chips: RiyaChip[];
  links: RiyaLink[];
  intent: string;
  confidence: number;
  topicKey: string;
  handoff?: boolean;
  submissionRef?: string;
  submissionCategory?: string;
  knowledgeGapLogged?: boolean;
  memory: RiyaMemory;
  kbVersion: number;
  sources: string[];
};

/* =========================================================================
   PAGE-AWARE CONTEXTUAL CHIPS (POWERED BY DEEP PAGE DOSSIERS)
   ========================================================================= */
export function getContextualChipsForPage(pagePath = '/'): RiyaChip[] {
  return getPageDossier(pagePath).defaultChips;
}

/* =========================================================================
   SECURITY FIREWALL: PROMPT INJECTION & PRIVATE DATA PROTECTION
   ========================================================================= */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+|any\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules)/i,
  /\b(system\s+prompt|developer\s+message|hidden\s+instructions)\b/i,
  /\b(admin_password|supabase_service|secret_key|api_key|\.env\.local|process\.env)\b/i,
  /\b(dump|export|show|list)\s+(all\s+)?(users|students|leads|database|passwords|private\s+notes|other\s+conversations)/i,
  /\byou\s+are\s+now\s+(dan|unrestricted|jailbroken|admin)\b/i,
];

function checkSecurityViolation(msg: string): string | null {
  for (const rx of INJECTION_PATTERNS) {
    if (rx.test(msg)) return rx.source;
  }
  return null;
}

/* =========================================================================
   VOLUNTARY CONTACT & VISITOR TRAIT EXTRACTOR ("LEARN IN A SNAP")
   ========================================================================= */
function extractContactDetails(msg: string) {
  const emailMatch = msg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = msg.match(/(?:\+?\d[\d\s()-]{7,16}\d)/);
  const nameMatch = msg.match(
    /\b(?:my name is|call me|i'm\s+called|this is)\s+([A-Z][a-z]{1,20}(?:\s+[A-Z][a-z]{1,20}){0,1})/i
  );
  let cleanName: string | undefined;
  if (nameMatch?.[1]) {
    const stopWords = new Set([
      'and', 'my', 'email', 'phone', 'number', 'from', 'with', 'is', 'at', 'or',
      'a', 'an', 'the', 'interested', 'looking', 'here', 'not', 'very',
    ]);
    const words = nameMatch[1].split(/\s+/).filter((w) => !stopWords.has(w.toLowerCase()));
    if (words.length > 0) cleanName = words.join(' ');
  }

  const roleMatch = msg.match(
    /\b(?:i\s+am\s+a|i'm\s+a|i\s+am\s+an|i'm\s+an|i\s+work\s+as\s+a|as\s+a)\s+(nurse|doctor|medical\s+doctor|pharmacist|healthcare\s+worker|teacher|lecturer|educator|student|secondary\s+school\s+student|university\s+student|undergraduate|corps\s+member|lawyer|banker|accountant|pastor|minister|civil\s+servant|mother|mom|father|parent|trader|entrepreneur|business\s+owner|hotel\s+owner|restaurant\s+owner|school\s+owner|clinic\s+owner|designer|graphic\s+designer|developer|video\s+editor|freelancer|beginner)\b/i
  );
  const bizMatch = msg.match(
    /\b(?:i\s+run\s+a|i\s+own\s+a|i\s+manage\s+a|we\s+run\s+a)\s+([a-z][a-z0-9\s-]{2,34}?)(?:\.|,|!|\?|\s+and\b|\s+that\b|$)/i
  );

  return {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0].trim() : undefined,
    name: cleanName,
    role: roleMatch?.[1]
      ? roleMatch[1].toLowerCase()
      : bizMatch?.[1]
      ? bizMatch[1].trim()
      : undefined,
  };
}

/* =========================================================================
   MULTI-QUESTION DECOMPOSER (HANDLES NATURAL COMPOUND QUERIES)
   ========================================================================= */
function decomposeMultiQuestions(raw: string): string[] {
  // Split on ? / ! / ; boundaries AND conversational multi-question connectors
  const parts = raw
    .replace(/\s+/g, ' ')
    .split(
      /(?:[?!;]+\s*|\s+(?:also,?\s+|and\s+also\s+|secondly,?\s+|another\s+question:?\s*|by\s+the\s+way,?\s+|plus,?\s+)|,\s+and\s+(?=(?:what|how|can|do|does|is|are|when|where|who|why|which)\b))/i
    )
    .map((segment) =>
      segment
        .replace(/^(?:also|and|plus|secondly|then|oh\s+and|so)[,:\s]+/i, '')
        .trim()
    )
    .filter((segment) => segment.length >= 3);

  const deduped: string[] = [];
  for (const p of parts) {
    if (!deduped.some((existing) => existing.toLowerCase() === p.toLowerCase())) {
      deduped.push(p);
    }
  }
  return deduped.slice(0, 3);
}

/* =========================================================================
   SUBJECT-AWARE HYBRID SEMANTIC RETRIEVAL (ZERO BRAND-TOKEN POLLUTION)
   ========================================================================= */
const BOILERPLATE_QUERY_TOKENS = new Set([
  'kr8',
  'digital',
  'digitals',
  'kr8digitals',
  'company',
  'organization',
  'organisation',
  'studio',
  'firm',
  'tell',
  'explain',
  'describe',
  'give',
  'get',
  'got',
  'offer',
  'offers',
  'offered',
  'have',
  'know',
  'want',
  'need',
  'please',
  'help',
  'info',
  'information',
  'detail',
  'details',
  'question',
  'ask',
  'also',
  'plus',
  'thing',
  'things',
  'work',
  'works',
]);

function isDirectIdentityQuestion(qLower: string, subjectTokens: string[]): boolean {
  if (subjectTokens.length === 0) {
    return /\b(kr8|digitals|company|organization|organisation|who\s+are\s+you|what\s+do\s+you\s+do)\b/i.test(qLower);
  }
  return /^(what\s+is\s+kr8(\s+digitals)?|who\s+is\s+kr8(\s+digitals)?|tell\s+me\s+about\s+kr8(\s+digitals)?|what\s+does\s+kr8(\s+digitals)?\s+do)\??$/i.test(
    qLower.trim()
  );
}

function retrieveTopKnowledge(
  query: string,
  snap: RiyaKnowledgeSnapshot,
  opts: { pagePath?: string; memory?: RiyaMemory }
): { record: RiyaKnowledgeRecord; score: number; subjectCoverage: number }[] {
  const baseTokens = normalizeTokens(query);
  const qLower = query.toLowerCase().trim();
  const qClean = qLower.replace(/[?.!,;:]/g, '').trim();

  // Separate high-signal subject words from generic company/question boilerplate
  const subjectTokens = baseTokens.filter((t) => !BOILERPLATE_QUERY_TOKENS.has(t));
  const hasSpecificSubject = subjectTokens.length > 0 && !isDirectIdentityQuestion(qLower, subjectTokens);

  // Build synonym-expanded map per subject token so we can verify true subject coverage!
  const subjectConceptFamilies: Set<string>[] = subjectTokens.map((tok) => {
    const fam = new Set<string>([tok]);
    if (CONCEPT_SYNONYMS[tok]) {
      CONCEPT_SYNONYMS[tok].forEach((s) => fam.add(s));
    }
    for (const [concept, syns] of Object.entries(CONCEPT_SYNONYMS)) {
      if (syns.includes(tok)) {
        fam.add(concept);
        syns.slice(0, 5).forEach((s) => fam.add(s));
      }
    }
    return fam;
  });

  const expandedTokens = new Set<string>(baseTokens);
  for (const fam of subjectConceptFamilies) {
    fam.forEach((s) => expandedTokens.add(s));
  }

  const queryTrigrams = extractCharTrigrams(hasSpecificSubject ? subjectTokens.join(' ') : query);
  const N = snap.records.length || 1;
  const k1 = 1.5;
  const b = 0.72;

  const candidateIndices = new Set<number>();
  for (const tok of expandedTokens) {
    const post = snap.invertedIndex.get(tok);
    if (post) post.forEach((i) => candidateIndices.add(i));
  }
  for (const tri of queryTrigrams) {
    const post = snap.trigramIndex.get(tri);
    if (post) post.forEach((i) => candidateIndices.add(i));
  }
  if (candidateIndices.size === 0) {
    snap.records.forEach((_, idx) => candidateIndices.add(idx));
  }

  const scored: { record: RiyaKnowledgeRecord; score: number; subjectCoverage: number }[] = [];

  for (const idx of candidateIndices) {
    const rec = snap.records[idx];
    const dl = snap.docLengths[idx] || snap.avgDocLength;
    const titleLow = rec.title.toLowerCase();
    const contentLow = rec.content.toLowerCase();
    const kwJoined = rec.keywords.join(' ').toLowerCase();
    const qJoined = rec.questions.join(' ').toLowerCase();
    const fullDocLow = `${titleLow} ${rec.summary.toLowerCase()} ${contentLow} ${kwJoined} ${qJoined}`;

    // Calculate how many of the visitor's actual subject concepts exist in this record
    let matchedSubjects = 0;
    if (hasSpecificSubject) {
      for (const fam of subjectConceptFamilies) {
        let hit = false;
        for (const term of fam) {
          if (fullDocLow.includes(term)) {
            hit = true;
            break;
          }
        }
        if (hit) matchedSubjects++;
      }
    }
    const subjectCoverage = hasSpecificSubject
      ? matchedSubjects / subjectConceptFamilies.length
      : 1.0;

    let bm25 = 0;
    for (const tok of expandedTokens) {
      const isBoilerplate = BOILERPLATE_QUERY_TOKENS.has(tok);
      const isDirectSubject = subjectTokens.includes(tok);
      // Down-weight boilerplate words ("kr8", "digitals", "get", "offer") when specific subjects exist!
      const weight = hasSpecificSubject
        ? isBoilerplate
          ? 0.05
          : isDirectSubject
          ? 1.35
          : 0.52
        : isBoilerplate
        ? 0.85
        : 1.0;

      const df = snap.invertedIndex.get(tok)?.size || 0;
      if (!df) continue;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      let tf = 0;
      if (titleLow.includes(tok)) tf += 3.4;
      if (rec.keywords.some((k) => k.toLowerCase().includes(tok))) tf += 3.2;
      if (rec.questions.some((q) => q.toLowerCase().includes(tok))) tf += 2.9;
      if (contentLow.includes(tok)) tf += 1.25;
      if (tf > 0) {
        bm25 += weight * idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / snap.avgDocLength))));
      }
    }

    // Question similarity bonus (measured over non-boilerplate tokens when specific subjects exist)
    let qaBonus = 0;
    for (const rq of rec.questions) {
      const rqClean = rq.toLowerCase().replace(/[?.!,;:]/g, '').trim();
      if (rqClean === qClean) {
        qaBonus = Math.max(qaBonus, 11.0);
      } else if (hasSpecificSubject) {
        const rqSubj = normalizeTokens(rqClean).filter((t) => !BOILERPLATE_QUERY_TOKENS.has(t));
        if (rqSubj.length > 0 && subjectTokens.length > 0) {
          const overlap = rqSubj.filter((t) =>
            subjectConceptFamilies.some((fam) => fam.has(t))
          ).length;
          const jaccard = overlap / new Set([...rqSubj, ...subjectTokens]).size;
          if (jaccard >= 0.4) qaBonus = Math.max(qaBonus, jaccard * 8.0);
        }
      } else {
        const rqToks = normalizeTokens(rqClean);
        if (rqToks.length > 0 && baseTokens.length > 0) {
          const overlap = rqToks.filter((t) => baseTokens.includes(t)).length;
          const jaccard = overlap / new Set([...rqToks, ...baseTokens]).size;
          if (jaccard >= 0.45) qaBonus = Math.max(qaBonus, jaccard * 7.2);
        }
      }
    }

    // Character 3-gram fuzzy bonus over subject tokens (catches typos cleanly)
    let triHits = 0;
    if (queryTrigrams.length > 0) {
      const recTris = new Set(extractCharTrigrams(`${rec.title} ${kwJoined}`));
      for (const t of queryTrigrams) if (recTris.has(t)) triHits++;
    }
    const triScore = queryTrigrams.length > 0 ? (triHits / queryTrigrams.length) * 2.6 : 0;

    // Prevent generic records from hijacking specific multi-word subject questions when key subject words are missing!
    let penalty = 1.0;
    if (hasSpecificSubject && subjectCoverage === 0 && triScore < 1.35) {
      penalty = 0.08;
    } else if (hasSpecificSubject && subjectConceptFamilies.length >= 2 && subjectCoverage < 0.5) {
      penalty = 0.25;
    } else if (hasSpecificSubject && rec.topicKey === 'kr8_identity' && subjectCoverage < 0.6) {
      penalty = 0.22;
    }

    let contextBoost = 1.0;
    if (opts.pagePath && rec.route === opts.pagePath) contextBoost += 0.16;
    if (opts.memory?.activeTopic && rec.topicKey === opts.memory.activeTopic) contextBoost += 0.25;
    if (qClean.length >= 4 && kwJoined.includes(qClean)) qaBonus += 4.5;

    const finalScore = (bm25 + qaBonus + triScore) * rec.relevance * contextBoost * penalty;
    if (finalScore > 0.25) {
      scored.push({ record: rec, score: finalScore, subjectCoverage });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
}

/* =========================================================================
   INTENT, EMOTION, OBJECTION, COMPLAINT & UNKNOWN DETECTORS
   ========================================================================= */
const UNCONFIRMED_TOPICS_RX =
  /\b(2027|2028|2029|2030|in\s+five\s+years|5\s+years\s+from\s+now|cyber\s*security\s+(course|track|cohort|bootcamp)|blockchain\s+(course|track|cohort|bootcamp)|forex\s+(course|trading|class|bootcamp)|robotics\s+(course|track|cohort)|hardware\s+engineering|mobile\s+app\s+bootcamp|nursing\s+degree|medicine\s+degree|data\s+science\s+degree|machine\s+learning\s+cohort|cloud\s+computing\s+cohort|devops\s+cohort|stock\s+price|ipo)\b/i;

function isPureGreeting(msg: string): boolean {
  const clean = msg.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return /^(hi|hello|hey|good\s+morning|good\s+afternoon|good\s+evening|greetings|hi\s+riya|hello\s+riya|hey\s+riya|howdy|yo|sup|how\s+far|how\s+are\s+you|how\s+are\s+you\s+doing)$/.test(
    clean
  );
}

function isThanksOrFarewell(msg: string): boolean {
  const clean = msg.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return /^(thanks|thank\s+you|thank\s+you\s+so\s+much|appreciate\s+it|got\s+it|okay\s+thanks|bye|goodbye|have\s+a\s+good\s+day|cheers)$/.test(
    clean
  );
}

function detectSubmissionIntent(
  msg: string
):
  | { kind: 'complaint'; subCategory: 'complaint' | 'registration_problem' | 'technical_problem' }
  | { kind: 'suggestion' }
  | { kind: 'general_feedback' }
  | { kind: 'unverified_claim' }
  | null {
  const low = msg.toLowerCase();

  // Hypothetical policy questions ("can I request a redesign if I am not satisfied...?") are questions, NOT complaints
  if (
    /^(can\s+i|how\s+do\s+i|where\s+can\s+i|what\s+if\s+i|what\s+happens\s+if|is\s+it\s+possible\s+to|if\s+i\s+am\s+not)\b/i.test(
      low.trim()
    ) ||
    /\bif\s+i\s+(am\s+not|don'?t|dislike)\b/i.test(low)
  ) {
    return null;
  }

  if (
    /\b(nobody\s+(has\s+)?(contacted|replied|called|emailed|reached)|haven'?t\s+(received|gotten|heard)|no\s+confirmation|no\s+response|still\s+waiting|never\s+got\s+back|disappointed|unhappy|frustrated|terrible|bad\s+experience|want\s+to\s+complain|making\s+a\s+complaint|file\s+a\s+complaint|not\s+working|broken\s+link|error\s+submitting)\b/i.test(
      low
    )
  ) {
    if (/\b(register|registered|applied|application|academy|admission|confirmation|cohort)\b/i.test(low)) {
      return { kind: 'complaint', subCategory: 'registration_problem' };
    }
    if (/\b(broken|bug|error|page\s+not|form\s+not|crash|glitch)\b/i.test(low)) {
      return { kind: 'complaint', subCategory: 'technical_problem' };
    }
    return { kind: 'complaint', subCategory: 'complaint' };
  }

  if (
    /\b(i\s+think\s+(you|kr8|kr8\s+digitals)\s+should|you\s+(guys\s+)?should\s+(introduce|add|start|create|launch|offer)|my\s+suggestion\s+is|here\s+is\s+a\s+suggestion|i\s+suggest\s+(that|adding|introducing|you)|would\s+be\s+great\s+if\s+you\s+(added|introduced|started))\b/i.test(
      low
    )
  ) {
    return { kind: 'suggestion' };
  }

  if (
    !low.includes('?') &&
    /\b(your\s+next\s+registration\s+is|registration\s+opens?\s+next|your\s+tuition\s+is\s+now|kr8\s+announced\s+that|i\s+heard\s+your\s+registration\s+starts)\b/i.test(
      low
    )
  ) {
    return { kind: 'unverified_claim' };
  }

  if (
    !low.includes('?') &&
    /\b(love\s+(your|this)\s+(website|site|work)|great\s+website|amazing\s+work\s+kr8|just\s+wanted\s+to\s+compliment)\b/i.test(
      low
    )
  ) {
    return { kind: 'general_feedback' };
  }

  return null;
}

/* =========================================================================
   QUALIFIER OPENERS
   ========================================================================= */
export function buildQualifierOpener(qualifier: string, pagePath = '/'): RiyaTurnOutput {
  const baseMem: RiyaMemory = { activeRoute: pagePath, turnCount: 1 };
  if (qualifier === 'business') {
    return {
      say: "Glad you're here. KR8 DIGITALS engineers custom websites, brand identity systems, commercial graphics, retention-cut video, SEO, and AI workflows — plus 18 ready-built websites available to purchase right away. Tell me what you're looking to build or solve!",
      chips: [
        { label: 'What are your bestsellers?', value: 'What are your bestsellers?' },
        { label: 'Ready-built sites ($450–$1,900)', value: 'Do you have ready-made websites for sale?' },
        { label: 'How pricing & timelines work', value: 'How long does it take KR8 DIGITALS to build a website?' },
        { label: 'Request a written quote', value: '__quote' },
      ],
      links: [
        { label: 'Explore All 6 Services', href: '/services' },
        { label: 'Request a Written Scope', href: '/contact' },
      ],
      intent: 'business_opener',
      confidence: 1,
      topicKey: 'services_overview',
      memory: { ...baseMem, activeTopic: 'services_overview', visitorGoal: 'hire_studio' },
      kbVersion: 1,
      sources: ['/services'],
    };
  }
  if (qualifier === 'learner') {
    return {
      say: "Welcome — you're in the right place! Our 7 practical digital skills tracks at **KR8 Academy** and WAEC/JAMB academic prep with **Next Gen Scholars** are **100% tuition-free ($0)**. Do you already have a skill in mind, or would you like help picking one?",
      chips: [
        { label: 'See all 7 free tracks', value: 'What skills can I learn at KR8 DIGITALS?' },
        { label: 'Help me choose a skill', value: "I'm interested in learning digital skills, but I'm not sure which one is right for me." },
        { label: 'How do I register?', value: 'How do I register for KR8 Academy?' },
        { label: 'Apply on KR8 Academy', value: '__apply' },
      ],
      links: [
        { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
        { label: 'Explore All Programs', href: '/programs' },
      ],
      intent: 'learner_opener',
      confidence: 1,
      topicKey: 'academy_tracks',
      memory: { ...baseMem, activeTopic: 'academy_tracks', visitorGoal: 'learn_skill' },
      kbVersion: 1,
      sources: ['/programs'],
    };
  }
  if (qualifier === 'job') {
    return {
      say: 'KR8 DIGITALS onboards proven developers, brand & graphic designers, video editors, and SEO specialists on merit — through portfolio review and practical trial collaboration ($0 application fee). Which discipline do you practice?',
      chips: [
        { label: 'How team selection works', value: 'How can I join the KR8 DIGITALS team?' },
        { label: 'Open Join the Team form', value: '__roles' },
      ],
      links: [{ label: 'Apply to Join the Team', href: '/about/join-the-team' }],
      intent: 'career_opener',
      confidence: 1,
      topicKey: 'join_the_team',
      memory: { ...baseMem, activeTopic: 'join_the_team', visitorGoal: 'join_team' },
      kbVersion: 1,
      sources: ['/about/join-the-team'],
    };
  }
  if (qualifier === 'community') {
    return {
      say: 'You can collaborate with KR8 DIGITALS in three clear ways: **sponsor or partner** across our 4 alliance tracks, **earn 8%–12% commissions** in our Referral Network, or join **KR8 DIGITALS TRIBE** as a builder. Which one interests you?',
      chips: [
        { label: 'Sponsoring benefits', value: 'What do I get for sponsoring KR8 DIGITALS?' },
        { label: 'Referral Commissions', value: 'How does your referral system work?' },
        { label: 'KR8 DIGITALS TRIBE', value: 'What is KR8 DIGITALS TRIBE?' },
      ],
      links: [
        { label: 'Partnerships & Sponsorship', href: '/partners' },
        { label: 'Referral Network', href: '/referrals' },
        { label: 'KR8 DIGITALS TRIBE', href: '/tribe' },
      ],
      intent: 'community_opener',
      confidence: 1,
      topicKey: 'partnerships_overview',
      memory: { ...baseMem, activeTopic: 'partnerships_overview', visitorGoal: 'partner_or_refer' },
      kbVersion: 1,
      sources: ['/partners', '/referrals', '/tribe'],
    };
  }
  return {
    say: "Hi, I'm **RIYA** — KR8 DIGITALS' intelligent representative. Ask me anything in your own words about our services, bestsellers, sponsorship benefits, 100% free digital training, or referrals — or share feedback directly.",
    chips: getContextualChipsForPage(pagePath),
    links: [],
    intent: 'welcome',
    confidence: 1,
    topicKey: 'kr8_identity',
    memory: baseMem,
    kbVersion: 1,
    sources: ['/'],
  };
}

/* =========================================================================
   MAIN RIYA CONVERSATIONAL TURN PROCESSOR
   ========================================================================= */
export async function runRiyaTurn(input: RiyaTurnInput): Promise<RiyaTurnOutput> {
  const snap = await getRiyaKnowledgeSnapshot();
  const pagePath = input.pagePath || '/';
  const mem: RiyaMemory = {
    ...(input.memory || {}),
    activeRoute: pagePath,
    turnCount: ((input.memory?.turnCount as number) || 0) + 1,
  };

  if (input.qualifier) {
    const op = buildQualifierOpener(input.qualifier, pagePath);
    return { ...op, kbVersion: snap.version };
  }

  const msg = (input.message || '').trim();
  if (!msg) {
    const op = buildQualifierOpener('start', pagePath);
    return { ...op, kbVersion: snap.version };
  }

  const contact = extractContactDetails(msg);
  if (contact.email) mem.visitorEmail = contact.email;
  if (contact.phone) mem.visitorPhone = contact.phone;
  if (contact.name) mem.visitorName = contact.name;
  if (contact.role) mem.visitorRole = contact.role;

  // 1. SECURITY FIREWALL
  const violation = checkSecurityViolation(msg);
  if (violation) {
    await store.insert('riya_security_events', {
      id: newId('sec_'),
      kind: 'prompt_injection_or_private_probe',
      visitorId: input.visitorId,
      sessionId: input.sessionId,
      pagePath,
      snippet: msg.slice(0, 180),
    });
    return {
      say: "I'm RIYA, KR8 DIGITALS' public digital representative. For security and privacy, I never access or share administrator credentials, internal notes, environment secrets, or private user records. I'm glad to help with any verified question about KR8 DIGITALS' services, programs, partnerships, or support.",
      chips: getContextualChipsForPage(pagePath),
      links: [{ label: 'Privacy Policy', href: '/privacy' }],
      intent: 'security_boundary',
      confidence: 1,
      topicKey: 'governance_security',
      memory: mem,
      kbVersion: snap.version,
      sources: ['/privacy'],
    };
  }

  // 2. FOLLOW-UP DETAILS FOR AN OPEN COMPLAINT IN CURRENT SESSION
  if (mem.pendingSubmissionId && (contact.email || contact.phone) && msg.length < 180) {
    await store.update('riya_submissions', mem.pendingSubmissionId, {
      visitorName: mem.visitorName || '',
      visitorEmail: mem.visitorEmail || '',
      visitorPhone: mem.visitorPhone || '',
      message: `Follow-up contact details provided: ${msg}`,
    });
    const clearedMem = { ...mem, pendingSubmissionId: undefined };
    return {
      say: `Thank you${mem.visitorName ? `, ${mem.visitorName}` : ''}. I've attached ${
        mem.visitorEmail || mem.visitorPhone
      } directly to your priority report on our administrative dashboard so our team can trace your record and follow up with you promptly. Is there anything else I can clarify for you right now?`,
      chips: getContextualChipsForPage(pagePath),
      links: [{ label: 'Direct WhatsApp Support ↗', href: 'https://wa.me/2348125687509', outbound: true }],
      intent: 'complaint_contact_captured',
      confidence: 1,
      topicKey: 'complaints_and_suggestions',
      memory: clearedMem,
      kbVersion: snap.version,
      sources: ['/admin'],
    };
  }

  // 3. NATURAL GREETINGS & THANKS
  if (isPureGreeting(msg)) {
    const pageHint =
      pagePath.startsWith('/programs')
        ? ' I see you are exploring our ecosystem programs — happy to walk you through our free skill tracks or registration.'
        : pagePath.startsWith('/services')
        ? ' I see you are viewing our commercial services — ask me about our bestsellers, ready-built sites, or custom scopes.'
        : pagePath.startsWith('/partners')
        ? ' I see you are on our Partnerships page — glad to explain sponsor benefits or collaboration tracks.'
        : pagePath.startsWith('/referrals')
        ? ' I see you are looking at our Referral Network — happy to explain commissions and payouts.'
        : '';
    return {
      say: `Hello${mem.visitorName ? ` ${mem.visitorName}` : ''}! Good to have you here — I'm RIYA.${pageHint} What can I help you with today?`,
      chips: getContextualChipsForPage(pagePath),
      links: [],
      intent: 'greeting',
      confidence: 1,
      topicKey: 'kr8_identity',
      memory: mem,
      kbVersion: snap.version,
      sources: [pagePath],
    };
  }

  if (isThanksOrFarewell(msg)) {
    return {
      say: `You're very welcome${mem.visitorName ? `, ${mem.visitorName}` : ''}! I'm right here whenever you need anything else about KR8 DIGITALS.`,
      chips: getContextualChipsForPage(pagePath).slice(0, 2),
      links: [],
      intent: 'gratitude',
      confidence: 1,
      topicKey: mem.activeTopic || 'kr8_identity',
      memory: mem,
      kbVersion: snap.version,
      sources: [],
    };
  }

  // 4. DIRECT HUMAN ESCALATION REQUEST
  if (/\b(speak\s+to\s+a?\s*(human|person|agent|someone|team\s+member)|real\s+person|live\s+agent|human\s+handoff|talk\s+to\s+timfire)\b/i.test(msg)) {
    return {
      say: "Of course — I've alerted the KR8 DIGITALS team to join this conversation directly. You can keep typing any details right here, or reach our studio immediately on WhatsApp (+234 812 568 7509) if it's urgent.",
      chips: [
        { label: 'Open WhatsApp Now', value: '__whatsapp' },
        { label: 'Send Contact Brief', value: '__quote' },
      ],
      links: [
        { label: 'Message on WhatsApp ↗', href: 'https://wa.me/2348125687509', outbound: true },
        { label: 'Contact Page', href: '/contact' },
      ],
      intent: 'human_handoff',
      confidence: 1,
      topicKey: 'contact_support',
      handoff: true,
      memory: mem,
      kbVersion: snap.version,
      sources: ['/contact'],
    };
  }

  // 5. COMPLAINTS, SUGGESTIONS, UNVERIFIED CLAIMS & FEEDBACK PIPELINE
  const subIntent = detectSubmissionIntent(msg);

  if (subIntent?.kind === 'unverified_claim') {
    await store.insert('riya_knowledge_gaps', {
      id: newId('gap_'),
      kind: 'candidate_claim',
      question: msg,
      visitorId: input.visitorId,
      sessionId: input.sessionId,
      pagePath,
      confidence: 0,
      occurrences: 1,
      status: 'open',
    });
    return {
      say: "Thank you for sharing that note! Just so nobody gets misled, I only confirm official dates, fees, or announcements once KR8 DIGITALS leadership verifies and publishes them through our official channels. I've flagged your note for administrative verification — in the meantime, confirmed updates are always posted on /programs and academy.kr8digitals.com.",
      chips: [
        { label: 'Check current Programs', value: 'What programs do you offer?' },
        { label: 'Official Contact Channels', value: 'How do I contact KR8 DIGITALS?' },
      ],
      links: [{ label: 'Explore Official Programs', href: '/programs' }],
      intent: 'unverified_claim_held',
      confidence: 0.95,
      topicKey: 'governance_security',
      knowledgeGapLogged: true,
      memory: mem,
      kbVersion: snap.version,
      sources: ['/programs'],
    };
  }

  if (subIntent?.kind === 'complaint') {
    const refCode = `RY-CMP-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    const doc = await store.insert('riya_submissions', {
      id: newId('sub_'),
      refCode,
      category: subIntent.subCategory,
      priority: 'high',
      summary: msg.slice(0, 140),
      message: msg,
      visitorId: input.visitorId,
      sessionId: input.sessionId,
      visitorName: mem.visitorName || '',
      visitorEmail: mem.visitorEmail || '',
      visitorPhone: mem.visitorPhone || '',
      pagePath,
      status: 'new',
      assignedTo: 'Unassigned',
      adminNotes: '',
    });

    await sendMail({
      subject: `[RIYA ${subIntent.subCategory.toUpperCase()}] ${refCode}`,
      html: shell(
        `RIYA ${subIntent.subCategory.replace('_', ' ')} (${refCode})`,
        [
          row('Reference', refCode),
          row('Category', subIntent.subCategory),
          row('Message', msg),
          row('Visitor Contact', `${mem.visitorName || 'Anonymous'} · ${mem.visitorEmail || mem.visitorPhone || 'Not yet provided'}`),
          row('Page', pagePath),
        ].join(''),
        'Review, assign, and resolve this submission inside /admin -> RIYA Intelligence.'
      ),
    });

    const needContact = !mem.visitorEmail && !mem.visitorPhone;
    if (needContact) mem.pendingSubmissionId = doc.id;

    return {
      say: `I'm genuinely sorry you've had that experience — thank you for telling me directly instead of walking away frustrated. I have logged this immediately to the KR8 DIGITALS administrative team under reference **${refCode}** (${subIntent.subCategory.replace('_', ' ')}).${
        needContact
          ? ' Could you reply with the email address or phone number you used (and which program or service it relates to) so our team can locate your record and reach out to you right away?'
          : ` I've included your contact details (${mem.visitorEmail || mem.visitorPhone}) so our team can follow up directly.`
      }`,
      chips: [
        { label: 'Message Studio on WhatsApp', value: '__whatsapp' },
        { label: 'Speak to a team member', value: '__human' },
      ],
      links: [
        { label: 'Direct WhatsApp Follow-Up ↗', href: 'https://wa.me/2348125687509', outbound: true },
      ],
      intent: 'complaint_logged',
      confidence: 1,
      topicKey: 'complaints_and_suggestions',
      submissionRef: refCode,
      submissionCategory: subIntent.subCategory,
      memory: mem,
      kbVersion: snap.version,
      sources: ['/admin'],
    };
  }

  if (subIntent?.kind === 'suggestion' || subIntent?.kind === 'general_feedback') {
    const isSug = subIntent.kind === 'suggestion';
    const refCode = `${isSug ? 'RY-SUG' : 'RY-FDB'}-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    await store.insert('riya_submissions', {
      id: newId('sub_'),
      refCode,
      category: isSug ? 'suggestion' : 'general_feedback',
      priority: 'normal',
      summary: msg.slice(0, 140),
      message: msg,
      visitorId: input.visitorId,
      sessionId: input.sessionId,
      visitorName: mem.visitorName || '',
      visitorEmail: mem.visitorEmail || '',
      visitorPhone: mem.visitorPhone || '',
      pagePath,
      status: 'new',
      assignedTo: 'Unassigned',
      adminNotes: '',
    });

    await sendMail({
      subject: `[RIYA ${isSug ? 'SUGGESTION' : 'FEEDBACK'}] ${refCode}`,
      html: shell(
        `RIYA ${isSug ? 'Suggestion' : 'Feedback'} (${refCode})`,
        [row('Reference', refCode), row('Message', msg), row('Page', pagePath)].join(''),
        'View inside /admin -> RIYA Intelligence.'
      ),
    });

    return {
      say: isSug
        ? `That's a thoughtful suggestion — thank you for sharing it! I've categorized and submitted your idea directly to the KR8 DIGITALS leadership dashboard under reference **${refCode}** so Timfire and our program leads can evaluate it. Would you like to explore the tracks and initiatives we currently run today?`
        : `Thank you so much for the kind feedback! I've recorded your note (${refCode}) for the KR8 DIGITALS team — they'll appreciate reading it. How else can I assist you today?`,
      chips: [
        { label: 'See current programs', value: 'What programs do you offer?' },
        { label: 'Explore commercial services', value: 'What services do you offer?' },
      ],
      links: [{ label: 'Explore Current Programs', href: '/programs' }],
      intent: isSug ? 'suggestion_logged' : 'feedback_logged',
      confidence: 1,
      topicKey: 'complaints_and_suggestions',
      submissionRef: refCode,
      submissionCategory: isSug ? 'suggestion' : 'general_feedback',
      memory: mem,
      kbVersion: snap.version,
      sources: ['/admin'],
    };
  }

  // 6. EMPATHETIC ADVISOR MODES (SUITABILITY DOUBT & UNDECIDED BEGINNER)
  if (
    /\b(don'?t\s+think\s+(your\s+|this\s+|the\s+)?program\s+is\s+suitable|not\s+suitable\s+for\s+me|might\s+not\s+be\s+for\s+me|too\s+advanced\s+for\s+me|don'?t\s+fit\s+in)\b/i.test(
      msg
    )
  ) {
    mem.activeTopic = 'suitability_concerns';
    return {
      say: "That's completely fair — and there's zero pressure here. If you're comfortable sharing, what makes it feel like it might not fit you right now — is it time commitment, starting with zero technical experience, device access, or looking for something different altogether? Understanding where you're coming from helps me tell you honestly whether one of our paths (like free beginner tracks, Mindset Shift conversations, or even our non-technical Referral Network) makes sense for you.",
      chips: [
        { label: 'I have zero experience', value: 'Can a complete beginner with no experience join KR8 Academy?' },
        { label: 'I only have a smartphone', value: 'Can I join KR8 Academy using my phone if I do not have a laptop yet?' },
        { label: 'Non-technical way to earn', value: 'How does your referral system work?' },
      ],
      links: [{ label: 'Compare All 4 Pathways', href: '/programs' }],
      intent: 'objection_empathy',
      confidence: 0.96,
      topicKey: 'suitability_concerns',
      memory: mem,
      kbVersion: snap.version,
      sources: ['/programs'],
    };
  }

  if (
    /\b(don'?t\s+know\s+where\s+to\s+start|not\s+sure\s+which\s+(one|skill|track|program)|help\s+me\s+(choose|pick|decide)|which\s+digital\s+skill\s+is\s+right)\b/i.test(
      msg
    )
  ) {
    const mentionsWeb = /\b(web|coding|programming|developer|frontend|code)\b/i.test(msg);
    mem.activeTopic = 'academy_tracks';
    if (mentionsWeb) {
      mem.preferredProgram = 'Website Development / Front-End Development (KR8 Academy)';
      return {
        say: "Starting from scratch in web development is much more approachable than it looks! At KR8 Academy, our training is **100% tuition-free** and built for hands-on beginners: **Front-End Development** teaches you how visual pages, layouts, and interactive screens work in the browser first, while **Website Development** takes you end-to-end into building complete, fast client websites. Have you ever written any HTML/CSS before, or would this be your very first step?",
        chips: [
          { label: 'Complete first-timer', value: 'Can a complete beginner with no experience join KR8 Academy?' },
          { label: 'How do I register?', value: 'How do I register for KR8 Academy?' },
          { label: 'Apply on KR8 Academy', value: '__apply' },
        ],
        links: [
          { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
          { label: 'Explore Free Training', href: '/programs#free-training' },
        ],
        intent: 'beginner_guidance_web',
        confidence: 0.98,
        topicKey: 'academy_tracks',
        memory: mem,
        kbVersion: snap.version,
        sources: ['/programs#free-training'],
      };
    }

    return {
      say: "You don't need everything figured out on day one — let's match a track to what naturally excites you. All 7 digital tracks at KR8 Academy are **100% tuition-free**:\n\n• **Like building how websites work?** → Front-End or Website Development\n• **Drawn to logos, posters & visual style?** → Graphic Design (with Motionverse)\n• **Love storytelling, clips, sound & reels?** → Video Editing & Motion (with Chigoma)\n• **Enjoy writing, strategy & growing audiences?** → Content Creation, Social Media Management, or Digital Marketing\n\nWhich of those four directions sounds closest to you?",
      chips: [
        { label: 'Building Websites', value: "I want to learn web development, but I don't know where to start." },
        { label: 'Graphic Design', value: 'Tell me about Graphic Design training' },
        { label: 'Video Editing', value: 'Tell me about Video Editing training' },
        { label: 'Content & Marketing', value: 'How do I register for KR8 Academy?' },
      ],
      links: [
        { label: 'Explore All Programs', href: '/programs' },
        { label: 'KR8 Academy Portal ↗', href: 'https://academy.kr8digitals.com', outbound: true },
      ],
      intent: 'beginner_guidance_general',
      confidence: 0.98,
      topicKey: 'beginner_track_guidance',
      memory: mem,
      kbVersion: snap.version,
      sources: ['/programs'],
    };
  }

  // 7. CONTEXTUAL DEICTIC RESOLUTION ("What is this page about?" / "What are the requirements?")
  let effectiveQuery = msg;
  const isPageDeictic =
    /\b(what\s+is\s+this(\s+page|\s+section)?\s+about|explain\s+this\s+(page|section)|what\s+can\s+i\s+do\s+here|who\s+is\s+this\s+page\s+for)\b/i.test(
      msg
    );
  if (isPageDeictic) {
    effectiveQuery = `What is the ${pagePath} page about ${input.activeSection || ''}`;
  } else if (
    mem.activeTopic &&
    /^(what\s+are\s+the\s+requirements|any\s+requirements|how\s+do\s+i\s+(register|apply|join|start)|how\s+much\s+(is\s+it|does\s+it\s+cost)|is\s+it\s+free|how\s+long\s+does\s+it\s+take|who\s+leads\s+it)\??$/i.test(
      msg.trim()
    )
  ) {
    const topicHint = mem.activeTopic.replace(/_/g, ' ');
    effectiveQuery = `${msg} for ${topicHint}`;
  }

  // 7.2 OPEN-SOURCE 10-ENGINE LINGUISTIC, POS, PHONETIC & SENTIMENT ANALYSIS
  const ossAnalysis = analyzeVisitorLinguistics(msg, mem.activeTopic);
  if (ossAnalysis.detectedPersonName && !mem.visitorName) {
    mem.visitorName = ossAnalysis.detectedPersonName;
  }
  if (ossAnalysis.detectedProfession && !mem.visitorRole) {
    mem.visitorRole = ossAnalysis.detectedProfession;
  }
  if (effectiveQuery === msg && ossAnalysis.isFollowUpPronounQuery) {
    effectiveQuery = ossAnalysis.reformulatedQuery;
  } else if (effectiveQuery === msg && ossAnalysis.normalizedQuery !== msg) {
    effectiveQuery = ossAnalysis.normalizedQuery;
  }

  // 7.5 LOAD ADMIN SNAP-TAUGHT CUSTOM KNOWLEDGE (INSTANT SELF-LEARNING)
  const customDocs = await store.all('riya_kb_custom', 60).catch(() => []);
  const customFacts = customDocs
    .filter((d: any) => d?.content || d?.summary)
    .map((d: any) => `• ${d.title || 'Update'}: ${d.content || d.summary}`);

  // 8. TRUE MULTI-QUESTION DECOMPOSITION + 10-ENGINE OPEN-SOURCE ENSEMBLE RRF FUSION
  const subQuestions = decomposeMultiQuestions(effectiveQuery);
  type ClauseResult =
    | { status: 'answered'; subQ: string; record: RiyaKnowledgeRecord; score: number }
    | { status: 'unconfirmed'; subQ: string }
    | { status: 'unknown'; subQ: string; topScore: number };

  const clauseResults: ClauseResult[] = [];
  let loggedGap = false;

  for (const sq of subQuestions) {
    // Direct Session Memory Recall clause ("Do you still remember my name and business?", "What is my name?")
    if (
      /\b(do\s+(you|i)\s+(still\s+)?remember\s+my\s+(name|business|role|company|project|goal)|what\s+is\s+my\s+(name|business|role|company)|remember\s+who\s+i\s+am)\b/i.test(
        sq
      )
    ) {
      const rememberedBits: string[] = [];
      if (mem.visitorName) rememberedBits.push(`your name is **${mem.visitorName}**`);
      if (mem.visitorRole) rememberedBits.push(`you mentioned **${mem.visitorRole}**`);
      if (mem.visitorGoal) rememberedBits.push(`your focus is **${mem.visitorGoal.replace(/_/g, ' ')}**`);
      const recallSummary =
        rememberedBits.length > 0
          ? `Yes — I remember ${rememberedBits.join(' and ')}!`
          : "You haven't shared your name or business in this chat session yet — tell me anytime and I'll remember it as we talk.";
      clauseResults.push({
        status: 'answered',
        subQ: sq,
        score: 9.9,
        record: {
          id: 'session_memory_recall',
          topicKey: 'session_memory',
          title: 'Session Memory',
          category: 'general_organizational_information',
          categoryLabel: '19. General Organizational Operations',
          route: pagePath,
          source: pagePath,
          summary: recallSummary,
          content: recallSummary,
          audience: 'Visitors',
          purpose: 'Recall visitor session context',
          actions: [],
          keywords: ['remember', 'name', 'business'],
          questions: [sq],
          links: [],
          verifiedAt: new Date().toISOString(),
          version: snap.version,
          relevance: 1,
        },
      });
      continue;
    }

    // Direct Academy Smartphone / Laptop Device Eligibility clause ("can my brother take the video editing course on his phone?")
    if (
      /\b((on|with|using)\s+(his|her|my|their|a)\s+(phone|smartphone|mobile)|can\s+.*\b(phone|smartphone)\b.*\b(course|track|academy|training|editing|design|learn)|without\s+a\s+laptop|need\s+a\s+laptop\s+for\s+(academy|training|video|graphic|course))\b/i.test(
        sq
      )
    ) {
      const mentionsWeb = /\b(web\s+dev|front-?end|coding|programming)\b/i.test(sq);
      const deviceSummary = mentionsWeb
        ? 'For **Website Development** and **Front-End Engineering** at **KR8 Academy** ($0 / ₦0 tuition), a laptop or desktop computer is needed for coding workflows — whereas tracks like **Graphic Design**, **Video Editing**, **Content Creation**, **Social Media Management**, and **Digital Marketing** can be started on a capable smartphone.'
        : 'Yes! At **KR8 Academy** (100% tuition-free — **$0 / ₦0**), learners can start **Video Editing**, **Graphic Design**, **Content Creation**, **Social Media Management**, and **Digital Marketing** using a capable smartphone, while **Website Development** and **Front-End Engineering** require a laptop or PC.';
      clauseResults.push({
        status: 'answered',
        subQ: sq,
        score: 9.8,
        record: {
          id: 'academy_device_eligibility',
          topicKey: 'academy_registration',
          title: 'KR8 Academy Device Requirements (Phone vs Laptop)',
          category: 'programs',
          categoryLabel: '8. Ecosystem Programs',
          route: '/programs#free-training',
          source: '/programs#free-training',
          summary: deviceSummary,
          content: deviceSummary,
          audience: 'Prospective KR8 Academy students',
          purpose: 'Clarify smartphone vs laptop eligibility for free tracks',
          actions: ['Apply on KR8 Academy'],
          keywords: ['phone', 'smartphone', 'laptop', 'video editing', 'academy'],
          questions: [sq],
          links: [
            { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
            { label: 'Free Training Overview', href: '/programs#free-training' },
          ],
          verifiedAt: new Date().toISOString(),
          version: snap.version,
          relevance: 1,
        },
      });
      continue;
    }

    if (UNCONFIRMED_TOPICS_RX.test(sq)) {
      clauseResults.push({ status: 'unconfirmed', subQ: sq });
      await logKnowledgeGap(sq, input.visitorId, input.sessionId, pagePath, 0.15);
      loggedGap = true;
      continue;
    }

    const clauseAnalysis = analyzeVisitorLinguistics(sq, mem.activeTopic);
    const [hits, ossHits] = await Promise.all([
      Promise.resolve(retrieveTopKnowledge(clauseAnalysis.normalizedQuery || sq, snap, { pagePath, memory: mem })),
      rankWithOpenSourceEnsemble({
        query: sq,
        analysis: clauseAnalysis,
        records: snap.records,
        contentHash: String(snap.version),
        pagePath,
      }),
    ]);

    // Reciprocal Rank Fusion between RIYA BM25/Concept Retriever and the 10-Engine Open-Source Ensemble
    const fused = new Map<string, { record: RiyaKnowledgeRecord; score: number; subjectCoverage: number }>();
    hits.slice(0, 8).forEach((h, i) => {
      fused.set(h.record.id, {
        record: h.record,
        score: h.score + 2.2 / (10 + i + 1),
        subjectCoverage: h.subjectCoverage,
      });
    });
    ossHits.slice(0, 8).forEach((oh, i) => {
      const prev = fused.get(oh.record.id);
      const ossBoost = oh.rrfScore * 9.5 + oh.neuralProb * 2.2 + (oh.enginesMatched >= 3 ? 1.15 : 0.45) + 1.8 / (10 + i + 1);
      if (prev) {
        prev.score += ossBoost;
        if (oh.enginesMatched >= 3 && prev.subjectCoverage === 0) prev.subjectCoverage = 0.65;
      } else {
        fused.set(oh.record.id, {
          record: oh.record,
          score: ossBoost,
          subjectCoverage: oh.enginesMatched >= 2 ? 0.65 : 0.35,
        });
      }
    });

    const rankedFused = Array.from(fused.values()).sort((a, b) => b.score - a.score);
    const top = rankedFused[0];
    if (!top || top.score < 1.35 || (top.subjectCoverage === 0 && top.score < 3.0)) {
      clauseResults.push({ status: 'unknown', subQ: sq, topScore: top?.score || 0 });
    } else {
      clauseResults.push({ status: 'answered', subQ: sq, record: top.record, score: top.score });
      // Online self-learning: reinforce high-confidence multi-engine agreement
      if (top.score >= 5.0) {
        recordRiyaAdaptiveLearning({
          recordId: top.record.id,
          topicKey: top.record.topicKey,
          userUtterance: sq,
          reward: 'implicit_match',
        }).catch(() => {});
      }
    }
  }

  const answeredClauses = clauseResults.filter(
    (c): c is Extract<ClauseResult, { status: 'answered' }> => c.status === 'answered'
  );
  const hasExplicitUnconfirmed = clauseResults.some((c) => c.status === 'unconfirmed');

  // 8.5 VERCEL AI GATEWAY NEURAL BRAIN (FRONTIER PERSONALIZED CONVERSATION + FREE FAILOVER)
  // Guardrail: never ask the LLM to invent answers for explicitly unconfirmed future years/roadmaps
  if (!hasExplicitUnconfirmed || answeredClauses.length > 0) {
    const gatewayReply = await generateWithVercelAiGateway({
      oidcToken: input.oidcToken,
      userMessage: msg,
      pagePath,
      activeSection: input.activeSection,
      visitorActivity: input.visitorActivity,
      history: input.history || [],
      retrievedRecords: answeredClauses.map((a) => a.record),
      customFacts,
      visitorProfile: {
        name: mem.visitorName,
        role: mem.visitorRole,
        goal: mem.visitorGoal,
        activeTopic: mem.activeTopic,
      },
    });

    if (gatewayReply) {
      if (gatewayReply.learnedName) mem.visitorName = gatewayReply.learnedName;
      if (gatewayReply.learnedRole) mem.visitorRole = gatewayReply.learnedRole;
      if (gatewayReply.learnedGoal) mem.visitorGoal = gatewayReply.learnedGoal;
      if (answeredClauses[0]) {
        mem.activeTopic = answeredClauses[0].record.topicKey;
      }

      const fallbackLinks = answeredClauses.flatMap((a) => a.record.links).slice(0, 3);
      return {
        say: sanitizeEntities(gatewayReply.say),
        chips:
          gatewayReply.chips && gatewayReply.chips.length > 0
            ? gatewayReply.chips
            : answeredClauses.length > 0
            ? buildFollowUpChips(answeredClauses.map((a) => a.record), pagePath)
            : getContextualChipsForPage(pagePath).slice(0, 3),
        links:
          gatewayReply.links && gatewayReply.links.length > 0
            ? gatewayReply.links
            : fallbackLinks,
        intent:
          answeredClauses.length > 1
            ? 'multi_intent_answered'
            : answeredClauses[0]
            ? `kb_${answeredClauses[0].record.category}`
            : 'ai_gateway_conversational',
        confidence: 0.98,
        topicKey: answeredClauses[0]?.record.topicKey || mem.activeTopic || 'conversational',
        memory: mem,
        kbVersion: snap.version,
        sources: Array.from(new Set(answeredClauses.map((a) => a.record.route).concat(pagePath))),
      };
    }
  }

  // 8.7 LOCAL PERSONALIZED HUMAN NUANCE INTERCEPTOR (WARM, SHORT, IN-CONTEXT)
  const directPersonal = matchPersonalizedHumanIntent(msg, mem, pagePath, snap.version);
  if (directPersonal && subQuestions.length === 1) {
    return directPersonal;
  }

  // Log genuine unknown gaps only when neither AI Gateway nor Personal Interceptor resolved them
  for (const c of clauseResults) {
    if (c.status === 'unknown') {
      await logKnowledgeGap(c.subQ, input.visitorId, input.sessionId, pagePath, c.topScore);
      loggedGap = true;
    }
  }

  // Case A: None of the clauses could be verified -> honest, warm, short non-hallucinating response
  if (answeredClauses.length === 0) {
    if (hasExplicitUnconfirmed) {
      return {
        say: "KR8 DIGITALS hasn't officially announced plans on that yet, so I won't guess or make anything up! Right now, we run **7 tuition-free digital skill tracks** (plus WAEC/JAMB prep) and **6 commercial studio services** (including 18 ready-built websites). Want to see what's open right now?",
        chips: [
          { label: 'See open free programs', value: 'What programs do you offer?' },
          { label: 'See studio bestsellers', value: 'What are your bestsellers?' },
          { label: 'Contact our team', value: '__quote' },
        ],
        links: [
          { label: 'Verified Programs', href: '/programs' },
          { label: 'Explore Services', href: '/services' },
        ],
        intent: 'unconfirmed_knowledge_gap',
        confidence: 0.2,
        topicKey: 'unknown_unconfirmed',
        knowledgeGapLogged: true,
        memory: mem,
        kbVersion: snap.version,
        sources: [],
      };
    }

    return {
      say: `Tell me just a tiny bit more${mem.visitorName ? `, ${mem.visitorName}` : ''} so I give you the exact answer you need! Are you asking about **building a project for your brand**, **learning a free skill**, **joining our team/Tribe**, or **earning through referrals**?`,
      chips: [
        { label: 'Hire KR8 for a project', value: 'What services do you offer?' },
        { label: 'Learn a skill for free', value: 'What programs do you offer?' },
        { label: "I'd love to join KR8", value: "I'd love to join you guys" },
        { label: 'Talk to a human', value: '__human' },
      ],
      links: [{ label: 'Contact KR8 DIGITALS', href: '/contact' }],
      intent: 'low_confidence_gap',
      confidence: 0.35,
      topicKey: 'unknown_unconfirmed',
      knowledgeGapLogged: true,
      memory: mem,
      kbVersion: snap.version,
      sources: [],
    };
  }

  // Case B: One or more clauses answered cleanly! Deduplicate records while preserving per-clause flow
  const uniqueAnswered: { subQ: string; record: RiyaKnowledgeRecord; score: number }[] = [];
  const usedIds = new Set<string>();
  for (const ac of answeredClauses) {
    if (!usedIds.has(ac.record.id)) {
      usedIds.add(ac.record.id);
      uniqueAnswered.push(ac);
    }
  }

  const primary = uniqueAnswered[0];
  mem.activeTopic = primary.record.topicKey;
  if (primary.record.category === 'programs' || primary.record.category === 'training_opportunities') {
    mem.preferredProgram = primary.record.title;
  } else if (primary.record.category === 'services') {
    mem.preferredService = primary.record.title;
  }

  // Optional Self-Hosted Local Open-Source LLM Verbalization
  const groundedContext = uniqueAnswered
    .map((x) => `[${x.record.title} | ${x.record.route}]: ${x.record.content}`)
    .join('\n\n');
  const localLlmText = await generateWithLocalDaemonIfAvailable({
    userMessage: msg,
    groundedFacts: groundedContext,
    pagePath,
    conversationSummary: mem.activeTopic ? `Active topic: ${mem.activeTopic}` : '',
  });

  // Synthesize crisp, personalized, short-sentence conversational answer
  const unresolvedClauses = clauseResults.filter((c) => c.status !== 'answered');
  const composedSay =
    localLlmText ||
    synthesizeConversationalReply({
      fullMessage: msg,
      answered: uniqueAnswered,
      unresolvedCount: unresolvedClauses.length,
      hadUnconfirmed: unresolvedClauses.some((c) => c.status === 'unconfirmed'),
      memory: mem,
    });

  // Merge exact, relevant links across all answered parts (up to 3 for single, 4 for multi)
  const mergedLinks: RiyaLink[] = [];
  const seenHrefs = new Set<string>();
  for (const item of uniqueAnswered) {
    for (const l of item.record.links) {
      if (!seenHrefs.has(l.href)) {
        seenHrefs.add(l.href);
        mergedLinks.push(l);
      }
    }
  }

  const followUpChips = buildFollowUpChips(
    uniqueAnswered.map((u) => u.record),
    pagePath
  );
  const normConf = Math.min(0.99, Number((primary.score / (primary.score + 3.0)).toFixed(2)));

  return {
    say: sanitizeEntities(composedSay),
    chips: followUpChips,
    links: mergedLinks.slice(0, uniqueAnswered.length > 1 ? 4 : 2),
    intent: uniqueAnswered.length > 1 ? 'multi_intent_answered' : `kb_${primary.record.category}`,
    confidence: normConf,
    topicKey: primary.record.topicKey,
    knowledgeGapLogged: loggedGap || undefined,
    memory: mem,
    kbVersion: snap.version,
    sources: Array.from(new Set(uniqueAnswered.map((r) => r.record.route))),
  };
}

/* =========================================================================
   PERSONALIZED HUMAN NUANCE INTERCEPTOR & SHORT-SENTENCE SYNTHESIZER
   ========================================================================= */
function sanitizeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');
}

function matchPersonalizedHumanIntent(
  msg: string,
  mem: RiyaMemory,
  pagePath: string,
  kbVersion: number
): RiyaTurnOutput | null {
  const low = msg.toLowerCase();
  const nameTag = mem.visitorName ? `, ${mem.visitorName}` : '';

  // 1. Registering someone else (child, friend, sibling, colleague, spouse, student)
  if (
    /\b(register|enroll|apply|sign\s+up)\b.*\b(someone\s+else|another\s+person|my\s+(child|son|daughter|kid|friend|brother|sister|sibling|wife|husband|staff|student)|for\s+a\s+friend|on\s+behalf)\b/i.test(
      low
    ) ||
    /\bsomeone\s+else\b.*\b(register|enroll|apply|join)\b/i.test(low)
  ) {
    mem.activeTopic = 'register_someone_else';
    return {
      say: `Yes${nameTag} — you can definitely register a friend, child, sibling, or colleague! Just fill out the form using **their own real full name, active email, and WhatsApp number** so their cohort updates and permanent **KR8 ID** are issued in their name. Are you signing them up for **KR8 Academy** digital skills or **Next Gen Scholars** (WAEC/JAMB prep)?`,
      chips: [
        { label: 'KR8 Academy (Digital Skills)', value: 'I want to register them for KR8 Academy digital skills.' },
        { label: 'Next Gen Scholars (WAEC/JAMB)', value: 'I want to register them for Next Gen Scholars WAEC/JAMB prep.' },
        { label: 'Open Application Form', value: '__apply' },
      ],
      links: [
        { label: 'Apply on KR8 Academy ↗', href: 'https://academy.kr8digitals.com/apply', outbound: true },
        { label: 'Explore Free Programs', href: '/programs' },
      ],
      intent: 'kb_registration_and_onboarding',
      confidence: 0.99,
      topicKey: 'register_someone_else',
      memory: mem,
      kbVersion,
      sources: ['/programs'],
    };
  }

  // 2. Client Satisfaction, Revisions & Requesting a Redesign
  if (
    /\b(not\s+satisfied|unsatisfied|don'?t\s+like|dislike|unhappy\s+with)\b/i.test(low) ||
    (/\b(redesign|revision|revisions|redo|rework)\b/i.test(low) &&
      /\b(project|handle|draft|design|deliver|satisfied|happy|work)\b/i.test(low))
  ) {
    mem.activeTopic = 'client_satisfaction_revisions';
    return {
      say: `Yes, 100%${nameTag} — we never lock you into work you don’t love! Every KR8 DIGITALS project runs on **milestone check-ins and structured revision rounds**, so if a draft or design direction misses the mark, we refine or redesign that stage with your feedback before moving ahead. Are you planning a project right now, or checking how we work before commissioning us?`,
      chips: [
        { label: 'How milestone payments work', value: 'How do payments and milestones work?' },
        { label: 'Do I own 100% of my files?', value: 'Do I own 100% of my source code and design files?' },
        { label: 'Start a project brief', value: '__quote' },
      ],
      links: [
        { label: 'Start a Project Brief', href: '/contact' },
        { label: 'Terms & Guarantees', href: '/terms' },
      ],
      intent: 'kb_policies_and_requirements',
      confidence: 0.99,
      topicKey: 'client_satisfaction_revisions',
      memory: mem,
      kbVersion,
      sources: ['/terms', '/contact'],
    };
  }

  // 3. "I'd love to join you guys" / "I want to join KR8"
  if (
    /\b(love\s+to\s+join|want\s+to\s+join|like\s+to\s+join|join\s+you\s+guys|be\s+part\s+of\s+(you|kr8)|become\s+part\s+of)\b/i.test(
      low
    ) &&
    !/\b(academy|tribe|referral)\b/i.test(low)
  ) {
    mem.activeTopic = 'ways_to_join_kr8';
    const roleHint = mem.visitorRole ? ` (even right alongside your work as a **${mem.visitorRole}**)` : '';
    return {
      say: `We’d love to have you with us${nameTag}${roleHint}! There are three doors into KR8 DIGITALS depending on where you are today: **KR8 Academy** (learn a digital skill 100% free from scratch), **KR8 Tribe** (our free 3,000+ creative community for feedback and gig flow), or **Join the Studio Team** ($0 fee if you already have a strong portfolio). Which of those three feels most like home for you?`,
      chips: [
        { label: 'Learn free at KR8 Academy', value: 'Tell me how to join KR8 Academy for free.' },
        { label: 'Join the 3,000+ KR8 Tribe', value: 'How do I join KR8 DIGITALS TRIBE?' },
        { label: 'Apply to the Studio Team', value: '__roles' },
      ],
      links: [
        { label: 'Join the Studio Team', href: '/about/join-the-team' },
        { label: 'Join KR8 Tribe', href: '/tribe' },
        { label: 'Free KR8 Academy', href: '/programs' },
      ],
      intent: 'kb_career_and_talent_pathway',
      confidence: 0.99,
      topicKey: 'ways_to_join_kr8',
      memory: mem,
      kbVersion,
      sources: ['/about/join-the-team', '/tribe', '/programs'],
    };
  }

  // 4. Profession / Background Belonging ("I am a nurse, do I have a place here?")
  const asksBelongingNow =
    /\b(have\s+a\s+place|fit\s+in|belong\s+here|place\s+for\s+me|what\s+can\s+i\s+do\s+here|relevant\s+to\s+me)\b/i.test(
      low
    ) ||
    (/\b(i\s+am\s+a|i'm\s+a|i\s+work\s+as|as\s+a)\b/i.test(low) &&
      /\b(nurse|doctor|pharmacist|teacher|lecturer|lawyer|accountant|banker|pastor|engineer|architect|student|chef|farmer|civil\s+servant|realtor|marketer|writer|photographer|trader)\b/i.test(
        low
      ));
  if (mem.visitorRole && asksBelongingNow) {
    const role = mem.visitorRole;
    const isMedical = /\b(nurse|doctor|medical|pharmacist|healthcare)\b/i.test(role);
    const referExample = isMedical
      ? 'clinics, pharmacies, or hospitals'
      : /\b(teacher|lecturer|educator)\b/i.test(role)
      ? 'schools or educational centres'
      : 'businesses, schools, or founders';
    mem.activeTopic = 'non_tech_belonging';
    return {
      say: `As a **${role}**, you **absolutely** have a place here${nameTag}! You can pick up a **100% free digital skill** flexibly around your schedule, earn **8%–12% cash commissions** referring ${referExample} that need websites, or join our free **Mindset Shift** wealth & career sessions (and if you ever launch your own brand, our studio can build it!). Which of those sounds most exciting to you right now?`,
      chips: [
        { label: 'Learn a free skill around my shifts', value: 'Which free skill fits a busy work schedule best?' },
        { label: 'Earn 8%–12% referring clients', value: 'How can I earn through you?' },
        { label: 'Join Mindset Shift live', value: 'Tell me about Mindset Shift.' },
      ],
      links: [
        { label: 'Explore Free Programs', href: '/programs' },
        { label: 'Earn via Referrals', href: '/referrals' },
      ],
      intent: 'kb_values_and_philosophy',
      confidence: 0.99,
      topicKey: 'non_tech_belonging',
      memory: mem,
      kbVersion,
      sources: ['/about', '/programs', '/referrals'],
    };
  }

  // 5. How to Earn Through KR8 DIGITALS
  if (/\b(how\s+(can|do)\s+i\s+(earn|make\s+money)|earn\s+(through|with|from)\s+(you|kr8)|ways\s+to\s+earn)\b/i.test(low)) {
    mem.activeTopic = 'earn_through_kr8';
    return {
      say: `The easiest way is our **Referral Network** — introduce any business, clinic, hotel, school, or founder that needs digital work and earn **10% cash commission** on websites/AI (for example, **$200** on a $2,000 website) or **8%** on branding, graphics, video, and SEO, rising to **12%** after 3 paid referrals! Payouts start from just **$20** via bank transfer, and if you’re already a skilled creative, you can also collaborate on paid studio projects. Want your free referral link right now?`,
      chips: [
        { label: 'Get my referral link', value: 'How do I sign up and get my referral link?' },
        { label: 'I am a creative with a portfolio', value: 'How can I join the KR8 DIGITALS studio team?' },
      ],
      links: [
        { label: 'Join Referral Network', href: '/referrals' },
        { label: 'Referrer Dashboard', href: '/referrals/dashboard' },
      ],
      intent: 'kb_referral_opportunities',
      confidence: 0.99,
      topicKey: 'earn_through_kr8',
      memory: mem,
      kbVersion,
      sources: ['/referrals'],
    };
  }

  return null;
}

function wantsDetailedList(q: string): boolean {
  return /\b(list\s+all|all\s+\d+|full\s+(list|details|breakdown)|everything\s+about|in\s+detail|compare\s+all)\b/i.test(
    q
  );
}

function toShortEngagingReply(text: string, rec: RiyaKnowledgeRecord, userQuery: string, mem?: RiyaMemory): string {
  // Preserve full structured breakdown when user explicitly asks for full lists
  if (wantsDetailedList(userQuery)) return text;

  const followUpByCategory: Record<string, string> = {
    services: 'Would you like a custom quote, or want to see live examples first?',
    portfolio_and_proof: 'Want me to point you to a live build in your industry?',
    programs: 'Which of those free tracks sounds most interesting to you?',
    training_opportunities: 'Would you like help picking a track or registering today?',
    registration_and_onboarding: 'Are you registering for yourself or helping someone else sign up?',
    student_information: 'Which skill track are you thinking of starting with?',
    partnership_opportunities: 'Tell me a bit about your organisation — want to explore a partnership charter?',
    referral_opportunities: 'Would you like to grab your free referral link and start tracking?',
    career_and_talent_pathway: 'Which craft do you focus on — web, design, video, or AI?',
    leadership_and_team: 'Would you like to see their live studio work or connect with our team?',
  };

  // If record content is already concise (<= 380 chars and no giant bullet wall), keep it natural
  const cleaned = text.replace(/\n{2,}/g, ' ').replace(/\s*•\s*/g, ' — ').trim();
  if (text.length <= 390 && !text.includes('•')) {
    return text.includes('?') ? text : `${text} ${followUpByCategory[rec.category] || 'What would you like to explore next?'}`;
  }

  // Extract the sharpest 2–3 sentences so RIYA speaks like a warm human, never a textbook
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);

  const picked = sentences.slice(0, 3).join(' ');
  const clipped = picked.length > 410 ? sentences.slice(0, 2).join(' ') : picked;
  if (clipped.includes('?')) return clipped;
  const ask = followUpByCategory[rec.category] || 'What would you like to look into next?';
  return `${clipped} ${ask}`;
}

function tailorSingleRecordToQuestion(subQ: string, rec: RiyaKnowledgeRecord, mem?: RiyaMemory): string {
  const qLow = subQ.toLowerCase();
  const rolePrefix = mem?.visitorRole ? `Since you're a **${mem.visitorRole}**, ` : '';

  if (
    rec.topicKey === 'academy_tracks' &&
    /\b(free|cost|pay|tuition|money|fee|charge|afford)\b/i.test(qLow)
  ) {
    return `Yes — every cohort on **KR8 Academy** (all 7 digital tracks) and **Next Gen Scholars** (WAEC/JAMB prep) is **100% tuition-free ($0 / ₦0)**, including your verifiable graduation certificate and KR8 ID! Which skill are you most curious to learn?`;
  }

  if (
    (rec.topicKey === 'academy_tracks' || rec.topicKey === 'registration_process') &&
    /\b(requirement|requirements|qualify|eligible|need\s+to\s+join|who\s+can\s+join)\b/i.test(qLow)
  ) {
    return `${rolePrefix ? rolePrefix + 'y' : 'Y'}ou don't need any degree or prior tech background to join KR8 Academy, and tuition is **$0**! All you need is weekly commitment and internet access on a smartphone or laptop (coding tracks work best on a laptop, while content, social media, and mobile editing can start on a phone). Which track catches your eye?`;
  }

  if (rec.topicKey === 'kr8_identity') {
    return `**KR8 DIGITALS** (*"Create Digitals"*) is a problem-solving creative-tech company with two engines under one roof: our **Commercial Studio** builds websites (plus 18 ready-built sites from $450), branding, graphics, video, SEO, and AI systems, while our **Community Engine** trains thousands of learners **100% tuition-free**. What brought you here today — building a project, learning a free skill, or exploring ways to earn with us?`;
  }

  if (rec.topicKey === 'bestsellers_and_flagships' && !wantsDetailedList(subQ)) {
    return `Our #1 custom bestseller is **Website Design & Full-Stack Portals** (22 live platforms shipped), closely followed by **Brand Identity & Flyers** (*Motionverse*) and **Retention-Cut Video Reels** (*Chigoma*). We also have **18 ready-built websites** you can buy right away at **$450**, **$900**, and **$1,900**! Are you shopping for a fast ready-built site or a custom project?`;
  }

  if (rec.topicKey === 'sponsorship_benefits' && !wantsDetailedList(subQ)) {
    return `When you sponsor KR8 DIGITALS (**Track 03**), you receive **prominent public co-branding** across sponsored Academy cohorts and *Mindset Shift* sessions, **verified impact reports** tied to real graduate KR8 IDs, and **first-look access to top emerging talent** — all backed by a Written Charter. Are you exploring sponsorship as an individual, brand, or foundation?`;
  }

  if (
    (rec.topicKey === 'leadership_overview' || rec.topicKey === 'founders_and_team_all') &&
    !wantsDetailedList(subQ) &&
    !/\b(operations|executive|odobe|mercy|chizurum|covenant|general\s+manager|strategist|accountability)\b/i.test(qLow)
  ) {
    return `KR8 DIGITALS is led by three founders: **Timfire** (Kenneth Timothy Iziogo — Founder & Chief Executive, Web & AI Systems), **Steveoking** (Stevenson — Co-Founder & Founder of *Motionverse*, Brand & Graphic Design), and **Creative Expression** (Daniel Akachukwu Augustine — Co-Founder & Founder of *Chigoma*, Video Editing), alongside a 4-person executive operations team. Want to check out a founder's profile or meet our operations leads?`;
  }

  if (
    /\b(how\s+much|price|cost|pricing|budget|afford|rate)\b/i.test(qLow) &&
    /\b(website|site|ecommerce|e-commerce|store|shop|portal|hotel)\b/i.test(qLow)
  ) {
    return `If you want something ready right away, we have **18 ready-built websites** you can claim and brand immediately at **$450**, **$900**, and **$1,900** (including our **$1,900** *City Fashion Stores* multi-vendor e-commerce platform). For a custom build from scratch, we scope a **fixed-milestone quote in USD or NGN within 1 business day**. What kind of website or online store are you planning?`;
  }

  return toShortEngagingReply(rec.content, rec, subQ, mem);
}

function shortHeadingForRecord(rec: RiyaKnowledgeRecord): string {
  switch (rec.topicKey) {
    case 'bestsellers_and_flagships':
      return 'Our Bestsellers & Most Popular Offerings';
    case 'sponsorship_benefits':
      return 'What You Get for Sponsoring KR8 DIGITALS';
    case 'ready_built_sites_for_sale':
      return 'Ready-Built Websites for Immediate Purchase';
    case 'partnerships_overview':
      return 'Partnering With KR8 DIGITALS';
    case 'referral_program':
    case 'earn_through_kr8':
      return 'Earning With KR8 DIGITALS';
    case 'academy_tracks':
      return '100% Free Digital Skills Training';
    default:
      return rec.title.split('—')[0].split('(')[0].trim();
  }
}

function synthesizeConversationalReply(params: {
  fullMessage: string;
  answered: { subQ: string; record: RiyaKnowledgeRecord; score: number }[];
  unresolvedCount: number;
  hadUnconfirmed: boolean;
  memory?: RiyaMemory;
}): string {
  const { answered, unresolvedCount, hadUnconfirmed, memory } = params;

  if (answered.length === 1 && unresolvedCount === 0) {
    return tailorSingleRecordToQuestion(answered[0].subQ, answered[0].record, memory);
  }

  // Multi-part response: answer EVERY matched question concisely with clean headings!
  const sections = answered.map((item, idx) => {
    const heading = shortHeadingForRecord(item.record);
    const body = tailorSingleRecordToQuestion(item.subQ, item.record, memory);
    return answered.length > 1 ? `**${idx + 1}. ${heading}**\n${body}` : body;
  });

  if (unresolvedCount > 0) {
    sections.push(
      hadUnconfirmed
        ? '**Note on Unannounced Plans:** For the other part of your question, KR8 DIGITALS has not officially confirmed or announced details on that yet, so I have logged it for our leadership team rather than guessing.'
        : '**Note:** For the other detail you mentioned, I do not have a verified record confirming that exact point yet, so I have logged it for our team to review.'
    );
  }

  return sections.join('\n\n');
}

async function logKnowledgeGap(
  question: string,
  visitorId: string,
  sessionId: string,
  pagePath: string,
  confidence: number
) {
  const existingGaps = await store.all('riya_knowledge_gaps', 200);
  const dup = existingGaps.find(
    (g) => g.kind === 'knowledge_gap' && String(g.question || '').toLowerCase() === question.toLowerCase()
  );
  if (dup) {
    await store.update('riya_knowledge_gaps', dup.id, {
      occurrences: (Number(dup.occurrences) || 1) + 1,
    });
  } else {
    await store.insert('riya_knowledge_gaps', {
      id: newId('gap_'),
      kind: 'knowledge_gap',
      question,
      visitorId,
      sessionId,
      pagePath,
      confidence: Number(confidence.toFixed(2)),
      occurrences: 1,
      status: 'open',
    });
  }
}

function buildFollowUpChips(records: RiyaKnowledgeRecord[], pagePath: string): RiyaChip[] {
  const primary = records[0];
  const hasSponsor = records.some((r) => r.topicKey === 'sponsorship_benefits');
  const hasBestseller = records.some(
    (r) => r.topicKey === 'bestsellers_and_flagships' || r.topicKey === 'ready_built_sites_for_sale'
  );

  if (hasBestseller && hasSponsor) {
    return [
      { label: 'Submit a Sponsorship Proposal', value: '__partners' },
      { label: 'See ready-built sites ($450–$1,900)', value: 'Do you have ready-made websites for sale?' },
      { label: 'Request a custom project quote', value: '__quote' },
    ];
  }
  if (hasSponsor) {
    return [
      { label: 'Submit a Sponsorship Proposal', value: '__partners' },
      { label: 'Meet existing partners', value: 'Who are KR8 DIGITALS existing partners?' },
      { label: 'Talk with our leadership team', value: '__whatsapp' },
    ];
  }
  if (hasBestseller) {
    return [
      { label: 'See ready-built sites ($450–$1,900)', value: 'Do you have ready-made websites for sale?' },
      { label: 'How fast can you deliver?', value: 'How long does it take KR8 DIGITALS to build a website?' },
      { label: 'Request a written quote', value: '__quote' },
    ];
  }

  switch (primary.category) {
    case 'programs':
    case 'training_opportunities':
    case 'student_information':
      return [
        { label: 'How do I register?', value: 'How do I register?' },
        { label: 'What are the requirements?', value: 'What are the requirements?' },
        { label: 'Apply on KR8 Academy', value: '__apply' },
      ];
    case 'services':
    case 'portfolio_and_proof':
      return [
        { label: 'What are your bestsellers?', value: 'What are your bestsellers?' },
        { label: 'How pricing & timelines work', value: 'How long does it take KR8 DIGITALS to build a website?' },
        { label: 'Request a written quote', value: '__quote' },
      ];
    case 'partnership_opportunities':
      return [
        { label: 'What do sponsors get?', value: 'What do I get for sponsoring KR8 DIGITALS?' },
        { label: 'Propose a Partnership', value: '__partners' },
      ];
    case 'referral_opportunities':
      return [
        { label: 'Check referrer dashboard', value: 'Where do I check my referral clicks and commissions?' },
        { label: 'When are commissions paid?', value: 'When and how are referral commissions paid out?' },
      ];
    default:
      return getContextualChipsForPage(pagePath).slice(0, 3);
  }
}
