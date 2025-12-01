import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';

export async function initIOSAuthHandler(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  console.log('[iOS Auth] Initializing native auth handler...');

  // Слушаем URL открытия приложения (deep links)
  CapacitorApp.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
    console.log('[iOS Auth] App opened with URL:', event.url);
    await handleOAuthCallback(event.url);
  });
  
  // Слушаем закрытие браузера (OAuth flow завершён)
  Browser.addListener('browserFinished', async () => {
    console.log('[iOS Auth] Browser finished, checking session...');
    // Небольшая задержка чтобы Supabase успел обработать callback
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkAndRefreshSession();
  });

  CapacitorApp.addListener('appStateChange', async ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
      console.log('[iOS Auth] App became active, checking session...');
      await checkAndRefreshSession();
    }
  });
}

async function handleOAuthCallback(urlString: string): Promise<void> {
  try {
    console.log('[iOS Auth] Handling OAuth callback:', urlString);
    
    // Проверяем разные схемы URL (capacitor://, com.onda.app://, com.onda-life.ios://)
    const isOAuthCallback = 
      urlString.startsWith('capacitor://') ||
      urlString.startsWith('com.onda.app://') ||
      urlString.startsWith('com.onda-life.ios://');
    
    if (!isOAuthCallback) {
      console.log('[iOS Auth] Not an OAuth callback URL');
      return;
    }
    
    console.log('[iOS Auth] OAuth callback detected');
    
    // Закрываем браузер
    try {
      await Browser.close();
    } catch (e) {
      console.log('[iOS Auth] Browser already closed or not open');
    }
    
    // Пробуем извлечь токены из URL
    // URL может быть: capacitor://localhost#access_token=...&refresh_token=...
    const hashIndex = urlString.indexOf('#');
    if (hashIndex !== -1) {
      const hashParams = new URLSearchParams(urlString.substring(hashIndex + 1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        console.log('[iOS Auth] Tokens found in URL hash, setting session...');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (error) {
          console.error('[iOS Auth] Failed to set session:', error);
        } else {
          console.log('[iOS Auth] Session set successfully!');
          window.dispatchEvent(new CustomEvent('oauth-success'));
          return;
        }
      }
    }
    
    // Если токенов нет в URL, проверяем сессию
    await checkAndRefreshSession();
  } catch (error) {
    console.error('[iOS Auth] Error handling OAuth callback:', error);
  }
}

async function checkAndRefreshSession(): Promise<void> {
  try {
    // Сначала пробуем получить текущую сессию
    let { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[iOS Auth] Error getting session:', error);
    }
    
    // Если сессия есть, но возможно устарела - пробуем обновить
    if (session) {
      console.log('[iOS Auth] Session found, refreshing...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('[iOS Auth] Error refreshing session:', refreshError);
      } else if (refreshData.session) {
        session = refreshData.session;
      }
    }
    
    if (session) {
      console.log('[iOS Auth] Valid session:', session.user.email);
      window.dispatchEvent(new CustomEvent('oauth-success'));
    } else {
      console.log('[iOS Auth] No session found, trying to get user...');
      // Последняя попытка - проверить пользователя напрямую
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('[iOS Auth] User found:', user.email);
        window.dispatchEvent(new CustomEvent('oauth-success'));
      } else {
        console.log('[iOS Auth] No user found');
      }
    }
  } catch (error) {
    console.error('[iOS Auth] Error checking session:', error);
  }
}
