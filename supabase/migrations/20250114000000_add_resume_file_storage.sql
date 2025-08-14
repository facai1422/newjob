-- Add file storage fields to resumes table
ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS resume_file_url text,
ADD COLUMN IF NOT EXISTS resume_file_name text,
ADD COLUMN IF NOT EXISTS resume_file_size bigint;

-- Create storage bucket for resume files if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('resumes', 'resumes', false, 10485760) -- 10MB limit
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resume files
CREATE POLICY IF NOT EXISTS "Authenticated users can upload resume files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can view their own resume files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can update their own resume files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can delete their own resume files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to view all resume files
CREATE POLICY IF NOT EXISTS "Admin can view all resume files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (auth.jwt() ->> 'email') IN ('admin@example.com','it@haixin.org','mz2503687@gmail.com')
);


