-- QUICK FIX: Update RLS policies for collaboration tables
-- Run this in your Supabase SQL Editor

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow authenticated users to insert requests" ON public.collaboration_requests;
DROP POLICY IF EXISTS "Allow authenticated users to insert applications" ON public.collaboration_applications;

-- Option 1: Proper RLS policies (recommended)
CREATE POLICY "Allow authenticated users to insert requests" ON public.collaboration_requests
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::text = user_id);

CREATE POLICY "Allow authenticated users to insert applications" ON public.collaboration_applications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::text = applicant_user_id);

-- Option 2: If Option 1 doesn't work, use these more permissive policies for testing
-- Uncomment the lines below if you need a quick fix:

-- CREATE POLICY "Allow all authenticated users to insert requests" ON public.collaboration_requests
--     FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- CREATE POLICY "Allow all authenticated users to insert applications" ON public.collaboration_applications
--     FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Option 3: Temporarily disable RLS for testing (not recommended for production)
-- Uncomment the lines below only for testing:

-- ALTER TABLE public.collaboration_requests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.collaboration_applications DISABLE ROW LEVEL SECURITY;

-- Verify the policies are working
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('collaboration_requests', 'collaboration_applications');