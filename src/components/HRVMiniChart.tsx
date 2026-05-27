import { useTranslation } from 'react-i18next';
import type { HRVSample } from '../hooks/useHRV7Day';

interface HRVMiniChartProps {
  samples: HRVSample[];
  hasEnoughData: boolean;
  /** SVG view height in px. The component is full-width by default. */
  height?: number;
  /** Stroke + dot colour. Falls back to a calm indigo. */
  color?: string;
  className?: string;
}

/**
 * 7-day HRV trend visualised as a simple line + dots over an SVG canvas.
 *
 * Intentionally library-free: this view is on the cold-start path and
 * we already pay a heavy bundle for the main scene. A 60-line SVG
 * primitive renders in <1 ms and never invalidates layout.
 *
 * If we don't have ≥2 samples, the chart slot is replaced by a short
 * one-line stub explaining why — no awkward empty area, no half-drawn
 * line, no need for the caller to gate rendering.
 */
export function HRVMiniChart({
  samples,
  hasEnoughData,
  height = 72,
  color = '#7c7cf0',
  className,
}: HRVMiniChartProps) {
  const { t } = useTranslation();

  if (!hasEnoughData) {
    return (
      <div
        className={className}
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          opacity: 0.6,
          textAlign: 'center',
          padding: '0 12px',
        }}
      >
        {t('home.progress.chart_empty')}
      </div>
    );
  }

  // Layout: stretch x across [0, 100] viewBox units, y across [pad, h - pad]
  // — using a viewBox lets the SVG scale fluidly without us caring about
  // the real pixel width.
  const VB_W = 100;
  const VB_H = 100;
  const PAD_Y = 12;

  const values = samples.map(s => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // If every sample is identical we'd divide by zero; pin the range so
  // the line draws flat through the middle in that case.
  const span = max - min < 1e-6 ? 1 : max - min;

  const n = samples.length;
  const stepX = n > 1 ? VB_W / (n - 1) : 0;

  const points = samples.map((s, i) => {
    const x = i * stepX;
    const t = (s.value - min) / span; // 0..1
    // Invert y because SVG y grows downward; higher HRV → drawn higher.
    const y = VB_H - PAD_Y - t * (VB_H - PAD_Y * 2);
    return { x, y, value: s.value, date: s.date };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  return (
    <div className={className} style={{ width: '100%', height }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        role="img"
        aria-label={`HRV trend, last ${n} days`}
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          // preserveAspectRatio=none stretches the stroke — undo the
          // x-stretch so the line keeps a consistent thickness regardless
          // of container width.
          vectorEffect="non-scaling-stroke"
        />
        {points.map(p => (
          <circle
            key={p.date}
            cx={p.x}
            cy={p.y}
            r={2}
            fill={color}
            vectorEffect="non-scaling-stroke"
          >
            <title>{`${p.date}: ${Math.round(p.value)} ms`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

export default HRVMiniChart;
