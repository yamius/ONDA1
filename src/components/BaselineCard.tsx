import { useTranslation } from 'react-i18next';
import figureDarkSrc from '../assets/baseline-figure.png';
import figureLightSrc from '../assets/baseline-figure-light.png';
import { buildCardModel, EN_CARD_COPY, type CardModel, type CardCopy } from '../lib/baseline-card';
import type { BaselineData, BaselineSource } from '../lib/baseline';

/** Build the card's copy from i18next (keeps buildCardModel pure). */
function useCardCopy(): CardCopy {
  const { t } = useTranslation();
  return {
    restingPulse: t('baseline.resting_pulse', EN_CARD_COPY.restingPulse),
    vsBaseline: t('baseline.vs_baseline', EN_CARD_COPY.vsBaseline),
    heroSub: (c) => t('baseline.hero_sub', { coverage: c, defaultValue: '{{coverage}} average' }),
    coverage: (days, source) => source === 'camera'
      ? t('baseline.readings', { count: days, defaultValue: days === 1 ? '1 reading' : `${days} readings` })
      : t('baseline.nights', { count: days, defaultValue: days === 1 ? '1 night' : `${days} nights` }),
    peak: t('baseline.peak', EN_CARD_COPY.peak),
    walking: t('baseline.walking', EN_CARD_COPY.walking),
    calmest: t('baseline.calmest', EN_CARD_COPY.calmest),
    restless: t('baseline.restless', EN_CARD_COPY.restless),
    highest: t('baseline.highest', EN_CARD_COPY.highest),
    lowest: t('baseline.lowest', EN_CARD_COPY.lowest),
    breathsMin: t('baseline.breaths_min', EN_CARD_COPY.breathsMin),
    breathingRange: t('baseline.breathing_range', EN_CARD_COPY.breathingRange),
    recovery: t('baseline.recovery', EN_CARD_COPY.recovery),
    vo2max: t('baseline.vo2max', EN_CARD_COPY.vo2max),
    variability: t('baseline.variability', EN_CARD_COPY.variability),
    spread: (m, c) => t('baseline.spread', { mult: m, coverage: c, defaultValue: 'a {{mult}}x spread across {{coverage}}' }),
    across: (c) => t('baseline.across', { coverage: c, defaultValue: 'across {{coverage}}' }),
    varLeft: t('baseline.var_left', EN_CARD_COPY.varLeft),
    varRight: t('baseline.var_right', EN_CARD_COPY.varRight),
    breathLeft: t('baseline.breath_left', EN_CARD_COPY.breathLeft),
    breathRight: t('baseline.breath_right', EN_CARD_COPY.breathRight),
  };
}

/**
 * In-app baseline card — the onda_card_v21 design in DOM: the neon body figure with the numbers
 * placed around it, resting pulse (coral) on the chest, the variability bar and the closing lines
 * below. Positions/type mirror onda_card_render.py in a 941×1672 frame; sizes are cqw so the card
 * scales with its width. Theme-aware: the dark figure + dark scrims/light text on dark, the light
 * figure + light scrims/dark text on light.
 *
 * Fed by the 14-day HealthKit read (watch) or the practice session (camera). English copy matches the
 * v21 reference; localization follows once the visual is signed off. Share is deferred.
 */

