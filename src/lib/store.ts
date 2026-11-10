import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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

const DATA_DIR = process.env.KR8_DATA_DIR || path.join(process.cwd(), '.data');
type DbRow = { id: string; data: Record<string, any>; created_at: string; updated_at: string };

export function databaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}
function requireStorage() {
  if (!databaseConfigured() && (process.env.VERCEL || process.env.KR8_REQUIRE_DATABASE === 'true')) {
    throw new Error('Durable database is required. Configure SUPABASE_URL and SUPABASE_SERVICE_KEY.');
  }
}
function readAll(c: Collection): Doc[] {
  requireStorage();
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${c}.json`), 'utf8')); }
  catch (e: any) { if (e.code === 'ENOENT') return []; throw e; }
}
function writeAll(c: Collection, rows: Doc[]) {
  requireStorage();
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const dest = path.join(DATA_DIR, `${c}.json`);
  const temp = `${dest}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(rows, null, 2), { mode: 0o600 });
  fs.renameSync(temp, dest);
}
export function decodeRow(row: DbRow): Doc {
  return { ...row.data, id: row.id, createdAt: row.created_at, updatedAt: row.updated_at };
}
export function encodeRow(c: Collection, doc: Record<string, any>): DbRow & { collection: Collection } {
  const { id, createdAt, updatedAt, ...data } = doc;
  const now = new Date().toISOString();
  return { collection: c, id: id || newId(), created_at: createdAt || now, updated_at: updatedAt || now, data };
}
export async function databaseRequest(endpoint: string, init: RequestInit = {}) {
  requireStorage();
  if (!databaseConfigured()) throw new Error('Database is not configured');
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const response = await fetch(`${process.env.SUPABASE_URL!.replace(/\/$/, '')}/rest/v1/${endpoint}`, {
    ...init, headers: { apikey: key, ...(key.startsWith('sb_secret_') ? {} : { authorization: `Bearer ${key}` }), 'content-type': 'application/json',
      prefer: 'return=representation', ...init.headers }, cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    // Do not disclose database details, query contents or personal data to API callers.
    console.error('Database request failed', { status: response.status, endpoint: endpoint.split('?')[0] });
    throw new Error(`Database request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}
export function newId(prefix = '') { return `${prefix}${crypto.randomUUID()}`; }

export const store = {
  driver: () => databaseConfigured() ? 'supabase' : 'file',
  dataDir: () => DATA_DIR,
  async insert<T extends Record<string, any>>(c: Collection, doc: T): Promise<Doc> {
    requireStorage();
    const encoded = encodeRow(c, doc);
    if (databaseConfigured()) {
      await databaseRequest('kr8_collections?on_conflict=name', { method: 'POST',
        headers: { prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({ name: c }) });
      const rows = await databaseRequest('kr8_documents', { method: 'POST', body: JSON.stringify(encoded) });
      if (!rows?.[0]) throw new Error('Database insert returned no record');
      return decodeRow(rows[0]);
    }
    const row = decodeRow(encoded);
    const rows = readAll(c);
    if (rows.some(r => r.id === row.id)) throw new Error('Duplicate document ID');
    writeAll(c, [...rows, row]);
    return row;
  },
  async add<T extends Record<string, any>>(c: Collection, doc: T) { return store.insert(c, doc); },
  async update(c: Collection, id: string, patch: Record<string, any>): Promise<Doc | null> {
    requireStorage();
    const { id: _id, createdAt: _created, updatedAt: _updated, ...clean } = patch;
    if (databaseConfigured()) {
      const rows = await databaseRequest('rpc/kr8_patch', { method: 'POST',
        body: JSON.stringify({ p_collection: c, p_id: id, p_patch: clean }) });
      return rows?.[0] ? decodeRow(rows[0]) : null;
    }
    const rows = readAll(c), i = rows.findIndex(r => r.id === id);
    if (i < 0) return null;
    rows[i] = { ...rows[i], ...clean, updatedAt: new Date().toISOString() };
    writeAll(c, rows); return rows[i];
  },
  async remove(c: Collection, id: string): Promise<boolean> {
    requireStorage();
    if (databaseConfigured()) {
      const q = new URLSearchParams({ collection: `eq.${c}`, id: `eq.${id}` });
      const rows = await databaseRequest(`kr8_documents?${q}`, { method: 'DELETE' });
      return rows.length > 0;
    }
    const rows = readAll(c), next = rows.filter(r => r.id !== id);
    writeAll(c, next); return rows.length !== next.length;
  },
  async replaceAll(c: Collection, docs: Record<string, any>[]): Promise<Doc[]> {
    requireStorage();
    const rows = docs.map(d => decodeRow(encodeRow(c, d)));
    if (databaseConfigured()) await databaseRequest('rpc/kr8_replace', { method: 'POST',
      body: JSON.stringify({ p_collection: c, p_docs: rows }) });
    else writeAll(c, rows);
    return rows;
  },
  async seed(c: Collection, docs: Record<string, any>[]): Promise<void> {
    requireStorage();
    const rows = docs.map(d => decodeRow(encodeRow(c, d)));
    if (databaseConfigured()) await databaseRequest('rpc/kr8_seed', { method: 'POST',
      body: JSON.stringify({ p_collection: c, p_docs: rows }) });
    else if (!fs.existsSync(path.join(DATA_DIR, `${c}.json`))) writeAll(c, rows);
  },
  async find(c: Collection, filter: Record<string, any> = {}, limit = 500): Promise<Doc[]> {
    requireStorage();
    const max = Math.max(0, Math.min(10000, Math.floor(limit)));
    if (!max) return [];
    if (databaseConfigured()) {
      const { id, createdAt, updatedAt, ...data } = filter;
      const q = new URLSearchParams({ collection: `eq.${c}`, order: 'created_at.desc,id.asc' });
      if (id !== undefined) q.set('id', `eq.${id}`);
      if (createdAt !== undefined) q.set('created_at', `eq.${createdAt}`);
      if (updatedAt !== undefined) q.set('updated_at', `eq.${updatedAt}`);
      if (Object.keys(data).length) q.set('data', `cs.${JSON.stringify(data)}`);
      const result: Doc[] = [];
      while (result.length < max) {
        const count = Math.min(500, max-result.length);
        q.set('limit', String(count)); q.set('offset', String(result.length));
        const rows: DbRow[] = await databaseRequest(`kr8_documents?${q}`);
        result.push(...rows.map(decodeRow));
        if (rows.length < count) break;
      }
      return result;
    }
    return readAll(c).filter(r => Object.entries(filter).every(([k,v]) => r[k] === v))
      .sort((a,b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)).slice(0,max);
  },
  async findOne(c: Collection, filter: Record<string, any>): Promise<Doc | null> {
    return (await store.find(c, filter, 1))[0] || null;
  },
  async all(c: Collection, limit = 1000) { return store.find(c, {}, limit); },
};
export default store;
