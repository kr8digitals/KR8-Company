# CTA-specific form intake and attribution

Information requests stay in their existing workflow collections: `leads` for project quotes, contact messages, team applications, Tribe and Mindset Shift interest; `partner_proposals` for executive partnership review; `orders` for ready-built site checkout; and `referrals` for referral account creation. Supabase stores each document as JSONB in `kr8_documents.data`, so additions are backward-compatible and do not require destructive column migrations.

## Purpose-specific answers

- **Project quote:** requested service, budget range, desired start window, and project brief.
- **Team application:** selected role, portfolio, experience level, availability, and motivation.
- **Partnership proposal:** organisation, contact role, collaboration track, timeline, proposal summary, and mutual value.
- **Mindset Shift interest:** location and topics of interest, alongside contact preference.
- **Tribe introduction:** location and creative interests, alongside contact preference.
- **Ready-built site order:** selected site, order price, preferred name/email/WhatsApp, and rebrand/delivery note.
- **Referral signup:** professional focus and contact details.
- **General contact:** service category, budget if relevant, and message.

The shared lead endpoint persists applicable purpose-specific answers as named fields. Every new intake also records `ctaId`, `ctaSourcePath`, `ctaDestination`, `ctaLabel`, and `ctaCapturedAt`. CTA clicks are captured client-side, scoped to the originating page, and sent with submissions; direct visits use a stable form-specific fallback CTA ID. Legacy submissions remain visible with their existing type and a “Direct / legacy” source fallback.

The admin Leads inbox can filter by CTA source and shows the source path and CTA ID. Proposal and order records expose the same attribution beside their purpose-specific review details. Lead CSV export includes the CTA attribution and custom answers. A partial Supabase index supports CTA-source queries across the intake collections; its migration is in `supabase/migrations/20261110120000_cta_submission_attribution.sql`.
