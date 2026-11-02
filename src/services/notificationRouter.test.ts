import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => false, isPluginAvailable: () => false } }));
vi.mock('@capacitor/local-notifications', () => ({ LocalNotifications: { addListener: vi.fn() } }));

import { parseNotificationOpen, _dispatchRaw, setNotificationOpenHandler, _resetRouterForTests } from './notificationRouter';

const tap = (extra: unknown) => ({ actionId: 'tap', notification: { id: 1, extra } });

describe('parseNotificationOpen', () => {
  it('reads native A1 (plugin exposes whole userInfo incl. cap_extra)', () => {
    const ui = { kind: 'checkin', checkin_type: 'A1', segment: 'watch' };
    const info = parseNotificationOpen(tap({ ...ui, cap_extra: ui }));
    expect(info).toMatchObject({ kind: 'checkin', checkin_type: 'A1', segment: 'watch', simulated: false });
  });
  it('reads a legacy native A1 with raw top-level keys only', () => {
    expect(parseNotificationOpen(tap({ kind: 'checkin', checkin_type: 'A1', segment: 'watch' })).checkin_type).toBe('A1');
  });
  it('legacy signal push (anomaly_metric only) → kind signal', () => {
    const info = parseNotificationOpen(tap({ anomaly_metric: 'hrv' }));
    expect(info.kind).toBe('signal');
    expect(info.metric).toBe('hrv');
  });
  it('new signal push carries value + corridor + internal_test', () => {
    const p = { kind: 'signal', anomaly_metric: 'rhr', anomaly_value: 66, anomaly_lo: 55, anomaly_hi: 61, internal_test: true };
    expect(parseNotificationOpen(tap({ cap_extra: p }))).toMatchObject({ kind: 'signal', metric: 'rhr', value: 66, lo: 55, hi: 61, internal_test: true });
  });
  it('JS B1 extra', () => {
    expect(parseNotificationOpen(tap({ kind: 'checkin', checkin_type: 'B1', segment: 'no_watch', simulated: false })))
      .toMatchObject({ kind: 'checkin', checkin_type: 'B1', segment: 'no_watch', simulated: false });
  });
  it('empty payload → unknown', () => {
    expect(parseNotificationOpen({}).kind).toBe('unknown');
  });
});

describe('router buffering (cold start)', () => {
  beforeEach(() => _resetRouterForTests());
  it('buffers taps that arrive before the handler and delivers them once', () => {
    _dispatchRaw(tap({ kind: 'checkin', checkin_type: 'A1', segment: 'watch' }));
    const seen: string[] = [];
    setNotificationOpenHandler((i) => seen.push(String(i.checkin_type)));
    _dispatchRaw(tap({ kind: 'checkin', checkin_type: 'B1', segment: 'no_watch' }));
    expect(seen).toEqual(['A1', 'B1']);
  });
  it('ignores dismiss actions', () => {
    const seen: unknown[] = [];
    setNotificationOpenHandler((i) => seen.push(i));
    _dispatchRaw({ actionId: 'dismiss', notification: { extra: { kind: 'checkin' } } });
    expect(seen).toHaveLength(0);
  });
});
