
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rysivfwhvduhawottpkc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c2l2ZndodmR1aGF3b3R0cGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzA3MTUsImV4cCI6MjA1NzE0NjcxNX0.T_8IS7LFZK2wraoH1xffd7BELicKfobrcB5vlkxjc7E";

// Create client with proper configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'swiftaid-auth',
    detectSessionInUrl: false
  }
});
