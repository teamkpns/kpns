-- ==============================================================================
-- KPNS DATABASE MIGRATION: ADD PASSWORD COLUMN TO MEMBERS TABLE
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" in the left sidebar
-- 3. Click "New Query", paste this entire script, and click "Run" (or Ctrl+Enter)
-- ==============================================================================

-- 1. Add the password column with default 'kpns@2026'
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT 'kpns@2026';

-- 2. Set default password for any existing member rows that have NULL or empty password
UPDATE public.members 
SET password = 'kpns@2026' 
WHERE password IS NULL OR password = '';

-- 3. Confirmation query - check all members now have passwords
SELECT member_id, user_id, name, role, committee_role, password 
FROM public.members;