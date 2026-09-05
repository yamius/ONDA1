import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  BASELINE_WINDOW_DAYS,
  formatValue,
  hasAnyReading,
  parseBaselineExtras,
  parseBaselineHash,
  spanPosition,
  type BaselineReading,
} from '../lib/baseline'
import { buildCardModel, type CardModel } from '../lib/baseline-card'
import { BaselineCard } from '../components/baseline/BaselineCard'
import { BASELINE_UI, SHORTCUT_NAME, SHORTCUT_READY, SHORTCUT_RUN_URL, SHORTCUT_URL } from '../lib/baseline-copy'

/**
 * /tools/baseline — the Baseline tool on onda-life.com (ported from the Vallydia bridge, KK 56/57 +
 * 12_ONDA_Watch, re-framed as an organic tool — task 76).
 *
 * THREE things are load-bearing and must not be softened:
 *  1. This route carries NO third-party script. It renders OUTSIDE the site Layout (so the Reddit
 *     route tracker never fires) and prerender.ts strips the pixel/GTM from its HTML. A person's own
 *     Health figures arrive in the URL FRAGMENT — which browsers never send to a server — and the
 *     only reason that stays private is that nothing on the page hands the URL to anyone.
 *  2. The fragment is stripped with replaceState on the very first read, so the numbers leave the
 *     address bar, the history entry and any screenshot the instant they are in memory.
 *  3. Nothing is measured — no event, ever, with or without a value. The Vallydia page reported to a
 *     demand endpoint; that is deliberately gone here.
 *
 * FIREWALL (app_baseline_spec 7): this screen shows, it never judges. No colour for good or bad, no
 * arrows, no thresholds, no comparison, none of the banned vocabulary. The green is one accent.
 *
 * The initial (SSR / pre-hydration) render is the COLD shell — H1 + intro + the explainer — on
 * purpose: that is the content search should see ("see what your Apple Watch recorded"), and a person
 * arriving from the shortcut is flipped to the result after hydration reads their fragment.
 */

const C = {
  bg: '#050a0f',
  ink: '#f0f5fc',
  sub: '#92a1ba',
  faint: '#707e96',
  line: 'rgba(255,255,255,0.09)',
  rail: '#1c2836',
  accent: '#4ade80',
  buttonInk: '#080c16',
}
const font = {
  sans: "'Roboto', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', var(--font-mono), ui-monospace, monospace",
}

type Phase = 'cold' | 'result'
const INSTALL_FLAG = 'onda_baseline_installed'
const AUTORUN_FLAG = 'onda_baseline_autorun'

/** ct=tools_baseline so a web tap on iOS shows up as its own row in App Store Connect. */
const APP_URL = appStoreUrl('tools_baseline')
/** The paired explainer article (task 76 §2). */
const ARTICLE_SLUG = 'what-your-apple-watch-records'

