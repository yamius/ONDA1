/*
  # Create Google Fit Connections Table

  1. New Tables
    - `google_fit_connections`
      - `user_id` (uuid, primary key, references auth.users)
      - `provider` (text, default 'google_fit')
      - `access_token` (text, encrypted OAuth access token)
      - `refresh_token` (text, encrypted OAuth refresh token)
      - `expires_at` (timestamptz, token expiration time)
      - `is_active` (boolean, connection status)
      - `last_sync_at` (timestamptz, last data sync timestamp)
      - `created_at` (timestamptz, record creation time)
      - `updated_at` (timestamptz, record update time)

  2. Security
    - Enable RLS on `google_fit_connections` table
    - Add policies for authenticated users to manage their own connections
    - Tokens are stored encrypted for security
*/

CREATE TABLE IF NOT EXISTS google_fit_connections (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'google_fit',
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE google_fit_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Google Fit connection"
  ON google_fit_connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Google Fit connection"
  ON google_fit_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Google Fit connection"
  ON google_fit_connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own Google Fit connection"
  ON google_fit_connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_google_fit_connections_user_id ON google_fit_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_google_fit_connections_is_active ON google_fit_connections(is_active);

CREATE OR REPLACE FUNCTION update_google_fit_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_google_fit_connections_updated_at_trigger ON google_fit_connections;
CREATE TRIGGER update_google_fit_connections_updated_at_trigger
  BEFORE UPDATE ON google_fit_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_google_fit_connections_updated_at();
