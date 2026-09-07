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
    committee_role VARCHAR(100) DEFAULT NULL,
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
    club_name_english TEXT NOT NULL DEFAULT 'KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS)',
    tagline TEXT DEFAULT 'একসাথে, এক পরিচয়ে, এক পরিবারের বন্ধনে',
    contact_email VARCHAR(255) DEFAULT 'kpnsclub@gmail.com',
    contact_phone VARCHAR(50) DEFAULT '+91 94756 46111',
    address TEXT DEFAULT 'Vill & Post: Khejurda, P.S.: Egra, Dist: Purba Medinipur, State: West Bengal, Pin: 721422',
    logo_url TEXT DEFAULT '/img/logo.png',
    registration_open BOOLEAN DEFAULT true,
    auto_generate_member_id BOOLEAN DEFAULT true,
    member_id_prefix VARCHAR(20) DEFAULT 'KPNS'
);

-- 7. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Activity Posts Table
CREATE TABLE IF NOT EXISTS public.activity_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    photo_url TEXT,
    post_date DATE NOT NULL DEFAULT CURRENT_DATE,
    fb_link TEXT,
    instagram_link TEXT,
    youtube_link TEXT,
    x_link TEXT,
    published BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) CONFIGURATION
-- ==============================================================================
-- Disable RLS to allow seamless web portal CRUD operations (Select, Insert, Update, Delete)
-- via the Supabase Publishable / Anon API Key
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_posts DISABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Members
INSERT INTO public.members (
    member_id, from_no, user_id, role, status, admission_date, name, father_name,
    whatsapp, alt_mobile, email, aadhaar, blood_group, dob, house_number,
    village_town, post_office, police_station, city, district, state, country, pincode, profile_completion, committee_role
) VALUES
(
    'KPNS75PP26', '75', 'PINTU75', 'MEMBER', 'ACTIVE', '2026-08-15',
    'Pintu Patra', 'Subhas Patra', '9876543210', '9123456780', 'pintu.patra@example.com',
    '541278901234', 'O+', '1995-09-02', 'KP-124', 'Khejurda', 'Khejurda', 'Khejuri',
    'Contai', 'Purba Medinipur', 'West Bengal', 'India', '721401', 90, 'Treasurer'
),
(
    'KPNS01AM20', '01', 'ADMIN_KPNS', 'ADMIN', 'ACTIVE', '2020-01-26',
    'Arup Maiti (Admin)', 'Nirod Maiti', '9832109876', '9434567890', 'admin@kpns.org.in',
    '654321098765', 'A+', '1988-04-14', 'H-01', 'Khejurda', 'Khejurda', 'Khejuri',
    'Contai', 'Purba Medinipur', 'West Bengal', 'India', '721401', 100, 'President'
),
(
    'KPNS88RM25', '88', 'RAJA88', 'MEMBER', 'ACTIVE', '2025-11-10',
    'Raja Mukherjee', 'Bimal Mukherjee', '9830012345', NULL, 'raja.mukherjee@example.com',
    NULL, 'B+', '1992-09-05', NULL, 'Khejurda', 'Khejurda', 'Khejuri',
    'Contai', 'Purba Medinipur', 'West Bengal', 'India', '721401', 95, 'Sports Secretary'
),
(
    'KPNS92RG26', '92', 'RANI92', 'MEMBER', 'ACTIVE', '2026-02-14',
    'Rani Ghosh', 'Gopal Ghosh', '9871122334', NULL, 'rani.ghosh@example.com',
    NULL, 'AB+', '1998-09-20', NULL, 'Khejurda', NULL, NULL,
    NULL, 'Purba Medinipur', 'West Bengal', 'India', '721401', 75, 'Cultural Secretary'
),
(
    'KPNS45SK24', '45', 'SOUMEN45', 'MEMBER', 'INACTIVE', '2024-05-01',
    'Soumen Karan', 'Tarapada Karan', '9733445566', NULL, 'soumen.k@example.com',
    NULL, 'O-', '1990-12-05', NULL, 'Bhograi', NULL, NULL,
    'Jaleswar', 'Baleswar', 'Odisha', 'India', '756038', 85, NULL
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
    '1996-03-15', '12-B', 'Khejurda', 'Khejurda', 'Khejuri', 'Contai',
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
    'KHEJURDA PALLIUNNYAYAN NARAYAN SANGHA (KPNS)',
    'একসাথে, এক পরিচয়ে, এক পরিবারের বন্ধনে',
    'contact@kpns.org.in',
    '+91 98765 43210',
    'Vill & Post: Khejurda, P.S.: Egra, Dist: Purba Medinipur, West Bengal - 721422',
    '/img/logo.png',
    true,
    true,
    'KPNS'
)
ON CONFLICT DO NOTHING;

-- Seed Activity Posts
INSERT INTO public.activity_posts (title, body, photo_url, post_date, fb_link, published, created_by) VALUES
(
    'Annual Health Camp 2026',
    'KPNS successfully organised its Annual Free Medical & Eye Camp on 20th August 2026 at Khejurda. Specialist doctors from Contai District Hospital provided free checkups to over 200 villagers. Medicines were distributed free of cost to backward children. Ophthalmic surgeries were also conducted in collaboration with the Lions'' Club of Egra.',
    NULL,
    '2026-08-20',
    NULL,
    true,
    'Admin'
),
(
    'ICDS Nutrition Drive — August 2026',
    'Our ICDS wing conducted a month-long nutrition awareness drive across 5 Anganwadi centres in Khejurda Block. Pre-school children were provided supplementary nutrition packs, and mothers were educated on balanced diet preparation. The program benefited over 120 children aged 0–6 years.',
    NULL,
    '2026-08-05',
    NULL,
    true,
    'Admin'
),
(
    'Sudhi Samman 2026 — Annual Literary Felicitation',
    'The 88th Annual Sahitya Baasar of KPNS was held on 15th July 2026. Distinguished educators and literary personalities from Purba Medinipur were honoured with the prestigious Sudhi Samman award. The event also featured the release of the latest edition of our literary magazine "Saaraswat Arghya".',
    NULL,
    '2026-07-15',
    NULL,
    true,
    'Admin'
)
ON CONFLICT DO NOTHING;
