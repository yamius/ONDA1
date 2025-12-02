import { registerPlugin } from '@capacitor/core';

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

export interface HealthKitHeartRatePlugin {
  isAvailable(): Promise<{ available: boolean }>;
  requestAuthorization(): Promise<{ authorized: boolean }>;
  queryHeartRate(options?: { limit?: number; minutesAgo?: number }): Promise<QueryHeartRateResult>;
}

const HealthKitHeartRate = registerPlugin<HealthKitHeartRatePlugin>('HealthKitHeartRate');

export default HealthKitHeartRate;
