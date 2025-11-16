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
