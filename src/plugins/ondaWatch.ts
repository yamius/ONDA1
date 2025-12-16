import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface WatchStatus {
  supported: boolean;
  paired?: boolean;
  watchAppInstalled?: boolean;
  reachable?: boolean;
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

export interface OndaWatchPlugin {
  getStatus(): Promise<WatchStatus>;
  startRealtime(): Promise<void>;
  stopRealtime(): Promise<void>;
  sendHeartbeat(): Promise<void>;
  notifyPermissionStart(): Promise<void>;
  notifyPermissionEnd(): Promise<void>;
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
  removeAllListeners(): Promise<void>;
}

const OndaWatch = registerPlugin<OndaWatchPlugin>('OndaWatch');

export default OndaWatch;
