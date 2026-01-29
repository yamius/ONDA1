/*
  # Fix User Progress Initialization

  ## Changes
  1. Update handle_new_user trigger to also create user_progress entry
  2. This ensures total_ond tracking works from the start

  ## Notes
  - Adds user_progress row with total_ond = 0 on user signup
  - Maintains backward compatibility
*/

-- Drop and recreate the function with user_progress initialization
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

  -- Also create user_progress entry for OND tracking
  INSERT INTO public.user_progress (user_id, total_ond)
  VALUES (new.id, 0);

  RETURN new;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill user_progress for existing users who don't have it
INSERT INTO public.user_progress (user_id, total_ond)
SELECT id, 0
FROM public.user_profiles
WHERE id NOT IN (SELECT user_id FROM public.user_progress)
ON CONFLICT (user_id) DO NOTHING;
