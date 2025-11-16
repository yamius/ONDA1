import { rhythmStore } from "../sleep/rhythm";
import type { DaySleep } from "../sleep/rhythm";

export type HcActivity = {
  activeCaloriesBurned?: number;
  vo2Max?: number;
};

export type HcVitals = {
  heartRate?: number;
  restingHeartRate?: number;
  hrv?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  bloodGlucose?: number;
  spo2?: number;
  respiratoryRate?: number;
  bodyTemperature?: number;
  skinTemperature?: number;
};

export type HcSleepSession = {
  startTime: string;
  endTime: string;
  durationMin?: number;
  stages?: Array<{
    stage: "awake" | "light" | "deep" | "rem";
    startTime: string;
    endTime: string;
  }>;
};

export type HcSleepBlock = {
  main?: DaySleep;
  sessions?: HcSleepSession[];
};

export type HcWellness = {
  mindfulnessMinutes?: number;
  mindfulnessSessions?: number;
  sexualActivityEvents?: number;
};

export type HcBody = {
  weightKg?: number;
  heightCm?: number;
  bodyFatPct?: number;
  bodyWaterMassKg?: number;
  boneMassKg?: number;
  leanBodyMassKg?: number;
  basalMetabolicRate?: number;
};

export type HcNutrition = {
  calories?: number;
  proteinGrams?: number;
  fatGrams?: number;
  carbsGrams?: number;
  hydrationLiters?: number;
};

export type HcFemaleHealth = {
  menstruationFlow?: "light" | "medium" | "heavy" | "spotting";
  basalBodyTemperature?: number;
  cervicalMucus?: "dry" | "sticky" | "creamy" | "egg_white" | "watery";
  ovulationTestPositive?: boolean;
  intermenstrualBleeding?: boolean;
};

export type HcUpdatePayload = {
  ts?: string;
  source?: "health_connect" | "bridge" | "debug";
  activity?: HcActivity;
  vitals?: HcVitals;
  sleep?: HcSleepBlock;
  wellness?: HcWellness;
  body?: HcBody;
  nutrition?: HcNutrition;
  femaleHealth?: HcFemaleHealth;
};

export type HcVitalsPayload = {
  ts: string;
  hr?: number;
  br?: number;
  stress?: number;
  energy?: number;
};

function handleSleepFromHealthConnect(payload: DaySleep) {
  console.log("[HC] sleep payload received", payload);
  try {
    rhythmStore.addDay(payload);
  } catch (e) {
    console.error("[HC] error in rhythmStore.addDay", e);
  }
}

function handleVitalsFromHealthConnect(payload: HcVitalsPayload) {
  console.log("[HC] vitals payload received", payload);
  (window as any).__hcVitals = payload;
  window.dispatchEvent(new CustomEvent("hc-vitals", { detail: payload }));
}

function handleUpdateFromHealthConnect(update: HcUpdatePayload) {
  const ts = update.ts || new Date().toISOString();
  console.log("[HC] update payload received", update);

  if (update.sleep?.main) {
    handleSleepFromHealthConnect(update.sleep.main);
  }
  if (update.sleep?.sessions) {
    window.dispatchEvent(
      new CustomEvent("hc-sleep", { detail: update.sleep.sessions })
    );
  }

  if (update.vitals) {
    const v: HcVitalsPayload = {
      ts,
      hr: update.vitals.heartRate,
      br: update.vitals.respiratoryRate,
      stress: undefined,
      energy: undefined
    };
    handleVitalsFromHealthConnect(v);
  }

  window.dispatchEvent(
    new CustomEvent("hc-update", { detail: update })
  );
}

declare global {
  interface Window {
    onHealthConnectSleep?: (payload: DaySleep) => void;
    onHealthConnectVitals?: (payload: HcVitalsPayload) => void;
    onHealthConnectUpdate?: (payload: HcUpdatePayload) => void;
    Android?: {
      requestHealthConnectPermissions?: () => void;
    };
  }
}

if (typeof window !== "undefined") {
  window.onHealthConnectSleep = handleSleepFromHealthConnect;
  window.onHealthConnectVitals = handleVitalsFromHealthConnect;
  window.onHealthConnectUpdate = handleUpdateFromHealthConnect;

  console.log("[HC] bridge initialized");
}
