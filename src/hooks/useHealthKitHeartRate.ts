import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorHealth, PermissionResult, QueryOutput } from 'capacitor-health';

interface HeartRateData {
  bpm: number;
  timestamp: Date;
}

interface UseHealthKitHeartRateReturn {
  heartRate: number | null;
  isAvailable: boolean;
  isAuthorized: boolean | null;
  requestPermission: () => Promise<void>;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => void;
  error: string | null;
}

/**
 * Hook for accessing heart rate data from Apple HealthKit (iOS only)
 * 
 * For web/Android: This hook will gracefully return null values and isAvailable=false
 * For iOS: Provides real-time heart rate monitoring from HealthKit
 * 
 * Usage:
 * const { heartRate, isAvailable, requestPermission, startMonitoring } = useHealthKitHeartRate();
 * 
 * // Check if HealthKit is available (iOS only)
 * if (isAvailable) {
 *   await requestPermission();
 *   await startMonitoring();
 * }
 */
export function useHealthKitHeartRate(): UseHealthKitHeartRateReturn {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Check if running on iOS with HealthKit available
  const isAvailable = Capacitor.getPlatform() === 'ios' && Capacitor.isNativePlatform();

  // Request HealthKit permissions
  const requestPermission = async () => {
    if (!isAvailable) {
      setError('HealthKit is only available on iOS devices');
      return;
    }

    try {
      const result: PermissionResult = await CapacitorHealth.requestAuthorization({
        read: ['heartRate'],
        write: []
      });

      setIsAuthorized(result.granted);
      if (!result.granted) {
        setError('HealthKit permission denied');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request HealthKit permission';
      setError(errorMessage);
      console.error('[HealthKit] Permission error:', err);
    }
  };

  // Start monitoring heart rate
  const startMonitoring = async () => {
    if (!isAvailable) {
      setError('HealthKit is only available on iOS devices');
      return;
    }

    if (isAuthorized === false) {
      setError('HealthKit permission not granted');
      return;
    }

    try {
      setIsMonitoring(true);
      setError(null);

      // Query most recent heart rate sample
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const result: QueryOutput = await CapacitorHealth.queryHKitSampleType({
        sampleName: 'heartRate',
        startDate: oneHourAgo.toISOString(),
        endDate: now.toISOString(),
        limit: 1 // Get only the most recent sample
      });

      if (result.resultData && result.resultData.length > 0) {
        const latestSample = result.resultData[0];
        // HealthKit returns heart rate in beats per minute
        const bpm = Math.round(parseFloat(latestSample.value || '0'));
        setHeartRate(bpm);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start heart rate monitoring';
      setError(errorMessage);
      console.error('[HealthKit] Monitoring error:', err);
      setIsMonitoring(false);
    }
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  // Poll for updates while monitoring (every 5 seconds)
  useEffect(() => {
    if (!isMonitoring || !isAvailable) return;

    const interval = setInterval(async () => {
      try {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

        const result: QueryOutput = await CapacitorHealth.queryHKitSampleType({
          sampleName: 'heartRate',
          startDate: oneMinuteAgo.toISOString(),
          endDate: now.toISOString(),
          limit: 1
        });

        if (result.resultData && result.resultData.length > 0) {
          const latestSample = result.resultData[0];
          const bpm = Math.round(parseFloat(latestSample.value || '0'));
          setHeartRate(bpm);
        }
      } catch (err) {
        console.error('[HealthKit] Polling error:', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [isMonitoring, isAvailable]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  return {
    heartRate,
    isAvailable,
    isAuthorized,
    requestPermission,
    startMonitoring,
    stopMonitoring,
    error
  };
}