interface Palette {
  figure: string; bg: string; dim: string; scrim: string; cloud: string;
  green: string; coral: string; gray: string; white: string; blue: string; violet: string;
}
const DARK: Palette = {
  figure: figureDarkSrc,
  bg: 'rgb(10,16,24)',
  dim: 'rgba(6,10,16,0.34)',
  scrim: 'linear-gradient(to bottom, rgba(10,16,24,0.92) 0%, rgba(10,16,24,0.15) 11%, rgba(10,16,24,0.05) 55%, rgba(10,16,24,0.75) 74%, rgba(10,16,24,0.97) 100%)',
  // Dark halo behind each number so it reads over the bright figure (scales in em).
  cloud: '0 0 0.45em rgba(4,8,14,0.98), 0 0 0.9em rgba(4,8,14,0.9), 0 0 1.5em rgba(4,8,14,0.7)',
  green: 'rgb(74,222,128)', coral: 'rgb(232,83,79)', gray: 'rgb(146,161,186)', white: 'rgb(240,245,252)',
  blue: 'rgb(96,165,250)', violet: 'rgb(167,139,250)',
};
const LIGHT: Palette = {
  figure: figureLightSrc,
  bg: 'rgb(236,240,246)',
  dim: 'rgba(255,255,255,0.22)',
  scrim: 'linear-gradient(to bottom, rgba(238,241,246,0.9) 0%, rgba(238,241,246,0.1) 12%, rgba(238,241,246,0.03) 55%, rgba(238,241,246,0.68) 74%, rgba(238,241,246,0.95) 100%)',
  // Light halo so dark text separates from the busy figure.
  cloud: '0 0 0.45em rgba(248,250,252,0.98), 0 0 0.9em rgba(248,250,252,0.9), 0 0 1.5em rgba(248,250,252,0.72)',
  green: 'rgb(21,128,61)', coral: 'rgb(214,58,53)', gray: 'rgb(90,105,130)', white: 'rgb(40,52,72)',
  blue: 'rgb(37,99,235)', violet: 'rgb(124,58,237)',
};
const signColor = (sign: number | undefined, base: string, p: Palette) =>
  sign === undefined ? base : sign < 0 ? p.blue : sign > 0 ? p.violet : p.white;

// Row anchors, bottom-up: slot[0] sits lowest, columns collapse upward. Both
// left and right share these, so paired rows align (calmest ↔ breaths at row 1,
// restless ↔ breathing-range at row 0). row 0 sits low; row 1 a touch below mid.
const ROW_TOP = [48, 36, 22.1, 11.4];
const SIDE = '5.95%'; // v21 x=56 / 941
// The figure's own axis sits a hair right of centre (measured ~50.5% at the
// hero's height); shift the hero this much so the number + dot land on it.
const HERO_X = '0.8%';

function Slot({ value, caption, side, row, sign, p }: { value: string; caption: string; side: 'left' | 'right'; row: number; sign?: number; p: Palette }) {
  const align = side === 'left' ? 'text-left' : 'text-right';
  const pos = side === 'left' ? { left: SIDE } : { right: SIDE };
  return (
    <div className={`absolute ${align}`} style={{ ...pos, top: `${ROW_TOP[row]}%` }}>
      <div style={{ color: signColor(sign, p.green, p), fontSize: '8.9cqw', fontWeight: 700, lineHeight: 1, textShadow: p.cloud }} className="tabular-nums">{value}</div>
      {/* Caption +10%; explicit \n in the copy → exact 2-line layout (pre-line). */}
      <div style={{ color: p.gray, fontSize: '2.93cqw', lineHeight: 1.2, marginTop: '0.8cqw', whiteSpace: 'pre-line', textShadow: p.cloud }}>{caption}</div>
    </div>
  );
}

/**
 * The closing breathing figures (13 left, 6 right) with their lines — rendered
 * BELOW the card (in the home), not on the figure. Watch-only, like the
 * variability block it continues. Reads on the home background in both themes.
 */
export function BaselineClosingFooter({ data, source, light }: { data: BaselineData; source: BaselineSource; light?: boolean }) {
  const copy = useCardCopy();
  const model = buildCardModel(data.readings, data.extras, source, undefined, copy);
  if (!model.variability || !model.breathing) return null;
  const b = model.breathing;
  const textColor = light ? 'rgb(71,85,105)' : 'rgb(200,210,225)';
  const numColor = light ? 'rgb(21,128,61)' : 'rgb(74,222,128)';
  const Col = ({ num, text, align }: { num: string; text: string; align: 'left' | 'right' }) => (
    <div className={align === 'left' ? 'text-left' : 'text-right'}>
      <div className="text-[22px] font-bold tabular-nums leading-none" style={{ color: numColor }}>{num}</div>
      <div className="text-[13.5px] leading-snug mt-1.5 whitespace-pre-line" style={{ color: textColor }}>{text}</div>
    </div>
  );
  return (
    <div className="w-full font-mono grid grid-cols-2 gap-5 mt-4" style={{ paddingLeft: SIDE, paddingRight: SIDE }}>
      <Col num={b.leftNum} text={b.leftText} align="left" />
      <Col num={b.rightNum} text={b.rightText} align="right" />
    </div>
  );
}

