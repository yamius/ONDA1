# Supabase Migrations Setup

This guide explains how to set up automatic database migrations for ONDA.

## How It Works

Migrations are applied **manually** via GitHub Actions workflow. This approach is more reliable for existing projects.

```
Create SQL file → Push to main → Run workflow manually → Database updated
```

## Setup Steps

### 1. Get Supabase Access Token

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click your avatar → **Account Settings**
3. Go to **Access Tokens**
4. Click **Generate new token**
5. Name it `github-actions` and copy the token

### 2. Get Project Reference

1. Go to your project in Supabase Dashboard
2. Click **Project Settings** (gear icon)
3. Copy the **Reference ID** (looks like `abcdefghijklmnop`)

### 3. Add GitHub Secrets

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `SUPABASE_ACCESS_TOKEN` | Your access token from step 1 |
| `SUPABASE_PROJECT_REF` | Your project reference from step 2 |

### 4. Test the Setup

1. Go to **Actions** tab in GitHub
2. Select **Supabase - Apply Migrations**
3. Click **Run workflow**
4. Type `apply` in the confirmation field
5. Click **Run workflow**

If successful, you'll see a green checkmark.

## Usage

### Step 1: Create Migration File

```bash
# Create a new migration with timestamp
touch supabase/migrations/20260106120000_add_new_table.sql

# Edit the file with your SQL

# Commit and push
git add supabase/migrations/
git commit -m "db: add new table"
git push origin main
```

### Step 2: Apply via GitHub Actions

1. Go to **Actions** → **Supabase - Apply Migrations (Manual)**
2. Click **Run workflow**
3. Enter the migration filename (e.g., `20260106120000_add_new_table.sql`)
4. Type `apply` to confirm
5. Click **Run workflow**

### Alternative: Apply via Supabase Dashboard

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of your migration file
3. Execute

## Creating Migrations

### Naming Convention

```
YYYYMMDDHHMMSS_description.sql
```

Example: `20260106143000_create_user_settings.sql`

### Migration Template

```sql
-- Migration: create_user_settings
-- Description: Add user settings table

create table if not exists public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, setting_key)
);

-- Enable RLS
alter table public.user_settings enable row level security;

-- Policy: Users can manage their own settings
create policy "Users manage own settings"
  on public.user_settings
  for all
  using (auth.uid() = user_id);

-- Index
create index idx_user_settings_user_id on public.user_settings(user_id);
```

## Troubleshooting

### "Migration already applied"

This is normal — Supabase tracks which migrations have been applied and skips them.

### "Permission denied"

Check that your access token has the correct permissions and hasn't expired.

### "Project not found"

Verify the `SUPABASE_PROJECT_REF` secret is correct.

### Rolling Back

Supabase CLI doesn't support automatic rollbacks. To undo a migration:

1. Create a new migration that reverses the changes
2. Push to main

```sql
-- 20260106150000_rollback_user_settings.sql
drop table if exists public.user_settings;
```

## Local Development

To apply migrations locally:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push
```

## See Also

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Analytics System](../architecture/analytics.md) — Uses `app_events` table
