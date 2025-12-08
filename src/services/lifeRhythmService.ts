/**
 * Life Rhythm Service
 * Анализирует паттерны сна и вычисляет метрики "ритма жизни"
 */

export interface SleepRecord {
  date: string;
  sleepStart: string;
  wakeTime: string;
  durationMin: number;
}

export interface LifeRhythmMetrics {
  sleepRegularity: number;
  wakeRegularity: number;
  durationScore: number;
  streak: number;
  overallScore: number;
  avgSleepTime: string;
  avgWakeTime: string;
  avgDurationHours: number;
  sleepDeviationMin: number;
  wakeDeviationMin: number;
  lastNightQuality: 'excellent' | 'good' | 'fair' | 'poor' | null;
}

const STORAGE_KEY = 'onda_life_rhythm_history';
const OPTIMAL_SLEEP_MIN = 420;
const OPTIMAL_SLEEP_MAX = 540;
const MAX_DEVIATION_MIN = 60;

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  let mins = totalMinutes;
  if (mins < 0) mins += 1440;
  if (mins >= 1440) mins -= 1440;
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function normalizeNightMinutes(minutes: number): number {
  if (minutes < 720) {
    return minutes + 1440;
  }
  return minutes;
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculateStdDev(values: number[], avg: number): number {
  if (values.length < 2) return 0;
  const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
}

export function loadSleepHistory(): SleepRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('[LifeRhythm] Failed to load history:', e);
  }
  return [];
}

export function saveSleepRecord(record: SleepRecord): void {
  try {
    const history = loadSleepHistory();
    const existingIndex = history.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      history[existingIndex] = record;
    } else {
      history.push(record);
    }
    
    const last30Days = history
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(last30Days));
    console.log('[LifeRhythm] Saved record:', record);
  } catch (e) {
    console.error('[LifeRhythm] Failed to save record:', e);
  }
}

export function calculateLifeRhythmMetrics(history: SleepRecord[]): LifeRhythmMetrics {
  const defaultMetrics: LifeRhythmMetrics = {
    sleepRegularity: 0,
    wakeRegularity: 0,
    durationScore: 0,
    streak: 0,
    overallScore: 0,
    avgSleepTime: '--:--',
    avgWakeTime: '--:--',
    avgDurationHours: 0,
    sleepDeviationMin: 0,
    wakeDeviationMin: 0,
    lastNightQuality: null
  };

  if (history.length === 0) {
    return defaultMetrics;
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sleepMinutes = sortedHistory.map(r => normalizeNightMinutes(timeToMinutes(r.sleepStart)));
  const wakeMinutes = sortedHistory.map(r => timeToMinutes(r.wakeTime));
  const durations = sortedHistory.map(r => r.durationMin);

  const avgSleepMin = calculateAverage(sleepMinutes);
  const avgWakeMin = calculateAverage(wakeMinutes);
  const avgDuration = calculateAverage(durations);

  const sleepStdDev = calculateStdDev(sleepMinutes, avgSleepMin);
  const wakeStdDev = calculateStdDev(wakeMinutes, avgWakeMin);

  const sleepRegularity = Math.max(0, Math.min(100, 100 - (sleepStdDev / MAX_DEVIATION_MIN) * 100));
  const wakeRegularity = Math.max(0, Math.min(100, 100 - (wakeStdDev / MAX_DEVIATION_MIN) * 100));

  let durationScore = 0;
  if (avgDuration >= OPTIMAL_SLEEP_MIN && avgDuration <= OPTIMAL_SLEEP_MAX) {
    durationScore = 100;
  } else if (avgDuration < OPTIMAL_SLEEP_MIN) {
    durationScore = Math.max(0, (avgDuration / OPTIMAL_SLEEP_MIN) * 100);
  } else {
    const excess = avgDuration - OPTIMAL_SLEEP_MAX;
    durationScore = Math.max(0, 100 - (excess / 60) * 20);
  }

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < sortedHistory.length; i++) {
    const recordDate = new Date(sortedHistory[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    const recordDateStr = recordDate.toISOString().split('T')[0];
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (recordDateStr === expectedDateStr) {
      const record = sortedHistory[i];
      const sleepDeviation = Math.abs(normalizeNightMinutes(timeToMinutes(record.sleepStart)) - avgSleepMin);
      const wakeDeviation = Math.abs(timeToMinutes(record.wakeTime) - avgWakeMin);
      const isGoodDuration = record.durationMin >= OPTIMAL_SLEEP_MIN * 0.85;
      
      if (sleepDeviation <= MAX_DEVIATION_MIN && wakeDeviation <= MAX_DEVIATION_MIN && isGoodDuration) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  const overallScore = Math.round(
    sleepRegularity * 0.25 +
    wakeRegularity * 0.25 +
    durationScore * 0.35 +
    Math.min(streak * 5, 15)
  );

  let lastNightQuality: 'excellent' | 'good' | 'fair' | 'poor' | null = null;
  if (sortedHistory.length > 0) {
    const lastNight = sortedHistory[0];
    const lastSleepDev = Math.abs(normalizeNightMinutes(timeToMinutes(lastNight.sleepStart)) - avgSleepMin);
    const lastWakeDev = Math.abs(timeToMinutes(lastNight.wakeTime) - avgWakeMin);
    const lastDurationOk = lastNight.durationMin >= OPTIMAL_SLEEP_MIN * 0.9;
    
    const qualityScore = (
      (lastSleepDev <= 30 ? 25 : lastSleepDev <= 60 ? 15 : 0) +
      (lastWakeDev <= 30 ? 25 : lastWakeDev <= 60 ? 15 : 0) +
      (lastDurationOk ? 50 : lastNight.durationMin >= OPTIMAL_SLEEP_MIN * 0.75 ? 30 : 10)
    );
    
    if (qualityScore >= 80) lastNightQuality = 'excellent';
    else if (qualityScore >= 60) lastNightQuality = 'good';
    else if (qualityScore >= 40) lastNightQuality = 'fair';
    else lastNightQuality = 'poor';
  }

  const normalizedAvgSleep = avgSleepMin >= 1440 ? avgSleepMin - 1440 : avgSleepMin;

  return {
    sleepRegularity: Math.round(sleepRegularity),
    wakeRegularity: Math.round(wakeRegularity),
    durationScore: Math.round(durationScore),
    streak,
    overallScore: Math.min(100, overallScore),
    avgSleepTime: minutesToTime(normalizedAvgSleep),
    avgWakeTime: minutesToTime(avgWakeMin),
    avgDurationHours: Math.round(avgDuration / 60 * 10) / 10,
    sleepDeviationMin: Math.round(sleepStdDev),
    wakeDeviationMin: Math.round(wakeStdDev),
    lastNightQuality
  };
}

export function processHealthKitSleepData(sleepData: {
  sleepStart?: string;
  wakeTime?: string;
  durationMin?: number;
} | null): SleepRecord | null {
  if (!sleepData?.sleepStart || !sleepData?.wakeTime || !sleepData?.durationMin) {
    return null;
  }

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  return {
    date: dateStr,
    sleepStart: sleepData.sleepStart,
    wakeTime: sleepData.wakeTime,
    durationMin: sleepData.durationMin
  };
}
