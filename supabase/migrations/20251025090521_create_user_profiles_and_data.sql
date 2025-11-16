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
