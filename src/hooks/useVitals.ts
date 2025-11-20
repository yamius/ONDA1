import { useEffect, useRef, useState } from "react";
import { goertzelPower, clamp01, ewma } from "./dsp";
import { useHeartRate } from "./useHeartRate";
import { useMotion } from "./useMotion";

export function useVitals() {
  const { hr, connected, connect, disconnect, seriesRef, isScanning, availableDevices, connectToDevice, stopScan, platform } = useHeartRate();
  const { activity } = useMotion();

  const [br, setBr] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [hrv, setHrv] = useState<number | null>(null);
  const [csi, setCsi] = useState<number | null>(null);
  const [recoveryRate, setRecoveryRate] = useState<number | null>(null);
  const [hrTrendSlope, setHrTrendSlope] = useState<number | null>(null);
  const [hrAcceleration, setHrAcceleration] = useState<number | null>(null);

  const [arousal, setArousal] = useState<number | null>(null);
  const [calm, setCalm] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [excitement, setExcitement] = useState<number | null>(null);
  const [fatigue, setFatigue] = useState<number | null>(null);
  const [flow, setFlow] = useState<number | null>(null);

  const baseline = useRef({
    hrMean: 70, hrVar: 15,
    brMean: 15, brVar: 3,
    actMean: 0.5, actVar: 0.5,
    ready: false, count: 0
  });

  const dhrDtRef = useRef(0);

  useEffect(() => {
    if (hr == null) return;
    const b = baseline.current;
    if (!b.ready) {
      b.count++;
      b.hrMean = b.hrMean * 0.99 + hr * 0.01;
      b.hrVar = b.hrVar * 0.99 + Math.abs(hr - b.hrMean) * 0.01;
      b.actMean = b.actMean * 0.99 + activity * 0.01;
      b.actVar = b.actVar * 0.99 + Math.abs(activity - b.actMean) * 0.01;
      if (b.count > 120) b.ready = true;
    }
  }, [hr, activity]);

  useEffect(() => {
    const id = setInterval(() => {
      const series = seriesRef.current;
      console.log('useVitals: series length =', series.length);
      if (series.length < 10) return;

      const tNow = series[series.length - 1].t;
      const tStart = tNow - 45;
      const window = series.filter(p => p.t >= tStart);
      const n = 45;
      const xs = new Array(n);
      for (let i = 0; i < n; i++) {
        const tx = tStart + i;
        let j = 0;
        while (j + 1 < window.length && window[j + 1].t < tx) j++;
        const p0 = window[Math.max(0, j)];
        const p1 = window[Math.min(window.length - 1, j + 1)];
        const frac = p1.t === p0.t ? 0 : (tx - p0.t) / (p1.t - p0.t);
        xs[i] = p0.hr + frac * (p1.hr - p0.hr);
      }
      const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
      for (let i = 0; i < xs.length; i++) xs[i] = xs[i] - mean;
      let smooth = -1;
      for (let i = 0; i < xs.length; i++) xs[i] = smooth = ewma(smooth, xs[i], 0.3);

      const fs = 1;
      let bestF = 0.0, bestP = 0;
      for (let f = 0.10; f <= 0.50; f += 0.02) {
        const p = goertzelPower(xs, fs, f);
        if (p > bestP) { bestP = p; bestF = f; }
      }
      const brBpm = bestF > 0 ? bestF * 60 : null;
      const brValue = brBpm ? Math.max(6, Math.min(30, brBpm)) : null;
      setBr(brValue);
      console.log('Breathing Rate:', brValue);

      // Update baseline for BR
      const b = baseline.current;
      if (brValue != null) {
        b.brMean = b.brMean * 0.99 + brValue * 0.01;
        b.brVar = b.brVar * 0.99 + Math.abs(brValue - b.brMean) * 0.01;
      }
      const lastHr = window[window.length - 1].hr;
      const zHr = (lastHr - b.hrMean) / (b.hrVar || 1);
      const zAct = (activity - b.actMean) / (b.actVar || 1);

      const roughBreathStability = Math.min(1, bestP / 200);
      const stress01 = clamp01(0.6 * sigmoid(zHr) + 0.3 * sigmoid(zAct) + 0.1 * (1 - roughBreathStability));
      const energy01 = clamp01(0.6 * (1 - sigmoid(zHr)) + 0.3 * (1 - sigmoid(zAct)) + 0.1 * roughBreathStability);

      const stressValue = Math.round(stress01 * 100);
      const energyValue = Math.round(energy01 * 100);
      setStress(stressValue);
      setEnergy(energyValue);
      console.log('Stress:', stressValue, 'Energy:', energyValue);

      // Calculate extended metrics
      // HRV surrogate - standard deviation of HR
      const hrValues = window.map(p => p.hr);
      const hrMean = hrValues.reduce((a, b) => a + b, 0) / hrValues.length;
      const hrStd = Math.sqrt(hrValues.reduce((a, b) => a + Math.pow(b - hrMean, 2), 0) / hrValues.length);
      setHrv(Math.round(hrStd * 10) / 10);

      // Cardiac Stability Index - inverse of coefficient of variation
      const csiValue = hrMean > 0 ? (1 - (hrStd / hrMean)) : 0;
      setCsi(Math.round(csiValue * 100) / 100);

      // Recovery Rate - HR change rate (slope)
      if (window.length >= 2) {
        const recent = window.slice(-10);
        const timeDiff = recent[recent.length - 1].t - recent[0].t;
        const hrDiff = recent[recent.length - 1].hr - recent[0].hr;
        const rate = timeDiff > 0 ? hrDiff / timeDiff : 0;
        setRecoveryRate(Math.round(rate * 10) / 10);
      }

      // HR trend slope - linear regression slope over 30-60s
      const midpoint = window.length / 2;
      const firstHalf = window.slice(0, Math.floor(midpoint));
      const secondHalf = window.slice(Math.floor(midpoint));
      const firstAvg = firstHalf.reduce((a, b) => a + b.hr, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b.hr, 0) / secondHalf.length;
      const slope = (secondAvg - firstAvg) / (window.length / 2);
      setHrTrendSlope(Math.round(slope * 100) / 100);

      // HR Acceleration - second derivative
      if (window.length >= 3) {
        const last3 = window.slice(-3);
        const acc = (last3[2].hr - 2 * last3[1].hr + last3[0].hr) / Math.pow(last3[1].t - last3[0].t, 2);
        setHrAcceleration(Math.round(acc * 1000) / 1000);
      }

      // Calculate dhr/dt (HR change rate, smoothed with EMA)
      if (window.length >= 2) {
        const recent = window.slice(-5);
        if (recent.length >= 2) {
          const timeDiff = recent[recent.length - 1].t - recent[0].t;
          const hrDiff = recent[recent.length - 1].hr - recent[0].hr;
          const instantRate = timeDiff > 0 ? hrDiff / timeDiff : 0;
          dhrDtRef.current = ewma(dhrDtRef.current, instantRate, 0.3);
        }
      }

      // Calculate emotional indices
      if (lastHr != null && brValue != null) {
        const indices = calculateEmotionalIndices({
          hr: lastHr,
          br: brValue,
          hr0: b.hrMean,
          hrStd: b.hrVar,
          br0: b.brMean,
          brStd: b.brVar,
          hrStdWin: hrStd,
          brMeanWin: brValue,
          brStdWin: 0.5,
          dhr_dt: dhrDtRef.current,
          energy01: energy01,
          stress01: stress01
        });

        setArousal(Math.round(indices.arousal));
        setCalm(Math.round(indices.calm));
        setFocus(Math.round(indices.focus));
        setExcitement(Math.round(indices.excitement));
        setFatigue(Math.round(indices.fatigue));
        setFlow(Math.round(indices.flow));

        console.log('Emotional Indices:', indices);
      }
    }, 2000);
    return () => clearInterval(id);
  }, [seriesRef, activity]);

  return {
    connected, connect, disconnect, hr, br, stress, energy, hrv, csi, recoveryRate, hrTrendSlope, hrAcceleration,
    arousal, calm, focus, excitement, fatigue, flow,
    // Android Bluetooth-specific fields
    isScanning, availableDevices, connectToDevice, stopScan, platform
  };
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function z01(z: number): number {
  return clamp01(0.5 + z / 6);
}

function mid(x: number, m: number, r: number): number {
  return clamp01(1 - Math.abs(x - m) / r);
}

interface EmotionalIndicesParams {
  hr: number;
  br: number;
  hr0: number;
  hrStd: number;
  br0: number;
  brStd: number;
  hrStdWin: number;
  brMeanWin: number;
  brStdWin: number;
  dhr_dt: number;
  energy01: number;
  stress01: number;
}

function calculateEmotionalIndices(params: EmotionalIndicesParams) {
  const { hr, br, hr0, hrStd, br0, brStd, hrStdWin, brMeanWin, brStdWin, dhr_dt, energy01, stress01 } = params;

  const h = z01((hr - hr0) / Math.max(1, hrStd));
  const b = z01((br - br0) / Math.max(1, brStd));

  const Sbr = clamp01(1 - (brStdWin / Math.max(1, brMeanWin)) / 0.40);
  const Lhrv = clamp01(1 - hrStdWin / 6);
  const R = clamp01(Math.max(0, dhr_dt) / 0.5);

  const arousal = 100 * clamp01(0.50 * h + 0.30 * b + 0.20 * R);
  const calm = 100 * clamp01(0.50 * (1 - h) + 0.30 * Sbr + 0.20 * (1 - stress01));
  const focus = 100 * clamp01(0.50 * mid(h, 0.55, 0.30) + 0.30 * Lhrv + 0.20 * Sbr);
  const excitement = 100 * clamp01(0.60 * R + 0.30 * h + 0.10 * b);
  const fatigue = 100 * clamp01(0.50 * h + 0.20 * b + 0.30 * (1 - energy01));
  const flow = 100 * clamp01(0.50 * mid(h, 0.55, 0.25) + 0.30 * Sbr + 0.20 * (1 - stress01));

  return { arousal, calm, focus, excitement, fatigue, flow };
}
