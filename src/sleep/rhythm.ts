/**
 * Unified Life Rhythm Store
 * Объединённое хранилище для артефакта "Ритм Жизни"
 * 
 * Механизм работы:
 * 1. Данные сна приходят из HealthKit (Apple Watch → приложение "Сон")
 * 2. При старте приложения синхронизируем данные за последние 14 дней
 * 3. Считаем streak "хороших" дней подряд (одинаковое время сна/подъёма)
 * 4. При streak >= 7 дней → артефакт активен → +100% OND
 */

import { Capacitor } from '@capacitor/core';
import HealthKitHeartRate from '../plugins/healthKitHeartRate';

export type DaySleep = {
  date: string;
  sleepStart: string;  // HH:MM формат
  wakeTime: string;    // HH:MM формат
  durationMin: number;
};

export type LifeRhythmMetrics = {
  progress: number;           // 0-7 дней streak
  avgSleepTime: string;       // Среднее время засыпания
  avgWakeTime: string;        // Среднее время пробуждения
  avgDurationHours: number;   // Средняя длительность сна
  sleepRegularity: number;    // % регулярности засыпания
  wakeRegularity: number;     // % регулярности пробуждения
  overallScore: number;       // Общий score 0-100
  lastNightQuality: 'excellent' | 'good' | 'fair' | 'poor' | null;
};

const KEY = "onda_rhythm_unified_v2";
const MAX_DEVIATION_MIN = 30;    // Максимальное отклонение для "хорошего" дня
const MIN_DURATION_MIN = 360;    // Минимум 6 часов сна
const OPTIMAL_SLEEP_MIN = 420;   // Оптимум 7 часов
const OPTIMAL_SLEEP_MAX = 540;   // Максимум 9 часов

// === Утилиты ===

function hmToMin(x: string): number {
  const [h, m] = x.split(":").map(Number);
  return h * 60 + m;
}

function minToHm(totalMin: number): string {
  let mins = Math.round(totalMin); // Round to avoid float issues
  if (mins < 0) mins += 1440;
  if (mins >= 1440) mins -= 1440;
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Нормализация времени засыпания (ночные часы > 720 минут от полуночи)
function normalizeNightMinutes(minutes: number): number {
  if (minutes < 720) {
    return minutes + 1440; // Если до полудня - это раннее утро, добавляем сутки
  }
  return minutes;
}

function stddev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) * (x - m), 0) / arr.length);
}

