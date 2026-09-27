import {
  BASELINE_WINDOW_DAYS,
  formatValue,
  type BaselineExtraKey,
  type BaselineReading,
} from "./baseline";

/**
 * The share card's layout, decided BEFORE anything is drawn (KK 12_ONDA_Watch).
 *
 * PURE on purpose. Everything that can be wrong about this card is arithmetic or absence - a label
 * claiming fourteen nights when the watch was worn for two, a column with a hole in the middle, a
 * spread computed from a zero - and none of that should be found by looking at a rendered PNG.
 *
 * TWO RULES CARRY THE WHOLE THING.
 *
 * 1. Columns COLLAPSE upward from the bottom. The lowest slots hold what nearly everyone has
 *    (resting pulse, breathing); the top ones need workouts. A missing figure must not leave a gap,
 *    so the survivors move down. On the author's own phone three of eight slots are empty, which
 *    makes the collapsed card the ordinary case rather than an edge case.
 *
 * 2. A caption states the REAL number of nights behind its own figure. "14 nights" is written only
 *    when there were fourteen. The page shows "2 OF 14 DAYS" beside its bar and the reader gets the
 *    context; the card has no such counter, so a caption saying fourteen when it was two is simply
 *    a false statement in a picture that travels.
 *
 * FIREWALL (app_baseline_spec 7): this file names and orders figures. It never judges one. No
 * thresholds, no comparisons, no "normal" - and no figure that HealthKit did not send, except the
 * spread, which is division of two figures that did arrive.
 */

export interface CardSlot {
  /** The big figure, already formatted. */
  value: string;
  /** The line under it. Carries the real night count where it claims one. */
  caption: string;
}

export interface CardModel {
  /** The hero: resting pulse, the one figure nearly every wearer has. */
  hero: { value: string; label: string; sub: string } | null;
  left: CardSlot[];
  right: CardSlot[];
  /** The variability bar. Absent when HRV never arrived, and the breathing lines move up. */
  variability: {
    min: string;
    max: string;
    /** Marker position 0..1 inside the person's own low-to-high span. */
    position: number;
    /** "a 13x spread across 9 nights" - the multiple is max/min, nothing invented. */
    caption: string;
    lineOne: string;
    lineTwo: string;
  } | null;
  /** The closing thought, which needs the breathing figure to exist. */
  breathing: { lineOne: string; lineTwo: string; lineThree: string } | null;
  /** Nothing at all arrived: the card is not drawn. A blank card in a chat is worse than none. */
  empty: boolean;
  /** The label drawn on the card's share button (localized). */
  buttonLabel: string;
  /** The closing line under the card (localized). */
  footer: string;
}

/** PURE: "14 nights" only when it was fourteen; "2 nights" when it was two; "1 night" singular. */
export function nightsLabel(days: number): string {
  return days === 1 ? "1 night" : `${days} nights`;
}

/** PURE: the compact form used where the caption is tight ("breathing range, 14n"). */
export function nightsShort(days: number): string {
  return `${days}n`;
}

const round = (n: number) => Math.round(n);

/**
 * PURE: the multiple between the calmest and the busiest night, as the card states it.
 *
 * Guarded rather than clever: a zero or missing minimum makes the ratio meaningless, and the honest
 * response is to say nothing rather than to print a large number that came from a division by
 * almost-zero.
 */
export function spreadMultiple(min: number | null, max: number | null): number | null {
  if (min == null || max == null || min <= 0 || max <= min) return null;
  return round(max / min);
}

/**
 * PURE: a signal by key, or null when the Shortcut sent nothing for it.
 */
function reading(readings: BaselineReading[], key: string): BaselineReading | null {
  const r = readings.find((x) => x.key === key);
  return r && r.avg != null ? r : null;
}

/**
 * PURE: the whole card, from what actually arrived.
 *
 * Slots are built in priority order (the ones nearly everyone has first) and then laid out from the
 * bottom of each column, so an absent figure is invisible rather than a hole.
 */
/** Localizable card strings. Defaults reproduce the original English card exactly. */
export interface CardText {
  restingPulse: string
  avgSub: string
  mostRestless: string
  calmest: string
  avgWalk: string
  peak: string
  breathingRange: string
  breathsAsleep: string
  recovery: string
  vo2: string
  spread: string
  across: string
  hrvLow: string
  hrvHigh: string
  rrLine1: string
  rrLine2: string
  rrLine3: string
  buttonLabel: string
  footer: string
  nights: (n: number) => string
  short: (n: number) => string
}

const fillT = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_m, k: string) => String(v[k] ?? ''))

export const EN_CARD_TEXT: CardText = {
  restingPulse: 'RESTING PULSE',
  avgSub: '{nights} average',
  mostRestless: 'most restless night',
  calmest: 'calmest night',
  avgWalk: 'avg pulse, walking',
  peak: 'peak, {nights}',
  breathingRange: 'breathing range, {short}',
  breathsAsleep: 'breaths / min, asleep',
  recovery: 'recovery, first minute',
  vo2: 'VO2max, est.',
  spread: 'a {x}x spread across {nights}',
  across: 'across {nights}',
  hrvLow: '{v} — nights your body stayed on guard.',
  hrvHigh: '{v} — when it finally let go.',
  rrLine1: '{v} is how your body breathes without you.',
  rrLine2: 'At six, you lead the rhythm —',
  rrLine3: "you don't just watch it.",
  buttonLabel: 'Share',
  footer: 'Ask a friend what rhythm they breathe at.',
  nights: (n) => nightsLabel(n),
  short: (n) => nightsShort(n),
}

