/**
 * ONE app-wide router for "user tapped a local notification" (task 097).
 *
 * Why this exists: Capacitor keeps a tap that arrives before any JS listener
 * (`retainUntilConsumed: true` in @capacitor/local-notifications
 * LocalNotificationsHandler.swift) — but it flushes the retained event to the
 * FIRST listener that attaches and then drops it (CAPPlugin.m, addEventListener →
 * sendRetainedArgumentsForEvent). With two React listeners (signal + check-in),
 * a cold-start tap went to whichever subscribed first and the other never saw it;
 * the check-in listener was also torn down/re-added on every practiceHistory
 * change. Here a single listener is registered at MODULE LOAD (imported from
 * main.tsx before React renders), parses the payload, and buffers it until the
 * app registers its handler (once its state is ready). Nothing is lost.
 */
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export type OpenKind = 'checkin' | 'signal' | 'daily' | 'streak' | 'unknown';

export interface NotificationOpenInfo {
  kind: OpenKind | string;
  checkin_type?: 'A1' | 'A2' | 'A3' | 'B1' | 'B2';
  segment?: 'watch' | 'no_watch';
  /** Old internal test route (no analytics at all). */
  simulated: boolean;
  /** Real push fired from the TEST-build debug panel (analytics already internal via the build marker). */
  internal_test: boolean;
  /** Signal push: which metric deviated, plus the night's value + corridor if the native push carries them. */
  metric?: 'rhr' | 'hrv' | 'rr';
  value?: number;
  lo?: number;
  hi?: number;
  copy_variant_id?: number;
  streak?: number;
}

type Raw = Record<string, unknown>;

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};
const bool = (v: unknown): boolean => v === true || v === 'true' || v === 1;

/**
 * Pure: turn a localNotificationActionPerformed event into routing info.
 * Reads `notification.extra` (what the plugin exposes: `cap_extra`, or the whole
 * userInfo when a native push set no cap_extra), unwraps a nested `cap_extra`,
 * and falls back to raw top-level fields — so every payload shape we post works.
 */
export function parseNotificationOpen(event: unknown): NotificationOpenInfo {
  const ev = (event ?? {}) as Raw;
  const n = (ev.notification ?? {}) as Raw;
  const extra0 = (n.extra && typeof n.extra === 'object' ? n.extra : {}) as Raw;
  const nested = (extra0.cap_extra && typeof extra0.cap_extra === 'object' ? extra0.cap_extra : {}) as Raw;
  const userInfo = (n.userInfo && typeof n.userInfo === 'object' ? n.userInfo : {}) as Raw;
  const src: Raw = { ...userInfo, ...extra0, ...nested };
  const pick = (k: string) => src[k];

  const metricRaw = pick('anomaly_metric') ?? pick('metric');
  const metric = metricRaw === 'rhr' || metricRaw === 'hrv' || metricRaw === 'rr' ? metricRaw : undefined;
  let kind = (typeof pick('kind') === 'string' ? (pick('kind') as string) : '') || '';
  if (!kind && metric) kind = 'signal';
  if (!kind) kind = 'unknown';
  const ct = pick('checkin_type');
  const seg = pick('segment');
  return {
    kind,
    checkin_type: ct === 'A1' || ct === 'A2' || ct === 'A3' || ct === 'B1' || ct === 'B2' ? ct : undefined,
    segment: seg === 'watch' || seg === 'no_watch' ? seg : undefined,
    simulated: bool(pick('simulated')),
    internal_test: bool(pick('internal_test')),
    metric,
    value: num(pick('anomaly_value')),
    lo: num(pick('anomaly_lo')),
    hi: num(pick('anomaly_hi')),
    copy_variant_id: num(pick('copy_variant_id')),
    streak: num(pick('streak')),
  };
}

type Handler = (info: NotificationOpenInfo) => void;
let handler: Handler | null = null;
const queue: NotificationOpenInfo[] = [];
let installed = false;

/** Internal (exported for tests): feed one raw tap event through the router. */
export function _dispatchRaw(event: unknown): void {
  const actionId = (event as Raw | undefined)?.actionId;
  if (actionId === 'dismiss') return;
  const info = parseNotificationOpen(event);
  if (handler) {
    try { handler(info); } catch (e) { console.warn('[notif-router] handler failed', e); }
  } else {
    queue.push(info);
  }
}

/**
 * Register THE handler (call once, when the app's state is ready). Any tap
 * buffered since module load is delivered immediately, in order. Returns an
 * unregister function (later taps buffer again until a handler is set).
 */
export function setNotificationOpenHandler(h: Handler): () => void {
  handler = h;
  while (queue.length && handler === h) {
    const info = queue.shift()!;
    try { h(info); } catch (e) { console.warn('[notif-router] handler failed', e); }
  }
  return () => { if (handler === h) handler = null; };
}

/** Test helper. */
export function _resetRouterForTests(): void { handler = null; queue.length = 0; }

export function installNotificationRouter(): void {
  if (installed) return;
  installed = true;
  try {
    if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('LocalNotifications')) return;
    LocalNotifications.addListener('localNotificationActionPerformed', (e) => _dispatchRaw(e))
      .catch((e) => console.warn('[notif-router] addListener failed', e));
  } catch (e) {
    console.warn('[notif-router] install failed', e);
  }
}

// Registered at module load — main.tsx imports this before React renders.
installNotificationRouter();
