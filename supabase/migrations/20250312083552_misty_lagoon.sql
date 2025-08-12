/*
  # Database Schema Setup
  
  1. Tables
    - messages: For storing chat messages
    - resumes: For job applications
    - customer_service_settings: For contact information
    - jobs: For job listings
    
  2. Security
    - RLS enabled on all tables
    - Public read access where appropriate
    - Admin-only write access for sensitive operations
*/

-- Setup extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Messages table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS messages (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id text NOT NULL,
    message_type text NOT NULL,
    content text NOT NULL,
    timestamp timestamptz DEFAULT now(),
    token text
  );
  
  ALTER TABLE messages ADD CONSTRAINT messages_message_type_check 
    CHECK (message_type IN ('text', 'image', 'url'));
    
  CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages ("timestamp");
  CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages (user_id);
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error creating messages table: %', SQLERRM;
END $$;

DO $$ 
BEGIN
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Messages are viewable by everyone" ON messages
    FOR SELECT TO public USING (true);
    
  CREATE POLICY "Anyone can insert messages" ON messages
    FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error setting up messages policies: %', SQLERRM;
END $$;

-- Resumes table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS resumes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users,
    fullname text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    education text NOT NULL,
    experience text NOT NULL,
    skills text NOT NULL,
    coverletter text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    submitted_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
  );
  
  ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can read own resumes" ON resumes
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can create resumes" ON resumes
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
    
  CREATE POLICY "Admin can read all resumes" ON resumes
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' = 'admin@example.com');
    
  CREATE POLICY "Admin can update resume status" ON resumes
    FOR UPDATE TO authenticated
    USING (auth.jwt() ->> 'email' = 'admin@example.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error setting up resumes table: %', SQLERRM;
END $$;

-- Customer service settings
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS customer_service_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_link text NOT NULL DEFAULT '',
    telegram_link text NOT NULL DEFAULT '',
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  
  CREATE UNIQUE INDEX IF NOT EXISTS customer_service_settings_single_row 
    ON customer_service_settings ((true));
    
  ALTER TABLE customer_service_settings ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Anyone can view customer service settings" ON customer_service_settings
    FOR SELECT TO public USING (true);
    
  CREATE POLICY "Admin can manage customer service settings" ON customer_service_settings
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' = 'admin@example.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');
    
  INSERT INTO customer_service_settings (whatsapp_link, telegram_link)
  SELECT 'https://wa.me/1234567890', 'https://t.me/username'
  WHERE NOT EXISTS (SELECT 1 FROM customer_service_settings);
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error setting up customer service settings: %', SQLERRM;
END $$;

-- Jobs table
DO $$ 
BEGIN
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
  
  CREATE POLICY "Anyone can view jobs" ON jobs
    FOR SELECT TO public USING (true);
    
  CREATE POLICY "Admin can manage jobs" ON jobs
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' = 'admin@example.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error setting up jobs table: %', SQLERRM;
END $$;

-- Insert sample jobs
DO $$ 
BEGIN
  INSERT INTO jobs (title, salary, description, working_hours)
  VALUES 
    (
      'Senior Software Engineer',
      '$120,000 - $150,000/year',
      'Lead development of enterprise applications using React and Node.js. Mentor junior developers and architect scalable solutions. Location: 东京',
      'Monday - Friday, 9:00 AM - 5:00 PM EST'
    )
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error inserting first job: %', SQLERRM;
END $$;

DO $$ 
BEGIN
  INSERT INTO jobs (title, salary, description, working_hours)
  VALUES 
    (
      'Product Manager',
      '$100,000 - $130,000/year',
      'Drive product strategy and roadmap. Work closely with engineering and design teams to deliver high-impact features. Location: 新加坡',
      'Flexible hours with core collaboration time 10:00 AM - 4:00 PM EST'
    )
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error inserting second job: %', SQLERRM;
END $$;

DO $$ 
BEGIN
  INSERT INTO jobs (title, salary, description, working_hours)
  VALUES 
    (
      'UX Designer',
      '$90,000 - $120,000/year',
      'Create intuitive user experiences for web and mobile applications. Conduct user research and usability testing. Location: 伦敦',
      'Hybrid schedule with 2 days remote work per week'
    )
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN 
  RAISE NOTICE 'Error inserting third job: %', SQLERRM;
END $$;