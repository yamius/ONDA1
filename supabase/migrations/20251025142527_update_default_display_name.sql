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
