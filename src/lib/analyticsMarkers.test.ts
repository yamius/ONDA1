import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@capacitor/preferences', () => {
  const store = new Map<string, string>();
  return {
    Preferences: {
      get: async ({ key }: { key: string }) => { await Promise.resolve(); return { value: store.get(key) ?? null }; },
      set: async ({ key, value }: { key: string; value: string }) => { await Promise.resolve(); store.set(key, value); },
      _store: store,
    },
  };
});

import { claimFirstWatchConnect, claimBaselineStateDay } from './analyticsMarkers';
import { stringifyBooleanParams, boolParam } from '../services/AnalyticsService';

describe('analytics markers (095)', () => {
  beforeEach(() => { localStorage.clear(); });

  it('first watch connect: concurrent claims yield exactly one true', async () => {
    const r = await Promise.all([claimFirstWatchConnect(), claimFirstWatchConnect(), claimFirstWatchConnect()]);
    expect(r.filter(Boolean)).toHaveLength(1);
    expect(await claimFirstWatchConnect()).toBe(false);
  });

  it('baseline_state: once per calendar day, concurrency-safe', async () => {
    const d1 = new Date(2026, 9, 19, 8).getTime();
    const r = await Promise.all([claimBaselineStateDay(d1), claimBaselineStateDay(d1 + 3600e3)]);
    expect(r.filter(Boolean)).toHaveLength(1);
    expect(await claimBaselineStateDay(new Date(2026, 9, 20, 1).getTime())).toBe(true);
  });

  it('booleans become "true"/"false" strings', () => {
    expect(stringifyBooleanParams({ granted: true, is_first: false, n: 1, s: 'x' }))
      .toEqual({ granted: 'true', is_first: 'false', n: 1, s: 'x' });
    expect(boolParam(0)).toBe('false');
  });
});
