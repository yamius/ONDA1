/**
 * OneSignal push-notification service for ONDA.
 *
 * Why this exists alongside src/services/notifications.ts:
 *  - notifications.ts owns LOCAL notifications (daily reminder, streak
 *    nudge, lapsed-user series). Scheduled on-device, work offline,
 *    don't need a server.
 *  - pushNotifications.ts owns REMOTE pushes via OneSignal. Server
 *    decides who gets what. Required for:
 *      • content announcements (new practice in Part 7);
 *      • personalized milestones (1 day from artifact X);
 *      • re-engagement segments (haven't opened in 14 days);
 *      • promotional campaigns (Black Friday — opt-in only).
 *
 * Apple compliance:
 *  - Service/transactional pushes flow under the base iOS notification
 *    permission. No separate consent needed.
 *  - Promotional pushes MUST be explicit opt-in. We honour this with
 *    a `marketing_optin` tag (default false). Server-side Edge Function
 *    filters by this tag before sending anything classified as
 *    promotional, so a mis-tag in the dashboard can't accidentally spam
 *    users who didn't agree.
 *
 * No-op on web / Android until the platform is added in a later sprint.
 */

import { Capacitor } from '@capacitor/core';

// OneSignal Cordova plugin attaches a global `window.cordova.plugins.OneSignal`
// at runtime on native. We access it via a thin getter so TypeScript doesn't
// scream about missing type definitions and so the module is safe to import
// in environments where the plugin isn't present.
function oneSignal(): any | null {
  if (!Capacitor.isNativePlatform()) return null;
  // The plugin attaches itself differently depending on bundler. Try the
  // common locations in order.
  const w = window as any;
  return (
    w.plugins?.OneSignal ||
    w.cordova?.plugins?.OneSignal ||
    w.OneSignal ||
    null
  );
}

const ONESIGNAL_APP_ID = '9b019431-372e-4adb-9d85-e1d0f4010433';

const LS_MARKETING_OPTIN = 'onda_push_marketing_optin';
const LS_INITIALIZED = 'onda_push_initialized';

let initialized = false;

/**
 * One-shot OneSignal SDK bootstrap. Call once on app boot AFTER ATT has
 * been answered (we want consent state captured first so the SDK doesn't
 * collect anything pre-consent).
 *
 *  - Initialises the SDK with our App ID.
 *  - Does NOT request notification permission — that's already handled
 *    by the onboarding screen 2 → 3 transition via @capacitor/local-
 *    notifications. iOS uses one binary permission for both layers, so
 *    OneSignal will receive the same answer.
 */
export function initOneSignal(): void {
  if (initialized) return;
  const os = oneSignal();
  if (!os) {
    console.log('[push] OneSignal plugin unavailable (platform:', Capacitor.getPlatform(), ')');
    return;
  }

  try {
    // Privacy: don't collect anything until consent (ATT result) is in.
    // The SDK queues events; once `setConsentGiven(true)` fires they flush.
    if (typeof os.setConsentRequired === 'function') os.setConsentRequired(true);
    if (typeof os.setConsentGiven === 'function') os.setConsentGiven(true);

    os.initialize(ONESIGNAL_APP_ID);
    initialized = true;
    localStorage.setItem(LS_INITIALIZED, 'true');
    console.log('[push] OneSignal initialized with app id', ONESIGNAL_APP_ID);

    // IMPORTANT: do NOT call registerOneSignalSubscription() here.
    // OneSignal's requestPermission() prompts iOS when status is
    // notDetermined — on a fresh install that surfaces the system
    // sheet immediately after launch, before the user can even read
    // onboarding screen 1. The previous build did exactly that.
    //
    // Permission requests live in two places only:
    //   1. Onboarding screen 2 → 3 transition (fresh install path).
    //   2. registerIfAlreadyGranted() below, called from the main
    //      component AFTER it confirms iOS permission is granted
    //      (2nd+ cold start path).
  } catch (e) {
    console.warn('[push] OneSignal init failed', e);
  }
}

/**
 * Register the OneSignal subscription ONLY if iOS notification permission
 * is already granted. Safe to call on every cold start — won't prompt the
 * user, because we gate on the current permission state first.
 *
 * Used by the main component's boot useEffect for 2nd+ cold-start paths
 * where onboarding doesn't run again.
 */
export async function registerIfAlreadyGranted(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    // Dynamic import so we don't ship the plugin to web bundles.
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { display } = await LocalNotifications.checkPermissions();
    if (display === 'granted') {
      registerOneSignalSubscription();
    }
  } catch (e) {
    console.warn('[push] registerIfAlreadyGranted check failed', e);
  }
}

/**
 * Tell the OneSignal SDK to register the device as a push subscriber.
 *
 * MUST be called AFTER iOS notification permission is granted (either
 * via our @capacitor/local-notifications prompt in onboarding screen 2
 * or via a manual toggle in Settings). On iOS this never re-shows the
 * system prompt — Apple only displays it once. The call is what flips
 * the user from 'unsubscribed' to 'subscribed' inside OneSignal so the
 * dashboard can target them.
 *
 * Idempotent: safe to call multiple times. The native plugin guards
 * against double registration.
 */
