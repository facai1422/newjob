/*
  # Fix resume column names
  
  1. Changes
    - Rename columns to match frontend naming
    - Ensure consistent casing
    
  2. Security
    - Maintain existing RLS policies
    - No changes to security settings
*/

-- Rename columns to match frontend naming
ALTER TABLE resumes 
  RENAME COLUMN fullname TO "fullName";

ALTER TABLE resumes 
  RENAME COLUMN coverletter TO "coverLetter";