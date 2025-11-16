/*
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
  EXECUTE FUNCTION public.handle_new_user();