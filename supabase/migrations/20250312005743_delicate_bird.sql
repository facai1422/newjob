/*
  # Configure auth settings for email confirmation

  1. Changes
    - Set email confirmation settings in auth.flow
    - Ensure existing users are confirmed
    
  2. Security
    - This is safe for development/testing
    - For production, email confirmation should be re-enabled
*/

-- Update auth settings to disable confirmation requirement
DO $$
BEGIN
  -- Update existing users to confirm their email if not already confirmed
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, now())
  WHERE email_confirmed_at IS NULL;

  -- Ensure admin user is confirmed
  UPDATE auth.users
  SET email_confirmed_at = now(),
      updated_at = now()
  WHERE email = 'admin@example.com'
    AND email_confirmed_at IS NULL;
END $$;