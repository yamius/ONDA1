import figureSrc from '../assets/baseline-figure.png';
import { buildCardModel, type CardModel } from '../lib/baseline-card';
import type { BaselineData, BaselineSource } from '../lib/baseline';

/**
 * In-app baseline card — the onda_card_v21 design in DOM: the neon body figure (baseline-figure.png)
 * with the numbers placed around it, resting pulse (coral) on the chest, the variability bar and the
 * closing lines below. Positions/colours/type mirror onda_card_render.py in a 941×1672 reference
 * frame; sizes are cqw (container-query units) so the whole card scales with its width.
 *
 * Fed by the 14-day HealthKit read (watch) or the practice session (camera). English copy matches the
 * v21 reference; localization follows once the visual is signed off. Share is deferred.
 */

const GREEN = 'rgb(74,222,128)';
const CORAL = 'rgb(232,83,79)';
const GRAY = 'rgb(146,161,186)';
const WHITE = 'rgb(240,245,252)';

// Soft dark "cloud" behind a number so it reads over the bright figure.
// Layered dark blur in em → scales with each number's own font-size.
const CLOUD = '0 0 0.45em rgba(4,8,14,0.98), 0 0 0.9em rgba(4,8,14,0.9), 0 0 1.5em rgba(4,8,14,0.7)';

// Row anchors, bottom-up: slot[0] sits lowest, columns collapse upward. Both
// left and right share these, so paired rows align (calmest ↔ breaths at row 1,
// restless ↔ breathing-range at row 0). row 0 sits low; row 1 a touch below mid.
const ROW_TOP = [48, 36, 22.1, 11.4];
const SIDE = '5.95%'; // v21 x=56 / 941
// The figure's own axis sits a hair right of centre (measured ~50.5% at the
// hero's height); shift the hero this much so the number + dot land on it.
const HERO_X = '0.8%';

function Slot({ value, caption, side, row }: { value: string; caption: string; side: 'left' | 'right'; row: number }) {
  const align = side === 'left' ? 'text-left' : 'text-right';
  const pos = side === 'left' ? { left: SIDE } : { right: SIDE };
  return (
    <div className={`absolute ${align}`} style={{ ...pos, top: `${ROW_TOP[row]}%` }}>
      <div style={{ color: GREEN, fontSize: '8.9cqw', fontWeight: 700, lineHeight: 1, textShadow: CLOUD }} className="tabular-nums">{value}</div>
      {/* Caption +10%; explicit \n in the copy → exact 2-line layout (pre-line). */}
      <div style={{ color: GRAY, fontSize: '2.93cqw', lineHeight: 1.2, marginTop: '0.8cqw', whiteSpace: 'pre-line', textShadow: CLOUD }}>{caption}</div>
    </div>
  );
}

/**
 * The closing breathing figures (13 left, 6 right) with their lines — rendered
 * BELOW the card (in the home), not on the figure. Watch-only, like the
 * variability block it continues. Reads on the home background in both themes.
 */