export function BaselinePage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const ui = BASELINE_UI

  const [phase, setPhase] = useState<Phase>('cold')
  const [readings, setReadings] = useState<BaselineReading[]>([])
  const [card, setCard] = useState<CardModel | null>(null)
  const [isApple, setIsApple] = useState(true)

  useEffect(() => {
    read()
    // A fragment-only navigation does not reload the document; without this a second run of the
    // shortcut would land on the screen left over from the first (Safari reuses the tab).
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)

    function read() {
      const hash = window.location.hash ?? ''
      const parsed = parseBaselineHash(hash)
      const any = hasAnyReading(parsed)

      // Strip the fragment BEFORE anything else looks at the URL. The values are already in memory;
      // from here the address bar, the history entry and a screenshot carry nothing.
      if (hash.length > 1) {
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        } catch {
          /* a blocked history API must not cost the person their page */
        }
      }

      setIsApple(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent || ''))
      setReadings(parsed)
      const extras = parseBaselineExtras(hash)
      const model = buildCardModel(parsed, extras)
      // An empty card in a chat is worse than no card at all — only build one when something arrived.
      setCard(any || Object.keys(extras).length > 0 ? model : null)
      setPhase(hash.length > 1 ? 'result' : 'cold')
      // NO analytics here, by design: this route is script-free.
    }
  }, [])

  // The two-step install, kept per tab. "installed" is set by the tap that leaves for iCloud and read
  // again on return — returning is the only moment the shortcut can actually run.
  const [installed, setInstalled] = useState(false)
  const [autorunning, setAutorunning] = useState(false)
  const [stalled, setStalled] = useState(false)
  useEffect(() => {
    try {
      setInstalled(sessionStorage.getItem(INSTALL_FLAG) === '1')
    } catch {
      /* private mode */
    }
  }, [])

  function markInstallTapped() {
    try {
      sessionStorage.setItem(INSTALL_FLAG, '1')
    } catch {
      /* private mode: one extra tap */
    }
  }

  // Start the shortcut by itself the moment the person returns from installing it. Best effort: a page
  // can only ASK iOS to open a scheme, so if a moment passes and we are still here the wording turns
  // into the manual button rather than leaving a spinner. Attempted once per tab.
  useEffect(() => {
    if (!isApple || !SHORTCUT_READY) return
    let fired = false
    let timer: ReturnType<typeof setTimeout> | undefined

    function attempt() {
      if (fired || document.visibilityState !== 'visible') return
      try {
        if (sessionStorage.getItem(INSTALL_FLAG) !== '1') return
        if (sessionStorage.getItem(AUTORUN_FLAG) === '1') return
        sessionStorage.setItem(AUTORUN_FLAG, '1')
      } catch {
        return /* private mode: the manual button is the whole path */
      }
      fired = true
      setInstalled(true)
      setAutorunning(true)
      timer = setTimeout(() => {
        window.location.href = SHORTCUT_RUN_URL
        timer = setTimeout(() => setStalled(true), 1200)
      }, 250)
    }

    document.addEventListener('visibilitychange', attempt)
    window.addEventListener('pageshow', attempt)
    attempt()
    return () => {
      document.removeEventListener('visibilitychange', attempt)
      window.removeEventListener('pageshow', attempt)
      if (timer) clearTimeout(timer)
    }
  }, [isApple])

  return (
    <main style={{ background: C.bg, minHeight: '100vh', color: C.ink, fontFamily: font.sans }}>
      {/* This page renders outside the site Layout (no analytics), so it carries its own minimal
          chrome — a wordmark home and a way back to /tools. */}
      <header style={{ borderBottom: `1px solid ${C.line}`, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 900, margin: '0 auto' }}>
        <Link to={`${langPrefix}/`} style={{ color: C.ink, fontWeight: 800, letterSpacing: '.14em', fontSize: 15, textDecoration: 'none' }}>ONDA</Link>
        <Link to={`${langPrefix}/tools`} style={{ color: C.sub, fontSize: 13.5, textDecoration: 'none' }}>← All tools</Link>
      </header>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '26px 20px 72px' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: C.faint, marginBottom: 18 }}>
          <Link to={`${langPrefix}/`} style={{ color: C.faint, textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 7px' }}>/</span>
          <Link to={`${langPrefix}/tools`} style={{ color: C.faint, textDecoration: 'none' }}>Tools</Link>
          <span style={{ margin: '0 7px' }}>/</span>
          <span style={{ color: C.sub }}>Baseline</span>
        </nav>

        <h1 style={{ fontSize: 'clamp(26px, 6.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-.01em', margin: '0 0 12px' }}>
          {ui.h1}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: C.sub, margin: '0 0 30px' }}>{ui.intro}</p>

        {phase === 'result' ? (
          <>
            {/* The card first — it is the thing that travels; the blocks below are the working-out. */}
            {card && !card.empty && <BaselineCard model={card} onShare={() => { /* script-free: nothing reported */ }} />}

            {readings.map((r) => (
              <SignalBlock key={r.key} r={r} />
            ))}

            <section style={{ borderTop: `1px solid ${C.line}`, paddingTop: 24, marginTop: 28 }}>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: '0 0 12px', color: C.ink }}>{ui.closingOne}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: '0 0 22px', color: C.sub }}>{ui.closingTwo}</p>
              <div style={{ textAlign: 'center' }}>
                <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={btn}>{ui.appButton}</a>
              </div>
            </section>
          </>
        ) : (
          <ColdSection
            isApple={isApple}
            installed={installed}
            autorunning={autorunning}
            stalled={stalled}
            onInstall={markInstallTapped}
          />
        )}

        {/* Paired explainer (task 76 §2): the article explains what the watch records; the tool does it. */}
        <p style={{ borderTop: `1px solid ${C.line}`, marginTop: 34, paddingTop: 20, fontSize: 14.5, lineHeight: 1.6, color: C.sub }}>
          New to this?{' '}
          <Link to={`${langPrefix}/articles/${ARTICLE_SLUG}`} style={{ color: C.accent, textDecoration: 'none' }}>
            What your Apple Watch records over two weeks — and why the range matters more than one number →
          </Link>
        </p>
      </div>
    </main>
  )
}

const btn: React.CSSProperties = {
  display: 'inline-block',
  padding: '13px 34px',
  background: C.accent,
  color: C.buttonInk,
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 700,
  textDecoration: 'none',
}

