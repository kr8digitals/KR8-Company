import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Unified document store. Local development uses JSON files; production uses
 * KR8's generic Supabase document tables (kr8_collections / kr8_documents).
 */
export type Doc = { id: string; createdAt: string; updatedAt: string; [key: string]: any };

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

const SB_URL = process.env.SUPABASE_URL?.replace(/\/+$/, '');
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SB_URL && SB_KEY);

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

async function sbRequest(table: 'kr8_collections' | 'kr8_documents', init: RequestInit & { method: string; query?: string }) {
  const q = init.query ? `?${init.query}` : '';
  const res = await fetch(`${SB_URL}/rest/v1/${table}${q}`, {
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

const initializedCollections = new Set<Collection>();
const collectionInitPromises = new Map<Collection, Promise<void>>();

async function ensureCollection(collection: Collection) {
  if (initializedCollections.has(collection)) return;
  const pending = collectionInitPromises.get(collection);
  if (pending) return pending;
  const task = sbRequest('kr8_collections', {
    method: 'POST',
    query: 'on_conflict=name',
    headers: { prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ name: collection }),
  }).then(() => {
    initializedCollections.add(collection);
    collectionInitPromises.delete(collection);
  }).catch((error) => {
    collectionInitPromises.delete(collection);
    throw error;
  });
  collectionInitPromises.set(collection, task);
  return task;
}

function mapDbRow(row: any): Doc {
  const data = row?.data && typeof row.data === 'object' ? row.data : {};
  return {
    ...data,
    id: String(row?.id ?? data.id ?? ''),
    createdAt: data.createdAt || row?.created_at || new Date().toISOString(),
    updatedAt: data.updatedAt || row?.updated_at || new Date().toISOString(),
  };
}

function filterQuery(collection: Collection, filter: Record<string, any> = {}, limit = 500) {
  const params = new URLSearchParams({
    select: 'collection,id,data,created_at,updated_at',
    collection: `eq.${collection}`,
    order: 'created_at.desc',
    limit: String(Math.min(Math.max(limit, 1), 5000)),
  });
  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined || value === null) continue;
    if (key === 'createdAt' || key === 'updatedAt') continue;
    if (key === 'id') params.set('id', `eq.${String(value)}`);
    else params.set(`data->>${key}`, `eq.${String(value)}`);
  }
  return params.toString();
}

async function sbFind(collection: Collection, filter: Record<string, any> = {}, limit = 500): Promise<Doc[]> {
  await ensureCollection(collection);
  const rows = await sbRequest('kr8_documents', { method: 'GET', query: filterQuery(collection, filter, limit) });
  return (Array.isArray(rows) ? rows : []).map(mapDbRow);
}

async function sbUpsert(collection: Collection, doc: Doc): Promise<Doc> {
  await ensureCollection(collection);
  const out = await sbRequest('kr8_documents', {
    method: 'POST',
    query: 'on_conflict=collection%2Cid',
    headers: { prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      collection,
      id: doc.id,
      data: doc,
      created_at: doc.createdAt,
      updated_at: doc.updatedAt,
    }),
  });
  return Array.isArray(out) && out[0] ? mapDbRow(out[0]) : doc;
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
    if (useSupabase) return sbUpsert(c, row);
    const rows = [...readAll(c)];
    const existingIdx = rows.findIndex((r) => r.id === row.id);
    if (existingIdx >= 0) rows[existingIdx] = row;
    else rows.push(row);
    writeAll(c, rows);
    return row;
  },

  async add<T extends Record<string, any>>(c: Collection, doc: T): Promise<Doc> {
    return store.insert(c, doc);
  },

  async update(c: Collection, id: string, patch: Record<string, any>): Promise<Doc | null> {
    const now = new Date().toISOString();
    if (useSupabase) {
      const current = await sbFind(c, { id }, 1).then((rows) => rows[0] || null);
      if (!current) return null;
      return sbUpsert(c, { ...current, ...patch, id, updatedAt: now });
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
      await ensureCollection(c);
      await sbRequest('kr8_documents', {
        method: 'DELETE',
        query: `collection=eq.${encodeURIComponent(c)}&id=eq.${encodeURIComponent(id)}`,
      });
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
    if (useSupabase) {
      for (const doc of normalized) await sbUpsert(c, doc);
    } else {
      writeAll(c, normalized);
    }
    return normalized;
  },

  async find(c: Collection, filter: Record<string, any> = {}, limit = 500): Promise<Doc[]> {
    if (useSupabase) return sbFind(c, filter, limit);
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
