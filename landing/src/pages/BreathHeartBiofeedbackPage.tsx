import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { BH_RATES, BH_FAQ, BH_SOURCES, BH_METHODOLOGY } from '../data/breath-heart'
import { SourcesSection } from '../components/SourcesSection'

type Phase = 'idle' | 'running' | 'error'
const WINDOW_MS = 40000

export function BreathHeartBiofeedbackPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [phase, setPhase] = useState<Phase>('idle')
  const [rate, setRate] = useState<number>(5.5)
  const [liveHr, setLiveHr] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const sampleCanvas = useRef<HTMLCanvasElement>(null)
  const chartCanvas = useRef<HTMLCanvasElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  const ppgRef = useRef<{ t: number; v: number }[]>([])
  const detrRef = useRef<{ t: number; d: number }[]>([])
  const hrRef = useRef<{ t: number; hr: number }[]>([])
  const prevDetr = useRef<number | null>(null)
  const wasRising = useRef(false)
  const lastBeat = useRef(0)
  const startRef = useRef(0)
  const lastHrUi = useRef(0)
  const rateRef = useRef(rate)
  rateRef.current = rate

  useEffect(() => {
    document.title = 'Breath–Heart Biofeedback — Camera + Pacer | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const stopAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null }
  }
  useEffect(() => () => stopAll(), [])

  const drawChart = (now: number) => {
    const cv = chartCanvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const W = cv.width, H = cv.height
    ctx.clearRect(0, 0, W, H)
    const cycleMs = 60000 / rateRef.current
    // breath wave (cyan filled area): inhale = rising
    ctx.beginPath()
    for (let x = 0; x <= W; x += 2) {
      const t = now - WINDOW_MS * (1 - x / W)
      const ph = ((t - startRef.current) % cycleMs + cycleMs) % cycleMs / cycleMs
      const val = -Math.cos(ph * 2 * Math.PI) // -1 at inhale start → +1 mid
      const y = H * 0.5 - val * (H * 0.34)
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
    ctx.fillStyle = 'rgba(0,212,255,0.08)'
    ctx.fill()
    ctx.beginPath()
    for (let x = 0; x <= W; x += 2) {
      const t = now - WINDOW_MS * (1 - x / W)
      const ph = ((t - startRef.current) % cycleMs + cycleMs) % cycleMs / cycleMs
      const val = -Math.cos(ph * 2 * Math.PI)
      const y = H * 0.5 - val * (H * 0.34)
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = 'rgba(0,212,255,0.35)'; ctx.lineWidth = 1.5; ctx.stroke()
    // HR line (green)
    const pts = hrRef.current.filter((p) => p.t > now - WINDOW_MS)
    if (pts.length > 2) {
      let min = Infinity, max = -Infinity
      for (const p of pts) { if (p.hr < min) min = p.hr; if (p.hr > max) max = p.hr }
      if (max - min < 6) { const m = (max + min) / 2; min = m - 3; max = m + 3 }
      const range = max - min
      ctx.beginPath(); ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5
      pts.forEach((p, i) => {
        const x = W * (1 - (now - p.t) / WINDOW_MS)
        const y = H - ((p.hr - min) / range) * (H - 16) - 8
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
    }
  }

  const loop = () => {
    const video = videoRef.current
    const cv = sampleCanvas.current
    const now = performance.now()
    if (video && cv && video.readyState >= 2) {
      const ctx = cv.getContext('2d', { willReadFrequently: true } as CanvasRenderingContext2DSettings)
      if (ctx) {
        const size = 60
        try {
          ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, size, size)
          const data = ctx.getImageData(0, 0, size, size).data
          let r = 0
          for (let i = 0; i < data.length; i += 4) r += data[i]
          const v = r / (data.length / 4)
          const buf = ppgRef.current
          buf.push({ t: now, v })
          while (buf.length && buf[0].t < now - 5000) buf.shift()
          // baseline over ~1s
          let s = 0, c = 0
          for (let i = buf.length - 1; i >= 0 && buf[i].t > now - 1000; i--) { s += buf[i].v; c++ }
          const detr = v - (c ? s / c : v)
          const dr = detrRef.current
          dr.push({ t: now, d: detr })
          while (dr.length && dr[0].t < now - 2500) dr.shift()
          let dmin = Infinity, dmax = -Infinity
          for (const x of dr) { if (x.d < dmin) dmin = x.d; if (x.d > dmax) dmax = x.d }
          const amp = dmax - dmin
          // beat = local max above threshold, past refractory
          if (prevDetr.current !== null) {
            const rising = detr > prevDetr.current
            if (wasRising.current && !rising && prevDetr.current > 0.3 * amp && amp > 1.2 && now - lastBeat.current > 330) {
              const ibi = now - lastBeat.current
              lastBeat.current = now
              if (ibi > 300 && ibi < 1500) {
                const hr = 60000 / ibi
                const h = hrRef.current
                h.push({ t: now, hr })
                while (h.length && h[0].t < now - WINDOW_MS) h.shift()
                if (now - lastHrUi.current > 1000) {
                  lastHrUi.current = now
                  const recent = h.slice(-5).map((p) => p.hr).sort((a, b) => a - b)
                  if (recent.length) setLiveHr(Math.round(recent[Math.floor(recent.length / 2)]))
                }
              }
            }
            wasRising.current = rising
          }
          prevDetr.current = detr
        } catch { /* frame not ready */ }
      }
    }
    // breathing pacer (independent of camera)
    const cycleMs = 60000 / rateRef.current
    const ph = ((now - startRef.current) % cycleMs + cycleMs) % cycleMs / cycleMs
    const inhale = ph < 0.5
    const scale = inhale ? 0.45 + (ph / 0.5) * 0.55 : 1 - ((ph - 0.5) / 0.5) * 0.55
    if (circleRef.current) circleRef.current.style.transform = `scale(${scale.toFixed(3)})`
    if (labelRef.current) labelRef.current.textContent = inhale ? 'Breathe in' : 'Breathe out'
    drawChart(now)
    rafRef.current = requestAnimationFrame(loop)
  }

  const start = async () => {
    setErrorMsg(''); setLiveHr(null)
    ppgRef.current = []; detrRef.current = []; hrRef.current = []
    prevDetr.current = null; wasRising.current = false; lastBeat.current = performance.now()
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Your browser doesn’t support camera access. Try a recent mobile browser.'); setPhase('error'); return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 320 }, height: { ideal: 240 } }, audio: false })
      streamRef.current = stream
      const track = stream.getVideoTracks()[0]
      try { await track.applyConstraints({ advanced: [{ torch: true } as MediaTrackConstraintSet] }) } catch { /* no torch */ }
      const video = videoRef.current
      if (video) { video.srcObject = stream; video.setAttribute('playsinline', 'true'); video.muted = true; await video.play().catch(() => {}) }
      startRef.current = performance.now()
      setPhase('running')
      rafRef.current = requestAnimationFrame(loop)
    } catch (err) {
      const name = (err as Error)?.name
      setErrorMsg(name === 'NotAllowedError' ? 'Camera permission was denied. Allow it and try again.' : 'Couldn’t start the camera.')
      setPhase('error')
    }
  }

  const stop = () => { stopAll(); setPhase('idle'); setLiveHr(null) }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Breath–Heart Biofeedback</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Breath–Heart Biofeedback</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Breathe with the circle while your phone camera reads your pulse — and watch your heart rate
        rise on each inhale and fall on each exhale. That’s your vagus nerve, live. This is ONDA in miniature.
      </p>

      <img
        src="/images/tools/breath-heart-biofeedback.png"
        alt="Breath–heart biofeedback — breathe with a pacer while the phone camera reads your pulse to show respiratory sinus arrhythmia (HR rising on inhale, falling on exhale), from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ Live biofeedback demo, <strong>not a medical device</strong>. Use a phone; the heart-rate
          trace is a rough camera estimate and will jitter. The breath–heart effect shows best with a
          still finger and slow breathing. All processing is on-device; nothing is recorded or uploaded.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 text-center md:p-8">
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={sampleCanvas} width={60} height={60} className="hidden" />

        {phase === 'idle' && (
          <div>
            <ol className="mx-auto mb-4 max-w-md space-y-1 text-left font-mono text-xs leading-relaxed text-white/60">
              <li><span className="text-terminal-green">1.</span> Use a phone. Tap start, allow the camera.</li>
              <li><span className="text-terminal-green">2.</span> Gently cover the <strong>rear camera + flash</strong> with a fingertip; hold still.</li>
              <li><span className="text-terminal-green">3.</span> Breathe with the circle and watch the green heart-rate line ride the breath wave.</li>
            </ol>
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="font-mono text-xs text-white/50">Pace:</span>
              {BH_RATES.map((r) => (
                <button key={r} onClick={() => setRate(r)} className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${rate === r ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>{r}/min</button>
              ))}
            </div>
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">♥ Start</button>
          </div>
        )}

        {phase === 'running' && (
          <div>
            <div className="relative mx-auto mb-4 flex h-44 w-44 items-center justify-center">
              <div ref={circleRef} className="absolute inset-0 m-auto h-44 w-44 rounded-full border border-terminal-cyan/30 bg-gradient-to-br from-terminal-cyan/10 to-terminal-green/10" style={{ transform: 'scale(0.45)', transition: 'transform 80ms linear' }} />
              <div className="relative z-10 text-center">
                <div ref={labelRef} className="font-mono text-sm font-semibold text-terminal-green">Breathe in</div>
                <div className="mt-1 text-3xl font-bold text-white/80">{liveHr ?? '—'} <span className="text-sm text-white/40">bpm</span></div>
              </div>
            </div>
            <canvas ref={chartCanvas} width={340} height={130} className="mx-auto mb-3 w-full max-w-md rounded-lg border border-white/10 bg-black/30" />
            <p className="mb-4 font-mono text-[11px] text-white/45">Green = your heart rate · cyan = your breath. Slow down to ~6/min and watch them sync.</p>
            <button onClick={stop} className="rounded-lg border border-white/20 bg-white/5 px-6 py-2 font-mono text-xs text-white/80 hover:bg-white/10">◼ Stop</button>
          </div>
        )}

        {phase === 'error' && (
          <div>
            <p className="mb-4 font-mono text-xs leading-relaxed text-rose-300/80">{errorMsg}</p>
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-xs text-terminal-green hover:bg-terminal-green/20">Try again</button>
          </div>
        )}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        The rise-and-fall of heart rate with breathing is respiratory sinus arrhythmia (RSA) — a normal,
        healthy sign of vagal activity, strongest at slow breathing. Educational biofeedback demo, not
        medical advice; the camera trace is a rough estimate and will be noisy. Processed on-device only.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">This is the 30-second version. ONDA is the real one.</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          A fingertip on a camera hints at the breath–heart connection. ONDA Life reads it continuously
          and accurately against your live HRV — so you can train calm and watch your nervous system respond.
        </p>
        <a href={appStoreUrl('tool_biofeedback')} rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10">
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={BH_METHODOLOGY} sources={BH_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {BH_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/camera-heart-rate`} className="text-terminal-green hover:underline">Camera heart rate</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
        {' · '}
        <Link to={`${langPrefix}/articles/coherent-breathing-guide`} className="text-terminal-green hover:underline">Coherent breathing</Link>
      </div>
    </main>
  )
}
