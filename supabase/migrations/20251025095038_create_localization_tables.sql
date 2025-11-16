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
ON CONFLICT (key, language_code) DO NOTHING;