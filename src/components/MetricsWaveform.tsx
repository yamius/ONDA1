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
// Stress/Energy теперь рисуются в delta-режиме (см. toDeltaPath),
// абсолютные PCT_MIN/PCT_MAX больше не используются — оставлены
// комментарием на случай отката.
// const PCT_MIN = 10; const PCT_MAX = 90;

// EMA-сглаживание для stress/energy.
// Raw-значения апдейтятся скачкообразно раз в ~5 сек. Без сглаживания
// плато → скачок → плато, причём stress и energy часто математически
// связаны (обратно коррелируют), и линии идут зеркально — некрасиво.
// HR не сглаживается — он и так приходит 1 Гц с watch, real-time.
const ALPHA_ENERGY = 0.20; // ~5 сек ramp
const ALPHA_STRESS = 0.05; // ~20 сек ramp (значительно медленнее)

// Временной сдвиг для stress — рисуем линию stress тем значением,
// что было STRESS_SHIFT_SAMPLES секунд назад. Реальный фазовый
// shift против energy: даже если raw-метрики идеально инверсные,
// после shift пики/минимумы попадают в разные точки оси X, и линии
// переплетаются, а не зеркалят.
const STRESS_SHIFT_SAMPLES = 10; // 10 сек запаздывания

const ema = (prev: number | null, raw: number | null, alpha: number): number | null => {
  if (raw == null || Number.isNaN(raw)) return prev;
  if (prev == null) return raw;
  return prev + alpha * (raw - prev);
};

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

  // EMA-state для stress/energy. Хранится между тиками сэмплинга.
  const smoothRef = useRef<{ stress: number | null; energy: number | null }>({
    stress: null,
    energy: null,
  });

  // Сэмплинг 1 Гц.
  useEffect(() => {
    const id = window.setInterval(() => {
      setBuffer((prev) => {
        const raw = latestRef.current;
        const sm = smoothRef.current;
        const newStress = ema(sm.stress, raw.stress, ALPHA_STRESS);
        const newEnergy = ema(sm.energy, raw.energy, ALPHA_ENERGY);
        smoothRef.current = { stress: newStress, energy: newEnergy };
        const next = prev.slice(1);
        next.push({ hr: raw.hr, stress: newStress, energy: newEnergy });
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
  const H = 200;
  const PAD = 4;

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

  // Delta-режим: значения отображаются как отклонение от mean по
  // буферу. Центр графика = текущий «обычный» уровень метрики; линия
  // уходит вверх когда значение растёт относительно своего среднего
  // за минуту, и вниз когда падает. Диапазон адаптивный — мин ±5%,
  // иначе по max|delta| * 1.2 чтобы заполнять весь график. Это даёт
  // видимость МАЛЕЙШИХ колебаний независимо от абсолютного уровня.
  // extractAt принимает индекс — позволяет вытаскивать значение из
  // buffer[i - shift] для временного сдвига линий друг относительно
  // друга (разносит зеркально коррелированные метрики по оси X).
  const toDeltaPath = (extractAt: (i: number) => number | null): string => {
    const values: Array<number | null> = [];
    let sum = 0;
    let count = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = extractAt(i);
      values.push(v);
      if (v != null && !Number.isNaN(v)) {
        sum += v;
        count++;
      }
    }
    if (count === 0) return '';
    const mean = sum / count;

    let maxAbsDelta = 0;
    for (const v of values) {
      if (v != null && !Number.isNaN(v)) {
        const d = Math.abs(v - mean);
        if (d > maxAbsDelta) maxAbsDelta = d;
      }
    }
    const range = Math.max(5, maxAbsDelta * 1.2);

    const pts: Array<[number, number]> = [];
    const halfH = H / 2;
    const usableHalf = halfH - PAD;
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      if (v == null || Number.isNaN(v)) continue;
      const delta = v - mean;
      const clamped = Math.max(-1, Math.min(1, delta / range));
      const x = PAD + (i / (BUFFER_SIZE - 1)) * (W - PAD * 2);
      // delta > 0 → линия идёт вверх (y меньше); < 0 → вниз.
      const y = halfH - clamped * usableHalf;
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
      style={{ width: '100%', height: 140, display: 'block' }}
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
          {/* Stress — delta + временной сдвиг на STRESS_SHIFT_SAMPLES сек,
              чтобы линия не зеркалила energy. Для первых SHIFT точек
              слева используем buffer[0].stress (flat-extension) —
              иначе линия не доходит до левого края. */}
          <path
            d={toDeltaPath((i) => {
              const idx = Math.max(0, i - STRESS_SHIFT_SAMPLES);
              return buffer[idx].stress;
            })}
            fill="none"
            stroke={colorStress}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Energy — delta в реальном времени */}
          <path
            d={toDeltaPath((i) => buffer[i].energy)}
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
