import { useEffect, useRef } from 'react';

interface PracticeAudioPlayerProps {
  isPlaying: boolean;
  audioSrc: string;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;
  resetKey?: string | number;
  onTrackChange?: (currentTrack: number, totalTracks: number) => void;
}

/**
 * Pure HTMLAudioElement player with volume-based fades.
 * No Web Audio / createMediaElementSource: see RemoteAudioPlayer.tsx for why
 * that path is unsafe on iOS WKWebView (native source nodes pin decoders for
 * the life of the AudioContext and OOM-kill the WebView).
 */
export const PracticeAudioPlayer: React.FC<PracticeAudioPlayerProps> = ({
  isPlaying,
  audioSrc,
  fadeInDuration = 3000,
  fadeOutDuration = 3000,
  volume = 0.7,
  resetKey,
  onTrackChange
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioSrcRef = useRef<string>('');
  const isFirstPlayRef = useRef<boolean>(true);
  const availableTracksRef = useRef<string[]>([]);
  const currentTrackIndexRef = useRef<number>(0);
  // Latest props, read from the foreground-resume listener below without
  // re-subscribing it on every render.
  const isPlayingRef = useRef<boolean>(isPlaying);
  const volumeRef = useRef<number>(volume);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  const startFade = (target: number, durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    const stepMs = 50;
    const steps = Math.max(1, Math.round(durationMs / stepMs));
    const startVol = audio.volume;
    const delta = (target - startVol) / steps;
    let i = 0;
    fadeIntervalRef.current = setInterval(() => {
      i += 1;
      const next = i >= steps ? target : startVol + delta * i;
      try {
        audio.volume = Math.max(0, Math.min(1, next));
      } catch (_) { /* ignore */ }
      if (i >= steps && fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }, stepMs);
  };

  useEffect(() => {
    const detectAvailableTracks = async (baseSrc: string): Promise<string[]> => {
      const tracks: string[] = [];
      const maxTracks = 10;
      const basePattern = baseSrc.replace(/-1\.mp3$/, '');

      for (let i = 1; i <= maxTracks; i++) {
        const trackUrl = `${basePattern}-${i}.mp3`;
        try {
          const response = await fetch(trackUrl, { method: 'HEAD' });
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');
            if (contentType && (contentType.includes('audio') || contentType.includes('mpeg') || contentType.includes('octet-stream'))) {
              if (!contentLength || parseInt(contentLength) > 100) {
                tracks.push(trackUrl);
                continue;
              }
            }
          }
          break;
        } catch (error) {
          break;
        }
      }

      if (tracks.length === 0) {
        tracks.push(baseSrc);
      }
      return tracks;
    };

    const needsReset = currentAudioSrcRef.current !== audioSrc;

    if (needsReset) {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute('src');
          audioRef.current.load();
        } catch (_) { /* ignore */ }
        audioRef.current = null;
      }
      currentAudioSrcRef.current = audioSrc;
      isFirstPlayRef.current = true;
      currentTrackIndexRef.current = 0;

      detectAvailableTracks(audioSrc).then(tracks => {
        availableTracksRef.current = tracks;
        if (audioRef.current) {
          audioRef.current.loop = tracks.length === 1;
        }
        if (onTrackChange) {
          onTrackChange(1, tracks.length);
        }
      });
    }

    if (!audioRef.current) {
      const initialTrack = availableTracksRef.current.length > 0
        ? availableTracksRef.current[0]
        : audioSrc;

      audioRef.current = new Audio(initialTrack);
      audioRef.current.volume = 0; // fade-in ramps it
      audioRef.current.loop = availableTracksRef.current.length === 1;

      const handleEnded = async () => {
        if (availableTracksRef.current.length > 1) {
          currentTrackIndexRef.current =
            (currentTrackIndexRef.current + 1) % availableTracksRef.current.length;
          const nextTrack = availableTracksRef.current[currentTrackIndexRef.current];
          if (audioRef.current) {
            audioRef.current.src = nextTrack;
            audioRef.current.load();
            try {
              await audioRef.current.play();
              audioRef.current.volume = volume;
            } catch (err) {
              console.error('[PracticeAudioPlayer] ❌ Track change play error:', err);
            }
          }
          if (onTrackChange) {
            onTrackChange(currentTrackIndexRef.current + 1, availableTracksRef.current.length);
          }
        }
      };

      audioRef.current.addEventListener('ended', handleEnded);
    }

    const audio = audioRef.current;
    if (!audio) return;

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
        startFade(volume, fadeInDuration);
      } catch (err) {
        console.error('Audio play error:', err);
      }
    };

    const fadeOut = () => {
      startFade(0, fadeOutDuration);
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
      }
      fadeOutTimerRef.current = setTimeout(() => {
        try { audio.pause(); } catch (_) { /* ignore */ }
        fadeOutTimerRef.current = null;
      }, fadeOutDuration);
    };

    if (isPlaying) {
      fadeIn();
    } else if (!isPlaying && !audio.paused) {
      fadeOut();
    }
  }, [isPlaying, audioSrc, fadeInDuration, fadeOutDuration, volume, resetKey]);

  useEffect(() => {
    isFirstPlayRef.current = true;
  }, [resetKey]);

  // Foreground resume.
  //
  // WKWebView suspends (pauses) HTML5 <audio> the moment the app is
  // backgrounded, and iOS does NOT auto-resume it when the app returns. The
  // practice itself keeps running in the background (its JS timer survives and
  // practiceState stays 'active'), so `isPlaying` never transitions — which
  // means the play/fade effect above won't re-issue play() on its own. Without
  // this, the user comes back to a running practice with the music dead.
  //
  // So on every return-to-foreground we re-start playback ourselves, but only
  // if a practice is still in progress (isPlaying) and the element was paused
  // by the system (not by us, e.g. a deliberate pause sets isPlaying=false).
  // Note: this is the deliberate trade-off after we dropped true background
  // audio — WKWebView can't play <audio> while hidden, so the soundtrack is
  // silent in the background and resumes the instant you reopen the app.
  useEffect(() => {
    const resumeIfNeeded = () => {
      if (document.visibilityState !== 'visible') return;
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlayingRef.current && audio.paused) {
        audio.play()
          .then(() => { try { audio.volume = volumeRef.current; } catch (_) { /* ignore */ } })
          .catch(() => { /* ignore — element may not be ready; user can retry */ });
      }
    };
    document.addEventListener('visibilitychange', resumeIfNeeded);
    return () => document.removeEventListener('visibilitychange', resumeIfNeeded);
  }, []);

  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute('src');
          audioRef.current.load();
        } catch (_) { /* ignore */ }
        audioRef.current = null;
      }
    };
  }, []);

  return null;
};
