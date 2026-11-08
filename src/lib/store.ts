import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Unified Storage Interface (Local JSON File Driver + Switchable Supabase Driver)
 * Supports all operational & full CMS collections out of the box.
 */

export type Doc = { id: string; createdAt: string; updatedAt: string; [k: string]: any };

export type Collection =
  | 'leads'
  | 'referrals'
  | 'commissions'
  | 'payouts'
  | 'orders'
  | 'host_sessions'
  | 'host_messages'
  | 'events'
  | 'applications'
  | 'settings'
  | 'partner_proposals'
  | 'cms_pages'
  | 'cms_services'
  | 'cms_programs'
  | 'cms_team'
  | 'cms_partners'
  | 'cms_media'
  | 'cms_navigation'
  | 'cms_seo'
  | 'cms_revisions'
  | 'riya_kb_custom'
  | 'riya_knowledge_gaps'
  | 'riya_learned_patterns'
  | 'riya_submissions'
  | 'riya_sync_log'
  | 'riya_feedback_ratings'
  | 'riya_security_events';

const DATA_DIR =
  process.env.KR8_DATA_DIR ||
  (process.env.VERCEL ? '/tmp/kr8-data' : path.join(process.cwd(), '.data'));

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SB_URL && SB_KEY);

const TABLE: Record<Collection, string> = {
  leads: 'leads',
  referrals: 'referrals',
  commissions: 'commissions',
  payouts: 'payouts',
  orders: 'orders',
  host_sessions: 'host_sessions',
  host_messages: 'host_messages',
  events: 'events',
  applications: 'applications',
  settings: 'settings',
  partner_proposals: 'partner_proposals',
  cms_pages: 'cms_pages',
  cms_services: 'cms_services',
  cms_programs: 'cms_programs',
  cms_team: 'cms_team',
  cms_partners: 'cms_partners',
  cms_media: 'cms_media',
  cms_navigation: 'cms_navigation',
  cms_seo: 'cms_seo',
  cms_revisions: 'cms_revisions',
  riya_kb_custom: 'riya_kb_custom',
  riya_knowledge_gaps: 'riya_knowledge_gaps',
  riya_learned_patterns: 'riya_learned_patterns',
  riya_submissions: 'riya_submissions',
  riya_sync_log: 'riya_sync_log',
  riya_feedback_ratings: 'riya_feedback_ratings',
  riya_security_events: 'riya_security_events',
};

function filePath(c: Collection) {
  return path.join(DATA_DIR, `${c}.json`);
}

const fallbackMemory = new Map<Collection, Doc[]>();

function readAll(c: Collection): Doc[] {
  try {
    const raw = fs.readFileSync(filePath(c), 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      fallbackMemory.set(c, parsed);
      return parsed;
    }
  } catch {
    /* file not created yet */
  }
  return fallbackMemory.get(c) || [];
}

function writeAll(c: Collection, rows: Doc[]) {
  const trimmed = rows.slice(-4000);
  fallbackMemory.set(c, trimmed);
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath(c), JSON.stringify(trimmed, null, 2));
  } catch {
    /* fallbackMemory keeps state alive if disk is read-only */
  }
}

async function sb(c: Collection, init: RequestInit & { method: string; query?: string }) {
  const q = init.query ? `?${init.query}` : '';
  const res = await fetch(`${SB_URL}/rest/v1/${TABLE[c]}${q}`, {
    ...init,
    headers: {
      apikey: SB_KEY!,
      authorization: `Bearer ${SB_KEY}`,
      'content-type': 'application/json',
      prefer: 'return=representation',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`supabase ${res.status}: ${await res.text().catch(() => '')}`);
  return res.json().catch(() => null);
}

export function newId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}${crypto.randomBytes(4).toString('hex')}`;
}

export const store = {
  driver: () => (useSupabase ? 'supabase' : 'file'),
  dataDir: () => DATA_DIR,

  async insert<T extends Record<string, any>>(c: Collection, doc: T): Promise<Doc> {
    const now = new Date().toISOString();
    const row: Doc = { id: doc.id || newId(), createdAt: now, updatedAt: now, ...doc };
    if (useSupabase) {
      const out = await sb(c, { method: 'POST', body: JSON.stringify(row) });
      return Array.isArray(out) ? out[0] : row;
    }
    const rows = [...readAll(c)];
    const existingIdx = rows.findIndex((r) => r.id === row.id);
    if (existingIdx >= 0) {
      rows[existingIdx] = row;
    } else {
      rows.push(row);
    }
    writeAll(c, rows);
    return row;
  },

  async add<T extends Record<string, any>>(c: Collection, doc: T): Promise<Doc> {
    return store.insert(c, doc);
  },

  async update(c: Collection, id: string, patch: Record<string, any>): Promise<Doc | null> {
    const now = new Date().toISOString();
    if (useSupabase) {
      const out = await sb(c, {
        method: 'PATCH',
        query: `id=eq.${encodeURIComponent(id)}`,
        body: JSON.stringify({ ...patch, updatedAt: now }),
      }).catch(() => null);
      return Array.isArray(out) ? out[0] : null;
    }
    const rows = [...readAll(c)];
    const i = rows.findIndex((r) => r.id === id);
    if (i === -1) return null;
    rows[i] = { ...rows[i], ...patch, updatedAt: now };
    writeAll(c, rows);
    return rows[i];
  },

  async remove(c: Collection, id: string): Promise<boolean> {
    if (useSupabase) {
      await sb(c, { method: 'DELETE', query: `id=eq.${encodeURIComponent(id)}` }).catch(() => null);
      return true;
    }
    const rows = readAll(c);
    const next = rows.filter((r) => r.id !== id);
    if (next.length === rows.length) return false;
    writeAll(c, next);
    return true;
  },

  async replaceAll(c: Collection, docs: Record<string, any>[]): Promise<Doc[]> {
    const now = new Date().toISOString();
    const normalized: Doc[] = docs.map((d) => ({
      id: d.id || d.slug || newId(),
      createdAt: d.createdAt || now,
      updatedAt: now,
      ...d,
    }));
    if (!useSupabase) {
      writeAll(c, normalized);
    }
    return normalized;
  },

  async find(c: Collection, filter: Record<string, any> = {}, limit = 500): Promise<Doc[]> {
    if (useSupabase) {
      const out = await sb(c, { method: 'GET' }).catch(() => null);
      const rows: Doc[] = Array.isArray(out) ? out : [];
      return rows
        .filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, limit);
    }
    return readAll(c)
      .filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  },

  async findOne(c: Collection, filter: Record<string, any>): Promise<Doc | null> {
    const rows = await store.find(c, filter, 1);
    return rows[0] || null;
  },

  async all(c: Collection, limit = 1000): Promise<Doc[]> {
    return store.find(c, {}, limit);
  },
};

export default store;
