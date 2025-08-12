/*
  # Add sub-accounts management
  
  1. New Tables
    - `sub_accounts`
      - `id` (uuid, primary key)
      - `email` (text)
      - `parent_id` (uuid, references auth.users)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `status` (text)

  2. Security
    - Enable RLS
    - Add policies for parent account management
    - Add policies for sub-account access
*/

CREATE TABLE sub_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  parent_id uuid NOT NULL REFERENCES auth.users(id),
  permissions jsonb NOT NULL DEFAULT '{
    "manage_jobs": false,
    "view_resumes": false,
    "manage_resumes": false
  }'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
);

ALTER TABLE sub_accounts ENABLE ROW LEVEL SECURITY;

-- Parent account can manage their sub-accounts
CREATE POLICY "Parent account can manage sub accounts"
  ON sub_accounts
  FOR ALL
  TO authenticated
  USING (
    parent_id = (
      SELECT id 
      FROM auth.users 
      WHERE email = 'mz2503687@gmail.com'
      LIMIT 1
    )
  )
  WITH CHECK (
    parent_id = (
      SELECT id 
      FROM auth.users 
      WHERE email = 'mz2503687@gmail.com'
      LIMIT 1
    )
  );

-- Sub-accounts can view their own settings
CREATE POLICY "Sub accounts can view own settings"
  ON sub_accounts
  FOR SELECT
  TO authenticated
  USING (
    email = auth.jwt()->>'email'
  );