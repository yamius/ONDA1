/**
 * Local notifications service for practice reminders.
 *
 * Sprint 1 scope:
 *  - Daily practice reminder (user-chosen time, repeating).
 *    Implemented as a rolling 7-day re-schedule so each day can ship
 *    a distinct copy variant for A/B without losing repeat behaviour.
 *  - Streak protection nudge (single shot at 20:00 local time, replanned
 *    on every app open / resume from background).
 *
 * iOS-only API note: LocalNotifications.requestPermissions() shows the
 * system prompt exactly once. Subsequent calls return the cached state
 * and never re-prompt. We surface that to UI through `permissionState`.
 */

import { LocalNotifications, type ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import i18n from 'i18next';

// === Storage keys (kept stable so Sprint 2/3 can reuse) ===
const LS_DAILY_ENABLED = 'onda_reminders_daily_enabled';
const LS_DAILY_TIME = 'onda_reminders_daily_time';      // 'HH:MM'
const LS_STREAK_ENABLED = 'onda_reminders_streak_enabled';
const LS_LAST_PERMISSION = 'onda_reminders_last_permission'; // 'granted'|'denied'|'prompt'
const LS_CHECKINS_ENABLED = 'onda_checkins_enabled';         // calm check-ins (task 16), default ON

// === Notification IDs ===
// Daily: 1000..1006 — rolling week. Each slot represents day-of-week offset.
// Streak: 2000 — single shot, overwritten on each re-plan.
const DAILY_ID_BASE = 1000;
const STREAK_ID = 2000;
// Calm check-ins (task 16): Segment A is native; Segment B is a scheduled-ahead
// series on IDs 4000+ (see CHECKIN_B_ID_BASE below).

// === Copy variants ===
// Each variant is referenced by index so analytics can attribute opens to a
// specific message. Number of variants per language must match across langs.
const DAILY_VARIANTS = 7;
const STREAK_VARIANTS = 4;

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

function isSupported(): boolean {
  return Capacitor.isNativePlatform();
}

function tDaily(idx: number): string {
  // Falls back to base key if individual variant missing in current locale.
  return i18n.t(`reminders.daily_body.${idx}`, { defaultValue: i18n.t('reminders.daily_body.0', 'Time for a pause.') });
}

function tStreak(idx: number, streak: number): string {
  return i18n.t(`reminders.streak_body.${idx}`, { streak, defaultValue: i18n.t('reminders.streak_body.0', { streak, defaultValue: `Your ${streak}-day rhythm needs one more breath.` }) });
}

function dailyTitle(): string {
  return i18n.t('reminders.daily_title', 'ONDA');
}

function streakTitle(): string {
  return i18n.t('reminders.streak_title', 'ONDA');
}

function parseTime(hhmm: string): { hour: number; minute: number } {
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10));
  return { hour: isFinite(h) ? h : 9, minute: isFinite(m) ? m : 0 };
}

