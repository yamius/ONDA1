// ─────────────────────────────────────────────────────────────────────────────
// Tenjin event helpers + Firebase Analytics mirror.
//
// Replaces the old src/lib/airbridge.ts (deleted in the same release). Same
// public API shape — every helper that used to be `trackAirbridge*` is now
// `trackTenjin*` — so calling code only needs an import rename.
//
// Two parallel pipelines per call:
//
//   1. Tenjin (iOS native plugin via OndaTenjin Capacitor plugin) — sends
//      to TenjinSDK.sendEvent / .transaction. This is our MMP signal:
//      install attribution, Tenjin's AppLovin Axon channel, etc.
//
//   2. Firebase Analytics (kept from the airbridge.ts era) — sends the same
//      event under a snake_case name into Firebase, which forwards into
//      GA4 → Google Ads conversions. Independent of the MMP, so the
//      Google Ads campaign keeps optimising even if Tenjin has a bad day.
//
// Naming: Tenjin event names follow snake_case ("start_practice",
// "view_paywall") to match Firebase's reserved-event schema and to keep
// dashboards consistent across the two pipelines.
// ─────────────────────────────────────────────────────────────────────────────

import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';
import OndaTenjin from '../plugins/ondaTenjin';

const _useNativeTenjin: boolean =
  Capacitor.getPlatform() === 'ios' && Capacitor.isPluginAvailable('OndaTenjin');

if (_useNativeTenjin) {
  console.log('[Tenjin] Using native iOS plugin');
} else {
  console.log('[Tenjin] Native plugin unavailable (platform:', Capacitor.getPlatform(), ') — Tenjin events will no-op, Firebase mirror still fires');
}

// ─── Tenjin send helpers ────────────────────────────────────────────────────

function _tenjinEvent(name: string, value?: number): void {
  if (!_useNativeTenjin) return;
  OndaTenjin.trackEvent({ name, value }).catch((e) =>
    console.warn('[OndaTenjin] trackEvent failed:', name, e),
  );
}

// NOTE: client-side Tenjin transaction reporting was removed. Revenue now
// flows to Tenjin via the server-side RevenueCat → Tenjin integration
// (configured in the RevenueCat dashboard). The server integration fires
// revenue at the correct subscription lifecycle moments — trial→paid
// conversion, renewal, refund — whereas the client could only ever see
// the initial trial start and would report the full price on day 0,
// before any money actually changed hands. Keeping both would also
// double-count. OndaTenjin.trackEvent (non-revenue events) is unaffected.

// ─── Firebase mirror (unchanged from airbridge.ts era) ──────────────────────

const _firebaseReady: boolean = (() => {
  try {
    return typeof FirebaseAnalytics?.logEvent === 'function';
  } catch {
    return false;
  }
})();
if (_firebaseReady) {
  console.log('[Firebase] Analytics module loaded (platform:', Capacitor.getPlatform(), ')');
} else {
  console.warn('[Firebase] Analytics module unavailable — events will no-op');
}

function _toSnake(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40); // Firebase event-name limit
}

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
  // Fire-and-forget; never block the Tenjin call site.
  (async () => {
    try {
      const name = _toSnake(eventName);
      const safeParams = _sanitizeFirebaseParams(params);
      const platform = Capacitor.getPlatform();
      if (platform === 'android') {
        const { trackEventAndroid, isAndroidBridgeAvailable } = await import('./analytics-bridge');
        if (isAndroidBridgeAvailable()) {
          trackEventAndroid(name, safeParams);
          console.log('[Firebase][android] Event mirrored:', name, safeParams);
        }
      } else if (platform === 'ios' && _firebaseReady) {
        await FirebaseAnalytics.logEvent({ name, params: safeParams });
        console.log('[Firebase][ios] Event mirrored:', name, safeParams);
      }
    } catch (e) {
      console.warn('[Firebase] mirror failed:', eventName, e);
    }
  })();
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Free-form custom event — escape hatch for one-off tracking. */
export function trackTenjinEvent(
  category: string,
  action: string,
  data?: Record<string, unknown>,
): void {
  try {
    _tenjinEvent(_toSnake(action));
    _logFirebase(action, { category, ...(data ?? {}) });
  } catch (e) {
    console.warn('[Tenjin] Failed to track event:', category, action, e);
  }
}

