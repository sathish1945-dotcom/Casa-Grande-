-- ==============================================================================
-- Elvira Crest Luxury Realty - Supabase Database Schema
-- Tamil Nadu Residential Developer Architecture
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    city TEXT NOT NULL CHECK (city IN ('Chennai', 'Coimbatore', 'Bengaluru')),
    locality TEXT NOT NULL,
    address TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('Apartment', 'Sky Villa', 'Penthouse', 'Row Villa')),
    status TEXT NOT NULL CHECK (status IN ('Ready to Move', 'Under Construction', 'New Launch')),
    possession_date TEXT NOT NULL,
    rera_id TEXT NOT NULL,
    starting_price BIGINT NOT NULL,
    starting_price_display TEXT NOT NULL,
    max_price BIGINT NOT NULL,
    total_acreage NUMERIC(5, 2) NOT NULL,
    total_towers INT NOT NULL DEFAULT 1,
    total_units INT NOT NULL,
    open_space_percentage INT NOT NULL DEFAULT 75,
    hero_image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    amenities JSONB DEFAULT '[]'::jsonb,
    nearby_landmarks JSONB DEFAULT '[]'::jsonb,
    construction_updates JSONB,
    brochure_file_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_projects_city ON public.projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_price ON public.projects(starting_price);

-- 2. Project Configurations Table (BHK Floor Units)
CREATE TABLE IF NOT EXISTS public.project_configurations (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    bhk INT NOT NULL,
    carpet_area_sq_ft INT NOT NULL,
    super_built_up_sq_ft INT NOT NULL,
    bathrooms INT NOT NULL,
    balconies INT NOT NULL DEFAULT 1,
    indicative_price BIGINT NOT NULL,
    price_display TEXT NOT NULL,
    floor_plan_url TEXT,
    available_units INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_configurations_project ON public.project_configurations(project_id);
CREATE INDEX IF NOT EXISTS idx_configurations_bhk ON public.project_configurations(bhk);

-- 3. Leads Table (Protected CRM Data)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT ('ELV-' || TO_CHAR(NOW(), 'YYYY') || '-' || FLOOR(1000 + RANDOM() * 9000)::TEXT),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_city TEXT,
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    project_name TEXT,
    budget_range TEXT NOT NULL,
    purchase_timeline TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Site Visit Scheduled', 'Qualified', 'Closed', 'Archived')),
    source TEXT NOT NULL DEFAULT 'Website' CHECK (source IN ('HomeFinder AI', 'Homepage Hero', 'Site Visit Form', 'Brochure Download', 'Project Details')),
    notes TEXT,
    consent BOOLEAN NOT NULL DEFAULT true,
    scheduled_visit_date DATE,
    scheduled_visit_slot TEXT,
    assigned_sales_rep TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_project ON public.leads(project_id);

-- 4. Site Visit Requests (Detailed booking schedule)
CREATE TABLE IF NOT EXISTS public.site_visit_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot TEXT NOT NULL,
    cab_assistance_required BOOLEAN DEFAULT false,
    pickup_location TEXT,
    accompanying_guests INT DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Pending Confirmation' CHECK (status IN ('Pending Confirmation', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled')),
    consent BOOLEAN NOT NULL DEFAULT true
);

-- 5. Row Level Security (RLS) Setup
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visit_requests ENABLE ROW LEVEL SECURITY;

-- Public can read all active projects and configurations
CREATE POLICY "Public can view projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Public can view configurations" ON public.project_configurations
    FOR SELECT USING (true);

-- Public can insert new leads (Lead Capture form submissions)
CREATE POLICY "Public can create leads" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Public can insert site visit requests
CREATE POLICY "Public can book site visits" ON public.site_visit_requests
    FOR INSERT WITH CHECK (true);

-- Only authenticated staff / service role can view, update, and manage leads
CREATE POLICY "Authenticated staff can manage leads" ON public.leads
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated staff can manage site visits" ON public.site_visit_requests
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);
