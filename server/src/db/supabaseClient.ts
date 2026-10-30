// server/src/db/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    console.log('[Supabase] Initialized client connected to:', supabaseUrl);
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client:', err);
  }
} else {
  // Graceful fallback to local persistence
  console.log('[DB] Running in zero-friction Local Database Mode.');
}
