import { describe, it, expect, beforeEach, vi } from 'vitest';
vi.mock('@capacitor/preferences', () => ({ Preferences: { set: async () => undefined } }));
import { startFirstSession, endFirstSession, isFirstSession, _resetFirstSession, FIRST_SESSION_MAX_MS } from './firstSession';

describe('first session (101)', () => {
  beforeEach(() => _resetFirstSession());
  it('false until started; true inside; ends on background and never restarts', () => {
    expect(isFirstSession(0)).toBe(false);
    startFirstSession(1000);
    expect(isFirstSession(2000)).toBe(true);
    endFirstSession();
    startFirstSession(3000);
    expect(isFirstSession(3000)).toBe(false);
  });
  it('ends after the time cap', () => {
    startFirstSession(0);
    expect(isFirstSession(FIRST_SESSION_MAX_MS + 1)).toBe(false);
    expect(isFirstSession(1)).toBe(false);
  });
});
