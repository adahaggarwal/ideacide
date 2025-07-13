-- =====================================================
-- SUPABASE SETUP SCRIPT - RUN THESE IN ORDER
-- =====================================================

-- 1. FIRST: Create the stories table (if not already created)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    links TEXT[] DEFAULT '{}',
    author_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'published',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON public.stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_status ON public.stories(status);

-- 3. Enable Row Level Security (RLS) for stories table
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for stories table
DROP POLICY IF EXISTS "Anyone can read published stories" ON public.stories;
CREATE POLICY "Anyone can read published stories" ON public.stories
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Users can insert their own stories" ON public.stories;
CREATE POLICY "Users can insert their own stories" ON public.stories
    FOR INSERT WITH CHECK (true); -- Allow any authenticated user to insert

DROP POLICY IF EXISTS "Users can update their own stories" ON public.stories;
CREATE POLICY "Users can update their own stories" ON public.stories
    FOR UPDATE USING (author_id = current_setting('request.jwt.claims', true)::json->>'sub');

DROP POLICY IF EXISTS "Users can delete their own stories" ON public.stories;
CREATE POLICY "Users can delete their own stories" ON public.stories
    FOR DELETE USING (author_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 5. Create function to increment views
CREATE OR REPLACE FUNCTION increment_story_views(story_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.stories 
    SET views = views + 1 
    WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_stories_updated_at ON public.stories;
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKET SETUP - DO THIS MANUALLY IN UI FIRST
-- =====================================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket called 'story-images'
-- 3. Make sure it's set to PUBLIC
-- 4. Then run the policies below

-- =====================================================
-- STORAGE POLICIES - RUN THESE IN SQL EDITOR
-- =====================================================

-- Remove existing policies first
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- 1. Allow anyone to view images (public read)
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'story-images');

-- 2. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'story-images' 
    AND auth.role() = 'authenticated'
);

-- 3. Allow users to update their own images (optional)
CREATE POLICY "Users can update own images" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'story-images' 
    AND auth.role() = 'authenticated'
);

-- 4. Allow users to delete their own images (optional)
CREATE POLICY "Users can delete own images" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'story-images' 
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if table exists and has correct structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'stories' 
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'stories';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'stories';

-- Check storage policies
SELECT * FROM storage.buckets WHERE name = 'story-images';

-- =====================================================
-- TEST DATA (OPTIONAL)
-- =====================================================

-- Insert a test story (replace 'test-user-id' with actual Firebase UID)
INSERT INTO public.stories (
    title, 
    description, 
    author_id, 
    author_name, 
    author_email
) VALUES (
    'Test Story', 
    'This is a test story to verify the setup works correctly.',
    'test-user-id',
    'Test User',
    'test@example.com'
);