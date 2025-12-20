import React, { useEffect, useState } from 'react';
import { Watch } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import OndaWatch from '../plugins/ondaWatch';

interface WatchConnectionPromptProps {
  visible: boolean;
  onConnected: () => void;
}

/**
 * Блок который показывается после получения разрешений
 * и автоматически исчезает когда Watch подключится
 */
export function WatchConnectionPrompt({ visible, onConnected }: WatchConnectionPromptProps) {
  const [isWatchConnected, setIsWatchConnected] = useState(false);

  useEffect(() => {
    if (!visible || Capacitor.getPlatform() !== 'ios') {
      return;
    }

    let statusCheckInterval: ReturnType<typeof setInterval> | null = null;
    let listener: any = null;

    const checkWatchStatus = async () => {
      try {
        const status = await OndaWatch.getStatus();
        
        // Считаем Watch подключенным если он reachable
        if (status.reachable) {
          console.log('[WatchConnectionPrompt] ✅ Watch connected!');
          setIsWatchConnected(true);
          onConnected();
        }
      } catch (error) {
        console.error('[WatchConnectionPrompt] Error checking status:', error);
      }
    };

    // Проверяем статус сразу
    checkWatchStatus();

    // Проверяем каждые 3 секунды
    statusCheckInterval = setInterval(checkWatchStatus, 3000);

    // Слушаем события от Watch plugin
    const setupListener = async () => {
      try {
        listener = await OndaWatch.addListener('watchConnectionChanged', (event) => {
          console.log('[WatchConnectionPrompt] Watch connection changed:', event);
          if (event.isWatchConnected) {
            setIsWatchConnected(true);
            onConnected();
          }
        });
      } catch (error) {
        console.log('[WatchConnectionPrompt] Could not setup listener:', error);
      }
    };

    setupListener();

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      listener?.remove();
    };
  }, [visible, onConnected]);

  // Не показываем если не visible или уже подключен
  if (!visible || isWatchConnected) {
    return null;
  }

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 overflow-hidden backdrop-blur-sm">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Watch className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white mb-2">
              Откройте приложение на Apple Watch
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Часы получили сигнал о начале мониторинга. Откройте приложение ONDA на часах для запуска отслеживания пульса.
            </p>

            {/* Animated dots */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-400">Ожидание подключения</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
