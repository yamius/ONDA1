import { useEffect, useRef, useState } from 'react';
import { useAudioCache, useAudioPreloader } from '../hooks/useAudioCache';
import { Loader2 } from 'lucide-react';

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
  fadeInDuration = 3000,
  fadeOutDuration = 3000,
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Pure HTMLAudioElement.volume-based fade: no Web Audio graph, because on
  // iOS WKWebView each `createMediaElementSource` pins the audio decoder in
  // the native graph for the lifetime of the AudioContext. With a singleton
  // context they accumulate and the WebView gets OOM-killed after ~3 opens.
  // rAF-driven fade. setInterval(50ms) produced audible stepping on iOS
  // HTMLAudioElement (internal volume quantization + coarse ticks). rAF runs
  // ~16ms, and combined with a quadratic curve it sounds close to what the
  // Web Audio GainNode used to do — without createMediaElementSource (which
  // pinned decoders and OOM-killed the WebView).
  const fadeRafRef = useRef<number | null>(null);
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
      audioRef.current = new Audio(url);
      // Start at 0.0001 (not 0) — on iOS a fresh HTMLAudio starting at 0
      // sometimes snaps audibly on first volume change. Near-silence avoids that.
      audioRef.current.volume = 0.0001;
      audioRef.current.loop = tracks.length === 1;

      console.log('[RemoteAudioPlayer] 🎵 Created audio element', {
        tracksLength: tracks.length,
        loop: audioRef.current.loop,
        url: url.substring(0, 50)
      });
      // Intentionally no createMediaElementSource / GainNode: pure HTMLAudio.
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

  // rAF fade with a quadratic curve — perceived loudness is ~logarithmic,
  // so t² for fade-in (starts whisper-quiet, grows smoothly) and 1-(1-t)²
  // for fade-out (holds, then tails off). Matches the old GainNode feel.
  const startFade = (target: number, durationMs: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
    const startVol = audio.volume;
    const isFadeIn = target > startVol;
    const startTs = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - startTs) / Math.max(1, durationMs)));
      // Ease-in for fade-in (imperceptible start), ease-out for fade-out.
      const eased = isFadeIn ? t * t : 1 - (1 - t) * (1 - t);
      const v = startVol + (target - startVol) * eased;
      try {
        audio.volume = Math.max(0, Math.min(1, v));
      } catch (_) { /* ignore */ }
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
        onComplete?.();
      }
    };
    fadeRafRef.current = requestAnimationFrame(tick);
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
      }, fadeOutDuration);
    };

    if (isPlaying && !loading) {
      fadeIn();
    } else if (!isPlaying && !audio.paused) {
      fadeOut();
    }
  }, [isPlaying, url, loading, fadeInDuration, fadeOutDuration, volume]);

  // Reliable polling for track end detection (iOS workaround)
  // Events like 'ended' and 'timeupdate' may not fire with Web Audio API on iOS
  useEffect(() => {
    if (!isPlaying || tracks.length <= 1) {
      // Clear interval if not playing or single track (loop handles it)
      if (trackEndCheckIntervalRef.current) {
        clearInterval(trackEndCheckIntervalRef.current);
        trackEndCheckIntervalRef.current = null;
      }
      return;
    }

    // Check every 500ms if track is near end
    trackEndCheckIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || audio.paused || audio.loop) return;
      
      // Check if we're very close to the end (within 0.5 seconds)
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
      if (fadeRafRef.current !== null) {
        cancelAnimationFrame(fadeRafRef.current);
        fadeRafRef.current = null;
      }
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }
      if (trackEndCheckIntervalRef.current) {
        clearInterval(trackEndCheckIntervalRef.current);
        trackEndCheckIntervalRef.current = null;
      }
      if (audioRef.current) {
        // iOS WKWebView keeps a native audio decoder + PCM buffer attached to
        // HTMLAudioElement until src is cleared and load() is called.
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
