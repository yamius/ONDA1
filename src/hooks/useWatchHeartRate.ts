import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import OndaWatch, { WatchStatus, HeartRateEvent } from '../plugins/ondaWatch';
import type { PluginListenerHandle } from '@capacitor/core';

interface UseWatchHeartRateReturn {
  heartRate: number | null;
  isConnected: boolean;
  watchStatus: WatchStatus | null;
  startRealtime: () => Promise<void>;
  stopRealtime: () => Promise<void>;
  error: string | null;
  lastUpdated: Date | null;
  isMonitoring: boolean;
}

export function useWatchHeartRate(): UseWatchHeartRateReturn {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [watchStatus, setWatchStatus] = useState<WatchStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const listenerRef = useRef<PluginListenerHandle | null>(null);

  const isConnected = watchStatus?.reachable === true;

  useEffect(() => {
    const checkStatus = async () => {
      const platform = Capacitor.getPlatform();
      
      if (platform !== 'ios') {
        console.log('[Watch] Not iOS platform');
        setWatchStatus({ supported: false });
        return;
      }

      const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
      console.log('[Watch] Plugin available:', isPluginAvailable);
      
      if (!isPluginAvailable) {
        setWatchStatus({ supported: false });
        setError('Watch plugin not available');
        return;
      }

      try {
        const status = await OndaWatch.getStatus();
        console.log('[Watch] Status:', status);
        setWatchStatus(status);
        
        if (!status.paired) {
          setError('Apple Watch not paired');
        } else if (!status.watchAppInstalled) {
          setError('ONDA Watch app not installed');
        } else if (!status.reachable) {
          setError('Watch not reachable');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('[Watch] Status error:', err);
        setError('Failed to get watch status');
        setWatchStatus({ supported: false });
      }
    };

    checkStatus();
    
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      const platform = Capacitor.getPlatform();
      if (platform !== 'ios') return;
      
      const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
      if (!isPluginAvailable) return;

      try {
        listenerRef.current = await OndaWatch.addListener(
          'heartRate',
          (event: HeartRateEvent) => {
            console.log('[Watch] Heart rate received:', event.value, 'bpm');
            setHeartRate(Math.round(event.value));
            setLastUpdated(new Date());
            setError(null);
          }
        );
        console.log('[Watch] Listener registered');
      } catch (err) {
        console.error('[Watch] Listener error:', err);
      }
    };

    setupListener();

    return () => {
      if (listenerRef.current) {
        listenerRef.current.remove();
        listenerRef.current = null;
      }
    };
  }, []);

  const startRealtime = useCallback(async () => {
    if (!watchStatus?.supported) {
      setError('Watch not supported');
      return;
    }

    try {
      console.log('[Watch] Starting realtime...');
      await OndaWatch.startRealtime();
      setIsMonitoring(true);
      setError(null);
      console.log('[Watch] Realtime started');
    } catch (err) {
      console.error('[Watch] Start error:', err);
      setError('Failed to start watch monitoring');
    }
  }, [watchStatus]);

  const stopRealtime = useCallback(async () => {
    try {
      console.log('[Watch] Stopping realtime...');
      await OndaWatch.stopRealtime();
      setIsMonitoring(false);
      console.log('[Watch] Realtime stopped');
    } catch (err) {
      console.error('[Watch] Stop error:', err);
    }
  }, []);

  return {
    heartRate,
    isConnected,
    watchStatus,
    startRealtime,
    stopRealtime,
    error,
    lastUpdated,
    isMonitoring
  };
}
