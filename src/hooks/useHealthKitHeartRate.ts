import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import HealthKitHeartRate from '../plugins/healthKitHeartRate';

interface UseHealthKitHeartRateReturn {
  heartRate: number | null;
  isAvailable: boolean | null;
  isAuthorized: boolean | null;
  requestPermission: () => Promise<void>;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => void;
  error: string | null;
  lastUpdated: Date | null;
}

export function useHealthKitHeartRate(): UseHealthKitHeartRateReturn {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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
      console.log('[HealthKit] Querying heart rate data...');
      const result = await HealthKitHeartRate.queryHeartRate({
        limit: 10,
        minutesAgo: 30
      });
      
      console.log('[HealthKit] Query result:', result);
      
      if (result.latestBpm !== null) {
        setHeartRate(Math.round(result.latestBpm));
        setLastUpdated(new Date());
        setError(null);
      } else if (result.count === 0) {
        console.log('[HealthKit] No heart rate samples found in the last 30 minutes');
      }
    } catch (err) {
      console.error('[HealthKit] Query error:', err);
    }
  }, []);

  const startMonitoring = useCallback(async () => {
    if (!isAvailable) {
      setError('HealthKit is only available on iOS devices');
      return;
    }

    if (isAuthorized !== true) {
      console.log('[HealthKit] Not authorized, requesting permission first');
      await requestPermission();
    }

    try {
      setIsMonitoring(true);
      setError(null);
      
      await queryHeartRateData();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(queryHeartRateData, 5000);
      
      console.log('[HealthKit] Started monitoring (polling every 5 seconds)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start heart rate monitoring';
      setError(errorMessage);
      console.error('[HealthKit] Monitoring error:', err);
      setIsMonitoring(false);
    }
  }, [isAvailable, isAuthorized, requestPermission, queryHeartRateData]);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
    console.log('[HealthKit] Stopped monitoring');
  }, []);

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
    lastUpdated
  };
}
