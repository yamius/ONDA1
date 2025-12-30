import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import HealthKitHeartRate, { HealthKitDataResult } from '../plugins/healthKitHeartRate';
import { rhythmStore } from '../sleep/rhythm';

interface UseHealthKitDataReturn {
  data: HealthKitDataResult | null;
  isAvailable: boolean | null;
  isAuthorized: boolean | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  refresh: () => Promise<void>;
  startAutoRefresh: (intervalMs?: number) => void;
  stopAutoRefresh: () => void;
}

export function useHealthKitData(): UseHealthKitDataReturn {
  const [data, setData] = useState<HealthKitDataResult | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const platform = Capacitor.getPlatform();
      const isPluginAvailable = Capacitor.isPluginAvailable('HealthKitHeartRate');
      
      if (platform !== 'ios') {
        setIsAvailable(false);
        return;
      }

      if (isPluginAvailable) {
        try {
          const result = await HealthKitHeartRate.isAvailable();
          setIsAvailable(result.available);
        } catch {
          setIsAvailable(false);
        }
      } else {
        setIsAvailable(false);
      }
    };

    checkAvailability();
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isAvailable) {
      setError('HealthKit is only available on iOS devices');
      return;
    }

    try {
      setIsLoading(true);
      const result = await HealthKitHeartRate.requestFullAuthorization();
      setIsAuthorized(result.authorized);
      
      if (!result.authorized) {
        setError('HealthKit permission denied');
      } else {
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request HealthKit permission';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  const refresh = useCallback(async () => {
    if (!isAvailable) return;

    try {
      setIsLoading(true);
      const result = await HealthKitHeartRate.queryAllHealthData();
      setData(result);
      setError(null);
      console.log('[HealthKit] All data refreshed:', result);
      
      // Синхронизируем данные сна с rhythmStore для артефакта "Ритм Жизни"
      if (result?.sleep?.main) {
        const { sleepStart, wakeTime, durationMin } = result.sleep.main;
        if (sleepStart && wakeTime && durationMin) {
          const today = new Date().toISOString().split('T')[0];
          rhythmStore.addDay({
            date: today,
            sleepStart,
            wakeTime,
            durationMin
          });
          console.log('[HealthKit] Synced sleep to rhythmStore:', { 
            date: today, 
            sleepStart, 
            wakeTime, 
            durationMin,
            progress: rhythmStore.progress()
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to query health data';
      setError(errorMessage);
      console.error('[HealthKit] Query error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAvailable]);

  const startAutoRefresh = useCallback((intervalMs: number = 30000) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    refresh();
    intervalRef.current = setInterval(refresh, intervalMs);
    console.log(`[HealthKit] Auto-refresh started (${intervalMs}ms)`);
  }, [refresh]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('[HealthKit] Auto-refresh stopped');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    isAvailable,
    isAuthorized,
    isLoading,
    error,
    requestPermission,
    refresh,
    startAutoRefresh,
    stopAutoRefresh
  };
}
