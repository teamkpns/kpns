-- ==============================================================================
-- KPNS Member Management Portal — Database Schema & Initial Seed
-- Project ID: ubpadjsxmfqcrcxeoiwe
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Members Table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id VARCHAR(50) UNIQUE NOT NULL,
    from_no VARCHAR(50),
    user_id VARCHAR(50) UNIQUE,
    role VARCHAR(20) DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'ADMIN', 'SUPERADMIN')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED', 'RESIGNED', 'REJECTED')),
    admission_date DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT,
    
    -- Personal Details
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    alt_mobile VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    aadhaar VARCHAR(20),
    blood_group VARCHAR(10) NOT NULL,
    dob DATE NOT NULL,
    
    -- Address Details
    house_number VARCHAR(100),
    village_town VARCHAR(255) NOT NULL,
    post_office VARCHAR(255),
    police_station VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255) DEFAULT 'Purba Medinipur',
    state VARCHAR(255) DEFAULT 'West Bengal',
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20) NOT NULL,
    
    -- Meta & Scores
    profile_completion INTEGER DEFAULT 85,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id VARCHAR(50) PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    applied_date DATE DEFAULT CURRENT_DATE,
    
    -- Personal Details
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    alt_mobile VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    aadhaar VARCHAR(20),
    blood_group VARCHAR(10) NOT NULL,
    dob DATE NOT NULL,
    
    -- Address Details
    house_number VARCHAR(100),
    village_town VARCHAR(255) NOT NULL,
    post_office VARCHAR(255),
    police_station VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255) DEFAULT 'Purba Medinipur',
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

-- 4. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action TEXT NOT NULL,
    member_id VARCHAR(50),
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Club Settings Table
CREATE TABLE IF NOT EXISTS public.club_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_name_bengali TEXT NOT NULL DEFAULT 'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ',
    club_name_english TEXT NOT NULL DEFAULT 'Khejurdaha Pally Unnayan Narayan Sangha (KPNS)',
    tagline TEXT DEFAULT 'একসাথে, এক পরিচয়ে, এক পরিবারের বন্ধনে',
    contact_email VARCHAR(255) DEFAULT 'contact@kpns.org.in',
    contact_phone VARCHAR(50) DEFAULT '+91 98765 43210',
    address TEXT DEFAULT 'Vill: Khejurdaha, P.O: Khejurdaha, Dist: Purba Medinipur, West Bengal - 721401',
    logo_url TEXT DEFAULT '/img/logo.png',
    registration_open BOOLEAN DEFAULT true,
    auto_generate_member_id BOOLEAN DEFAULT true,
    member_id_prefix VARCHAR(20) DEFAULT 'KPNS'
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR WEB CLIENT ACCESS
-- ==============================================================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_settings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies to avoid conflict
DROP POLICY IF EXISTS "Public access members" ON public.members;
DROP POLICY IF EXISTS "Public access applications" ON public.applications;
DROP POLICY IF EXISTS "Public access activity_logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Public access notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public access club_settings" ON public.club_settings;
DROP POLICY IF EXISTS "Members can view own profile" ON public.members;
DROP POLICY IF EXISTS "Members can update own profile" ON public.members;
DROP POLICY IF EXISTS "Admins have full access to members" ON public.members;
DROP POLICY IF EXISTS "Admins have full access to applications" ON public.applications;
DROP POLICY IF EXISTS "Admins have full access to activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Public can submit applications" ON public.applications;
DROP POLICY IF EXISTS "Public can view club settings" ON public.club_settings;

