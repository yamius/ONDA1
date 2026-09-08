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

export type DiarySource = 'text' | 'voice' | 'text_voice';

export interface DiaryEntry {
  id: string;              // client-generated, stable across the sync
  created_at: string;      // ISO — when the note was saved
  event_time: string;      // ISO — when it actually happened (may be backdated)
  text: string;
  audioBase64?: string;    // MVP: voice kept locally as base64 (not synced yet)
  source: DiarySource;
  rhr?: number | null;     // resting-pulse snapshot for that day, if known (§5)
  synced?: boolean;        // migrated to Supabase
}

const KEY = 'onda_diary_entries';

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
