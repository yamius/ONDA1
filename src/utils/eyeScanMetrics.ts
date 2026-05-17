// Слой формул eye-scan: кадры скана → wellness-метрики. Чистые функции.
// Пороги и веса ниже — эвристики, клинически НЕ валидированы; их предстоит
// откалибровать на реальных данных. Это wellness-оценка, не диагностика.

/** Сырой сигнал одного кадра скана (извлечён из результата MediaPipe). */
export interface ScanSample {
  t: number; // время кадра, мс
  faceFound: boolean;
  blink: number; // закрытость глаз 0..1 (max L/R)
  gazeX: number; // взгляд по горизонтали, ~ -1..1
  gazeY: number; // взгляд по вертикали, ~ -1..1
  eyeOpenness: number; // открытость глаз 0..1
  headX: number; // опорная точка головы, нормированная 0..1
  headY: number;
}

/** Агрегаты по всему скану. */
export interface ScanAggregate {
  durationMs: number;
  sampleCount: number;
  faceFoundRatio: number; // доля кадров с лицом 0..1
  blinkRate: number; // морганий в минуту
  gazeStability: number; // 0..1 (1 = взгляд неподвижен)
  headSteadiness: number; // 0..1
  eyeOpennessAvg: number; // 0..1
}

/** Итоговые wellness-баллы, 0..100. */
export interface NervousSystemScores {
  calm: number;
  focus: number;
  fatigue: number;
  quality: number; // достоверность скана
}

const BLINK_THRESHOLD = 0.5; // порог фиксации моргания
const GAZE_STD_MAX = 0.18; // разброс взгляда, при котором стабильность = 0
const HEAD_STD_MAX = 0.05; // разброс головы, при котором устойчивость = 0
const CALM_BLINK_MAX = 18; // верх спокойного диапазона морганий/мин
const HIGH_BLINK = 32; // моргание, при котором «спокойствие» по морганию = 0

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}

function mean(xs: number[]): number {
  return xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length;
}

function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

/** Агрегирует кадры скана в сырые метрики. Чистая функция. */
export function aggregateSamples(samples: ScanSample[]): ScanAggregate {
  const base: ScanAggregate = {
    durationMs: 0,
    sampleCount: samples.length,
    faceFoundRatio: 0,
    blinkRate: 0,
    gazeStability: 0,
    headSteadiness: 0,
    eyeOpennessAvg: 0,
  };
  if (samples.length === 0) return base;

  const durationMs = Math.max(samples[samples.length - 1]!.t - samples[0]!.t, 0);
  const faces = samples.filter((s) => s.faceFound);
  const faceFoundRatio = faces.length / samples.length;
  if (faces.length === 0 || durationMs === 0) {
    return { ...base, durationMs, faceFoundRatio };
  }

  let blinks = 0;
  for (let i = 1; i < faces.length; i++) {
    if (faces[i - 1]!.blink < BLINK_THRESHOLD && faces[i]!.blink >= BLINK_THRESHOLD) {
      blinks++;
    }
  }

  const gazeStd =
    (stdDev(faces.map((s) => s.gazeX)) + stdDev(faces.map((s) => s.gazeY))) / 2;
  const headStd =
    (stdDev(faces.map((s) => s.headX)) + stdDev(faces.map((s) => s.headY))) / 2;

  return {
    durationMs,
    sampleCount: samples.length,
    faceFoundRatio,
    blinkRate: (blinks / durationMs) * 60000,
    gazeStability: clamp(1 - gazeStd / GAZE_STD_MAX, 0, 1),
    headSteadiness: clamp(1 - headStd / HEAD_STD_MAX, 0, 1),
    eyeOpennessAvg: mean(faces.map((s) => s.eyeOpenness)),
  };
}

/** Считает wellness-баллы из агрегатов. Чистая функция (эвристики). */
export function computeScores(agg: ScanAggregate): NervousSystemScores {
  const durationFactor = clamp(agg.durationMs / 20000, 0, 1);
  const quality = Math.round(agg.faceFoundRatio * durationFactor * 100);

  const blinkCalm =
    agg.blinkRate <= CALM_BLINK_MAX
      ? 1
      : clamp(1 - (agg.blinkRate - CALM_BLINK_MAX) / (HIGH_BLINK - CALM_BLINK_MAX), 0, 1);
  const calm = Math.round((blinkCalm * 0.5 + agg.gazeStability * 0.5) * 100);

  const focus = Math.round(
    (agg.gazeStability * 0.5 +
      agg.headSteadiness * 0.3 +
      clamp(agg.eyeOpennessAvg, 0, 1) * 0.2) *
      100,
  );

  const blinkFatigue = clamp(
    (agg.blinkRate - CALM_BLINK_MAX) / (HIGH_BLINK - CALM_BLINK_MAX),
    0,
    1,
  );
  const opennessFatigue = clamp(1 - agg.eyeOpennessAvg, 0, 1);
  const fatigue = Math.round((blinkFatigue * 0.6 + opennessFatigue * 0.4) * 100);

  return { calm, focus, fatigue, quality };
}

/** Состояние для подбора практик (совпадает с эмоциями адаптивных практик). */
export type RecommendedState = 'calmness' | 'anxiety' | 'fatigue';

/** Маппит баллы скана в состояние для подбора практик. Эвристика. */
export function recommendState(scores: NervousSystemScores): RecommendedState {
  if (scores.fatigue >= 50) return 'fatigue';
  if (scores.calm < 50) return 'anxiety';
  return 'calmness';
}

// Наборы практик по состояниям — id совпадают с каталогом AdaptivePracticeModal.
const PRACTICE_SETS: Record<RecommendedState, { id: string; labelKey: string }[]> = {
  calmness: [
    { id: 'earth_breath', labelKey: 'emotional_check.earth_breath' },
    { id: 'wave_pulse', labelKey: 'emotional_check.wave_pulse' },
    { id: 'still_form', labelKey: 'emotional_check.still_form' },
  ],
  anxiety: [
    { id: 'roots_breath', labelKey: 'emotional_check.roots_breath' },
    { id: 'earth_pulse', labelKey: 'emotional_check.earth_pulse' },
    { id: 'body_cocoon', labelKey: 'emotional_check.body_cocoon' },
  ],
  fatigue: [
    { id: 'slow_glow', labelKey: 'emotional_check.slow_glow' },
    { id: 'rest_breath', labelKey: 'emotional_check.rest_breath' },
    { id: 'warm_sphere', labelKey: 'emotional_check.warm_sphere' },
  ],
};

/** Рекомендованные практики по результату скана. */
export function recommendedPractices(
  scores: NervousSystemScores,
): { id: string; labelKey: string }[] {
  return PRACTICE_SETS[recommendState(scores)];
}
