/**
 * DiaryModal — the "record your day" note (retention step 3).
 *
 * Low-effort by design: a free-text field + an optional voice note + an optional
 * backdate ("это было вчера"). No categories, no ratings, no required fields —
 * one or two taps and it's saved. Local-first (see lib/diary.ts): every save
 * lands in localStorage immediately, no account required.
 *
 * Voice record/playback mirrors VoiceCheckModal (getUserMedia + MediaRecorder +
 * a hidden <audio>), with an explicit stop-on-close so the mic never leaks.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, Square, Play, Pause, Trash2, Pencil, Check, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../services/AnalyticsService';
import {
  loadDiaryEntries,
  saveDiaryEntries,
  newDiaryId,
  type DiaryEntry,
  type DiarySource,
} from '../lib/diary';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  light?: boolean;
  /** Resting-pulse for today, if known — snapshotted onto a "now" entry (§5). */
  dayRhr?: number | null;
}

type RecState = 'idle' | 'recording' | 'recorded';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Pick a MediaRecorder mime the platform actually supports (iOS WKWebView has no webm). */
const pickMime = (): string => {
  const cands = ['audio/webm', 'audio/mp4', 'audio/aac', 'audio/mpeg'];
  for (const m of cands) {
    try {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) return m;
    } catch {
      /* isTypeSupported can throw on old engines */
    }
  }
  return '';
};

