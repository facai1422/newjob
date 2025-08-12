/*
  # Fix Admin Authentication Schema
  
  1. Changes
    - Create admin user with correct schema
    - Add proper error handling
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
  BEGIN
    DELETE FROM auth.identities WHERE identity_data->>'email' = 'admin@example.com';
    DELETE FROM auth.users WHERE email = 'admin@example.com';
  EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Error cleaning up existing user: %', SQLERRM;
  END;

  -- Insert admin user with correct schema
  BEGIN
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
      recovery_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{}'::jsonb,
      false,
      now(),
      now(),
      '',
      ''
    );
  EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Error creating user: %', SQLERRM;
    RETURN;
  END;

  -- Insert identity
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Error creating identity: %', SQLERRM;
    -- Clean up user if identity creation fails
    DELETE FROM auth.users WHERE id = new_user_id;
    RETURN;
  END;

  -- Update user metadata
  BEGIN
    UPDATE auth.users
    SET 
      email_confirmed_at = now(),
      updated_at = now(),
      raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
      raw_user_meta_data = '{}'::jsonb
    WHERE id = new_user_id;
  EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Error updating user metadata: %', SQLERRM;
  END;

END $$;