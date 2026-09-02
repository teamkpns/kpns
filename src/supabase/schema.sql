-- KPNS Member Management Portal Database Schema
-- Database: Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MEMBERS / PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id VARCHAR(50) UNIQUE NOT NULL,
    from_no VARCHAR(50),
    user_id VARCHAR(50) UNIQUE,
    role VARCHAR(20) DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'ADMIN', 'SUPERADMIN')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED', 'RESIGNED', 'REJECTED')),
    admission_date DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT,
    
    -- Personal Information
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    alt_mobile VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    aadhaar VARCHAR(20), -- Stored securely
    blood_group VARCHAR(10) NOT NULL,
    dob DATE NOT NULL,
    
    -- Address Information
    house_number VARCHAR(100),
    village_town VARCHAR(255) NOT NULL,
    post_office VARCHAR(255),
    police_station VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255) DEFAULT 'West Bengal',
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20) NOT NULL,
    
    -- Computed
    profile_completion INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. REGISTRATION APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id VARCHAR(50) PRIMARY KEY, -- e.g. KPNS-APP-2026-0001
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    applied_date DATE DEFAULT CURRENT_DATE,
    
    -- Personal Information
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    alt_mobile VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    aadhaar VARCHAR(20),
    blood_group VARCHAR(10) NOT NULL,
    dob DATE NOT NULL,
    
    -- Address Information
    house_number VARCHAR(100),
    village_town VARCHAR(255) NOT NULL,
    post_office VARCHAR(255),
    police_station VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255) DEFAULT 'West Bengal',
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20) NOT NULL,
    
    -- Approval Details
    from_no VARCHAR(50),
    member_id VARCHAR(50),
    admission_date DATE,
    user_id VARCHAR(50),
    rejection_reason TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action TEXT NOT NULL,
    member_id VARCHAR(50),
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50), -- NULL for broadcast to all
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CLUB SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.club_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_name_bengali TEXT NOT NULL DEFAULT 'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ',
    club_name_english TEXT NOT NULL DEFAULT 'Khejurdaha Pally Unnayan Narayan Sangha',
    tagline TEXT DEFAULT 'একসাথে, এক পরিচয়ে, এক পরিবারের বন্ধনে',
    contact_email VARCHAR(255) DEFAULT 'contact@kpns.org.in',
    contact_phone VARCHAR(50) DEFAULT '+91 98765 43210',
    address TEXT DEFAULT 'Vill: Khejurdaha, P.O: Khejurdaha, Dist: Purba Medinipur, West Bengal - 721401',
    logo_url TEXT,
    registration_open BOOLEAN DEFAULT true,
    auto_generate_member_id BOOLEAN DEFAULT true,
    member_id_prefix VARCHAR(20) DEFAULT 'KPNS'
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public can insert new applications
CREATE POLICY "Public can submit applications" ON public.applications
    FOR INSERT WITH CHECK (true);

-- 2. Public can read club settings
CREATE POLICY "Public can view club settings" ON public.club_settings
    FOR SELECT USING (true);

-- 3. Members can view and edit their own profile
CREATE POLICY "Members can view own profile" ON public.members
    FOR SELECT USING (auth.uid()::text = id::text OR auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Members can update own profile" ON public.members
    FOR UPDATE USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- 4. Admins have full access
CREATE POLICY "Admins have full access to members" ON public.members
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Admins have full access to applications" ON public.applications
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Admins have full access to activity logs" ON public.activity_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');
