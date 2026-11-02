import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const keepAwake = vi.fn(async () => {});
const allowSleep = vi.fn(async () => {});
let appListener: ((s: { isActive: boolean }) => void) | null = null;

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));
vi.mock('@capacitor-community/keep-awake', () => ({ KeepAwake: { keepAwake: () => keepAwake(), allowSleep: () => allowSleep() } }));
vi.mock('@capacitor/app', () => ({
  App: { addListener: (_e: string, cb: (s: { isActive: boolean }) => void) => { appListener = cb; return Promise.resolve({ remove: () => {} }); } },
}));

import { useKeepAwake, __resetKeepAwakeForTests } from './useKeepAwake';

const last = () => {
  const k = keepAwake.mock.invocationCallOrder.slice(-1)[0] ?? 0;
  const a = allowSleep.mock.invocationCallOrder.slice(-1)[0] ?? 0;
  return k > a ? 'awake' : 'sleep';
};

describe('useKeepAwake (task 102)', () => {
  beforeEach(() => { keepAwake.mockClear(); allowSleep.mockClear(); __resetKeepAwakeForTests(); appListener = null; });

  it('does nothing while inactive', () => {
    renderHook(() => useKeepAwake(false));
    expect(keepAwake).not.toHaveBeenCalled();
  });

  it('holds while active, releases on deactivate and unmount', () => {
    const { rerender, unmount } = renderHook(({ a }) => useKeepAwake(a), { initialProps: { a: true } });
    expect(last()).toBe('awake');
    rerender({ a: false });
    expect(last()).toBe('sleep');
    rerender({ a: true });
    expect(last()).toBe('awake');
    unmount();
    expect(last()).toBe('sleep');
  });

  it('ref-counts holders', () => {
    const h1 = renderHook(() => useKeepAwake(true));
    const h2 = renderHook(() => useKeepAwake(true));
    h1.unmount();
    expect(last()).toBe('awake');
    h2.unmount();
    expect(last()).toBe('sleep');
  });

  it('releases on background and re-asserts on resume', () => {
    renderHook(() => useKeepAwake(true));
    appListener!({ isActive: false });
    expect(last()).toBe('sleep');
    appListener!({ isActive: true });
    expect(last()).toBe('awake');
  });

  it('falls back to allowSleep when keepAwake throws', async () => {
    keepAwake.mockImplementationOnce(async () => { throw new Error('x'); });
    renderHook(() => useKeepAwake(true));
    await new Promise((r) => setTimeout(r, 0));
    expect(allowSleep).toHaveBeenCalled();
  });
});
