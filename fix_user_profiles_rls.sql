-- QUICK FIX: Disable RLS for user_profiles table to allow Firebase Auth users
-- This is a temporary solution - for production, consider implementing proper JWT verification

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Disable RLS temporarily
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- OR: Create more permissive policies that work with your Firebase setup
-- Uncomment the following if you want to keep RLS enabled but make it work with Firebase

-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all profiles (you can make this more restrictive later)
-- CREATE POLICY "Allow authenticated users to read profiles" ON public.user_profiles
--     FOR SELECT USING (true);

-- Allow authenticated users to insert profiles
-- CREATE POLICY "Allow authenticated users to insert profiles" ON public.user_profiles
--     FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update profiles
-- CREATE POLICY "Allow authenticated users to update profiles" ON public.user_profiles
--     FOR UPDATE USING (true);
