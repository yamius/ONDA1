/**
 * Analytics Service for ONDA
 * 
 * Handles event tracking with offline queue support.
 * Events are stored locally if offline and synced when connection is restored.
 */

import { supabase } from '../lib/supabase';
import { Capacitor } from '@capacitor/core';
// Static import — Vite bundles the plugin so it actually resolves at runtime
// inside the iOS WebView. The plugin object exists on every platform;
// FirebaseAnalytics.logEvent on web is a no-op, on iOS it bridges to the
// native Firebase pod, on Android we use our own analytics-bridge instead.
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

// Event types for type safety.
//
// CANON (cleanup 2026-06-13): ONE name per action, object_action snake_case.
// This typed enum is the single guard that keeps Firebase/GA4 event names from
// diverging again — every Firebase event flows through track() and must be a
// member here. Tenjin NATIVE sends (Axon/MMP attribution) keep their own pooled
// action_object names inside src/lib/tenjin.ts and are intentionally NOT in this
// list. Reserved Firebase auto-events (first_open, session_start, screen_view,
// purchase is ours-ecommerce) are never emitted from here except `purchase`.
export type AnalyticsEventName =
  // Onboarding & Activation
  | 'app_open'
  | 'home_view'                       // main hub shown — params: source (first_run|menu|relaunch), is_first. first_run = reached home after the onboarding paywall WITHOUT buying (closes the post-paywall funnel blind spot)
  | 'onboarding_start'                // params: source (first_run|menu), [att_copy_variant|featured_practice_id]
  | 'onboarding_step'                 // params: source (menu), step, total, permission — 3-screen tutorial only
  | 'onboarding_complete'            // params: source, [completed_via: cta|skip] — ← was Tenjin `tutorial_complete`
  // first_run_welcome_* folded into the onboarding_* funnel: the live one-screen
  // first-run view = onboarding_start{source:'first_run'}, its cta/skip outcome =
  // onboarding_complete{completed_via}. The 3-screen tutorial (Menu→Intro) emits
  // the same events with source:'menu' so manual replays don't pollute the funnel.
  | 'first_practice_complete'         // value-moment; first-ever valid completion
  | 'results_view'                    // post-practice results screen shown — params: metrics_source, time_percent, result_state (A|B|C), [hr_start, hr_min], is_first
  | 'sign_up'
  | 'sign_in'
  // Permissions
  | 'health_permission'              // params: scope, granted (← Tenjin `healthkit_permission`)
  | 'att_prompt_result'
  | 'notification_prompt_result'
  | 'onboarding_permission_screen_view'
  | 'watch_connection_attempt'
  | 'watch_connect_tapped'           // tapped the home "connect watch" CTA, BEFORE the permission prompt — params: source. Measures reach→intent for the baseline-from-Health flow (distinct from watch_connect_success, which fires on an actual connection).
  | 'watch_connect_success'          // ← was watch_connection_success / Tenjin watch_connected
  | 'watch_connection_failed'
  // Practice — variety lives in PARAMS (practice_type=standard|adaptive, practice_id),
  // never in the name. abandon = stop/close mid-flow.
  | 'practice_start'
  | 'practice_pause'
  | 'practice_resume'
  | 'practice_complete'
  | 'practice_abandon'               // ← stop/close (params: practice_type, practice_id, reason)
  // Biometrics
  | 'heart_rate_received'
  | 'biometric_sync_success'
  | 'biometric_sync_failed'
  // Baseline (retention — Health-baseline onboarding)
  | 'baseline_shown'                 // baseline card shown — params: coverage_days (real days behind the numbers), source (watch|camera). Declared now; fired in Phase 2.
  // Gamification
  | 'ond_earned'
  | 'artifact_unlocked'
  | 'level_up'
  // Paywall / Monetization
  | 'paywall_view'                   // ← merge paywall_viewed + Tenjin view_paywall
  | 'paywall_dismiss'                // ← Tenjin dismiss_paywall
  | 'paywall_cta_tap'                // ← was trial_attempt / Tenjin click_paywall_button
  | 'paywall_auth_required'
  | 'trial_start'                    // ← was trial_started (one, not two)
  | 'purchase'                       // Firebase ecommerce — params: value, currency, product_id, plan
  | 'purchase_failed'
  | 'purchase_cancelled'
  // Reviews
  | 'review_prompt_requested'        // SKStoreReview dispatched (Apple hides the actual dialog)
  // Errors
  | 'error'
  | 'audio_load_error'
  | 'api_error'
  // Diagnostics — dev-gated, dropped in prod (see ANALYTICS_DEBUG)
  | 'practice_intro_closed_debug'
  | 'app_crash_suspected'
  | 'resource_snapshot';

