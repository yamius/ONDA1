import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
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
  autoManaged: boolean;
  setAutoManaged: (value: boolean) => void;
}

export function useWatchHeartRate(): UseWatchHeartRateReturn {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [watchStatus, setWatchStatus] = useState<WatchStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [autoManaged, setAutoManaged] = useState(false);
  const keepAliveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAutoManagedRef = useRef(false);
  const lastHrUpdateRef = useRef<number>(0);

  const isConnected = watchStatus?.reachable === true;
  
  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev.slice(-9), `${time}: ${msg}`]);
    console.log('[Watch]', msg);
  }, []);

  const prevReachableRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    const checkStatus = async () => {
      const platform = Capacitor.getPlatform();
      
      if (platform !== 'ios') {
        setWatchStatus({ supported: false });
        return;
      }

      const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
      
      if (!isPluginAvailable) {
        setWatchStatus({ supported: false });
        setError('Watch plugin not available');
        return;
      }

      try {
        const status = await OndaWatch.getStatus();
        
        const wasNotReachable = prevReachableRef.current === false;
        const nowReachable = status.reachable === true;
        
        if (wasNotReachable && nowReachable) {
          addLog('Watch became reachable');
        }
        
        prevReachableRef.current = status.reachable;
        setWatchStatus(status);
        
        if (!status.paired) {
          setError('Apple Watch not paired');
        } else if (!status.watchAppInstalled) {
          setError('ONDA Watch app not installed');
        } else {
          setError(null);
        }
      } catch (err) {
        addLog(`Status error: ${err}`);
        setError('Failed to get watch status');
        setWatchStatus({ supported: false });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [addLog]);

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
            lastHrUpdateRef.current = Date.now();
            
            if (!isMonitoring) {
              setIsMonitoring(true);
            }
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
  }, [addLog, isMonitoring]);

  // Keep-alive: send ping every 30 seconds to prevent watch auto-stop (3 min timer)
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform !== 'ios') return;
    
    const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
    if (!isPluginAvailable) return;

    // Always send keep-alive when app is visible
    keepAliveIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        OndaWatch.sendHeartbeat().catch(() => {});
      }
    }, 30000); // Every 30 seconds

    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, []);

  const startRealtime = useCallback(async () => {
    if (!watchStatus?.supported) {
      setError('Watch not supported');
      return;
    }

    try {
      console.log('[Watch] Starting realtime (ping)...');
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

  useEffect(() => {
    isAutoManagedRef.current = autoManaged;
  }, [autoManaged]);

  // Auto-manage: start workout when app becomes active
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform !== 'ios') return;
    if (!autoManaged) return;

    const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
    if (!isPluginAvailable) return;

    let appStateListener: PluginListenerHandle | null = null;
    let visibilityHandler: (() => void) | null = null;

    const handleAppActive = async () => {
      if (!isAutoManagedRef.current) return;
      console.log('[Watch] App active - sending ping');
      try {
        await OndaWatch.startRealtime();
        setIsMonitoring(true);
        setError(null);
      } catch (err) {
        console.error('[Watch] Ping error:', err);
      }
    };

    const setupLifecycleListeners = async () => {
      try {
        appStateListener = await App.addListener('appStateChange', ({ isActive }) => {
          console.log('[Watch] App state:', isActive ? 'active' : 'background');
          if (isActive) {
            handleAppActive();
          }
          // Note: We do NOT stop on background - watch has 3 min auto-stop
        });
      } catch (err) {
        console.log('[Watch] App listener not available');
      }

      visibilityHandler = () => {
        if (document.visibilityState === 'visible') {
          handleAppActive();
        }
        // Note: We do NOT stop on hidden - watch has 3 min auto-stop
      };
      document.addEventListener('visibilitychange', visibilityHandler);

      if (document.visibilityState === 'visible') {
        handleAppActive();
      }
    };

    setupLifecycleListeners();

    return () => {
      appStateListener?.remove();
      if (visibilityHandler) {
        document.removeEventListener('visibilitychange', visibilityHandler);
      }
    };
  }, [autoManaged]);

  return {
    heartRate,
    isConnected,
    watchStatus,
    startRealtime,
    stopRealtime,
    error,
    lastUpdated,
    isMonitoring,
    debugLog,
    autoManaged,
    setAutoManaged
  };
}
