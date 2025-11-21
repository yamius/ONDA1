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
        const enabled = window.Android.isNotificationListenerEnabled();
        setIsEnabled(enabled);
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('notification-hr-update', handleHRUpdate);
      clearInterval(permissionCheckInterval);
    };
  }, []);
  
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
