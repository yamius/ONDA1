/**
 * Small persisted markers for analytics params (task 095). No health data.
 * Durable copy in Capacitor Preferences (native UserDefaults, survives WebView
 * storage purges — same pattern as the 1.9.3 progress persistence in diary.ts),
 * mirrored to localStorage. Each claim runs through a per-key promise chain, so
 * two concurrent callers can never both get "yes" (no double-send).
 */
import { Preferences } from '@capacitor/preferences';

/** Every practice_start launch point. */
export type PracticeStartSource =
  | 'home' | 'level' | 'recommend_static' | 'checkin' | 'signal' | 'push' | 'onboarding';

const locks = new Map<string, Promise<unknown>>();
function serialized<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(key, next.catch(() => undefined));
  return next;
}

async function readMarker(key: string): Promise<string | null> {
  try { const { value } = await Preferences.get({ key }); if (value != null) return value; } catch { /* noop */ }
  try { return localStorage.getItem(key); } catch { return null; }
}
async function writeMarker(key: string, value: string): Promise<void> {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
  try { await Preferences.set({ key, value }); } catch { /* noop */ }
}

/** Claim-if-different: resolves true (and persists `value`) only if the stored
 *  value differs; serialized per key. */
function claim(key: string, value: string): Promise<boolean> {
  return serialized(key, async () => {
    if ((await readMarker(key)) === value) return false;
    await writeMarker(key, value);
    return true;
  });
}

const FIRST_WATCH_KEY = 'onda_watch_connected_ever';
/** is_first for watch_connect_success: true only on the first-ever connection. */
export const claimFirstWatchConnect = (): Promise<boolean> => claim(FIRST_WATCH_KEY, '1');

const BASELINE_STATE_DAY_KEY = 'onda_baseline_state_sent_day';
const localDayKey = (now: number) => {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
/** baseline_state dedupe: true at most once per local calendar day. */
export const claimBaselineStateDay = (now: number = Date.now()): Promise<boolean> =>
  claim(BASELINE_STATE_DAY_KEY, localDayKey(now));

const HOME_VIEW_SEEN_KEY = 'onda_home_view_seen';
/** home_view source=first_launch: true only on the first-ever hub entry on this
 *  install. Preferences-backed (localStorage alone was purged for anon users
 *  before 1.9.3); falls back to the legacy localStorage flag so upgraders stay
 *  'relaunch'. */
export const claimFirstHomeView = (): Promise<boolean> => claim(HOME_VIEW_SEEN_KEY, '1');
