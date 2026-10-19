/** Small persisted markers for analytics params (task 095). No health data. */

/** Every practice_start launch point. */
export type PracticeStartSource =
  | 'home' | 'library' | 'level' | 'recommend_static' | 'checkin' | 'signal' | 'push' | 'onboarding';

const FIRST_WATCH_KEY = 'onda_watch_connected_ever';

/** is_first for watch_connect_success: true only on the first-ever connection
 *  (persisted flag), false afterwards. */
export function consumeFirstWatchConnect(): boolean {
  try {
    if (localStorage.getItem(FIRST_WATCH_KEY) === '1') return false;
    localStorage.setItem(FIRST_WATCH_KEY, '1');
    return true;
  } catch { return false; }
}
