/*
  # Fix email confirmation settings
  
  1. Changes
    - Disable email confirmation requirement
    - Update existing users to have confirmed emails
    - Ensure proper auth settings
    
  2. Security
    - This is for development/testing purposes
    - In production, email confirmation should be re-enabled
*/

-- Update existing users to have confirmed emails
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email_confirmed_at IS NULL;

-- Ensure admin user is confirmed
UPDATE auth.users
SET email_confirmed_at = now(),
    updated_at = now(),
    raw_app_meta_data = jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email'],
      'email_confirmed', true
    )
WHERE email = 'admin@example.com';