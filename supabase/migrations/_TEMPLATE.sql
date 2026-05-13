/*
  # Migration template for a new table in the public schema

  Why this file exists:
   Starting 2026-10-30 Supabase no longer auto-grants anon/authenticated/
   service_role on new tables in the public schema. Any migration that
   only does `create table` will leave the table inaccessible from
   supabase-js (PostgREST returns 42501). Copy this template instead of
   writing a bare `create table` so all grants + RLS are in place.

   For analytics / backend-only tables, do NOT use this template —
   create the table in the `internal` schema and `revoke all` instead.
   See .assistant/MODULE_SUPABASE.md for the split.

  How to use:
   1. Copy this file to supabase/migrations/<timestamp>_<name>.sql.
   2. Replace <your_table> everywhere with the actual table name.
   3. Adjust columns, policies, and the optional anon grant to fit the
      data model. Delete the comment block above before committing.
*/

-- 1. Table -------------------------------------------------------------
create table public.<your_table> (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  -- TODO: add real columns
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists <your_table>_user_id_idx
  on public.<your_table> (user_id);

-- 2. Grants ------------------------------------------------------------
-- Required from 2026-10-30. Existing tables keep their auto-grants.
grant select, insert, update, delete on public.<your_table> to authenticated;
grant all on public.<your_table> to service_role;
-- Uncomment ONLY if anonymous (logged-out) clients must read this table:
-- grant select on public.<your_table> to anon;

-- 3. Row Level Security ------------------------------------------------
alter table public.<your_table> enable row level security;

create policy "<your_table>: owner can read"
  on public.<your_table>
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "<your_table>: owner can insert"
  on public.<your_table>
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "<your_table>: owner can update"
  on public.<your_table>
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "<your_table>: owner can delete"
  on public.<your_table>
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- 4. updated_at trigger (optional, copy if needed) ---------------------
-- create trigger <your_table>_set_updated_at
--   before update on public.<your_table>
--   for each row execute function public.set_updated_at();
