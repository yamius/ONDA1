/**
 * Diary storage — ON-DEVICE ONLY (retention step 3; 1.9.3).
 *
 * PRIVACY PROMISE (App Store description, privacy policy, App Privacy labels):
 * the journal — text, voice and camera pulse checks — NEVER leaves the phone.
 * There is NO server sync, signed in or not. Do not add one: it would make the
 * public description and the privacy labels untrue. (Before 1.9.3, signed-in
 * users' entry text was upserted to Supabase `diary_entries`; that sync was
 * removed in 1.9.3.) The only way an entry leaves the device is the user's own
 * explicit PDF/HTML export through the share sheet.
 *
 * No third-party tracker ever sees entry CONTENT; analytics carry counts/flags only.
 */
import { Preferences } from '@capacitor/preferences';

/* ── Durable copy (1.9.3) ────────────────────────────────────────────────────
 * Diary entries are the person's own words — losing them hurts more than any
 * counter. localStorage lives inside the web view, which iOS may purge under
 * disk pressure, so the DURABLE copy now lives in Capacitor Preferences (native
 * UserDefaults). localStorage stays as a synchronous mirror so every existing
 * reader (loadDiaryEntries) keeps working unchanged.
 *  - Launch: hydrateDiary() unions Preferences + localStorage by id. First 1.9.3
 *    launch = migration (local → Preferences); after a purge = restore.
 *  - Until hydration finishes, saves touch ONLY localStorage (a partial list can
 *    never overwrite the durable copy); hydration then unions both.
 *  - Deleted ids are kept as tombstones so the launch union can't resurrect them.
 * Voice/photo media stays in IndexedDB (too big for Preferences).
 */
const PREF_KEY = 'onda_diary_entries';
const TOMB_KEY = 'onda_diary_deleted';
const TOMB_MAX = 500;
let diaryHydrated = false;
let hydratePromise: Promise<void> | null = null;

function loadTombstones(): Set<string> {
  try { const raw = localStorage.getItem(TOMB_KEY); return new Set(raw ? (JSON.parse(raw) as string[]) : []); } catch { return new Set(); }
}
function saveTombstones(ids: Set<string>): void {
  const arr = Array.from(ids).slice(-TOMB_MAX);
  const raw = JSON.stringify(arr);
  try { localStorage.setItem(TOMB_KEY, raw); } catch { /* noop */ }
  if (diaryHydrated) { Preferences.set({ key: TOMB_KEY, value: raw }).catch(() => undefined); }
}
/** Union by id — `primary` wins on conflict. */
function unionById(primary: DiaryEntry[], secondary: DiaryEntry[]): DiaryEntry[] {
  const seen = new Set(primary.map((e) => e.id));
  return [...primary, ...secondary.filter((e) => e && e.id && !seen.has(e.id))];
}

/** Call once at app start. Idempotent; resolves when the diary is safe to sync. */
export function hydrateDiary(): Promise<void> {
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    const local = loadDiaryEntries();
    let durable: DiaryEntry[] = [];
    let durableTomb: string[] = [];
    try { const { value } = await Preferences.get({ key: PREF_KEY }); if (value) { const a = JSON.parse(value); if (Array.isArray(a)) durable = a; } } catch { /* noop */ }
    try { const { value } = await Preferences.get({ key: TOMB_KEY }); if (value) { const a = JSON.parse(value); if (Array.isArray(a)) durableTomb = a; } } catch { /* noop */ }
    const tomb = loadTombstones();
    durableTomb.forEach((id) => tomb.add(id));
    const merged = unionById(local, durable).filter((e) => !tomb.has(e.id));
    diaryHydrated = true;
    saveTombstones(tomb);
    saveDiaryEntries(merged); // writes both the mirror and the durable copy
  })();
  return hydratePromise;
}

export type DiarySource = 'text' | 'voice' | 'photo' | 'text_voice' | 'mixed' | 'camera_checkin';

export interface DiaryEntry {
  id: string;              // client-generated, stable across the sync
  created_at: string;      // ISO — when the note was saved
  event_time: string;      // ISO — when it actually happened (may be backdated)
  text: string;
  // Media (voice/photo) is TOO BIG for localStorage — it lives in IndexedDB
  // (see putMedia/getMedia), keyed by entry id. The entry only carries flags.
  hasAudio?: boolean;
  hasPhoto?: boolean;
  source: DiarySource;
  rhr?: number | null;     // resting-pulse snapshot for that day, if known (§5)
  // Anomaly provenance (step 4) — set when the note was created from a trigger.
  // Feeds the future ON-DEVICE pattern model (§5); never uploaded.
  fromAnomaly?: boolean;
  anomalyMetric?: string;  // rhr | hrv | rr
  anomalyDelta?: number;   // signed deviation from the corridor mean
  synced?: boolean;        // migrated to Supabase
}

/* ── Media store (IndexedDB) — base64 blobs, way past the localStorage quota ── */
const MEDIA_DB = 'onda_diary_media';
const MEDIA_STORE = 'media';
export const mediaKey = (id: string, kind: 'audio' | 'photo') => `${id}:${kind}`;

function openMediaDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(MEDIA_DB, 1);
      req.onupgradeneeded = () => { try { req.result.createObjectStore(MEDIA_STORE); } catch { /* noop */ } };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}
