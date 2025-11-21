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
    // Check permission on mount (Android only)
    if (window.Android?.isNotificationListenerEnabled) {
      const enabled = window.Android.isNotificationListenerEnabled();
      setIsEnabled(enabled);
      console.log('[useNotificationHeartRate] Permission status:', enabled);
      
      // Start foreground service if permission is enabled
      if (enabled && window.Android.startHeartRateService) {
        window.Android.startHeartRateService();
        console.log('[useNotificationHeartRate] Foreground service started');
      }
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
    const permissionCheckInterval = setInterval(() => {
      if (window.Android?.isNotificationListenerEnabled) {
        const wasEnabled = isEnabled;
        const enabled = window.Android.isNotificationListenerEnabled();
        
        if (enabled !== wasEnabled) {
          setIsEnabled(enabled);
          
          // Start/stop service when permission changes
          if (enabled && window.Android.startHeartRateService) {
            window.Android.startHeartRateService();
            console.log('[useNotificationHeartRate] Service started (permission enabled)');
          } else if (!enabled && window.Android.stopHeartRateService) {
            window.Android.stopHeartRateService();
            console.log('[useNotificationHeartRate] Service stopped (permission disabled)');
          }
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('notification-hr-update', handleHRUpdate);
      clearInterval(permissionCheckInterval);
      
      // Stop service on cleanup
      if (window.Android?.stopHeartRateService) {
        window.Android.stopHeartRateService();
        console.log('[useNotificationHeartRate] Service stopped on cleanup');
      }
    };
  }, [isEnabled]);
  
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
