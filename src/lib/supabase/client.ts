import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubpadjsxmfqcrcxeoiwe.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_oS6c-2Io92xqGQ4vgIMEYA_apEW3xcj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
