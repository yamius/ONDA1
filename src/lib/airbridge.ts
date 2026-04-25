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

// Static import — Vite must actually bundle the plugin so it resolves at
// runtime inside the iOS WebView. The previous indirect-string trick
// (`new Function('p', 'return import(p)')(pkgName)`) prevented Vite from
// detecting the dependency, so the import always failed silently and
// every JS-side Firebase event no-op'd. The Capacitor plugin module
// itself does the right thing on web (returns mocks) and on iOS bridges
// to the native FirebaseAnalytics SDK pod that's already in our Podfile.
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';
import OndaAirbridge from '../plugins/ondaAirbridge';

// ─────────────────────────────────────────────────────────────────────────────
// Native Airbridge bridge selector.
//
// On iOS we route every custom event through the OndaAirbridge Capacitor
// plugin → native Airbridge SDK v4 → App Real-time Log under the same IDFA
// as Install/Open. On other platforms we fall back to the Web SDK loaded
// in `index.html`. Without this split, custom events fired through
// `window.airbridge('event', …)` from inside the iOS WebView either never
// flush their queue or land in a separate Web stream that can't be
// stitched to App-stream attribution.
// ─────────────────────────────────────────────────────────────────────────────
const _useNativeAirbridge: boolean =
  Capacitor.getPlatform() === 'ios' && Capacitor.isPluginAvailable('OndaAirbridge');

if (_useNativeAirbridge) {
  console.log('[Airbridge] Using native iOS plugin');
} else {
  console.log('[Airbridge] Using Web SDK fallback (platform:', Capacitor.getPlatform(), ')');
}

// Diagnostic beacon: emit a Firebase event the moment this module loads,
// telling us which Airbridge path is active in this running binary. We use
// Firebase because we already know that pipeline works end-to-end —
// `app_open_js` etc. arrive in Realtime within ~30s. So if we see
// `airbridge_path_native` in Firebase Realtime but no events in the
// Airbridge App Real-time Log, we know the native plugin is registered
// AND being called from JS, but Airbridge.trackEvent isn't delivering.
// If we see `airbridge_path_web`, the plugin failed to register and we're
// falling back to the broken Web SDK path.
//
// Fired here at module-load time (one event per app session, no PII), so
// the user just needs to open the app to make this visible.
(async () => {
  try {
    if (Capacitor.getPlatform() !== 'ios') return;
    const plugins =
      typeof (Capacitor as any).getPlugins === 'function'
        ? Object.keys((Capacitor as any).getPlugins?.() ?? {})
        : [];
    if (typeof FirebaseAnalytics?.logEvent === 'function') {
      await FirebaseAnalytics.logEvent({
        name: _useNativeAirbridge ? 'airbridge_path_native' : 'airbridge_path_web',
        params: {
          platform: Capacitor.getPlatform(),
          // Truncate plugin list to fit Firebase's 100-char string limit.
          registered_plugins: plugins.join(',').slice(0, 100),
        },
      });
    }
  } catch (e) {
    console.warn('[Airbridge] diagnostic beacon failed:', e);
  }
})();

function _sendAirbridge(payload: {
  category: string;
  action?: string;
  label?: string;
  value?: number;
  semanticAttributes?: Record<string, unknown>;
  customAttributes?: Record<string, unknown>;
}): void {
  const { category, action, label, value, semanticAttributes, customAttributes } = payload;

  if (_useNativeAirbridge) {
    OndaAirbridge.trackEvent({
      category,
      action,
      label,
      value,
      semanticAttributes,
      customAttributes,
    }).catch((e) => console.warn('[OndaAirbridge] native trackEvent failed:', e));
    console.log('[Airbridge][native] event:', category, action ?? '', label ?? '');
    return;
  }

  // Web SDK fallback (browser / PWA / web preview).
  try {
    if (typeof window !== 'undefined' && typeof window.airbridge === 'function') {
      const flat: Record<string, unknown> = {
        category,
        ...(action !== undefined ? { action } : {}),
        ...(label !== undefined ? { label } : {}),
        ...(value !== undefined ? { value } : {}),
        ...(customAttributes ?? {}),
      };
      window.airbridge('event', flat);
      console.log('[Airbridge][web] event:', category, action ?? '', label ?? '');
    }
  } catch (e) {
    console.warn('[Airbridge] web SDK send failed:', e);
  }
}

