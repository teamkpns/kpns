import { createClient } from '@supabase/supabase-js';

const transactionsSupabaseUrl =
  process.env.NEXT_PUBLIC_TRANSACTIONS_SUPABASE_URL ||
  'https://mumigktobshxonccrsxm.supabase.co';

const transactionsSupabaseAnonKey =
  process.env.NEXT_PUBLIC_TRANSACTIONS_SUPABASE_ANON_KEY ||
  'sb_publishable_3g4zniHPGQF2Kf9TjJzmlw_vTSb1dLM';

export const transactionsSupabase = createClient(
  transactionsSupabaseUrl,
  transactionsSupabaseAnonKey
);
