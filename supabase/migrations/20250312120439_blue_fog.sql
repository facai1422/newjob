/*
  # Fix admin user creation
  
  1. Changes
    - Create admin user with correct schema
    - Remove generated columns from INSERT
    - Handle cleanup and error cases
    
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
    reauthentication_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
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
    ''
  );

  -- Insert identity
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', 'admin@example.com',
      'email_verified', true
    ),
    'email',
    'admin@example.com',
    now(),
    now()
  );

END $$;