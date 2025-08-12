/*
  # Create admin user

  1. Changes
    - Create admin user with email admin@example.com
    - Set up initial password for admin user
    - Enable email auth for the project
    
  2. Security
    - Password is hashed using bcrypt
    - Email is pre-confirmed
    - Provider ID is properly set for email authentication
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')), -- Default password: admin123
    now(),
    now(),
    now(),
    '',
    ''
  )
  RETURNING id INTO admin_user_id;

  -- Set up email identity with proper provider_id
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    uuid_generate_v4(),
    admin_user_id,
    jsonb_build_object('sub', admin_user_id::text, 'email', 'admin@example.com'),
    'email',
    'admin@example.com',  -- Use email as provider_id for email provider
    now(),
    now(),
    now()
  );
END $$;