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

export interface CardSlot { value: string; caption: string; }

export interface CardModel {
  hero: { value: string; label: string; sub: string } | null;
  left: CardSlot[];
  right: CardSlot[];
  variability: {
    min: string;
    max: string;
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

export function buildCardModel(
  readings: BaselineReading[],
  extras: Partial<Record<BaselineExtraKey, number>>,
  source: BaselineSource,
): CardModel {
  const rhr = reading(readings, 'rhr');
  const hrv = reading(readings, 'hrv');
  const rr = reading(readings, 'rr');
  const cov = (days: number) => coverageLabel(days, source);

  // LEFT, priority bottom-up: the two ends of the resting-pulse window, then walking pulse, then peak.
  // Captions carry explicit \n so the layout is exact (no auto-wrap guessing).
  const left: CardSlot[] = [];
  if (rhr && hasSpread(rhr)) {
    left.push({ value: formatValue(rhr.max, 0), caption: source === 'camera' ? 'highest' : 'most restless\nnight' });
    left.push({ value: formatValue(rhr.min, 0), caption: source === 'camera' ? 'lowest' : 'calmest\nnight' });
  }
  if (extras.whr != null) left.push({ value: String(round(extras.whr)), caption: 'avg pulse\nwalking' });
  if (extras.hrpeak != null && rhr) left.push({ value: String(round(extras.hrpeak)), caption: `peak\n${cov(rhr.days)}` });

  // RIGHT, same idea: breathing at the bottom, workout-dependent figures on top.
  const right: CardSlot[] = [];
  if (rr) {
    if (hasSpread(rr)) {
      right.push({ value: `${formatValue(rr.min, 0)}-${formatValue(rr.max, 0)}`, caption: `breathing range\n${cov(rr.days)}` });
    }
    right.push({ value: formatValue(rr.avg, 0), caption: 'breaths / min' });
  }
  if (extras.hrr != null) right.push({ value: String(round(extras.hrr)), caption: 'recovery\nfirst minute' });
  if (extras.vo2 != null) right.push({ value: String(round(extras.vo2)), caption: 'VO2max\nest.' });

  const spread = hrv ? spreadMultiple(hrv.min, hrv.max) : null;

  return {
    hero: rhr ? { value: formatValue(rhr.avg, 0), label: 'RESTING PULSE', sub: `${cov(rhr.days)} average` } : null,
    left,
    right,
    variability:
      hrv && hasSpread(hrv)
        ? {
            min: formatValue(hrv.min, 0),
            max: formatValue(hrv.max, 0),
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
