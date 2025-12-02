import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface HeartRateSample {
  bpm: number;
  timestamp: string;
  sourceName: string;
}

export interface QueryHeartRateResult {
  samples: HeartRateSample[];
  latestBpm: number | null;
  count: number;
}

export interface HeartRateUpdateEvent {
  bpm: number;
  timestamp: string;
  sourceName: string;
  isRealtime: boolean;
}

export interface HealthKitHeartRatePlugin {
  isAvailable(): Promise<{ available: boolean }>;
  requestAuthorization(): Promise<{ authorized: boolean }>;
  queryHeartRate(options?: { limit?: number; minutesAgo?: number }): Promise<QueryHeartRateResult>;
  startRealtimeMonitoring(): Promise<{ started: boolean }>;
  stopRealtimeMonitoring(): Promise<{ stopped: boolean }>;
  addListener(
    eventName: 'heartRateUpdate',
    listenerFunc: (event: HeartRateUpdateEvent) => void
  ): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

const HealthKitHeartRate = registerPlugin<HealthKitHeartRatePlugin>('HealthKitHeartRate');

export default HealthKitHeartRate;
