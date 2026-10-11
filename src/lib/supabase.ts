import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 'https://zjuyvjylqhrgklsztrco.supabase.co';
const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdXl2anlscWhyZ2tsc3p0cmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MjM3OTMsImV4cCI6MjEwNzI5OTc5M30.92BKQO-ZAjrZ2QjSFU1sEmQHmEvjgrrGUZE1vlYhiJg';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

// Create safe Supabase client for frontend with anon key
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
