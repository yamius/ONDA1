import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../public/locales/en/home.json'
import es from '../public/locales/es/home.json'
import ru from '../public/locales/ru/home.json'
import uk from '../public/locales/uk/home.json'
import zh from '../public/locales/zh/home.json'
import enAbout from '../public/locales/en/about.json'
import esAbout from '../public/locales/es/about.json'
import ruAbout from '../public/locales/ru/about.json'
import ukAbout from '../public/locales/uk/about.json'
import zhAbout from '../public/locales/zh/about.json'
import enIs from '../public/locales/en/inner-spectrum.json'
import esIs from '../public/locales/es/inner-spectrum.json'
import ruIs from '../public/locales/ru/inner-spectrum.json'
import ukIs from '../public/locales/uk/inner-spectrum.json'
import zhIs from '../public/locales/zh/inner-spectrum.json'
import enBio from '../public/locales/en/bio.json'
import esBio from '../public/locales/es/bio.json'
import ruBio from '../public/locales/ru/bio.json'
import ukBio from '../public/locales/uk/bio.json'
import zhBio from '../public/locales/zh/bio.json'

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
      en: { home: en, about: enAbout, 'inner-spectrum': enIs, bio: enBio },
      es: { home: es, about: esAbout, 'inner-spectrum': esIs, bio: esBio },
      ru: { home: ru, about: ruAbout, 'inner-spectrum': ruIs, bio: ruBio },
      uk: { home: uk, about: ukAbout, 'inner-spectrum': ukIs, bio: ukBio },
      zh: { home: zh, about: zhAbout, 'inner-spectrum': zhIs, bio: zhBio },
    },
    ns: ['home', 'about', 'inner-spectrum', 'bio'],
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

/**
 * Pages that exist in every language. Keys are EN base paths, values are i18n
 * namespaces. Add a new entry here + matching JSON files + meta override in
 * prerender.ts to localize another page.
 */
export const LOCALIZED_PAGES: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/bio': 'bio',
  '/inner-spectrum': 'inner-spectrum',
}

const LOCALIZED_BASE_PATHS = Object.keys(LOCALIZED_PAGES)

/**
 * Strip a leading language segment (/ru, /es...) from a path. Returns the EN
 * base path. e.g. "/ru/about" → "/about", "/ru" → "/", "/articles" → "/articles".
 */
export function stripLangPrefix(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length > 0 && isLang(parts[0])) {
    const rest = '/' + parts.slice(1).join('/')
    return rest === '/' ? '/' : rest
  }
  return pathname
}

/**
 * Given the current pathname and a target language, return the localized URL
 * for the same page. Falls back to the language home if the current page is not
 * in the localized set (e.g. /articles, /glossary — Phase 2 stops at Bio/About/IS).
 */
export function localizedPathFor(pathname: string, lang: Lang): string {
  const basePath = stripLangPrefix(pathname)
  if (!LOCALIZED_BASE_PATHS.includes(basePath)) return homePathFor(lang)
  if (lang === 'en') return basePath
  return basePath === '/' ? `/${lang}` : `/${lang}${basePath}`
}

/** All prerender route variants for localized pages: 4 base paths × 5 langs = 20. */
export function localizedRouteVariants(): string[] {
  const out: string[] = []
  for (const base of LOCALIZED_BASE_PATHS) {
    for (const lang of SUPPORTED_LANGS) {
      out.push(localizedPathFor(base, lang))
    }
  }
  return out
}

export default i18n