-- Allow full client access through anon API key
CREATE POLICY "Public access members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access club_settings" ON public.club_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Members
INSERT INTO public.members (
    member_id, from_no, user_id, role, status, admission_date, name, father_name,
    whatsapp, alt_mobile, email, aadhaar, blood_group, dob, house_number,
    village_town, post_office, police_station, city, district, state, country, pincode, profile_completion
) VALUES
(
    'KPNS75PP26', '75', 'PINTU75', 'MEMBER', 'ACTIVE', '2026-08-15',
    'Pintu Patra', 'Subhas Patra', '9876543210', '9123456780', 'pintu.patra@example.com',
    '541278901234', 'O+', '1995-09-02', 'KP-124', 'Khejurdaha', 'Khejurdaha', 'Khejuri',
    'Contai', 'Purba Medinipur', 'West Bengal', 'India', '721401', 90
),
(
    'KPNS01AM20', '01', 'ADMIN_KPNS', 'ADMIN', 'ACTIVE', '2020-01-26',
    'Arup Maiti (Admin)', 'Nirod Maiti', '9832109876', '9434567890', 'admin@kpns.org.in',
    '654321098765', 'A+', '1988-04-14', 'H-01', 'Khejurdaha', 'Khejurdaha', 'Khejuri',
    'Contai', 'Purba Medinipur', 'West Bengal', 'India', '721401', 100
),
(
    'KPNS88RM25', '88', 'RAJA88', 'MEMBER', 'ACTIVE', '2025-11-10',
    'Raja Mukherjee', 'Bimal Mukherjee', '9830012345', NULL, 'raja.mukherjee@example.com',
    NULL, 'B+', '1992-09-05', NULL, 'Khejurdaha', 'Khejurdaha', 'Khejuri',
    'Contai', 'Purba Medinipur', 'West Bengal', 'India', '721401', 95
),
(
    'KPNS92RG26', '92', 'RANI92', 'MEMBER', 'ACTIVE', '2026-02-14',
    'Rani Ghosh', 'Gopal Ghosh', '9871122334', NULL, 'rani.ghosh@example.com',
    NULL, 'AB+', '1998-09-20', NULL, 'Khejurdaha', NULL, NULL,
    NULL, 'Purba Medinipur', 'West Bengal', 'India', '721401', 75
),
(
    'KPNS45SK24', '45', 'SOUMEN45', 'MEMBER', 'INACTIVE', '2024-05-01',
    'Soumen Karan', 'Tarapada Karan', '9733445566', NULL, 'soumen.k@example.com',
    NULL, 'O-', '1990-12-05', NULL, 'Bhograi', NULL, NULL,
    'Jaleswar', 'Baleswar', 'Odisha', 'India', '756038', 85
)
ON CONFLICT (member_id) DO NOTHING;

-- Seed Applications
INSERT INTO public.applications (
    id, status, applied_date, name, father_name, whatsapp, alt_mobile, email,
    aadhaar, blood_group, dob, house_number, village_town, post_office,
    police_station, city, district, state, country, pincode
) VALUES
(
    'KPNS-APP-2026-0001', 'PENDING', '2026-09-01', 'Debasish Jana', 'Bhabesh Jana',
    '9876501234', '9876501235', 'debasish.jana@example.com', '789012345678', 'O+',
    '1996-03-15', '12-B', 'Khejurdaha', 'Khejurdaha', 'Khejuri', 'Contai',
    'Purba Medinipur', 'West Bengal', 'India', '721401'
),
(
    'KPNS-APP-2026-0002', 'PENDING', '2026-09-02', 'Mousumi Das', 'Prabir Das',
    '9832456789', NULL, 'mousumi.das@example.com', NULL, 'B+',
    '1999-11-22', NULL, 'Kamarda', 'Kamarda', 'Khejuri', 'Contai',
    'Purba Medinipur', 'West Bengal', 'India', '721430'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Club Settings
INSERT INTO public.club_settings (
    club_name_bengali, club_name_english, tagline, contact_email,
    contact_phone, address, logo_url, registration_open, auto_generate_member_id, member_id_prefix
) VALUES (
    'খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ',
    'Khejurdaha Pally Unnayan Narayan Sangha (KPNS)',
    'একসাথে, এক পরিচয়ে, এক পরিবারের বন্ধনে',
    'contact@kpns.org.in',
    '+91 98765 43210',
    'Vill: Khejurdaha, P.O: Khejurdaha, Dist: Purba Medinipur, West Bengal - 721401',
    '/img/logo.png',
    true,
    true,
    'KPNS'
)
ON CONFLICT DO NOTHING;
