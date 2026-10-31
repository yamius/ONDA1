/**
 * Cookie-consent banner copy (task 105). EN only for now; add a language by adding a key —
 * missing languages fall back to EN. Translate through the normal queue.
 */
export interface ConsentCopy {
  text: string
  privacy: string
  accept: string
  reject: string
  settings: string
}

export const CONSENT_COPY: Partial<Record<string, ConsentCopy>> & { en: ConsentCopy } = {
  en: {
    text: 'We use cookies for analytics (Google Analytics, PostHog) and to measure our ads (Meta, Reddit). They run only if you accept. You can change your choice anytime via "Cookie settings" at the bottom of the page.',
    privacy: 'Privacy Policy',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie settings',
  },
}

export function consentCopy(lang: string): ConsentCopy {
  return CONSENT_COPY[lang] ?? CONSENT_COPY.en
}
