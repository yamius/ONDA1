import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import OndaWatch, { WatchStatus, HeartRateEvent, DebugLogEvent } from '../plugins/ondaWatch';
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
  debugLog: string[];
}

export function useWatchHeartRate(): UseWatchHeartRateReturn {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [watchStatus, setWatchStatus] = useState<WatchStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isConnected = watchStatus?.reachable === true;
  
  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev.slice(-9), `${time}: ${msg}`]);
    console.log('[Watch]', msg);
  }, []);

  useEffect(() => {
    const checkStatusAndStart = async () => {
      const platform = Capacitor.getPlatform();
      
      if (platform !== 'ios') {
        setWatchStatus({ supported: false });
        return;
      }

      const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
      addLog(`Plugin: ${isPluginAvailable ? 'OK' : 'NO'}`);
      
      if (!isPluginAvailable) {
        setWatchStatus({ supported: false });
        setError('Watch plugin not available');
        return;
      }

      try {
        const status = await OndaWatch.getStatus();
        addLog(`Status: paired=${status.paired}, app=${status.watchAppInstalled}, reach=${status.reachable}`);
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
        addLog(`Status error: ${err}`);
        setError('Failed to get watch status');
        setWatchStatus({ supported: false });
      }
    };

    checkStatusAndStart();
    
    const interval = setInterval(checkStatusAndStart, 10000);
    return () => clearInterval(interval);
  }, [isMonitoring, addLog]);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform !== 'ios') return;
    
    const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
    if (!isPluginAvailable) return;

    let hrListener: PluginListenerHandle | null = null;
    let debugListener: PluginListenerHandle | null = null;

    const setupListeners = async () => {
      try {
        hrListener = await OndaWatch.addListener(
          'heartRate',
          (event: HeartRateEvent) => {
            setHeartRate(Math.round(event.value));
            setLastUpdated(new Date());
            setError(null);
          }
        );
        
        debugListener = await OndaWatch.addListener(
          'debugLog',
          (event: DebugLogEvent) => {
            if (event.log && Array.isArray(event.log)) {
              setDebugLog(event.log.slice(-10));
            }
          }
        );
        
        addLog('Listeners OK');
      } catch (err) {
        addLog(`Listener error: ${err}`);
      }
    };

    setupListeners();

    return () => {
      hrListener?.remove();
      debugListener?.remove();
    };
  }, [addLog]);

  useEffect(() => {
    if (!isMonitoring) {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      return;
    }

    const platform = Capacitor.getPlatform();
    if (platform !== 'ios') return;

    heartbeatIntervalRef.current = setInterval(() => {
      OndaWatch.sendHeartbeat().catch(() => {});
    }, 2000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [isMonitoring]);

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
    isMonitoring,
    debugLog
  };
}
