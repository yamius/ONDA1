import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';

export async function initIOSAuthHandler(): Promise<void> {
  if (Capacitor.getPlatform() !== 'ios') {
    return;
  }

  console.log('[iOS Auth] Initializing iOS auth handler...');

  CapacitorApp.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
    console.log('[iOS Auth] App opened with URL:', event.url);
    
    const url = new URL(event.url);
    
    if (url.protocol === 'com.onda.app:' || url.protocol === 'com.onda-life.ios:') {
      console.log('[iOS Auth] OAuth callback detected');
      
      const hashParams = new URLSearchParams(url.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        console.log('[iOS Auth] Tokens found in URL, setting session...');
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('[iOS Auth] Failed to set session:', error);
          } else {
            console.log('[iOS Auth] Session set successfully!');
            window.dispatchEvent(new CustomEvent('oauth-success'));
          }
        } catch (error) {
          console.error('[iOS Auth] Error setting session:', error);
        }
      } else {
        console.log('[iOS Auth] No tokens in URL, checking session...');
        await checkAndRefreshSession();
      }
    }
  });

  CapacitorApp.addListener('appStateChange', async ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
      console.log('[iOS Auth] App became active, checking session...');
      await checkAndRefreshSession();
    }
  });
}

async function checkAndRefreshSession(): Promise<void> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[iOS Auth] Error getting session:', error);
      return;
    }
    
    if (session) {
      console.log('[iOS Auth] Valid session found:', session.user.email);
      window.dispatchEvent(new CustomEvent('oauth-success'));
    } else {
      console.log('[iOS Auth] No session found');
    }
  } catch (error) {
    console.error('[iOS Auth] Error checking session:', error);
  }
}
