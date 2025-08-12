/*
  # Create resumes table and setup security policies

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `fullName` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `education` (text, required)
      - `experience` (text, required)
      - `skills` (text, required)
      - `coverLetter` (text, required)
      - `status` (text, default: 'pending')
      - `submitted_at` (timestamptz, default: now())
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `resumes` table
    - Add policies for:
      - Users can read their own resumes
      - Users can create their own resumes
      - Admin can read all resumes
      - Admin can update resume status
*/

-- Create resumes table if it doesn't exist
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fullName text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  education text NOT NULL,
  experience text NOT NULL,
  skills text NOT NULL,
  coverLetter text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own resumes" ON resumes;
  DROP POLICY IF EXISTS "Users can create resumes" ON resumes;
  DROP POLICY IF EXISTS "Admin can read all resumes" ON resumes;
  DROP POLICY IF EXISTS "Admin can update resume status" ON resumes;
END $$;

-- Create new policies
CREATE POLICY "Users can read own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can read all resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@example.com');

CREATE POLICY "Admin can update resume status"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');