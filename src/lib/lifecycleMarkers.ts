/**
 * Small persistent markers that give paywall events their context.
 *
 * Deliberately dependency-free and localStorage-only: these are read on the
 * hard-paywall path, which must work for anonymous users with no account and
 * no server round-trip. `practiceHistory` cannot be used for this — it loads
 * asynchronously and is empty for the anonymous free-tier sampler, so it would
 * report "practice 1" for someone on their fourth.
 *
 * HONEST BOUNDARY, true of both markers below: they start at the build that
 * introduced them. A device that already had the app gets its counter from
 * zero and its first-seen date from the update, not from the real install.
 * Nothing can recover that retroactively, so the events say which case they
 * are in rather than presenting an understated number as fact.
 */

const PRACTICE_STARTS_KEY = 'onda_practice_starts_total';
const FIRST_SEEN_KEY = 'onda_first_seen_at';
const FIRST_SEEN_IS_INSTALL_KEY = 'onda_first_seen_is_install';

/** Markers that mean this device was already using the app before we stamped. */
const PRE_EXISTING_MARKERS = [
  'onda_first_run_done',
  'onda_onboarding_completed',
  'onda_tapped_free_practices',
  'onda_airbridge_first_practice_tracked',
];

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the marker is best-effort, never load-bearing */
  }
}

/** Lifetime count of practices STARTED on this device. */
export function practiceAttemptsSoFar(): number {
  const n = Number(read(PRACTICE_STARTS_KEY));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** Called once per practice_start, from the single analytics choke point. */
export function recordPracticeStart(): void {
  write(PRACTICE_STARTS_KEY, String(practiceAttemptsSoFar() + 1));
}

/**
 * Stamp the first time we ever saw this device, once.
 *
 * Also records whether that stamp can honestly be called an install: if any
 * pre-existing progress marker is already present, this is an upgrade and the
 * date is the update, not the install.
 */
export function ensureFirstSeen(): void {
  if (read(FIRST_SEEN_KEY)) return;
  const preExisting = PRE_EXISTING_MARKERS.some((k) => read(k) !== null);
  write(FIRST_SEEN_KEY, String(Date.now()));
  write(FIRST_SEEN_IS_INSTALL_KEY, preExisting ? 'false' : 'true');
}

/**
 * Days since first seen, as event params.
 *
 * Named `days_since_first_seen` rather than `days_since_install` on purpose:
 * for anyone who already had the app it is NOT the install date, and a name
 * promising otherwise would quietly corrupt any "time to decision" analysis.
 * `first_seen_is_install` says which rows can be read as true install age.
 */
export function daysSinceFirstSeen(): {
  days_since_first_seen?: number;
  first_seen_is_install?: boolean;
} {
  const raw = read(FIRST_SEEN_KEY);
  if (!raw) return {};
  const then = Number(raw);
  if (!Number.isFinite(then)) return {};
  return {
    days_since_first_seen: Math.max(0, Math.floor((Date.now() - then) / 86400000)),
    first_seen_is_install: read(FIRST_SEEN_IS_INSTALL_KEY) !== 'false',
  };
}
