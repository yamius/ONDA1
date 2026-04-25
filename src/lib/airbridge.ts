declare global {
  interface Window {
    airbridge: ((method: string, ...args: any[]) => void) & {
      queue: any[];
      _i: number;
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Parallel Firebase Analytics mirror.
//
// Every Airbridge event we fire is also mirrored into Firebase Analytics so
// Google Ads campaigns can keep optimising on the same conversion signals.
// Naming convention: Airbridge action ("Sign Up", "Finish Practice") →
// snake_case Firebase event name ("sign_up", "finish_practice"). The two SDKs
// run side-by-side; neither is the source of truth for the other.
//
// iOS:    @capacitor-community/firebase-analytics (lazy-loaded on first event).
// Android: existing native bridge in src/lib/analytics-bridge.ts.
// Web:    no-op (Firebase JS SDK is not initialized in this app).
// ─────────────────────────────────────────────────────────────────────────────

let _firebaseAnalytics: {
  logEvent: (opts: { name: string; params?: Record<string, any> }) => Promise<void>;
} | null = null;
let _firebaseInitPromise: Promise<void> | null = null;

async function _ensureFirebase(): Promise<void> {
  if (_firebaseInitPromise) return _firebaseInitPromise;
  _firebaseInitPromise = (async () => {
    try {
      const { Capacitor } = await import('@capacitor/core');
      if (Capacitor.getPlatform() !== 'ios') return;
      // Indirect import keeps Vite from trying to resolve the dep at build
      // time on web — same trick used in src/services/analytics.ts.
      const pkgName = '@capacitor-community' + '/firebase-analytics';
      const mod = await (new Function('p', 'return import(p)'))(pkgName);
      _firebaseAnalytics = mod.FirebaseAnalytics;
      console.log('[Firebase] Analytics ready (iOS)');
    } catch (e) {
      console.warn('[Firebase] init failed (analytics will no-op):', e);
    }
  })();
  return _firebaseInitPromise;
}

function _toSnake(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40); // Firebase event-name limit
}

// Sanitize params for Firebase: strip nullish, coerce booleans to strings,
// truncate string values to 100 chars (Firebase limit).
function _sanitizeFirebaseParams(p?: Record<string, unknown>): Record<string, any> {
  if (!p) return {};
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v === null || v === undefined) continue;
    const key = _toSnake(k);
    if (typeof v === 'string') out[key] = v.slice(0, 100);
    else if (typeof v === 'number' || typeof v === 'boolean') out[key] = v;
    else out[key] = String(v).slice(0, 100);
  }
  return out;
}

function _logFirebase(eventName: string, params?: Record<string, unknown>): void {
  // Fire-and-forget; never block the Airbridge call site.
  (async () => {
    try {
      const name = _toSnake(eventName);
      const safeParams = _sanitizeFirebaseParams(params);
      const { Capacitor } = await import('@capacitor/core');
      const platform = Capacitor.getPlatform();
      if (platform === 'android') {
        const { trackEventAndroid, isAndroidBridgeAvailable } = await import('./analytics-bridge');
        if (isAndroidBridgeAvailable()) {
          trackEventAndroid(name, safeParams);
        }
      } else if (platform === 'ios') {
        await _ensureFirebase();
        if (_firebaseAnalytics) {
          await _firebaseAnalytics.logEvent({ name, params: safeParams });
        }
      }
      console.log('[Firebase] Event mirrored:', name, safeParams);
    } catch (e) {
      console.warn('[Firebase] mirror failed:', eventName, e);
    }
  })();
}

export function trackAirbridgeEvent(
  category: string,
  action: string,
  data?: Record<string, unknown>
): void {
  try {
    if (typeof window.airbridge === 'function') {
      window.airbridge('event', { category, action, ...data });
      console.log('[Airbridge] Event tracked:', category, action);
    }
    _logFirebase(action, { category, ...(data ?? {}) });
  } catch (e) {
    console.warn('[Airbridge] Failed to track event:', category, action, e);
  }
}

