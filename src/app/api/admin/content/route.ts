import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthed } from '@/lib/auth';
import { store } from '@/lib/store';
import { getHomeContent, getSiteCatalog, getSiteContent, getPricingContent, getProgramContent, HOME_DEFAULTS } from '@/lib/site-content';
import { EDITABLE_DEFAULTS, getEditableBundle } from '@/lib/editable-content';
import { validShape, assertSafeContent } from '@/lib/content-validation';
import { logRevision } from '@/lib/cms';
import siteSeed from '../../../../../data/site.json';
import catalogSeed from '../../../../../data/sites.json';
import pricingSeed from '../../../../../data/pricing.json';
import programmesSeed from '../../../../../data/programmes.json';

export const runtime = 'nodejs';
export async function GET(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  try {
    const [home, site, catalog, pricing, programmeData, copy] = await Promise.all([
      getHomeContent(), getSiteContent(), getSiteCatalog(), getPricingContent(), getProgramContent(), getEditableBundle(),
    ]);
    return NextResponse.json({ documents: { home, site, catalog, pricing, 'programme-data': programmeData,
      ...Object.fromEntries(Object.entries(copy).map(([key, value]) => [`copy:${key}`, value])) } });
  } catch { return NextResponse.json({ error: 'Unable to load database content' }, { status: 503 }); }
}
export async function POST(req: Request) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  if (Number(req.headers.get('content-length') || 0) > 500000) return NextResponse.json({ error: 'Content too large' }, { status: 413 });
  try {
    const { name, values } = await req.json();
    if (typeof name !== 'string' || !values || JSON.stringify(values).length > 500000) throw new Error('Invalid content document');
    const documentKey = name.startsWith('copy:') ? name.slice(5) : null;
    const template = documentKey ? EDITABLE_DEFAULTS[documentKey] : ({
      home: HOME_DEFAULTS, site: siteSeed, catalog: catalogSeed, pricing: pricingSeed, 'programme-data': programmesSeed,
    } as Record<string, any>)[name];
    if (!template || !validShape(values, template)) throw new Error('Keep the required content fields and their types. Lists can be reordered, expanded or shortened.');
    assertSafeContent(values);
    if (documentKey) for (const key of ['BEATS','ACTS','SOLUTION_CARDS','TRIBE_NODES']) {
      const list = values.blocks[key];
      if (list && (!list.length || list.some((item: any) => item.ms !== undefined && (!Number.isFinite(item.ms) || item.ms < 1000 || item.ms > 60000)))) throw new Error('Interactive panels need at least one item, with durations between 1 and 60 seconds');
    }
    if (name === 'catalog') {
      const seen = new Set();
      for (const s of values.sites) {
        if (!s.slug || seen.has(s.slug) || !['live','for-sale'].includes(s.status)
          || (s.status === 'for-sale' && (!Number.isFinite(s.priceUsd) || s.priceUsd <= 0))) throw new Error('Invalid catalogue price, status or duplicate slug');
        seen.add(s.slug);
      }
    }
    if (name === 'site') {
      const rates = values.settings.referralRates;
      for (const key of ['website','design','small','bonus']) if (rates[key] < 0 || rates[key] > 100) throw new Error('Commission percentages must be between 0 and 100');
      if (rates.smallMinimumUsd < 0 || rates.bonusAfterPaidReferrals < 0) throw new Error('Referral thresholds cannot be negative');
    }
    if (name === 'pricing') for (const service of Object.values(values.services) as any[]) {
      if (!Array.isArray(service.tiers) || service.tiers.some((tier: any) => !Number.isFinite(tier.usd) || tier.usd <= 0)) throw new Error('Prices must be positive');
    }
    const id = `content-${name}`;
    const previous = await store.findOne('settings', { id });
    // Store the pre-edit state too, including a shipped default on the first edit.
    await logRevision({ entityType: 'content', entityId: id, entityLabel: name, action: 'before_update',
      snapshot: { id, values: previous?.values || template, ...(documentKey ? { kind: 'editable_content', documentKey } : {}) } });
    const payload = { values, ...(documentKey ? { kind: 'editable_content', documentKey } : {}) };
    if (previous) await store.update('settings', id, payload);
    else await store.insert('settings', { id, ...payload });
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message || 'Unable to save' }, { status: 400 }); }
}
