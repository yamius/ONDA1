/**
 * App mode (task 83, split changed task 87) — the A/B split between the SIMPLE
 * traffic-light experience (one 🟢/🟡/🔴 + pulse/breathing — the DEFAULT, most
 * people don't want numbers) and the DETAILED/expert experience (baseline
 * corridors + signals + diary, for people who like numbers).
 *
 * A new install is assigned SILENTLY 80% simple / 20% detailed, STABLE for the
 * life of the install (never re-rolled between sessions — that would dirty the
 * A/B). The user never picks at assignment; they can override it in Settings
 * (Simple↔Detailed), which wins over the assignment. Internal/test traffic is
 * excluded from the comparison via the existing GA4 `internal` user property, so
 * our own builds don't skew retention.
 */
export type AppMode = 'simple' | 'detailed';

const KEY = 'onda_mode';

/** Share of new installs put into DETAILED (expert). The rest get SIMPLE. */
const DETAILED_SHARE = 0.2;

export function getStoredMode(): AppMode | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'simple' || v === 'detailed' ? v : null;
  } catch {
    return null;
  }
}

export function setMode(m: AppMode): void {
  try { localStorage.setItem(KEY, m); } catch { /* noop */ }
}

/**
 * First run → assign 80% simple / 20% detailed and persist. Returns the resolved
 * mode and whether it was JUST assigned (so the caller fires `mode_assigned`
 * exactly once). Simple is the default; the 20% detailed arm is the control.
 */
export function ensureModeAssigned(): { mode: AppMode; assigned: boolean } {
  const existing = getStoredMode();
  if (existing) return { mode: existing, assigned: false };
  const mode: AppMode = Math.random() < DETAILED_SHARE ? 'detailed' : 'simple';
  setMode(mode);
  return { mode, assigned: true };
}
