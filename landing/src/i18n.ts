import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../public/locales/en/home.json'
import es from '../public/locales/es/home.json'
import ru from '../public/locales/ru/home.json'
import uk from '../public/locales/uk/home.json'
import zh from '../public/locales/zh/home.json'

export const SUPPORTED_LANGS = ['en', 'es', 'ru', 'uk', 'zh'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  es: 'ES',
  ru: 'RU',
  uk: 'UK',
  zh: 'ZH',
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    resources: {
      en: { home: en },
      es: { home: es },
      ru: { home: ru },
      uk: { home: uk },
      zh: { home: zh },
    },
    ns: ['home'],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initImmediate: false,
  })
}

export function isLang(s: string | undefined | null): s is Lang {
  return !!s && (SUPPORTED_LANGS as readonly string[]).includes(s)
}

/** Extract language from a path like /ru, /ru/about, / → 'en'. */
export function langFromPath(pathname: string): Lang {
  const seg = pathname.split('/').filter(Boolean)[0]
  return isLang(seg) ? seg : 'en'
}

/** Build the URL for the home page in a given language. EN is the bare root. */
export function homePathFor(lang: Lang): string {
  return lang === 'en' ? '/' : `/${lang}`
}

export default i18n