/**
 * Diagnostics gate. When false (prod), the noisy diagnostic events
 * (practice_intro_closed_debug, resource_snapshot, and the practice-view crash
 * marker) are dropped before they reach Firebase/Supabase — they were leaking
 * ~214 events/build into GA4 and burying the funnel. Flip to true locally to
 * re-enable while debugging the iOS WebView OOM pattern.
 */
const ANALYTICS_DEBUG = false;

export interface AnalyticsEvent {
  event_name: AnalyticsEventName;
  metadata?: Record<string, unknown>;
  timestamp?: number;
}

interface StoredEvent extends AnalyticsEvent {
  id: string;
  timestamp: number;
}

const QUEUE_KEY = 'onda_analytics_queue';
const SESSION_KEY = 'onda_session_id';
const ANONYMOUS_ID_KEY = 'onda_anonymous_id';
// Internal-traffic marker (own TestFlight/store runs on our own devices).
// Set once per device via the hidden toggle (7 taps on the version line in
// Menu); read on every launch and mirrored into Firebase as a USER PROPERTY.
const INTERNAL_KEY = 'onda_internal_traffic';

// ─────────────────────────────────────────────────────────────────────────────
// Firebase mirror.
//
// Every event tracked through this service is also fired into Firebase
// Analytics (and from there into GA4 → Google Ads conversions). Until this
// commit, AnalyticsService.track() only wrote to Supabase, so GA4's "key
// events" list filled up with `No stream data detected` for every custom
// event the app emits. Mirroring here puts every track() call onto both
// pipelines.
//
// iOS    → @capacitor-community/firebase-analytics → native Firebase pod.
// Android → src/lib/analytics-bridge.ts (existing native bridge).
// Web    → FirebaseAnalytics.logEvent is a no-op stub.
//
// Naming: GA4 event names must be snake_case, ≤ 40 chars; param string
// values are clamped to 100 chars and nullish values dropped.
// ─────────────────────────────────────────────────────────────────────────────

const _firebaseReady: boolean = (() => {
  try {
    return typeof FirebaseAnalytics?.logEvent === 'function';
  } catch {
    return false;
  }
})();

