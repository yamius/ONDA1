import { createClient } from '@supabase/supabase-js';

// Landing Supabase client — used only to resolve public Storage URLs for the
// adaptive-practice audio (bucket `audio-practices`) and HDR backdrops (bucket
// `hdr`), the SAME project the app uses. No auth/DB writes happen on landing.
//
// Must degrade gracefully when the env is missing rather than crash the chunk.
// Two hazards, both fatal to /emoton:
//  1. `import.meta.env` is a Vite-only object — UNDEFINED when tsx evaluates this
//     module directly during the prerender step (Node), so `import.meta.env.X`
//     throws "Cannot read properties of undefined". Read it through a guard.
//  2. createClient() THROWS on an empty url/key ("supabaseUrl is required."), so
//     a build without VITE_SUPABASE_* (CI/Replit — landing/.env is gitignored)
//     must still construct. Fall back to a valid-shaped placeholder; with the
//     real env present (browser/prod) the real values win.
// Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (same as the app) for audio +
// the HDR backdrop to actually load.
const env = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
