/**
 * Cookie consent state (task 105). The inline head script in index.html owns the first steps:
 * it sets gtag('consent','default', all denied) BEFORE GTM, asks /api/geo for the country, sends
 * consent 'update' granted for non-consent countries, re-applies a stored choice, and publishes
 * the result on window.__ondaConsent + the 'onda-consent' event. This module is the React side:
 * read that state, save a choice (localStorage, try/catch) and push gtag('consent','update').
 */
export type ConsentChoice = 'granted' | 'denied'
export interface ConsentState {
  /** geo answered (or failed) */
  ready: boolean
  country: string | null
  /** EEA / UK / CH / unknown → banner + "Cookie settings" */
  needsConsent: boolean
  /** stored choice, null = not decided yet */
  choice: ConsentChoice | null
  /** analytics_storage effectively granted right now */
  analytics: boolean
}

export const CONSENT_STORAGE_KEY = 'onda_consent_v1'
const EVT = 'onda-consent'
const OPEN_EVT = 'onda-consent-open'

type W = Window & { __ondaConsent?: ConsentState; dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }

const PENDING: ConsentState = { ready: false, country: null, needsConsent: true, choice: null, analytics: false }

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return PENDING
  return (window as W).__ondaConsent ?? PENDING
}

export function onConsentChange(cb: (s: ConsentState) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const h = () => cb(getConsent())
  window.addEventListener(EVT, h)
  return () => window.removeEventListener(EVT, h)
}

function gtag(...args: unknown[]): void {
  const w = window as W
  if (typeof w.gtag === 'function') w.gtag(...args)
  else (w.dataLayer = w.dataLayer || []).push(args)
}

export function setConsentChoice(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice)
  } catch {
    /* storage blocked — the choice lasts for this page view only */
  }
  const v = choice
  gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v })
  ;(window as W).__ondaConsent = { ...getConsent(), ready: true, choice, analytics: choice === 'granted' }
  window.dispatchEvent(new Event(EVT))
}

/** Footer "Cookie settings" → reopen the banner. */
export function openConsentBanner(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_EVT))
}
export function onConsentOpen(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(OPEN_EVT, cb)
  return () => window.removeEventListener(OPEN_EVT, cb)
}

/** Run cb once analytics_storage is granted (now, or later after Accept — no reload needed). */
export function whenAnalyticsGranted(cb: () => void): void {
  if (getConsent().analytics) {
    cb()
    return
  }
  const off = onConsentChange((s) => {
    if (s.analytics) {
      off()
      cb()
    }
  })
}
