/**
 * AppStoreCTA — the one in-content App Store call-to-action (task 15).
 *
 * - Links DIRECTLY to apps.apple.com with a per-page `ct` (build it with
 *   storeCt()), so the Layout's delegated `app_store_click` listener fires with
 *   the real page_path + campaign. No /#download hop, no popups.
 * - Desktop (md+): a QR code of the SAME link beside the badge — you can't
 *   install an iOS app from a computer. Generated client-side, lazily.
 * - Copy is honest by construction (see onda-facts-source-of-truth): pulse from
 *   camera OR Apple Watch; HRV/baseline need Apple Watch; never claims to read
 *   third-party trackers; "free to start" because there is a paywall.
 * - Visible content only — never put this in JSON-LD.
 */
import { useEffect, useState } from 'react'
import { appStoreUrl } from '../config/appStore'

export type CtaVariant = 'general' | 'hrv' | 'meditation' | 'glossary' | 'tool'
type L = 'en' | 'es' | 'ru' | 'uk' | 'zh' | 'de' | 'fr' | 'it' | 'nl' | 'ja' | 'pl' | 'pt'

const COPY: Record<CtaVariant, Record<L, string>> = {
  general: {
    en: 'See how your own body responds. ONDA shows your heart rhythm live as you breathe — with Apple Watch or just your iPhone camera. Free to start.',
    es: 'Mira cómo responde tu propio cuerpo. ONDA muestra tu ritmo cardíaco en vivo mientras respiras — con Apple Watch o solo con la cámara del iPhone. Gratis para empezar.',
    ru: 'Посмотрите, как отвечает ваше тело. ONDA показывает ритм сердца в реальном времени, пока вы дышите, — с Apple Watch или просто камерой iPhone. Начать можно бесплатно.',
    uk: 'Подивіться, як відповідає ваше тіло. ONDA показує ритм серця в реальному часі, поки ви дихаєте, — з Apple Watch або просто камерою iPhone. Почати можна безкоштовно.',
    zh: '看看你自己的身体如何回应。ONDA 在你呼吸时实时显示心律——使用 Apple Watch 或仅用 iPhone 摄像头。免费开始。',
    de: 'Sieh, wie dein eigener Körper reagiert. ONDA zeigt deinen Herzrhythmus live, während du atmest – mit der Apple Watch oder einfach mit der iPhone-Kamera. Kostenlos starten.',
    fr: 'Voyez comment votre propre corps réagit. ONDA affiche votre rythme cardiaque en direct pendant que vous respirez — avec l’Apple Watch ou simplement la caméra de l’iPhone. Gratuit pour commencer.',
    it: 'Guarda come risponde il tuo corpo. ONDA mostra il tuo ritmo cardiaco in tempo reale mentre respiri — con Apple Watch o semplicemente con la fotocamera dell’iPhone. Inizia gratis.',
    nl: 'Zie hoe je eigen lichaam reageert. ONDA toont je hartritme live terwijl je ademt — met Apple Watch of gewoon met de camera van je iPhone. Gratis te beginnen.',
    ja: 'あなた自身の体の反応を見てみましょう。ONDA は呼吸中の心拍リズムをリアルタイムで表示します。Apple Watch でも、iPhone のカメラだけでも。無料で始められます。',
    pl: 'Zobacz, jak reaguje twoje ciało. ONDA pokazuje rytm serca na żywo, gdy oddychasz — z Apple Watch albo po prostu kamerą iPhone’a. Zacznij za darmo.',
    pt: 'Veja como o seu próprio corpo responde. O ONDA mostra seu ritmo cardíaco ao vivo enquanto você respira — com Apple Watch ou só com a câmera do iPhone. Comece grátis.',
  },
  hrv: {
    en: 'Already tracking HRV? ONDA turns the numbers into training: guided breathing with your heart responding live. Works with Apple Watch — or measure your pulse with your iPhone camera, no wearable needed. Free to start.',
    es: '¿Ya mides tu VFC? ONDA convierte los números en entrenamiento: respiración guiada con tu corazón respondiendo en vivo. Funciona con Apple Watch — o mide tu pulso con la cámara del iPhone, sin wearable. Gratis para empezar.',
    ru: 'Уже следите за HRV? ONDA превращает цифры в тренировку: дыхательные практики, на которые сердце отвечает в реальном времени. Работает с Apple Watch — или измерьте пульс камерой iPhone, без гаджетов. Начать можно бесплатно.',
    uk: 'Вже стежите за HRV? ONDA перетворює цифри на тренування: дихальні практики, на які серце відповідає в реальному часі. Працює з Apple Watch — або виміряйте пульс камерою iPhone, без гаджетів. Почати можна безкоштовно.',
    zh: '已经在追踪 HRV？ONDA 把数字变成训练：引导式呼吸，心脏实时回应。支持 Apple Watch——或用 iPhone 摄像头测量脉搏，无需穿戴设备。免费开始。',
    de: 'Du trackst schon deine HRV? ONDA macht aus den Zahlen ein Training: geführte Atmung, auf die dein Herz live reagiert. Funktioniert mit der Apple Watch – oder miss deinen Puls mit der iPhone-Kamera, ganz ohne Wearable. Kostenlos starten.',
    fr: 'Vous suivez déjà votre VFC ? ONDA transforme les chiffres en entraînement : une respiration guidée à laquelle votre cœur répond en direct. Fonctionne avec l’Apple Watch — ou mesurez votre pouls avec la caméra de l’iPhone, sans objet connecté. Gratuit pour commencer.',
    it: 'Monitori già l’HRV? ONDA trasforma i numeri in allenamento: respirazione guidata con il cuore che risponde in tempo reale. Funziona con Apple Watch — oppure misura il polso con la fotocamera dell’iPhone, senza dispositivi indossabili. Inizia gratis.',
    nl: 'Houd je je HRV al bij? ONDA maakt van de cijfers training: begeleide ademhaling waarop je hart live reageert. Werkt met Apple Watch — of meet je hartslag met de iPhone-camera, zonder wearable. Gratis te beginnen.',
    ja: 'すでに HRV を記録していますか？ONDA は数値をトレーニングに変えます。心拍がリアルタイムで応えるガイド付き呼吸。Apple Watch に対応し、ウェアラブルなしでも iPhone のカメラで脈拍を測れます。無料で始められます。',
    pl: 'Już śledzisz HRV? ONDA zamienia liczby w trening: prowadzony oddech, na który serce odpowiada na żywo. Działa z Apple Watch — albo zmierz tętno kamerą iPhone’a, bez opaski. Zacznij za darmo.',
    pt: 'Já acompanha sua VFC? O ONDA transforma os números em treino: respiração guiada com o coração respondendo ao vivo. Funciona com Apple Watch — ou meça seu pulso com a câmera do iPhone, sem wearable. Comece grátis.',
  },
  meditation: {
    en: 'Want meditation you can measure? ONDA shows your body responding in real time, so you can see your progress instead of guessing. Free to start.',
    es: '¿Quieres una meditación que puedas medir? ONDA muestra la respuesta de tu cuerpo en tiempo real, para que veas tu progreso en lugar de adivinarlo. Gratis para empezar.',
    ru: 'Хотите медитацию, которую можно измерить? ONDA показывает ответ вашего тела в реальном времени — прогресс видно, а не угадывается. Начать можно бесплатно.',
    uk: 'Хочете медитацію, яку можна виміряти? ONDA показує відповідь вашого тіла в реальному часі — прогрес видно, а не вгадується. Почати можна безкоштовно.',
    zh: '想要可以衡量的冥想？ONDA 实时显示你身体的反应，让你看到进步而不是去猜。免费开始。',
    de: 'Meditation, die du messen kannst? ONDA zeigt in Echtzeit, wie dein Körper reagiert – so siehst du deinen Fortschritt, statt zu raten. Kostenlos starten.',
    fr: 'Envie d’une méditation que vous pouvez mesurer ? ONDA montre en temps réel comment votre corps réagit, pour voir vos progrès au lieu de les deviner. Gratuit pour commencer.',
    it: 'Vuoi una meditazione che puoi misurare? ONDA mostra in tempo reale come risponde il tuo corpo, così vedi i tuoi progressi invece di indovinarli. Inizia gratis.',
    nl: 'Meditatie die je kunt meten? ONDA toont in realtime hoe je lichaam reageert, zodat je je vooruitgang ziet in plaats van te gokken. Gratis te beginnen.',
    ja: '効果を測れる瞑想をお探しですか？ONDA は体の反応をリアルタイムで表示するので、進歩を推測ではなく目で確かめられます。無料で始められます。',
    pl: 'Chcesz medytacji, którą da się zmierzyć? ONDA pokazuje na żywo, jak reaguje twoje ciało, więc widzisz postępy zamiast zgadywać. Zacznij za darmo.',
    pt: 'Quer uma meditação que dá para medir? O ONDA mostra em tempo real como seu corpo responde, para você ver seu progresso em vez de adivinhar. Comece grátis.',
  },
  glossary: {
    en: 'See this in your own data → ONDA',
    es: 'Míralo en tus propios datos → ONDA',
    ru: 'Посмотрите это на своих данных → ONDA',
    uk: 'Подивіться це на своїх даних → ONDA',
    zh: '在你自己的数据中看到它 → ONDA',
    de: 'Sieh es in deinen eigenen Daten → ONDA',
    fr: 'Voyez-le dans vos propres données → ONDA',
    it: 'Guardalo nei tuoi dati → ONDA',
    nl: 'Zie het in je eigen data → ONDA',
    ja: '自分のデータで確かめる → ONDA',
    pl: 'Zobacz to w swoich danych → ONDA',
    pt: 'Veja isso nos seus próprios dados → ONDA',
  },
  tool: {
    en: 'Want to track this over weeks, not once? With Apple Watch, ONDA builds your personal baseline. Free to start.',
    es: '¿Quieres seguirlo durante semanas, no una sola vez? Con Apple Watch, ONDA construye tu línea base personal. Gratis para empezar.',
    ru: 'Хотите отслеживать это неделями, а не один раз? С Apple Watch ONDA строит вашу личную норму. Начать можно бесплатно.',
    uk: 'Хочете відстежувати це тижнями, а не один раз? З Apple Watch ONDA будує вашу особисту норму. Почати можна безкоштовно.',
    zh: '想要连续几周追踪，而不只是一次？配合 Apple Watch，ONDA 会建立你的个人基线。免费开始。',
    de: 'Willst du das über Wochen verfolgen statt nur einmal? Mit der Apple Watch baut ONDA deine persönliche Baseline auf. Kostenlos starten.',
    fr: 'Envie de suivre cela sur des semaines, pas une seule fois ? Avec l’Apple Watch, ONDA établit votre ligne de base personnelle. Gratuit pour commencer.',
    it: 'Vuoi seguirlo per settimane, non una volta sola? Con Apple Watch, ONDA costruisce la tua baseline personale. Inizia gratis.',
    nl: 'Wil je dit wekenlang volgen in plaats van één keer? Met Apple Watch bouwt ONDA je persoonlijke baseline op. Gratis te beginnen.',
    ja: '一度きりではなく、何週間も追跡したいですか？Apple Watch があれば、ONDA があなた個人のベースラインを作ります。無料で始められます。',
    pl: 'Chcesz śledzić to tygodniami, a nie raz? Z Apple Watch ONDA buduje twoją osobistą linię bazową. Zacznij za darmo.',
    pt: 'Quer acompanhar isso por semanas, não só uma vez? Com Apple Watch, o ONDA constrói sua linha de base pessoal. Comece grátis.',
  },
}