function nextOccurrence(hour: number, minute: number, dayOffset: number): Date {
  // Local-time anchor. We DELIBERATELY construct from new Date() and mutate,
  // so DST and TZ shifts always resolve to the user's wall clock.
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// === Permission ===

export async function checkPermission(): Promise<PermissionState> {
  if (!isSupported()) return 'unsupported';
  try {
    const { display } = await LocalNotifications.checkPermissions();
    if (display === 'granted') return 'granted';
    if (display === 'denied') return 'denied';
    return 'prompt';
  } catch {
    return 'unsupported';
  }
}

/**
 * Ask for permission. iOS shows the system prompt only on the FIRST call;
 * after that it returns the cached value. UI should branch on the result:
 * 'granted' → schedule, 'denied' → revert toggle, show settings-deeplink hint.
 */
export async function requestPermission(): Promise<PermissionState> {
  if (!isSupported()) return 'unsupported';
  try {
    const { display } = await LocalNotifications.requestPermissions();
    const state: PermissionState =
      display === 'granted' ? 'granted' : display === 'denied' ? 'denied' : 'prompt';
    localStorage.setItem(LS_LAST_PERMISSION, state);
    return state;
  } catch {
    return 'unsupported';
  }
}

// === Daily reminder ===

export function getDailyEnabled(): boolean {
  return localStorage.getItem(LS_DAILY_ENABLED) === 'true';
}

export function getDailyTime(): string {
  return localStorage.getItem(LS_DAILY_TIME) || '09:00';
}

export async function scheduleDailyReminder(time: string): Promise<void> {
  if (!isSupported()) return;
  const perm = await checkPermission();
  if (perm !== 'granted') return;

  // Cancel any previously scheduled daily slots before re-planning.
  await cancelDailyReminder();

  const { hour, minute } = parseTime(time);
  const notifications: ScheduleOptions['notifications'] = [];

  for (let i = 0; i < 7; i++) {
    const at = nextOccurrence(hour, minute, i === 0 && nextOccurrence(hour, minute, 0) < new Date() ? 7 : i);
    const variantId = i % DAILY_VARIANTS;
    notifications.push({
      id: DAILY_ID_BASE + i,
      title: dailyTitle(),
      body: tDaily(variantId),
      schedule: { at, allowWhileIdle: true },
      extra: {
        kind: 'daily',
        copy_variant_id: variantId,
      },
    });
  }

  try {
    await LocalNotifications.schedule({ notifications });
    localStorage.setItem(LS_DAILY_ENABLED, 'true');
    localStorage.setItem(LS_DAILY_TIME, time);
  } catch (e) {
    console.warn('[notifications] daily schedule failed', e);
  }
}

export async function cancelDailyReminder(): Promise<void> {
  if (!isSupported()) return;
  const ids = Array.from({ length: 7 }, (_, i) => ({ id: DAILY_ID_BASE + i }));
  try {
    await LocalNotifications.cancel({ notifications: ids });
  } catch {
    /* ignore */
  }
}

export async function disableDailyReminder(): Promise<void> {
  await cancelDailyReminder();
  localStorage.setItem(LS_DAILY_ENABLED, 'false');
}

// === Streak nudge ===

export function getStreakEnabled(): boolean {
  // Default ON; user can opt out via Settings once the toggle is exposed.
  const v = localStorage.getItem(LS_STREAK_ENABLED);
  return v === null ? true : v === 'true';
}

export async function setStreakEnabled(enabled: boolean): Promise<void> {
  localStorage.setItem(LS_STREAK_ENABLED, enabled ? 'true' : 'false');
  if (!enabled) await cancelStreakNudge();
}

/**
 * Schedule (or cancel) the evening streak nudge for *today*.
 * Called on app open, on resume from background, and after any practice
 * completion event. Idempotent.
 *
 *  - If practice already done today → cancel.
 *  - If streak < 2 → cancel (no value in nagging brand-new users).
 *  - If user disabled the toggle → cancel.
 *  - If now > 20:00 local → cancel (we missed the window).
 *  - Otherwise → schedule single notification at 20:00 today.
 */
export async function reconcileStreakNudge(opts: {
  streak: number;
  practicedToday: boolean;
}): Promise<void> {
  if (!isSupported()) return;
  const perm = await checkPermission();
  if (perm !== 'granted') return;
  if (!getStreakEnabled()) {
    await cancelStreakNudge();
    return;
  }
  if (opts.practicedToday || opts.streak < 2) {
    await cancelStreakNudge();
    return;
  }

  const target = new Date();
  target.setHours(20, 0, 0, 0);
  if (target <= new Date()) {
    // Past 20:00 already; skip rather than fire-immediately.
    await cancelStreakNudge();
    return;
  }

  const variantId = (new Date().getDate()) % STREAK_VARIANTS;

  try {
    await LocalNotifications.cancel({ notifications: [{ id: STREAK_ID }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: STREAK_ID,
          title: streakTitle(),
          body: tStreak(variantId, opts.streak),
          schedule: { at: target, allowWhileIdle: true },
          extra: {
            kind: 'streak',
            copy_variant_id: variantId,
            streak: opts.streak,
          },
        },
      ],
    });
  } catch (e) {
    console.warn('[notifications] streak schedule failed', e);
  }
}

export async function cancelStreakNudge(): Promise<void> {
  if (!isSupported()) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: STREAK_ID }] });
  } catch {
    /* ignore */
  }
}

// === Calm check-ins (task 16) ===
// Segment A (watch) is decided + posted NATIVELY (HealthKitHeartRatePlugin) so it
// reaches non-openers even while the app is closed. Segment B (no watch) is a
// SERIES scheduled AHEAD here: on each open we (re)plan the next few B1/B2
// reminders so they still arrive for people who don't come back.

export type CheckinNotifType = 'A1' | 'A2' | 'A3' | 'B1' | 'B2';
export type CheckinNotifSegment = 'watch' | 'no_watch';

const CHECKIN_B_ID_BASE = 4000;      // Segment-B series 4000..4000+CHECKIN_B_COUNT-1
const CHECKIN_B_COUNT = 4;           // how many to plan ahead (well under iOS' 64-pending cap)
const CHECKIN_B_INTERVAL_DAYS = 3;   // spacing between B reminders

export function getCheckinsEnabled(): boolean {
  const v = localStorage.getItem(LS_CHECKINS_ENABLED);
  return v === null ? true : v === 'true'; // default ON
}

export async function setCheckinsEnabled(enabled: boolean): Promise<void> {
  localStorage.setItem(LS_CHECKINS_ENABLED, enabled ? 'true' : 'false');
  if (!enabled) await cancelCheckinSeriesB();
}

function checkinTitle(): string {
  return i18n.t('reminders.checkin_title', 'ONDA');
}