/**
 * Practice lifecycle events: View / Close / Start / Stop / Finish.
 *
 *   View   → user opened the practice intro screen
 *   Close  → user closed the intro WITHOUT pressing Start (caller is
 *            responsible for the practiceState !== 'active' guard)
 *   Start  → user pressed the Start button
 *   Stop   → user exited mid-practice (practiceState was 'active')
 *   Finish → timer ran out / practice completed naturally
 *
 * Tenjin doesn't accept arbitrary string params on sendEvent, so we send
 * TWO events per call when `practiceId` is provided:
 *
 *   1. The generic event (`view_practice`, `start_practice`, …) — feeds
 *      ad-network optimization signals (AppLovin Axon, Google Ads). All
 *      installs are pooled under one event name, which is what the bid
 *      models want.
 *
 *   2. A practice-specific event with the ID slug appended
 *      (`view_practice_p1_1`, `start_practice_p2_3`, …) — feeds Tenjin
 *      dashboard slicing. Use this in Tenjin's Live Event Tool / Data
 *      Exporter when you want to know *which* practice the user
 *      interacted with.
 *
 * Firebase Analytics receives the same event with `label` (localized
 * practice name) and `practice_id` (stable slug) as params, so GA4
 * already gives per-practice slicing without event-name explosion.
 */
export function trackTenjinPractice(
  action: 'View' | 'Close' | 'Start' | 'Stop' | 'Finish',
  practiceName: string | undefined | null,
  opts?: {
    surface?: 'basic' | 'adaptive';
    /** Stable slug like `p1-1` — appended to the Tenjin event name. */
    practiceId?: string | null;
    extra?: Record<string, unknown>;
  },
): void {
  try {
    const label = (practiceName ?? '').toString();
    const surface = opts?.surface ?? 'basic';
    const eventAction =
      surface === 'adaptive' ? `${action} Adaptive Practice` : `${action} Practice`;
    const genericName = _toSnake(eventAction);
    _tenjinEvent(genericName);
    if (opts?.practiceId) {
      // _toSnake handles dashes/punctuation: "p1-1" → "p1_1" → name "view_practice_p1_1".
      const slug = _toSnake(opts.practiceId);
      if (slug) _tenjinEvent(`${genericName}_${slug}`);
    }
    _logFirebase(eventAction, {
      category: 'practice',
      label,
      practice_id: opts?.practiceId ?? undefined,
      ...(opts?.extra ?? {}),
    });
  } catch (e) {
    console.warn('[Tenjin] Failed to track practice event:', action, e);
  }
}

/**
 * Emotional check-in events.
 *   - Start  → start_emotional_check
 *   - Finish → finish_emotional_check
 */
export function trackTenjinEmotionalCheck(
  action: 'Start' | 'Finish',
  emotionName?: string | null,
): void {
  try {
    const eventAction = `${action} Emotional Check`;
    const label = (emotionName ?? '').toString();
    _tenjinEvent(_toSnake(eventAction));
    _logFirebase(eventAction, { category: 'emotional_check', label });
  } catch (e) {
    console.warn('[Tenjin] Failed to track emotional check event:', action, e);
  }
}

/** Paywall: fired once each time the subscription screen opens. */
export function trackTenjinPaywallView(source?: string): void {
  try {
    _tenjinEvent('view_paywall');
    _logFirebase('View Paywall', { category: 'paywall', source });
  } catch (e) {
    console.warn('[Tenjin] Failed to track paywall view:', e);
  }
}

/** Paywall: dismissed without a successful subscribe. */
export function trackTenjinPaywallDismiss(opts?: {
  source?: string;
  plan?: 'yearly' | 'monthly' | string;
  timeOnScreenSeconds?: number;
}): void {
  try {
    _tenjinEvent('dismiss_paywall');
    const custom: Record<string, unknown> = {};
    if (opts?.source) custom.source = opts.source;
    if (typeof opts?.timeOnScreenSeconds === 'number') {
      custom.time_on_screen_seconds = opts.timeOnScreenSeconds;
    }
    _logFirebase('Dismiss Paywall', { category: 'paywall', label: opts?.plan, ...custom });
  } catch (e) {
    console.warn('[Tenjin] Failed to track paywall dismiss:', e);
  }
}

/** Paywall: user tapped a purchase button (before the StoreKit sheet). */
export function trackTenjinPaywallClick(subscriptionType: string): void {
  try {
    _tenjinEvent('click_paywall_button');
    _logFirebase('Click Paywall Button', { category: 'paywall', label: subscriptionType });
  } catch (e) {
    console.warn('[Tenjin] Failed to track paywall click:', e);
  }
}

