-- Create app_events table for analytics tracking
-- This table stores all user events for product analytics

create table if not exists public.app_events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  
  -- User identification
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text, -- For tracking before user signs in
  session_id uuid,   -- Group events by session
  
  -- Event data
  event_name text not null,
  platform text check (platform in ('ios', 'android', 'watchos', 'web')),
  app_version text,
  
  -- Flexible metadata
  metadata jsonb default '{}'::jsonb,
  
  -- Attribution (for marketing)
  utm_source text,
  utm_medium text,
  utm_campaign text
);

-- Indexes for common queries
create index if not exists idx_app_events_user_id on public.app_events(user_id);
create index if not exists idx_app_events_event_name on public.app_events(event_name);
create index if not exists idx_app_events_created_at on public.app_events(created_at desc);
create index if not exists idx_app_events_session_id on public.app_events(session_id);

-- Composite index for funnel analysis
create index if not exists idx_app_events_user_event on public.app_events(user_id, event_name, created_at);

-- Enable RLS
alter table public.app_events enable row level security;

-- Policy: Users can insert their own events
create policy "Users can insert own events"
  on public.app_events
  for insert
  with check (
    auth.uid() = user_id 
    or user_id is null  -- Allow anonymous events
  );

-- Policy: Users can read their own events
create policy "Users can read own events"
  on public.app_events
  for select
  using (auth.uid() = user_id);

-- Policy: Service role can do everything (for admin dashboards)
create policy "Service role full access"
  on public.app_events
  for all
  using (auth.jwt()->>'role' = 'service_role');

-- Comment on table
comment on table public.app_events is 'Product analytics events tracking';
comment on column public.app_events.anonymous_id is 'Device identifier for tracking before sign-in';
comment on column public.app_events.session_id is 'Groups events from the same app session';
comment on column public.app_events.metadata is 'Flexible JSON for event-specific data';
