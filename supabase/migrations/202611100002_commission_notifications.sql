-- Signal whether the state changed so retries do not send duplicate notifications.
create or replace function public.kr8_commission_transition(p_id text, p_action text, p_value numeric default null,
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
    if cm.data->>'status' in ('earned','paid') then return to_jsonb(cm) || jsonb_build_object('transitioned',false); end if;
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
    if cm.data->>'status'='paid' then return to_jsonb(cm) || jsonb_build_object('transitioned',false); end if;
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
  return to_jsonb(cm) || jsonb_build_object('transitioned',true);
end; $$;
