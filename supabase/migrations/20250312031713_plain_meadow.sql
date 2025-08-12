/*
  # Set up admin user and authentication

  1. Changes
    - Create admin user if not exists
    - Update admin user if exists
    - Ensure proper authentication setup
    
  2. Security
    - Password is securely hashed
    - Email is pre-confirmed
    - Proper identity setup
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Safely handle existing admin user
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  existing_user_id uuid;
BEGIN
  -- Check if admin user exists
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = 'admin@example.com';

  -- If exists, update the user
  IF existing_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf')),
        email_confirmed_at = now(),
        updated_at = now(),
        raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'
    WHERE id = existing_user_id;

    -- Update existing identity
    UPDATE auth.identities
    SET identity_data = jsonb_build_object(
      'sub', existing_user_id::text,
      'email', 'admin@example.com'
    ),
    updated_at = now()
    WHERE user_id = existing_user_id;
  ELSE
    -- Create new admin user
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

    -- Create new identity
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
  END IF;
END $$;