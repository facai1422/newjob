/*
  # Add job details table

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `salary` (text)
      - `description` (text)
      - `working_hours` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin management
*/

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  salary text NOT NULL,
  description text NOT NULL,
  working_hours text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jobs"
  ON jobs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING ((SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@example.com')
  WITH CHECK ((SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@example.com');

-- Insert sample jobs
INSERT INTO jobs (title, salary, description, working_hours)
VALUES 
  (
    'Senior Software Engineer',
    '$120,000 - $150,000/year',
    'Lead development of enterprise applications using React and Node.js. Mentor junior developers and architect scalable solutions.',
    'Monday - Friday, 9:00 AM - 5:00 PM EST'
  ),
  (
    'Product Manager',
    '$100,000 - $130,000/year',
    'Drive product strategy and roadmap. Work closely with engineering and design teams to deliver high-impact features.',
    'Flexible hours with core collaboration time 10:00 AM - 4:00 PM EST'
  ),
  (
    'UX Designer',
    '$90,000 - $120,000/year',
    'Create intuitive user experiences for web and mobile applications. Conduct user research and usability testing.',
    'Hybrid schedule with 2 days remote work per week'
  );