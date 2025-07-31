-- Create stories table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON public.stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_status ON public.stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_title ON public.stories USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_stories_description ON public.stories USING gin(to_tsvector('english', description));

-- Enable Row Level Security (RLS)
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Allow anyone to read published stories
CREATE POLICY "Anyone can read published stories" ON public.stories
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to insert their own stories
CREATE POLICY "Users can insert their own stories" ON public.stories
    FOR INSERT WITH CHECK (auth.uid()::text = author_id);

-- Allow users to update their own stories
CREATE POLICY "Users can update their own stories" ON public.stories
    FOR UPDATE USING (auth.uid()::text = author_id);

-- Allow users to delete their own stories
CREATE POLICY "Users can delete their own stories" ON public.stories
    FOR DELETE USING (auth.uid()::text = author_id);

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_story_views(story_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.stories 
    SET views = views + 1 
    WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket policy for images (run this in the Storage section)
-- Go to Storage -> Policies -> New Policy

-- Policy for viewing images (anyone can view)
/*
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'story-images');
*/

-- Policy for uploading images (authenticated users only)
/*
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'story-images' AND auth.role() = 'authenticated');
*/

-- Policy for updating images (users can update their own)
/*
CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'story-images' AND auth.uid()::text = (storage.foldername(name))[1]);
*/

-- Policy for deleting images (users can delete their own)
/*
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'story-images' AND auth.uid()::text = (storage.foldername(name))[1]);
*/

-- User Profiles Table
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    user_type VARCHAR(50) CHECK (user_type IN ('student', 'investor', 'entrepreneur', 'working_professional')),
    has_active_startup BOOLEAN,
    startup_industry VARCHAR(255),
    startup_details TEXT,
    failure_reason TEXT,
    platform_purpose TEXT[] DEFAULT '{}', -- Array of purposes: investment, ideas, knowledge
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_completed ON public.user_profiles(profile_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid()::text = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Create trigger to automatically update updated_at for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();