export function buildCardModel(
  readings: BaselineReading[],
  extras: Partial<Record<BaselineExtraKey, number>>,
  t: CardText = EN_CARD_TEXT,
): CardModel {
  const rhr = reading(readings, "rhr");
  const hrv = reading(readings, "hrv");
  const rr = reading(readings, "rr");

  // LEFT, in priority order from the bottom up: the two ends of the resting-pulse fortnight first,
  // then walking pulse, then the peak - which the current Shortcut no longer sends at all.
  const left: CardSlot[] = [];
  if (rhr) {
    left.push({ value: formatValue(rhr.max, 0), caption: t.mostRestless });
    left.push({ value: formatValue(rhr.min, 0), caption: t.calmest });
  }
  if (extras.whr != null) left.push({ value: String(round(extras.whr)), caption: t.avgWalk });
  if (extras.hrpeak != null && rhr) {
    left.push({ value: String(round(extras.hrpeak)), caption: fillT(t.peak, { nights: t.nights(rhr.days) }) });
  }

  // RIGHT, same idea: breathing at the bottom (almost everyone), the workout-dependent figures on top.
  const right: CardSlot[] = [];
  if (rr) {
    right.push({
      value: `${formatValue(rr.min, 0)}-${formatValue(rr.max, 0)}`,
      caption: fillT(t.breathingRange, { short: t.short(rr.days) }),
    });
    right.push({ value: formatValue(rr.avg, 0), caption: t.breathsAsleep });
  }
  if (extras.hrr != null) right.push({ value: String(round(extras.hrr)), caption: t.recovery });
  if (extras.vo2 != null) right.push({ value: String(round(extras.vo2)), caption: t.vo2 });

  const spread = hrv ? spreadMultiple(hrv.min, hrv.max) : null;

  return {
    hero: rhr
      ? {
          value: formatValue(rhr.avg, 0),
          label: t.restingPulse,
          // The window the figure actually covers, not the one the Shortcut asked for.
          sub: fillT(t.avgSub, { nights: t.nights(rhr.days) }),
        }
      : null,
    left,
    right,
    variability:
      hrv && hrv.min != null && hrv.max != null && hrv.max > hrv.min
        ? {
            min: formatValue(hrv.min, 0),
            max: formatValue(hrv.max, 0),
            position: (hrv.avg! - hrv.min) / (hrv.max - hrv.min),
            // No spread line when the ratio would be meaningless: the bar still says everything the
            // two ends say.
            caption: spread ? fillT(t.spread, { x: spread, nights: t.nights(hrv.days) }) : fillT(t.across, { nights: t.nights(hrv.days) }),
            lineOne: fillT(t.hrvLow, { v: formatValue(hrv.min, 0) }),
            lineTwo: fillT(t.hrvHigh, { v: formatValue(hrv.max, 0) }),
          }
        : null,
    breathing: rr
      ? {
          lineOne: fillT(t.rrLine1, { v: formatValue(rr.avg, 0) }),
          lineTwo: t.rrLine2,
          lineThree: t.rrLine3,
        }
      : null,
    empty: !rhr && !hrv && !rr && Object.keys(extras).length === 0,
    buttonLabel: t.buttonLabel,
    footer: t.footer,
  };
}

/** The window every caption is measured against, re-exported so the renderer needs one import. */
export { BASELINE_WINDOW_DAYS };

/**
 * The card's own pixel space - the frame the composition was approved in. Every coordinate the
 * renderer uses is in these units, and so is the button below.
 */
export const CARD_REF = { w: 941, h: 1672 } as const;

/**
 * The Share button, in those units. ONE rectangle, used to draw it AND to decide whether a tap
 * landed on it: two copies of these numbers would drift and leave a button that looks pressable
 * where nothing happens.
 *
 * Sized to the HTML button that used to sit under the card, because it is now the only control -
 * the drawn one has to exist regardless, since it travels with the picture into the chat.
 */
export const CARD_BUTTON = { w: 330, h: 82, y: 1462, r: 41, x: (941 - 330) / 2 } as const;

/**
 * PURE: did a tap at these fractions of the card's width and height land on the button?
 *
 * Takes ratios rather than pixels so it holds at any rendered width, and so the geometry can be
 * tested without a browser - the reason it lives here and not in the component.
 */
export function isOnShareButton(xRatio: number, yRatio: number): boolean {
  const x = xRatio * CARD_REF.w;
  const y = yRatio * CARD_REF.h;
  return x >= CARD_BUTTON.x && x <= CARD_BUTTON.x + CARD_BUTTON.w
    && y >= CARD_BUTTON.y && y <= CARD_BUTTON.y + CARD_BUTTON.h;
}