/**
 * Subscribe: fired after a successful purchase.
 *
 * Sends to BOTH:
 *   - Tenjin transaction API (productName + currencyCode + quantity +
 *     unitPrice) so Tenjin's revenue dashboard and ad-network postbacks
 *     can attribute spend to the right install.
 *   - Firebase `purchase` event (value + currency) so Google Ads picks
 *     it up via the standard ecommerce schema.
 */
export function trackTenjinSubscribe(params: {
  value: number;
  currency?: string;
  productId?: string;
  plan?: string;
}): void {
  try {
    // Tenjin revenue is handled server-side via the RevenueCat → Tenjin
    // integration (see note above). Here we only mirror to Firebase /
    // GA4 — that pipeline drives Google Ads conversion optimization and
    // is independent of the MMP.
    _logFirebase('purchase', {
      value: params.value,
      currency: params.currency ?? 'USD',
      product_id: params.productId,
      plan: params.plan,
    });
  } catch (e) {
    console.warn('[Tenjin] Failed to track subscribe:', e);
  }
}

/**
 * Initialize App Open tracking.
 *
 * Tenjin's SDK auto-tracks sessions via `connect()` in AppDelegate, so this
 * helper now only fires the JS-side `app_open_js` Firebase event — useful
 * for cold-vs-warm start analytics in GA4. Subsequent calls no-op.
 */
let _tenjinAppOpenInitialized = false;
export async function initTenjinAppOpenTracking(): Promise<void> {
  if (_tenjinAppOpenInitialized) return;
  _tenjinAppOpenInitialized = true;
  try {
    trackTenjinAppOpen({ cold_start: true });
    const { App } = await import('@capacitor/app');
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) trackTenjinAppOpen({ cold_start: false });
    });
    console.log('[Tenjin] App Open tracking initialized');
  } catch (e) {
    console.warn('[Tenjin] Failed to init app-open tracking:', e);
  }
}

/** Sign Up: ONCE per new account, regardless of method. */
export function trackTenjinSignUp(
  method: 'email' | 'apple' | 'google' | string,
): void {
  try {
    _tenjinEvent('sign_up');
    _logFirebase('sign_up', { method });
  } catch (e) {
    console.warn('[Tenjin] Failed to track sign up:', e);
  }
}

/** Sign In: returning users on successful session start. */
export function trackTenjinSignIn(
  method: 'email' | 'apple' | 'google' | string,
): void {
  try {
    _tenjinEvent('sign_in');
    // Use Firebase reserved `login` event so audiences/funnels match
    // Google's recommended schema.
    _logFirebase('login', { method });
  } catch (e) {
    console.warn('[Tenjin] Failed to track sign in:', e);
  }
}

/** App Open: cold or warm. */
export function trackTenjinAppOpen(opts?: { cold_start?: boolean }): void {
  try {
    // NOTE: Tenjin SDK auto-tracks app opens via connect(). We don't fire
    // a custom event here to avoid double-counting. Firebase's auto
    // `app_open` covers the GA4 side; this `app_open_js` mirror keeps the
    // cold_start dimension for our own analytics.
    _logFirebase('app_open_js', { cold_start: !!opts?.cold_start });
  } catch (e) {
    console.warn('[Tenjin] Failed to track app open:', e);
  }
}

/** Onboarding: user finished the last onboarding step. */
export function trackTenjinOnboardingComplete(durationSeconds?: number): void {
  try {
    _tenjinEvent('tutorial_complete', durationSeconds);
    _logFirebase('tutorial_complete', { duration_seconds: durationSeconds });
  } catch (e) {
    console.warn('[Tenjin] Failed to track onboarding complete:', e);
  }
}

/**
 * First Practice Complete: magic-moment activation event. Fires ONLY the
 * first time a user validly completes any practice — ever. Idempotent
 * via a localStorage flag (kept under the original `onda_airbridge_…` key
 * so users who upgraded mid-flight don't re-fire the event).
 */
const FIRST_PRACTICE_FLAG = 'onda_airbridge_first_practice_tracked';
export function trackTenjinFirstPracticeComplete(
  practiceName: string | undefined | null,
  opts?: { surface?: 'basic' | 'adaptive' },
): void {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(FIRST_PRACTICE_FLAG) === '1') return;
    if (typeof localStorage !== 'undefined') localStorage.setItem(FIRST_PRACTICE_FLAG, '1');
    const label = (practiceName ?? '').toString();
    const surface = opts?.surface ?? 'basic';
    _tenjinEvent('first_practice_complete');
    _logFirebase('first_practice_complete', { label, surface });
  } catch (e) {
    console.warn('[Tenjin] Failed to track first practice complete:', e);
  }
}

