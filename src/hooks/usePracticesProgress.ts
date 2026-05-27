import { useMemo } from 'react';

/**
 * Shape of a single completed practice session stored in `practiceHistory`
 * inside `onda-level1-demo_27.tsx` (and mirrored to Supabase's
 * `user_game_progress.practice_history` jsonb column).
 *
 * Only the `date` field is required for streak/total derivation; everything
 * else is here for type safety against the existing producer site.
 */
export interface PracticeSession {
  id: number;
  practiceId: string;
  practiceName?: string;
  /** ISO 8601 timestamp produced by `new Date().toISOString()` */
  date: string;
  duration?: number;
  quality?: number;
  qnt?: number;
  stress?: number;
  energy?: number;
  isNewRecord?: boolean | object;
}

export interface PracticesProgress {
  /** Consecutive calendar days with at least one completed practice. */
  streak: number;
  /** Total number of completed practice sessions, ever. */
  total: number;
}

/**
 * Local-date key in `YYYY-MM-DD` form. We use the user's local timezone
 * rather than UTC so that a practice done at 23:30 and one done at 00:30
 * count as "different days" the same way the user perceives them.
 */
function localDateKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dayKeyOffsetFromToday(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Derive streak + total from the existing `practiceHistory` array.
 *
 * Streak rules (common product convention, matches Apple Fitness / Duolingo):
 * - If the user has practiced today, streak = today + every consecutive
 *   day backwards that also has a practice.
 * - If they haven't practiced today but did yesterday, streak is "alive at
 *   risk" — we still count it from yesterday backwards. The user has the
 *   remaining hours of today to keep it going.
 * - If the latest practice is older than yesterday, streak = 0 (broken).
 *
 * Pure derivation, no I/O. Memoized on `practiceHistory` length + first
 * id (cheap stability check) to avoid recomputing on unrelated rerenders.
 */
export function usePracticesProgress(
  practiceHistory: PracticeSession[] | undefined | null
): PracticesProgress {
  const history = practiceHistory ?? [];

  return useMemo(() => {
    if (history.length === 0) {
      return { streak: 0, total: 0 };
    }

    const dayKeys = new Set<string>();
    for (const session of history) {
      const key = localDateKey(session.date);
      if (key) dayKeys.add(key);
    }

    const today = dayKeyOffsetFromToday(0);
    const yesterday = dayKeyOffsetFromToday(1);

    // Pick the anchor day to start counting from.
    let anchorOffset: number;
    if (dayKeys.has(today)) {
      anchorOffset = 0;
    } else if (dayKeys.has(yesterday)) {
      anchorOffset = 1;
    } else {
      return { streak: 0, total: history.length };
    }

    // Walk backwards day-by-day; stop on the first gap.
    let streak = 0;
    let offset = anchorOffset;
    // Safety cap: nobody legitimately has a 10-year unbroken streak; this
    // also bounds the loop in case of a malformed history.
    const maxIter = 3650;
    while (offset < maxIter && dayKeys.has(dayKeyOffsetFromToday(offset))) {
      streak += 1;
      offset += 1;
    }

    return { streak, total: history.length };
    // We re-derive whenever the history length OR the most-recent session
    // identity changes. Mutating older entries in place is not a pattern
    // the producer uses, so this is sufficient.
  }, [history.length, history[0]?.id]);
}
