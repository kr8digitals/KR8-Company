import { NextResponse } from 'next/server';
import { store, newId } from '@/lib/store';

export type PartnerProposal = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  organisation: string;
  contactName: string;
  roleTitle: string;
  email: string;
  phone: string;
  website: string;
  track: string;
  summary: string;
  mutualValue: string;
  timeline: string;
  status: 'new' | 'reviewing' | 'approved' | 'declined' | 'archived';
  adminNotes: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const organisation = String(body.organisation || '').trim().slice(0, 140);
    const contactName = String(body.contactName || '').trim().slice(0, 120);
    const roleTitle = String(body.roleTitle || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().slice(0, 160);
    const phone = String(body.phone || '').trim().slice(0, 60);
    const website = String(body.website || '').trim().slice(0, 240);
    const track = String(body.track || 'Creative / Studio Collaboration').trim().slice(0, 120);
    const summary = String(body.summary || '').trim().slice(0, 3000);
    const mutualValue = String(body.mutualValue || '').trim().slice(0, 2000);
    const timeline = String(body.timeline || '').trim().slice(0, 120);

    if (!organisation || !contactName || !email || !summary) {
      return NextResponse.json(
        { error: 'Please complete your organisation name, contact person, email, and partnership proposal summary.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid work or personal email address.' }, { status: 400 });
    }

    const rawCta = body.cta && typeof body.cta === 'object' ? body.cta : {};
    const cta = {
      ctaId: String(rawCta.ctaId || 'partnership-proposal:/partners#propose').slice(0, 180),
      ctaSourcePath: String(rawCta.sourcePath || '/partners').slice(0, 240),
      ctaDestination: String(rawCta.destination || '/partners#propose').slice(0, 400),
      ctaLabel: String(rawCta.label || 'Submit a Partnership Proposal').slice(0, 120),
      ctaCapturedAt: String(rawCta.capturedAt || '').slice(0, 40),
    };

    const proposal = await store.insert('partner_proposals', {
      id: newId('prop_'),
      createdAt: new Date().toISOString(),
      organisation,
      contactName,
      roleTitle,
      email,
      phone,
      website,
      track,
      summary,
      mutualValue,
      timeline,
      status: 'new',
      adminNotes: '',
      ...cta,
    });

    // Also mirror into leads inbox so unified Inbox + Partnerships modules stay synchronized
    await store.add('leads', {
      kind: 'partnership',
      name: contactName,
      email,
      phone,
      organisation,
      service: `Partnership · ${track}`,
      budget: timeline || 'Partnership Proposal',
      message: `[${track}] ${summary}${mutualValue ? `\n\nMutual Value: ${mutualValue}` : ''}${website ? `\nWebsite: ${website}` : ''}`,
      status: 'new',
      proposalId: proposal.id,
      ...cta,
    });

    return NextResponse.json({ ok: true, id: proposal.id });
  } catch {
    return NextResponse.json({ error: 'Unable to submit proposal right now. Please try again.' }, { status: 500 });
  }
}
