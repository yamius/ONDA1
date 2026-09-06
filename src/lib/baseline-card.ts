/**
 * The baseline card's layout (onda_card_v21) — ported from `landing/src/lib/baseline-card.ts`.
 *
 * PURE. Two rules carry it:
 * 1. Columns COLLAPSE upward — a missing figure leaves no gap, the survivors move down.
 * 2. A caption states the REAL coverage behind its own figure ("14 nights" only when it was 14). The
 *    wording is source-aware: the watch counts nights, the camera counts readings.
 *
 * Captions are English here to match the v21 reference exactly; localization comes after the visual
 * is signed off. FIREWALL (ONDA_baseline_card_spec §7): names and orders figures, never judges one.
 */
import { formatValue, type BaselineExtraKey, type BaselineReading, type BaselineSource } from './baseline';

/** `sign` is set only in Shift mode: -1 (below baseline → blue), +1 (above → violet), 0 (flat). */
export interface CardSlot { value: string; caption: string; sign?: number; }

export interface CardModel {
  hero: { value: string; label: string; sub: string; sign?: number } | null;
  left: CardSlot[];
  right: CardSlot[];
  variability: {
    min: string;
    max: string;
    minSign?: number;
    maxSign?: number;
    position: number;
    caption: string;
    /** Text under the low end (39) and the high end (62). May contain \n. */
    leftText: string;
    rightText: string;
  } | null;
  /** Closing lines, as two columns: an actual figure + a line under it. */
  breathing: { leftNum: string; leftText: string; rightNum: string; rightText: string } | null;
  empty: boolean;
}

/** Source-aware coverage: the watch counts nights, the camera counts readings. */
export function coverageLabel(days: number, source: BaselineSource): string {
  if (source === 'camera') return days === 1 ? '1 reading' : `${days} readings`;
  return days === 1 ? '1 night' : `${days} nights`;
}
export function coverageShort(days: number, source: BaselineSource): string {
  return source === 'camera' ? `${days}r` : `${days}n`;
}

const round = (n: number) => Math.round(n);

export function spreadMultiple(min: number | null, max: number | null): number | null {
  if (min == null || max == null || min <= 0 || max <= min) return null;
  return round(max / min);
}

function reading(readings: BaselineReading[], key: string): BaselineReading | null {
  const r = readings.find((x) => x.key === key);
  return r && r.avg != null ? r : null;
}

/** Is the low..high range real? Guards the min/max ends (a session spread, or nights of spread). */
function hasSpread(r: BaselineReading | null): boolean {
  return !!r && r.min != null && r.max != null && r.max > r.min;
}

/** Signed delta today−baseline for Shift mode. Missing today → "—", flat sign. */
function fmtDelta(base: number | null | undefined, today: number | null | undefined): { value: string; sign: number } {
  if (base == null || today == null) return { value: '—', sign: 0 };
  const d = round(today) - round(base);
  return { value: d > 0 ? `+${d}` : d < 0 ? `−${Math.abs(d)}` : '±0', sign: Math.sign(d) };
}

export function buildCardModel(
  readings: BaselineReading[],
  extras: Partial<Record<BaselineExtraKey, number>>,
  source: BaselineSource,
  today?: { readings: BaselineReading[]; extras: Partial<Record<BaselineExtraKey, number>> },
): CardModel {
  const rhr = reading(readings, 'rhr');
  const hrv = reading(readings, 'hrv');
  const rr = reading(readings, 'rr');
  const cov = (days: number) => coverageLabel(days, source);

  // Shift mode: each figure becomes its signed delta from today's same-shaped read.
  const shift = !!today;
  const trhr = today ? reading(today.readings, 'rhr') : null;
  const thrv = today ? reading(today.readings, 'hrv') : null;
  const trr = today ? reading(today.readings, 'rr') : null;
  const tex = today?.extras ?? {};
  // Baseline value, or its delta when Shift is on.
  const val = (base: number | null | undefined, todayVal: number | null | undefined): { value: string; sign?: number } =>
    shift ? fmtDelta(base, todayVal) : { value: formatValue(base ?? null, 0) };

  // LEFT, priority bottom-up: the two ends of the resting-pulse window, then walking pulse, then peak.
  // Captions carry explicit \n so the layout is exact (no auto-wrap guessing).
  const left: CardSlot[] = [];
  if (rhr && hasSpread(rhr)) {
    left.push({ ...val(rhr.max, trhr?.max), caption: source === 'camera' ? 'highest' : 'most restless\nnight' });
    left.push({ ...val(rhr.min, trhr?.min), caption: source === 'camera' ? 'lowest' : 'calmest\nnight' });
  }
  if (extras.whr != null) left.push({ ...val(extras.whr, tex.whr), caption: 'avg pulse\nwalking' });
  if (extras.hrpeak != null && rhr) left.push({ ...val(extras.hrpeak, tex.hrpeak), caption: `peak\n${cov(rhr.days)}` });

  // RIGHT, same idea: breathing at the bottom, workout-dependent figures on top.
  const right: CardSlot[] = [];
  if (rr) {
    // Range is a two-number span — no clean delta, so Shift shows only the average.
    if (hasSpread(rr) && !shift) {
      right.push({ value: `${formatValue(rr.min, 0)}-${formatValue(rr.max, 0)}`, caption: `breathing range\n${cov(rr.days)}` });
    }
    right.push({ ...val(rr.avg, trr?.avg), caption: 'breaths / min' });
  }
  if (extras.hrr != null) right.push({ ...val(extras.hrr, tex.hrr), caption: 'recovery\nfirst minute' });
  if (extras.vo2 != null) right.push({ ...val(extras.vo2, tex.vo2), caption: 'VO2max\nest.' });

  const spread = hrv ? spreadMultiple(hrv.min, hrv.max) : null;
  const vmin = shift ? fmtDelta(hrv?.min, thrv?.min) : { value: formatValue(hrv?.min ?? null, 0), sign: undefined };
  const vmax = shift ? fmtDelta(hrv?.max, thrv?.max) : { value: formatValue(hrv?.max ?? null, 0), sign: undefined };

  return {
    hero: rhr ? { ...val(rhr.avg, trhr?.avg), label: 'RESTING PULSE', sub: shift ? 'vs baseline' : `${cov(rhr.days)} average` } : null,
    left,
    right,
    variability:
      hrv && hasSpread(hrv)
        ? {
            min: vmin.value,
            max: vmax.value,
            minSign: vmin.sign,
            maxSign: vmax.sign,
            position: (hrv.avg! - hrv.min!) / (hrv.max! - hrv.min!),
            caption: spread ? `a ${spread}x spread across ${cov(hrv.days)}` : `across ${cov(hrv.days)}`,
            leftText: 'nights your body\nstayed on guard',
            rightText: 'when it\nfinally let go',
          }
        : null,
    breathing: rr
      ? {
          leftNum: formatValue(rr.avg, 0),
          leftText: "it's how your body\nbreathes without you",
          rightNum: '6',
          rightText: 'at this rhythm you start\nworking with your nervous system',
        }
      : null,
    empty: !rhr && !hrv && !rr && Object.keys(extras).length === 0,
  };
}
