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

/** Single-value figures around the v21 figure. Any may be absent (no data / not authorized). */
export interface BaselineExtrasResult {
  /** Peak heart rate over the window (true max sample). */
  hrpeak?: number;
  /** Average walking heart rate. */
  whr?: number;
  /** Estimated VO2max. */
  vo2?: number;
  /** 1-minute heart-rate recovery (iOS 16+). */
  hrr?: number;
}

/** 14-day baseline read from HealthKit (resting HR / HRV-SDNN / respiratory rate + extras). */
export interface BaselineResult {
  rhr: BaselineSignalStat;
  hrv: BaselineSignalStat;
  rr: BaselineSignalStat;
  extras?: BaselineExtrasResult;
}

/** Clean per-NIGHT values behind one anomaly corridor (noisy nights already dropped). */
export interface CorridorSignal {
  values: number[];   // nightly means, oldest-first, noisy nights excluded
  validNights: number;
}
export interface BaselineCorridorsResult {
  rhr: CorridorSignal;
  hrv: CorridorSignal;
  rr: CorridorSignal;
}

export interface HealthKitHeartRatePlugin {
  isAvailable(): Promise<{ available: boolean }>;
  requestAuthorization(): Promise<{ authorized: boolean }>;
  requestFullAuthorization(): Promise<{ authorized: boolean }>;
  /** Read date of birth from Health ONCE and return only a coarse 10-year age band
   *  (`20-29`…`60+`, `under-20`, or `unknown`). The exact date/age never leaves native —
   *  only the band, for anonymized aggregate analytics. `unknown` when unset/unauthorized. */
  getAgeBand(): Promise<{ ageBand: string }>;
  queryHeartRate(options?: { limit?: number; minutesAgo?: number }): Promise<QueryHeartRateResult>;
  queryAllHealthData(): Promise<HealthKitDataResult>;
  querySleepHistory(options?: { days?: number }): Promise<SleepHistoryResult>;
  /** Read the N-day baseline (default 14) — daily avg/min/max per signal. Needs full HealthKit auth. */
  queryBaseline(options?: { days?: number }): Promise<BaselineResult>;
  /** Per-night corridor values for the anomaly trigger (step 4) — noisy nights dropped. */
  queryBaselineCorridors(options?: { days?: number }): Promise<BaselineCorridorsResult>;
  /** Hand the native background push its localized wording. The push carries NO
   *  numbers (those live in the in-app card); it varies by how many signals have
   *  fired: pushIntro for the first few, pushShort afterwards. */
  setAnomalyStrings(strings: { title: string; pushIntro: string; pushShort: string }): Promise<{ ok: boolean }>;
  /** Register HealthKit background delivery so a night deviation posts a local notification. */
  startAnomalyMonitoring(): Promise<{ started: boolean }>;
  /** Post a time-sensitive local notification after a delay (internal signal test mode). */
  scheduleTestPush(options: { title?: string; body?: string; delaySeconds?: number }): Promise<{ ok: boolean }>;
  /** Render an HTML report to a PDF ON-DEVICE and open the native share sheet. */
  exportPdf(options: {
    html: string;
    fileName?: string;
    /** Optional files to embed in the PDF as extractable attachments (e.g. voice
     *  recordings) so the report is one shareable file. `data` is base64 (no
     *  `data:` prefix). Best-effort: if the native side can't embed, it shares
     *  the plain report. `attached` in the result = how many were embedded. */
    attachments?: { name: string; data: string; mime?: string }[];
  }): Promise<{ ok: boolean; path?: string; attached?: number; sharedFiles?: number }>;
  /** Save a self-contained HTML report (audio embedded → inline players) to a
   *  file and open the native share sheet. Opening it in a browser plays the
   *  voice notes in place. The only way to get one file with playable audio on iOS. */
  exportHtml(options: { html: string; fileName?: string }): Promise<{ ok: boolean; path?: string }>;
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
