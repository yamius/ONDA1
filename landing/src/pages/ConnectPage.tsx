/**
 * /connect and /connect/:device — "how to read your device's data" (task 071 2a).
 * EN only. Title/meta/JSON-LD are emitted statically by meta-inject; the
 * effect below only keeps the tab title right on client-side navigation.
 */
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { langFromPath, langHref, type Lang } from '../i18n'
import { connectI18n } from '../data/connect-i18n'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import {
  CONNECT_DEVICES,
  CONNECT_INDEX_META,
  CONNECT_RED_FLAGS,
  CONNECT_STATUS_LABEL,
  getConnectDevice,
} from '../data/connect-devices'
import { NotFoundPage } from './NotFoundPage'
import { CONNECT_ACCESSED, CONNECT_DEVICE_DETAILS, connectText, connectTextReady, type ConnectDeviceDetail } from '../data/connect-device-details'
import type { FactLang } from '../data/science/facts'

export interface DetailLabels {
  calls: (name: string) => string
  inputs: (name: string, composite?: string) => string
  accuracy: string
  weights: string
  single: string
  affiliated: string
  accessed: string
  quoteNote: string
}

export const DETAIL_LABELS_EN: DetailLabels = {
  calls: (name) => `What ${name} calls HRV`,
  inputs: (name, composite) => (composite ? `What goes into ${composite}` : `Does ${name} have a combined score?`),
  accuracy: 'How accurate is it?',
  weights: 'Weights of the inputs: not disclosed by the maker.',
  single: 'single study',
  affiliated: 'Studies funded by or affiliated with the maker (listed separately)',
  accessed: 'accessed',
  quoteNote: 'Quotes are verbatim from the maker’s pages, in English.',
}

