/*
  # Fix customer service settings policies

  1. Changes
    - Add policy for public read access to customer service settings
    - Keep admin-only write access
    
  2. Security
    - Anyone can read the settings
    - Only admin can modify settings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage customer service settings" ON customer_service_settings;

-- Create separate policies for read and write access
CREATE POLICY "Anyone can view customer service settings"
  ON customer_service_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage customer service settings"
  ON customer_service_settings
  FOR ALL
  TO authenticated
  USING ((SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@example.com')
  WITH CHECK ((SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@example.com');

-- Ensure at least one record exists
INSERT INTO customer_service_settings (id, whatsapp_link, telegram_link)
VALUES (
  gen_random_uuid(),
  'https://wa.me/1234567890',
  'https://t.me/username'
)
ON CONFLICT DO NOTHING;