-- Diary entries (retention step 3) — local-first day notes that migrate here on
-- sign-in. One row per note, owned by the user. Voice audio is NOT stored here
-- yet (base64 stays on-device until a Storage bucket lands with the photo
-- fast-follow); audio_url is provisioned for that step.

-- 1. Table -------------------------------------------------------------
create table public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Stable client-generated id — lets the local-first migration upsert without
  -- duplicating when it runs more than once.
  client_id text not null,
  text text not null default '',
  source text not null default 'text',   -- text | voice | text_voice
  event_time timestamptz not null default now(),  -- when it actually happened
  rhr integer,                            -- resting-pulse snapshot for that day, if known
  audio_url text,                         -- future: voice moved to Storage
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create index if not exists diary_entries_user_id_idx
  on public.diary_entries (user_id);
create index if not exists diary_entries_event_time_idx
  on public.diary_entries (user_id, event_time desc);

-- 2. Grants ------------------------------------------------------------
grant select, insert, update, delete on public.diary_entries to authenticated;
grant all on public.diary_entries to service_role;

-- 3. Row Level Security ------------------------------------------------
alter table public.diary_entries enable row level security;

create policy "diary_entries: owner can read"
  on public.diary_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "diary_entries: owner can insert"
  on public.diary_entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "diary_entries: owner can update"
  on public.diary_entries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "diary_entries: owner can delete"
  on public.diary_entries
  for delete
  to authenticated
  using (auth.uid() = user_id);
