-- Versioned server-only document store. JSONB preserves existing CMS nested schemas.
create table public.kr8_collections (
  name text primary key check (name in (
    'leads','referrals','commissions','payouts','orders','host_sessions','host_messages','events',
    'applications','settings','partner_proposals','cms_pages','cms_services','cms_programs',
    'cms_team','cms_partners','cms_media','cms_navigation','cms_seo','cms_revisions',
    'riya_kb_custom','riya_knowledge_gaps','riya_learned_patterns','riya_submissions',
    'riya_sync_log','riya_feedback_ratings','riya_security_events')),
  initialized_at timestamptz not null default now()
);
create table public.kr8_documents (
  collection text not null references public.kr8_collections(name),
  id text not null check (length(id) between 1 and 200),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id),
  check (not (data ?| array['id','createdAt','updatedAt']))
);
create index kr8_documents_data_idx on public.kr8_documents using gin(data jsonb_path_ops);
create index kr8_documents_recent_idx on public.kr8_documents(collection, created_at desc, id);
create unique index kr8_referral_code_unique on public.kr8_documents ((data->>'code')) where collection='referrals';
create unique index kr8_referral_email_unique on public.kr8_documents (lower(data->>'email')) where collection='referrals';
create unique index kr8_order_reference_unique on public.kr8_documents ((data->>'reference')) where collection='orders';
create unique index kr8_cms_slug_unique on public.kr8_documents (collection, (data->>'slug'))
  where collection in ('cms_pages','cms_services','cms_programs','cms_partners');
create unique index kr8_cms_route_unique on public.kr8_documents ((data->>'route')) where collection='cms_seo';
create index kr8_documents_visitor_idx on public.kr8_documents(collection, (data->>'visitorId'));
create index kr8_documents_referrer_idx on public.kr8_documents(collection, (data->>'referrerCode'));
alter table public.kr8_collections enable row level security;
alter table public.kr8_documents enable row level security;
revoke all on public.kr8_collections, public.kr8_documents from anon, authenticated;
grant select, insert, update, delete on public.kr8_collections, public.kr8_documents to service_role;

-- Atomic initialization: concurrent requests never overwrite an administrator's edits.
-- A marker survives deleting the last document, so empty collections stay empty.
create function public.kr8_seed(p_collection text, p_docs jsonb) returns void
language plpgsql set search_path = public as $$
begin
  insert into kr8_collections(name) values (p_collection) on conflict do nothing;
  if not found then return; end if;
  insert into kr8_documents(collection,id,data,created_at,updated_at)
  select p_collection, d->>'id', d - array['id','createdAt','updatedAt'],
    coalesce((d->>'createdAt')::timestamptz, now()), now()
  from jsonb_array_elements(p_docs) d;
end; $$;

-- One statement merges patches without a client read/modify/write race.
create function public.kr8_patch(p_collection text, p_id text, p_patch jsonb)
returns setof public.kr8_documents language sql set search_path = public as $$
  update kr8_documents set data = data || (p_patch - array['id','createdAt','updatedAt']), updated_at=now()
  where collection=p_collection and id=p_id returning *;
$$;

create function public.kr8_replace(p_collection text, p_docs jsonb) returns void
language plpgsql set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('kr8_collection:' || p_collection, 0));
  insert into kr8_collections(name) values(p_collection) on conflict do nothing;
  delete from kr8_documents where collection=p_collection;
  insert into kr8_documents(collection,id,data,created_at,updated_at)
  select p_collection, d->>'id', d - array['id','createdAt','updatedAt'],
    coalesce((d->>'createdAt')::timestamptz, now()), now()
  from jsonb_array_elements(p_docs) d;
end; $$;

-- All financial transitions serialize; repeats are no-ops. Totals are recomputed
-- from the ledger in the same transaction rather than incremented in JavaScript.
create function public.kr8_commission_transition(p_id text, p_action text, p_value numeric default null,
  p_note text default '', p_rates jsonb default '{}') returns jsonb
language plpgsql set search_path = public as $$
declare cm kr8_documents; rf kr8_documents; paid_count integer; rate numeric; value numeric;
  amount numeric; stamp text := to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
begin
  perform pg_advisory_xact_lock(hashtextextended('kr8_financial_ledger',0));
  select * into cm from kr8_documents where collection='commissions' and id=p_id for update;
  if not found then raise exception 'Commission not found'; end if;
  select * into rf from kr8_documents where collection='referrals' and data->>'code'=cm.data->>'referrerCode' for update;
  if not found then raise exception 'Referrer not found'; end if;
  if p_action='confirm' then
    if cm.data->>'status' in ('earned','paid') then return to_jsonb(cm); end if;
    if cm.data->>'status' is distinct from 'pending' then raise exception 'Invalid commission state'; end if;
    value := coalesce(p_value,(cm.data->>'valueUsd')::numeric,0);
    if value <= 0 then raise exception 'Project value must be positive'; end if;
    select count(*) into paid_count from kr8_documents where collection='commissions'
      and data->>'referrerCode'=rf.data->>'code' and data->>'status'='paid';
    rate := case
      when paid_count >= (p_rates->>'bonusAfterPaidReferrals')::integer then (p_rates->>'bonus')::numeric
      when lower(cm.data->>'type') ~ '(design|video|seo|search|brand)' then (p_rates->>'design')::numeric
      when lower(cm.data->>'type') like '%small%' then (p_rates->>'small')::numeric
      else (p_rates->>'website')::numeric end;
    if rate is null or rate < 0 or rate > 100 then raise exception 'Invalid commission rate'; end if;
    amount := round(value*rate/100,2);
    if lower(cm.data->>'type') like '%small%' then amount := greatest(amount,(p_rates->>'smallMinimumUsd')::numeric); end if;
    update kr8_documents set data=data || jsonb_build_object('valueUsd',value,'ratePct',rate,
      'commissionUsd',amount,'status','earned','confirmedAt',stamp),updated_at=now()
      where collection='commissions' and id=p_id returning * into cm;
  elsif p_action='pay' then
    if cm.data->>'status'='paid' then return to_jsonb(cm); end if;
    if cm.data->>'status' is distinct from 'earned' then raise exception 'Confirm commission before payout'; end if;
    update kr8_documents set data=data || jsonb_build_object('status','paid','paidAt',stamp,'paidNote',left(p_note,1000)),updated_at=now()
      where collection='commissions' and id=p_id returning * into cm;
  else raise exception 'Unknown commission action'; end if;
  update kr8_documents set data=data || (
    select jsonb_build_object(
      'earnedUsd',coalesce(sum((data->>'commissionUsd')::numeric) filter(where data->>'status' in ('earned','paid')),0),
      'withdrawnUsd',coalesce(sum((data->>'commissionUsd')::numeric) filter(where data->>'status'='paid'),0),
      'paidReferrals',count(*) filter(where data->>'status'='paid'))
    from kr8_documents where collection='commissions' and data->>'referrerCode'=rf.data->>'code'
  ),updated_at=now() where collection='referrals' and id=rf.id;
  return to_jsonb(cm);
end; $$;
revoke all on function public.kr8_seed(text,jsonb), public.kr8_patch(text,text,jsonb),
  public.kr8_replace(text,jsonb), public.kr8_commission_transition(text,text,numeric,text,jsonb) from public, anon, authenticated;
grant execute on function public.kr8_seed(text,jsonb), public.kr8_patch(text,text,jsonb),
  public.kr8_replace(text,jsonb), public.kr8_commission_transition(text,text,numeric,text,jsonb) to service_role;
