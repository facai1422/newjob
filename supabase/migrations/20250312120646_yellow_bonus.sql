/*
  # Fix admin user authentication
  
  1. Changes
    - Properly create admin user with correct schema
    - Set up identity with correct provider_id
    - Ensure email confirmation
    
  2. Security
    - Password is securely hashed
    - Email is confirmed
    - Proper identity setup
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin user with proper schema
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Clean up existing admin user
  BEGIN
    DELETE FROM auth.identities WHERE provider_id = 'admin@example.com';
    DELETE FROM auth.users WHERE email = 'admin@example.com';
  EXCEPTION WHEN OTHERS THEN 
    NULL;
  END;

  -- Insert admin user with minimal required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_current,
    email_change_token_new,
    phone,
    phone_change,
    phone_change_token,
    reauthentication_token,
    last_sign_in_at
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"email_verified":true}'::jsonb,
    '{}'::jsonb,
    false,
    now(),
    now(),
    '',
    '',
    '',
    '',
    null,
    '',
    '',
    '',
    now()
  );

  -- Insert identity
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at,
    last_sign_in_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', 'admin@example.com',
      'email_verified', true,
      'aud', 'authenticated'
    ),
    'email',
    'admin@example.com',
    now(),
    now(),
    now()
  );

END $$;