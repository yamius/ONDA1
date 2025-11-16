-- ========================================
-- ONDA App Database Setup Script
-- ========================================
-- Выполните этот скрипт в Supabase SQL Editor
-- чтобы создать все необходимые таблицы
-- ========================================

-- 1. Создание таблицы профилей пользователей
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Создание таблицы прогресса игры
CREATE TABLE IF NOT EXISTS user_game_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  ond numeric DEFAULT 0,
  active_circuit integer DEFAULT 1,
  completed_practices jsonb DEFAULT '{}'::jsonb,
  practice_history jsonb DEFAULT '[]'::jsonb,
  artifacts jsonb DEFAULT '[]'::jsonb,
  unlocked_achievements jsonb DEFAULT '[]'::jsonb,
  bio_metrics jsonb DEFAULT '{}'::jsonb,
  sleep_tracking jsonb DEFAULT '{"day": 0, "lastCheck": null}'::jsonb,
  selected_language text,
  selected_level integer DEFAULT 1,
  selected_chapter integer DEFAULT 1,
  is_light_theme boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Включение Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_progress ENABLE ROW LEVEL SECURITY;

-- 4. Политики безопасности для user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 5. Политики безопасности для user_game_progress
DROP POLICY IF EXISTS "Users can view their own game progress" ON user_game_progress;
CREATE POLICY "Users can view their own game progress"
  ON user_game_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own game progress" ON user_game_progress;
CREATE POLICY "Users can update their own game progress"
  ON user_game_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own game progress" ON user_game_progress;
CREATE POLICY "Users can insert their own game progress"
  ON user_game_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 6. Функция для автоматического создания профиля при регистрации
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
  -- Генерация имени по умолчанию: "Игрок-" + случайное 4-значное число
  default_name := 'Игрок-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');

  -- Создание профиля пользователя
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

  -- Создание записи прогресса игры
  INSERT INTO public.user_game_progress (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$;

-- 7. Триггер для автоматического создания профиля
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Создание таблицы языков (опционально, для локализации)
CREATE TABLE IF NOT EXISTS languages (
  code text PRIMARY KEY,
  name text NOT NULL,
  native_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 9. Создание таблицы переводов (опционально, для локализации)
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

-- 10. Включение RLS для таблиц локализации
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- 11. Публичный доступ к переводам
DROP POLICY IF EXISTS "Anyone can read languages" ON languages;
CREATE POLICY "Anyone can read languages"
  ON languages FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can read translations" ON translations;
CREATE POLICY "Anyone can read translations"
  ON translations FOR SELECT
  TO public
  USING (true);

-- 12. Вставка поддерживаемых языков
INSERT INTO languages (code, name, native_name, is_active) VALUES
  ('RU', 'Russian', 'Русский', true),
  ('EN', 'English', 'English', true),
  ('ES', 'Spanish', 'Español', true),
  ('UK', 'Ukrainian', 'Українська', true),
  ('ZH', 'Chinese', '中文', true)
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- Готово! Базовая структура базы данных создана.
-- ========================================
