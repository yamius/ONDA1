/**
 * Universal Analytics Service
 * 
 * Tracks events to both:
 * 1. Supabase (for detailed product analytics)
 * 2. Firebase Analytics (for ad attribution and marketing)
 * 
 * Automatically detects platform (iOS/Android/Web) and uses appropriate SDK
 */

import { supabase } from '../lib/supabase';
import { Capacitor } from '@capacitor/core';
import {
  trackEventAndroid,
  setUserIdAndroid,
  setUserPropertyAndroid,
  isAndroidBridgeAvailable,
} from '../lib/analytics-bridge';

// Firebase Analytics types
interface FirebaseAnalytics {
  logEvent(options: { name: string; params?: Record<string, any> }): Promise<void>;
  setUserId(options: { userId: string }): Promise<void>;
  setUserProperty(options: { name: string; value: string }): Promise<void>;
  setCurrentScreen(options: { screenName: string }): Promise<void>;
}

// Event parameters interface
export interface AnalyticsEvent {
  eventName: string;
  eventParams?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

// Platform detection
const platform = Capacitor.getPlatform(); // 'ios', 'android', or 'web'
const isNative = Capacitor.isNativePlatform();
const isAndroid = platform === 'android';
const isIOS = platform === 'ios';

// Firebase Analytics instance (lazy loaded, iOS only)
let firebaseAnalytics: FirebaseAnalytics | null = null;

/**
 * Initialize Firebase Analytics
 * Must be called after app startup
 */
export async function initializeAnalytics() {
  if (!isNative) {
    console.log('[Analytics] Running on web, Firebase Analytics not available');
    return;
  }

  // Android uses native bridge, no initialization needed
  if (isAndroid) {
    if (isAndroidBridgeAvailable()) {
      console.log('[Analytics] Firebase Analytics ready for Android (via native bridge)');
    } else {
      console.warn('[Analytics] Android bridge not available');
    }
    return;
  }

  // iOS uses Capacitor plugin
  if (isIOS) {
    try {
      // Dynamically import Firebase Analytics plugin
      const { FirebaseAnalytics } = await import('@capacitor-firebase/analytics');
      firebaseAnalytics = FirebaseAnalytics;
      
      console.log('[Analytics] Firebase Analytics initialized for iOS');
    } catch (error) {
      console.error('[Analytics] Failed to initialize Firebase Analytics for iOS:', error);
    }
  }
}

/**
 * Track an event to both Supabase and Firebase
 */
export async function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): Promise<void> {
  const timestamp = new Date().toISOString();
  
  // Get current user from Supabase
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  console.log(`[Analytics] Tracking event: ${eventName}`, eventParams);

  // 1. Track to Supabase (detailed analytics)
  try {
    await supabase.from('app_events').insert({
      user_id: userId,
      event_name: eventName,
      event_params: eventParams || {},
      platform,
      timestamp,
      session_id: getSessionId(),
    });
    
    console.log(`[Analytics] Event saved to Supabase: ${eventName}`);
  } catch (error) {
    console.error('[Analytics] Failed to save event to Supabase:', error);
  }

  // 2. Track to Firebase Analytics (for ads)
  if (isNative) {
    try {
      const params = {
        ...eventParams,
        platform,
        timestamp,
      };
      
      // Android: use native bridge
      if (isAndroid) {
        trackEventAndroid(eventName, params);
      }
      
      // iOS: use Capacitor plugin
      if (isIOS && firebaseAnalytics) {
        await firebaseAnalytics.logEvent({
          name: eventName,
          params,
        });
      }
      
      console.log(`[Analytics] Event sent to Firebase: ${eventName}`);
    } catch (error) {
      console.error('[Analytics] Failed to send event to Firebase:', error);
    }
  }
}

/**
 * Set user ID for analytics
 */
export async function setAnalyticsUserId(userId: string): Promise<void> {
  console.log(`[Analytics] Setting user ID: ${userId}`);

  // Set in Firebase
  if (isNative) {
    try {
      // Android: use native bridge
      if (isAndroid) {
        setUserIdAndroid(userId);
      }
      
      // iOS: use Capacitor plugin
      if (isIOS && firebaseAnalytics) {
        await firebaseAnalytics.setUserId({ userId });
      }
      
      console.log('[Analytics] User ID set in Firebase');
    } catch (error) {
      console.error('[Analytics] Failed to set user ID in Firebase:', error);
    }
  }

  // Supabase already tracks user_id automatically via auth
}

