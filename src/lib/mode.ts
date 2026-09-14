/**
 * App mode (task 83) — the A/B split between the DETAILED experience (baseline
 * corridors + signals + diary, for people who like numbers) and the SIMPLE
 * traffic-light experience (one 🟢/🟡/🔴 + pulse/breathing, for everyone else).
 *
 * A new install is assigned 50/50, STABLE for the life of the install (never
 * re-rolled between sessions — that would dirty the A/B). The user can override
 * it in Settings. Internal/test traffic is excluded from the comparison via the
 * existing GA4 `internal` user property, so our own builds don't skew retention.
 */
export type AppMode = 'simple' | 'detailed';

const KEY = 'onda_mode';

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
 * First run → assign 50/50 and persist. Returns the resolved mode and whether it
 * was JUST assigned (so the caller fires `mode_assigned` exactly once).
 */
export function ensureModeAssigned(): { mode: AppMode; assigned: boolean } {
  const existing = getStoredMode();
  if (existing) return { mode: existing, assigned: false };
  const mode: AppMode = Math.random() < 0.5 ? 'simple' : 'detailed';
  setMode(mode);
  return { mode, assigned: true };
}
