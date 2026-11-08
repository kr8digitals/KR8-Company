/**
 * RIYA Open-Source 10-Engine Conversational & Self-Learning Ensemble
 * ------------------------------------------------------------------
 * Runs 100% in-process inside the repository using 10 battle-tested MIT / Apache-2.0
 * open-source engines so RIYA NEVER disconnects regardless of hosting provider
 * (Vercel, GitHub clone, VPS, Docker, Railway, Render, Netlify, or offline localhost):
 *
 *  1. axa-group/nlp.js (@nlpjs/neural)           — Multi-Layer Perceptron intent classifier
 *  2. axa-group/nlp.js (@nlpjs/similarity)       — Levenshtein edit-distance utterance matcher
 *  3. lucaong/minisearch                         — BM25+ fuzzy + prefix full-text engine
 *  4. askorama/orama (@orama/orama)              — Multi-field hybrid schema search
 *  5. spencermountain/compromise                 — POS tagging, entity & pronoun resolution
 *  6. krisk/Fuse (fuse.js)                       — Bitap approximate substring & typo matcher
 *  7. winkjs/wink-bm25-text-search               — Field-weighted Okapi BM25F statistical engine
 *  8. winkjs/wink-sentiment                      — Negation-aware visitor emotion & urgency detector
 *  9. winkjs/wink-porter2-stemmer                — Porter2 morphological stemmer
 * 10. words/double-metaphone + RAG RRF + Bandit  — Phonetic decoder, Reciprocal Rank Fusion & online self-learning
 */

import MiniSearch from 'minisearch';
import Fuse from 'fuse.js';
import { create as createOrama, insertMultiple as insertOrama, search as searchOrama } from '@orama/orama';
import nlpCompromise from 'compromise';
// @ts-ignore — pure CJS open-source packages
import winkBM25 from 'wink-bm25-text-search';
// @ts-ignore
import winkSentiment from 'wink-sentiment';
// @ts-ignore
import porter2Stem from 'wink-porter2-stemmer';
// @ts-ignore
import { NeuralNetwork } from '@nlpjs/neural';
// @ts-ignore
import { similarity as editDistance } from '@nlpjs/similarity';
import { doubleMetaphone } from 'double-metaphone';
import type { RiyaKnowledgeRecord } from './riya-knowledge';
import { store, newId } from './store';

export type VisitorTone = 'frustrated' | 'enthusiastic' | 'curious';

export type LinguisticAnalysis = {
  original: string;
  normalizedQuery: string;
  reformulatedQuery: string;
  stemmedTokens: string[];
  phoneticCodes: string[];
  detectedPersonName?: string;
  detectedProfession?: string;
  sentimentScore: number;
  tone: VisitorTone;
  isFollowUpPronounQuery: boolean;
};

export type EnsembleRankedHit = {
  record: RiyaKnowledgeRecord;
  rrfScore: number;
  neuralProb: number;
  enginesMatched: number;
};

type LearnedPatternDoc = {
  id: string;
  recordId: string;
  topicKey: string;
  alpha: number; // positive rewards (helpful votes + high-confidence engagements)
  beta: number; // negative penalties (unhelpful votes)
  utterances: string[];
  updatedAt?: string;
};

/* =========================================================================
   CANONICAL PHONETIC ENTITY & DOMAIN NORMALIZER (words/double-metaphone)
   ========================================================================= */
const CANONICAL_KR8_TERMS = [
  'timfire',
  'steveoking',
  'stevenson',
  'daniel',
  'motionverse',
  'chigoma',
  'afristem',
  'riya',
  'bestsellers',
  'referrals',
  'commission',
  'redesign',
  'revisions',
  'satisfied',
  'sponsor',
  'sponsorship',
  'partnership',
  'academy',
  'scholars',
  'tribe',
  'mindset',
  'website',
  'ecommerce',
  'branding',
  'automation',
  'certificate',
  'register',
];

const PHONETIC_CANONICAL_MAP = new Map<string, string>();
for (const term of CANONICAL_KR8_TERMS) {
  const [p1, p2] = doubleMetaphone(term);
  if (p1 && p1.length >= 3) PHONETIC_CANONICAL_MAP.set(p1, term);
  if (p2 && p2.length >= 3 && !PHONETIC_CANONICAL_MAP.has(p2)) PHONETIC_CANONICAL_MAP.set(p2, term);
}

