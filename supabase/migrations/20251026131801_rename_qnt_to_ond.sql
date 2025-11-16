/*
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
END $$;