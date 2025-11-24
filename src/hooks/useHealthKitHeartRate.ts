import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Health, type PermissionsRequest, type PermissionResponse } from 'capacitor-health';

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
      const permissionsRequest: PermissionsRequest = {
        permissions: ['READ_HEART_RATE']
      };

      const result: PermissionResponse = await Health.requestHealthPermissions(permissionsRequest);

      // Check if heart rate permission was granted
      const granted = result.permissions[0]?.READ_HEART_RATE === true;
      setIsAuthorized(granted);
      
      if (!granted) {
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

      // Query workouts to get heart rate data
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const result = await Health.queryWorkouts({
        startDate: oneHourAgo.toISOString(),
        endDate: now.toISOString(),
        includeHeartRate: true,
        includeRoute: false,
        includeSteps: false
      });

      // Get the most recent heart rate sample from workouts
      if (result.workouts && result.workouts.length > 0) {
        for (const workout of result.workouts) {
          if (workout.heartRate && workout.heartRate.length > 0) {
            // Get latest heart rate sample
            const latestHR = workout.heartRate[workout.heartRate.length - 1];
            setHeartRate(latestHR.bpm);
            break;
          }
        }
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

  // Poll for updates while monitoring (every 10 seconds)
  useEffect(() => {
    if (!isMonitoring || !isAvailable) return;

    const interval = setInterval(async () => {
      try {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        const result = await Health.queryWorkouts({
          startDate: fiveMinutesAgo.toISOString(),
          endDate: now.toISOString(),
          includeHeartRate: true,
          includeRoute: false,
          includeSteps: false
        });

        // Get the most recent heart rate sample
        if (result.workouts && result.workouts.length > 0) {
          for (const workout of result.workouts) {
            if (workout.heartRate && workout.heartRate.length > 0) {
              const latestHR = workout.heartRate[workout.heartRate.length - 1];
              setHeartRate(latestHR.bpm);
              break;
            }
          }
        }
      } catch (err) {
        console.error('[HealthKit] Polling error:', err);
      }
    }, 10000); // Poll every 10 seconds

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
