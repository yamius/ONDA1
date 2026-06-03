import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  SHUFFLE_WORDS,
  SHUFFLE_FAQ,
  SHUFFLE_SOURCES,
  SHUFFLE_METHODOLOGY,
  pickShuffleWord,
} from '../data/cognitive-shuffle'
import { SourcesSection } from '../components/SourcesSection'

export function CognitiveShufflePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [running, setRunning] = useState(false)
  const [word, setWord] = useState(SHUFFLE_WORDS[0])
  const [intervalSec, setIntervalSec] = useState(8)
  const [speak, setSpeak] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wordRef = useRef(word)
  wordRef.current = word

  useEffect(() => {
    document.title = 'Cognitive Shuffle — Random Words to Fall Asleep | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  const sayWord = (w: string) => {
    if (!speak || !canSpeak) return
    try {
      const u = new SpeechSynthesisUtterance(w)
      u.rate = 0.85
      u.pitch = 0.9
      u.volume = 0.7
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    } catch {
      /* speech not available — silently ignore */
    }
  }

  const advance = () => {
    const next = pickShuffleWord(wordRef.current)
    setWord(next)
    sayWord(next)
  }

  const stop = () => {
    setRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (canSpeak) window.speechSynthesis.cancel()
  }

  const start = () => {
    setRunning(true)
    const first = pickShuffleWord(wordRef.current)
    setWord(first)
    sayWord(first)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, intervalSec * 1000)
  }

  // Restart the timer when the interval changes mid-session.
  useEffect(() => {
    if (!running) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, intervalSec * 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalSec, running])

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Cognitive Shuffle</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Cognitive Shuffle</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        A drug-free way to fall asleep faster: let a stream of random, unrelated words drift past and
        picture each for a moment. This "serial diverse imagining" crowds out the worry-loops that
        keep you awake — mimicking how the mind naturally drifts into sleep.
      </p>

      <img
        src="/images/tools/cognitive-shuffle.png"
        alt="Cognitive Shuffle — free sleep tool from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-6 md:p-8">
        <div
          className="mb-6 flex min-h-[140px] items-center justify-center rounded-xl border border-white/10 bg-black/30 px-4 py-10 text-center transition-colors"
          aria-live="polite"
        >
          <span className={`text-4xl font-semibold tracking-wide md:text-5xl ${running ? 'text-terminal-green' : 'text-white/40'}`}>
            {word}
          </span>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
          {!running ? (
            <button
              onClick={start}
              className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20"
            >
              ► Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="rounded-lg border border-white/20 bg-white/5 px-8 py-3 font-mono text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              ◼ Stop
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">
              Seconds per word: <span className="text-terminal-green">{intervalSec}s</span>
            </span>
            <input
              type="range" min={4} max={12} step={1} value={intervalSec}
              onChange={(e) => setIntervalSec(parseInt(e.target.value, 10))}
              className="w-full accent-terminal-green"
            />
          </label>
          <label className="flex items-center gap-3 sm:justify-end">
            <span className="font-mono text-xs uppercase tracking-widest text-white/50">Speak words aloud</span>
            <button
              onClick={() => setSpeak((v) => !v)}
              disabled={!canSpeak}
              className={`rounded-lg border px-4 py-2 font-mono text-xs transition-colors disabled:opacity-40 ${speak ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {speak ? 'On' : 'Off'}
            </button>
          </label>
        </div>
        {!canSpeak && (
          <p className="mt-2 text-center font-mono text-[11px] text-white/30">Voice playback isn’t supported in this browser — words show on screen.</p>
        )}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Lie down with the screen dimmed and the volume low. Picture each word for a second — no
        effort, no story — then let it go. If your mind drifts back to your day, just return to the
        next word. Educational sleep aid, not a treatment for clinical insomnia; see a clinician if
        sleep problems persist.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">See what actually helps you sleep</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life tracks how wind-down habits like this move your real sleep, HRV and recovery — so
          you can keep what works and drop what doesn’t.
        </p>
        <a
          href={appStoreUrl('tool_shuffle')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={SHUFFLE_METHODOLOGY} sources={SHUFFLE_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {SHUFFLE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/sleep-cycle`} className="text-terminal-green hover:underline">Sleep cycle calculator</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/caffeine`} className="text-terminal-green hover:underline">Caffeine cut-off</Link>
      </div>
    </main>
  )
}
