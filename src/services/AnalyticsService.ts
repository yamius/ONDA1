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

// Event types for type safety
export type AnalyticsEventName =
  // Onboarding & Activation
  | 'app_open'
  | 'onboarding_start'
  | 'onboarding_step'
  | 'onboarding_complete'
  | 'sign_up'
  | 'sign_in'
  // Permissions
  | 'health_permission_request'
  | 'health_permission_granted'
  | 'health_permission_denied'
  | 'att_prompt_result'
  | 'watch_connection_attempt'
  | 'watch_connection_success'
  | 'watch_connection_failed'
  // Practice
  | 'practice_view'
  | 'practice_start'
  | 'practice_pause'
  | 'practice_resume'
  | 'practice_complete'
  | 'practice_abandon'
  // Biometrics
  | 'heart_rate_received'
  | 'biometric_sync_success'
  | 'biometric_sync_failed'
  // Gamification
  | 'ond_earned'
  | 'artifact_unlocked'
  | 'level_up'
  // Paywall / Monetization
  | 'paywall_viewed'
  | 'paywall_auth_required'
  | 'purchase_started'
  | 'purchase_succeeded'
  | 'purchase_failed'
  | 'purchase_cancelled'
  // Errors
  | 'error'
  | 'audio_load_error'
  | 'api_error'
  // Diagnostics
  | 'practice_intro_closed_debug'
  | 'app_crash_suspected'
  | 'resource_snapshot';

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

class AnalyticsService {
  private sessionId: string;
  private anonymousId: string;
  private platform: 'ios' | 'android' | 'web';
  private appVersion: string;
  private isOnline: boolean = true;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private utmParams: { source?: string; medium?: string; campaign?: string } = {};

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.anonymousId = this.getOrCreateAnonymousId();
    this.platform = this.detectPlatform();
    this.appVersion = import.meta.env.VITE_BUILD_NUMBER || 'dev';
    
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
        metadata: event.metadata || {},
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

    // Mirror to Firebase Analytics so the same event flows into GA4 and is
    // available as a Google Ads conversion. Fire-and-forget, never blocks
    // the Supabase write path below.
    _mirrorToFirebase(eventName, metadata);

    // Resource snapshot diagnostics: emit a parallel event whenever
    // practice_view fires, so we can correlate memory growth with the
    // iOS WebView OOM crash pattern (see app_crash_suspected).
    if (eventName === 'practice_view' || eventName === 'practice_intro_closed_debug') {
      try {
        // Dynamic import to keep the core analytics bundle independent.
        const { snapshotResources } = await import('./resourceTracker');
        const snap = snapshotResources();
        // Fire-and-forget — don't block the outer track() on this.
        this.track('resource_snapshot', {
          at_event: eventName,
          practice_id:
            (metadata as any)?.practice_id ??
            (metadata as any)?.practiceId ??
            (metadata as any)?.prevPracticeId ??
            null,
          close_reason: (metadata as any)?.reason ?? null,
          ...snap,
        }).catch(() => {});
      } catch (e) {
        // tracker import failed — non-critical
      }
    }

    // Crash-detector marker: record last practice_view in localStorage.
    // If the app dies (iOS WebView OOM-kill) before next heartbeat, the next
    // app_open will detect a fresh marker and emit app_crash_suspected.
    if (eventName === 'practice_view') {
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

    // Clear the marker on any event that proves the app survived past practice_view
    // (e.g. practice_intro_closed_debug, practice_start, practice_abandon, practice_complete).
    if (
      eventName === 'practice_intro_closed_debug' ||
      eventName === 'practice_start' ||
      eventName === 'practice_abandon' ||
      eventName === 'practice_complete'
    ) {
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
        metadata: metadata || {},
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
    action: 'view' | 'start' | 'pause' | 'resume' | 'complete' | 'abandon',
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
