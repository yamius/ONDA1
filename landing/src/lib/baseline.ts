/**
 * The shortcut bridge (KK 56/57): reading what the Shortcut put in the URL fragment.
 *
 * A person runs an iOS Shortcut that reads their own Health data and opens
 * `/baseline#rhr=62.4&rhrmin=58&rhrmax=67&rhrn=14&…`. Everything after the `#` stays on the device:
 * the browser does not put a fragment in the HTTP request, so no server of ours ever sees a number.
 * That property is only worth anything if nothing on the page hands the fragment to somebody else -
 * see the script-free route list, which is the other half of the same promise.
 *
 * PURE, and deliberately the whole of the logic: parsing is where a bridge like this goes wrong
 * quietly (a comma from a Russian-locale phone, a fourteen-digit float, a key that never arrived),
 * and none of that should be discovered by looking at a broken page.
 *
 * FIREWALL (app_baseline_spec 7): this module names, formats and orders numbers. It never judges
 * them. No thresholds, no comparisons, no "normal" - those words are not here and must not arrive.
 */

/** The three signals of the first version. Temperature is deliberately absent (spec 2). */
export const BASELINE_SIGNALS = [
  {
    key: "rhr",
    /** Health's own name for it, so the page and the Health app agree. */
    label: "Resting heart rate",
    unit: "bpm",
    /** Decimals to show. One is what the Shortcut rounds to; a whole number reads better here. */
    decimals: 0,
  },
  {
    key: "hrv",
    label: "Heart rate variability",
    unit: "ms",
    decimals: 0,
  },
  {
    key: "rr",
    label: "Respiratory rate",
    unit: "breaths/min",
    decimals: 1,
  },
] as const;

export type BaselineSignalKey = (typeof BASELINE_SIGNALS)[number]["key"];

/**
 * The single-value figures the Shortcut also sends (KK 12_ONDA_Watch). They carry no range and no
 * day count of their own - one number each, or nothing.
 *
 * `hrpeak` is parsed but is NOT in the current Shortcut: the peak-pulse block was removed for good
 * because Heart Rate writes constantly and its ~270 samples pushed iOS over the "large amounts of
 * data" threshold. It stays here because a fragment is forever - copies of an older Shortcut, or a
 * future one that finds a way, would send it, and a reader that silently dropped a real figure is
 * worse than one that never expected it.
 */
export const BASELINE_EXTRAS = [
  { key: "hrpeak", label: "peak" },
  { key: "whr", label: "avg pulse, walking" },
  { key: "vo2", label: "VO2max, est." },
  { key: "hrr", label: "recovery, first minute" },
] as const;

export type BaselineExtraKey = (typeof BASELINE_EXTRAS)[number]["key"];

/** The window the Shortcut collects. Shown as "n of 14 days", never as a target to hit. */
export const BASELINE_WINDOW_DAYS = 14;

export interface BaselineReading {
  key: BaselineSignalKey;
  label: string;
  unit: string;
  decimals: number;
  /** null when the Shortcut sent nothing usable for this signal - rendered as "no data", never hidden. */
  avg: number | null;
  min: number | null;
  max: number | null;
  /** Days with data, 0..14. 0 means the signal is not being recorded on this person's devices. */
  days: number;
}

/**
 * PURE: one number out of the fragment.
 *
 * Accepts a comma as the decimal separator - a phone set to a Russian locale writes `62,4`, and the
 * page must not decide that person has no data. Rejects anything that is not a finite, non-negative
 * number, and rejects the empty string rather than reading it as zero: "absent" and "zero" mean
 * different things here (no watch versus a real measurement).
 */
export function parseNumber(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const cleaned = raw.trim().replace(",", ".");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** PURE: the day count. Clamped to the window - a Shortcut edit must not produce "17 of 14". */
export function parseDays(raw: string | null | undefined): number {
  const n = parseNumber(raw);
  if (n == null) return 0;
  return Math.min(Math.max(Math.round(n), 0), BASELINE_WINDOW_DAYS);
}

/**
 * PURE: the whole fragment → one reading per signal, always all three, in a fixed order.
 *
 * Signals with nothing usable come back with null values and days 0 rather than being dropped: the
 * page shows them as "no data" on purpose (spec 4), because a missing block reads as a bug while a
 * stated absence reads as an answer.
 */
export function parseBaselineHash(hash: string | null | undefined): BaselineReading[] {
  const params = new URLSearchParams((hash ?? "").replace(/^#/, ""));
  return BASELINE_SIGNALS.map((s) => {
    const avg = parseNumber(params.get(s.key));
    const min = parseNumber(params.get(`${s.key}min`));
    const max = parseNumber(params.get(`${s.key}max`));
    const days = parseDays(params.get(`${s.key}n`));
    // An average with no day count is still an average; a day count with no average is not a
    // reading. Trust the number that carries the meaning, and let the count be what it is.
    const hasValue = avg != null;
    return {
      key: s.key,
      label: s.label,
      unit: s.unit,
      decimals: s.decimals,
      avg: hasValue ? avg : null,
      min: hasValue ? (min ?? avg) : null,
      max: hasValue ? (max ?? avg) : null,
      days: hasValue ? Math.max(days, 1) : 0,
    };
  });
}

/** PURE: the single-value extras, absent when the Shortcut sent nothing for them. */
export function parseBaselineExtras(hash: string | null | undefined): Partial<Record<BaselineExtraKey, number>> {
  const params = new URLSearchParams((hash ?? "").replace(/^#/, ""));
  const out: Partial<Record<BaselineExtraKey, number>> = {};
  for (const e of BASELINE_EXTRAS) {
    const v = parseNumber(params.get(e.key));
    if (v != null) out[e.key] = v;
  }
  return out;
}

/** PURE: did the fragment carry anything at all? Distinguishes "opened cold" from "no data". */
export function hasAnyReading(readings: BaselineReading[]): boolean {
  return readings.some((r) => r.avg != null);
}

/** PURE: display form. Trailing zeros dropped, so 62.0 shows as 62 and 14.5 stays 14.5. */
export function formatValue(value: number | null, decimals: number): string {
  if (value == null) return "";
  const fixed = value.toFixed(decimals);
  return fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;
}

/**
 * PURE: where the average sits inside the person's own low-to-high span, 0..1.
 *
 * Their OWN span, never a population one: the bar shows how the fortnight spread out, and there is
 * no outside scale to be near the good or bad end of. A flat span (one day of data, or fourteen
 * identical readings) puts the marker in the middle rather than dividing by zero.
 */
export function spanPosition(r: BaselineReading): number {
  if (r.avg == null || r.min == null || r.max == null) return 0.5;
  const span = r.max - r.min;
  if (span <= 0) return 0.5;
  return Math.min(Math.max((r.avg - r.min) / span, 0), 1);
}