export function registerOneSignalSubscription(): void {
  const os = oneSignal();
  if (!os) return;
  try {
    // SDK 5.x: OneSignal.Notifications.requestPermission(fallbackToSettings, callback)
    if (os.Notifications && typeof os.Notifications.requestPermission === 'function') {
      os.Notifications.requestPermission(false, (accepted: boolean) => {
        console.log('[push] OneSignal subscription registered, accepted=', accepted);
      });
      return;
    }
    // SDK 5.x alt path: explicitly opt-in the push subscription.
    if (os.User?.pushSubscription && typeof os.User.pushSubscription.optIn === 'function') {
      os.User.pushSubscription.optIn();
      console.log('[push] OneSignal pushSubscription.optIn() called');
      return;
    }
    // Legacy v4 fallback — older Cordova plugin builds expose this name.
    if (typeof os.registerForPushNotifications === 'function') {
      os.registerForPushNotifications();
      console.log('[push] OneSignal legacy registerForPushNotifications() called');
    }
  } catch (e) {
    console.warn('[push] registerOneSignalSubscription failed', e);
  }
}

/**
 * Link the device to an authenticated Supabase user. Call right after
 * a successful login. OneSignal uses external_user_id to attribute
 * pushes — server-side sends can target user.id directly.
 *
 * For anonymous (free-tier) users we don't call this — OneSignal's
 * internal subscription_id is enough for device-level targeting.
 */
export function linkUserToOneSignal(supabaseUserId: string): void {
  const os = oneSignal();
  if (!os || !supabaseUserId) return;
  try {
    // SDK 5.x API: OneSignal.login(externalId)
    if (typeof os.login === 'function') {
      os.login(supabaseUserId);
    } else if (os.User && typeof os.User.login === 'function') {
      os.User.login(supabaseUserId);
    }
    console.log('[push] linked OneSignal user →', supabaseUserId);
  } catch (e) {
    console.warn('[push] linkUserToOneSignal failed', e);
  }
}

/** Inverse of linkUserToOneSignal — fires on logout. */
export function unlinkUser(): void {
  const os = oneSignal();
  if (!os) return;
  try {
    if (typeof os.logout === 'function') {
      os.logout();
    } else if (os.User && typeof os.User.logout === 'function') {
      os.User.logout();
    }
    console.log('[push] OneSignal logout');
  } catch (e) {
    console.warn('[push] unlinkUser failed', e);
  }
}

/**
 * Toggle the marketing-opt-in flag on the OneSignal user. The server-side
 * Edge Function uses this tag to filter audience for promotional sends.
 *
 *  - true  → user consents to promo pushes (Settings toggle ON)
 *  - false → service-only (default; Apple compliance for marketing)
 */
export function setMarketingOptIn(enabled: boolean): void {
  localStorage.setItem(LS_MARKETING_OPTIN, enabled ? 'true' : 'false');
  const os = oneSignal();
  if (!os) return;
  try {
    const tag = { marketing_optin: enabled ? 'true' : 'false' };
    // SDK 5.x: OneSignal.User.addTags({...}) — fall back to legacy sendTags if needed.
    if (os.User && typeof os.User.addTags === 'function') {
      os.User.addTags(tag);
    } else if (typeof os.sendTags === 'function') {
      os.sendTags(tag);
    }
    console.log('[push] marketing_optin →', enabled);
  } catch (e) {
    console.warn('[push] setMarketingOptIn failed', e);
  }
}

export function getMarketingOptIn(): boolean {
  return localStorage.getItem(LS_MARKETING_OPTIN) === 'true';
}

/**
 * Hook for analytics: fires when a user taps a push notification we sent.
 * Wire on app boot; the handler receives the full notification object
 * (with our `extra` payload — `kind`, `copy_variant_id`, etc.) so we can
 * attribute opens for A/B testing.
 *
 * Returns an unsubscribe function (no-op on web/Android until parity).
 */
export function onPushOpened(cb: (info: { kind?: string; data?: any }) => void): () => void {
  const os = oneSignal();
  if (!os) return () => {};
  try {
    const handler = (event: any) => {
      const data = event?.notification?.additionalData || {};
      cb({ kind: data.kind, data });
    };
    // SDK 5.x: OneSignal.Notifications.addEventListener('click', cb)
    if (os.Notifications && typeof os.Notifications.addEventListener === 'function') {
      os.Notifications.addEventListener('click', handler);
      return () => {
        try { os.Notifications.removeEventListener('click', handler); } catch {}
      };
    }
    // Legacy fallback
    if (typeof os.setNotificationOpenedHandler === 'function') {
      os.setNotificationOpenedHandler(handler);
    }
  } catch (e) {
    console.warn('[push] onPushOpened wiring failed', e);
  }
  return () => {};
}
