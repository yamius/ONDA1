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
// HR_MAX — базовый «потолок в покое», но используется адаптивно
// (см. ниже): если наблюдаемый пульс в буфере уходит выше — диапазон
// сам расширяется, чтобы линия не упиралась в верх графика.
const HR_MIN = 50;
const HR_MAX_BASE = 110;
const HR_HEADROOM = 5;
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

  // Адаптивный потолок HR: если наблюдаемый пульс в буфере уходит
  // выше базовых 110 bpm — расширяем шкалу, чтобы линия не упиралась
  // в верх графика. Когда пульс возвращается в покой — потолок сам
  // подтягивается обратно к 110. headroom +5 чтобы линия не липла к
  // самой кромке.
  let hrMaxObserved = -Infinity;
  for (const s of buffer) {
    if (s.hr != null && !Number.isNaN(s.hr) && s.hr > hrMaxObserved) {
      hrMaxObserved = s.hr;
    }
  }
  const hrMax = Number.isFinite(hrMaxObserved)
    ? Math.max(HR_MAX_BASE, hrMaxObserved + HR_HEADROOM)
    : HR_MAX_BASE;

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
  const H = 140;
  const PAD = 6;

  // Catmull-Rom → cubic Bezier (tension 1/6). Сглаживает резкие
  // ступеньки (например stress/energy который обновляется раз в 5 сек).
  const smoothPath = (pts: Array<[number, number]>): string => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M${pts[0][0]},${pts[0][1]}`;
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? pts[i + 1];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };

  const toPath = (
    extract: (s: Sample) => number | null,
    min: number,
    max: number,
  ): string => {
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < buffer.length; i++) {
      const nv = norm(extract(buffer[i]), min, max);
      if (nv == null) continue;
      const x = PAD + (i / (BUFFER_SIZE - 1)) * (W - PAD * 2);
      const y = H - PAD - nv * (H - PAD * 2);
      pts.push([x, y]);
    }
    return smoothPath(pts);
  };

  // 2 длины волны на всю ширину, амплитуда ~28% высоты.
  const sinPathD = (() => {
    if (!noData) return '';
    const pts: Array<[number, number]> = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = PAD + (i / steps) * (W - PAD * 2);
      const wave = Math.sin((i / steps) * Math.PI * 4 + phase);
      const y = H / 2 + wave * (H * 0.28);
      pts.push([x, y]);
    }
    return smoothPath(pts);
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
      style={{ width: '100%', height: 96, display: 'block' }}
      aria-hidden="true"
    >
      {noData ? (
        <path
          d={sinPathD}
          fill="none"
          stroke={colorIdle}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          {/* Stress — средняя толщина */}
          <path
            d={toPath((s) => s.stress, PCT_MIN, PCT_MAX)}
            fill="none"
            stroke={colorStress}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Energy — средняя толщина */}
          <path
            d={toPath((s) => s.energy, PCT_MIN, PCT_MAX)}
            fill="none"
            stroke={colorEnergy}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* HR — самая толстая, рисуется последней, чтобы быть сверху */}
          <path
            d={toPath((s) => s.hr, HR_MIN, hrMax)}
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
