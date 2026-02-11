/**
 * Analytics Bridge for Android
 * 
 * Provides a unified interface to call Firebase Analytics
 * on Android via the native bridge
 */

import { Capacitor } from '@capacitor/core';

// Android bridge interface
interface AndroidBridge {
  trackEvent(eventName: string, eventParamsJson: string): void;
  setAnalyticsUserId(userId: string): void;
  setUserProperty(propertyName: string, propertyValue: string): void;
}

// Check if running on Android
const isAndroid = Capacitor.getPlatform() === 'android';

// Get Android bridge
const androidBridge = (window as any).Android as AndroidBridge | undefined;

/**
 * Track event via Android native bridge
 */
export function trackEventAndroid(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (!isAndroid || !androidBridge) {
    console.warn('[AnalyticsBridge] Android bridge not available');
    return;
  }

  try {
    const paramsJson = JSON.stringify(eventParams || {});
    androidBridge.trackEvent(eventName, paramsJson);
    console.log(`[AnalyticsBridge] Event tracked on Android: ${eventName}`);
  } catch (error) {
    console.error('[AnalyticsBridge] Error tracking event on Android:', error);
  }
}

/**
 * Set user ID via Android native bridge
 */
export function setUserIdAndroid(userId: string): void {
  if (!isAndroid || !androidBridge) {
    console.warn('[AnalyticsBridge] Android bridge not available');
    return;
  }

  try {
    androidBridge.setAnalyticsUserId(userId);
    console.log(`[AnalyticsBridge] User ID set on Android: ${userId}`);
  } catch (error) {
    console.error('[AnalyticsBridge] Error setting user ID on Android:', error);
  }
}

/**
 * Set user property via Android native bridge
 */
export function setUserPropertyAndroid(
  propertyName: string,
  propertyValue: string
): void {
  if (!isAndroid || !androidBridge) {
    console.warn('[AnalyticsBridge] Android bridge not available');
    return;
  }

  try {
    androidBridge.setUserProperty(propertyName, propertyValue);
    console.log(`[AnalyticsBridge] User property set on Android: ${propertyName} = ${propertyValue}`);
  } catch (error) {
    console.error('[AnalyticsBridge] Error setting user property on Android:', error);
  }
}

/**
 * Check if Android bridge is available
 */
export function isAndroidBridgeAvailable(): boolean {
  return isAndroid && !!androidBridge;
}