/**
 * Set user property (for segmentation)
 */
export async function setUserProperty(
  propertyName: string,
  propertyValue: string
): Promise<void> {
  console.log(`[Analytics] Setting user property: ${propertyName} = ${propertyValue}`);

  if (isNative) {
    try {
      // Android: use native bridge
      if (isAndroid) {
        setUserPropertyAndroid(propertyName, propertyValue);
      }
      
      // iOS: use Capacitor plugin
      if (isIOS && firebaseAnalytics) {
        await firebaseAnalytics.setUserProperty({
          name: propertyName,
          value: propertyValue,
        });
      }
      
      console.log('[Analytics] User property set in Firebase');
    } catch (error) {
      console.error('[Analytics] Failed to set user property in Firebase:', error);
    }
  }
}

/**
 * Track screen view
 */
export async function trackScreenView(screenName: string): Promise<void> {
  console.log(`[Analytics] Screen view: ${screenName}`);

  // Track as event in Supabase
  await trackEvent('screen_view', { screen_name: screenName });

  // Track in Firebase (iOS only has setCurrentScreen, Android uses event)
  if (isNative) {
    try {
      if (isIOS && firebaseAnalytics) {
        await firebaseAnalytics.setCurrentScreen({ screenName });
      }
      console.log('[Analytics] Screen view sent to Firebase');
    } catch (error) {
      console.error('[Analytics] Failed to send screen view to Firebase:', error);
    }
  }
}

/**
 * Track practice completion (key conversion event)
 */
export async function trackPracticeComplete(params: {
  practiceType: 'meditation' | 'breathing';
  duration: number;
  ondReward: number;
  stressDelta: number;
  energyDelta: number;
  completionRate: number;
}): Promise<void> {
  await trackEvent('practice_complete', params);
}

/**
 * Track user registration (key conversion event)
 */
export async function trackUserRegistration(method: 'email' | 'google' | 'apple'): Promise<void> {
  await trackEvent('sign_up', { method });
}

/**
 * Track user login (key conversion event)
 */
export async function trackUserLogin(method: 'email' | 'google' | 'apple'): Promise<void> {
  await trackEvent('login', { method });
}

/**
 * Track subscription purchase (key conversion event)
 */
export async function trackSubscriptionPurchase(params: {
  productId: string;
  price: number;
  currency: string;
}): Promise<void> {
  await trackEvent('purchase', params);
}

/**
 * Track attribution data from deep links
 */
export async function trackAttribution(params: {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.warn('[Analytics] Cannot track attribution without user');
    return;
  }

  try {
    await supabase.from('analytics_attribution').upsert({
      user_id: user.id,
      utm_source: params.source,
      utm_medium: params.medium,
      utm_campaign: params.campaign,
      utm_term: params.term,
      utm_content: params.content,
      platform,
      first_seen: new Date().toISOString(),
    });
    
    console.log('[Analytics] Attribution data saved', params);
  } catch (error) {
    console.error('[Analytics] Failed to save attribution data:', error);
  }
}

/**
 * Get or create session ID (persists for 30 minutes)
 */
function getSessionId(): string {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const now = Date.now();
  
  const storedSession = localStorage.getItem('analytics_session');
  if (storedSession) {
    const { sessionId, timestamp } = JSON.parse(storedSession);
    
    // Return existing session if still valid
    if (now - timestamp < SESSION_TIMEOUT) {
      return sessionId;
    }
  }
  
  // Create new session
  const newSessionId = `${now}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('analytics_session', JSON.stringify({
    sessionId: newSessionId,
    timestamp: now,
  }));
  
  return newSessionId;
}

/**
 * Parse UTM parameters from URL
 */
export function parseUTMParams(url: string): {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
} | null {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    const utmParams = {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined,
    };
    
    // Return null if no UTM params found
    if (Object.values(utmParams).every(v => v === undefined)) {
      return null;
    }
    
    return utmParams;
  } catch (error) {
    console.error('[Analytics] Failed to parse UTM params:', error);
    return null;
  }
}
