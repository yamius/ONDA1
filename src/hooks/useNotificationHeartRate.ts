import { useState, useEffect } from 'react';

interface NotificationHREvent {
  heartRate: number;
  timestamp: number;
  source: string; // Package name of fitness app
}

interface UseNotificationHeartRateReturn {
  hr: number | null;
  lastUpdate: number | null;
  source: string | null;
  isEnabled: boolean;
  requestPermission: () => void;
}

/**
 * Hook for receiving heart rate updates from fitness app notifications
 * Works with Mi Fitness, Fitbit, Samsung Health, Google Fit, Garmin Connect, etc.
 * 
 * Requires notification listener permission from user
 * Updates are periodic (when fitness apps show HR notifications)
 */
export function useNotificationHeartRate(): UseNotificationHeartRateReturn {
  const [hr, setHr] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    // Guard: Only run on Android
    if (typeof window === 'undefined' || !window.Android) {
      return;
    }
    
    // Check permission on mount (Android only)
    try {
      if (window.Android.isNotificationListenerEnabled) {
        const enabled = window.Android.isNotificationListenerEnabled();
        setIsEnabled(enabled);
        
        // Start foreground service ONLY if permission is enabled
        if (enabled && window.Android.startHeartRateService) {
          try {
            window.Android.startHeartRateService();
            console.log('[useNotificationHeartRate] Foreground service started');
          } catch (e) {
            console.error('[useNotificationHeartRate] Failed to start service:', e);
          }
        }
      }
    } catch (e) {
      console.error('[useNotificationHeartRate] Error checking initial permission:', e);
    }
    
    // Listen for notification heart rate updates
    const handleHRUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationHREvent>;
      const { heartRate, timestamp, source: appSource } = customEvent.detail;
      
      console.log('[useNotificationHeartRate] Received:', {
        heartRate,
        timestamp,
        source: appSource
      });
      
      setHr(heartRate);
      setLastUpdate(timestamp);
      setSource(appSource);
    };
    
    window.addEventListener('notification-hr-update', handleHRUpdate);
    
    // Check permission status periodically (in case user enables it in settings)
    let lastKnownState = false;
    try {
      lastKnownState = window.Android?.isNotificationListenerEnabled?.() ?? false;
    } catch (e) {
      console.error('[useNotificationHeartRate] Error getting initial state:', e);
    }
    
    const permissionCheckInterval = setInterval(() => {
      // Guard: Check bridge exists before every call
      if (!window.Android?.isNotificationListenerEnabled) {
        return;
      }
      
      try {
        const currentState = window.Android.isNotificationListenerEnabled();
        
        // Only update if state actually changed
        if (currentState !== lastKnownState) {
          console.log('[useNotificationHeartRate] Permission state changed:', lastKnownState, '->', currentState);
          lastKnownState = currentState;
          setIsEnabled(currentState);
          
          // Start/stop service when permission changes
          if (currentState && window.Android.startHeartRateService) {
            try {
              window.Android.startHeartRateService();
              console.log('[useNotificationHeartRate] Service started (permission enabled)');
            } catch (e) {
              console.error('[useNotificationHeartRate] Failed to start service:', e);
            }
          } else if (!currentState && window.Android.stopHeartRateService) {
            try {
              window.Android.stopHeartRateService();
              console.log('[useNotificationHeartRate] Service stopped (permission disabled)');
            } catch (e) {
              console.error('[useNotificationHeartRate] Failed to stop service:', e);
            }
          }
        }
      } catch (e) {
        console.error('[useNotificationHeartRate] Error in permission check interval:', e);
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('notification-hr-update', handleHRUpdate);
      clearInterval(permissionCheckInterval);
      
      // Stop service on cleanup (guard against bridge being undefined)
      if (window.Android?.stopHeartRateService) {
        try {
          window.Android.stopHeartRateService();
          console.log('[useNotificationHeartRate] Service stopped on cleanup');
        } catch (e) {
          // Swallow error - cleanup shouldn't crash the app
          console.warn('[useNotificationHeartRate] Failed to stop service on cleanup (non-critical):', e);
        }
      }
    };
  }, []); // ✅ Empty deps - runs only on mount/unmount
  
  const requestPermission = () => {
    if (window.Android?.requestNotificationListenerPermission) {
      console.log('[useNotificationHeartRate] Requesting notification listener permission');
      window.Android.requestNotificationListenerPermission();
    } else {
      console.warn('[useNotificationHeartRate] Android bridge not available');
    }
  };
  
  return {
    hr,
    lastUpdate,
    source,
    isEnabled,
    requestPermission
  };
}
