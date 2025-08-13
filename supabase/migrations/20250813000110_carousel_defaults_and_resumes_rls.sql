-- Ensure defaults on carousel_items
ALTER TABLE IF EXISTS carousel_items
  ALTER COLUMN type SET DEFAULT 'image',
  ALTER COLUMN is_active SET DEFAULT true,
  ALTER COLUMN sort_order SET DEFAULT 0,
  ALTER COLUMN updated_at SET DEFAULT now();

-- Relax resumes RLS to allow admin emails to read all resumes
ALTER TABLE IF EXISTS resumes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can read all resumes" ON resumes;
CREATE POLICY "Admin can read all resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'email') IN ('admin@example.com','it@haixin.org','mz2503687@gmail.com'));

