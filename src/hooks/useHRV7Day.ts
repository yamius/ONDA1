import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * 7-day HRV trend, sampled client-side once per local calendar day.
 *
 * The HealthKit plugin (`queryAllHealthData`) returns one HRV value per
 * call — there is no native API yet for "give me the last 7 days of
 * HRV samples". Rather than block on a native change, we accumulate the
 * history ourselves: every time fresh HRV data arrives we stamp today's
 * date with the latest value. The next time the chart is read, it
 * pulls the last 7 entries.
 *
 * Storage shape (localStorage key `onda.hrv_daily_v1`):
 *
 *   { "2026-05-21": 48, "2026-05-22": 52, ..., "2026-05-27": 47 }
 *
 * Pruned to the most recent ~30 entries on every write to keep the
 * key bounded. v1 suffix lets us migrate later without colliding.
 */

const STORAGE_KEY = 'onda.hrv_daily_v1';
const MAX_ENTRIES = 30;
const MIN_SAMPLES_FOR_TREND = 2;

export interface HRVSample {
  /** `YYYY-MM-DD` in the user's local timezone. */
  date: string;
  /** HRV in ms (SDNN). */
  value: number;
}

export interface UseHRV7DayResult {
  /** Up to 7 most recent daily samples, oldest-first. */
  samples: HRVSample[];
  /** True iff `samples.length >= 2` — enough to draw a trend line. */
  hasEnoughData: boolean;
  /** Call when fresh HRV data is available. No-op if value is null/0/NaN. */
  recordSample: (hrvMs: number | null | undefined) => void;
}

function todayLocalKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function readStore(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, number>;
    }
    return {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, number>) {
  if (typeof window === 'undefined') return;
  try {
    // Prune to most-recent MAX_ENTRIES by date key (string sort works for
    // ISO `YYYY-MM-DD`).
    const keys = Object.keys(store).sort();
    let trimmed = store;
    if (keys.length > MAX_ENTRIES) {
      const keep = keys.slice(-MAX_ENTRIES);
      trimmed = Object.fromEntries(keep.map(k => [k, store[k]]));
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Quota or private-mode browsers — non-fatal, history just won't grow.
  }
}

function lastNDays(store: Record<string, number>, n: number): HRVSample[] {
  const keys = Object.keys(store).sort(); // oldest → newest
  const slice = keys.slice(-n);
  return slice
    .map(date => ({ date, value: store[date] }))
    .filter(s => Number.isFinite(s.value) && s.value > 0);
}

export function useHRV7Day(): UseHRV7DayResult {
  const [store, setStore] = useState<Record<string, number>>(() => readStore());

  // Keep state in sync across tabs / WebView instances.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(readStore());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }
  }, []);

  const recordSample = useCallback((hrvMs: number | null | undefined) => {
    if (hrvMs == null || !Number.isFinite(hrvMs) || hrvMs <= 0) return;
    const key = todayLocalKey();
    setStore(prev => {
      // Overwriting today's slot is intentional — the latest reading
      // wins. The HealthKit plugin returns a smoothed/recent value
      // already, so we don't need to average within a day.
      if (prev[key] === hrvMs) return prev;
      const next = { ...prev, [key]: hrvMs };
      writeStore(next);
      return next;
    });
  }, []);

  const samples = useMemo(() => lastNDays(store, 7), [store]);
  const hasEnoughData = samples.length >= MIN_SAMPLES_FOR_TREND;

  return { samples, hasEnoughData, recordSample };
}
