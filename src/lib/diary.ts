/**
 * Diary storage — LOCAL-FIRST (retention step 3).
 *
 * The diary must work with no account: entries are written to localStorage the
 * instant they're saved. When (and only when) the user later signs in, the
 * un-synced local entries migrate into Supabase `diary_entries` (text + metadata;
 * voice audio stays base64-local until a Storage bucket exists — fast-follow).
 *
 * Privacy canon: nothing here leaves the device before an explicit sign-in, and
 * no third-party tracker ever sees entry CONTENT. Analytics carry counts/flags only.
 */
import { supabase } from './supabase';
import { trackEvent } from '../services/AnalyticsService';

export type DiarySource = 'text' | 'voice' | 'photo' | 'text_voice' | 'mixed';

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
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* quota / private mode — the note is still in state for this session */
  }
}

export function newDiaryId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `d_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

/**
 * Migrate un-synced local entries into Supabase. Idempotent: upserts on
 * (user_id, client_id) so re-running never duplicates. Audio is intentionally
 * NOT uploaded yet (base64 stays local until the Storage bucket lands with the
 * photo fast-follow). Returns how many rows were pushed.
 */
export async function syncDiaryEntries(userId: string): Promise<number> {
  const entries = loadDiaryEntries();
  const pending = entries.filter((e) => !e.synced);
  if (pending.length === 0) return 0;

  const rows = pending.map((e) => ({
    user_id: userId,
    client_id: e.id,
    text: e.text,
    source: e.source,
    event_time: e.event_time,
    rhr: e.rhr ?? null,
    created_at: e.created_at,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('diary_entries')
    .upsert(rows, { onConflict: 'user_id,client_id' });
  if (error) {
    console.warn('[diary] sync failed:', error.message);
    return 0;
  }

  const syncedIds = new Set(pending.map((e) => e.id));
  saveDiaryEntries(entries.map((e) => (syncedIds.has(e.id) ? { ...e, synced: true } : e)));
  try {
    trackEvent('diary_synced', { count: pending.length });
  } catch {
    /* analytics is best-effort */
  }
  return pending.length;
}

/** Remove a deleted entry from Supabase too (best-effort) while signed in. */
export async function deleteDiaryEntryRemote(userId: string, clientId: string): Promise<void> {
  try {
    await supabase.from('diary_entries').delete().eq('user_id', userId).eq('client_id', clientId);
  } catch (e) {
    console.warn('[diary] remote delete failed:', e);
  }
}
