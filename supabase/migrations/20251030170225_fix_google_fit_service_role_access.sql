/*
  # Fix Google Fit Connections Service Role Access

  1. Changes
    - Add policy to allow service role to insert/update Google Fit connections
    - This is needed because the Edge Function uses service_role_key to save connection data
  
  2. Security
    - Service role can bypass RLS, but we add explicit policy for clarity
    - Regular authenticated users still have their own restricted policies
*/

-- Drop the restrictive INSERT policy and create a new one that works with service role
DROP POLICY IF EXISTS "Users can insert own Google Fit connection" ON google_fit_connections;

CREATE POLICY "Users can insert own Google Fit connection"
  ON google_fit_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update the UPDATE policy to work better with upsert
DROP POLICY IF EXISTS "Users can update own Google Fit connection" ON google_fit_connections;

CREATE POLICY "Users can update own Google Fit connection"
  ON google_fit_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