function _toSnake(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
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

function _mirrorToFirebase(eventName: string, metadata?: Record<string, unknown>): void {
  // Fire-and-forget — Firebase delivery must never block analytics.track()
  // or the offline queue path.
  (async () => {
    try {
      const name = _toSnake(eventName);
      const safeParams = _sanitizeFirebaseParams(metadata);
      const platform = Capacitor.getPlatform();
      if (platform === 'android') {
        const { trackEventAndroid, isAndroidBridgeAvailable } = await import(
          '../lib/analytics-bridge'
        );
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

/**
 * Set a Firebase USER property (iOS plugin / Android bridge; no-op on web).
 *
 * User properties — not event params — are the only way to mark traffic the
 * app itself never emits: `first_open` (the first step of the activation
 * funnel), `session_start` and `screen_view` are auto-collected by the native
 * Firebase SDK and never pass through track(). A user property is attached by
 * the SDK to every event, auto-collected ones included, so one call marks the
 * whole stream instead of every call site.
 */
function _setUserProperty(name: string, value: string): void {
  // Fire-and-forget — never block or throw into the analytics path.
  (async () => {
    try {
      const platform = Capacitor.getPlatform();
      if (platform === 'android') {
        const { setUserPropertyAndroid, isAndroidBridgeAvailable } = await import(
          '../lib/analytics-bridge'
        );
        if (isAndroidBridgeAvailable()) setUserPropertyAndroid(name, value);
      } else if (platform === 'ios' && _firebaseReady) {
        await FirebaseAnalytics.setUserProperty({ name, value });
        console.log('[Firebase][ios] User property set:', name, '=', value);
      }
    } catch (e) {
      console.warn('[Firebase] setUserProperty failed:', name, e);
    }
  })();
}

/**
 * Analytics readiness check — called once from main.tsx after first paint.
 *
 * Firebase's native SDK auto-initializes from GoogleService-Info.plist /
 * google-services.json, so there is nothing to "start" from JS; this only
 * logs which pipeline is live. Kept as a named export because main.tsx
 * awaits it — it absorbs the only live function of the old, now-deleted
 * standalone `services/analytics.ts` (whose other exports were dead code,
 * including a `trackEvent` that wrote to non-existent app_events columns).
 */
export async function initializeAnalytics(): Promise<void> {
  // Re-assert the internal-traffic user property on every launch, so the
  // marker survives a Firebase reset and is visible from the first event of
  // the session onward.
  analytics.applyInternalTrafficProperty();
  const platform = Capacitor.getPlatform();
  if (!Capacitor.isNativePlatform()) {
    console.log('[Analytics] Web — Firebase unavailable; Supabase app_events still active');
    return;
  }
  if (platform === 'android') {
    const { isAndroidBridgeAvailable } = await import('../lib/analytics-bridge');
    console.log(
      isAndroidBridgeAvailable()
        ? '[Analytics] Firebase ready (Android native bridge)'
        : '[Analytics] Android bridge unavailable — Firebase events will no-op',
    );
    return;
  }
  console.log(
    _firebaseReady
      ? '[Analytics] Firebase ready (iOS Capacitor plugin)'
      : '[Analytics] Firebase plugin unavailable — events will no-op',
  );
}

class AnalyticsService {
  private sessionId: string;
  private anonymousId: string;
  private platform: 'ios' | 'android' | 'web';
  private appVersion: string;
  private isOnline: boolean = true;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private utmParams: { source?: string; medium?: string; campaign?: string } = {};
  private internal: boolean = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.anonymousId = this.getOrCreateAnonymousId();
    this.platform = this.detectPlatform();
    // NOTE: this is the CI run number (VITE_BUILD_NUMBER = github.run_number),
    // not the marketing version — it only feeds the Supabase app_events column.
    // GA4 cohort analysis uses Firebase's own built-in `appVersion` dimension.
    this.appVersion = import.meta.env.VITE_BUILD_NUMBER || 'dev';
    this.internal = this.readInternalFlag();
    
    // Listen for online/offline
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
      this.isOnline = navigator.onLine;
    }

    // Start periodic flush
    this.startPeriodicFlush();
    
    // Extract UTM params from URL on web
    this.extractUtmParams();
  }

  private readInternalFlag(): boolean {
    try {
      return localStorage.getItem(INTERNAL_KEY) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Push the internal-traffic marker into Firebase as a user property.
   *
   * Called on every launch (from initializeAnalytics) and again whenever the
   * toggle flips. Always sends an explicit 'true'/'false' rather than only
   * marking internal devices: an explicit value makes it visible in GA4
   * DebugView that the wiring works at all, which is exactly what the
   * `internal: only` mode in the MCP tool is meant to verify.
   *
   * MCP contract: a device counts as EXTERNAL when the property is 'false'
   * OR absent — everything recorded before this shipped carries no property
   * at all. Only an explicit 'true' means internal.
   */
  applyInternalTrafficProperty(): void {
    _setUserProperty('internal', this.internal ? 'true' : 'false');
  }

  /** Is this device marked as internal (our own runs)? */
  isInternalTraffic(): boolean {
    return this.internal;
  }

  /**
   * Flip the internal-traffic marker for this device (hidden toggle).
   *
   * Honest boundary: this marks events from here on. Anything already in GA4
   * — including our own TestFlight runs recorded before this shipped — cannot
   * be separated retroactively. Reinstalling also clears localStorage, so that
   * install's `first_open` lands unmarked before the toggle can be flipped.
   */
  setInternalTraffic(on: boolean): boolean {
    this.internal = on;
    try {
      // Always an explicit value — never remove the key. Clearing it would
      // leave the Firebase property at 'true' until the next launch: a device
      // silently excluded from the funnel it believes it has rejoined.
      localStorage.setItem(INTERNAL_KEY, on ? 'true' : 'false');
    } catch {
      // storage unavailable — the property still applies for this session
    }
    this.applyInternalTrafficProperty();
    console.log('[Analytics] Internal traffic:', on ? 'ON' : 'OFF');
    return this.internal;
  }

  private detectPlatform(): 'ios' | 'android' | 'web' {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') return 'ios';
    if (platform === 'android') return 'android';
    return 'web';
  }

  private getOrCreateSessionId(): string {
    // Session expires after 30 minutes of inactivity
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      return stored;
    }
    const newId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, newId);
    return newId;
  }

  private getOrCreateAnonymousId(): string {
    const stored = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (stored) {
      return stored;
    }
    const newId = crypto.randomUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, newId);
    return newId;
  }

  private extractUtmParams(): void {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    this.utmParams = {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
    };

    // Store for later if present
    if (this.utmParams.source) {
      localStorage.setItem('onda_utm_params', JSON.stringify(this.utmParams));
    } else {
      // Try to restore from storage
      const storedUtm = localStorage.getItem('onda_utm_params');
      if (storedUtm) {
        this.utmParams = JSON.parse(storedUtm);
      }
    }
  }

  private getQueue(): StoredEvent[] {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: StoredEvent[]): void {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      // Storage full - remove oldest events
      console.warn('[Analytics] Storage full, clearing old events');
      const trimmed = queue.slice(-50);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed));
    }
  }

  private addToQueue(event: AnalyticsEvent): void {
    const queue = this.getQueue();
    const storedEvent: StoredEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: event.timestamp || Date.now(),
    };
    queue.push(storedEvent);
    this.saveQueue(queue);
  }

  private async flushQueue(): Promise<void> {
    if (!this.isOnline) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    // Process in batches of 10
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < queue.length; i += batchSize) {
      batches.push(queue.slice(i, i + batchSize));
    }

    const successfulIds: string[] = [];

    for (const batch of batches) {
      const records = batch.map(event => ({
        user_id: userId || null,
        anonymous_id: this.anonymousId,
        session_id: this.sessionId,
        event_name: event.event_name,
        platform: this.platform,
        app_version: this.appVersion,
        // Same internal marker as the Firebase user property, so the Supabase
        // pipeline stays filterable too. Rides in metadata — no schema change.
        metadata: { ...(event.metadata || {}), internal: this.internal },
        utm_source: this.utmParams.source,
        utm_medium: this.utmParams.medium,
        utm_campaign: this.utmParams.campaign,
        created_at: new Date(event.timestamp).toISOString(),
      }));

      const { error } = await supabase.from('app_events').insert(records);
      
      if (!error) {
        successfulIds.push(...batch.map(e => e.id));
      } else {
        console.error('[Analytics] Failed to flush batch:', error);
        // Permission/RLS error (42501) — events will never succeed, discard them
        if (error.code === '42501') {
          successfulIds.push(...batch.map(e => e.id));
          console.warn('[Analytics] RLS policy blocked insert — discarding batch. Fix app_events INSERT policy in Supabase.');
        }
      }
    }

    // Remove successful events from queue
    if (successfulIds.length > 0) {
      const remainingQueue = queue.filter(e => !successfulIds.includes(e.id));
      this.saveQueue(remainingQueue);
      console.log(`[Analytics] Flushed ${successfulIds.length} events`);
    }
  }

  private startPeriodicFlush(): void {
    // Flush every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushQueue();
    }, 30000);
  }

  /**
   * Track an analytics event
   */
  async track(eventName: AnalyticsEventName, metadata?: Record<string, unknown>): Promise<void> {
    const event: AnalyticsEvent = {
      event_name: eventName,
      metadata,
      timestamp: Date.now(),
    };

    console.log(`[Analytics] Track: ${eventName}`, metadata);

    // Diagnostics gate: in prod, drop the dev-only diagnostic events entirely
    // so they never reach Firebase/Supabase (they leaked ~214 events/build into
    // GA4 and buried the funnel). Flip ANALYTICS_DEBUG to re-enable locally.
    if (!ANALYTICS_DEBUG && (eventName === 'practice_intro_closed_debug' || eventName === 'resource_snapshot')) {
      return;
    }

    // Mirror to Firebase Analytics so the same event flows into GA4 and is
    // available as a Google Ads conversion. Fire-and-forget, never blocks
    // the Supabase write path below.
    _mirrorToFirebase(eventName, metadata);

    // Resource-snapshot diagnostics (dev only): correlate memory growth with the
    // iOS WebView OOM crash pattern. Keyed on practice_start (practice_view retired).
    if (ANALYTICS_DEBUG && eventName === 'practice_start') {
      try {
        const { snapshotResources } = await import('./resourceTracker');
        const snap = snapshotResources();
        this.track('resource_snapshot', {
          at_event: eventName,
          practice_id: (metadata as any)?.practice_id ?? (metadata as any)?.practiceId ?? null,
          ...snap,
        }).catch(() => {});
      } catch (e) {
        // tracker import failed — non-critical
      }
    }

    // Crash-detector marker: set when a practice STARTS. If the app dies (iOS
    // WebView OOM-kill) before it completes/abandons, the next app_open detects
    // the stale marker and emits app_crash_suspected.
    if (eventName === 'practice_start') {
      // Lifetime attempts, used by the hard paywall to report WHICH practice a
      // user is blocked on. Kept here because every practice start funnels
      // through track(), so no call site can forget it.
      try {
        const { recordPracticeStart } = await import('../lib/lifecycleMarkers');
        recordPracticeStart();
      } catch (e) {
        /* marker is best-effort */
      }
      try {
        const sessionCountStr = localStorage.getItem('onda_session_practice_count') || '0';
        const newCount = parseInt(sessionCountStr, 10) + 1;
        localStorage.setItem('onda_session_practice_count', String(newCount));
        localStorage.setItem(
          'onda_last_practice_view',
          JSON.stringify({
            practiceId: (metadata as any)?.practice_id ?? null,
            ts: Date.now(),
            sessionPracticeCount: newCount,
            sessionId: this.sessionId,
          })
        );
      } catch (e) {
        // ignore storage errors
      }
    }

    // Clear the marker once the practice resolves (completed or abandoned).
    if (eventName === 'practice_complete' || eventName === 'practice_abandon') {
      try {
        localStorage.removeItem('onda_last_practice_view');
      } catch (e) {}
    }

    if (this.isOnline) {
      // Try to send immediately
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      const { error } = await supabase.from('app_events').insert({
        user_id: userId || null,
        anonymous_id: this.anonymousId,
        session_id: this.sessionId,
        event_name: eventName,
        platform: this.platform,
        app_version: this.appVersion,
        // Marked after _mirrorToFirebase above, so GA4 event params stay clean
        // (GA4 gets the marker as a user property instead).
        metadata: { ...(metadata || {}), internal: this.internal },
        utm_source: this.utmParams.source,
        utm_medium: this.utmParams.medium,
        utm_campaign: this.utmParams.campaign,
      });

      if (error) {
        // Permission/RLS error (42501) — will never succeed, don't queue
        if (error.code === '42501') {
          console.warn('[Analytics] RLS policy blocked insert — skipping queue. Fix app_events INSERT policy in Supabase.');
        } else {
          console.warn('[Analytics] Failed to track, queueing:', error);
          this.addToQueue(event);
        }
      }
    } else {
      // Offline - queue for later
      this.addToQueue(event);
    }
  }

  /**
   * Track practice-specific events with standard metadata
   */
  trackPractice(
    action: 'start' | 'pause' | 'resume' | 'complete' | 'abandon',
    practiceId: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const eventName = `practice_${action}` as AnalyticsEventName;
    return this.track(eventName, {
      practice_id: practiceId,
      ...metadata,
    });
  }

  /**
   * Track errors with context
   */
  trackError(errorType: string, message: string, context?: Record<string, unknown>): Promise<void> {
    return this.track('error', {
      error_type: errorType,
      message,
      ...context,
    });
  }

  /**
   * Identify user after sign-in (links anonymous events to user)
   */
  async identify(userId: string): Promise<void> {
    // Update all queued events with the user ID
    await this.track('sign_in', { linked_anonymous_id: this.anonymousId });
    
    // Flush to ensure events are linked
    await this.flushQueue();
  }

  /**
   * Reset session (e.g., on sign-out)
   */
  resetSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.sessionId = this.getOrCreateSessionId();
  }

  /**
   * Force flush all queued events
   */
  async flush(): Promise<void> {
    await this.flushQueue();
  }

  /**
   * Cleanup on unmount
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Convenience function for direct tracking
export const trackEvent = (
  eventName: AnalyticsEventName,
  metadata?: Record<string, unknown>
): Promise<void> => {
  return analytics.track(eventName, metadata);
};
