import { describe, it, expect } from 'vitest';
import {
  aggregateSamples,
  computeScores,
  recommendState,
  recommendedPractices,
  type ScanSample,
  type ScanAggregate,
} from '../eyeScanMetrics';

function mkSample(t: number, over: Partial<ScanSample> = {}): ScanSample {
  return {
    t,
    faceFound: true,
    blink: 0.1,
    gazeX: 0,
    gazeY: 0,
    eyeOpenness: 0.95,
    headX: 0.5,
    headY: 0.5,
    ...over,
  };
}

describe('aggregateSamples', () => {
  it('возвращает нули для пустого скана', () => {
    const agg = aggregateSamples([]);
    expect(agg.sampleCount).toBe(0);
    expect(agg.durationMs).toBe(0);
    expect(agg.blinkRate).toBe(0);
    expect(agg.faceFoundRatio).toBe(0);
  });

  it('faceFoundRatio = 0, если лицо нигде не найдено', () => {
    const samples = [0, 1000, 2000].map((t) => mkSample(t, { faceFound: false }));
    const agg = aggregateSamples(samples);
    expect(agg.faceFoundRatio).toBe(0);
    expect(agg.gazeStability).toBe(0);
    expect(agg.blinkRate).toBe(0);
  });

  it('считает частоту морганий по нарастающим фронтам', () => {
    // 61 кадр по 1000 мс (0..60000). 5 изолированных пиков blink = 5 морганий.
    const peaks = new Set([5, 15, 25, 35, 45]);
    const samples: ScanSample[] = [];
    for (let i = 0; i <= 60; i++) {
      samples.push(mkSample(i * 1000, { blink: peaks.has(i) ? 0.9 : 0.1 }));
    }
    const agg = aggregateSamples(samples);
    expect(agg.durationMs).toBe(60000);
    expect(agg.blinkRate).toBeCloseTo(5, 5);
  });

  it('неподвижный взгляд даёт стабильность 1, дрожащий — меньше', () => {
    const steady = [0, 1000, 2000, 3000].map((t) => mkSample(t));
    expect(aggregateSamples(steady).gazeStability).toBe(1);

    const jittery = [0, 1000, 2000, 3000].map((t, i) =>
      mkSample(t, { gazeX: i % 2 === 0 ? 0.2 : -0.2 }),
    );
    expect(aggregateSamples(jittery).gazeStability).toBeLessThan(1);
  });

  it('faceFoundRatio учитывает только кадры с лицом', () => {
    const samples = [
      mkSample(0, { faceFound: true }),
      mkSample(1000, { faceFound: false }),
      mkSample(2000, { faceFound: true }),
      mkSample(3000, { faceFound: true }),
    ];
    expect(aggregateSamples(samples).faceFoundRatio).toBeCloseTo(0.75, 5);
  });
});

describe('computeScores', () => {
  const calmAgg: ScanAggregate = {
    durationMs: 45000,
    sampleCount: 1200,
    faceFoundRatio: 0.98,
    blinkRate: 14,
    gazeStability: 0.9,
    headSteadiness: 0.9,
    eyeOpennessAvg: 0.95,
  };

  const tiredAgg: ScanAggregate = {
    durationMs: 45000,
    sampleCount: 1200,
    faceFoundRatio: 0.92,
    blinkRate: 30,
    gazeStability: 0.5,
    headSteadiness: 0.5,
    eyeOpennessAvg: 0.6,
  };

  it('спокойное состояние: высокий calm, низкая fatigue', () => {
    const s = computeScores(calmAgg);
    expect(s.calm).toBeGreaterThan(80);
    expect(s.fatigue).toBeLessThan(20);
    expect(s.quality).toBeGreaterThan(90);
  });

  it('усталое состояние: высокая fatigue, низкий calm', () => {
    const s = computeScores(tiredAgg);
    expect(s.fatigue).toBeGreaterThan(50);
    expect(s.calm).toBeLessThan(50);
  });

  it('баллы остаются в диапазоне 0..100 на крайних входах', () => {
    const extreme = computeScores({
      durationMs: 45000,
      sampleCount: 100,
      faceFoundRatio: 1,
      blinkRate: 200,
      gazeStability: 0,
      headSteadiness: 0,
      eyeOpennessAvg: 0,
    });
    for (const v of Object.values(extreme)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it('quality падает при коротком скане и потере лица', () => {
    const s = computeScores({
      durationMs: 8000,
      sampleCount: 100,
      faceFoundRatio: 0.5,
      blinkRate: 14,
      gazeStability: 0.8,
      headSteadiness: 0.8,
      eyeOpennessAvg: 0.9,
    });
    expect(s.quality).toBeLessThan(40);
  });
});

describe('recommendState / recommendedPractices', () => {
  const base = { calm: 80, focus: 80, fatigue: 10, quality: 90 };

  it('усталость → fatigue', () => {
    expect(recommendState({ ...base, fatigue: 60 })).toBe('fatigue');
  });

  it('низкое спокойствие → anxiety', () => {
    expect(recommendState({ ...base, calm: 30, fatigue: 10 })).toBe('anxiety');
  });

  it('всё в норме → calmness', () => {
    expect(recommendState(base)).toBe('calmness');
  });

  it('recommendedPractices возвращает 3 практики под состояние', () => {
    const list = recommendedPractices({ ...base, fatigue: 70 });
    expect(list).toHaveLength(3);
    expect(list[0]!.id).toBe('slow_glow');
  });
});
