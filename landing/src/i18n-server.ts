/**
 * SSR / prerender i18n bootstrap.
 *
 * Used only by entry-server.tsx (run via tsx in scripts/prerender.ts at build
 * time — never bundled into the client). Statically pre-loads every language ×
 * every namespace and registers them with the shared i18next instance, so SSR
 * rendering can call t() synchronously for any language without awaiting a
 * dynamic import.
 *
 * The matching client path uses lazy `loadLocale()` from `./i18n` — see
 * `main.tsx` for the hydration-time await.
 */
import i18n, { I18N_NAMESPACES, SUPPORTED_LANGS } from './i18n'

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
import enBioMetric from '../public/locales/en/bio-metric.json'
import esBioMetric from '../public/locales/es/bio-metric.json'
import ruBioMetric from '../public/locales/ru/bio-metric.json'
import ukBioMetric from '../public/locales/uk/bio-metric.json'
import zhBioMetric from '../public/locales/zh/bio-metric.json'
import enLevel from '../public/locales/en/level.json'
import esLevel from '../public/locales/es/level.json'
import ruLevel from '../public/locales/ru/level.json'
import ukLevel from '../public/locales/uk/level.json'
import zhLevel from '../public/locales/zh/level.json'
import enPart from '../public/locales/en/part.json'
import esPart from '../public/locales/es/part.json'
import ruPart from '../public/locales/ru/part.json'
import ukPart from '../public/locales/uk/part.json'
import zhPart from '../public/locales/zh/part.json'
import enContact from '../public/locales/en/contact.json'
import esContact from '../public/locales/es/contact.json'
import ruContact from '../public/locales/ru/contact.json'
import ukContact from '../public/locales/uk/contact.json'
import zhContact from '../public/locales/zh/contact.json'
import enSitemap from '../public/locales/en/sitemap.json'
import esSitemap from '../public/locales/es/sitemap.json'
import ruSitemap from '../public/locales/ru/sitemap.json'
import ukSitemap from '../public/locales/uk/sitemap.json'
import zhSitemap from '../public/locales/zh/sitemap.json'
import enPrivacy from '../public/locales/en/privacy.json'
import esPrivacy from '../public/locales/es/privacy.json'
import ruPrivacy from '../public/locales/ru/privacy.json'
import ukPrivacy from '../public/locales/uk/privacy.json'
import zhPrivacy from '../public/locales/zh/privacy.json'
import enTerms from '../public/locales/en/terms.json'
import esTerms from '../public/locales/es/terms.json'
import ruTerms from '../public/locales/ru/terms.json'
import ukTerms from '../public/locales/uk/terms.json'
import zhTerms from '../public/locales/zh/terms.json'
import enGlossary from '../public/locales/en/glossary.json'
import esGlossary from '../public/locales/es/glossary.json'
import ruGlossary from '../public/locales/ru/glossary.json'
import ukGlossary from '../public/locales/uk/glossary.json'
import zhGlossary from '../public/locales/zh/glossary.json'
import enArticles from '../public/locales/en/articles.json'
import esArticles from '../public/locales/es/articles.json'
import ruArticles from '../public/locales/ru/articles.json'
import ukArticles from '../public/locales/uk/articles.json'
import zhArticles from '../public/locales/zh/articles.json'
import enTopics from '../public/locales/en/topics.json'
import esTopics from '../public/locales/es/topics.json'
import ruTopics from '../public/locales/ru/topics.json'
import ukTopics from '../public/locales/uk/topics.json'
import zhTopics from '../public/locales/zh/topics.json'

const RESOURCES = {
  en: { home: en, about: enAbout, 'inner-spectrum': enIs, bio: enBio, 'bio-metric': enBioMetric, level: enLevel, part: enPart, contact: enContact, sitemap: enSitemap, privacy: enPrivacy, terms: enTerms, glossary: enGlossary, articles: enArticles, topics: enTopics },
  es: { home: es, about: esAbout, 'inner-spectrum': esIs, bio: esBio, 'bio-metric': esBioMetric, level: esLevel, part: esPart, contact: esContact, sitemap: esSitemap, privacy: esPrivacy, terms: esTerms, glossary: esGlossary, articles: esArticles, topics: esTopics },
  ru: { home: ru, about: ruAbout, 'inner-spectrum': ruIs, bio: ruBio, 'bio-metric': ruBioMetric, level: ruLevel, part: ruPart, contact: ruContact, sitemap: ruSitemap, privacy: ruPrivacy, terms: ruTerms, glossary: ruGlossary, articles: ruArticles, topics: ruTopics },
  uk: { home: uk, about: ukAbout, 'inner-spectrum': ukIs, bio: ukBio, 'bio-metric': ukBioMetric, level: ukLevel, part: ukPart, contact: ukContact, sitemap: ukSitemap, privacy: ukPrivacy, terms: ukTerms, glossary: ukGlossary, articles: ukArticles, topics: ukTopics },
  zh: { home: zh, about: zhAbout, 'inner-spectrum': zhIs, bio: zhBio, 'bio-metric': zhBioMetric, level: zhLevel, part: zhPart, contact: zhContact, sitemap: zhSitemap, privacy: zhPrivacy, terms: zhTerms, glossary: zhGlossary, articles: zhArticles, topics: zhTopics },
} as const

let registered = false
export function ensureSsrI18nResources(): void {
  if (registered) return
  for (const lang of SUPPORTED_LANGS) {
    for (const ns of I18N_NAMESPACES) {
      i18n.addResourceBundle(lang, ns, (RESOURCES as Record<string, Record<string, unknown>>)[lang][ns], true, true)
    }
  }
  registered = true
}

ensureSsrI18nResources()

export default i18n
export * from './i18n'
