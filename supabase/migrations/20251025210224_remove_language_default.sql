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
