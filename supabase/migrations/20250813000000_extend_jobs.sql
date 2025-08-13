/*
  Extend jobs table to support UI fields and relax admin RLS to allow multiple admin emails
*/

-- Add missing columns used by the app
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS location text DEFAULT '' ,
  ADD COLUMN IF NOT EXISTS rich_description jsonb DEFAULT '{}'::jsonb;

-- Ensure updated_at auto-updates on change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_jobs_updated_at ON jobs;
CREATE TRIGGER trg_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Update RLS policy to allow specified admin emails to manage jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage jobs" ON jobs;

CREATE POLICY "Admin can manage jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email') IN ('admin@example.com','it@haixin.org','mz2503687@gmail.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('admin@example.com','it@haixin.org','mz2503687@gmail.com'));


