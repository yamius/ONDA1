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
  /** Force dark-theme line colors regardless of app theme. Used on the
   *  practice screen where the waveform sits over a dark HDR photo even
   *  when the app is in light mode. */
  forceDark?: boolean;
  /** Override the rendered pixel height (default 140). The practice-screen
   *  coherence hero uses a taller value. */
  heightPx?: number;
  /** Render only the HR line (the live coherence visual), hiding the
   *  stress/energy delta lines. Also thickens + glows the HR stroke. */
  hrOnly?: boolean;
  /** Emphasise one line: it renders thicker at full opacity while the other
   *  two dim. Driven by tapping the matching biometric card on the home
   *  screen. `null` → all three lines render normally. */
  highlight?: 'hr' | 'stress' | 'energy' | null;
  /** Light EMA on the HR line to ease the 1 Hz integer-bpm steps into a calm
   *  line (used for the rougher camera source). Keeps the slow RSA swing. */
  smoothHr?: boolean;
  /** Tone of the single hrOnly wave: rose for the camera PULSE wave, GOLD for
   *  COHERENCE (default). Keeps pulse vs coherence visually distinct + premium. */
  pulseTone?: boolean;
}

const WINDOW_SECONDS = 60;
const SAMPLE_HZ = 1;
// Видимое окно — WINDOW_SECONDS точек. Внутреннее хранилище длиннее на
// STRESS_SHIFT_SAMPLES, чтобы у stress-линии всегда было реальное
// прошлое значение для сдвига, а не flat-extension левого края.
const VISIBLE_SAMPLES = WINDOW_SECONDS * SAMPLE_HZ;
const BUFFER_SIZE = VISIBLE_SAMPLES + 10; // 10 = STRESS_SHIFT_SAMPLES (см. ниже)

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
// переплетаются, а не зеркалят. ВНИМАНИЕ: при изменении этого
// значения нужно обновить +10 в BUFFER_SIZE выше.
const STRESS_SHIFT_SAMPLES = 10; // 10 сек запаздывания

const ema = (prev: number | null, raw: number | null, alpha: number): number | null => {
  if (raw == null || Number.isNaN(raw)) return prev;
  if (prev == null) return raw;
  return prev + alpha * (raw - prev);
};

const norm = (v: number | null, min: number, max: number): number | null =>
  v == null || Number.isNaN(v) ? null : Math.max(0, Math.min(1, (v - min) / (max - min)));

const EMPTY_SAMPLE: Sample = { hr: null, stress: null, energy: null };