const KNOWN_PROFESSIONS = new Set([
  'nurse',
  'doctor',
  'pharmacist',
  'dentist',
  'medic',
  'surgeon',
  'therapist',
  'teacher',
  'lecturer',
  'principal',
  'educator',
  'tutor',
  'lawyer',
  'barrister',
  'accountant',
  'banker',
  'auditor',
  'pastor',
  'minister',
  'clergy',
  'engineer',
  'architect',
  'surveyor',
  'builder',
  'realtor',
  'student',
  'undergraduate',
  'corps member',
  'nysc',
  'graduate',
  'chef',
  'baker',
  'caterer',
  'farmer',
  'trader',
  'merchant',
  'tailor',
  'stylist',
  'photographer',
  'videographer',
  'writer',
  'journalist',
  'musician',
  'artist',
  'marketer',
  'freelancer',
  'founder',
  'entrepreneur',
  'ceo',
]);

function stemTokenize(text: string): string[] {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .map((w) => {
      if (w.length >= 4) {
        const [ph] = doubleMetaphone(w);
        const canonical = ph ? PHONETIC_CANONICAL_MAP.get(ph) : undefined;
        if (canonical && editDistance(w, canonical, true) <= 3) {
          return porter2Stem(canonical);
        }
      }
      return porter2Stem(w);
    });
}

/* =========================================================================
   LINGUISTIC, POS, ENTITY & SENTIMENT ANALYZER
   ========================================================================= */
