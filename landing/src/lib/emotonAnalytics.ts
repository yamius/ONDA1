import type { PostHog } from 'posthog-js'

/**
 * Emoton product analytics — the in-tool funnel (open → name a feeling → route →
 * practice/be-with → download CTA), in PostHog ONLY. Single source of truth so
 * the privacy rules live in one place:
 *
 *   - Emotional properties (zone / shade / route / register) go to PostHog and
 *     NOWHERE else. They are NEVER sent to the ad pixels (Meta/Reddit) — those
 *     see only the generic conversion already wired on the CTAs.
 *   - Anonymous: no login, no PII. person_profiles:'identified_only' → events
 *     have no person profile; we don't build a per-user emotional profile.
 *   - Stable English keys (fight/shame/be_with…), never localized UI strings.
 *   - The crisis off-ramp is NOT eventized (the caller simply doesn't track it).
 *
 * posthog-js is dynamically imported on first use (client-only) so it never
 * enters the SSR/prerender graph and only ships in the lazy /emoton chunk.
 * Everything no-ops gracefully when VITE_POSTHOG_KEY is absent.
 */

export type EmotonEvent =
  | 'emoton_opened'
  | 'presence_started'
  | 'zone_selected'
  | 'shade_selected'
  | 'route_selected'
  | 'practice_started'
  | 'practice_completed'
  | 'bewith_entered'
  | 'bewith_stayed_longer'
  | 'assimilation_reached'
  | 'download_cta_viewed'
  | 'download_cta_clicked'
  | 'restarted'

// Config resolution: PostHog key/host come from VITE_POSTHOG_* (build-time),
// inlined by Vite. On Vercel, VITE_POSTHOG_KEY is a build-time env var, so
// import.meta.env carries the real value into the bundle. Everything no-ops
// gracefully when the key is absent.
// `import.meta.env` is UNDEFINED when tsx evaluates this module during the
// prerender step (Node), so it's read defensively (mirrors lib/supabase.ts).
const buildEnv = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {}
const KEY = buildEnv.VITE_POSTHOG_KEY
const HOST = buildEnv.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

let ph: PostHog | null = null
let initPromise: Promise<void> | null = null
let sessionId: string | null = null

function ensureInit(): Promise<void> {
  if (initPromise) return initPromise
  if (!KEY || typeof window === 'undefined') {
    initPromise = Promise.resolve()
    return initPromise
  }
  initPromise = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        person_profiles: 'identified_only', // anonymous — no person profiles
        autocapture: false, // only the named events below
        capture_pageview: false, // SPA — we send emoton_opened ourselves
      })
      ph = posthog
    })
    .catch(() => {
      /* analytics is best-effort — never let it break the tool */
    })
  return initPromise
}

/** Call once when the tool mounts: init + attribution super-props + emoton_opened. */
export async function startEmotonSession(): Promise<void> {
  await ensureInit()
  if (!ph) return
  sessionId =
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `s_${Date.now()}_${Math.floor(performance.now())}`
  const p = new URLSearchParams(location.search)
  const superProps: Record<string, string> = { emoton_session_id: sessionId }
  const add = (k: string, v: string | null) => {
    if (v) superProps[k] = v
  }
  add('ct', p.get('ct'))
  add('utm_source', p.get('utm_source'))
  add('utm_medium', p.get('utm_medium'))
  add('utm_campaign', p.get('utm_campaign'))
  try {
    if (document.referrer) superProps.referrer_host = new URL(document.referrer).host
  } catch {
    /* malformed referrer — skip */
  }
  ph.register(superProps) // session id + attribution ride on every event
  track('emoton_opened')
}

/** Fire a PostHog event. session_id + attribution are already super-props. */
export function track(name: EmotonEvent, props: Record<string, unknown> = {}): void {
  if (!ph) return
  ph.capture(name, props)
}

/**
 * Download conversion — PostHog only. The ad pixels (Reddit Lead) and Tenjin
 * already ride on the CTA links themselves; never duplicate them here and never
 * pass emotional properties into a pixel call.
 */
export function trackDownloadClick(placement: string): void {
  track('download_cta_clicked', { placement })
}
