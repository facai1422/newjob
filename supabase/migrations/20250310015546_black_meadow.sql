/*
  # Create resumes table and policies

  1. New Tables
    - `resumes`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `fullName` (text)
      - `email` (text)
      - `phone` (text)
      - `education` (text)
      - `experience` (text)
      - `skills` (text)
      - `coverLetter` (text)
      - `status` (text)
      - `submitted_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `resumes` table
    - Add policies for users to create their own resumes
    - Add policies for admin to read and update all resumes
*/

CREATE TABLE resumes (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users,
  fullName text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  education text NOT NULL,
  experience text NOT NULL,
  skills text NOT NULL,
  coverLetter text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own resumes
CREATE POLICY "Users can create their own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own resumes
CREATE POLICY "Users can read their own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admin to read all resumes
CREATE POLICY "Admin can read all resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
  ));

-- Allow admin to update all resumes
CREATE POLICY "Admin can update all resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
  ));