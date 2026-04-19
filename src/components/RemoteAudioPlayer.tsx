import { useEffect, useRef, useState } from 'react';
import { useAudioCache, useAudioPreloader } from '../hooks/useAudioCache';
import { Loader2 } from 'lucide-react';

// Minimum gain for exponentialRampToValueAtTime (0 is forbidden — it
// requires a strictly positive endpoint). We snap to exact 0 at the end
// of a fade-out via setValueAtTime.
const GAIN_FLOOR = 0.0001;

interface RemoteAudioPlayerProps {
  isPlaying: boolean;
  audioPath: string | string[];
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;
  resetKey?: string | number;
  onTrackChange?: (currentTrack: number, totalTracks: number) => void;
  onLoadingChange?: (loading: boolean, progress: number) => void;
  showLoadingIndicator?: boolean;
}

export const RemoteAudioPlayer: React.FC<RemoteAudioPlayerProps> = ({
  isPlaying,
  audioPath,
  fadeInDuration = 4000,
  fadeOutDuration = 4000,
  volume = 0.7,
  resetKey,
  onTrackChange,
  onLoadingChange,
  showLoadingIndicator = false,
}) => {
  const tracks = Array.isArray(audioPath) ? audioPath : [audioPath];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrackPath = tracks[currentTrackIndex];

  // Stable key for audioPath to avoid reset on every render (arrays create new references)
  const audioPathKey = Array.isArray(audioPath) ? audioPath.join('|') : audioPath;

  const { url, loading, progress, error } = useAudioCache(currentTrackPath);
  const preloader = useAudioPreloader();

  // --- Web Audio graph, per RemoteAudioPlayer instance ---
  // Previously we used a singleton AudioContext, which made every
  // createMediaElementSource accumulate (iOS pins the HTMLAudio decoder
  // in the native audio graph for the life of the context). Root OOM
  // cause turned out to be WebGL/HDR textures, not Web Audio — and with
  // lazy-mount of RemoteAudioPlayer (only while practiceState==='active'),
  // we get exactly one AudioContext per practice session. On unmount we
  // explicitly ctx.close() which tears down the graph and releases
  // decoders. This gives us back sample-rate-smooth exponential fades
  // without reintroducing the old OOM footprint.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstPlayRef = useRef<boolean>(true);
  const trackEndHandledRef = useRef<boolean>(false);
  const trackEndCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stable handler ref that always has current values
  const handleEndedRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading, progress);
    }
  }, [loading, progress, onLoadingChange]);

  useEffect(() => {
    if (onTrackChange) {
      onTrackChange(currentTrackIndex + 1, tracks.length);
    }

    if (tracks.length > 1 && currentTrackIndex < tracks.length - 1) {
      const nextTracks = tracks.slice(currentTrackIndex + 1, currentTrackIndex + 3);
      if (nextTracks.length > 0) {
        preloader.preload(nextTracks);
      }
    }
  }, [currentTrackIndex, tracks.length, onTrackChange]);

  useEffect(() => {
    console.log('[RemoteAudioPlayer] 🔄 Reset triggered', {
      tracksCount: tracks.length,
      firstTrack: tracks[0]?.split('/').pop(),
      resetKey
    });
    isFirstPlayRef.current = true;
    trackEndHandledRef.current = false;
    setCurrentTrackIndex(0);
  }, [audioPathKey, resetKey]); // Use stable key instead of audioPath array

  // Update the ended handler ref on every render with current values
  useEffect(() => {
    handleEndedRef.current = () => {
      // Prevent double-handling (both timeupdate and ended might fire)
      if (trackEndHandledRef.current) {
        console.log('[RemoteAudioPlayer] ⚠️ Track end already handled, skipping');
        return;
      }
      trackEndHandledRef.current = true;

      const totalTracks = tracks.length;

      console.log('[RemoteAudioPlayer] 🎵 Track ended (via ref)', {
        currentIndex: currentTrackIndex,
        totalTracks,
        loop: audioRef.current?.loop,
        audioPath: currentTrackPath
      });

      if (totalTracks > 1) {
        const nextIndex = currentTrackIndex < totalTracks - 1 ? currentTrackIndex + 1 : 0;
        console.log('[RemoteAudioPlayer] 🔄 Moving to track', {
          from: currentTrackIndex,
          to: nextIndex
        });
        // Reset flag for next track
        setTimeout(() => {
          trackEndHandledRef.current = false;
        }, 100);
        setCurrentTrackIndex(nextIndex);
      }
    };
  }, [currentTrackIndex, tracks.length, currentTrackPath]);

  useEffect(() => {
    if (!url || error) return;

    if (!audioRef.current) {
      const audio = new Audio(url);
      // HTMLAudio.volume stays at 1. All gain control happens in the
      // GainNode (sample-rate smooth, no iOS quantization).
      audio.volume = 1;
      audio.loop = tracks.length === 1;
      // iOS: setting crossOrigin before createMediaElementSource avoids
      // a tainted-media security error on blob/URL-cached audio.
      try { audio.crossOrigin = 'anonymous'; } catch (_) { /* ignore */ }
      audioRef.current = audio;

      // Create the Web Audio graph once per instance.
      try {
        const Ctor: typeof AudioContext =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctor();
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.value = GAIN_FLOOR; // silent-ish; fade-in ramps up
        source.connect(gain);
        gain.connect(ctx.destination);
        audioContextRef.current = ctx;
        sourceNodeRef.current = source;
        gainNodeRef.current = gain;
        console.log('[RemoteAudioPlayer] 🎵 Web Audio graph created', {
          state: ctx.state,
          sampleRate: ctx.sampleRate,
        });
      } catch (err) {
        console.error('[RemoteAudioPlayer] ❌ Web Audio init failed:', err);
      }
    } else if (audioRef.current.src !== url) {
      console.log('[RemoteAudioPlayer] 🔄 Updating audio src', {
        trackIndex: currentTrackIndex,
        newUrl: url.substring(0, 50)
      });
      trackEndHandledRef.current = false;
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, [url, error, tracks.length, currentTrackIndex]);

  // Sample-rate smooth exponential ramp via GainNode.
  // exponentialRampToValueAtTime(v, t) matches perceived loudness (equal
  // time = equal dB). Endpoint must be strictly > 0, so we clamp to
  // GAIN_FLOOR during the ramp and schedule a hard setValueAtTime(0) at
  // the end for fade-out-to-silence.
  const startFade = (target: number, durationMs: number) => {
    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !gain) return;
    const now = ctx.currentTime;
    const durationSec = Math.max(0.001, durationMs / 1000);
    const rampTarget = Math.max(GAIN_FLOOR, target);
    try {
      // Anchor current value so the ramp starts from exactly where we are.
      gain.gain.cancelScheduledValues(now);
      const currentVal = Math.max(GAIN_FLOOR, gain.gain.value);
      gain.gain.setValueAtTime(currentVal, now);
      gain.gain.exponentialRampToValueAtTime(rampTarget, now + durationSec);
      if (target <= 0) {
        // Snap to exact 0 slightly after the ramp ends.
        gain.gain.setValueAtTime(0, now + durationSec + 0.01);
      }
    } catch (err) {
      console.error('[RemoteAudioPlayer] ❌ startFade error:', err);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    const fadeIn = async () => {
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }
      if (isFirstPlayRef.current) {
        audio.currentTime = 0;
        isFirstPlayRef.current = false;
      }
      try {
        // iOS: AudioContext starts suspended until a user gesture. play()
        // is triggered from a click handler, so resume() here is in-gesture.
        const ctx = audioContextRef.current;
        if (ctx && ctx.state === 'suspended') {
          try { await ctx.resume(); } catch (_) { /* ignore */ }
        }
        await audio.play();
        console.log('[RemoteAudioPlayer] ▶️ Play started', {
          trackIndex: currentTrackIndex,
          duration: audio.duration,
          loop: audio.loop
        });
        startFade(volume, fadeInDuration);
      } catch (err) {
        console.error('[RemoteAudioPlayer] ❌ Play error:', err);
      }
    };

    const fadeOut = () => {
      console.log('[RemoteAudioPlayer] ⏸️ FadeOut started');
      startFade(0, fadeOutDuration);
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
      }
      fadeOutTimerRef.current = setTimeout(() => {
        try { audio.pause(); } catch (_) { /* ignore */ }
        fadeOutTimerRef.current = null;
      }, fadeOutDuration + 50);
    };

    if (isPlaying && !loading) {
      fadeIn();
    } else if (!isPlaying && !audio.paused) {
      fadeOut();
    }
  }, [isPlaying, url, loading, fadeInDuration, fadeOutDuration, volume]);

  // Reliable polling for track end detection (iOS workaround)
  useEffect(() => {
    if (!isPlaying || tracks.length <= 1) {
      if (trackEndCheckIntervalRef.current) {
        clearInterval(trackEndCheckIntervalRef.current);
        trackEndCheckIntervalRef.current = null;
      }
      return;
    }

    trackEndCheckIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || audio.paused || audio.loop) return;

      if (audio.duration > 0 && audio.currentTime >= audio.duration - 0.5) {
        console.log('[RemoteAudioPlayer] ⏱️ Interval check: near end detected', {
          currentTime: audio.currentTime.toFixed(2),
          duration: audio.duration.toFixed(2),
          trackIndex: currentTrackIndex,
          totalTracks: tracks.length
        });
        handleEndedRef.current();
      }
    }, 500);

    return () => {
      if (trackEndCheckIntervalRef.current) {
        clearInterval(trackEndCheckIntervalRef.current);
        trackEndCheckIntervalRef.current = null;
      }
    };
  }, [isPlaying, tracks.length, currentTrackIndex]);

  useEffect(() => {
    console.log('[RemoteAudioPlayer] 🎵 Component mounted', {
      tracksCount: tracks.length,
      firstTrack: tracks[0]?.split('/').pop()
    });

    return () => {
      console.log('[RemoteAudioPlayer] 🛑 Component unmounting');
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }
      if (trackEndCheckIntervalRef.current) {
        clearInterval(trackEndCheckIntervalRef.current);
        trackEndCheckIntervalRef.current = null;
      }
      // Teardown order matters: disconnect the Web Audio graph BEFORE
      // detaching the HTMLAudio source, then ctx.close() releases all
      // native decoders that createMediaElementSource pinned.
      try { gainNodeRef.current?.disconnect(); } catch (_) { /* ignore */ }
      try { sourceNodeRef.current?.disconnect(); } catch (_) { /* ignore */ }
      gainNodeRef.current = null;
      sourceNodeRef.current = null;
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      if (ctx) {
        try { ctx.close().catch(() => {}); } catch (_) { /* ignore */ }
      }
      if (audioRef.current) {
        // iOS WKWebView keeps a native audio decoder + PCM buffer attached
        // to HTMLAudioElement until src is cleared and load() is called.
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute('src');
          audioRef.current.load();
        } catch (_) { /* ignore */ }
        audioRef.current = null;
      }
    };
  }, []);

  if (showLoadingIndicator && loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="audio-loading">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Загрузка аудио... {progress}%</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive" data-testid="audio-error">
        Ошибка загрузки: {error}
      </div>
    );
  }

  return null;
};
