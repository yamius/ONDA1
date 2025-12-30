import { useState, useEffect, useCallback } from 'react';
import type { HealthKitDataResult } from '../plugins/healthKitHeartRate';
import { rhythmStore, type DaySleep, type LifeRhythmMetrics } from '../sleep/rhythm';

// Адаптер для совместимости с существующим кодом
type SleepRecord = DaySleep;

interface UseLifeRhythmReturn {
  metrics: LifeRhythmMetrics | null;
  history: SleepRecord[];
  isLoading: boolean;
  syncFromHealthKit: (healthKitData: HealthKitDataResult | null) => void;
  refresh: () => void;
}

export function useLifeRhythm(): UseLifeRhythmReturn {
  const [metrics, setMetrics] = useState<LifeRhythmMetrics | null>(null);
  const [history, setHistory] = useState<SleepRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    try {
      const loadedHistory = rhythmStore.getLog();
      setHistory(loadedHistory);
      
      const calculatedMetrics = rhythmStore.getMetrics();
      setMetrics(calculatedMetrics);
      
      console.log('[LifeRhythm] Refreshed:', {
        historyCount: loadedHistory.length,
        metrics: calculatedMetrics
      });
    } catch (e) {
      console.error('[LifeRhythm] Refresh error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncFromHealthKit = useCallback((healthKitData: HealthKitDataResult | null) => {
    if (!healthKitData?.sleep?.main) {
      console.log('[LifeRhythm] No sleep data in HealthKit');
      return;
    }

    const { sleepStart, wakeTime, durationMin } = healthKitData.sleep.main;
    
    if (!sleepStart || !wakeTime || !durationMin) {
      console.log('[LifeRhythm] Incomplete sleep data');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    rhythmStore.addDay({
      date: today,
      sleepStart,
      wakeTime,
      durationMin
    });
    
    refresh();
    console.log('[LifeRhythm] Synced from HealthKit:', { date: today, sleepStart, wakeTime, durationMin });
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    metrics,
    history,
    isLoading,
    syncFromHealthKit,
    refresh
  };
}
