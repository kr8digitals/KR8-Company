-- Purpose-specific CTA source and destination are stored in kr8_documents.data
-- (JSONB), alongside each lead/proposal/order/referral. This partial index
-- supports source-based admin reporting without scanning unrelated CMS rows.
create index if not exists kr8_documents_cta_submission_idx
  on public.kr8_documents (collection, (data ->> 'ctaId'), created_at desc)
  where collection in ('leads', 'partner_proposals', 'orders', 'referrals');
