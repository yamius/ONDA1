import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { KeepAwake } from '@capacitor-community/keep-awake';

/**
 * Keep the screen awake ONLY while `active` is true (task 102).
 *
 * Several surfaces can hold keep-awake at once (practice + camera pulse, etc.),
 * so holders are ref-counted: the screen may sleep only when the last holder
 * releases. A holder releases on `active → false`, on unmount, and the whole
 * lock is dropped when the app goes to background and re-asserted on resume
 * if any holder is still active. Errors never leave the lock on: a failed
 * keepAwake() call is followed by a best-effort allowSleep().
 *
 * Everywhere else iOS auto-lock works normally.
 */
let holders = 0;
let appActive = true;
let listenerInstalled = false;

const isNative = () => {
  try { return Capacitor.isNativePlatform(); } catch { return false; }
};

async function apply(): Promise<void> {
  if (!isNative()) return;
  const want = holders > 0 && appActive;
  try {
    if (want) await KeepAwake.keepAwake();
    else await KeepAwake.allowSleep();
  } catch (err) {
    console.error('[KeepAwake] Error:', err);
    if (want) {
      try { await KeepAwake.allowSleep(); } catch { /* noop */ }
    }
  }
}

function installAppStateListener(): void {
  if (listenerInstalled || !isNative()) return;
  listenerInstalled = true;
  try {
    void App.addListener('appStateChange', ({ isActive }) => {
      appActive = isActive;
      void apply();
    });
  } catch (err) {
    console.error('[KeepAwake] appStateChange listener failed:', err);
  }
}

export function useKeepAwake(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    installAppStateListener();
    holders += 1;
    void apply();
    return () => {
      holders = Math.max(0, holders - 1);
      void apply();
    };
  }, [active]);
}

/** Test-only: reset module state. */
export function __resetKeepAwakeForTests(): void {
  holders = 0;
  appActive = true;
  listenerInstalled = false;
}
