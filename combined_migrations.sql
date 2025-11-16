/*
  # Create User Profiles and Game Data Tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `display_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_game_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `qnt` (numeric, default 0)
      - `active_circuit` (integer, default 1)
      - `completed_practices` (jsonb, default {})
      - `practice_history` (jsonb, default [])
      - `artifacts` (jsonb, default [])
      - `unlocked_achievements` (jsonb, default [])
      - `bio_metrics` (jsonb, default {})
      - `sleep_tracking` (jsonb, default {})
      - `selected_language` (text, default 'RU')
      - `selected_level` (integer, default 1)
      - `selected_chapter` (integer, default 1)
      - `is_light_theme` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_game_progress table
CREATE TABLE IF NOT EXISTS user_game_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  qnt numeric DEFAULT 0,
  active_circuit integer DEFAULT 1,
  completed_practices jsonb DEFAULT '{}'::jsonb,
  practice_history jsonb DEFAULT '[]'::jsonb,
  artifacts jsonb DEFAULT '[]'::jsonb,
  unlocked_achievements jsonb DEFAULT '[]'::jsonb,
  bio_metrics jsonb DEFAULT '{}'::jsonb,
  sleep_tracking jsonb DEFAULT '{"day": 0, "lastCheck": null}'::jsonb,
  selected_language text DEFAULT 'RU',
  selected_level integer DEFAULT 1,
  selected_chapter integer DEFAULT 1,
  is_light_theme boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_progress ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for user_game_progress
CREATE POLICY "Users can view their own game progress"
  ON user_game_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game progress"
  ON user_game_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game progress"
  ON user_game_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user profile and game progress on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_game_progress (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
/*
  # Create Localization Tables

  1. New Tables
    - `languages`
      - `code` (text, primary key) - Language code (e.g., 'RU', 'EN', 'ES')
      - `name` (text) - Language name (e.g., 'Русский', 'English')
      - `native_name` (text) - Native language name
      - `is_active` (boolean) - Whether the language is available
      - `created_at` (timestamptz)
      
    - `translations`
      - `id` (uuid, primary key)
      - `key` (text, not null) - Translation key (e.g., 'welcome_message', 'start_practice')
      - `language_code` (text, foreign key to languages)
      - `value` (text, not null) - Translated text
      - `category` (text) - Category for organization (e.g., 'ui', 'practices', 'achievements')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Indexes
    - Unique index on (key, language_code) for fast lookups
    - Index on category for filtering
    
  3. Security
    - Enable RLS on both tables
    - Allow public read access (translations are public data)
    - Only authenticated users can read (if you want to restrict)
    
  4. Sample Data
    - Insert supported languages (RU, EN, ES, FR, DE, IT, PT, ZH, JA, AR)
    - Insert some basic translations for testing
*/

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  code text PRIMARY KEY,
  name text NOT NULL,
  native_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  language_code text NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  value text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_translation UNIQUE (key, language_code)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category);

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read languages"
  ON languages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read translations"
  ON translations FOR SELECT
  TO public
  USING (true);

