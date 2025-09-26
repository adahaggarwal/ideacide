-- Collaboration Requests Table
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    collaboration_type VARCHAR(50) NOT NULL CHECK (collaboration_type IN ('funding', 'co_founder', 'mentor', 'advisor', 'partner', 'developer', 'designer', 'marketer', 'other')),
    industry VARCHAR(255),
    budget_range VARCHAR(100),
    equity_offered VARCHAR(50),
    location VARCHAR(255),
    remote_friendly BOOLEAN DEFAULT false,
    experience_required VARCHAR(50) CHECK (experience_required IN ('entry', 'mid', 'senior', 'expert', 'any')),
    skills_required TEXT[], -- Array of required skills
    contact_email VARCHAR(255),
    contact_method VARCHAR(50) CHECK (contact_method IN ('email', 'platform', 'both')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'completed')),
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
    tags TEXT[] DEFAULT '{}', -- Array of tags for better searchability
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_user_id ON public.collaboration_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_type ON public.collaboration_requests(collaboration_type);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_status ON public.collaboration_requests(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_created_at ON public.collaboration_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_industry ON public.collaboration_requests(industry);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_urgency ON public.collaboration_requests(urgency);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collaboration_requests_updated_at
    BEFORE UPDATE ON public.collaboration_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Collaboration Applications Table (for users to apply to requests)
CREATE TABLE IF NOT EXISTS public.collaboration_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES public.collaboration_requests(id) ON DELETE CASCADE,
    applicant_user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    portfolio_links TEXT[],
    experience_years INTEGER,
    relevant_skills TEXT[],
    availability VARCHAR(50) CHECK (availability IN ('full_time', 'part_time', 'contract', 'flexible')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for applications
CREATE INDEX IF NOT EXISTS idx_collaboration_applications_request_id ON public.collaboration_applications(request_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_applications_applicant ON public.collaboration_applications(applicant_user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_applications_status ON public.collaboration_applications(status);

-- Create trigger for applications updated_at
CREATE TRIGGER update_collaboration_applications_updated_at
    BEFORE UPDATE ON public.collaboration_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for collaboration_requests
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active collaboration requests
CREATE POLICY "Allow everyone to read active collaboration requests" ON public.collaboration_requests
    FOR SELECT USING (status = 'active');

-- Allow authenticated users to insert their own requests
CREATE POLICY "Allow authenticated users to insert requests" ON public.collaboration_requests
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::text = user_id);

-- Allow users to update their own requests
CREATE POLICY "Allow users to update own requests" ON public.collaboration_requests
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Allow users to delete their own requests
CREATE POLICY "Allow users to delete own requests" ON public.collaboration_requests
    FOR DELETE USING (auth.uid()::text = user_id);

-- RLS Policies for collaboration_applications
ALTER TABLE public.collaboration_applications ENABLE ROW LEVEL SECURITY;

-- Allow request owners and applicants to read applications
CREATE POLICY "Allow request owners and applicants to read applications" ON public.collaboration_applications
    FOR SELECT USING (
        auth.uid()::text = applicant_user_id OR 
        auth.uid()::text IN (
            SELECT user_id FROM public.collaboration_requests 
            WHERE id = request_id
        )
    );

-- Allow authenticated users to insert applications
CREATE POLICY "Allow authenticated users to insert applications" ON public.collaboration_applications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::text = applicant_user_id);

-- Allow applicants to update their own applications
CREATE POLICY "Allow applicants to update own applications" ON public.collaboration_applications
    FOR UPDATE USING (auth.uid()::text = applicant_user_id);

-- Allow request owners to update application status
CREATE POLICY "Allow request owners to update application status" ON public.collaboration_applications
    FOR UPDATE USING (
        auth.uid()::text IN (
            SELECT user_id FROM public.collaboration_requests 
            WHERE id = request_id
        )
    );

-- Function to increment views count
CREATE OR REPLACE FUNCTION increment_collaboration_views(request_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.collaboration_requests 
    SET views_count = views_count + 1 
    WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment applications count
CREATE OR REPLACE FUNCTION increment_applications_count(request_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.collaboration_requests 
    SET applications_count = applications_count + 1 
    WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;