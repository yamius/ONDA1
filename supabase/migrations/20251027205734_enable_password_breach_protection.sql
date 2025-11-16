/*
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

SELECT 'Password breach protection should be enabled in Supabase Dashboard' as reminder;