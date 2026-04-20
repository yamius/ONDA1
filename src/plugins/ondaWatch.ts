import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

/**
 * Статус разрешения HealthKit на Apple Watch. Часы сообщают это значение
 * iPhone'у через applicationContext (см. WorkoutManager.sendPermissionStatus).
 * - "notDetermined": пользователь не ответил (или смахнул системный лист)
 * - "denied": пользователь явно отказал — диалог больше не появится
 * - "authorized": доступ выдан
 * - "unknown": часы ещё ничего не сообщили (приложение на часах не запускалось)
 */
export type WatchHealthAuthStatus =
  | 'notDetermined'
  | 'denied'
  | 'authorized'
  | 'unknown';

export interface WatchStatus {
  supported: boolean;
  paired?: boolean;
  watchAppInstalled?: boolean;
  reachable?: boolean;
  healthAuthStatus?: WatchHealthAuthStatus;
}

export interface HeartRateEvent {
  value: number;
}

export interface StatusEvent {
  value: string;
}

export interface DebugLogEvent {
  log: string[];
  receivedCount: number;
}

export interface WatchConnectionStatus {
  isWatchConnected: boolean;
  timestamp: number;
  healthAuthStatus?: WatchHealthAuthStatus;
}

export interface OndaWatchPlugin {
  getStatus(): Promise<WatchStatus>;
  startRealtime(): Promise<void>;
  stopRealtime(): Promise<void>;
  sendHeartbeat(): Promise<void>;
  requestWatchAppOpen(): Promise<void>;
  
  // 🔥 Новые методы для управления accumulation mode
  pauseRealtime(): Promise<void>;
  resumeRealtime(): Promise<void>;
  
  addListener(
    eventName: 'heartRate',
    listenerFunc: (event: HeartRateEvent) => void
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'status',
    listenerFunc: (event: StatusEvent) => void
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'debugLog',
    listenerFunc: (event: DebugLogEvent) => void
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'watchConnectionChanged',
    listenerFunc: (event: WatchConnectionStatus) => void
  ): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

const OndaWatch = registerPlugin<OndaWatchPlugin>('OndaWatch');

export default OndaWatch;
