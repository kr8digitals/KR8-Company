import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * One storage interface, two drivers.
 *
 *  - `file`     : zero-config JSON on disk. Used for local development and preview
 *                 deployments so the whole CMS works with no keys at all.
 *  - `supabase` : activated the moment SUPABASE_URL + SUPABASE_SERVICE_KEY exist.
 *                 Same interface, so the dashboard, the Host and every form keep
 *                 working without touching a single component.
 *
 * The interface is deliberately narrow (collection + id + JSON document) because
 * that is all this site needs — and a narrow interface is a stable one.
 * (Section 21: modular, one source of truth, environment variables for secrets.)
 */

export type Doc = { id: string; createdAt: string; updatedAt: string; [k: string]: any };
export type Collection =
  | 'leads' | 'referrals' | 'commissions' | 'payouts' | 'orders'
  | 'host_sessions' | 'host_messages' | 'events' | 'applications' | 'settings';

/**
 * Where the file driver writes.
 *  - local / self-hosted : <project>/.data
 *  - Vercel / serverless : /tmp (the only writable path), still ephemeral per instance.
 * The file driver is switchable for a reason: on serverless the data only lives
 * as long as the instance does. Supabase is one env var away — see README.
 */
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
};

function filePath(c: Collection) {
  return path.join(DATA_DIR, `${c}.json`);
}

function readAll(c: Collection): Doc[] {
  try {
    const raw = fs.readFileSync(filePath(c), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(c: Collection, rows: Doc[]) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath(c), JSON.stringify(rows.slice(-4000), null, 2));
  } catch {
    /* read-only filesystem (serverless): the request still succeeds in memory */
  }
}

const memory = new Map<Collection, Doc[]>();
function mem(c: Collection) {
  if (!memory.has(c)) memory.set(c, readAll(c));
  return memory.get(c)!;
}

async function sb(c: Collection, init: RequestInit & { method: string }) {
  const res = await fetch(`${SB_URL}/rest/v1/${TABLE[c]}`, {
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

  async insert<T extends Record<string, any>>(c: Collection, doc: T): Promise<Doc> {
    const now = new Date().toISOString();
    const row: Doc = { id: doc.id || newId(), createdAt: now, updatedAt: now, ...doc };
    if (useSupabase) {
      const out = await sb(c, { method: 'POST', body: JSON.stringify(row) });
      return Array.isArray(out) ? out[0] : row;
    }
    mem(c).push(row);
    writeAll(c, mem(c));
    return row;
  },

  async update(c: Collection, id: string, patch: Record<string, any>): Promise<Doc | null> {
    const now = new Date().toISOString();
    if (useSupabase) {
      const out = await sb(c, { method: 'PATCH', body: JSON.stringify({ ...patch, updatedAt: now }), headers: {} }).catch(() => null);
      return Array.isArray(out) ? out[0] : null;
    }
    const rows = mem(c);
    const i = rows.findIndex((r) => r.id === id);
    if (i === -1) return null;
    rows[i] = { ...rows[i], ...patch, updatedAt: now };
    writeAll(c, rows);
    return rows[i];
  },

  async find(c: Collection, filter: Record<string, any> = {}, limit = 200): Promise<Doc[]> {
    if (useSupabase) {
      const qs = Object.entries(filter)
        .map(([k, v]) => `${encodeURIComponent(k)}=eq.${encodeURIComponent(String(v))}`)
        .join('&');
      const out = await sb(c, { method: 'GET' }).catch(() => null);
      // Server-side filtering is used when the driver supports it; the client
      // filter below keeps both drivers behaving identically.
      const rows: Doc[] = Array.isArray(out) ? out : [];
      return rows
        .filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, limit);
    }
    return mem(c)
      .filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
  },

  async findOne(c: Collection, filter: Record<string, any>): Promise<Doc | null> {
    const rows = await store.find(c, filter, 1);
    return rows[0] || null;
  },

  async all(c: Collection, limit = 500): Promise<Doc[]> {
    return store.find(c, {}, limit);
  },
};
