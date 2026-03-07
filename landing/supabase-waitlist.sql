-- Waitlist table for ONDA Life — run in Supabase SQL Editor

-- 1. Create table (if not exists)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add platform column if table already existed without it
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS platform TEXT;

-- 2. Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policy if re-running this script
DROP POLICY IF EXISTS "Allow anonymous insert" ON waitlist;

-- 4. Policy: anon can INSERT only, no SELECT
-- WITH CHECK rejects empty/whitespace-only emails
CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (trim(email) <> '');

-- Note: No SELECT policy for anon = emails are private.
-- Add a separate policy for authenticated admin if you need to read the list.
