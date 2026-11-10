import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthed } from '@/lib/auth';
import { assertSafeContent } from '@/lib/content-validation';
import { store, newId, type Collection } from '@/lib/store';
import {
  getCmsPages,
  getCmsServices,
  getCmsPrograms,
  getCmsTeam,
  getCmsPartners,
  getCmsNavigation,
  getCmsSeoAll,
  logRevision,
  restoreCmsRevision,
} from '@/lib/cms';
import { syncRiyaKnowledgeBase } from '@/lib/riya-knowledge';

export const runtime = 'nodejs';

function slugify(s: string) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-/]+|[-/]+$/g, '');
}

const ENTITY_MAP: Record<string, { col: Collection; ensure: () => Promise<any> }> = {
  page: { col: 'cms_pages', ensure: () => getCmsPages({ includeDrafts: true }) },
  service: { col: 'cms_services', ensure: () => getCmsServices({ includeDrafts: true }) },
  program: { col: 'cms_programs', ensure: () => getCmsPrograms({ includeDrafts: true }) },
  team: { col: 'cms_team', ensure: () => getCmsTeam({ includeDrafts: true }) },
  partner: { col: 'cms_partners', ensure: () => getCmsPartners({ includeDrafts: true }) },
  navigation: { col: 'cms_navigation', ensure: () => getCmsNavigation() },
  seo: { col: 'cms_seo', ensure: () => getCmsSeoAll() },
};

export async function POST(req: Request) {
  if (!isAuthed(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorised session. Please sign in again.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { entity, action, id, data } = body as {
      entity: string;
      action: 'save' | 'delete' | 'reorder' | 'restore' | 'proposal_status' | 'proposal_promote';
      id?: string;
      data?: Record<string, any>;
    };

    // 1. Restore from Revision History
    if (action === 'restore' && id) {
      const restored = await restoreCmsRevision(id);
      await syncRiyaKnowledgeBase(`cms_restore_${id}`);
      revalidatePath('/', 'layout');
      return NextResponse.json({ ok: true, doc: restored });
    }

    // 2. Partnership Proposal workflow
    if (action === 'proposal_status' && id && data) {
      const updated = await store.update('partner_proposals', id, {
        status: data.status || 'reviewing',
        adminNotes: data.adminNotes ?? '',
      });
      revalidatePath('/admin');
      return NextResponse.json({ ok: true, doc: updated });
    }

    if (action === 'proposal_promote' && id) {
      await getCmsPartners({ includeDrafts: true });
      const prop = await store.findOne('partner_proposals', { id });
      if (!prop) throw new Error('Proposal not found');
      const slug = slugify(prop.organisation) || `partner-${Date.now().toString(36)}`;
      const words = String(prop.organisation || 'KP').trim().split(/\s+/);
      const mark = (words.length >= 2 ? words[0][0] + words[1][0] : prop.organisation.slice(0, 2)).toUpperCase();

      const partnerDoc = await store.insert('cms_partners', {
        id: `partner-${slug}`,
        slug,
        name: prop.organisation,
        person: prop.contactName,
        role: prop.track || 'Strategic Partner',
        type: 'Strategic Partner',
        group: 'partners',
        logo: '',
        mark,
        featured: true,
        order: 10,
        status: 'published',
        blurb: prop.summary.slice(0, 220),
        long: prop.summary,
        contribution: prop.mutualValue || prop.summary,
        teaches: prop.track || 'Strategic Collaboration',
        record: 'Approved through KR8 DIGITALS Partnership Review.',
        href: `/partners/${slug}`,
      });

      await store.update('partner_proposals', id, { status: 'approved' });
      await logRevision({
        entityType: 'partner',
        entityId: partnerDoc.id,
        entityLabel: partnerDoc.name,
        action: 'promoted_from_proposal',
        snapshot: partnerDoc,
      });
      await syncRiyaKnowledgeBase(`cms_partner_promoted_${partnerDoc.slug}`);
      revalidatePath('/', 'layout');
      return NextResponse.json({ ok: true, doc: partnerDoc });
    }

    const cfg = ENTITY_MAP[entity];
    if (!cfg) {
      return NextResponse.json({ ok: false, error: `Unknown CMS entity: ${entity}` }, { status: 400 });
    }

    // Ensure collection is seeded before mutating
    await cfg.ensure();

    if (action === 'delete') {
      if (!id) throw new Error('Missing item ID');
      const existing = await store.findOne(cfg.col, { id });
      if (entity === 'page' && existing?.isSystem) {
        throw new Error('Core system routes cannot be deleted — set status to Draft or Archived instead.');
      }
      await store.remove(cfg.col, id);
      if (existing) {
        await logRevision({
          entityType: entity,
          entityId: id,
          entityLabel: existing.title || existing.name || existing.route || id,
          action: 'deleted',
          snapshot: existing,
        });
      }
      await syncRiyaKnowledgeBase(`cms_${entity}_deleted`);
      revalidatePath('/', 'layout');
      return NextResponse.json({ ok: true });
    }

    if (action === 'save' && data) {
      assertSafeContent(data);
      const payload = { ...data };

      // Preserve exact display names for team/founders (trim outer spaces only, never split or mutate characters)
      if (entity === 'team' && typeof payload.name === 'string') {
        payload.name = payload.name.trim();
      }

      if (entity === 'page') {
        payload.slug = payload.isSystem ? payload.slug : slugify(payload.slug || payload.title);
        if (!payload.slug) throw new Error('Page URL slug is required.');
      }

      if ((entity === 'service' || entity === 'program' || entity === 'partner') && !payload.slug) {
        payload.slug = slugify(payload.name || payload.title);
      }

      const targetId = id || payload.id || newId(`${entity}_`);
      const existing = await store.findOne(cfg.col, { id: targetId });

      let saved;
      if (existing) {
        saved = await store.update(cfg.col, targetId, payload);
      } else {
        saved = await store.insert(cfg.col, { ...payload, id: targetId });
      }

      await logRevision({
        entityType: entity,
        entityId: targetId,
        entityLabel: saved?.title || saved?.name || saved?.route || targetId,
        action: existing ? 'updated' : 'created',
        snapshot: saved,
      });

      const syncMeta = await syncRiyaKnowledgeBase(`cms_${entity}_${existing ? 'updated' : 'created'}`);
      revalidatePath('/', 'layout');
      return NextResponse.json({ ok: true, doc: saved, riyaSync: syncMeta });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported CMS operation' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'CMS operation failed' }, { status: 400 });
  }
}
