import { useState, useEffect, useCallback } from 'react';
import type { HcUpdatePayload } from '../bridge/healthConnectBridge';
import { isHealthConnectAvailable, requestHealthConnectPermissions } from '../lib/android-bridge';

export interface HealthConnectHook {
  connected: boolean;
  lastUpdate: HcUpdatePayload | null;
  connect: () => void;
  disconnect: () => void;
}

const HC_STORAGE_KEY = 'health_connect_last_update';

function loadLastUpdate(): HcUpdatePayload | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  
  try {
    const updateStr = localStorage.getItem(HC_STORAGE_KEY);
    return updateStr ? JSON.parse(updateStr) : null;
  } catch (error) {
    console.error('[useHealthConnect] Failed to load from storage:', error);
    return null;
  }
}

function saveLastUpdate(lastUpdate: HcUpdatePayload | null) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  
  try {
    if (lastUpdate) {
      localStorage.setItem(HC_STORAGE_KEY, JSON.stringify(lastUpdate));
    } else {
      localStorage.removeItem(HC_STORAGE_KEY);
    }
  } catch (error) {
    console.error('[useHealthConnect] Failed to save to storage:', error);
  }
}

function clearStorage() {
  if (typeof localStorage === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(HC_STORAGE_KEY);
  } catch (error) {
    console.error('[useHealthConnect] Failed to clear storage:', error);
  }
}

export function useHealthConnect(): HealthConnectHook {
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<HcUpdatePayload | null>(() => loadLastUpdate());

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as HcUpdatePayload;
      
      // Handle null/undefined payload
      if (!detail) {
        console.warn('[useHealthConnect] Received null/undefined payload');
        return;
      }
      
      console.log('[useHealthConnect] Received hc-update event:', detail);
      
      const isConnection = detail.source === 'health_connect' || detail.source === 'debug';
      if (isConnection) {
        setConnected(true);
      }
      
      setLastUpdate(detail);
      saveLastUpdate(detail);
    };

    window.addEventListener('hc-update', handler as EventListener);
    return () => window.removeEventListener('hc-update', handler as EventListener);
  }, []);

  const connect = useCallback(() => {
    console.log('[useHealthConnect] Connecting to Health Connect...');
    
    if (isHealthConnectAvailable()) {
      console.log('[useHealthConnect] Requesting Android Health Connect permissions');
      requestHealthConnectPermissions();
      return;
    }

    console.log('[useHealthConnect] Health Connect not available, using debug mode');
    if ((window as any).onHealthConnectUpdate) {
      (window as any).onHealthConnectUpdate({
        ts: new Date().toISOString(),
        source: "debug",
        activity: {
          activeCaloriesBurned: 320,
          vo2Max: 42
        },
        vitals: {
          heartRate: 78,
          restingHeartRate: 60,
          hrv: 55,
          bloodPressureSys: 120,
          bloodPressureDia: 78,
          bloodGlucose: 4.8,
          spo2: 97,
          respiratoryRate: 14,
          bodyTemperature: 36.8,
          skinTemperature: 33.2
        },
        sleep: {
          main: {
            date: new Date().toISOString().split('T')[0],
            sleepStart: "23:40",
            wakeTime: "07:05",
            durationMin: 445
          }
        },
        wellness: {
          mindfulnessMinutes: 15,
          mindfulnessSessions: 2,
          sexualActivityEvents: 0
        },
        body: {
          weightKg: 72.5,
          heightCm: 178,
          bodyFatPct: 16,
          bodyWaterMassKg: 40,
          boneMassKg: 3,
          leanBodyMassKg: 61,
          basalMetabolicRate: 1700
        },
        nutrition: {
          calories: 2300,
          proteinGrams: 120,
          fatGrams: 70,
          carbsGrams: 260,
          hydrationLiters: 2.1
        }
      });
      console.log('[useHealthConnect] Debug data sent');
    } else {
      console.error('[useHealthConnect] Health Connect bridge not initialized');
      alert('Health Connect bridge is not initialized. Please reload the page.');
    }
  }, []);

  const disconnect = useCallback(() => {
    console.log('[useHealthConnect] Disconnecting from Health Connect');
    setConnected(false);
    setLastUpdate(null);
    clearStorage();
  }, []);

  return {
    connected,
    lastUpdate,
    connect,
    disconnect
  };
}