function tCheckin(type: CheckinNotifType): string {
  const key = `reminders.checkin_${type.toLowerCase()}`; // reminders.checkin_b1 …
  return i18n.t(key, { defaultValue: i18n.t('reminders.checkin_b1', 'A short practice keeps your rhythm going.') });
}

/**
 * (Re)plan the Segment-B series: the next CHECKIN_B_COUNT reminders at a calm
 * daytime hour, CHECKIN_B_INTERVAL_DAYS apart, alternating B1/B2 from
 * `startVariant` (0 → B1, 1 → B2). The first is INTERVAL days out, so an active
 * user (who keeps opening and re-planning) never actually receives one — it slides
 * forward — while a non-opener gets the whole series. Idempotent: cancels first.
 */
export async function scheduleCheckinSeriesB(startVariant: 0 | 1, opts?: { fast?: boolean }): Promise<boolean> {
  if (!isSupported()) return false;
  const perm = await checkPermission();
  if (perm !== 'granted') return false;
  if (!getCheckinsEnabled()) return false;

  await cancelCheckinSeriesB();
  const fast = !!opts?.fast; // INTERNAL test: minute spacing instead of days
  const notifications: ScheduleOptions['notifications'] = [];
  for (let i = 0; i < CHECKIN_B_COUNT; i++) {
    const at = fast
      ? new Date(Date.now() + (i + 1) * 60 * 1000)                    // +1,+2,+3,+4 min
      : nextOccurrence(13, 0, (i + 1) * CHECKIN_B_INTERVAL_DAYS);      // +3,+6,+9,+12 days
    const variant = ((startVariant + i) % 2) as 0 | 1;
    const type: CheckinNotifType = variant === 0 ? 'B1' : 'B2';
    notifications.push({
      id: CHECKIN_B_ID_BASE + i,
      title: checkinTitle(),
      body: tCheckin(type),
      schedule: { at, allowWhileIdle: true },
      extra: { kind: 'checkin', checkin_type: type, segment: 'no_watch' as CheckinNotifSegment, simulated: fast },
    });
  }
  try {
    await LocalNotifications.schedule({ notifications });
    return true;
  } catch (e) {
    console.warn('[notifications] checkin B series schedule failed', e);
    return false;
  }
}

/** INTERNAL test: fire a single B1/B2 after a short delay (marked simulated). */
export async function scheduleCheckinTestSingle(type: 'B1' | 'B2', delaySeconds = 4): Promise<boolean> {
  if (!isSupported()) return false;
  const perm = await checkPermission();
  if (perm !== 'granted') return false;
  try {
    await LocalNotifications.schedule({
      notifications: [{
        id: 4090,
        title: checkinTitle(),
        body: tCheckin(type),
        schedule: { at: new Date(Date.now() + delaySeconds * 1000), allowWhileIdle: true },
        extra: { kind: 'checkin', checkin_type: type, segment: 'no_watch' as CheckinNotifSegment, simulated: true },
      }],
    });
    return true;
  } catch (e) {
    console.warn('[notifications] checkin test single failed', e);
    return false;
  }
}

/** INTERNAL test: the app's pending (scheduled, not-yet-delivered) local notifications. */
export async function getPendingNotifications(): Promise<Array<{ id: number; title?: string; at?: string }>> {
  if (!isSupported()) return [];
  try {
    const res = await LocalNotifications.getPending();
    return (res.notifications || []).map((n) => ({
      id: n.id,
      title: n.title,
      at: (n.schedule && (n.schedule as { at?: Date }).at) ? new Date((n.schedule as { at?: Date }).at as Date).toLocaleString() : undefined,
    })).sort((a, b) => a.id - b.id);
  } catch {
    return [];
  }
}

export async function cancelCheckinSeriesB(): Promise<void> {
  if (!isSupported()) return;
  const ids = Array.from({ length: CHECKIN_B_COUNT }, (_, i) => ({ id: CHECKIN_B_ID_BASE + i }));
  try {
    await LocalNotifications.cancel({ notifications: ids });
  } catch {
    /* ignore */
  }
}

// === Open-from-notification listener ===

/**
 * Wire this once on app boot. The callback fires when the user taps a
 * notification we scheduled. Use it to send a Tenjin event with the
 * copy_variant_id so we can A/B copy.
 */
export function onNotificationOpened(cb: (info: { kind: string; copy_variant_id?: number; streak?: number; checkin_type?: CheckinNotifType; segment?: CheckinNotifSegment; simulated?: boolean }) => void) {
  if (!isSupported()) return () => {};
  const handle = LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
    const extra = event.notification?.extra || {};
    cb({
      kind: extra.kind ?? 'unknown',
      copy_variant_id: extra.copy_variant_id,
      streak: extra.streak,
      checkin_type: extra.checkin_type,
      segment: extra.segment,
      simulated: extra.simulated === true,
    });
  });
  return () => {
    handle.then((h) => h.remove()).catch(() => undefined);
  };
}