/** The cold screen: explain the tool, then the shortcut install/run in one button at a time. */
function ColdSection({
  isApple,
  installed,
  autorunning,
  stalled,
  onInstall,
}: {
  isApple: boolean
  installed: boolean
  autorunning: boolean
  stalled: boolean
  onInstall: () => void
}) {
  const ui = BASELINE_UI
  return (
    <section>
      <p style={{ fontSize: 15.5, lineHeight: 1.6, color: C.sub, margin: '0 0 22px' }}>
        {isApple ? ui.coldBody : ui.notApple}
      </p>

      {isApple && SHORTCUT_READY && (
        <div style={{ textAlign: 'center' }}>
          {installed ? (
            <>
              <p style={{ fontSize: 13.5, lineHeight: 1.5, color: C.sub, margin: '0 0 12px' }}>
                {autorunning && !stalled ? ui.coldAutorun : ui.coldRunLead}
              </p>
              <a href={SHORTCUT_RUN_URL} style={btn}>{ui.coldRunButton}</a>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: C.faint, margin: '10px 0 0', minHeight: 18 }}>
                {stalled ? ui.coldAutorunFallback : ''}
              </p>
              <div style={{ marginTop: 14 }}>
                <a href={SHORTCUT_URL} onClick={onInstall} style={{ fontSize: 12.5, color: C.faint, textDecoration: 'underline' }}>
                  {ui.coldRunAgain}
                </a>
              </div>
            </>
          ) : (
            <>
              <a href={SHORTCUT_URL} onClick={onInstall} style={{ display: 'block', maxWidth: 360, margin: '0 auto', padding: '18px 26px', background: C.accent, color: C.buttonInk, borderRadius: 18, fontSize: 21, fontWeight: 800, textAlign: 'center', textDecoration: 'none' }}>
                {ui.coldButton}
              </a>

              {/* A replica of the blue "My Baseline" tile inside Apple's Shortcuts app, so it is
                  recognised on sight — that in-app tap is the one move we cannot guide from here. */}
              <div style={{ margin: '22px auto 0', maxWidth: 320 }}>
                <div aria-hidden style={{ position: 'relative', width: 168, height: 104, margin: '0 auto', borderRadius: 18, background: 'linear-gradient(160deg,#4a93ff,#2f6fe0)', color: '#fff', boxShadow: '0 8px 20px rgba(47,111,224,.28)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', top: 13, left: 14 }}>
                    <path d="M12 3l9 5-9 5-9-5 9-5z" fill="#fff" />
                    <path d="M3 12l9 5 9-5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="none" opacity="0.85" />
                    <path d="M3 16l9 5 9-5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="none" opacity="0.6" />
                  </svg>
                  <span style={{ position: 'absolute', top: 12, right: 13, width: 24, height: 24, borderRadius: 999, background: 'rgba(255,255,255,0.24)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 900, lineHeight: 1 }}>···</span>
                  <span style={{ position: 'absolute', left: 15, bottom: 13, fontSize: 15.5, fontWeight: 600 }}>{SHORTCUT_NAME}</span>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, color: C.sub, margin: '13px 0 0', textAlign: 'center' }}>{ui.coldTileHint}</p>
              </div>

              <details style={{ margin: '18px auto 0', maxWidth: 320 }}>
                <summary style={{ fontFamily: font.mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: C.faint, cursor: 'pointer', textAlign: 'center', listStyle: 'none' }}>
                  {ui.coldStepsTitle}
                </summary>
                <ol style={{ margin: '12px 0 0', padding: '0 0 0 18px', fontSize: 13, lineHeight: 1.65, color: C.sub, textAlign: 'left' }}>
                  {ui.coldSteps.map((line) => (
                    <li key={line} style={{ margin: '0 0 4px' }}>{line}</li>
                  ))}
                </ol>
              </details>
            </>
          )}
        </div>
      )}

      {/* When the shortcut link is not published yet, the explainer above still stands on its own. */}
      {!SHORTCUT_READY && (
        <div style={{ textAlign: 'center' }}>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" style={btn}>See it live in the ONDA app →</a>
        </div>
      )}

      <p style={{ fontSize: 12.5, lineHeight: 1.5, color: C.faint, margin: '20px 0 0', textAlign: 'center' }}>{ui.privacyNote}</p>
    </section>
  )
}

/** One signal — same shape whether there is data or not (an absent block reads as a bug). */
function SignalBlock({ r }: { r: BaselineReading }) {
  const ui = BASELINE_UI
  const empty = r.avg == null
  return (
    <section style={{ borderTop: `1px solid ${C.line}`, padding: '18px 0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: C.sub }}>{r.label}</h2>
        <span style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '.08em', color: C.faint }}>
          {empty ? ui.noDataTag : ui.daysTemplate.replace('{n}', String(r.days)).replace('{total}', String(BASELINE_WINDOW_DAYS))}
        </span>
      </div>

      {empty ? (
        <p style={{ fontSize: 14.5, lineHeight: 1.55, color: C.faint, margin: '8px 0 0' }}>{ui.noDataBody}</p>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '6px 0 14px' }}>
            <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em' }}>{formatValue(r.avg, r.decimals)}</span>
            <span style={{ fontSize: 14, color: C.sub }}>{r.unit}</span>
          </div>

          {/* The person's OWN low-to-high span, average marked. No outside scale exists on this page. */}
          <div style={{ position: 'relative', height: 6, background: C.rail, borderRadius: 3 }}>
            <div style={{ position: 'absolute', top: -3, height: 12, width: 2, borderRadius: 1, background: C.accent, left: `calc(${(spanPosition(r) * 100).toFixed(1)}% - 1px)` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontFamily: font.mono, fontSize: 11, color: C.faint }}>
            <span>{formatValue(r.min, r.decimals)}</span>
            <span>{formatValue(r.max, r.decimals)}</span>
          </div>
        </>
      )}
    </section>
  )
}
