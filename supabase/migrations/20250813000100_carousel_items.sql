/* Carousel items table for homepage slider */

CREATE TABLE IF NOT EXISTS carousel_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'image',
  src text NOT NULL,
  alt text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE carousel_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active carousel items"
  ON carousel_items FOR SELECT TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage carousel" ON carousel_items;
CREATE POLICY "Admins manage carousel"
  ON carousel_items FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') IN ('admin@example.com','it@haixin.org','mz2503687@gmail.com'))
  WITH CHECK ((auth.jwt() ->> 'email') IN ('admin@example.com','it@haixin.org','mz2503687@gmail.com'));