export default function DiaryModal({ isOpen, onClose, light = false, dayRhr = null }: DiaryModalProps) {
  const { t, i18n } = useTranslation();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [text, setText] = useState('');
  const [eventDate, setEventDate] = useState<string>(todayStr());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [micError, setMicError] = useState(false);

  // Voice
  const [recState, setRecState] = useState<RecState>('idle');
  const [recTime, setRecTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetEditor = useCallback(() => {
    setText('');
    setEventDate(todayStr());
    setEditingId(null);
    setMicError(false);
    setRecState('idle');
    setRecTime(0);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (audioURL) { URL.revokeObjectURL(audioURL); }
    setAudioURL(null);
    blobRef.current = null;
    audioChunksRef.current = [];
  }, [audioURL]);

  const stopMic = useCallback(() => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch { /* noop */ }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // Load entries when the modal opens.
  useEffect(() => {
    if (isOpen) setEntries(loadDiaryEntries());
  }, [isOpen]);

  // Cleanup on unmount.
  useEffect(() => () => {
    stopMic();
    if (audioURL) URL.revokeObjectURL(audioURL);
  }, [audioURL, stopMic]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setMicError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      const mime = pickMime();
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || mime || 'audio/webm' });
        blobRef.current = blob;
        if (audioURL) URL.revokeObjectURL(audioURL);
        setAudioURL(URL.createObjectURL(blob));
        setRecState('recorded');
        stream.getTracks().forEach((tr) => tr.stop());
      };
      mr.start(100);
      setRecState('recording');
      setRecTime(0);
      timerRef.current = window.setInterval(() => setRecTime((p) => p + 1), 1000);
    } catch {
      setMicError(true);
      setRecState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recState === 'recording') {
      try { mediaRecorderRef.current.stop(); } catch { /* noop */ }
    }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) { el.pause(); setIsPlaying(false); }
    else { el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
  };

  const discardVoice = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    blobRef.current = null;
    audioChunksRef.current = [];
    setRecState('idle');
    setRecTime(0);
    setIsPlaying(false);
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => (typeof r.result === 'string' ? resolve(r.result) : reject(new Error('read')));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });

  const canSave = text.trim().length > 0 || !!blobRef.current || (editingId != null);

  const persist = (next: DiaryEntry[]) => {
    setEntries(next);
    saveDiaryEntries(next);
  };

  const handleSave = async () => {
    if (!canSave) return;
    stopMic();

    const backdated = eventDate !== todayStr();
    // Backdated → noon of that day (no exact clock); today → now.
    const eventTime = backdated
      ? new Date(`${eventDate}T12:00:00`).toISOString()
      : new Date().toISOString();

    let audioBase64: string | undefined;
    if (blobRef.current) {
      try { audioBase64 = await blobToBase64(blobRef.current); } catch { /* keep text-only */ }
    }
    const hasVoice = !!audioBase64;
    const hasText = text.trim().length > 0;

    if (editingId) {
      // Edit keeps the original audio unless a new clip was recorded.
      persist(entries.map((e) => {
        if (e.id !== editingId) return e;
        const source: DiarySource = hasVoice || e.audioBase64
          ? (hasText ? 'text_voice' : 'voice')
          : 'text';
        return {
          ...e,
          text: text.trim(),
          event_time: eventTime,
          audioBase64: audioBase64 ?? e.audioBase64,
          source,
          synced: false, // re-sync the edit
        };
      }));
    } else {
      const source: DiarySource = hasVoice ? (hasText ? 'text_voice' : 'voice') : 'text';
      const entry: DiaryEntry = {
        id: newDiaryId(),
        created_at: new Date().toISOString(),
        event_time: eventTime,
        text: text.trim(),
        audioBase64,
        source,
        rhr: backdated ? null : (dayRhr ?? null), // only "today" carries a real day metric
      };
      persist([entry, ...entries]);
      try {
        trackEvent('diary_entry_created', {
          type: source === 'text_voice' ? 'text_voice' : source,
          backdated,
        });
      } catch { /* best-effort */ }
    }
    resetEditor();
  };

  const handleEdit = (e: DiaryEntry) => {
    setEditingId(e.id);
    setText(e.text);
    setEventDate(e.event_time.slice(0, 10));
    discardVoice();
  };

  const handleDelete = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
    if (editingId === id) resetEditor();
  };

  const handleClose = () => {
    stopMic();
    resetEditor();
    onClose();
  };

  const fmtDay = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(i18n.language || undefined, {
        day: 'numeric', month: 'short',
      });
    } catch { return iso.slice(0, 10); }
  };

  const sorted = [...entries].sort((a, b) => b.event_time.localeCompare(a.event_time));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto pt-[env(safe-area-inset-top)]">
      <div className={`max-w-lg w-full max-h-[90vh] rounded-2xl border shadow-2xl my-4 flex flex-col overflow-hidden ${light ? 'bg-white text-slate-800 border-violet-200' : 'bg-gradient-to-br from-gray-900 to-black text-white border-indigo-500/30'}`}>
        {/* Header */}
        <div className={`sticky top-0 backdrop-blur-sm border-b p-4 sm:p-5 flex items-center justify-between ${light ? 'bg-white/95 border-violet-200' : 'bg-gray-900/95 border-indigo-500/30'}`}>
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            {t('diary.title', 'Дневник')}
          </h2>
          <button onClick={handleClose} data-testid="diary-close" className={`transition-all ${light ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar flex-1">
          {/* Editor */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('diary.text_placeholder', 'Что было? Пара слов…')}
            data-testid="diary-text"
            rows={3}
            className={`w-full rounded-xl p-3 text-base resize-none outline-none transition-all ${light ? 'bg-violet-50/60 border border-violet-200 focus:border-indigo-400 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border border-white/15 focus:border-indigo-400 text-white placeholder:text-white/40'}`}
          />

          {/* Voice row */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {recState !== 'recording' && !audioURL && (
              <button onClick={startRecording} data-testid="diary-record" className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-indigo-700 hover:bg-violet-200' : 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'}`}>
                <Mic className="w-4 h-4" /> {t('diary.voice', 'Голос')}
              </button>
            )}
            {recState === 'recording' && (
              <button onClick={stopRecording} data-testid="diary-record-stop" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
                <Square className="w-4 h-4 fill-current" /> {t('diary.recording', 'Запись')} · {recTime}s
              </button>
            )}
            {audioURL && recState === 'recorded' && (
              <>
                <button onClick={togglePlay} data-testid="diary-play" className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${light ? 'bg-violet-100 text-indigo-700 hover:bg-violet-200' : 'bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'}`}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {t('diary.voice_note', 'Голосовая заметка')}
                </button>
                <button onClick={discardVoice} className={`p-2 rounded-xl transition-all ${light ? 'text-slate-400 hover:text-red-500' : 'text-white/40 hover:text-red-400'}`} aria-label={t('diary.delete', 'Удалить')}>
                  <Trash2 className="w-4 h-4" />
                </button>
                <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />
              </>
            )}
          </div>
          {micError && (
            <p className={`mt-2 text-xs ${light ? 'text-amber-600' : 'text-amber-300/80'}`}>{t('diary.mic_denied', 'Микрофон недоступен — можно записать текстом.')}</p>
          )}

          {/* When + actions */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <label className={`text-xs ${light ? 'text-slate-500' : 'text-white/50'}`}>{t('diary.when', 'Когда')}</label>
            <input
              type="date"
              value={eventDate}
              max={todayStr()}
              onChange={(e) => setEventDate(e.target.value)}
              data-testid="diary-date"
              className={`rounded-lg px-2 py-1 text-sm outline-none ${light ? 'bg-violet-50/60 border border-violet-200 text-slate-700' : 'bg-white/5 border border-white/15 text-white'}`}
            />
            <div className="ml-auto flex items-center gap-2">
              {editingId && (
                <button onClick={resetEditor} className={`px-3 py-2 rounded-xl text-sm transition-all ${light ? 'text-slate-500 hover:text-slate-700' : 'text-white/50 hover:text-white'}`}>
                  {t('diary.cancel', 'Отмена')}
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!canSave}
                data-testid="diary-save"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${canSave ? 'bg-indigo-500 text-white hover:bg-indigo-600' : (light ? 'bg-slate-100 text-slate-300' : 'bg-white/5 text-white/30')}`}
              >
                <Check className="w-4 h-4" /> {t('diary.save', 'Сохранить')}
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className={`mt-5 pt-4 border-t ${light ? 'border-violet-100' : 'border-white/10'}`}>
            {sorted.length === 0 ? (
              <div className={`text-center py-8 ${light ? 'text-slate-400' : 'text-white/40'}`}>
                <p className="text-base mb-1">{t('diary.empty', 'Пока пусто')}</p>
                <p className="text-sm">{t('diary.empty_hint', 'Бросьте пометку о дне — пара слов или голос')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sorted.map((e) => (
                  <div key={e.id} data-testid="diary-entry" className={`rounded-xl p-3 border transition-all ${light ? 'bg-white/70 border-violet-100' : 'bg-black/30 border-white/10'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        {e.text && <p className="text-sm whitespace-pre-wrap break-words">{e.text}</p>}
                        {e.audioBase64 && (
                          <audio controls src={e.audioBase64} className="mt-2 w-full h-8" />
                        )}
                        <div className={`mt-1 flex items-center gap-2 text-xs ${light ? 'text-slate-400' : 'text-white/45'}`}>
                          <span>{fmtDay(e.event_time)}</span>
                          {e.rhr != null && (
                            <span className={light ? 'text-indigo-500' : 'text-indigo-300'}>· {t('diary.day_pulse', { rhr: e.rhr, defaultValue: 'пульс покоя {{rhr}}' })}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleEdit(e)} className={`p-1.5 rounded-lg transition-all ${light ? 'text-slate-400 hover:text-indigo-600' : 'text-white/40 hover:text-indigo-300'}`} aria-label={t('diary.edit', 'Изменить')}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(e.id)} className={`p-1.5 rounded-lg transition-all ${light ? 'text-slate-400 hover:text-red-500' : 'text-white/40 hover:text-red-400'}`} aria-label={t('diary.delete', 'Удалить')}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
