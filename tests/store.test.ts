import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.KR8_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kr8-store-test-'));
let store: typeof import('../src/lib/store').store;
let decodeRow: typeof import('../src/lib/store').decodeRow;
let encodeRow: typeof import('../src/lib/store').encodeRow;
let issueToken: typeof import('../src/lib/auth').issueToken;
let verifyToken: typeof import('../src/lib/auth').verifyToken;
let isAuthed: typeof import('../src/lib/auth').isAuthed;
let signOrder: typeof import('../src/lib/order-token').signOrder;
let verifyOrder: typeof import('../src/lib/order-token').verifyOrder;
test.before(async () => {
  ({ store, decodeRow, encodeRow } = await import('../src/lib/store'));
  ({ issueToken, verifyToken, isAuthed } = await import('../src/lib/auth'));
  ({ signOrder, verifyOrder } = await import('../src/lib/order-token'));
});

test('file seed, insert, patch, find, delete, and empty collection semantics', async () => {
  await store.seed('cms_pages', [{ id: 'page', title: 'seed' }]);
  const seeded = await store.findOne('cms_pages', { id: 'page' });
  assert.equal(seeded?.title, 'seed');
  await store.update('cms_pages', 'page', { title: 'edited', id: 'bad-id', createdAt: 'bad-time' });
  await store.seed('cms_pages', [{ id: 'page', title: 'reset' }]);
  const edited = await store.findOne('cms_pages', { id: 'page' });
  assert.equal(edited?.title, 'edited');
  assert.equal(edited?.createdAt, seeded?.createdAt);
  assert.equal(await store.remove('cms_pages', 'page'), true);
  await store.seed('cms_pages', [{ id: 'page', title: 'reset' }]);
  assert.deepEqual(await store.all('cms_pages'), []);
  await store.insert('leads', { id: 'one', email: 'a@example.com' });
  await assert.rejects(store.insert('leads', { id: 'one' }), /Duplicate/);
  assert.equal((await store.find('leads', { email: 'a@example.com' })).length, 1);
  assert.equal(await store.update('leads', 'missing', {}), null);
  await store.replaceAll('leads', [{ id: 'two', name: 'replacement' }]);
  assert.equal((await store.all('leads'))[0].id, 'two');
});

test('JSONB adapter round trips nested documents without exposing metadata collisions', () => {
  const original = { id: 'a', nested: { sections: [{ text: 'hi' }] }, createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-10T00:00:00Z' };
  assert.deepEqual(decodeRow(encodeRow('cms_pages', original)), original);
});

test('serverless storage fails closed without database credentials', async () => {
  process.env.KR8_REQUIRE_DATABASE = 'true';
  try { await assert.rejects(store.insert('leads', { name: 'test' }), /Durable database/); }
  finally { delete process.env.KR8_REQUIRE_DATABASE; }
});

test('Supabase predicates are applied before limit and failures propagate', async () => {
  process.env.SUPABASE_URL = 'https://example.invalid'; process.env.SUPABASE_SERVICE_KEY = 'test';
  const realFetch = globalThis.fetch;
  let url: URL | undefined;
  globalThis.fetch = async input => {
    url = new URL(String(input));
    return new Response(JSON.stringify([{ id: 'a', data: { status: 'new' }, created_at: 'now', updated_at: 'now' }]));
  };
  try {
    const rows = await store.find('leads', { status: 'new' }, 1);
    assert.equal(rows[0].status, 'new');
    assert.equal(url!.searchParams.get('data'), 'cs.{"status":"new"}');
    assert.equal(url!.searchParams.get('limit'), '1');
    globalThis.fetch = async () => new Response('unavailable', { status: 503 });
    await assert.rejects(store.find('leads'), /Database request failed/);
    await assert.rejects(store.update('leads', 'a', {}), /Database request failed/);
    await assert.rejects(store.remove('leads', 'a'), /Database request failed/);
  } finally { globalThis.fetch = realFetch; delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_KEY; }
});

test('Supabase find paginates beyond one response', async () => {
  process.env.SUPABASE_URL = 'https://example.invalid'; process.env.SUPABASE_SERVICE_KEY = 'test';
  const realFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async input => {
    const url = new URL(String(input)); calls++;
    const count = Number(url.searchParams.get('limit'));
    const offset = Number(url.searchParams.get('offset'));
    return new Response(JSON.stringify(Array.from({ length: count }, (_, i) => ({ id: String(offset+i), data: {}, created_at: 'now', updated_at: 'now' }))));
  };
  try { assert.equal((await store.all('events', 1100)).length, 1100); assert.equal(calls, 3); }
  finally { globalThis.fetch = realFetch; delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_KEY; }
});

test('signed admin cookie rejects tampering, Unicode and similarly named cookies', () => {
  process.env.ADMIN_PASSWORD = 'unit-test-password-32-characters-long';
  const token = issueToken();
  assert.equal(verifyToken(token), true);
  assert.equal(verifyToken(token + 'bad'), false);
  assert.equal(verifyToken(token.split('.').slice(0,2).join('.') + '.' + 'é'.repeat(43)), false);
  assert.equal(isAuthed(new Request('https://example.com', { headers: { cookie: `other=1; kr8_admin=${token}` } })), true);
  assert.equal(isAuthed(new Request('https://example.com', { headers: { cookie: `fake_kr8_admin=${token}` } })), false);
});

test('order signing requires a strong secret and does not put contact data in URL tokens', () => {
  process.env.ORDER_SECRET = 'unit-test-random-secret-longer-than-32-characters';
  const data = { id: 'order', reference: 'KR8-TEST', item: 'Site', amountUsd: 900, amountNgn: 1000000,
    createdAt: new Date().toISOString(), name: 'Private', email: 'private@example.com', phone: '123', note: 'Sensitive' };
  const token = signOrder(data);
  const payload = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
  assert.equal(payload.email, undefined); assert.equal(payload.name, undefined); assert.equal(payload.note, undefined);
  assert.equal(verifyOrder(token)?.reference, data.reference);
  assert.equal(verifyOrder(token + 'bad'), null);
  assert.equal(verifyOrder(token + '.extra'), null);
  delete process.env.ORDER_SECRET; delete process.env.ADMIN_PASSWORD;
  assert.throws(() => signOrder(data), /ORDER_SECRET/);
});

test.after(() => fs.rmSync(process.env.KR8_DATA_DIR!, { recursive: true, force: true }));
