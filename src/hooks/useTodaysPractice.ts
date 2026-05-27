import { useEffect, useRef, useState } from 'react';

/**
 * State machine for the "Today's Practice" hero card on the home screen.
 *
 *   (A) `empty`        — Apple Watch is not connected. The card invites
 *                        the user to connect it and points to the full
 *                        practice list below.
 *   (B) `collecting`   — Watch just connected; we're "personalising" the
 *                        recommendation. Lasts 30 s from the false→true
 *                        transition. Pure UX narrative — the recommendation
 *                        itself is still a random pick from the free set.
 *   (C) `recommended`  — A random practice from `freePracticeIds` is
 *                        surfaced. The pick is stable until the watch
 *                        disconnects + reconnects.
 *
 * Implementation notes:
 * - We use refs to remember the last connection edge so re-renders don't
 *   restart the 30 s timer.
 * - The random pick is locked in when we enter (C); the same pick stays
 *   on screen across re-renders until the next collecting→recommended
 *   transition.
 */

export type TodaysPracticeState = 'empty' | 'collecting' | 'recommended';

const COLLECTING_DURATION_MS = 30_000;

export interface UseTodaysPracticeArgs {
  isWatchConnected: boolean;
  freePracticeIds: readonly string[];
}

export interface UseTodaysPracticeResult {
  state: TodaysPracticeState;
  /** Non-null only in `recommended`. */
  recommendedPracticeId: string | null;
}

function pickRandom<T>(arr: readonly T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useTodaysPractice({
  isWatchConnected,
  freePracticeIds,
}: UseTodaysPracticeArgs): UseTodaysPracticeResult {
  const [state, setState] = useState<TodaysPracticeState>(
    isWatchConnected ? 'collecting' : 'empty'
  );
  const [recommendedPracticeId, setRecommendedPracticeId] = useState<string | null>(null);

  const prevConnectedRef = useRef<boolean>(isWatchConnected);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wasConnected = prevConnectedRef.current;
    prevConnectedRef.current = isWatchConnected;

    // false → true: enter (B) and start the 30 s timer toward (C).
    if (!wasConnected && isWatchConnected) {
      setState('collecting');
      setRecommendedPracticeId(null);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setRecommendedPracticeId(pickRandom(freePracticeIds));
        setState('recommended');
        timerRef.current = null;
      }, COLLECTING_DURATION_MS);
      return;
    }

    // true → false: drop back to (A), clear the pending timer.
    if (wasConnected && !isWatchConnected) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setState('empty');
      setRecommendedPracticeId(null);
      return;
    }

    // First mount, already connected: skip the (B) charade — we have no
    // way to know how long the user has been wearing the watch, so
    // showing a 30 s "collecting" stub here would feel artificial.
    if (isWatchConnected && state === 'collecting' && !timerRef.current) {
      setRecommendedPracticeId(pickRandom(freePracticeIds));
      setState('recommended');
    }
    // freePracticeIds is intentionally not in the dep array — it's a
    // stable constant from the producer site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWatchConnected]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  return { state, recommendedPracticeId };
}
