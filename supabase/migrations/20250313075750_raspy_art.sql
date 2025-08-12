/*
  # Update customer service contact links
  
  1. Changes
    - Update WhatsApp link to new QR code URL
    - Update Telegram link to new username
    
  2. Security
    - Maintain existing RLS policies
    - No changes to security settings
*/

-- Update customer service settings with new links
UPDATE customer_service_settings
SET 
  whatsapp_link = 'https://api.whatsapp.com/qr/I7H6WFU2F7BFC1?autoload=1&app_absent=0',
  telegram_link = 'https://t.me/qnmlgbojbk',
  updated_at = now()
WHERE true;