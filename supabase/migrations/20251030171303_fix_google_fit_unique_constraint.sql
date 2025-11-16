/*
  # Fix Google Fit Connections Unique Constraint

  1. Changes
    - Drop existing primary key on user_id only
    - Add composite unique constraint on (user_id, provider)
    - This allows upsert to work correctly with ON CONFLICT
  
  2. Security
    - No changes to RLS policies
    - Maintains data integrity
*/

-- Drop the existing primary key
ALTER TABLE google_fit_connections DROP CONSTRAINT IF EXISTS google_fit_connections_pkey;

-- Add a composite unique constraint on (user_id, provider)
ALTER TABLE google_fit_connections 
  ADD CONSTRAINT google_fit_connections_user_provider_key 
  UNIQUE (user_id, provider);

-- Add id column as primary key for better structure
ALTER TABLE google_fit_connections 
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid() PRIMARY KEY;