export function MetricsWaveform({
  heartRate,
  stress,
  energy,
  className = '',
  forceDark = false,
  heightPx,
  hrOnly = false,
  highlight = null,
  smoothHr = false,
  pulseTone = false,
}: MetricsWaveformProps) {
  // When a line is highlighted, thicken it and dim the other two.
  const lineW = (metric: 'hr' | 'stress' | 'energy', base: number) =>
    highlight === metric ? base + 1.8 : base;
  const lineOpacity = (metric: 'hr' | 'stress' | 'energy') =>
    !highlight || highlight === metric ? 1 : 0.3;
  // useTheme must be called unconditionally (rules of hooks); forceDark just
  // overrides the resolved value for color selection.
  const isLight = forceDark ? false : useTheme().resolved === 'light';
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

  // Видимые окна метрик. HR/Energy = последние VISIBLE_SAMPLES (realtime).
  // Stress сдвинут на STRESS_SHIFT_SAMPLES в прошлое — за счёт расширения
  // BUFFER_SIZE его линия имеет реальные старые значения и дотягивается
  // до левого края, без flat-extension.
  const realtimeSlice = buffer.slice(STRESS_SHIFT_SAMPLES);
  const stressSlice = buffer.slice(0, VISIBLE_SAMPLES);

  // Адаптивный потолок HR — считаем только по видимому окну HR, иначе
  // off-screen пик растягивал бы шкалу когда уже сам со сцены ушёл.
  let hrMaxObserved = -Infinity;
  for (const s of realtimeSlice) {
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
    samples: Sample[],
    extract: (s: Sample) => number | null,
    min: number,
    max: number,
  ): string => {
    // Split into separate sub-paths at gaps (null runs) so a dropout BREAKS the
    // line instead of being bridged by one long diagonal back to the next point.
    let d = '';
    let seg: Array<[number, number]> = [];
    const flush = () => {
      if (seg.length) { d += (d ? ' ' : '') + smoothPath(seg); seg = []; }
    };
    for (let i = 0; i < samples.length; i++) {
      const nv = norm(extract(samples[i]), min, max);
      if (nv == null) { flush(); continue; }
      const x = PAD + (i / (samples.length - 1)) * (W - PAD * 2);
      const y = H - PAD - nv * (H - PAD * 2);
      seg.push([x, y]);
    }
    flush();
    return d;
  };

  // Delta-режим: значения отображаются как отклонение от mean по
  // переданному окну. Центр графика = текущий «обычный» уровень
  // метрики; линия уходит вверх когда значение растёт относительно
  // своего среднего за окно, и вниз когда падает. Диапазон адаптивный —
  // мин ±5%, иначе по max|delta| * 1.2.
  const toDeltaPath = (
    samples: Sample[],
    extract: (s: Sample) => number | null,
    minRange = 5,
    smooth = false,
  ): string => {
    const values: Array<number | null> = samples.map(extract);
    // Optional light EMA (per contiguous run, resets on gaps) — eases the 1 Hz
    // integer-bpm camera steps into a calm line without killing the slow RSA.
    if (smooth) {
      let e: number | null = null;
      for (let i = 0; i < values.length; i++) {
        const v = values[i];
        if (v == null || Number.isNaN(v)) { e = null; continue; }
        e = e == null ? v : e + 0.35 * (v - e);
        values[i] = e;
      }
    }
    let sum = 0;
    let count = 0;
    for (const v of values) {
      if (v != null && !Number.isNaN(v)) { sum += v; count++; }
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
    // Amplitude floor: when the real variation is tiny, `range` stays at
    // `minRange` so a near-flat signal renders modestly instead of blowing
    // micro-noise up to fill the window. Above the floor, scaling is linear
    // in the real delta — morphology preserved, only the span adapts.
    const range = Math.max(minRange, maxAbsDelta * 1.2);

    const halfH = H / 2;
    const usableHalf = halfH - PAD;
    // Break the line at gaps (null runs) — a dropout interrupts the trace
    // cleanly instead of being bridged by a long diagonal to the next sample.
    let d = '';
    let seg: Array<[number, number]> = [];
    const flush = () => {
      if (seg.length) { d += (d ? ' ' : '') + smoothPath(seg); seg = []; }
    };
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      if (v == null || Number.isNaN(v)) { flush(); continue; }
      const delta = v - mean;
      const clamped = Math.max(-1, Math.min(1, delta / range));
      const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
      const y = halfH - clamped * usableHalf;
      seg.push([x, y]);
    }
    flush();
    return d;
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
  // The single hrOnly wave reads ORANGE for coherence (warm + distinct from the
  // rose PULSE wave so a user never confuses the two); camera pulse stays rose.
  const colorCoherence = isLight ? 'rgba(234,88,12,0.95)' : 'rgba(251,146,60,0.97)';
  const hrLineColor = hrOnly ? (pulseTone ? colorHR : colorCoherence) : colorHR;
  const hrGlow = pulseTone ? 'rgba(251,113,133,0.45)' : 'rgba(251,146,60,0.5)';

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{
        width: '100%',
        height: heightPx ?? 140,
        display: 'block',
        // Soft glow makes the HR line read as "alive" over the dark practice
        // backdrop. Cheap CSS filter, only on the coherence-hero variant.
        filter: hrOnly ? `drop-shadow(0 0 6px ${hrGlow})` : undefined,
      }}
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
          {/* Stress + Energy delta lines — hidden in hrOnly (coherence-hero)
              mode so the single HR-RSA line reads cleanly as "your coherence". */}
          {!hrOnly && (
            <>
              {/* Stress — delta из stressSlice (буфер сдвинут на
                  STRESS_SHIFT_SAMPLES в прошлое относительно HR/energy).
                  Линия дотягивается до левого края с реальными старыми
                  значениями stress, переплетение с energy сохраняется. */}
              <path
                d={toDeltaPath(stressSlice, (s) => s.stress)}
                fill="none"
                stroke={colorStress}
                strokeWidth={lineW('stress', 1.5)}
                opacity={lineOpacity('stress')}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Energy — delta в реальном времени (realtimeSlice) */}
              <path
                d={toDeltaPath(realtimeSlice, (s) => s.energy)}
                fill="none"
                stroke={colorEnergy}
                opacity={lineOpacity('energy')}
                strokeWidth={lineW('energy', 1.5)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
          {/* HR — самая толстая, рисуется последней, чтобы быть сверху.
              hrOnly (practice coherence hero): delta-from-running-mean +
              auto-scale, so the breathing-driven RSA swings fill the window
              and read as a coherence wave — coherence is about the *rhythm*,
              not the absolute bpm (which lives as its own number on the
              dashboard). Honesty: linear gain on the real delta + amplitude
              floor (minRange 6 bpm), SAME Catmull-Rom as the absolute line —
              no extra smoothing, morphology preserved (smooth breath → smooth
              wave; ragged → ragged; flat → modest, never noise blown up for
              drama). Non-hrOnly (home dashboard): keeps the absolute 50–110
              scale so the bpm level reads alongside stress/energy. */}
          <path
            d={hrOnly
              ? toDeltaPath(realtimeSlice, (s) => s.hr, 6, smoothHr)
              : toPath(realtimeSlice, (s) => s.hr, HR_MIN, hrMax)}
            fill="none"
            stroke={hrLineColor}
            strokeWidth={hrOnly ? 3.5 : lineW('hr', 2.5)}
            opacity={hrOnly ? 1 : lineOpacity('hr')}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
