import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';

/**
 * MetricsWaveform — объединённый график пульса, стресса и энергии
 * под карточками биометрии на хабе.
 *
 *   • Окно 60 секунд при сэмплинге 1 Гц (60 точек).
 *   • 3 наложенные линии разной толщины: HR — толстая (доминанта),
 *     stress + energy — средние.
 *   • Когда трекер не подключён и метрик нет — рисуется дышащая
 *     sin-волна как бренд-якорь «ONDA» (вместо пустого места).
 *   • SVG, без зависимостей. Ring-buffer живёт в state компонента,
 *     сохраняется только на время сессии.
 */
interface Sample {
  hr: number | null;
  stress: number | null;
  energy: number | null;
}

interface MetricsWaveformProps {
  heartRate: number | null | undefined;
  stress: number | null | undefined;
  energy: number | null | undefined;
  className?: string;
}

const WINDOW_SECONDS = 60;
const SAMPLE_HZ = 1;
const BUFFER_SIZE = WINDOW_SECONDS * SAMPLE_HZ;

// Физиологические диапазоны для нормализации в [0, 1].
const HR_MIN = 40;
const HR_MAX = 180;
const PCT_MIN = 0;
const PCT_MAX = 100;

const norm = (v: number | null, min: number, max: number): number | null =>
  v == null || Number.isNaN(v) ? null : Math.max(0, Math.min(1, (v - min) / (max - min)));

const EMPTY_SAMPLE: Sample = { hr: null, stress: null, energy: null };

export function MetricsWaveform({ heartRate, stress, energy, className = '' }: MetricsWaveformProps) {
  const isLight = useTheme().resolved === 'light';
  const [buffer, setBuffer] = useState<Sample[]>(() =>
    Array.from({ length: BUFFER_SIZE }, () => EMPTY_SAMPLE),
  );
  const [phase, setPhase] = useState(0);

  // Свежие значения держим в ref, чтобы интервал сэмплинга не пересоздавался
  // на каждом обновлении метрик.
  const latestRef = useRef<Sample>(EMPTY_SAMPLE);
  latestRef.current = {
    hr: heartRate ?? null,
    stress: stress ?? null,
    energy: energy ?? null,
  };

  // Сэмплинг 1 Гц.
  useEffect(() => {
    const id = window.setInterval(() => {
      setBuffer((prev) => {
        const next = prev.slice(1);
        next.push({ ...latestRef.current });
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const noData = buffer.every(
    (s) => s.hr == null && s.stress == null && s.energy == null,
  );

  // Дышащая sin-волна работает только когда нет данных.
  // Throttle ~30 FPS — экономим CPU на хабе.
  useEffect(() => {
    if (!noData) return;
    let raf = 0;
    let last = 0;
    const tick = (ts: number) => {
      if (ts - last > 33) {
        setPhase((p) => (p + 0.04) % (Math.PI * 2));
        last = ts;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [noData]);

  // ViewBox используем фиксированный, ширину тянем через style — preserveAspectRatio=none.
  const W = 600;
  const H = 100;
  const PAD = 8;

  const toPoints = (
    extract: (s: Sample) => number | null,
    min: number,
    max: number,
  ): string => {
    const out: string[] = [];
    for (let i = 0; i < buffer.length; i++) {
      const nv = norm(extract(buffer[i]), min, max);
      if (nv == null) continue;
      const x = PAD + (i / (BUFFER_SIZE - 1)) * (W - PAD * 2);
      const y = H - PAD - nv * (H - PAD * 2);
      out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return out.join(' ');
  };

  // 2 длины волны на всю ширину, амплитуда ~22% высоты.
  const sinPath = (() => {
    if (!noData) return '';
    const out: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = PAD + (i / steps) * (W - PAD * 2);
      const wave = Math.sin((i / steps) * Math.PI * 4 + phase);
      const y = H / 2 + wave * (H * 0.22);
      out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return out.join(' ');
  })();

  // Цвета линий. Светлая тема — чуть прозрачнее и темнее (чтобы читалось
  // на белом фоне); тёмная — насыщеннее и ярче (поверх dark gradient).
  const colorHR = isLight ? 'rgba(244,63,94,0.85)' : 'rgba(251,113,133,0.9)';
  const colorStress = isLight ? 'rgba(249,115,22,0.65)' : 'rgba(251,146,60,0.8)';
  const colorEnergy = isLight ? 'rgba(59,130,246,0.65)' : 'rgba(96,165,250,0.8)';
  const colorIdle = isLight ? 'rgba(99,102,241,0.35)' : 'rgba(199,210,254,0.45)';

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: 72, display: 'block' }}
      aria-hidden="true"
    >
      {noData ? (
        <polyline
          points={sinPath}
          fill="none"
          stroke={colorIdle}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          {/* Stress — снизу, средняя толщина */}
          <polyline
            points={toPoints((s) => s.stress, PCT_MIN, PCT_MAX)}
            fill="none"
            stroke={colorStress}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Energy — средняя толщина */}
          <polyline
            points={toPoints((s) => s.energy, PCT_MIN, PCT_MAX)}
            fill="none"
            stroke={colorEnergy}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* HR — самая толстая, рисуется последней, чтобы быть сверху */}
          <polyline
            points={toPoints((s) => s.hr, HR_MIN, HR_MAX)}
            fill="none"
            stroke={colorHR}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
