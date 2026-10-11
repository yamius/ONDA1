/**
 * "How to read this device's data" → /connect/<device> (task 071 2c, step B).
 * Shown on device reviews. The link goes through langHref: /<lang>/connect/<device>
 * once that translation is live, otherwise the EN page with an "in English" note.
 */
import { Link } from 'react-router-dom'
import { langHref, type Lang } from '../i18n'
import { getConnectDevice } from '../data/connect-devices'

/** Review slug → /connect device slug (only reviews of devices with a /connect page). */
export const REVIEW_CONNECT_DEVICE: Record<string, string> = {
  'oura-ring-4': 'oura',
  'oura-ring-5': 'oura',
  'whoop-5-0': 'whoop',
  'garmin-fenix-8': 'garmin',
  'garmin-venu-4': 'garmin',
  'fitbit-air': 'fitbit',
  'fitbit-charge-6': 'fitbit',
  'samsung-galaxy-ring': 'samsung',
  'withings-scanwatch': 'withings',
  'ultrahuman-ring-air': 'ultrahuman',
  'ultrahuman-ring-pro': 'ultrahuman',
  'ringconn-gen-2': 'ringconn',
  'ringconn-gen-3': 'ringconn',
  'amazfit-helio-ring': 'amazfit',
  'apple-watch-series-11': 'apple-watch',
  'apple-watch-series-12': 'apple-watch',
  'apple-watch-ultra-4': 'apple-watch',
}

const T: Record<string, { title: string; text: string; link: string; en: string }> = {
  en: { title: 'How to read this device’s data', text: 'Which HRV the maker reports, what goes into its score, and what independent studies say about accuracy.', link: 'How to read your {name} data', en: '' },
  ru: { title: 'Как читать данные этого устройства', text: 'Какой HRV показывает производитель, из чего складывается его оценка и что говорят независимые исследования о точности.', link: 'Как читать данные {name}', en: '(на английском)' },
  uk: { title: 'Як читати дані цього пристрою', text: 'Який HRV показує виробник, із чого складається його оцінка і що кажуть незалежні дослідження про точність.', link: 'Як читати дані {name}', en: '(англійською)' },
  es: { title: 'Cómo leer los datos de este dispositivo', text: 'Qué HRV muestra el fabricante, qué entra en su puntuación y qué dicen los estudios independientes sobre su precisión.', link: 'Cómo leer tus datos de {name}', en: '(en inglés)' },
  pt: { title: 'Como ler os dados deste dispositivo', text: 'Qual HRV o fabricante mostra, o que entra na pontuação e o que estudos independentes dizem sobre a precisão.', link: 'Como ler seus dados do {name}', en: '(em inglês)' },
  fr: { title: 'Comment lire les données de cet appareil', text: 'Quelle HRV le fabricant affiche, ce qui entre dans son score et ce que disent les études indépendantes sur sa précision.', link: 'Comment lire vos données {name}', en: '(en anglais)' },
  de: { title: 'So liest du die Daten dieses Geräts', text: 'Welche HRV der Hersteller anzeigt, was in seinen Score einfließt und was unabhängige Studien zur Genauigkeit sagen.', link: 'So liest du deine {name}-Daten', en: '(auf Englisch)' },
  it: { title: 'Come leggere i dati di questo dispositivo', text: 'Quale HRV mostra il produttore, cosa entra nel suo punteggio e cosa dicono gli studi indipendenti sulla precisione.', link: 'Come leggere i tuoi dati {name}', en: '(in inglese)' },
  nl: { title: 'Zo lees je de gegevens van dit apparaat', text: 'Welke HRV de fabrikant toont, wat er in de score zit en wat onafhankelijke studies over de nauwkeurigheid zeggen.', link: 'Zo lees je je {name}-gegevens', en: '(in het Engels)' },
  pl: { title: 'Jak czytać dane z tego urządzenia', text: 'Jaką HRV pokazuje producent, co składa się na jego wynik i co niezależne badania mówią o dokładności.', link: 'Jak czytać dane z {name}', en: '(po angielsku)' },
  ja: { title: 'このデバイスのデータの読み方', text: 'メーカーが示すHRVの種類、スコアの構成要素、そして精度についての独立した研究の結果。', link: '{name}のデータの読み方', en: '（英語）' },
  zh: { title: '如何解读这款设备的数据', text: '厂商显示的是哪种 HRV、其评分由哪些输入构成，以及独立研究对准确性的结论。', link: '如何解读你的 {name} 数据', en: '（英文）' },
}

export function ConnectDeviceLink({ reviewSlug, lang }: { reviewSlug: string; lang: Lang }) {
  const slug = REVIEW_CONNECT_DEVICE[reviewSlug]
  const d = slug ? getConnectDevice(slug) : undefined
  if (!d) return null
  const t = T[lang] ?? T.en
  const href = langHref(`/connect/${d.slug}`, lang)
  const english = lang !== 'en' && !href.startsWith(`/${lang}/`)
  return (
    <section className="mb-10 rounded-xl border border-white/10 bg-white/[0.02] p-5" aria-label={t.title}>
      <h2 className="mb-2 text-lg font-bold">{t.title}</h2>
      <p className="mb-3 font-mono text-sm leading-relaxed text-white/70">{t.text}</p>
      <Link to={href} className="font-mono text-sm text-terminal-green hover:underline">
        {t.link.replace('{name}', d.name)} →
      </Link>
      {english && <span className="ml-2 font-mono text-xs text-white/45">{t.en}</span>}
    </section>
  )
}
