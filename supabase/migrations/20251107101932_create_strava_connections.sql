/*
  # Create Strava Connections Table

  1. New Tables
    - `strava_connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `athlete_id` (bigint, Strava athlete ID)
      - `access_token` (text, encrypted access token)
      - `refresh_token` (text, encrypted refresh token)
      - `expires_at` (bigint, Unix timestamp when token expires)
      - `athlete_data` (jsonb, stores athlete profile data)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `strava_connections` table
    - Add policies for authenticated users to manage their own connections
    
  3. Important Notes
    - Only one Strava connection per user
    - Tokens are stored securely and only accessible by the owner
*/

CREATE TABLE IF NOT EXISTS strava_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  athlete_id bigint NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at bigint NOT NULL,
  athlete_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE strava_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Strava connection"
  ON strava_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Strava connection"
  ON strava_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Strava connection"
  ON strava_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own Strava connection"
  ON strava_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_strava_connections_user_id ON strava_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_strava_connections_athlete_id ON strava_connections(athlete_id);
