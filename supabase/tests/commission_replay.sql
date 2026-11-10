-- Run against a migrated database. All fixtures roll back; no real customer data.
begin;
do $$
declare first_result jsonb; replay jsonb;
  rates jsonb := '{"website":10,"design":8,"small":10,"smallMinimumUsd":20,"bonusAfterPaidReferrals":3,"bonus":12}';
begin
  perform public.kr8_seed('referrals','[{"id":"test_ref","code":"transaction-test","email":"test@example.invalid"}]');
  perform public.kr8_seed('commissions','[{"id":"test_cm","referrerCode":"transaction-test","status":"pending","type":"website","valueUsd":1000}]');
  first_result := public.kr8_commission_transition('test_cm','confirm',1000,'',rates);
  replay := public.kr8_commission_transition('test_cm','confirm',1000,'',rates);
  if first_result->>'transitioned' <> 'true' or replay->>'transitioned' <> 'false' then
    raise exception 'Notification idempotency failed';
  end if;
  perform public.kr8_commission_transition('test_cm','pay');
  replay := public.kr8_commission_transition('test_cm','pay');
  if replay->>'transitioned' <> 'false' then raise exception 'Payout idempotency failed'; end if;
  if not exists(select 1 from public.kr8_documents where collection='referrals' and id='test_ref'
    and (data->>'earnedUsd')::numeric=100 and (data->>'withdrawnUsd')::numeric=100
    and (data->>'paidReferrals')::integer=1) then raise exception 'Incorrect totals'; end if;
end $$;
rollback;
