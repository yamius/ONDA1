import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import OndaWatch, { WatchStatus, HeartRateEvent, DebugLogEvent } from '../plugins/ondaWatch';
import type { PluginListenerHandle } from '@capacitor/core';
import { trackTenjinWatchConnected } from '../lib/tenjin';

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
  /** Tell the hook a practice is (in)active. While active, the workout is
   *  kept running even if the app goes to background (autonomy); when it ends
   *  in the background, the workout is stopped right away. */
  setPracticeActive: (active: boolean) => void;
}

export function useWatchHeartRate(): UseWatchHeartRateReturn {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [watchStatus, setWatchStatus] = useState<WatchStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [autoManaged, setAutoManaged] = useState(false);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAutoManagedRef = useRef(false);
  const lastHrUpdateRef = useRef<number>(0);
  // Workout-lifecycle gating: the watch HKWorkoutSession should run when the
  // app is foreground OR a practice is active, and stop otherwise. These refs
  // drive that without re-subscribing the lifecycle listeners.
  const isPracticeActiveRef = useRef(false);
  const isAppForegroundRef = useRef(true);
  // Airbridge: fire `Watch Connected` once per app session on the first
  // false→true transition of `isConnected`.
  const hasFiredWatchConnectedRef = useRef<boolean>(false);

  // isConnected = часы сопряжены и приложение установлено
  // НЕ зависит от reachable (который скачет true/false)
  // reachable только означает "приложение активно прямо сейчас"
  const isConnected = watchStatus?.paired === true && watchStatus?.watchAppInstalled === true;
  
  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev.slice(-9), `${time}: ${msg}`]);
    console.log('[Watch]', msg);
  }, []);

  // Track previous reachable state for auto-start when watch becomes reachable
  const prevReachableRef = useRef<boolean | undefined>(undefined);

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
        
        // Auto-start when watch becomes reachable (was not reachable, now is)
        const wasNotReachable = prevReachableRef.current === false;
        const nowReachable = status.reachable === true;
        
        if (wasNotReachable && nowReachable && isAutoManagedRef.current && !isMonitoring) {
          addLog('Watch became reachable - auto-starting workout');
          try {
            await OndaWatch.startRealtime();
            setIsMonitoring(true);
          } catch (err) {
            addLog(`Auto-start on reachable failed: ${err}`);
          }
        }
        
        prevReachableRef.current = status.reachable;
        // Airbridge: first session-level handshake (paired + app installed).
        const nowConnected = status.paired === true && status.watchAppInstalled === true;
        if (nowConnected && !hasFiredWatchConnectedRef.current) {
          hasFiredWatchConnectedRef.current = true;
          trackTenjinWatchConnected(null);
        }
        setWatchStatus(status);
        
        if (!status.paired) {
          setError('Apple Watch not paired');
        } else if (!status.watchAppInstalled) {
          setError('ONDA Watch app not installed');
        } else {
          // Не показываем ошибку если часы не reachable — данные могут приходить через фоновый режим
          setError(null);
        }
      } catch (err) {
        addLog(`Status error: ${err}`);
        setError('Failed to get watch status');
        setWatchStatus({ supported: false });
      }
    };

    checkStatusAndStart();
    
    const interval = setInterval(checkStatusAndStart, 5000); // Check more frequently
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
            // Update last HR time for stale detection
            lastHrUpdateRef.current = Date.now();
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
        
        // 🔥 НОВОЕ: Слушаем диагностику с Watch
        const watchDiagnosticListener = await OndaWatch.addListener(
          'watchDiagnostic',
          (event: any) => {
            const time = new Date().toLocaleTimeString();
            const msg = `🔧 [Watch] ${event.message}`;
            console.log('[WatchDiagnostic]', event);
            setDebugLog(prev => [...prev.slice(-9), `${time}: ${msg}`]);
          }
        );
        
        addLog('Listeners OK');
        
        // Сохраняем для cleanup
        return watchDiagnosticListener;
      } catch (err) {
        addLog(`Listener error: ${err}`);
      }
    };

    const watchDiagListener = setupListeners();

    return () => {
      hrListener?.remove();
      debugListener?.remove();
      watchDiagListener?.then(l => l?.remove());
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

    heartbeatIntervalRef.current = setInterval(async () => {
      const now = Date.now();
      const timeSinceLastHr = now - lastHrUpdateRef.current;
      
      // Если HR не обновлялся более 10 секунд — повторно отправляем "start"
      if (timeSinceLastHr > 10000) {
        addLog('HR stale, resending start command');
        try {
          await OndaWatch.startRealtime();
        } catch (err) {
          // Ignore errors
        }
      } else {
        // Обычный heartbeat
        OndaWatch.sendHeartbeat().catch(() => {});
      }
    }, 3000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [isMonitoring, addLog]);

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

  // Keep ref in sync with state
  useEffect(() => {
    isAutoManagedRef.current = autoManaged;
    console.log('[Watch] autoManaged changed to:', autoManaged);
  }, [autoManaged]);

  // Practice lifecycle → workout gating. The app-state listeners only fire on
  // foreground/background transitions; this callback covers the case where a
  // practice ENDS while the app is already in the background — at that point
  // the last reason to keep the workout alive is gone, so stop it now.
  const setPracticeActive = useCallback((active: boolean) => {
    isPracticeActiveRef.current = active;
    if (!active && !isAppForegroundRef.current) {
      console.log('[Watch] Practice ended in background — stopping workout');
      OndaWatch.stopRealtime().catch(() => {});
      setIsMonitoring(false);
    }
  }, []);

  // Auto-manage workout based on app lifecycle
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    console.log('[Watch] Auto-manage effect: platform=', platform, 'autoManaged=', autoManaged);
    
    if (platform !== 'ios') {
      console.log('[Watch] Skipping - not iOS');
      return;
    }
    if (!autoManaged) {
      console.log('[Watch] Skipping - autoManaged is false');
      return;
    }

    const isPluginAvailable = Capacitor.isPluginAvailable('OndaWatch');
    console.log('[Watch] Plugin available:', isPluginAvailable);
    if (!isPluginAvailable) return;

    let appStateListener: PluginListenerHandle | null = null;
    let visibilityHandler: (() => void) | null = null;

    const handleAppActive = async () => {
      isAppForegroundRef.current = true;
      if (!isAutoManagedRef.current) return;
      console.log('[Watch] App became active - starting workout');
      try {
        await OndaWatch.startRealtime();
        setIsMonitoring(true);
        setError(null);
      } catch (err) {
        console.error('[Watch] Auto-start error:', err);
      }
    };

    const handleAppInactive = async () => {
      isAppForegroundRef.current = false;
      // Autonomy: if a practice is running, KEEP the workout alive across
      // backgrounding (this is the whole point of the watch session surviving
      // the mic dialog / a locked phone mid-practice). It is stopped instead
      // when the practice ends (see setPracticeActive).
      if (isPracticeActiveRef.current) {
        console.log('[Watch] App inactive but practice active — keeping workout');
        return;
      }
      console.log('[Watch] App became inactive - stopping workout');
      try {
        await OndaWatch.stopRealtime();
        setIsMonitoring(false);
      } catch (err) {
        console.error('[Watch] Auto-stop error:', err);
      }
    };

    const setupLifecycleListeners = async () => {
      // Capacitor App lifecycle (iOS/Android native)
      try {
        appStateListener = await App.addListener('appStateChange', ({ isActive }) => {
          console.log('[Watch] App state changed:', isActive ? 'active' : 'inactive');
          if (isActive) {
            handleAppActive();
          } else {
            handleAppInactive();
          }
        });
      } catch (err) {
        console.log('[Watch] App listener not available, using visibility API');
      }

      // Web visibility API (fallback + PWA support)
      visibilityHandler = () => {
        if (document.visibilityState === 'visible') {
          handleAppActive();
        } else {
          handleAppInactive();
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);

      // Start immediately if app is currently visible
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
      // Stop workout when autoManaged is disabled
      handleAppInactive();
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
    setAutoManaged,
    setPracticeActive
  };
}
