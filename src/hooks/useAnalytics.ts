/**
 * React hook for analytics tracking
 * 
 * Usage:
 * const { track, trackPractice, trackError } = useAnalytics();
 * 
 * track('app_open');
 * trackPractice('start', 'p1-1', { duration: 180 });
 * trackError('audio', 'Failed to load track');
 */

import { useCallback, useEffect } from 'react';
import { analytics, AnalyticsEventName, trackEvent, type AnalyticsParams } from '../services/AnalyticsService';

export function useAnalytics() {
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Flush any remaining events
      analytics.flush();
    };
  }, []);

  const track = useCallback(<T extends Record<string, unknown>>(
    eventName: AnalyticsEventName,
    metadata?: AnalyticsParams<T>
  ) => {
    return trackEvent(eventName, metadata);
  }, []);

  const trackPractice = useCallback(<T extends Record<string, unknown>>(
    action: 'start' | 'pause' | 'resume' | 'complete' | 'abandon',
    practiceId: string,
    metadata?: AnalyticsParams<T>
  ) => {
    return analytics.trackPractice(action, practiceId, metadata);
  }, []);

  const trackError = useCallback((
    errorType: string,
    message: string,
    context?: Record<string, unknown>
  ) => {
    return analytics.trackError(errorType, message, context);
  }, []);

  const identify = useCallback((userId: string) => {
    return analytics.identify(userId);
  }, []);

  return {
    track,
    trackPractice,
    trackError,
    identify,
  };
}

// Re-export types for convenience
export type { AnalyticsEventName } from '../services/AnalyticsService';