/**
 * Track practice lifecycle events: View / Start / Stop / Finish.
 * Safe to call when Airbridge SDK is not loaded — silently no-ops.
 *
 * Event names (per Airbridge mapping):
 *   - basic    → "View Practice"          / "Start Practice"          / …
 *   - adaptive → "View Adaptive Practice" / "Start Adaptive Practice" / …
 *
 * @param action       One of: 'View' | 'Start' | 'Stop' | 'Finish'
 * @param practiceName Human-readable name (localized). Used as the event label.
 * @param opts.surface 'basic' (default) | 'adaptive' — controls event name prefix
 * @param opts.extra   Additional fields to merge into the event payload
 *                     (e.g. stress/energy for Finish Adaptive Practice).
 */
export function trackAirbridgePractice(
  action: 'View' | 'Start' | 'Stop' | 'Finish',
  practiceName: string | undefined | null,
  opts?: {
    surface?: 'basic' | 'adaptive';
    extra?: Record<string, unknown>;
  }
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const label = (practiceName ?? '').toString();
    const surface = opts?.surface ?? 'basic';
    const eventAction =
      surface === 'adaptive' ? `${action} Adaptive Practice` : `${action} Practice`;
    window.airbridge('event', {
      category: 'practice',
      action: eventAction,
      label,
      ...(opts?.extra ?? {}),
    });
    console.log('[Airbridge] Practice event:', eventAction, label, opts?.extra ?? '');
    _logFirebase(eventAction, { category: 'practice', label, ...(opts?.extra ?? {}) });
  } catch (e) {
    console.warn('[Airbridge] Failed to track practice event:', action, e);
  }
}

/**
 * Track emotional check-in events.
 *
 * Event names:
 *   - Start  → "Start Emotional Check"   (no label — user just tapped record)
 *   - Finish → "Finish Emotional Check"  (label = resolved emotion name)
 *
 * @param action       'Start' | 'Finish'
 * @param emotionName  Localized emotion label (only for Finish)
 */
export function trackAirbridgeEmotionalCheck(
  action: 'Start' | 'Finish',
  emotionName?: string | null
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const eventAction = `${action} Emotional Check`;
    const label = (emotionName ?? '').toString();
    window.airbridge('event', {
      category: 'emotional_check',
      action: eventAction,
      label,
    });
    console.log('[Airbridge] EmotionalCheck event:', eventAction, label);
    _logFirebase(eventAction, { category: 'emotional_check', label });
  } catch (e) {
    console.warn('[Airbridge] Failed to track emotional check event:', action, e);
  }
}

/**
 * Paywall: fired once each time the subscription screen opens.
 *
 * @param source UX surface that opened the paywall, e.g.
 *   `'practice_gate_basic'`, `'practice_gate_adaptive'`, `'cta_button'`,
 *   `'settings'`, `'onboarding'`, `'deeplink'`. Lets the dashboard slice
 *   conversion by entry point.
 */
export function trackAirbridgePaywallView(source?: string): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const payload: Record<string, unknown> = {
      category: 'paywall',
      action: 'View Paywall',
    };
    if (source) payload.source = source;
    window.airbridge('event', payload);
    console.log('[Airbridge] Paywall event: View Paywall', source ?? '');
    _logFirebase('View Paywall', { category: 'paywall', source });
  } catch (e) {
    console.warn('[Airbridge] Failed to track paywall view:', e);
  }
}

/**
 * Paywall: fired when the modal closes WITHOUT a successful Subscribe.
 * Restored sessions and auto-close-on-already-premium do NOT count as dismiss.
 */
