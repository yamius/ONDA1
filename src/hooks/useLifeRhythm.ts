import { useState, useEffect, useCallback } from 'react';
import type { HealthKitDataResult } from '../plugins/healthKitHeartRate';
import {
  loadSleepHistory,
  saveSleepRecord,
  calculateLifeRhythmMetrics,
  processHealthKitSleepData,
  type SleepRecord,
  type LifeRhythmMetrics
} from '../services/lifeRhythmService';

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
      const loadedHistory = loadSleepHistory();
      setHistory(loadedHistory);
      
      const calculatedMetrics = calculateLifeRhythmMetrics(loadedHistory);
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

    const record = processHealthKitSleepData(healthKitData.sleep.main);
    if (record) {
      saveSleepRecord(record);
      refresh();
      console.log('[LifeRhythm] Synced from HealthKit:', record);
    }
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
