/**
 * Anonymized event-context enrichers for analytics (data-collection task 562).
 *
 * Everything here is aggregate-safe: a coarse 10-year age band, and the local
 * hour / weekday of the event. No exact date of birth, no exact age, no user_id
 * — only bucketed values that support publishable, de-identified aggregates
 * ("Normal HRV by age", "When HRV bottoms out overnight").
 */
import { Capacitor } from '@capacitor/core';
import HealthKitHeartRate from '../plugins/healthKitHeartRate';

const AGE_BAND_KEY = 'onda_age_band';

// Valid bands the native side can return (kept in sync with getAgeBand in
// HealthKitHeartRatePlugin.swift). Anything else is coerced to 'unknown'.
const VALID_BANDS = new Set([
  'under-20', '20-29', '30-39', '40-49', '50-59', '60+', 'unknown',
]);

let _cachedBand: string | null = null;

/** Synchronous read for event emission — never blocks, never throws. Falls back
 *  to localStorage, then 'unknown'. Call primeAgeBand() once after Health auth so
 *  this returns a real band. */
export function ageBand(): string {
  if (_cachedBand) return _cachedBand;
  try {
    const stored = localStorage.getItem(AGE_BAND_KEY);
    if (stored && VALID_BANDS.has(stored)) {
      _cachedBand = stored;
      return stored;
    }
  } catch { /* localStorage blocked → unknown */ }
  return 'unknown';
}

/** Read the age band from Health once (iOS only) and cache it for synchronous
 *  reads. Safe to call repeatedly and on any platform. Only the band is ever
 *  stored — the exact date of birth stays native and is never persisted. */
export async function primeAgeBand(): Promise<string> {
  // Web / Android: no HealthKit dob → unknown, and don't touch the native plugin.
  if (Capacitor.getPlatform() !== 'ios') {
    _cachedBand = 'unknown';
    return _cachedBand;
  }
  try {
    const { ageBand: band } = await HealthKitHeartRate.getAgeBand();
    const clean = band && VALID_BANDS.has(band) ? band : 'unknown';
    _cachedBand = clean;
    try { localStorage.setItem(AGE_BAND_KEY, clean); } catch { /* noop */ }
    return clean;
  } catch {
    _cachedBand = 'unknown';
    return 'unknown';
  }
}

/** Local hour of day (0–23) at event time — for overnight / time-of-day patterns. */
export function localHour(d: Date = new Date()): number {
  return d.getHours();
}

/** Local day of week at event time, 0 = Sunday … 6 = Saturday (JS getDay). */
export function localWeekday(d: Date = new Date()): number {
  return d.getDay();
}

/** Coefficient of variation (SD / mean) as an integer percent, over a nightly
 *  series — a single scalar describing how much a signal swings day to day.
 *  Returns undefined below `minN` samples or for a non-positive mean. Only this
 *  scalar is ever emitted; the raw nightly series never leaves the device. */
export function coeffOfVariation(values: number[], minN = 7): number | undefined {
  if (!values || values.length < minN) return undefined;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean <= 0) return undefined;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.round((Math.sqrt(variance) / mean) * 100);
}