export async function putMedia(key: string, dataUrl: string): Promise<void> {
  const db = await openMediaDB(); if (!db) return;
  await new Promise<void>((r) => { try { const tx = db.transaction(MEDIA_STORE, 'readwrite'); tx.objectStore(MEDIA_STORE).put(dataUrl, key); tx.oncomplete = () => r(); tx.onerror = () => r(); } catch { r(); } });
}
export async function getMedia(key: string): Promise<string | null> {
  const db = await openMediaDB(); if (!db) return null;
  return new Promise((r) => { try { const tx = db.transaction(MEDIA_STORE, 'readonly'); const rq = tx.objectStore(MEDIA_STORE).get(key); rq.onsuccess = () => r(typeof rq.result === 'string' ? rq.result : null); rq.onerror = () => r(null); } catch { r(null); } });
}
export async function delMedia(keys: string[]): Promise<void> {
  const db = await openMediaDB(); if (!db) return;
  try { const tx = db.transaction(MEDIA_STORE, 'readwrite'); keys.forEach((k) => tx.objectStore(MEDIA_STORE).delete(k)); } catch { /* noop */ }
}

/** Derive the coarse source label from what an entry actually carries. */
export function diarySource(hasText: boolean, hasVoice: boolean, hasPhoto: boolean): DiarySource {
  const n = Number(hasText) + Number(hasVoice) + Number(hasPhoto);
  if (n > 1) return 'mixed';
  if (hasVoice) return 'voice';
  if (hasPhoto) return 'photo';
  return 'text';
}

const KEY = 'onda_diary_entries';

/** A daily-metric point for the timeline's baseline rail. */
export interface DailyPoint { date: string; value: number; time: number; }

const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Read a `Record<YYYY-MM-DD, number>` daily store into sorted points (noon of each day). */
export function loadDailyMetric(storeKey: string): DailyPoint[] {
  try {
    const raw = localStorage.getItem(storeKey);
    if (!raw) return [];
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return Object.entries(obj)
        .filter(([, v]) => typeof v === 'number' && (v as number) > 0)
        .map(([date, v]) => ({ date, value: Math.round(v as number), time: new Date(`${date}T12:00:00`).getTime() }))
        .sort((a, b) => a.time - b.time);
    }
  } catch { /* noop */ }
  return [];
}

/** Snapshot today's value into a daily store (dedup by day). No-op on bad values. */
export function recordDailyMetric(storeKey: string, value: number | null | undefined): void {
  if (value == null || !Number.isFinite(value) || value <= 0) return;
  try {
    const raw = localStorage.getItem(storeKey);
    const obj = raw ? JSON.parse(raw) : {};
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      obj[dayKey()] = Math.round(value);
      localStorage.setItem(storeKey, JSON.stringify(obj));
    }
  } catch { /* noop */ }
}

/** localStorage keys for the baseline-rail daily stores. */
export const DAILY_STORES = { hrv: 'onda.hrv_daily_v1', rhr: 'onda_rhr_daily', rr: 'onda_rr_daily' } as const;

/* ── Baseline SAMPLES — timestamped points for the timeline's left rail ──
   One point per Timeline visit, at the real visit time (not a fake noon),
   throttled so we don't add one more often than every 2 hours. */
export interface BaselineSample { time: number; hrv?: number; rhr?: number; rr?: number; }
const SAMPLES_KEY = 'onda_baseline_samples';
const SAMPLE_MIN_GAP = 2 * 60 * 60 * 1000; // 2 hours

export function loadBaselineSamples(): BaselineSample[] {
  try {
    const raw = localStorage.getItem(SAMPLES_KEY);
    if (!raw) return [];
    const a = JSON.parse(raw);
    return Array.isArray(a) ? (a as BaselineSample[]) : [];
  } catch { return []; }
}

/** Append a baseline point at NOW with whatever of the 3 values are known —
 *  unless the last point is < 2h old. Returns true if a point was added. */
export function recordBaselineSample(vals: { hrv?: number | null; rhr?: number | null; rr?: number | null }): boolean {
  const ok = (v: number | null | undefined) => (v != null && Number.isFinite(v) && v > 0 ? Math.round(v) : undefined);
  const clean: Omit<BaselineSample, 'time'> = { hrv: ok(vals.hrv), rhr: ok(vals.rhr), rr: ok(vals.rr) };
  if (clean.hrv === undefined && clean.rhr === undefined && clean.rr === undefined) return false;
  const arr = loadBaselineSamples();
  const now = Date.now();
  const last = arr[arr.length - 1];
  if (last && now - last.time < SAMPLE_MIN_GAP) return false;
  arr.push({ time: now, ...clean });
  if (arr.length > 800) arr.splice(0, arr.length - 800);
  try { localStorage.setItem(SAMPLES_KEY, JSON.stringify(arr)); } catch { /* noop */ }
  return true;
}

export function loadDiaryEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as DiaryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveDiaryEntries(entries: DiaryEntry[]): void {
  // Entries that disappeared since the last save were deleted → tombstone them
  // so a later Supabase pull can't bring them back.
  try {
    const next = new Set(entries.map((e) => e.id));
    const removed = loadDiaryEntries().filter((e) => !next.has(e.id)).map((e) => e.id);
    if (removed.length) {
      const tomb = loadTombstones();
      removed.forEach((id) => tomb.add(id));
      saveTombstones(tomb);
    }
  } catch { /* noop */ }
  const raw = JSON.stringify(entries);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    /* quota / private mode — the note is still in state for this session */
  }
  // Durable native copy — only once hydrated (see hydrateDiary).
  if (diaryHydrated) { Preferences.set({ key: PREF_KEY, value: raw }).catch(() => undefined); }
}

export function newDiaryId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `d_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

