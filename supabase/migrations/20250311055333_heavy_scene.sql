/*
  # Set up admin authentication

  1. Changes
    - Create admin user if not exists
    - Set up proper authentication schema
    - Create necessary extensions
    
  2. Security
    - Password is securely hashed
    - Email is pre-confirmed
    - Proper identity setup
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin user if not exists
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'admin@example.com';

  -- Only create admin user if it doesn't exist
  IF new_user_id IS NULL THEN
    new_user_id := gen_random_uuid();
    
    -- Insert admin user
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
      recovery_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      false,
      NOW(),
      NOW(),
      '',
      ''
    );

    -- Insert email identity
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
      format('{"sub": "%s", "email": "admin@example.com"}', new_user_id)::jsonb,
      'email',
      'admin@example.com',
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;