export function BaselineCard({ data, source, emptyHint, liveHr, liveBr, shift, todayData, light }: {
  data: BaselineData | null;
  source: BaselineSource;
  emptyHint?: string;
  /** Light theme → the light figure + light scrims + dark text; else the dark set. */
  light?: boolean;
  /** Live pulse (Watch/camera) — when present the coral hero shows it in real
   *  time with a pulsing dot, and live breathing appears to its right (mirrors
   *  the Pulse | Breathing tiles above the card). Absent → the static baseline. */
  liveHr?: number | null;
  liveBr?: number | null;
  /** Shift view — flip the numbers to signed deltas from `todayData` vs baseline. */
  shift?: boolean;
  /** Today's same-shaped read (queryBaseline days=1) — the "today" side of Shift. */
  todayData?: BaselineData | null;
}) {
  // The card is ALWAYS on home once the user reaches it — it never unmounts, so
  // connecting a watch can only fill it, never make it disappear. With no data
  // yet it shows the figure + an invitation; camera/watch numbers pour in later.
  const { t } = useTranslation();
  const copy = useCardCopy();
  const p = light ? LIGHT : DARK;
  const shiftOn = !!shift && !!todayData;
  const model: CardModel | null = data
    ? buildCardModel(data.readings, data.extras, source, shiftOn ? { readings: todayData!.readings, extras: todayData!.extras } : undefined, copy)
    : null;
  const isEmpty = !model || model.empty;
  // Shift overrides the live hero — you're reading deltas, not the live pulse.
  const isLive = liveHr != null && !shiftOn;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl font-mono select-none"
      style={{ aspectRatio: '941 / 1672', containerType: 'inline-size', backgroundColor: p.bg }}
    >
      {/* Neon body figure (theme-swapped) */}
      <img src={p.figure} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-top" />
      {/* Uniform veil so every label reads better. */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: p.dim }} />
      {/* Scrims: fade top + bottom so the numbers and the closing lines stay legible over the figure. */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: p.scrim }} />

      {/* Empty state — figure + invitation, so the card is guaranteed on home. */}
      {isEmpty && emptyHint && (
        <div className="absolute w-full px-10 text-center" style={{ top: '40%' }}>
          <p style={{ color: p.white, fontSize: '3.8cqw', lineHeight: 1.5, textShadow: p.cloud }}>{emptyHint}</p>
        </div>
      )}

      {/* Hero — resting pulse on the chest. Live pulse (Watch/camera) replaces the
          static value in real time, with a soft pulsing dot beneath it. Nudged
          right by HERO_X so the number + dot sit on the figure's own axis. */}
      {(model?.hero || isLive) && (
        <div className="absolute w-full text-center" style={{ top: '20.5%', transform: `translateX(${HERO_X})` }}>
          <div style={{ color: shiftOn ? signColor(model?.hero?.sign, p.coral, p) : p.coral, fontSize: '13.2cqw', fontWeight: 800, lineHeight: 1, textShadow: shiftOn ? p.cloud : `${p.cloud}, 0 0 6cqw rgba(232,83,79,0.4)` }} className="tabular-nums">
            {isLive ? liveHr : model?.hero?.value}
          </div>
          {isLive ? (
            <div className="mx-auto rounded-full animate-pulse" style={{ width: '2.4cqw', height: '2.4cqw', background: p.coral, marginTop: '1.6cqw', boxShadow: '0 0 3.5cqw rgba(232,83,79,0.75)' }} />
          ) : (
            <>
              <div style={{ color: p.gray, fontSize: '2.94cqw', fontWeight: 500, letterSpacing: '0.05em', marginTop: '1cqw', textShadow: p.cloud }}>{model?.hero?.label}</div>
              <div style={{ color: p.gray, fontSize: '2.66cqw', opacity: 0.85, textShadow: p.cloud }}>{model?.hero?.sub}</div>
            </>
          )}
        </div>
      )}

      {/* Live breathing — right side, on the same row as the walking-pulse (109). */}
      {isLive && liveBr != null && (
        <div className="absolute text-right" style={{ right: SIDE, top: `${ROW_TOP[2]}%` }}>
          <div style={{ color: p.green, fontSize: '8.9cqw', fontWeight: 700, lineHeight: 1, textShadow: p.cloud }} className="tabular-nums">
            <span style={{ fontSize: '4.2cqw', opacity: 0.6 }}>≈</span>{Math.round(liveBr)}
          </div>
          <div style={{ color: p.gray, fontSize: '2.93cqw', marginTop: '0.8cqw', lineHeight: 1.2, whiteSpace: 'pre-line', textShadow: p.cloud }}>{t('baseline.live', 'breaths / min\nlive')}</div>
        </div>
      )}

      {/* Left / right numeric columns (collapse upward, paired levels) */}
      {model?.left.map((s, i) => <Slot key={`l${i}`} value={s.value} caption={s.caption} side="left" row={i} sign={s.sign} p={p} />)}
      {model?.right.map((s, i) => <Slot key={`r${i}`} value={s.value} caption={s.caption} side="right" row={i} sign={s.sign} p={p} />)}

      {/* Closing block — WATCH ONLY (needs HRV history). Sits low on the figure;
          the 39 / 62 ends align to the same vertical lines as the number columns,
          with their lines underneath at caption size. The breathing figures (13 /
          6) live BELOW the card, rendered by the home. */}
      {model?.variability && (
        <div className="absolute" style={{ top: '63%', left: SIDE, right: SIDE }}>
          <div className="text-center" style={{ color: p.gray, fontSize: '4.35cqw', fontWeight: 600, letterSpacing: '0.08em', textShadow: p.cloud }}>{copy.variability}</div>
          <div className="text-center" style={{ color: p.green, fontSize: '3.6cqw', marginTop: '1cqw', textShadow: p.cloud }}>{model.variability.caption}</div>
          {/* bar: 39 (aligned to the left column) — line — 62 (right column) */}
          <div className="flex items-center" style={{ marginTop: '3.4cqw', gap: '3cqw' }}>
            <div style={{ color: signColor(model.variability.minSign, p.white, p), fontSize: '7.3cqw', fontWeight: 700, lineHeight: 1, textShadow: p.cloud }} className="tabular-nums">{model.variability.min}</div>
            <div className="relative" style={{ flex: 1 }}>
              <div style={{ height: '0.32cqw', background: 'rgb(50,72,98)', borderRadius: 999 }} />
              <div className="absolute rounded-full" style={{
                width: '2cqw', height: '2cqw', background: p.green, top: '-0.84cqw',
                left: `calc(${Math.min(Math.max(model.variability.position, 0), 1) * 100}% - 1cqw)`,
              }} />
            </div>
            <div style={{ color: signColor(model.variability.maxSign, p.white, p), fontSize: '7.3cqw', fontWeight: 700, lineHeight: 1, textShadow: p.cloud }} className="tabular-nums">{model.variability.max}</div>
          </div>
          {/* lines under each end — caption size, aligned to the same lines */}
          <div className="flex justify-between" style={{ marginTop: '1.8cqw', gap: '4%' }}>
            <div className="text-left" style={{ color: p.white, fontSize: '2.93cqw', lineHeight: 1.25, whiteSpace: 'pre-line', textShadow: p.cloud }}>{model.variability.leftText}</div>
            <div className="text-right" style={{ color: p.white, fontSize: '2.93cqw', lineHeight: 1.25, whiteSpace: 'pre-line', textShadow: p.cloud }}>{model.variability.rightText}</div>
          </div>
        </div>
      )}
    </div>
  );
}