const BADGE_TOP: Record<L, string> = {
  en: 'Download on the', es: 'Descárgalo en el', ru: 'Загрузите в', uk: 'Завантажте в', zh: '下载于', de: 'Laden im', fr: 'Télécharger dans l’', it: 'Scarica su', nl: 'Download in de', ja: 'ダウンロード', pl: 'Pobierz z', pt: 'Baixar na',
}
const SCAN: Record<L, string> = {
  en: 'Scan with your iPhone', es: 'Escanéalo con tu iPhone', ru: 'Наведите камеру iPhone', uk: 'Наведіть камеру iPhone', zh: '用 iPhone 扫码', de: 'Mit dem iPhone scannen', fr: 'Scannez avec votre iPhone', it: 'Inquadra con il tuo iPhone', nl: 'Scan met je iPhone', ja: 'iPhone でスキャン', pl: 'Zeskanuj iPhone’em', pt: 'Escaneie com seu iPhone',
}

function asLang(lang?: string): L {
  return (['es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt'] as const).includes(lang as 'es') ? (lang as L) : 'en'
}

function AppleLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

/** Black "Download on the App Store" badge (Apple's style: black, white logo + two lines). */
export function AppStoreBadge({ href, lang }: { href: string; lang?: string }) {
  const l = asLang(lang)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      data-button="apple"
      data-platform="ios"
      aria-label={`${BADGE_TOP[l]} App Store`}
      className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-white/40 bg-black px-4 text-white transition-opacity hover:opacity-85"
    >
      <AppleLogo />
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium">{BADGE_TOP[l]}</span>
        <span className="text-lg font-semibold tracking-tight">App Store</span>
      </span>
    </a>
  )
}

