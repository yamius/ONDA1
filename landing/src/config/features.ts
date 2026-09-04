/**
 * Feature availability for the static (Vercel) deployment.
 *
 * The site is served as static files from `dist/` — there is no `/api` runtime.
 * Anything that needs the server-side Supabase proxy (votes, comments, the
 * app/Android waitlist) therefore degrades gracefully: the UI hides or disables
 * itself instead of showing a broken control, submitting into the void, or
 * logging a red console error. App Store links are plain static links and keep
 * working.
 *
 * To turn these features back on: add the Vercel serverless functions
 * (see `_deferred-api/README.md`), set `VITE_API_ENABLED=1` in the Vercel
 * project env, and redeploy — the gated UI reappears automatically.
 */
// `import.meta.env` is UNDEFINED when tsx evaluates this module during the
// prerender step (Node), so read it defensively — same pattern as
// lib/supabase.ts and lib/emotonAnalytics.ts.
const env = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {}
export const API_ENABLED = env.VITE_API_ENABLED === '1'
