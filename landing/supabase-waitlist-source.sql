-- Task 104: record where a waitlist signup came from (e.g. 'vibration_tool').
-- Nullable, no default — existing rows and old clients are unaffected.
-- Run ONCE in Supabase SQL Editor (owner). Not applied automatically.
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS source TEXT;