const _firebaseReady: boolean = (() => {
  try {
    // The plugin object exists on every platform; calls just no-op on web.
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

export function trackAirbridgeEvent(
  category: string,
  action: string,
  data?: Record<string, unknown>
): void {
  try {
    _sendAirbridge({ category, action, customAttributes: data });
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
    const label = (practiceName ?? '').toString();
    const surface = opts?.surface ?? 'basic';
    const eventAction =
      surface === 'adaptive' ? `${action} Adaptive Practice` : `${action} Practice`;
    _sendAirbridge({
      category: 'practice',
      action: eventAction,
      label,
      customAttributes: opts?.extra,
    });
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
    const eventAction = `${action} Emotional Check`;
    const label = (emotionName ?? '').toString();
    _sendAirbridge({ category: 'emotional_check', action: eventAction, label });
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
    _sendAirbridge({
      category: 'paywall',
      action: 'View Paywall',
      customAttributes: source ? { source } : undefined,
    });
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
    const custom: Record<string, unknown> = {};
    if (opts?.source) custom.source = opts.source;
    if (typeof opts?.timeOnScreenSeconds === 'number') {
      custom.time_on_screen_seconds = opts.timeOnScreenSeconds;
    }
    _sendAirbridge({
      category: 'paywall',
      action: 'Dismiss Paywall',
      label: opts?.plan,
      customAttributes: Object.keys(custom).length ? custom : undefined,
    });
    _logFirebase('Dismiss Paywall', { category: 'paywall', label: opts?.plan, ...custom });
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
    _sendAirbridge({
      category: 'paywall',
      action: 'Click Paywall Button',
      label: subscriptionType,
    });
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
    const custom: Record<string, unknown> = {
      currency: params.currency ?? 'USD',
    };
    if (params.productId) custom.product_id = params.productId;
    // Use Airbridge semantic attributes for revenue so the Revenue dashboard
    // picks it up automatically (totalValue + currency are reserved keys).
    _sendAirbridge({
      category: 'paywall',
      action: 'Subscribe',
      label: params.plan,
      value: params.value,
      semanticAttributes: {
        totalValue: params.value,
        currency: params.currency ?? 'USD',
      },
      customAttributes: custom,
    });
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
    _sendAirbridge({ category: 'auth', action: 'Sign Up', label: method });
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
    _sendAirbridge({ category: 'auth', action: 'Sign In', label: method });
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
    _sendAirbridge({
      category: 'lifecycle',
      action: 'App Open',
      customAttributes: { cold_start: !!opts?.cold_start },
    });
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
    _sendAirbridge({
      category: 'onboarding',
      action: 'Complete Onboarding',
      customAttributes: typeof durationSeconds === 'number'
        ? { duration_seconds: durationSeconds }
        : undefined,
    });
    // Map to Firebase reserved `tutorial_complete` so the Google Ads
    // recommended-events list lines up out of the box.
    _logFirebase('tutorial_complete', { duration_seconds: durationSeconds });
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
    if (typeof localStorage !== 'undefined' && localStorage.getItem(FIRST_PRACTICE_FLAG) === '1') return;
    if (typeof localStorage !== 'undefined') localStorage.setItem(FIRST_PRACTICE_FLAG, '1');
    const label = (practiceName ?? '').toString();
    const surface = opts?.surface ?? 'basic';
    _sendAirbridge({
      category: 'activation',
      action: 'First Practice Complete',
      label,
      customAttributes: { surface },
    });
    _logFirebase('first_practice_complete', { label, surface });
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
    const action =
      scope === 'healthkit'
        ? 'HealthKit Permission'
        : scope === 'bluetooth'
        ? 'Bluetooth Permission'
        : scope === 'notifications'
        ? 'Notifications Permission'
        : `${scope} Permission`;
    _sendAirbridge({
      category: 'permission',
      action,
      label: granted ? 'granted' : 'denied',
    });
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
    _sendAirbridge({
      category: 'device',
      action: 'Watch Connected',
      label: watchModel ?? undefined,
    });
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
    if (_hasMilestoneFired(LEVEL_UNLOCKED_KEY, level)) return;
    _markMilestoneFired(LEVEL_UNLOCKED_KEY, level);
    _sendAirbridge({
      category: 'progression',
      action: 'Level Unlocked',
      label: `level_${level}`,
      customAttributes: { level },
    });
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
    if (_hasMilestoneFired(CIRCUIT_COMPLETE_KEY, circuitId)) return;
    _markMilestoneFired(CIRCUIT_COMPLETE_KEY, circuitId);
    _sendAirbridge({
      category: 'progression',
      action: 'Circuit Complete',
      label: String(circuitId),
      customAttributes: extra,
    });
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
    if (_hasMilestoneFired(ARTIFACT_EARNED_KEY, circuitId)) return;
    _markMilestoneFired(ARTIFACT_EARNED_KEY, circuitId);
    _sendAirbridge({
      category: 'progression',
      action: 'Artifact Earned',
      label: String(circuitId),
      customAttributes: extra,
    });
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
    if (_useNativeAirbridge) {
      OndaAirbridge.setUserID({ id: params.id ?? null }).catch((e) =>
        console.warn('[OndaAirbridge] native setUserID failed:', e),
      );
      if (params.email) {
        OndaAirbridge.setUserEmail({ email: params.email }).catch((e) =>
          console.warn('[OndaAirbridge] native setUserEmail failed:', e),
        );
      }
      if (params.alias) {
        // Treat the alias string as a generic key/value pair under the
        // 'alias' key — if callers later need a richer schema we'll extend.
        OndaAirbridge.setUserAlias({ key: 'alias', value: params.alias }).catch((e) =>
          console.warn('[OndaAirbridge] native setUserAlias failed:', e),
        );
      }
      console.log('[Airbridge][native] User identified:', params.id);
    } else if (typeof window !== 'undefined' && typeof window.airbridge === 'function') {
      window.airbridge('setUserID', params.id ?? null);
      if (params.email) window.airbridge('setUserEmail', params.email);
      if (params.alias) window.airbridge('setUserAlias', params.alias);
      console.log('[Airbridge][web] User identified:', params.id);
    }
    // Mirror the userId to Firebase Analytics so cross-device & ad attribution
    // joins line up. Fire-and-forget (does not block Airbridge).
    if (params.id) {
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

      _sendAirbridge({
        category: 'airbridge',
        action: 'app_open',
        label: url,
        customAttributes: { deeplink: url, ...params },
      });

      console.log('[Airbridge] Deep link forwarded to SDK, params:', params);
    } catch (e) {
      console.warn('[Airbridge] Failed to parse deep link URL:', url, e);
    }
  });

  console.log('[Airbridge] Deep link handler initialized');
}