export function trackAirbridgePaywallDismiss(opts?: {
  source?: string;
  plan?: 'yearly' | 'monthly' | string;
  timeOnScreenSeconds?: number;
}): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const payload: Record<string, unknown> = {
      category: 'paywall',
      action: 'Dismiss Paywall',
    };
    if (opts?.plan) payload.label = opts.plan;
    if (opts?.source) payload.source = opts.source;
    if (typeof opts?.timeOnScreenSeconds === 'number') {
      payload.time_on_screen_seconds = opts.timeOnScreenSeconds;
    }
    window.airbridge('event', payload);
    console.log('[Airbridge] Paywall event: Dismiss Paywall', payload);
    _logFirebase('Dismiss Paywall', payload);
  } catch (e) {
    console.warn('[Airbridge] Failed to track paywall dismiss:', e);
  }
}

/**
 * Paywall: fired when the user taps a purchase button.
 * @param subscriptionType e.g. 'monthly' | 'yearly'
 */
export function trackAirbridgePaywallClick(subscriptionType: string): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    window.airbridge('event', {
      category: 'paywall',
      action: 'Click Paywall Button',
      label: subscriptionType,
    });
    console.log('[Airbridge] Paywall event: Click Paywall Button', subscriptionType);
    _logFirebase('Click Paywall Button', { category: 'paywall', label: subscriptionType });
  } catch (e) {
    console.warn('[Airbridge] Failed to track paywall click:', e);
  }
}

/**
 * Paywall: fired after a successful purchase.
 * Uses Airbridge's standard semantic fields (value, currency) so the
 * revenue dashboard picks it up without extra mapping.
 */
export function trackAirbridgeSubscribe(params: {
  value: number;
  currency?: string;
  productId?: string;
  plan?: string;
}): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const payload: Record<string, unknown> = {
      category: 'paywall',
      action: 'Subscribe',
      value: params.value,
      currency: params.currency ?? 'USD',
    };
    if (params.productId) payload.product_id = params.productId;
    if (params.plan) payload.label = params.plan;
    window.airbridge('event', payload);
    console.log('[Airbridge] Paywall event: Subscribe', payload);
    // Mirror as Firebase `purchase` so Google Ads picks it up via the
    // standard ecommerce event schema (value + currency are required).
    _logFirebase('purchase', {
      value: params.value,
      currency: params.currency ?? 'USD',
      product_id: params.productId,
      plan: params.plan,
    });
  } catch (e) {
    console.warn('[Airbridge] Failed to track subscribe:', e);
  }
}

/**
 * Initialize App Open tracking.
 *
 * Fires `App Open` (category: `lifecycle`) once with `cold_start: true` on the
 * first call of the session, then subscribes to Capacitor's `appStateChange`
 * event and fires `App Open` with `cold_start: false` each time the app
 * returns to the foreground.
 *
 * Safe to call multiple times — subsequent calls are no-ops.
 */
let _airbridgeAppOpenInitialized = false;
export async function initAirbridgeAppOpenTracking(): Promise<void> {
  if (_airbridgeAppOpenInitialized) return;
  _airbridgeAppOpenInitialized = true;
  try {
    trackAirbridgeAppOpen({ cold_start: true });
    // Lazy-import Capacitor App plugin so web builds don't choke when the
    // plugin isn't registered.
    const { App } = await import('@capacitor/app');
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) trackAirbridgeAppOpen({ cold_start: false });
    });
    console.log('[Airbridge] App Open tracking initialized');
  } catch (e) {
    console.warn('[Airbridge] Failed to init app-open tracking:', e);
  }
}

/**
 * Sign Up: fired ONCE per new account, regardless of method.
 * Method is normalized to 'email' | 'apple' | 'google' for consistent dashboard slicing.
 */
export function trackAirbridgeSignUp(
  method: 'email' | 'apple' | 'google' | string,
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    window.airbridge('event', {
      category: 'auth',
      action: 'Sign Up',
      label: method,
    });
    console.log('[Airbridge] Auth event: Sign Up', method);
    _logFirebase('sign_up', { method });
  } catch (e) {
    console.warn('[Airbridge] Failed to track sign up:', e);
  }
}

