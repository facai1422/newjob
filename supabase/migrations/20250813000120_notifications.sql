/*
  # Notifications table for admin-to-user messages

  - Tables
    - notifications: user-targeted messages

  - Security
    - RLS enabled
    - Users can read only their own notifications
    - Admin can manage all notifications
*/

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create notifications table
DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    body text NOT NULL,
    link text,
    created_at timestamptz NOT NULL DEFAULT now(),
    read_at timestamptz
  );

  CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON notifications (user_id, created_at DESC);

  ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

  -- Allow users to select only their notifications
  CREATE POLICY IF NOT EXISTS "Users can view own notifications" ON notifications
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

  -- Admin can manage notifications
  CREATE POLICY IF NOT EXISTS "Admin can manage notifications" ON notifications
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') IN ('admin@example.com','mz2503687@gmail.com','it@haixin.org'))
    WITH CHECK ((auth.jwt() ->> 'email') IN ('admin@example.com','mz2503687@gmail.com','it@haixin.org'));
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating notifications table: %', SQLERRM;
END $$;


