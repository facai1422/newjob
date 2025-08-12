/*
  # Add customer service settings table

  1. New Tables
    - `customer_service_settings`
      - `id` (uuid, primary key)
      - `whatsapp_link` (text)
      - `telegram_link` (text)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS customer_service_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_link text NOT NULL DEFAULT '',
  telegram_link text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customer_service_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage customer service settings"
  ON customer_service_settings
  FOR ALL
  TO authenticated
  USING ((SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@example.com')
  WITH CHECK ((SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@example.com');

-- Insert default settings
INSERT INTO customer_service_settings (whatsapp_link, telegram_link)
VALUES ('https://wa.me/1234567890', 'https://t.me/username');