declare global {
  interface Window {
    airbridge: ((method: string, ...args: any[]) => void) & {
      queue: any[];
      _i: number;
    };
  }
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