/** Permission events. Fired once per system-prompt resolution. */
export function trackTenjinPermission(
  scope: 'healthkit' | 'bluetooth' | 'notifications' | string,
  granted: boolean,
): void {
  try {
    const action =
      scope === 'healthkit'
        ? 'HealthKit Permission'
        : scope === 'bluetooth'
        ? 'Bluetooth Permission'
        : scope === 'notifications'
        ? 'Notifications Permission'
        : `${scope} Permission`;
    _tenjinEvent(_toSnake(action));
    _logFirebase(action, { scope, granted });
  } catch (e) {
    console.warn('[Tenjin] Failed to track permission:', scope, e);
  }
}

/** Watch Connected: first time per session that the paired Apple Watch reports paired+installed. */
export function trackTenjinWatchConnected(watchModel?: string | null): void {
  try {
    _tenjinEvent('watch_connected');
    _logFirebase('watch_connected', { label: watchModel ?? undefined });
  } catch (e) {
    console.warn('[Tenjin] Failed to track watch connected:', e);
  }
}

// Helper: persistent set kept in localStorage, used to dedupe milestone events
// across sessions. Keys are kept under the legacy `onda_airbridge_*` namespace
// so a user who upgrades from a previous build doesn't re-fire milestones.
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

/** Level Unlocked: first time per device that a given level becomes available. */
export function trackTenjinLevelUnlocked(level: number): void {
  try {
    if (_hasMilestoneFired(LEVEL_UNLOCKED_KEY, level)) return;
    _markMilestoneFired(LEVEL_UNLOCKED_KEY, level);
    _tenjinEvent('level_up', level);
    _logFirebase('level_up', { level, label: `level_${level}` });
  } catch (e) {
    console.warn('[Tenjin] Failed to track level unlocked:', e);
  }
}

/** Circuit Complete: fires the first time a user finishes every practice in a circuit. */
export function trackTenjinCircuitComplete(
  circuitId: string | number,
  extra?: { has_artifact?: boolean; practices_count?: number },
): void {
  try {
    if (_hasMilestoneFired(CIRCUIT_COMPLETE_KEY, circuitId)) return;
    _markMilestoneFired(CIRCUIT_COMPLETE_KEY, circuitId);
    _tenjinEvent('circuit_complete');
    _logFirebase('circuit_complete', {
      label: String(circuitId),
      ...(extra ?? {}),
    });
  } catch (e) {
    console.warn('[Tenjin] Failed to track circuit complete:', e);
  }
}

/** Artifact Earned: first time a user persists an artifact for a given circuit. */
export function trackTenjinArtifactEarned(
  circuitId: string | number,
  extra?: { bonus?: number; quality_score?: number },
): void {
  try {
    if (_hasMilestoneFired(ARTIFACT_EARNED_KEY, circuitId)) return;
    _markMilestoneFired(ARTIFACT_EARNED_KEY, circuitId);
    _tenjinEvent('unlock_achievement');
    _logFirebase('unlock_achievement', {
      achievement_id: String(circuitId),
      ...(extra ?? {}),
    });
  } catch (e) {
    console.warn('[Tenjin] Failed to track artifact earned:', e);
  }
}

/**
 * Identify a user. Tenjin doesn't expose a setUserID API in the public
 * iOS SDK (it derives identity from IDFA/IDFV automatically), so this
 * helper now only mirrors to Firebase Analytics — which IS what Google
 * Ads keys off for cross-device join.
 */
export function identifyTenjinUser(params: {
  id?: string;
  email?: string;
  alias?: string;
}): void {
  if (!params.id) return;
  (async () => {
    try {
      const platform = Capacitor.getPlatform();
      if (platform === 'android') {
        const { setUserIdAndroid, isAndroidBridgeAvailable } = await import('./analytics-bridge');
        if (isAndroidBridgeAvailable()) setUserIdAndroid(params.id!);
      } else if (platform === 'ios' && _firebaseReady) {
        await FirebaseAnalytics.setUserId({ userId: params.id! });
      }
      console.log('[Firebase] setUserId mirrored:', params.id);
    } catch (e) {
      console.warn('[Firebase] setUserId mirror failed:', e);
    }
  })();
}
