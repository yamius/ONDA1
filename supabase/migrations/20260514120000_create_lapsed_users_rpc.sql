/*
  # RPC: lapsed_users_for_reengagement

  Returns user_ids whose most-recent app_open is between 7 and 14 days
  ago AND who have not received a 'reengagement_push_sent' event in the
  last 7 days.

  Designed for the supabase/functions/send-engagement-push Edge
  Function. Lives as a SECURITY DEFINER RPC so the Edge Function (which
  authenticates with the service role key) can call it without
  inheriting RLS — the function reads only aggregated user_ids, no PII.

  Day window rationale:
    – 0-6 days  → handled by on-device lapsed reminders (local).
    – 7-13 days → handled by this Edge Function (server, this RPC).
    – 14+ days  → silenced. Further push would just earn an uninstall.
                  Re-engagement after 14d goes through paid acquisition
                  or email, not push.
*/

create or replace function public.lapsed_users_for_reengagement()
returns table (user_id uuid)
language sql
security definer
set search_path = public
as $$
  with last_open as (
    select user_id, max(created_at) as last_open_at
    from app_events
    where event_name = 'app_open'
      and user_id is not null
    group by user_id
  ),
  last_push as (
    select user_id, max(created_at) as last_push_at
    from app_events
    where event_name = 'reengagement_push_sent'
      and user_id is not null
    group by user_id
  )
  select lo.user_id
  from last_open lo
  left join last_push lp on lp.user_id = lo.user_id
  where lo.last_open_at < now() - interval '7 days'
    and lo.last_open_at >= now() - interval '14 days'
    and (lp.last_push_at is null or lp.last_push_at < now() - interval '7 days');
$$;

-- Service role only. We don't want anon / authenticated to enumerate
-- lapsed user_ids — that's audience-leak territory.
revoke all on function public.lapsed_users_for_reengagement() from public, anon, authenticated;
grant execute on function public.lapsed_users_for_reengagement() to service_role;

comment on function public.lapsed_users_for_reengagement is
  'Audience query for the send-engagement-push Edge Function. Returns user_ids in the 7-14 day lapsed window who have not already been pushed in the last 7 days.';
