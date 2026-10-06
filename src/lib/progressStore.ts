/**
 * On-device progress store (retention fix, 1.9.3).
 *
 * Before this, practice progress lived ONLY in Supabase and ONLY for signed-in
 * users — an anonymous (but possibly paying, RevenueCat needs no ONDA login)
 * user lost every completed practice, the history, streak, OND and artifacts on
 * each cold start. Now progress is kept on the device for EVERYONE, and merged
 * with Supabase (no loss, no duplicates) when the user signs in.
 *
 * Storage = Capacitor Preferences (native UserDefaults on iOS), NOT localStorage:
 * iOS may purge the web view's storage under disk pressure, and progress is the
 * one thing we can't afford to lose. localStorage is kept only as a fallback for
 * the web build and as a migration source.
 */
import { Preferences } from '@capacitor/preferences';

const KEY = 'onda_progress_v1';

export type CompletedEntry = true | {
  quality?: number;
  qnt?: number;
  sessions?: number[];
  isValidForArtifact?: boolean;
  [k: string]: unknown;
};

export interface PracticeSession {
  id: number;
  practiceId: string;
  date: string;
  [k: string]: unknown;
}

export interface Artifact { circuitId: number; bonus?: number; [k: string]: unknown }

export interface LocalProgress {
  ond: number;
  activeCircuit: number;
  completedPractices: Record<string, CompletedEntry>;
  practiceHistory: PracticeSession[];
  artifacts: Artifact[];
  unlockedAchievements: string[];
  sleepTracking?: { day: number; lastCheck: string | null } | null;
  updatedAt: string;
}

function isEmpty(p: Partial<LocalProgress> | null | undefined): boolean {
  if (!p) return true;
  return !(p.ond || 0)
    && Object.keys(p.completedPractices || {}).length === 0
    && (p.practiceHistory || []).length === 0
    && (p.artifacts || []).length === 0
    && (p.unlockedAchievements || []).length === 0;
}

export async function loadLocalProgress(): Promise<LocalProgress | null> {
  try {
    const { value } = await Preferences.get({ key: KEY });
    if (value) return JSON.parse(value) as LocalProgress;
  } catch { /* fall through to localStorage */ }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as LocalProgress;
  } catch { /* noop */ }
  return null;
}

/** Persist to native storage (+ localStorage mirror for web). Never stores an
 *  empty snapshot over a non-empty one by accident — callers gate on hydration. */
export async function saveLocalProgress(p: LocalProgress): Promise<void> {
  const raw = JSON.stringify(p);
  try { await Preferences.set({ key: KEY, value: raw }); } catch { /* noop */ }
  try { localStorage.setItem(KEY, raw); } catch { /* noop */ }
}

/** Account deleted → the device copy goes too (privacy). */
export async function clearLocalProgress(): Promise<void> {
  try { await Preferences.remove({ key: KEY }); } catch { /* noop */ }
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}

function mergeEntry(a: CompletedEntry | undefined, b: CompletedEntry | undefined): CompletedEntry | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  if (a === true) return b;          // an object carries more than a bare `true`
  if (b === true) return a;
  const sessions = Array.from(new Set([...(a.sessions || []), ...(b.sessions || [])]));
  return {
    ...a,
    ...b,
    quality: Math.max(a.quality ?? 0, b.quality ?? 0),
    qnt: Math.max(a.qnt ?? 0, b.qnt ?? 0),
    sessions,
    isValidForArtifact: !!(a.isValidForArtifact || b.isValidForArtifact),
  };
}

/**
 * Merge device progress with the account's (Supabase) progress — NO LOSS, NO
 * DUPLICATES:
 *  - completed practices: union per practice (best quality/qnt, sessions union,
 *    validated if either is);
 *  - history: union by session id, newest first;
 *  - artifacts: union by circuit; achievements: union;
 *  - OND / active circuit: the larger value (OND is a running total — adding the
 *    two would double-count progress that was already synced).
 */
export function mergeProgress(local: LocalProgress | null, remote: Partial<LocalProgress> | null): LocalProgress {
  const l = local;
  const r = remote;
  const now = new Date().toISOString();
  if (isEmpty(l) && r) {
    return {
      ond: r.ond || 0, activeCircuit: r.activeCircuit || 1,
      completedPractices: r.completedPractices || {}, practiceHistory: r.practiceHistory || [],
      artifacts: r.artifacts || [], unlockedAchievements: r.unlockedAchievements || [],
      sleepTracking: r.sleepTracking ?? null, updatedAt: now,
    };
  }
  if (!r || isEmpty(r)) return { ...(l as LocalProgress), updatedAt: now };

  const cp: Record<string, CompletedEntry> = {};
  const ids = new Set([...Object.keys(l!.completedPractices || {}), ...Object.keys(r.completedPractices || {})]);
  ids.forEach((id) => {
    const m = mergeEntry(l!.completedPractices?.[id], r.completedPractices?.[id]);
    if (m !== undefined) cp[id] = m;
  });

  const hist = new Map<number, PracticeSession>();
  [...(r.practiceHistory || []), ...(l!.practiceHistory || [])].forEach((s) => { if (s && s.id != null) hist.set(s.id, s); });
  const practiceHistory = Array.from(hist.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const art = new Map<number, Artifact>();
  [...(r.artifacts || []), ...(l!.artifacts || [])].forEach((a) => { if (a && a.circuitId != null) art.set(a.circuitId, a); });

  const lSleep = l!.sleepTracking, rSleep = r.sleepTracking;
  const sleepTracking = !lSleep ? (rSleep ?? null) : !rSleep ? lSleep : ((rSleep.day || 0) >= (lSleep.day || 0) ? rSleep : lSleep);

  return {
    ond: Math.max(l!.ond || 0, r.ond || 0),
    activeCircuit: Math.max(l!.activeCircuit || 1, r.activeCircuit || 1),
    completedPractices: cp,
    practiceHistory,
    artifacts: Array.from(art.values()),
    unlockedAchievements: Array.from(new Set([...(l!.unlockedAchievements || []), ...(r.unlockedAchievements || [])])),
    sleepTracking,
    updatedAt: now,
  };
}
