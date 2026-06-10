import { describe, it, expect } from 'vitest';
import { resolvePulseSource, coherenceForSource, type SourceInputs } from './sensorSource';

const NONE: SourceInputs = {
  bleConnected: false,
  bleHr: null,
  watchHr: null,
  healthkitHr: null,
  notificationHr: null,
  cameraActive: false,
  cameraHr: null,
};

describe('sensorSource — resolvePulseSource', () => {
  it('no inputs → no source', () => {
    expect(resolvePulseSource(NONE)).toEqual({ source: null, hr: null });
  });

  it('watch present, no camera → watch (precise)', () => {
    expect(resolvePulseSource({ ...NONE, watchHr: 68 })).toEqual({ source: 'watch', hr: 68 });
  });

  it('no watch → camera is the primary source', () => {
    expect(resolvePulseSource({ ...NONE, cameraActive: true, cameraHr: 74 })).toEqual({
      source: 'camera',
      hr: 74,
    });
  });

  it('camera active OVERRIDES a present watch (explicit switch — watch not worn)', () => {
    const r = resolvePulseSource({ ...NONE, watchHr: 70, cameraActive: true, cameraHr: 80 });
    expect(r).toEqual({ source: 'camera', hr: 80 });
  });

  it('camera active but no committed bpm yet → still "camera" (searching), not a fallback', () => {
    expect(resolvePulseSource({ ...NONE, cameraActive: true, cameraHr: null })).toEqual({
      source: 'camera',
      hr: null,
    });
  });

  it('BLE beats watch when both present and camera off', () => {
    const r = resolvePulseSource({ ...NONE, bleConnected: true, bleHr: 62, watchHr: 70 });
    expect(r).toEqual({ source: 'ble', hr: 62 });
  });

  it('falls through watch → healthkit → notification', () => {
    expect(resolvePulseSource({ ...NONE, healthkitHr: 66 }).source).toBe('healthkit');
    expect(resolvePulseSource({ ...NONE, notificationHr: 66 }).source).toBe('notification');
  });
});

describe('sensorSource — coherenceForSource (honesty invariant)', () => {
  it('CAMERA source → coherence is ALWAYS null, whatever the raw value', () => {
    expect(coherenceForSource(85, 'camera')).toBeNull();
    expect(coherenceForSource(0, 'camera')).toBeNull();
    expect(coherenceForSource(null, 'camera')).toBeNull();
  });

  it('watch / ble / healthkit / null pass coherence through unchanged', () => {
    expect(coherenceForSource(85, 'watch')).toBe(85);
    expect(coherenceForSource(72, 'ble')).toBe(72);
    expect(coherenceForSource(50, 'healthkit')).toBe(50);
    expect(coherenceForSource(40, 'notification')).toBe(40);
    expect(coherenceForSource(33, null)).toBe(33);
  });
});