function average(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// === Storage ===

function load(): DaySleep[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(days: DaySleep[]) {
  if (typeof window === "undefined") return;
  // Храним только последние 30 дней
  const sorted = days.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  localStorage.setItem(KEY, JSON.stringify(sorted));
}

// === Main Store ===

export const rhythmStore = {
  /**
   * Добавить/обновить запись о сне
   */
  addDay(d: DaySleep) {
    const days = load().filter((x) => x.date !== d.date);
    days.push(d);
    save(days);
    console.log('[Rhythm] Added day:', d);
  },

  /**
   * Получить все записи
   */
  getLog(): DaySleep[] {
    return load().sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Сбросить все данные
   */
  reset() {
    save([]);
    console.log('[Rhythm] Reset');
  },

  /**
   * Рассчитать прогресс артефакта (0-7)
   * Возвращает количество "хороших" дней подряд
   */
  progress(): number {
    const days = load();
    if (!days.length) return 0;

    // Сортируем по дате (новые первые)
    const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date));
    
    // Берём последние 14 дней для анализа
    const tail = sorted.slice(0, 14);
    if (tail.length < 2) return tail.length;

    // Считаем средние значения
    const sleepMins = tail.map(d => normalizeNightMinutes(hmToMin(d.sleepStart)));
    const wakeMins = tail.map(d => hmToMin(d.wakeTime));
    const avgSleep = average(sleepMins);
    const avgWake = average(wakeMins);

    // Считаем streak от сегодня назад
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < tail.length; i++) {
      const record = tail[i];
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      // Проверяем что это последовательный день
      const expectedStr = expectedDate.toISOString().split('T')[0];
      
      if (record.date !== expectedStr) {
        break; // Пропуск дня - streak прерывается
      }
      
      // Проверяем качество дня
      const sleepDev = Math.abs(normalizeNightMinutes(hmToMin(record.sleepStart)) - avgSleep);
      const wakeDev = Math.abs(hmToMin(record.wakeTime) - avgWake);
      const durationOK = record.durationMin >= MIN_DURATION_MIN;
      
      if (sleepDev <= MAX_DEVIATION_MIN && wakeDev <= MAX_DEVIATION_MIN && durationOK) {
        streak++;
      } else {
        break; // Плохой день - streak прерывается
      }
    }
    
    return Math.min(streak, 7);
  },

  /**
   * Получить полные метрики
   */
  getMetrics(): LifeRhythmMetrics {
    const days = load();
    
    const defaultMetrics: LifeRhythmMetrics = {
      progress: 0,
      avgSleepTime: '--:--',
      avgWakeTime: '--:--',
      avgDurationHours: 0,
      sleepRegularity: 0,
      wakeRegularity: 0,
      overallScore: 0,
      lastNightQuality: null
    };

    if (days.length === 0) return defaultMetrics;

    const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date));
    
    const sleepMins = sorted.map(d => normalizeNightMinutes(hmToMin(d.sleepStart)));
    const wakeMins = sorted.map(d => hmToMin(d.wakeTime));
    const durations = sorted.map(d => d.durationMin);

    const avgSleep = average(sleepMins);
    const avgWake = average(wakeMins);
    const avgDuration = average(durations);

    const sleepStdDev = stddev(sleepMins);
    const wakeStdDev = stddev(wakeMins);

    // Регулярность: 100% если stddev=0, 0% если stddev>=60 мин
    const sleepRegularity = Math.max(0, Math.min(100, 100 - (sleepStdDev / 60) * 100));
    const wakeRegularity = Math.max(0, Math.min(100, 100 - (wakeStdDev / 60) * 100));

    // Score длительности
    let durationScore = 0;
    if (avgDuration >= OPTIMAL_SLEEP_MIN && avgDuration <= OPTIMAL_SLEEP_MAX) {
      durationScore = 100;
    } else if (avgDuration < OPTIMAL_SLEEP_MIN) {
      durationScore = Math.max(0, (avgDuration / OPTIMAL_SLEEP_MIN) * 100);
    } else {
      const excess = avgDuration - OPTIMAL_SLEEP_MAX;
      durationScore = Math.max(0, 100 - (excess / 60) * 20);
    }

    const progress = this.progress();
    
    // Общий score
    const overallScore = Math.round(
      sleepRegularity * 0.25 +
      wakeRegularity * 0.25 +
      durationScore * 0.35 +
      Math.min(progress * 2, 15) // Бонус за streak
    );

    // Качество последней ночи
    let lastNightQuality: 'excellent' | 'good' | 'fair' | 'poor' | null = null;
    if (sorted.length > 0) {
      const last = sorted[0];
      const lastSleepDev = Math.abs(normalizeNightMinutes(hmToMin(last.sleepStart)) - avgSleep);
      const lastWakeDev = Math.abs(hmToMin(last.wakeTime) - avgWake);
      
      const qualityScore = (
        (lastSleepDev <= 15 ? 30 : lastSleepDev <= 30 ? 20 : lastSleepDev <= 60 ? 10 : 0) +
        (lastWakeDev <= 15 ? 30 : lastWakeDev <= 30 ? 20 : lastWakeDev <= 60 ? 10 : 0) +
        (last.durationMin >= OPTIMAL_SLEEP_MIN ? 40 : last.durationMin >= MIN_DURATION_MIN ? 25 : 10)
      );
      
      if (qualityScore >= 80) lastNightQuality = 'excellent';
      else if (qualityScore >= 60) lastNightQuality = 'good';
      else if (qualityScore >= 40) lastNightQuality = 'fair';
      else lastNightQuality = 'poor';
    }

    const normalizedAvgSleep = avgSleep >= 1440 ? avgSleep - 1440 : avgSleep;

    return {
      progress,
      avgSleepTime: minToHm(normalizedAvgSleep),
      avgWakeTime: minToHm(avgWake),
      avgDurationHours: Math.round(avgDuration / 60 * 10) / 10,
      sleepRegularity: Math.round(sleepRegularity),
      wakeRegularity: Math.round(wakeRegularity),
      overallScore: Math.min(100, overallScore),
      lastNightQuality
    };
  },

  /**
   * Синхронизировать данные из HealthKit
   * Вызывать при старте приложения на iOS
   * Загружает историю сна за последние 14 дней
   */
  async syncFromHealthKit(): Promise<boolean> {
    if (Capacitor.getPlatform() !== 'ios') {
      console.log('[Rhythm] Not iOS, skipping HealthKit sync');
      return false;
    }

    try {
      console.log('[Rhythm] Starting HealthKit sync (14 days history)...');
      
      // Query sleep history for the last 14 days
      const result = await HealthKitHeartRate.querySleepHistory({ days: 14 });
      
      if (!result?.records || result.records.length === 0) {
        console.log('[Rhythm] No sleep history in HealthKit');
        return false;
      }

      console.log(`[Rhythm] Found ${result.records.length} sleep records`);

      // Add each day's sleep data
      let addedCount = 0;
      for (const record of result.records) {
        if (record.sleepStart && record.wakeTime && record.durationMin && record.date) {
          this.addDay({
            date: record.date,
            sleepStart: record.sleepStart,
            wakeTime: record.wakeTime,
            durationMin: record.durationMin
          });
          addedCount++;
        }
      }

      console.log('[Rhythm] HealthKit sync complete:', {
        recordsFound: result.records.length,
        recordsAdded: addedCount,
        totalInStore: this.getLog().length,
        progress: this.progress()
      });

      return addedCount > 0;
    } catch (e) {
      console.error('[Rhythm] HealthKit sync error:', e);
      return false;
    }
  }
};