function QrCode({ url, lang }: { url: string; lang?: string }) {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    // Desktop only: phones install by tapping the badge, not by scanning.
    if (typeof window === 'undefined' || !window.matchMedia('(min-width: 768px)').matches) return
    let alive = true
    import('qrcode')
      .then((QR) => QR.toDataURL(url, { margin: 1, width: 176, color: { dark: '#000000', light: '#ffffff' } }))
      .then((d) => { if (alive) setSrc(d) })
      .catch(() => { /* no QR — the badge still works */ })
    return () => { alive = false }
  }, [url])
  if (!src) return null
  return (
    <figure className="hidden shrink-0 flex-col items-center gap-1 md:flex">
      <img src={src} width={88} height={88} alt="" className="rounded-md bg-white p-1" />
      <figcaption className="text-[10px] text-white/50">{SCAN[asLang(lang)]}</figcaption>
    </figure>
  )
}

interface Props {
  /** Apple campaign tag — build with storeCt(). */
  ct: string
  variant?: CtaVariant
  lang?: string
  /** 'line' = one short sentence + badge (glossary, soft in-article line). */
  layout?: 'block' | 'line'
  className?: string
}

export default function AppStoreCTA({ ct, variant = 'general', lang, layout = 'block', className = '' }: Props) {
  const href = appStoreUrl(ct)
  const l = asLang(lang)
  const text = COPY[variant][l]
  if (layout === 'line') {
    return (
      <aside className={`not-prose my-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 ${className}`} data-cta="app-store">
        <p className="m-0 flex-1 text-sm text-white/70">{text}</p>
        <AppStoreBadge href={href} lang={l} />
      </aside>
    )
  }
  return (
    <aside className={`not-prose my-10 flex flex-col items-start gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5 sm:flex-row sm:items-center sm:gap-6 ${className}`} data-cta="app-store">
      <div className="flex-1">
        <p className="m-0 text-base text-white/85">{text}</p>
      </div>
      <div className="flex items-center gap-4">
        <AppStoreBadge href={href} lang={l} />
        <QrCode url={href} lang={l} />
      </div>
    </aside>
  )
}

/** Which copy fits a review category. HRV wearables → the HRV line; mind/breath/
 *  sleep apps and neuro gadgets → "meditation you can measure"; the rest (CGM,
 *  sauna, red light…) → the general line. Never implies ONDA reads those devices. */
export function ctaVariantForCategory(category: string): CtaVariant {
  if (category === 'hrv-wearable') return 'hrv'
  if (['meditation-app', 'breathwork-app', 'sleep-app', 'eeg-headset', 'vagus-stim'].includes(category)) return 'meditation'
  return 'general'
}

/** /compare/* (ONDA vs X, round-ups): meditation/breathing competitors get the
 *  meditation line, HRV apps/wearables the HRV line. */
export function ctaVariantForCompareSlug(slug: string): CtaVariant {
  return /calm|headspace|breathwrk|breathing-apps|meditation/.test(slug) ? 'meditation' : 'hrv'
}