export function BaselineClosingFooter({ data, source, light }: { data: BaselineData; source: BaselineSource; light?: boolean }) {
  const model = buildCardModel(data.readings, data.extras, source);
  if (!model.variability || !model.breathing) return null;
  const b = model.breathing;
  const textColor = light ? 'rgb(71,85,105)' : 'rgb(200,210,225)';
  const Col = ({ num, text, align }: { num: string; text: string; align: 'left' | 'right' }) => (
    <div className={align === 'left' ? 'text-left' : 'text-right'}>
      <div className="text-[22px] font-bold tabular-nums leading-none" style={{ color: GREEN }}>{num}</div>
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

export function BaselineCard({ data, source, emptyHint, liveHr, liveBr }: {
  data: BaselineData | null;
  source: BaselineSource;
  emptyHint?: string;
  /** Live pulse (Watch/camera) — when present the coral hero shows it in real
   *  time with a pulsing dot, and live breathing appears to its right (mirrors
   *  the Pulse | Breathing tiles above the card). Absent → the static baseline. */
  liveHr?: number | null;
  liveBr?: number | null;
}) {
  // The card is ALWAYS on home once the user reaches it — it never unmounts, so
  // connecting a watch can only fill it, never make it disappear. With no data
  // yet it shows the figure + an invitation; camera/watch numbers pour in later.
  const model: CardModel | null = data ? buildCardModel(data.readings, data.extras, source) : null;
  const isEmpty = !model || model.empty;
  const isLive = liveHr != null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl font-mono select-none"
      style={{ aspectRatio: '941 / 1672', containerType: 'inline-size', backgroundColor: 'rgb(10,16,24)' }}
    >
      {/* Neon body figure */}
      <img src={figureSrc} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-top" />
      {/* Uniform dim over the whole figure so every label reads better. */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(6,10,16,0.34)' }} />
      {/* Scrims: darken top + bottom so the numbers and the closing lines stay legible over the figure. */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          'linear-gradient(to bottom, rgba(10,16,24,0.92) 0%, rgba(10,16,24,0.15) 11%, rgba(10,16,24,0.05) 55%, rgba(10,16,24,0.75) 74%, rgba(10,16,24,0.97) 100%)',
      }} />

      {/* Empty state — figure + invitation, so the card is guaranteed on home. */}
      {isEmpty && emptyHint && (
        <div className="absolute w-full px-10 text-center" style={{ top: '40%' }}>
          <p style={{ color: WHITE, fontSize: '3.8cqw', lineHeight: 1.5, textShadow: CLOUD }}>{emptyHint}</p>
        </div>
      )}

      {/* Hero — resting pulse on the chest. Live pulse (Watch/camera) replaces the
          static value in real time, with a soft pulsing dot beneath it. Nudged
          right by HERO_X so the number + dot sit on the figure's own axis. */}
      {(model?.hero || isLive) && (
        <div className="absolute w-full text-center" style={{ top: '20.5%', transform: `translateX(${HERO_X})` }}>
          <div style={{ color: CORAL, fontSize: '13.2cqw', fontWeight: 800, lineHeight: 1, textShadow: `${CLOUD}, 0 0 6cqw rgba(232,83,79,0.4)` }} className="tabular-nums">
            {isLive ? liveHr : model?.hero?.value}
          </div>
          {isLive ? (
            <div className="mx-auto rounded-full animate-pulse" style={{ width: '2.4cqw', height: '2.4cqw', background: CORAL, marginTop: '1.6cqw', boxShadow: '0 0 3.5cqw rgba(232,83,79,0.75)' }} />
          ) : (
            <>
              <div style={{ color: GRAY, fontSize: '2.94cqw', fontWeight: 500, letterSpacing: '0.05em', marginTop: '1cqw', textShadow: CLOUD }}>{model?.hero?.label}</div>
              <div style={{ color: GRAY, fontSize: '2.66cqw', opacity: 0.85, textShadow: CLOUD }}>{model?.hero?.sub}</div>
            </>
          )}
        </div>
      )}

      {/* Live breathing — right side, on the same row as the walking-pulse (109). */}
      {isLive && liveBr != null && (
        <div className="absolute text-right" style={{ right: SIDE, top: `${ROW_TOP[2]}%` }}>
          <div style={{ color: GREEN, fontSize: '8.9cqw', fontWeight: 700, lineHeight: 1, textShadow: CLOUD }} className="tabular-nums">
            <span style={{ fontSize: '4.2cqw', opacity: 0.6 }}>≈</span>{Math.round(liveBr)}
          </div>
          <div style={{ color: GRAY, fontSize: '2.93cqw', marginTop: '0.8cqw', lineHeight: 1.2, whiteSpace: 'pre-line', textShadow: CLOUD }}>{'breaths / min\nlive'}</div>
        </div>
      )}

      {/* Left / right numeric columns (collapse upward, paired levels) */}
      {model?.left.map((s, i) => <Slot key={`l${i}`} value={s.value} caption={s.caption} side="left" row={i} />)}
      {model?.right.map((s, i) => <Slot key={`r${i}`} value={s.value} caption={s.caption} side="right" row={i} />)}

      {/* Closing block — WATCH ONLY (needs HRV history). Sits low on the figure;
          the 39 / 62 ends align to the same vertical lines as the number columns,
          with their lines underneath at caption size. The breathing figures (13 /
          6) live BELOW the card, rendered by the home. */}
      {model?.variability && (
        <div className="absolute" style={{ top: '63%', left: SIDE, right: SIDE }}>
          <div className="text-center" style={{ color: GRAY, fontSize: '4.35cqw', fontWeight: 600, letterSpacing: '0.08em', textShadow: CLOUD }}>VARIABILITY</div>
          <div className="text-center" style={{ color: GREEN, fontSize: '3.6cqw', marginTop: '1cqw', textShadow: CLOUD }}>{model.variability.caption}</div>
          {/* bar: 39 (aligned to the left column) — line — 62 (right column) */}
          <div className="flex items-center" style={{ marginTop: '3.4cqw', gap: '3cqw' }}>
            <div style={{ color: WHITE, fontSize: '7.3cqw', fontWeight: 700, lineHeight: 1, textShadow: CLOUD }} className="tabular-nums">{model.variability.min}</div>
            <div className="relative" style={{ flex: 1 }}>
              <div style={{ height: '0.32cqw', background: 'rgb(50,72,98)', borderRadius: 999 }} />
              <div className="absolute rounded-full" style={{
                width: '2cqw', height: '2cqw', background: GREEN, top: '-0.84cqw',
                left: `calc(${Math.min(Math.max(model.variability.position, 0), 1) * 100}% - 1cqw)`,
              }} />
            </div>
            <div style={{ color: WHITE, fontSize: '7.3cqw', fontWeight: 700, lineHeight: 1, textShadow: CLOUD }} className="tabular-nums">{model.variability.max}</div>
          </div>
          {/* lines under each end — caption size, aligned to the same lines */}
          <div className="flex justify-between" style={{ marginTop: '1.8cqw', gap: '4%' }}>
            <div className="text-left" style={{ color: WHITE, fontSize: '2.93cqw', lineHeight: 1.25, whiteSpace: 'pre-line', textShadow: CLOUD }}>{model.variability.leftText}</div>
            <div className="text-right" style={{ color: WHITE, fontSize: '2.93cqw', lineHeight: 1.25, whiteSpace: 'pre-line', textShadow: CLOUD }}>{model.variability.rightText}</div>
          </div>
        </div>
      )}
    </div>
  );
}
