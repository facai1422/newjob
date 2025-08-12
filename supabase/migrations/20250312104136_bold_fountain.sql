/*
  # Fix Admin Authentication
  
  1. Changes
    - Drop and recreate admin user with proper schema
    - Set up correct authentication configuration
    - Ensure proper identity setup
    
  2. Security
    - Password is securely hashed
    - Email is pre-confirmed
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
  -- Delete existing admin user if exists
  DELETE FROM auth.users WHERE email = 'admin@example.com';
  DELETE FROM auth.identities WHERE identity_data->>'email' = 'admin@example.com';

  -- Insert admin user with proper schema
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_current,
    email_change_token_new
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert identity with correct schema
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', 'admin@example.com'
    ),
    'email',
    'admin@example.com',
    now(),
    now(),
    now()
  );

  -- Ensure email is confirmed
  UPDATE auth.users
  SET email_confirmed_at = now(),
      updated_at = now()
  WHERE id = new_user_id;

END $$;