/**
 * Sign In: fired for returning users (existing account) on successful session start.
 */
export function trackAirbridgeSignIn(
  method: 'email' | 'apple' | 'google' | string,
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    window.airbridge('event', {
      category: 'auth',
      action: 'Sign In',
      label: method,
    });
    console.log('[Airbridge] Auth event: Sign In', method);
    // Use Firebase reserved `login` event for Sign In so audiences/funnels
    // line up with Google's recommended schema.
    _logFirebase('login', { method });
  } catch (e) {
    console.warn('[Airbridge] Failed to track sign in:', e);
  }
}

/**
 * App Open: cold start (app launch) or warm resume from background.
 * Call once on module init for cold start; subsequent resumes set cold_start=false.
 */
export function trackAirbridgeAppOpen(opts?: { cold_start?: boolean }): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    window.airbridge('event', {
      category: 'lifecycle',
      action: 'App Open',
      cold_start: !!opts?.cold_start,
    });
    console.log('[Airbridge] Lifecycle event: App Open', { cold_start: !!opts?.cold_start });
    // NOTE: Firebase auto-fires its own `app_open` (and `session_start`,
    // `first_open`) at the native layer. Mirror under a distinct name so we
    // don't pollute Google's automatic event with our cold_start extra.
    _logFirebase('app_open_js', { cold_start: !!opts?.cold_start });
  } catch (e) {
    console.warn('[Airbridge] Failed to track app open:', e);
  }
}

/**
 * Complete Onboarding: user finished the last onboarding step.
 * @param durationSeconds optional time spent in onboarding
 */
export function trackAirbridgeOnboardingComplete(durationSeconds?: number): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const payload: Record<string, unknown> = {
      category: 'onboarding',
      action: 'Complete Onboarding',
    };
    if (typeof durationSeconds === 'number') payload.duration_seconds = durationSeconds;
    window.airbridge('event', payload);
    console.log('[Airbridge] Onboarding event: Complete Onboarding', payload);
    // Map to Firebase reserved `tutorial_complete` so the Google Ads
    // recommended-events list lines up out of the box.
    _logFirebase('tutorial_complete', {
      duration_seconds: durationSeconds,
    });
  } catch (e) {
    console.warn('[Airbridge] Failed to track onboarding complete:', e);
  }
}

/**
 * First Practice Complete: magic-moment activation event.
 * Fires ONLY the first time a user validly completes any practice — ever.
 * Idempotency is guarded by a localStorage flag set in this helper, so callers
 * can safely invoke it from every Finish site without double-counting.
 *
 * @param practiceName Localized practice name (same label used on Finish Practice)
 * @param opts.surface 'basic' | 'adaptive'
 */
const FIRST_PRACTICE_FLAG = 'onda_airbridge_first_practice_tracked';
export function trackAirbridgeFirstPracticeComplete(
  practiceName: string | undefined | null,
  opts?: { surface?: 'basic' | 'adaptive' },
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    if (localStorage.getItem(FIRST_PRACTICE_FLAG) === '1') return;
    localStorage.setItem(FIRST_PRACTICE_FLAG, '1');
    window.airbridge('event', {
      category: 'activation',
      action: 'First Practice Complete',
      label: (practiceName ?? '').toString(),
      surface: opts?.surface ?? 'basic',
    });
    console.log('[Airbridge] Activation event: First Practice Complete', practiceName, opts?.surface);
    _logFirebase('first_practice_complete', {
      label: (practiceName ?? '').toString(),
      surface: opts?.surface ?? 'basic',
    });
  } catch (e) {
    console.warn('[Airbridge] Failed to track first practice complete:', e);
  }
}

/**
 * Permission events. Fired once per system-prompt resolution.
 *
 * @param scope         'healthkit' | 'bluetooth' | 'notifications' | …
 * @param granted       true → user granted, false → user denied / restricted
 */