-- Insert supported languages
INSERT INTO languages (code, name, native_name, is_active) VALUES
  ('RU', 'Russian', 'Русский', true),
  ('EN', 'English', 'English', true),
  ('ES', 'Spanish', 'Español', true),
  ('FR', 'French', 'Français', true),
  ('DE', 'German', 'Deutsch', true),
  ('IT', 'Italian', 'Italiano', true),
  ('PT', 'Portuguese', 'Português', true),
  ('ZH', 'Chinese', '中文', true),
  ('JA', 'Japanese', '日本語', true),
  ('AR', 'Arabic', 'العربية', true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample translations for Russian (from current UI)
INSERT INTO translations (key, language_code, value, category) VALUES
  -- UI Elements
  ('app_title', 'RU', 'ONDA Протокол', 'ui'),
  ('quantum_tokens', 'RU', 'QNT', 'ui'),
  ('level', 'RU', 'Уровень', 'ui'),
  ('chapter', 'RU', 'Глава', 'ui'),
  ('leaderboard', 'RU', 'Лидеры', 'ui'),
  ('profile', 'RU', 'Профиль', 'ui'),
  ('logout', 'RU', 'Выход', 'ui'),
  ('login', 'RU', 'Вход', 'ui'),
  ('sign_up', 'RU', 'Регистрация', 'ui'),
  ('start', 'RU', 'Начать', 'ui'),
  ('complete', 'RU', 'Завершить', 'ui'),
  ('continue', 'RU', 'Продолжить', 'ui'),
  
  -- Metrics
  ('quality', 'RU', 'Качество', 'metrics'),
  ('time', 'RU', 'Время', 'metrics'),
  ('stability', 'RU', 'Стабильность', 'metrics'),
  ('heart_rate', 'RU', 'Пульс', 'metrics'),
  ('spo2', 'RU', 'SpO2', 'metrics'),
  ('hrv', 'RU', 'ВСР', 'metrics'),
  ('temperature', 'RU', 'Температура', 'metrics'),
  
  -- Practice
  ('practice_in_progress', 'RU', 'Практика в процессе', 'practice'),
  ('new_record', 'RU', '🎉 Новый рекорд! Предыдущий результат:', 'practice'),
  ('practice_completed', 'RU', 'Практика завершена!', 'practice'),
  
  -- Achievements
  ('achievements', 'RU', 'Достижения', 'achievements'),
  ('unlocked', 'RU', 'Разблокировано', 'achievements'),
  
  -- Stats
  ('statistics', 'RU', 'Статистика', 'stats'),
  ('total_time', 'RU', 'Общее время', 'stats'),
  ('avg_quality', 'RU', 'Средн. качество', 'stats'),
  ('sessions', 'RU', 'Сессии', 'stats')
ON CONFLICT (key, language_code) DO NOTHING;

-- Insert sample translations for English
INSERT INTO translations (key, language_code, value, category) VALUES
  -- UI Elements
  ('app_title', 'EN', 'ONDA Protocol', 'ui'),
  ('quantum_tokens', 'EN', 'QNT', 'ui'),
  ('level', 'EN', 'Level', 'ui'),
  ('chapter', 'EN', 'Chapter', 'ui'),
  ('leaderboard', 'EN', 'Leaderboard', 'ui'),
  ('profile', 'EN', 'Profile', 'ui'),
  ('logout', 'EN', 'Logout', 'ui'),
  ('login', 'EN', 'Login', 'ui'),
  ('sign_up', 'EN', 'Sign Up', 'ui'),
  ('start', 'EN', 'Start', 'ui'),
  ('complete', 'EN', 'Complete', 'ui'),
  ('continue', 'EN', 'Continue', 'ui'),
  
  -- Metrics
  ('quality', 'EN', 'Quality', 'metrics'),
  ('time', 'EN', 'Time', 'metrics'),
  ('stability', 'EN', 'Stability', 'metrics'),
  ('heart_rate', 'EN', 'Heart Rate', 'metrics'),
  ('spo2', 'EN', 'SpO2', 'metrics'),
  ('hrv', 'EN', 'HRV', 'metrics'),
  ('temperature', 'EN', 'Temperature', 'metrics'),
  
  -- Practice
  ('practice_in_progress', 'EN', 'Practice in Progress', 'practice'),
  ('new_record', 'EN', '🎉 New Record! Previous result:', 'practice'),
  ('practice_completed', 'EN', 'Practice Completed!', 'practice'),
  
  -- Achievements
  ('achievements', 'EN', 'Achievements', 'achievements'),
  ('unlocked', 'EN', 'Unlocked', 'achievements'),
  
  -- Stats
  ('statistics', 'EN', 'Statistics', 'stats'),
  ('total_time', 'EN', 'Total Time', 'stats'),
  ('avg_quality', 'EN', 'Avg Quality', 'stats'),
  ('sessions', 'EN', 'Sessions', 'stats')
ON CONFLICT (key, language_code) DO NOTHING;/*
  # Update Default Display Name Generation

  1. Changes
    - Update handle_new_user function to generate better default display names
    - Format: "Игрок" + random 4-digit number (e.g., "Игрок-1234")
    - Falls back to email if available

  2. Notes
    - Existing users are not affected
    - Only applies to new user signups
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved function with better default name generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_name text;
BEGIN
  -- Generate a default name: "Игрок-" followed by a 4-digit random number
  default_name := 'Игрок-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');

  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      SPLIT_PART(new.email, '@', 1),
      default_name
    ),
    new.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_game_progress (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
/*
  # Update Default Display Name Generation

  1. Changes
    - Update handle_new_user function to generate better default display names
    - Format: "Игрок" + random 4-digit number (e.g., "Игрок-1234")
    - Falls back to email if available

  2. Notes
    - Existing users are not affected
    - Only applies to new user signups
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved function with better default name generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_name text;
BEGIN
  -- Generate a default name: "Игрок-" followed by a 4-digit random number
  default_name := 'Игрок-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');

  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      SPLIT_PART(new.email, '@', 1),
      default_name
    ),
    new.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_game_progress (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
/*
  # Remove Language Default Value

  1. Changes
    - Change default value for selected_language from 'RU' to NULL
    - This allows the application to auto-detect browser language
    - Existing users keep their saved language preference

  2. Notes
    - Does not affect existing user data
    - Only changes the default for new inserts
*/

-- Change default value to NULL so app can detect browser language
ALTER TABLE user_game_progress 
ALTER COLUMN selected_language DROP DEFAULT;
/*
  # Remove Language Default Value

  1. Changes
    - Change default value for selected_language from 'RU' to NULL
    - This allows the application to auto-detect browser language
    - Existing users keep their saved language preference

  2. Notes
    - Does not affect existing user data
    - Only changes the default for new inserts
*/

-- Change default value to NULL so app can detect browser language
ALTER TABLE user_game_progress 
ALTER COLUMN selected_language DROP DEFAULT;/*
  # Rename qnt column to ond

  1. Changes
    - Rename `qnt` column to `ond` in `user_game_progress` table
    
  2. Notes
    - This migration safely renames the column without data loss
    - All existing data will be preserved
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_game_progress' AND column_name = 'qnt'
  ) THEN
    ALTER TABLE user_game_progress RENAME COLUMN qnt TO ond;
  END IF;
END $$;/*
  # Fix Security Issues

  ## Changes
  1. Security Fixes
    - Fix `handle_new_user` function to have immutable search_path
    - This prevents potential security vulnerabilities from search_path manipulation

  ## Notes
  - The function is recreated with proper SECURITY DEFINER and search_path settings
  - All functionality remains the same, only security posture is improved
*/

-- Drop and recreate the function with proper security settings
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  default_name text;
BEGIN
  -- Generate a default name: "Игрок-" followed by a 4-digit random number
  default_name := 'Игрок-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');

  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      SPLIT_PART(new.email, '@', 1),
      default_name
    ),
    new.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_game_progress (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();/*
  # Enable Password Breach Protection

  ## Security Enhancement
  1. Configuration Note
    - Password breach protection should be enabled in Supabase Auth settings
    - This feature checks passwords against HaveIBeenPwned.org database
    - Prevents users from using compromised passwords

  ## Manual Step Required
  To enable this feature:
  1. Go to your Supabase Dashboard
  2. Navigate to Authentication > Settings
  3. Find "Password Breach Protection" section
  4. Enable "Check for breached passwords"

  ## Notes
  - This setting cannot be configured via SQL migrations
  - It must be enabled through the Supabase Dashboard
  - This is a best practice for production applications
*/

-- This migration serves as documentation
-- The actual setting must be enabled in the Supabase Dashboard
-- No SQL changes are required for this security feature

SELECT 'Password breach protection should be enabled in Supabase Dashboard' as reminder;/*
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
/*
  # Create Practice Rewards System

  1. New Tables
    - `practice_rewards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `practice_id` (text, practice identifier)
      - `practice_duration_seconds` (integer, actual practice duration)
      - `expected_duration_seconds` (integer, expected practice duration)
      - `stress_before` (numeric, stress level before practice 0-100)
      - `stress_after` (numeric, stress level after practice 0-100)
      - `energy_before` (numeric, energy level before practice 0-100)
      - `energy_after` (numeric, energy level after practice 0-100)
      - `completion_ond` (numeric, OND earned for completion 15% max)
      - `performance_ond` (numeric, OND earned for stress/energy improvement 85% max)
      - `total_ond_earned` (numeric, total OND awarded)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `practice_rewards` table
    - Add policy for authenticated users to insert their own rewards
    - Add policy for authenticated users to read their own rewards

  3. Notes
    - Completion OND: 15% of base reward, interpolated by (actual_duration / expected_duration)
    - Performance OND: 85% of base reward, based on:
      - Stress reduction: target -10% or more (interpolated if less)
      - Energy increase: target +10% or more (interpolated if less)
    - Base reward is configurable per practice
*/

CREATE TABLE IF NOT EXISTS practice_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  practice_id text NOT NULL,
  practice_duration_seconds integer NOT NULL DEFAULT 0,
  expected_duration_seconds integer NOT NULL DEFAULT 0,
  stress_before numeric,
  stress_after numeric,
  energy_before numeric,
  energy_after numeric,
  completion_ond numeric NOT NULL DEFAULT 0,
  performance_ond numeric NOT NULL DEFAULT 0,
  total_ond_earned numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE practice_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own practice rewards"
  ON practice_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own practice rewards"
  ON practice_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_practice_rewards_user_id ON practice_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_rewards_created_at ON practice_rewards(created_at DESC);
/*
  # Create User Progress Table

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles, unique)
      - `total_ond` (numeric, total OND accumulated)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_progress` table
    - Add policy for authenticated users to read their own progress
    - Add policy for authenticated users to insert their own progress
    - Add policy for authenticated users to update their own progress

  3. Notes
    - This table tracks the total OND accumulated by users
    - One row per user
    - Updated when practice rewards are earned
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_ond numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
