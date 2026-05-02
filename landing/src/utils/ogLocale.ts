/**
 * Synchronizes og:locale + og:locale:alternate meta tags with the current
 * page locale. Called from page-level useEffect blocks after route or
 * language changes.
 *
 * og:locale       — single tag pointing at the locale of the current page.
 * og:locale:alternate — repeated tag, once per OTHER supported locale.
 *
 * Social platforms (LinkedIn, Facebook, Telegram, X) read these to pick the
 * right preview text and to link a card to its localized variants. Without
 * og:locale:alternate, sharing the EN article on a Russian channel still
 * shows the EN preview.
 *
 * The function is idempotent: it removes all previous og:locale* entries
 * before re-creating them, so navigation doesn't leak stale tags.
 */
import { SUPPORTED_LANGS, OG_LOCALES, type Lang } from '../i18n'

export function syncOgLocale(currentLang: Lang): void {
  // Remove every existing og:locale and og:locale:alternate meta.
  document
    .querySelectorAll<HTMLMetaElement>(
      'meta[property="og:locale"], meta[property="og:locale:alternate"]',
    )
    .forEach((el) => el.remove())

  // Primary tag for current locale.
  const primary = document.createElement('meta')
  primary.setAttribute('property', 'og:locale')
  primary.setAttribute('content', OG_LOCALES[currentLang])
  document.head.appendChild(primary)

  // Alternates for every other supported locale.
  for (const lang of SUPPORTED_LANGS) {
    if (lang === currentLang) continue
    const alt = document.createElement('meta')
    alt.setAttribute('property', 'og:locale:alternate')
    alt.setAttribute('content', OG_LOCALES[lang])
    document.head.appendChild(alt)
  }
}