export function trackAirbridgePermission(
  scope: 'healthkit' | 'bluetooth' | 'notifications' | string,
  granted: boolean,
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const action =
      scope === 'healthkit'
        ? 'HealthKit Permission'
        : scope === 'bluetooth'
        ? 'Bluetooth Permission'
        : scope === 'notifications'
        ? 'Notifications Permission'
        : `${scope} Permission`;
    window.airbridge('event', {
      category: 'permission',
      action,
      label: granted ? 'granted' : 'denied',
    });
    console.log('[Airbridge] Permission event:', action, granted ? 'granted' : 'denied');
    _logFirebase(action, { scope, granted });
  } catch (e) {
    console.warn('[Airbridge] Failed to track permission:', scope, e);
  }
}

/**
 * Watch Connected: fired the first time per app session that the paired
 * Apple Watch reports both `paired` and `watchAppInstalled`. Caller is
 * responsible for transition detection — this helper does not deduplicate.
 *
 * @param watchModel Optional model string from `OndaWatch.getStatus()`.
 */
export function trackAirbridgeWatchConnected(watchModel?: string | null): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const payload: Record<string, unknown> = {
      category: 'device',
      action: 'Watch Connected',
    };
    if (watchModel) payload.label = watchModel;
    window.airbridge('event', payload);
    console.log('[Airbridge] Device event: Watch Connected', watchModel ?? '');
    _logFirebase('watch_connected', { label: watchModel ?? undefined });
  } catch (e) {
    console.warn('[Airbridge] Failed to track watch connected:', e);
  }
}

// Helper: persistent set kept in localStorage, used to dedupe milestone events
// (Level Unlocked, Circuit Complete, Artifact Earned) across sessions.
function _hasMilestoneFired(key: string, id: string | number): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const set = new Set<string>(JSON.parse(raw));
    return set.has(String(id));
  } catch {
    return false;
  }
}
function _markMilestoneFired(key: string, id: string | number): void {
  try {
    const raw = localStorage.getItem(key);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    set.add(String(id));
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {}
}

const LEVEL_UNLOCKED_KEY = 'onda_airbridge_level_unlocked';
const CIRCUIT_COMPLETE_KEY = 'onda_airbridge_circuit_complete';
const ARTIFACT_EARNED_KEY = 'onda_airbridge_artifact_earned';

/**
 * Level Unlocked: fires the first time per device that a given level
 * becomes available. Idempotent via localStorage — safe to call from a
 * useEffect that recomputes max-unlocked-level on every progress change.
 */
export function trackAirbridgeLevelUnlocked(level: number): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    if (_hasMilestoneFired(LEVEL_UNLOCKED_KEY, level)) return;
    _markMilestoneFired(LEVEL_UNLOCKED_KEY, level);
    window.airbridge('event', {
      category: 'progression',
      action: 'Level Unlocked',
      label: `level_${level}`,
      level,
    });
    console.log('[Airbridge] Progression event: Level Unlocked', level);
    // Map to Firebase reserved `level_up` for Google Ads recommended events.
    _logFirebase('level_up', { level, label: `level_${level}` });
  } catch (e) {
    console.warn('[Airbridge] Failed to track level unlocked:', e);
  }
}

/**
 * Circuit Complete: fires the first time a user finishes every practice in
 * a circuit (`isValidForArtifact === true` for all). Idempotent per circuit.
 */
export function trackAirbridgeCircuitComplete(
  circuitId: string | number,
  extra?: { has_artifact?: boolean; practices_count?: number },
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    if (_hasMilestoneFired(CIRCUIT_COMPLETE_KEY, circuitId)) return;
    _markMilestoneFired(CIRCUIT_COMPLETE_KEY, circuitId);
    window.airbridge('event', {
      category: 'progression',
      action: 'Circuit Complete',
      label: String(circuitId),
      ...(extra ?? {}),
    });
    console.log('[Airbridge] Progression event: Circuit Complete', circuitId, extra ?? '');
    _logFirebase('circuit_complete', {
      label: String(circuitId),
      ...(extra ?? {}),
    });
  } catch (e) {
    console.warn('[Airbridge] Failed to track circuit complete:', e);
  }
}

