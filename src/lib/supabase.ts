/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep this runtime guard lightweight; in production prefer throwing or logging via env-specific logger
  console.warn('Supabase keys are not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
