import { useEffect, useRef, useState } from 'react';
import { useAudioCache, useAudioPreloader } from '../hooks/useAudioCache';
import { Loader2 } from 'lucide-react';
import { getAudioContext } from '../services/audioContextSingleton';

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
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
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
    if (!audioContextRef.current) {
      // Shared singleton AudioContext — see audioContextSingleton.ts.
      // iOS WebKit leaks native buffer memory on every `new AudioContext()`;
      // reusing one instance avoids the OOM-kill after ~3 practice opens.
      audioContextRef.current = getAudioContext();
      if (audioContextRef.current) {
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = 0;
      }
    }

    if (!url || error) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = 1;
      // Set loop=false for multi-track playlists so 'ended' event fires
      audioRef.current.loop = tracks.length === 1;
      
      console.log('[RemoteAudioPlayer] 🎵 Created audio element', {
        tracksLength: tracks.length,
        loop: audioRef.current.loop,
        url: url.substring(0, 50)
      });

      // Note: We don't use onended because:
      // 1. It's unreliable on iOS with Web Audio API
      // 2. It causes double-triggering with our setInterval polling
      // setInterval polling (below) is the primary and only method for track switching

      if (audioContextRef.current && gainNodeRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(gainNodeRef.current);
      }
    } else if (audioRef.current.src !== url) {
      console.log('[RemoteAudioPlayer] 🔄 Updating audio src', {
        trackIndex: currentTrackIndex,
        newUrl: url.substring(0, 50)
      });
      // Reset flag for new track
      trackEndHandledRef.current = false;
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, [url, error, tracks.length, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    const gainNode = gainNodeRef.current;
    const audioContext = audioContextRef.current;

    if (!gainNode || !audioContext || !audio || !url) return;

    const fadeIn = async () => {
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
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
        const currentTime = audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, currentTime + fadeInDuration / 1000);
      } catch (err) {
        console.error('[RemoteAudioPlayer] ❌ Play error:', err);
      }
    };

    const fadeOut = () => {
      console.log('[RemoteAudioPlayer] ⏸️ FadeOut started');
      const currentTime = audioContext.currentTime;
      gainNode.gain.cancelScheduledValues(currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.001, currentTime + fadeOutDuration / 1000);

      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
      }

      fadeOutTimerRef.current = setTimeout(() => {
        audio.pause();
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
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
      }
      if (trackEndCheckIntervalRef.current) {
        clearInterval(trackEndCheckIntervalRef.current);
      }
      if (audioRef.current) {
        // iOS WKWebView keeps a native audio decoder + PCM buffer attached to
        // HTMLAudioElement until src is cleared and load() is called. Without
        // these two extra lines, each practice-intro mount leaks ~15-40MB
        // native memory and the WebView is OOM-killed after ~3 opens.
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute('src');
          audioRef.current.load();
        } catch (_) { /* ignore */ }
        audioRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      // NOTE: do NOT call audioContextRef.current.close() — the AudioContext
      // is a process-wide singleton (see audioContextSingleton.ts). Closing it
      // would defeat the purpose and still leak native memory on iOS.
      audioContextRef.current = null;
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
