/**
 * 101: is_first_session — the FIRST app session after install.
 *
 * Starts when the first-ever hub entry is claimed (claimFirstHomeView → true,
 * the same moment home_view{source:first_launch} fires). Ends at the first of:
 *   - the app going to background / being terminated (appStateChange inactive),
 *   - FIRST_SESSION_MAX_MS (30 min) after it started.
 * The end is persisted in Preferences (`onda_first_session_ended` = '1'), so a
 * later cold start is never a first session (also: the claim is one-shot).
 * Upgraders already have the home-view marker → never a first session.
 */
import { Preferences } from '@capacitor/preferences';

export const FIRST_SESSION_MAX_MS = 30 * 60_000;
const ENDED_KEY = 'onda_first_session_ended';

let startedAt: number | null = null;
let ended = false;

export function startFirstSession(now: number = Date.now()): void {
  if (ended || startedAt != null) return;
  startedAt = now;
}

export function endFirstSession(): void {
  if (ended) return;
  ended = true;
  try { localStorage.setItem(ENDED_KEY, '1'); } catch { /* noop */ }
  void Preferences.set({ key: ENDED_KEY, value: '1' }).catch(() => undefined);
}

export function isFirstSession(now: number = Date.now()): boolean {
  if (ended || startedAt == null) return false;
  if (now - startedAt > FIRST_SESSION_MAX_MS) { endFirstSession(); return false; }
  return true;
}

/** test-only */
export function _resetFirstSession(): void { startedAt = null; ended = false; }
