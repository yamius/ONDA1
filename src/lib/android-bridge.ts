import { supabase } from './supabase';

/**
 * Обработчик OAuth callback от Android deep link
 * Эта функция вызывается из MainActivity.kt после успешной OAuth авторизации
 */
export async function handleOAuthCallback(accessToken: string, refreshToken: string): Promise<void> {
  console.log('[OAuth] handleOAuthCallback called with tokens');
  
  try {
    // Устанавливаем сессию напрямую через Supabase
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    if (error) {
      console.error('[OAuth] Failed to set session:', error);
      throw error;
    }
    
    console.log('[OAuth] Session set successfully!', {
      user: data.user?.email,
      expiresAt: data.session?.expires_at,
    });
    
    // Обновляем UI - закрываем модальное окно авторизации
    window.dispatchEvent(new CustomEvent('oauth-success'));
  } catch (error) {
    console.error('[OAuth] Error in handleOAuthCallback:', error);
    window.dispatchEvent(new CustomEvent('oauth-error', { detail: error }));
  }
}

/**
 * Check if Health Connect is available on this device
 */
export function isHealthConnectAvailable(): boolean {
  if (typeof window === 'undefined' || !window.Android) {
    console.log('[HealthConnect] Not running in Android WebView');
    return false;
  }

  try {
    const available = window.Android.isHealthConnectAvailable();
    console.log('[HealthConnect] Availability check:', available);
    return available;
  } catch (error) {
    console.error('[HealthConnect] Error checking availability:', error);
    return false;
  }
}

/**
 * Request Health Connect permissions
 * This will trigger the Android permission request dialog
 */
export function requestHealthConnectPermissions(): void {
  if (typeof window === 'undefined' || !window.Android) {
    console.warn('[HealthConnect] Not running in Android WebView, cannot request permissions');
    return;
  }

  try {
    console.log('[HealthConnect] Requesting permissions...');
    window.Android.requestHealthConnectPermissions();
  } catch (error) {
    console.error('[HealthConnect] Error requesting permissions:', error);
  }
}

/**
 * Read Health Connect data
 * This will trigger a data read and dispatch 'hc-update' event with the results
 */
export function readHealthConnectData(): void {
  if (typeof window === 'undefined' || !window.Android) {
    console.warn('[HealthConnect] Not running in Android WebView, cannot read data');
    return;
  }

  try {
    console.log('[HealthConnect] Reading data...');
    window.Android.readHealthConnectData();
  } catch (error) {
    console.error('[HealthConnect] Error reading data:', error);
  }
}

// Экспортируем функцию в глобальный scope для Android bridge
if (typeof window !== 'undefined') {
  (window as any).handleOAuthCallback = handleOAuthCallback;
  console.log('[Android Bridge] OAuth callback handler registered');
  
  // Log Health Connect availability
  if (window.Android) {
    console.log('[Android Bridge] Health Connect methods available');
  }
}
