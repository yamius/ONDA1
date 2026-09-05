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

export interface SleepRecord {
  date: string;       // "2026-01-07"
  sleepStart: string; // "23:30"
  wakeTime: string;   // "07:15"
  durationMin: number; // 465
}

export interface SleepHistoryResult {
  records: SleepRecord[];
}

/** One signal's baseline over the window: daily avg/min/max + the real number of days with data. */
export interface BaselineSignalStat {
  avg?: number;
  min?: number;
  max?: number;
  /** Days that actually carried data, 0..window. Never inflated. */
  days: number;
}

/** 14-day baseline read from HealthKit (resting HR / HRV-SDNN / respiratory rate). */
export interface BaselineResult {
  rhr: BaselineSignalStat;
  hrv: BaselineSignalStat;
  rr: BaselineSignalStat;
}

export interface HealthKitHeartRatePlugin {
  isAvailable(): Promise<{ available: boolean }>;
  requestAuthorization(): Promise<{ authorized: boolean }>;
  requestFullAuthorization(): Promise<{ authorized: boolean }>;
  queryHeartRate(options?: { limit?: number; minutesAgo?: number }): Promise<QueryHeartRateResult>;
  queryAllHealthData(): Promise<HealthKitDataResult>;
  querySleepHistory(options?: { days?: number }): Promise<SleepHistoryResult>;
  /** Read the N-day baseline (default 14) — daily avg/min/max per signal. Needs full HealthKit auth. */
  queryBaseline(options?: { days?: number }): Promise<BaselineResult>;
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
