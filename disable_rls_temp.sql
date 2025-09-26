-- TEMPORARY FIX: Disable RLS for collaboration tables
-- This will allow the feature to work while we debug the authentication issue
-- Run this in your Supabase SQL Editor

-- Disable RLS temporarily for testing
ALTER TABLE public.collaboration_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_applications DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('collaboration_requests', 'collaboration_applications');