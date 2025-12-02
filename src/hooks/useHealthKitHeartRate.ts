import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import HealthKitHeartRate, { HeartRateUpdateEvent } from '../plugins/healthKitHeartRate';
import type { PluginListenerHandle } from '@capacitor/core';

export type MonitoringMode = 'direct' | 'workout' | 'realtime' | null;

interface UseHealthKitHeartRateOptions {
  pollingInterval?: number;
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
  const [pollingInterval, setPollingIntervalState] = useState(options?.pollingInterval ?? 1500);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const listenerRef = useRef<PluginListenerHandle | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const platform = Capacitor.getPlatform();
      const isPluginAvailable = Capacitor.isPluginAvailable('HealthKitHeartRate');
      
      console.log('[HealthKit] Platform:', platform, 'Plugin available:', isPluginAvailable);
      
      // Check if we're on iOS - don't rely on isNativePlatform() as it can be false during early boot
      if (platform !== 'ios') {
        console.log('[HealthKit] Not iOS platform, HealthKit unavailable');
        setIsAvailable(false);
        return;
      }

      // If plugin is registered, call native isAvailable
      if (isPluginAvailable) {
        try {
          const result = await HealthKitHeartRate.isAvailable();
          console.log('[HealthKit] Native availability check:', result.available);
          setIsAvailable(result.available);
          
          if (!result.available) {
            setError('HealthKit is not available on this device');
          }
        } catch (err) {
          console.error('[HealthKit] Availability check error:', err);
          setError('Failed to check HealthKit availability');
          setIsAvailable(false);
        }
      } else {
        // Plugin not available - might be web preview or missing native code
        console.log('[HealthKit] Plugin not registered, checking if native context...');
        // On iOS native, plugin should be available - if not, show appropriate message
        setIsAvailable(false);
        setError('HealthKit plugin not loaded');
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

  const startRealtimeMonitoring = useCallback(async () => {
    try {
      // Set up event listener for real-time updates
      listenerRef.current = await HealthKitHeartRate.addListener(
        'heartRateUpdate',
        (event: HeartRateUpdateEvent) => {
          console.log('[HealthKit] Real-time HR:', Math.round(event.bpm), 'bpm');
          setHeartRate(Math.round(event.bpm));
          setLastUpdated(new Date());
          setError(null);
        }
      );

      // Start the native monitoring
      await HealthKitHeartRate.startRealtimeMonitoring();
      console.log('[HealthKit] Real-time monitoring started');
    } catch (err) {
      console.error('[HealthKit] Real-time monitoring error:', err);
      throw err;
    }
  }, []);

  const stopRealtimeMonitoring = useCallback(async () => {
    try {
      if (listenerRef.current) {
        await listenerRef.current.remove();
        listenerRef.current = null;
      }
      await HealthKitHeartRate.stopRealtimeMonitoring();
      console.log('[HealthKit] Real-time monitoring stopped');
    } catch (err) {
      console.error('[HealthKit] Stop real-time error:', err);
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
      await stopRealtimeMonitoring();

      setIsMonitoring(true);
      setMode(monitoringMode);
      setError(null);

      if (monitoringMode === 'realtime') {
        // Use HKAnchoredObjectQuery for instant updates
        await startRealtimeMonitoring();
        // Also do an initial query to get current value
        await queryHeartRateData();
      } else {
        // Use polling for direct/workout modes
        await queryHeartRateData();
        
        const interval = monitoringMode === 'direct' ? pollingInterval : 5000;
        intervalRef.current = setInterval(queryHeartRateData, interval);
        
        console.log(`[HealthKit] Started ${monitoringMode} mode (polling every ${interval}ms)`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start heart rate monitoring';
      setError(errorMessage);
      console.error('[HealthKit] Monitoring error:', err);
      setIsMonitoring(false);
      setMode(null);
    }
  }, [isAvailable, isAuthorized, requestPermission, queryHeartRateData, pollingInterval, startRealtimeMonitoring, stopRealtimeMonitoring]);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopRealtimeMonitoring();
    setIsMonitoring(false);
    setMode(null);
    console.log('[HealthKit] Stopped monitoring');
  }, [stopRealtimeMonitoring]);

  const setPollingInterval = useCallback((interval: number) => {
    setPollingIntervalState(interval);
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
      stopRealtimeMonitoring();
    };
  }, [stopRealtimeMonitoring]);

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
