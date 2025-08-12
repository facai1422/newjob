/*
  # Add recruiter role and permissions
  
  1. Changes
    - Add recruiter role to auth schema
    - Update policies for jobs and resumes tables
    - Set up specific recruiter account
    
  2. Security
    - Recruiters can manage jobs
    - Recruiters can view all resumes
    - Maintain existing admin permissions
*/

-- Update the specified email to have recruiter role
UPDATE auth.users
SET raw_app_meta_data = jsonb_build_object(
  'provider', COALESCE((raw_app_meta_data->>'provider'), 'email'),
  'providers', COALESCE((raw_app_meta_data->'providers'), '["email"]'::jsonb),
  'role', 'recruiter'
)
WHERE email = 'mz2503687@gmail.com';

-- Update jobs table policies
DROP POLICY IF EXISTS "Admin can manage jobs" ON jobs;
DROP POLICY IF EXISTS "Recruiters can manage jobs" ON jobs;

CREATE POLICY "Recruiters and admin can manage jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'email' = 'admin@example.com') OR
    ((auth.jwt() ->> 'email' = 'mz2503687@gmail.com') AND 
     (auth.jwt() -> 'app_metadata' ->> 'role' = 'recruiter'))
  )
  WITH CHECK (
    (auth.jwt() ->> 'email' = 'admin@example.com') OR
    ((auth.jwt() ->> 'email' = 'mz2503687@gmail.com') AND 
     (auth.jwt() -> 'app_metadata' ->> 'role' = 'recruiter'))
  );

-- Update resumes table policies
DROP POLICY IF EXISTS "Admin can read all resumes" ON resumes;
DROP POLICY IF EXISTS "Admin can update resume status" ON resumes;

CREATE POLICY "Recruiters and admin can read all resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email' = 'admin@example.com') OR
    ((auth.jwt() ->> 'email' = 'mz2503687@gmail.com') AND 
     (auth.jwt() -> 'app_metadata' ->> 'role' = 'recruiter'))
  );

CREATE POLICY "Recruiters and admin can update resume status"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email' = 'admin@example.com') OR
    ((auth.jwt() ->> 'email' = 'mz2503687@gmail.com') AND 
     (auth.jwt() -> 'app_metadata' ->> 'role' = 'recruiter'))
  )
  WITH CHECK (
    (auth.jwt() ->> 'email' = 'admin@example.com') OR
    ((auth.jwt() ->> 'email' = 'mz2503687@gmail.com') AND 
     (auth.jwt() -> 'app_metadata' ->> 'role' = 'recruiter'))
  );