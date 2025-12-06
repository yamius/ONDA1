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

export interface HealthKitDataResult {
  ts: string;
  source: string;
  activity?: {
    steps?: number;
    activeCaloriesBurned?: number;
    vo2Max?: number;
  };
  vitals?: {
    heartRate?: number;
    restingHeartRate?: number;
    hrv?: number;
    respiratoryRate?: number;
    spo2?: number;
    bodyTemperature?: number;
    bloodPressureSys?: number;
    bloodPressureDia?: number;
    bloodGlucose?: number;
  };
  body?: {
    weightKg?: number;
    heightCm?: number;
    bodyFatPct?: number;
  };
  sleep?: {
    main?: {
      durationMin?: number;
      sleepStart?: string;
      wakeTime?: string;
    };
  };
  wellness?: {
    mindfulnessMinutes?: number;
    mindfulnessSessions?: number;
  };
}

export interface HealthKitHeartRatePlugin {
  isAvailable(): Promise<{ available: boolean }>;
  requestAuthorization(): Promise<{ authorized: boolean }>;
  requestFullAuthorization(): Promise<{ authorized: boolean }>;
  queryHeartRate(options?: { limit?: number; minutesAgo?: number }): Promise<QueryHeartRateResult>;
  queryAllHealthData(): Promise<HealthKitDataResult>;
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
