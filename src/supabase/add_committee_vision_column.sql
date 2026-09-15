-- ==============================================================================
-- KPNS DATABASE MIGRATION: ADD COMMITTEE VISION COLUMN TO MEMBERS TABLE
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard: https://supabase.com/dashboard
-- 2. Go to "SQL Editor" in the left sidebar
-- 3. Click "New Query", paste this script, and click "Run" (or press Ctrl+Enter)
-- ==============================================================================

-- 1. Add the committee_vision column to the members table
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS committee_vision TEXT DEFAULT NULL;

-- 2. (Optional) Set sample visions for existing committee members
UPDATE public.members 
SET committee_vision = 'To empower rural youth through education, healthcare, and cultural unity, making KPNS a beacon of selfless social welfare.'
WHERE committee_role = 'President' AND (committee_vision IS NULL OR committee_vision = '');

UPDATE public.members 
SET committee_vision = 'Ensuring absolute financial transparency, fiscal integrity, and optimal allocation of community funds for village welfare.'
WHERE committee_role = 'Treasurer' AND (committee_vision IS NULL OR committee_vision = '');

-- 3. Verification query — view committee members with their assigned vision
SELECT member_id, name, committee_role, committee_vision 
FROM public.members 
WHERE committee_role IS NOT NULL;
