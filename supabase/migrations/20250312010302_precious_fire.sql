/*
  # Fix customer service settings table

  1. Changes
    - Ensure only one row exists in customer_service_settings
    - Delete any duplicate rows
    - Add constraint to prevent multiple rows
    
  2. Security
    - Maintain existing RLS policies
*/

-- First, keep only the most recently updated row and delete others
WITH latest_settings AS (
  SELECT id
  FROM customer_service_settings
  ORDER BY updated_at DESC
  LIMIT 1
)
DELETE FROM customer_service_settings
WHERE id NOT IN (SELECT id FROM latest_settings);

-- Add a constraint to ensure only one row exists
CREATE UNIQUE INDEX IF NOT EXISTS customer_service_settings_single_row 
ON customer_service_settings ((true));

-- If no rows exist, insert a default row
INSERT INTO customer_service_settings (id, whatsapp_link, telegram_link)
SELECT 
  gen_random_uuid(),
  'https://wa.me/1234567890',
  'https://t.me/username'
WHERE NOT EXISTS (SELECT 1 FROM customer_service_settings);