/**
 * Artifact Earned: fires the first time a user persists an artifact for a
 * given circuit. Idempotent per circuit (artifacts are 1:1 with circuits).
 */
export function trackAirbridgeArtifactEarned(
  circuitId: string | number,
  extra?: { bonus?: number; quality_score?: number },
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    if (_hasMilestoneFired(ARTIFACT_EARNED_KEY, circuitId)) return;
    _markMilestoneFired(ARTIFACT_EARNED_KEY, circuitId);
    window.airbridge('event', {
      category: 'progression',
      action: 'Artifact Earned',
      label: String(circuitId),
      ...(extra ?? {}),
    });
    console.log('[Airbridge] Progression event: Artifact Earned', circuitId, extra ?? '');
    // Map to Firebase reserved `unlock_achievement` for Google Ads.
    _logFirebase('unlock_achievement', {
      achievement_id: String(circuitId),
      ...(extra ?? {}),
    });
  } catch (e) {
    console.warn('[Airbridge] Failed to track artifact earned:', e);
  }
}

export function identifyAirbridgeUser(params: {
  id?: string;
  email?: string;
  alias?: string;
}): void {
  try {
    if (typeof window.airbridge === 'function') {
      window.airbridge('setUserID', params.id ?? null);
      if (params.email) window.airbridge('setUserEmail', params.email);
      if (params.alias) window.airbridge('setUserAlias', params.alias);
      console.log('[Airbridge] User identified:', params.id);
    }
    // Mirror the userId to Firebase Analytics so cross-device & ad attribution
    // joins line up. Fire-and-forget (does not block Airbridge).
    if (params.id) {
      (async () => {
        try {
          const { Capacitor } = await import('@capacitor/core');
          const platform = Capacitor.getPlatform();
          if (platform === 'android') {
            const { setUserIdAndroid, isAndroidBridgeAvailable } = await import('./analytics-bridge');
            if (isAndroidBridgeAvailable()) setUserIdAndroid(params.id!);
          } else if (platform === 'ios') {
            await _ensureFirebase();
            // setUserId lives on the same plugin module the analytics service uses.
            const pkgName = '@capacitor-community' + '/firebase-analytics';
            const mod = await (new Function('p', 'return import(p)'))(pkgName);
            await mod.FirebaseAnalytics.setUserId({ userId: params.id });
          }
          console.log('[Firebase] setUserId mirrored:', params.id);
        } catch (e) {
          console.warn('[Firebase] setUserId mirror failed:', e);
        }
      })();
    }
  } catch (e) {
    console.warn('[Airbridge] Failed to identify user:', e);
  }
}

export function initAirbridgeDeepLinkHandler(): void {
  window.addEventListener('airbridge-deeplink', (e: Event) => {
    const event = e as CustomEvent<{ url: string }>;
    const url = event.detail?.url;
    if (!url) return;

    console.log('[Airbridge] Deep link received in JS handler:', url);

    try {
      const parsed = new URL(url);
      const params: Record<string, string> = {};
      parsed.searchParams.forEach((v, k) => { params[k] = v; });

      if (typeof window.airbridge === 'function') {
        window.airbridge('event', {
          category: 'airbridge',
          action: 'app_open',
          label: url,
          deeplink: url,
          ...params,
        });
      }

      console.log('[Airbridge] Deep link forwarded to SDK, params:', params);
    } catch (e) {
      console.warn('[Airbridge] Failed to parse deep link URL:', url, e);
    }
  });

  console.log('[Airbridge] Deep link handler initialized');
}
