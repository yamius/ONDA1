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

// Row anchors (v21 y / 1672), bottom-up: slot[0] sits lowest and the column collapses upward.
const ROW_TOP = [44.9, 33.5, 22.1, 11.4];
const SIDE = '5.95%'; // v21 x=56 / 941

function Slot({ value, caption, side, row, offsetY }: { value: string; caption: string; side: 'left' | 'right'; row: number; offsetY?: string }) {
  const align = side === 'left' ? 'text-left' : 'text-right';
  const pos = side === 'left' ? { left: SIDE } : { right: SIDE };
  const top = offsetY ? `calc(${ROW_TOP[row]}% + ${offsetY})` : `${ROW_TOP[row]}%`;
  return (
    <div className={`absolute ${align}`} style={{ ...pos, top }}>
      <div style={{ color: GREEN, fontSize: '8.9cqw', fontWeight: 700, lineHeight: 1, textShadow: CLOUD }} className="tabular-nums">{value}</div>
      <div style={{ color: GRAY, fontSize: '2.66cqw', marginTop: '0.6cqw', textShadow: CLOUD }}>{caption}</div>
    </div>
  );
}

export function BaselineCard({ data, source }: { data: BaselineData; source: BaselineSource }) {
  const model: CardModel = buildCardModel(data.readings, data.extras, source);
  if (model.empty) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl font-mono select-none"
      style={{ aspectRatio: '941 / 1672', containerType: 'inline-size', backgroundColor: 'rgb(10,16,24)' }}
    >
      {/* Neon body figure */}
      <img src={figureSrc} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-top" />
      {/* Scrims: darken top + bottom so the numbers and the closing lines stay legible over the figure. */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          'linear-gradient(to bottom, rgba(10,16,24,0.92) 0%, rgba(10,16,24,0.15) 11%, rgba(10,16,24,0.05) 55%, rgba(10,16,24,0.75) 74%, rgba(10,16,24,0.97) 100%)',
      }} />

      {/* Hero — resting pulse on the chest */}
      {model.hero && (
        <div className="absolute w-full text-center" style={{ top: '20.5%' }}>
          <div style={{ color: CORAL, fontSize: '13.2cqw', fontWeight: 800, lineHeight: 1, textShadow: `${CLOUD}, 0 0 6cqw rgba(232,83,79,0.4)` }} className="tabular-nums">
            {model.hero.value}
          </div>
          <div style={{ color: GRAY, fontSize: '2.94cqw', fontWeight: 500, letterSpacing: '0.05em', marginTop: '1cqw', textShadow: CLOUD }}>{model.hero.label}</div>
          <div style={{ color: GRAY, fontSize: '2.66cqw', opacity: 0.85, textShadow: CLOUD }}>{model.hero.sub}</div>
        </div>
      )}

      {/* Left / right numeric columns (collapse upward) */}
      {/* left[1] = calmest-night ("68") sits half a number lower, per device review. */}
      {model.left.map((s, i) => <Slot key={`l${i}`} value={s.value} caption={s.caption} side="left" row={i} offsetY={i === 1 ? '4.45cqw' : undefined} />)}
      {model.right.map((s, i) => <Slot key={`r${i}`} value={s.value} caption={s.caption} side="right" row={i} />)}

      {/* Variability bar + closing lines */}
      {model.variability && (
        <div className="absolute w-full text-center" style={{ top: '60%' }}>
          <div style={{ color: GRAY, fontSize: '2.1cqw', fontWeight: 500, letterSpacing: '0.08em', textShadow: CLOUD }}>VARIABILITY</div>
          <div style={{ color: GREEN, fontSize: '2cqw', marginTop: '0.6cqw', textShadow: CLOUD }}>{model.variability.caption}</div>
          <div className="relative" style={{ margin: '2.6cqw 18% 0' }}>
            <div style={{ height: '0.32cqw', background: 'rgb(50,72,98)', borderRadius: 999 }} />
            <div className="absolute rounded-full" style={{
              width: '2cqw', height: '2cqw', background: GREEN, top: '-0.84cqw',
              left: `calc(${Math.min(Math.max(model.variability.position, 0), 1) * 100}% - 1cqw)`,
            }} />
            <div className="absolute" style={{ color: WHITE, fontSize: '7.3cqw', fontWeight: 700, right: 'calc(100% + 2cqw)', top: '-4.1cqw', textShadow: CLOUD }}>{model.variability.min}</div>
            <div className="absolute" style={{ color: WHITE, fontSize: '7.3cqw', fontWeight: 700, left: 'calc(100% + 2cqw)', top: '-4.1cqw', textShadow: CLOUD }}>{model.variability.max}</div>
          </div>
          <div style={{ color: WHITE, fontSize: '2.4cqw', marginTop: '5cqw', lineHeight: 1.5 }}>
            <div>{model.variability.lineOne}</div>
            <div>{model.variability.lineTwo}</div>
          </div>
        </div>
      )}

      {/* Breathing closing lines */}
      {model.breathing && (
        <div className="absolute w-full text-center" style={{ top: '77.5%' }}>
          <div style={{ color: WHITE, fontSize: '2.4cqw', lineHeight: 1.5 }}>{model.breathing.lineOne}</div>
          <div style={{ color: GREEN, fontSize: '2.4cqw', lineHeight: 1.5 }}>{model.breathing.lineTwo}</div>
          <div style={{ color: GREEN, fontSize: '2.4cqw', lineHeight: 1.5 }}>{model.breathing.lineThree}</div>
        </div>
      )}
    </div>
  );
}