/** Maker definition, composite inputs and independent accuracy checks (071 2c). Items with unapproved facts are not rendered. */
export function DeviceDetails({ name, det, lang = 'en', L = DETAIL_LABELS_EN }: { name: string; det: ConnectDeviceDetail; lang?: FactLang; L?: DetailLabels }) {
  const ok = (t: string) => connectTextReady(t, lang)
  const tx = (t: string) => connectText(t, lang, `connect/${name}`)
  const quotes = (qs: ConnectDeviceDetail['hrvQuotes']) => {
    const live = qs.filter((q) => ok(q.quote))
    if (!live.length) return null
    return (
      <div className="space-y-3">
        {live.map((q) => (
          <blockquote key={q.quote} className="border-l-2 border-terminal-green/40 pl-4 text-white/80">
            <p>“{tx(q.quote)}”</p>
            <footer className="mt-1 text-xs text-white/50">
              — <a href={q.source.url} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">{q.source.label}</a>, {L.accessed} {CONNECT_ACCESSED}
            </footer>
          </blockquote>
        ))}
      </div>
    )
  }
  const items = (list: ConnectDeviceDetail['independent']) => list.filter((a) => ok(a.text))
  const ind = items(det.independent)
  const aff = items(det.affiliated)
  return (
    <>
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">{L.calls(name)}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          {ok(det.hrvSummary) && <p>{tx(det.hrvSummary)}</p>}
          {quotes(det.hrvQuotes)}
          <p className="text-xs text-white/45">{L.quoteNote}</p>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">{L.inputs(name, det.compositeName)}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          {ok(det.composite) && <p>{tx(det.composite)}</p>}
          {quotes(det.compositeQuotes)}
          {det.compositeName && <p className="text-white/90">{L.weights}</p>}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">{L.accuracy}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          {det.independentNone && ok(det.independentNone) && <p>{tx(det.independentNone)}</p>}
          {ind.length > 0 && (
            <ul className="list-disc space-y-2 pl-5">
              {ind.map((a) => (
                <li key={a.text}>
                  {tx(a.text)}{a.single && <span className="ml-1 text-xs text-amber-300/80">[{L.single}]</span>}{' '}
                  <a href={a.cite.url} target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-white/50 hover:underline">({a.cite.label})</a>
                </li>
              ))}
            </ul>
          )}
          {aff.length > 0 && (
            <>
              <h3 className="pt-2 text-base font-semibold text-white">{L.affiliated}</h3>
              <ul className="list-disc space-y-2 pl-5">
                {aff.map((a) => (
                  <li key={a.text}>
                    {tx(a.text)}{' '}
                    <a href={a.cite.url} target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-white/50 hover:underline">({a.cite.label})</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  )
}

const READ_MORE: { to: string; label: string }[] = [
  { to: '/science/questions/why-is-my-hrv-low', label: 'Why is my HRV low?' },
  { to: '/science/concepts/hrv-baseline', label: 'Your HRV baseline' },
  { to: '/science/concepts/interpreting-hrv', label: 'Interpreting HRV' },
  { to: '/science/mechanisms/hrv-day-to-day', label: 'Why HRV changes day to day' },
  { to: '/science/concepts/rmssd', label: 'RMSSD' },
  { to: '/science/concepts/sdnn', label: 'SDNN' },
  { to: '/science/measurements/heart-rate-variability', label: 'How accurate are wearables at measuring HRV?' },
  { to: '/articles/hrv-different-every-device', label: 'Why your HRV is different on every device' },
  { to: '/articles/what-to-do-after-low-hrv-reading', label: 'What to do after a low HRV reading' },
]

function Emergency() {
  return (
    <section className="mt-12 rounded-xl border border-red-400/30 bg-red-400/[0.05] p-5" aria-label="When to get help">
      <h2 className="mb-2 text-lg font-bold">When a number is not the point</h2>
      <p className="font-mono text-sm leading-relaxed text-white/80">
        No HRV reading can tell you whether symptoms are serious. Whatever your device shows, call emergency services or
        get emergency care for: {CONNECT_RED_FLAGS}. This page is not medical advice and does not diagnose anything.
      </p>
    </section>
  )
}

function ReadMore() {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold">Read more on ONDA Science</h2>
      <ul className="grid gap-2 font-mono text-sm sm:grid-cols-2">
        {READ_MORE.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-terminal-green hover:underline">{l.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Localized hub → ONDA Science (071 2c step B). Links via langHref: /<lang>/science/… when live, else EN. */
const READ_MORE_L: Record<string, [string, string, string, string, string]> = {
  // heading, why-is-my-hrv-low, heart-rate-variability (measurements), hrv-baseline, interpreting-hrv
  ru: ['Подробнее в ONDA Science', 'Почему у меня низкий HRV?', 'Насколько точно носимые устройства измеряют HRV', 'Ваша личная норма HRV', 'Как читать значение HRV'],
  uk: ['Докладніше в ONDA Science', 'Чому в мене низький HRV?', 'Наскільки точно носимі пристрої вимірюють HRV', 'Ваша особиста норма HRV', 'Як читати значення HRV'],
  es: ['Más en ONDA Science', '¿Por qué tengo el HRV bajo?', 'Qué tan precisos son los wearables al medir el HRV', 'Tu línea base de HRV', 'Cómo interpretar el HRV'],
  pt: ['Mais no ONDA Science', 'Por que meu HRV está baixo?', 'Quão precisos são os wearables ao medir o HRV', 'Sua linha de base de HRV', 'Como interpretar o HRV'],
  fr: ['En savoir plus sur ONDA Science', 'Pourquoi ma HRV est-elle basse ?', 'Quelle est la précision des objets connectés pour la HRV', 'Votre référence de HRV', 'Interpréter la HRV'],
  de: ['Mehr bei ONDA Science', 'Warum ist meine HRV niedrig?', 'Wie genau messen Wearables die HRV?', 'Deine HRV-Baseline', 'HRV richtig deuten'],
  it: ['Approfondisci su ONDA Science', 'Perché la mia HRV è bassa?', 'Quanto sono precisi i wearable nel misurare l’HRV', 'La tua baseline di HRV', 'Come interpretare l’HRV'],
  nl: ['Meer op ONDA Science', 'Waarom is mijn HRV laag?', 'Hoe nauwkeurig meten wearables HRV?', 'Je HRV-basislijn', 'HRV interpreteren'],
  pl: ['Więcej w ONDA Science', 'Dlaczego moje HRV jest niskie?', 'Jak dokładnie urządzenia ubieralne mierzą HRV', 'Twoja bazowa wartość HRV', 'Jak interpretować HRV'],
  ja: ['ONDA Scienceでさらに詳しく', 'HRVが低いのはなぜ？', 'ウェアラブルのHRV測定はどれくらい正確か', 'あなたのHRVベースライン', 'HRVの読み方'],
  zh: ['在 ONDA Science 了解更多', '为什么我的 HRV 偏低？', '可穿戴设备测量 HRV 有多准确', '你的 HRV 基线', '如何解读 HRV'],
}

function ReadMoreLocalized({ lang }: { lang: string }) {
  const t = READ_MORE_L[lang]
  if (!t) return null
  const links: [string, string][] = [
    ['/science/questions/why-is-my-hrv-low', t[1]],
    ['/science/measurements/heart-rate-variability', t[2]],
    ['/science/concepts/hrv-baseline', t[3]],
    ['/science/concepts/interpreting-hrv', t[4]],
  ]
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold">{t[0]}</h2>
      <ul className="grid gap-2 font-mono text-sm sm:grid-cols-2">
        {links.map(([to, label]) => (
          <li key={to}>
            <Link to={langHref(to, lang as Lang)} className="text-terminal-green hover:underline">{label}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}

function ConnectIndexLocalized({ lang }: { lang: string }) {
  const c = connectI18n(lang)
  useTitle(c.title)
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-8">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">{c.eyebrow}</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{c.h1}</h1>
        <p className="mb-4 font-mono text-sm leading-relaxed text-white/90 md:text-base">{c.intro}</p>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">{c.pick}</p>
      </header>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b border-white/15 text-left text-white/60">
              <th className="py-2 pr-4">{c.thDevice}</th>
              <th className="py-2 pr-4">{c.thHrv}</th>
              <th className="py-2">{c.thStatus}</th>
            </tr>
          </thead>
          <tbody>
            {CONNECT_DEVICES.map((d) => (
              <tr key={d.slug} className="border-b border-white/10 align-top">
                <td className="py-3 pr-4">
                  <Link to={`/connect/${d.slug}`} className="text-terminal-green hover:underline">{d.name}</Link>{' '}
                  <span className="text-xs text-white/45">{c.inEnglish}</span>
                </td>
                <td className="py-3 pr-4 text-white/70">{c.hrv[d.hrvType] ?? d.hrvType}</td>
                <td className="py-3 text-white/70">{c.status[d.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AppStoreCTA ct={storeCt('connect', 'index', lang)} variant="hrv" lang={lang} />
      <ReadMoreLocalized lang={lang} />
    </main>
  )
}

function ConnectIndex() {
  useTitle(CONNECT_INDEX_META.title)
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-8">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">YOUR DEVICE</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{CONNECT_INDEX_META.h1}</h1>
        <p className="mb-4 font-mono text-sm leading-relaxed text-white/90 md:text-base">{connectI18n('en').intro}</p>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">
          Every wearable names HRV differently and measures it at a different time. Pick your device to see which HRV it
          shows, where the maker explains it, and whether it can connect to ONDA. The best comparison is always with your
          own recent nights.
        </p>
      </header>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b border-white/15 text-left text-white/60">
              <th className="py-2 pr-4">Device</th>
              <th className="py-2 pr-4">HRV shown</th>
              <th className="py-2">Connection to ONDA</th>
            </tr>
          </thead>
          <tbody>
            {CONNECT_DEVICES.map((d) => (
              <tr key={d.slug} className="border-b border-white/10 align-top">
                <td className="py-3 pr-4">
                  <Link to={`/connect/${d.slug}`} className="text-terminal-green hover:underline">{d.name}</Link>
                </td>
                <td className="py-3 pr-4 text-white/70">{d.hrvType}</td>
                <td className="py-3 text-white/70">{CONNECT_STATUS_LABEL[d.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AppStoreCTA ct={storeCt('connect', 'index')} variant="hrv" lang="en" />
      <ReadMore />
      <Emergency />
    </main>
  )
}

export function ConnectPage() {
  const { device } = useParams()
  const lang = langFromPath(useLocation().pathname)
  if (lang !== 'en' && !device) return <ConnectIndexLocalized lang={lang} />
  return <ConnectEn device={device} />
}

function ConnectEn({ device }: { device?: string }) {
  const d = device ? getConnectDevice(device) : undefined
  useTitle(d ? d.metaTitle : CONNECT_INDEX_META.title)
  if (!device) return <ConnectIndex />
  if (!d) return <NotFoundPage />
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <nav className="pt-6 font-mono text-xs text-white/50" aria-label="Breadcrumb">
        <Link to="/connect" className="hover:underline">All devices</Link> / {d.name}
      </nav>
      <header className="border-b border-white/10 pt-4 pb-8">
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{d.h1}</h1>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">{d.lead}</p>
      </header>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">What {d.name} shows</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          {d.shows.map((p, i) => <p key={i}>{p}</p>)}
          <p><span className="text-white/90">HRV type:</span> {d.hrvType}.</p>
        </div>
        {d.sources.length > 0 && (
          <div className="mt-5 font-mono text-xs text-white/55">
            <div className="mb-1 uppercase tracking-widest">Sources</div>
            <ul className="space-y-1">
              {d.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {CONNECT_DEVICE_DETAILS[d.slug] && <DeviceDetails name={d.name} det={CONNECT_DEVICE_DETAILS[d.slug]} />}

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">How to read it</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          <p>
            Compare a night with your own usual range over the last weeks, not with another person or another device. A
            single low night is most often a reaction to something specific — a short night, alcohol, an infection,
            stress or hard training. Several days below your range together with a higher resting heart rate and feeling
            unwell are a reason to rest.
          </p>
          <p>
            Scores such as Readiness, Recovery, Nightly Recharge or HRV Status are each maker’s own algorithm. Two devices
            on the same night can show different HRV numbers because they measure at different times and with different
            formulas; neither is “wrong”.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">Can {d.name} connect to ONDA?</h2>
        <p className="mb-3 inline-block rounded border border-white/20 px-3 py-1 font-mono text-xs text-white/80">
          {CONNECT_STATUS_LABEL[d.status]}
        </p>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          <p>{d.connect}</p>
          <h3 className="pt-2 text-lg font-semibold text-white">Through Apple Health</h3>
          <p>{d.appleHealth}</p>
        </div>
      </section>

      <AppStoreCTA ct={storeCt('connect', d.slug)} variant="hrv" lang="en" />

      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold">Questions</h2>
        <div className="space-y-6">
          {d.faq.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-6">
              <h3 className="mb-2 font-semibold text-white">{f.q}</h3>
              <p className="font-mono text-sm leading-relaxed text-white/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <ReadMore />
      <Emergency />
      <p className="mt-8 font-mono text-xs text-white/40">
        {d.name} is a trademark of its owner. ONDA is not affiliated with or endorsed by {d.name}.{' '}
        <Link to="/connect" className="hover:underline">Other devices</Link>
      </p>
    </main>
  )
}
