/*
  # Add image support to jobs and enhance location handling
  
  1. Changes
    - Add image_url column to jobs table
    - Add location column to jobs table
    - Add rich_description column for formatted content
    
  2. Security
    - Maintain existing RLS policies
    - No changes to security settings
*/

ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS image_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS location text DEFAULT '',
ADD COLUMN IF NOT EXISTS rich_description jsonb DEFAULT '[]'::jsonb;

-- Update existing jobs with sample data
UPDATE jobs
SET 
  image_url = CASE id
    WHEN (SELECT id FROM jobs WHERE title = 'Senior Software Engineer' LIMIT 1)
    THEN 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c'
    WHEN (SELECT id FROM jobs WHERE title = 'Product Manager' LIMIT 1)
    THEN 'https://images.unsplash.com/photo-1552664730-d307ca884978'
    ELSE 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
  END,
  location = CASE id
    WHEN (SELECT id FROM jobs WHERE title = 'Senior Software Engineer' LIMIT 1)
    THEN 'Japan'
    WHEN (SELECT id FROM jobs WHERE title = 'Product Manager' LIMIT 1)
    THEN 'Singapore'
    ELSE 'Malaysia'
  END
WHERE image_url = '';