import { createClient } from '@supabase/supabase-js';

// Landing Supabase client — used only to resolve public Storage URLs for the
// adaptive-practice audio (bucket `audio-practices`) and HDR backdrops (bucket
// `hdr`), the SAME project the app uses. No auth/DB writes happen on landing.
//
// Deliberately does NOT throw if the env is missing: a misconfigured landing
// env should degrade gracefully (the practice still runs the pacer + camera)
// rather than crash the chunk. Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
// in landing/.env (same values as the app) for audio + the HDR backdrop to load.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) ?? '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
