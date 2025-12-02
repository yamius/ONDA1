import { useEffect, useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';

interface UseKeepAwakeReturn {
  isSupported: boolean;
  isKeptAwake: boolean;
  keepAwake: () => Promise<void>;
  allowSleep: () => Promise<void>;
}

export function useKeepAwake(autoKeepAwake = true): UseKeepAwakeReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isKeptAwake, setIsKeptAwake] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const result = await KeepAwake.isSupported();
          setIsSupported(result.isSupported);
          console.log('[KeepAwake] Supported:', result.isSupported);
        } else {
          setIsSupported(false);
        }
      } catch (err) {
        console.error('[KeepAwake] Error checking support:', err);
        setIsSupported(false);
      }
    };
    checkSupport();
  }, []);

  const keepAwake = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) return;
      await KeepAwake.keepAwake();
      setIsKeptAwake(true);
      console.log('[KeepAwake] Screen will stay awake');
    } catch (err) {
      console.error('[KeepAwake] Error:', err);
    }
  }, []);

  const allowSleep = useCallback(async () => {
    try {
      if (!Capacitor.isNativePlatform()) return;
      await KeepAwake.allowSleep();
      setIsKeptAwake(false);
      console.log('[KeepAwake] Screen can sleep now');
    } catch (err) {
      console.error('[KeepAwake] Error:', err);
    }
  }, []);

  useEffect(() => {
    if (!autoKeepAwake || !isSupported) return;

    keepAwake();

    return () => {
      allowSleep();
    };
  }, [autoKeepAwake, isSupported, keepAwake, allowSleep]);

  return {
    isSupported,
    isKeptAwake,
    keepAwake,
    allowSleep
  };
}
