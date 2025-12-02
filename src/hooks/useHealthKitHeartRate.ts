import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import HealthKitHeartRate from '../plugins/healthKitHeartRate';

type MonitoringMode = 'direct' | 'workout' | null;

interface UseHealthKitHeartRateOptions {
  pollingInterval?: number; // ms, default 2000 for direct mode
}

interface UseHealthKitHeartRateReturn {
  heartRate: number | null;
  isAvailable: boolean | null;
  isAuthorized: boolean | null;
  requestPermission: () => Promise<void>;
  startMonitoring: (mode?: MonitoringMode) => Promise<void>;
  stopMonitoring: () => void;
  error: string | null;
  lastUpdated: Date | null;
  isMonitoring: boolean;
  mode: MonitoringMode;
  setPollingInterval: (interval: number) => void;
}

export function useHealthKitHeartRate(options?: UseHealthKitHeartRateOptions): UseHealthKitHeartRateReturn {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mode, setMode] = useState<MonitoringMode>(null);
  const [pollingInterval, setPollingIntervalState] = useState(options?.pollingInterval ?? 2000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (Capacitor.getPlatform() !== 'ios' || !Capacitor.isNativePlatform()) {
        console.log('[HealthKit] Not iOS native platform, HealthKit unavailable');
        setIsAvailable(false);
        return;
      }

      try {
        const result = await HealthKitHeartRate.isAvailable();
        console.log('[HealthKit] Availability check:', result.available);
        setIsAvailable(result.available);
      } catch (err) {
        console.error('[HealthKit] Availability check error:', err);
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
      console.log('[HealthKit] Requesting authorization...');
      const result = await HealthKitHeartRate.requestAuthorization();
      console.log('[HealthKit] Authorization result:', result);
      setIsAuthorized(result.authorized);
      
      if (!result.authorized) {
        setError('HealthKit permission denied');
      } else {
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request HealthKit permission';
      setError(errorMessage);
      console.error('[HealthKit] Permission error:', err);
    }
  }, [isAvailable]);

  const queryHeartRateData = useCallback(async () => {
    try {
      const result = await HealthKitHeartRate.queryHeartRate({
        limit: 10,
        minutesAgo: 30
      });
      
      if (result.latestBpm !== null) {
        setHeartRate(Math.round(result.latestBpm));
        setLastUpdated(new Date());
        setError(null);
        console.log('[HealthKit] HR:', Math.round(result.latestBpm), 'bpm');
      } else if (result.count === 0) {
        console.log('[HealthKit] No samples in last 30 minutes');
      }
    } catch (err) {
      console.error('[HealthKit] Query error:', err);
    }
  }, []);

  const startMonitoring = useCallback(async (monitoringMode: MonitoringMode = 'direct') => {
    if (!isAvailable) {
      setError('HealthKit is only available on iOS devices');
      return;
    }

    if (isAuthorized !== true) {
      console.log('[HealthKit] Not authorized, requesting permission first');
      await requestPermission();
    }

    try {
      // Stop any existing monitoring
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsMonitoring(true);
      setMode(monitoringMode);
      setError(null);
      
      // Initial query
      await queryHeartRateData();
      
      // Set up polling based on mode
      const interval = monitoringMode === 'direct' ? pollingInterval : 5000;
      intervalRef.current = setInterval(queryHeartRateData, interval);
      
      console.log(`[HealthKit] Started ${monitoringMode} mode (polling every ${interval}ms)`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start heart rate monitoring';
      setError(errorMessage);
      console.error('[HealthKit] Monitoring error:', err);
      setIsMonitoring(false);
      setMode(null);
    }
  }, [isAvailable, isAuthorized, requestPermission, queryHeartRateData, pollingInterval]);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
    setMode(null);
    console.log('[HealthKit] Stopped monitoring');
  }, []);

  const setPollingInterval = useCallback((interval: number) => {
    setPollingIntervalState(interval);
    // If already monitoring in direct mode, restart with new interval
    if (isMonitoring && mode === 'direct') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(queryHeartRateData, interval);
      console.log(`[HealthKit] Updated polling interval to ${interval}ms`);
    }
  }, [isMonitoring, mode, queryHeartRateData]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    heartRate,
    isAvailable,
    isAuthorized,
    requestPermission,
    startMonitoring,
    stopMonitoring,
    error,
    lastUpdated,
    isMonitoring,
    mode,
    setPollingInterval
  };
}