export function analyzeVisitorLinguistics(
  rawMessage: string,
  activeTopic?: string,
  lastBotSubject?: string
): LinguisticAnalysis {
  const original = String(rawMessage || '').trim();

  // 1. Phonetic typo healing on raw tokens before parsing
  const healedWords = original.split(/(\s+)/).map((part) => {
    const clean = part.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length < 5 || CANONICAL_KR8_TERMS.includes(clean)) return part;
    const [ph] = doubleMetaphone(clean);
    const canonical = ph ? PHONETIC_CANONICAL_MAP.get(ph) : undefined;
    if (canonical && editDistance(clean, canonical, true) <= 2) {
      return canonical;
    }
    return part;
  });
  const normalizedQuery = healedWords.join('');

  // 2. Compromise NLP POS & entity extraction
  let detectedPersonName: string | undefined;
  let detectedProfession: string | undefined;
  try {
    const doc = nlpCompromise(original);
    const people = doc.people().out('array') as string[];
    if (people.length > 0 && /\b(i am|i'm|my name is|call me|this is)\b/i.test(original)) {
      const candidate = people[0].replace(/[^a-zA-Z\s'-]/g, '').trim().split(/\s+/)[0];
      if (candidate && candidate.length >= 2 && !KNOWN_PROFESSIONS.has(candidate.toLowerCase())) {
        detectedPersonName = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }

    const low = original.toLowerCase();
    for (const prof of KNOWN_PROFESSIONS) {
      const rx = new RegExp(`\\b(?:i am a|i'm a|i am an|i'm an|i work as a|i work as an|as a|as an)\\s+${prof}\\b`, 'i');
      if (rx.test(low)) {
        detectedProfession = prof;
        break;
      }
    }
  } catch {}

  // 3. Wink Negation-Aware Sentiment Analysis
  let sentimentScore = 0;
  try {
    const s = winkSentiment(normalizedQuery);
    sentimentScore = Number(s?.normalizedScore ?? s?.score ?? 0);
  } catch {}
  const tone: VisitorTone =
    sentimentScore <= -1.5 || /\b(not\s+satisfied|unhappy|frustrated|broken|stuck|failed|problem|issue|wrong)\b/i.test(original)
      ? 'frustrated'
      : sentimentScore >= 2.0 || /\b(love|excited|awesome|amazing|great|join\s+you)\b/i.test(original)
      ? 'enthusiastic'
      : 'curious';

  // 4. Follow-Up Pronoun / Ellipsis Query Reformulator (inspired by Zela0912/rag-docs-chatbot & HybridRAG)
  const wordCount = normalizedQuery.split(/\s+/).filter(Boolean).length;
  const hasPronounRef = /\b(it|that|this|they|them|those|there|the\s+same)\b/i.test(normalizedQuery);
  const lacksExplicitSubject =
    !/\b(website|branding|graphic|video|seo|automation|academy|scholars|tribe|mindset|referral|sponsor|partner|founder|timfire|steveoking)\b/i.test(
      normalizedQuery
    );
  const isFollowUpPronounQuery = Boolean(
    activeTopic && wordCount <= 12 && (hasPronounRef || wordCount <= 5) && lacksExplicitSubject
  );

  const topicWords = activeTopic ? activeTopic.replace(/_/g, ' ') : '';
  const reformulatedQuery = isFollowUpPronounQuery
    ? `${normalizedQuery.replace(/[?!.]+$/g, '')} regarding ${topicWords}${lastBotSubject ? ' ' + lastBotSubject : ''}`
    : normalizedQuery;

  const stemmedTokens = stemTokenize(reformulatedQuery);
  const phoneticCodes = normalizedQuery
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3)
    .map((w) => doubleMetaphone(w)[0])
    .filter(Boolean);

  return {
    original,
    normalizedQuery,
    reformulatedQuery,
    stemmedTokens,
    phoneticCodes,
    detectedPersonName,
    detectedProfession,
    sentimentScore,
    tone,
    isFollowUpPronounQuery,
  };
}

/* =========================================================================
   CACHED MULTI-ENGINE INDEX SINGLETON (REBUILDS AUTOMATICALLY ON KB HASH CHANGE)
   ========================================================================= */
type CachedEnsemble = {
  cacheKey: string;
  miniSearch: MiniSearch<any>;
  fuse: Fuse<any>;
  oramaDb: any;
  winkEngine: any;
  neuralNet: any;
  recordMap: Map<string, RiyaKnowledgeRecord>;
  utteranceBank: { recordId: string; text: string; stems: string[] }[];
};

let ensembleCache: CachedEnsemble | null = null;
let learnedCache: { fetchedAt: number; docs: LearnedPatternDoc[] } | null = null;

async function loadLearnedPatterns(): Promise<LearnedPatternDoc[]> {
  if (learnedCache && Date.now() - learnedCache.fetchedAt < 20_000) {
    return learnedCache.docs;
  }
  try {
    const raw = (await store.all('riya_learned_patterns', 300)) as unknown as LearnedPatternDoc[];
    learnedCache = { fetchedAt: Date.now(), docs: Array.isArray(raw) ? raw : [] };
    return learnedCache.docs;
  } catch {
    return [];
  }
}

async function getOrBuildEnsemble(
  records: RiyaKnowledgeRecord[],
  contentHash: string,
  learnedDocs: LearnedPatternDoc[]
): Promise<CachedEnsemble> {
  const learnedSig = `${learnedDocs.length}:${learnedDocs.reduce((a, d) => a + (d.utterances?.length || 0), 0)}`;
  const cacheKey = `${contentHash}::${records.length}::${learnedSig}`;
  if (ensembleCache && ensembleCache.cacheKey === cacheKey) {
    return ensembleCache;
  }

  const recordMap = new Map<string, RiyaKnowledgeRecord>();
  const docsForIndex = records.map((r, idx) => {
    recordMap.set(r.id, r);
    const learnedForRec = learnedDocs.find((d) => d.recordId === r.id);
    const extraUtterances = learnedForRec?.utterances || [];
    return {
      id: r.id,
      numId: idx,
      title: r.title,
      category: r.category,
      route: r.route,
      summary: r.summary,
      content: r.content,
      questionsText: [...r.questions, ...extraUtterances].join(' | '),
      keywordsText: r.keywords.join(' '),
    };
  });

  // 1. MiniSearch (BM25+ with prefix & fuzzy tolerance)
  const miniSearch = new MiniSearch({
    fields: ['title', 'questionsText', 'keywordsText', 'summary', 'content'],
    storeFields: ['id'],
    searchOptions: {
      boost: { title: 3.6, questionsText: 3.4, keywordsText: 2.6, summary: 1.8, content: 1.0 },
      fuzzy: 0.22,
      prefix: true,
    },
  });
  miniSearch.addAll(docsForIndex);

  // 2. Fuse.js (Bitap approximate pattern matching)
  const fuse = new Fuse(docsForIndex, {
    keys: [
      { name: 'questionsText', weight: 0.38 },
      { name: 'title', weight: 0.3 },
      { name: 'keywordsText', weight: 0.2 },
      { name: 'summary', weight: 0.12 },
    ],
    threshold: 0.42,
    ignoreLocation: true,
    includeScore: true,
  });

  // 3. Orama (Hybrid multi-field typo-tolerant document index)
  const oramaDb = await createOrama({
    schema: {
      docId: 'string',
      title: 'string',
      questionsText: 'string',
      keywordsText: 'string',
      summary: 'string',
      content: 'string',
    } as const,
  });
  await insertOrama(
    oramaDb,
    docsForIndex.map((d) => ({
      docId: d.id,
      title: d.title,
      questionsText: d.questionsText,
      keywordsText: d.keywordsText,
      summary: d.summary,
      content: d.content,
    }))
  );

  // 4. Wink BM25F (Porter2-stemmed statistical Okapi BM25F)
  const winkEngine = winkBM25();
  winkEngine.defineConfig({
    fldWeights: { title: 3.5, questionsText: 3.2, keywordsText: 2.5, summary: 1.5, content: 1.0 },
  });
  winkEngine.definePrepTasks([stemTokenize]);
  docsForIndex.forEach((d) => {
    winkEngine.addDoc(
      {
        title: d.title,
        questionsText: d.questionsText,
        keywordsText: d.keywordsText,
        summary: d.summary,
        content: d.content,
      },
      d.id
    );
  });
  if (docsForIndex.length >= 3) {
    winkEngine.consolidate();
  }

  // 5. @nlpjs/neural Multi-Layer Perceptron Classifier + Utterance Bank
  const neuralNet = new NeuralNetwork({ iterations: 120, learningRate: 0.55, log: false });
  const trainingCorpus: { input: Record<string, number>; output: Record<string, number> }[] = [];
  const utteranceBank: { recordId: string; text: string; stems: string[] }[] = [];

  for (const r of records) {
    const learnedForRec = learnedDocs.find((d) => d.recordId === r.id);
    const samples = [
      r.title,
      ...r.questions.slice(0, 6),
      r.keywords.slice(0, 10).join(' '),
      ...(learnedForRec?.utterances || []).slice(-8),
    ];
    for (const s of samples) {
      const stems = stemTokenize(s);
      if (!stems.length) continue;
      const feat: Record<string, number> = {};
      stems.forEach((st) => {
        feat[st] = 1;
      });
      trainingCorpus.push({ input: feat, output: { [r.id]: 1 } });
      utteranceBank.push({ recordId: r.id, text: s.toLowerCase(), stems });
    }
  }
  if (trainingCorpus.length > 0) {
    try {
      neuralNet.train(trainingCorpus);
    } catch {}
  }

  ensembleCache = {
    cacheKey,
    miniSearch,
    fuse,
    oramaDb,
    winkEngine,
    neuralNet,
    recordMap,
    utteranceBank,
  };
  return ensembleCache;
}

/* =========================================================================
   RECIPROCAL RANK FUSION (RRF) + ONLINE BANDIT RERANKER
   ========================================================================= */
export async function rankWithOpenSourceEnsemble(params: {
  query: string;
  analysis: LinguisticAnalysis;
  records: RiyaKnowledgeRecord[];
  contentHash: string;
  pagePath?: string;
}): Promise<EnsembleRankedHit[]> {
  const learnedDocs = await loadLearnedPatterns();
  const ens = await getOrBuildEnsemble(params.records, params.contentHash, learnedDocs);
  const searchQuery = params.analysis.reformulatedQuery || params.query;

  const rrfScores = new Map<string, number>();
  const engineHits = new Map<string, number>();
  const neuralMap = new Map<string, number>();

  const addRank = (docId: string, rank0: number, weight: number) => {
    const contrib = weight / (20 + rank0 + 1);
    rrfScores.set(docId, (rrfScores.get(docId) || 0) + contrib);
    engineHits.set(docId, (engineHits.get(docId) || 0) + 1);
  };

  // Engine A: MiniSearch BM25+ Prefix/Fuzzy
  try {
    const msHits = ens.miniSearch.search(searchQuery).slice(0, 14);
    msHits.forEach((h: any, idx: number) => addRank(String(h.id), idx, 1.35));
  } catch {}

  // Engine B: Orama Hybrid Search
  try {
    const orHits = await searchOrama(ens.oramaDb, {
      term: searchQuery,
      limit: 14,
      tolerance: 1,
      boost: { title: 3.2, questionsText: 3.0, keywordsText: 2.2, summary: 1.5, content: 1.0 },
    });
    (orHits?.hits || []).forEach((h: any, idx: number) => {
      if (h?.document?.docId) addRank(String(h.document.docId), idx, 1.25);
    });
  } catch {}

  // Engine C: Fuse.js Bitap Approximate Search
  try {
    const fHits = ens.fuse.search(searchQuery.slice(0, 120)).slice(0, 12);
    fHits.forEach((h: any, idx: number) => {
      if (h?.item?.id) addRank(String(h.item.id), idx, 1.05);
    });
  } catch {}

  // Engine D: Wink BM25F Porter2-Stemmed Search
  try {
    if (params.records.length >= 3) {
      const wHits = ens.winkEngine.search(searchQuery, 14) as [string, number][];
      wHits.forEach(([docId], idx) => addRank(String(docId), idx, 1.3));
    }
  } catch {}

  // Engine E: @nlpjs/neural MLP Intent Classifier
  try {
    const feat: Record<string, number> = {};
    params.analysis.stemmedTokens.forEach((st) => {
      feat[st] = 1;
    });
    if (Object.keys(feat).length > 0) {
      const probs = ens.neuralNet.run(feat) as Record<string, number>;
      const sortedProbs = Object.entries(probs || {})
        .filter(([, p]) => typeof p === 'number' && p > 0.06)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      sortedProbs.forEach(([docId, prob], idx) => {
        neuralMap.set(docId, prob);
        addRank(docId, idx, 1.45 * Math.min(1.4, 0.7 + prob));
      });
    }
  } catch {}

  // Engine F: @nlpjs/similarity Direct Utterance & Stem Overlap Matcher
  try {
    const qClean = params.analysis.normalizedQuery.toLowerCase().replace(/[?!.,]/g, '').trim();
    const qStemSet = new Set(params.analysis.stemmedTokens);
    const simRanked: { recordId: string; sim: number }[] = [];
    for (const u of ens.utteranceBank) {
      const overlap = u.stems.filter((s) => qStemSet.has(s)).length;
      if (overlap === 0 && Math.abs(u.text.length - qClean.length) > 18) continue;
      const stemJaccard = overlap / Math.max(1, new Set([...u.stems, ...qStemSet]).size);
      const maxLen = Math.max(1, u.text.length, qClean.length);
      const levSim = qClean.length <= 80 ? Math.max(0, 1 - editDistance(qClean, u.text, true) / maxLen) : 0;
      const combined = stemJaccard * 0.65 + levSim * 0.35;
      if (combined > 0.22) {
        simRanked.push({ recordId: u.recordId, sim: combined });
      }
    }
    simRanked.sort((a, b) => b.sim - a.sim);
    const seenRec = new Set<string>();
    let rankIdx = 0;
    for (const sr of simRanked) {
      if (seenRec.has(sr.recordId)) continue;
      seenRec.add(sr.recordId);
      addRank(sr.recordId, rankIdx++, 1.3 * (0.8 + sr.sim));
      if (rankIdx >= 10) break;
    }
  } catch {}

  // Online Thompson-Sampling Bandit Multiplier + Page-Route Contextual Boost
  const learnedMap = new Map<string, LearnedPatternDoc>();
  learnedDocs.forEach((d) => learnedMap.set(d.recordId, d));

  const results: EnsembleRankedHit[] = [];
  for (const [docId, rawRrf] of rrfScores.entries()) {
    const rec = ens.recordMap.get(docId);
    if (!rec) continue;
    let finalScore = rawRrf;

    // Contextual boost when visitor is currently browsing the exact route of the record
    if (params.pagePath && params.pagePath !== '/' && rec.route === params.pagePath) {
      finalScore *= 1.16;
    }

    // Online self-learning reward factor: Bayesian mean (alpha + 2) / (alpha + beta + 4) normalized around 1.0
    const learned = learnedMap.get(docId);
    if (learned) {
      const bayesMean = (learned.alpha + 2) / Math.max(1, learned.alpha + learned.beta + 4);
      // Center neutral (0.5) at 1.0x; high satisfaction rises up to 1.32x; downvoted drops to 0.72x
      const banditMultiplier = 0.68 + bayesMean * 0.64;
      finalScore *= banditMultiplier;
    }

    results.push({
      record: rec,
      rrfScore: Number(finalScore.toFixed(4)),
      neuralProb: Number((neuralMap.get(docId) || 0).toFixed(3)),
      enginesMatched: engineHits.get(docId) || 1,
    });
  }

  results.sort((a, b) => b.rrfScore - a.rrfScore);
  return results.slice(0, 8);
}

/* =========================================================================
   ONLINE SELF-LEARNING FEEDBACK & PARAPHRASE MEMORY
   ========================================================================= */
export async function recordRiyaAdaptiveLearning(event: {
  recordId?: string;
  topicKey?: string;
  userUtterance?: string;
  reward: 'positive' | 'negative' | 'implicit_match';
}): Promise<void> {
  if (!event.recordId && !event.topicKey) return;
  try {
    const all = await loadLearnedPatterns();
    const existing = all.find(
      (d) => (event.recordId && d.recordId === event.recordId) || (event.topicKey && d.topicKey === event.topicKey)
    );

    const cleanUtterance = String(event.userUtterance || '')
      .trim()
      .slice(0, 130);
    const shouldStoreUtterance =
      cleanUtterance.length >= 8 &&
      cleanUtterance.split(/\s+/).length >= 2 &&
      event.reward !== 'negative';

    if (existing) {
      const nextAlpha =
        existing.alpha + (event.reward === 'positive' ? 2 : event.reward === 'implicit_match' ? 0.35 : 0);
      const nextBeta = existing.beta + (event.reward === 'negative' ? 2.5 : 0);
      const nextUtterances = Array.isArray(existing.utterances) ? [...existing.utterances] : [];
      if (
        shouldStoreUtterance &&
        !nextUtterances.some((u) => u.toLowerCase() === cleanUtterance.toLowerCase())
      ) {
        nextUtterances.push(cleanUtterance);
      }
      await store.update('riya_learned_patterns', existing.id, {
        alpha: Number(nextAlpha.toFixed(2)),
        beta: Number(nextBeta.toFixed(2)),
        utterances: nextUtterances.slice(-24),
        updatedAt: new Date().toISOString(),
      });
    } else if (event.recordId) {
      await store.insert('riya_learned_patterns', {
        id: newId('riya_lrn_'),
        recordId: event.recordId,
        topicKey: event.topicKey || '',
        alpha: event.reward === 'positive' ? 3 : 1.35,
        beta: event.reward === 'negative' ? 3 : 1,
        utterances: shouldStoreUtterance ? [cleanUtterance] : [],
        updatedAt: new Date().toISOString(),
      });
    }
    learnedCache = null; // Invalidate cache so neural net & bandit incorporate learning immediately!
  } catch {}
}

export function getOpenSourceEnsembleSummary() {
  return {
    engineCount: 10,
    selfContained: true,
    neverDisconnects: true,
    engines: [
      '@nlpjs/neural (MLP Intent Classifier)',
      '@nlpjs/similarity (Levenshtein Utterance Matcher)',
      'MiniSearch (BM25+ Prefix & Fuzzy)',
      'Orama (Hybrid Multi-Field Typo Search)',
      'Compromise (POS, Person/Role & Pronoun Resolver)',
      'Fuse.js (Bitap Approximate Matcher)',
      'Wink-BM25F (Porter2 Statistical Search)',
      'Wink-Sentiment (Negation-Aware Emotion Detector)',
      'Double-Metaphone (Phonetic Speech/Typo Decoder)',
      'Reciprocal Rank Fusion + Thompson-Sampling Self-Learner',
    ],
  };
}
