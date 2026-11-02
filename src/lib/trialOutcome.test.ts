import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@capacitor/preferences', () => {
  const store = new Map<string, string>();
  return {
    Preferences: {
      get: async ({ key }: { key: string }) => { await Promise.resolve(); return { value: store.get(key) ?? null }; },
      set: async ({ key, value }: { key: string; value: string }) => { await Promise.resolve(); store.set(key, value); },
      remove: async ({ key }: { key: string }) => { await Promise.resolve(); store.delete(key); },
      _store: store,
    },
  };
});

import { Preferences } from '@capacitor/preferences';
import {
  evaluateTrial, startTrialMarker, noteTrialAppOpen, checkTrialOutcome, readTrialMarker,
  recordPaywallSource, readPaywallSource, trialDaysFor, type TrialMarker,
} from './trialOutcome';

const DAY = 86_400_000;
const T0 = new Date(2026, 9, 1, 10).getTime();
const marker: TrialMarker = {
  startedAt: T0, productId: 'm', plan: 'monthly', trialDays: 7,
  expectedEndAt: T0 + 7 * DAY, practicesAtStart: 0, dayKeys: [],
};

describe('trial_outcome evaluation (101)', () => {
  beforeEach(() => { localStorage.clear(); (Preferences as any)._store.clear(); });

  it('converted: TRIAL -> NORMAL with active entitlement', () => {
    expect(evaluateTrial(marker, { isActive: true, periodType: 'NORMAL' }, T0 + 8 * DAY)).toBe('converted');
  });

  it('expired: entitlement inactive after the trial end', () => {
    expect(evaluateTrial(marker, { isActive: false, periodType: 'TRIAL', expirationDateMillis: T0 + 7 * DAY }, T0 + 7 * DAY + 1)).toBe('expired');
    expect(evaluateTrial(marker, null, T0 + 8 * DAY)).toBe('expired');
  });

  it('pending: still in trial (incl. cancelled-but-in-trial) or before the end', () => {
    expect(evaluateTrial(marker, { isActive: true, periodType: 'TRIAL' }, T0 + 3 * DAY)).toBe('pending');
    expect(evaluateTrial(marker, null, T0 + 3 * DAY)).toBe('pending');
  });

  it('app closed across the boundary: decided on the next open, counts only in-trial', async () => {
    await startTrialMarker({ productId: 'm', plan: 'monthly', trialDays: 7, practicesAtStart: 1, now: T0 });
    await noteTrialAppOpen(T0 + 2 * DAY);
    await noteTrialAppOpen(T0 + 2 * DAY + 3600e3); // same day
    const history = [
      { date: new Date(T0 - DAY).toISOString() },
      { date: new Date(T0 + DAY).toISOString() },
      { date: new Date(T0 + 2 * DAY).toISOString() },
      { date: new Date(T0 + 20 * DAY).toISOString() },
    ];
    // App reopened 20 days later — the conversion happened while closed.
    await noteTrialAppOpen(T0 + 20 * DAY); // after the end → ignored
    const p = await checkTrialOutcome({ ent: { isActive: true, periodType: 'NORMAL' }, now: T0 + 20 * DAY, practiceHistory: history });
    expect(p).toMatchObject({ outcome: 'converted', practices_in_trial: '2', days_active_in_trial: '2', trial_days: '7', plan: 'monthly', watch_connected: 'false', baseline_filled: 'false' });
    expect(Object.values(p!).every((v) => typeof v === 'string')).toBe(true);
  });

  it('double-send guard: concurrent and repeated checks send once', async () => {
    await startTrialMarker({ productId: 'y', plan: 'yearly', trialDays: 14, practicesAtStart: 0, now: T0 });
    localStorage.setItem('onda_baseline_filled_tracked', '1');
    const args = { ent: null, now: T0 + 15 * DAY, practiceHistory: [], watchConnectedNow: true };
    const r = await Promise.all([checkTrialOutcome(args), checkTrialOutcome(args)]);
    expect(r.filter(Boolean)).toHaveLength(1);
    expect(r.find(Boolean)).toMatchObject({ outcome: 'expired', watch_connected: 'true', baseline_filled: 'true' });
    expect(await checkTrialOutcome(args)).toBeNull();
    expect(await readTrialMarker()).toBeNull();
  });

  it('pending leaves the marker in place', async () => {
    await startTrialMarker({ productId: 'm', plan: 'monthly', trialDays: 7, practicesAtStart: 0, now: T0 });
    expect(await checkTrialOutcome({ ent: { isActive: true, periodType: 'TRIAL' }, now: T0 + DAY, practiceHistory: [] })).toBeNull();
    expect(await readTrialMarker()).not.toBeNull();
  });

  it('trial length + paywall source', async () => {
    expect(trialDaysFor('monthly')).toBe(7);
    expect(trialDaysFor('yearly')).toBe(14);
    expect(trialDaysFor('monthly', { price: 0, periodNumberOfUnits: 2, periodUnit: 'WEEK' })).toBe(14);
    expect(await readPaywallSource()).toBe('unknown');
    await recordPaywallSource('practice_gate_basic');
    expect(await readPaywallSource()).toBe('practice_gate_basic');
  });
});
