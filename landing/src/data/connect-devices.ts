/**
 * /connect/<device> — "how to read your <device> data" pages (task 071 stage 2a).
 * EN only. Static content: no OAuth / no connect code here (that is stage 2b).
 *
 * Fact source: D:\_ONDA\_Sciense\071_connect_research.md (verified items only;
 * unverified items are phrased as unknown) + docs/onda-facts-source-of-truth.md.
 * Rules: plain-text maker names only (no logos), no verdicts / diagnoses,
 * never "more accurate than the maker", camera = pulse + breathing estimate (not HRV).
 */

export type ConnectStatus = 'app' | 'planned' | 'reviewing' | 'closed' | 'no-api'

export interface SourceLink {
  label: string
  url: string
}

export interface ConnectDevice {
  slug: string
  /** Plain-text name, nominative use only. */
  name: string
  metaTitle: string
  metaDescription: string
  h1: string
  lead: string
  /** Where the HRV number lives in the maker's app and how it is named. */
  shows: string[]
  /** HRV type in one short phrase, for the index table. */
  hrvType: string
  sources: SourceLink[]
  status: ConnectStatus
  connect: string
  /** Can it reach ONDA via Apple Health? */
  appleHealth: string
  faq: { q: string; a: string }[]
}

export const CONNECT_STATUS_LABEL: Record<ConnectStatus, string> = {
  app: 'Works with the ONDA app now',
  planned: 'Direct connection planned',
  reviewing: 'Under review',
  closed: 'Developer access closed',
  'no-api': 'No public web API',
}

const CAMERA =
  'If your device is not Apple Watch, ONDA can still measure your pulse with the iPhone camera, along with a breathing-rate estimate. The camera gives pulse, not HRV.'

/** Digest 073 §4 (adapted): no cross-device / peer comparison for night-time HRV. */
const CROSS_DEVICE_CAVEAT =
  'HRV numbers cannot be compared directly between devices or apps. WHOOP calculates RMSSD during your deepest sleep, Oura averages five-minute samples across the night, Polar uses roughly the first four hours of sleep, and Apple Watch records SDNN during the day. A direct comparison of five wearables with an ECG reference over 536 nights found systematic differences between devices. So compare your numbers only with your own baseline on the same device: other people’s averages and age tables are not a personal standard.'

const UNCONFIRMED_HEALTH = (name: string) =>
  `We have not confirmed that ${name} writes HRV to Apple Health, so we do not promise that your ${name} HRV will appear in ONDA. ${CAMERA}`

export const CONNECT_DEVICES: ConnectDevice[] = [
  {
    slug: 'oura',
    name: 'Oura',
    metaTitle: 'How to Read Your Oura HRV and Readiness | ONDA Life',
    metaDescription:
      'How to read Oura HRV: what HRV Balance and Readiness mean, which HRV Oura reports at night, whether Oura can connect to ONDA, and how to compare a night with your own baseline.',
    h1: 'How to read your Oura HRV',
    lead:
      'Oura shows HRV inside Readiness and as a night-time average. Here is what those numbers are, what they are not, and how to read them against your own baseline rather than someone else’s.',
    shows: [
      'Oura’s Readiness score combines several inputs: HRV, resting heart rate, body temperature, sleep, activity and, where relevant, the menstrual cycle. It is Oura’s own algorithm, not a medical measure.',
      'Inside Readiness, “HRV Balance” compares your recent HRV with your longer-term level: Oura describes it as a 14-day weighted average compared with your average over about two months.',
      'Oura’s developer documentation exposes HRV as an average over your sleep (average_hrv). Oura’s help pages describe possible reasons for a change with “may” — a change is a signal to look at, not a cause.',
      CROSS_DEVICE_CAVEAT,
    ],
    hrvType: 'Night-time average (during sleep)',
    sources: [
      { label: 'Oura Help: Readiness Score', url: 'https://support.ouraring.com/hc/en-us/articles/360025589793' },
      { label: 'Oura API: authentication and data', url: 'https://cloud.ouraring.com/docs/authentication' },
      { label: 'Oura API Agreement', url: 'https://cloud.ouraring.com/legal/api-agreement' },
      { label: 'Oura Help: Apple Health Integration', url: 'https://support.ouraring.com/hc/en-us/articles/360025438734-Apple-Health-Integration' },
    ],
    status: 'planned',
    connect:
      'Oura has a public API. We plan a direct connection, but it is not available yet and we cannot give a date. Oura says data from current rings is only available through its API with an active Oura Membership.',
    appleHealth: `According to Oura’s own help page, HRV is not among the data Oura exports to Apple Health, so your Oura HRV will not reach ONDA that way. ${CAMERA}`,
    faq: [
      {
        q: 'Which HRV does Oura show?',
        a: 'Oura reports HRV measured during sleep and summarised as a night-time average. HRV Balance in Readiness compares a 14-day weighted average with your roughly two-month average.',
      },
      {
        q: 'Can I compare my Oura HRV with an Apple Watch number?',
        a: 'Not directly. Apple Health stores HRV as SDNN, and devices compute night-time HRV over different windows, so the same night can produce different numbers on two devices.',
      },
    ],
  },
  {
    slug: 'whoop',
    name: 'WHOOP',
    metaTitle: 'How to Read Your WHOOP HRV and Recovery | ONDA Life',
    metaDescription:
      'How to read WHOOP HRV: what the Recovery percentage is built from, why WHOOP HRV is RMSSD, whether WHOOP can connect to ONDA, and how to read a low night against your own baseline.',
    h1: 'How to read your WHOOP HRV',
    lead:
      'WHOOP turns your night into a Recovery percentage, and HRV is one of its inputs. Here is what the number is made of and how to read it calmly.',
    shows: [
      'Recovery is a score from 0 to 100%, shown in three colours. WHOOP says it uses HRV, resting heart rate, sleep and respiratory rate, compared with your own baseline.',
      'WHOOP’s developer documentation names the HRV value hrv_rmssd_milli: it is RMSSD, in milliseconds, attached to each Recovery.',
      'Recovery is WHOOP’s own algorithm. The formula behind composite scores like this is not published by the makers, so treat the percentage as a summary and look at the HRV and resting heart rate underneath it.',
      CROSS_DEVICE_CAVEAT,
    ],
    hrvType: 'RMSSD, in milliseconds (in Recovery)',
    sources: [
      { label: 'WHOOP: How does Recovery work', url: 'https://www.whoop.com/au/en/thelocker/how-does-whoop-recovery-work-101/' },
      { label: 'WHOOP Developer: Recovery data', url: 'https://developer.whoop.com/docs/developing/user-data/recovery' },
      { label: 'WHOOP Developer: app approval', url: 'https://developer.whoop.com/docs/developing/app-approval' },
    ],
    status: 'planned',
    connect:
      'WHOOP has a public developer API. We plan a direct connection, but it is not available yet. WHOOP approves apps in stages with a manual review, so we cannot give a date.',
    appleHealth: UNCONFIRMED_HEALTH('WHOOP'),
    faq: [
      {
        q: 'Is WHOOP HRV RMSSD or SDNN?',
        a: 'RMSSD. WHOOP’s developer documentation lists the HRV value as RMSSD in milliseconds.',
      },
      {
        q: 'My Recovery is red. Is something wrong?',
        a: 'A single low score is not a diagnosis. It is most often a reaction to something specific, such as a short night, alcohol, illness, stress or hard training. Look at several days against your own baseline, and see the emergency list below for symptoms that need care now.',
      },
    ],
  },
  {
    slug: 'polar',
    name: 'Polar',
    metaTitle: 'How to Read Polar Nightly Recharge and HRV | ONDA Life',
    metaDescription:
      'How to read Polar Nightly Recharge: what ANS charge from −10 to +10 means, which part of the night Polar uses, whether Polar can connect to ONDA, and why Polar HRV does not reach Apple Health.',
    h1: 'How to read your Polar Nightly Recharge',
    lead:
      'Polar shows night-time HRV through Nightly Recharge and its ANS charge. Here is what the scale means and how to read it against your own usual level.',
    shows: [
      'Nightly Recharge includes ANS charge, on a scale from −10 to +10, where 0 is your usual level over the last 28 days.',
      'Polar measures it over roughly the first four hours of sleep, then gives an overall status from “very poor” to “very good”.',
      'Polar’s developer API reports a night-time HRV average and beat-to-beat intervals for Nightly Recharge. We have not confirmed from Polar which HRV formula that average uses, so we do not label it RMSSD or SDNN here.',
      CROSS_DEVICE_CAVEAT,
    ],
    hrvType: 'Night-time, first ~4 h of sleep (formula not confirmed)',
    sources: [
      { label: 'Polar Support: Nightly Recharge', url: 'https://support.polar.com/en/nightly-recharge-recovery-measurement' },
      { label: 'Polar AccessLink API', url: 'https://www.polar.com/accesslink-api/' },
      { label: 'Polar Support: Polar Flow and Apple Health', url: 'https://support.polar.com/en/support/connecting_polar_flow_with_apple_health' },
    ],
    status: 'planned',
    connect:
      'Polar has a public API (AccessLink). We plan a direct connection, but it is not available yet and we cannot give a date.',
    appleHealth: `According to Polar’s own support page, Polar Flow does not write HRV to Apple Health, so your Polar HRV will not reach ONDA that way. ${CAMERA}`,
    faq: [
      {
        q: 'What does ANS charge 0 mean?',
        a: 'Zero means your night was at your usual level for the last 28 days. Positive values are above it, negative values below it.',
      },
      {
        q: 'Does Polar send HRV to Apple Health?',
        a: 'Polar’s support page lists the data Polar Flow shares with Apple Health, and HRV is not among it.',
      },
    ],
  },
  {
    slug: 'garmin',
    name: 'Garmin',
    metaTitle: 'How to Read Garmin HRV Status (Balanced, Low) | ONDA Life',
    metaDescription:
      'How to read Garmin HRV Status: what Balanced, Unbalanced and Low mean, why it needs weeks to set a baseline, whether Garmin can connect to ONDA, and how to read a low night.',
    h1: 'How to read your Garmin HRV Status',
    lead:
      'Garmin labels your night-time HRV as Balanced, Unbalanced or Low compared with your own range. Here is what those labels mean and why they can shift.',
    shows: [
      'HRV Status places your recent night-time HRV against a personal range and labels it Balanced, Unbalanced or Low. Independent explainers describe the baseline as taking about three weeks of wear to form.',
      '“Unbalanced” only means you are outside your own range — above or below it. Garmin users often ask why it appears after a good stretch: the range itself moves as your readings change.',
      'We have not confirmed from Garmin which HRV formula HRV Status uses, so we do not label it here.',
    ],
    hrvType: 'Night-time, vs your personal range (formula not confirmed)',
    sources: [
      { label: 'Wareable: Garmin HRV Status explained', url: 'https://www.wareable.com/garmin/garmin-hrv-status-explained-what-is-it-how-to-use' },
      { label: 'Garmin Connect Developer Program', url: 'https://developer.garmin.com/gc-developer-program/overview/' },
    ],
    status: 'closed',
    connect:
      'Garmin’s developer program page currently has no application form, only a note to stay tuned for updates. Until Garmin reopens access we cannot build a direct connection.',
    appleHealth: UNCONFIRMED_HEALTH('Garmin'),
    faq: [
      {
        q: 'Why does Garmin say Unbalanced when I feel fine?',
        a: 'Unbalanced means outside your recent personal range, in either direction. It is a description of the number, not of your health.',
      },
      {
        q: 'Can ONDA read my Garmin data?',
        a: 'Not directly at the moment: Garmin is not accepting new developer applications. ONDA can measure your pulse with the iPhone camera, and reads HRV from Apple Health (Apple Watch or another tracker that syncs there).',
      },
    ],
  },
  {
    slug: 'fitbit',
    name: 'Fitbit',
    metaTitle: 'How to Read Your Fitbit HRV | ONDA Life',
    metaDescription:
      'How to read Fitbit HRV against your own baseline, why devices disagree, whether Fitbit and Pixel Watch data can connect to ONDA, and what changed in Google’s developer access.',
    h1: 'How to read your Fitbit HRV',
    lead:
      'Fitbit and Pixel Watch show HRV in the Fitbit app. The most useful way to read it is against your own recent nights, not against a single “good” number.',
    shows: [
      'We have not verified from Fitbit’s own pages which HRV formula or time window the Fitbit app uses, or how its readiness score is built, so we do not label them here.',
      'Whatever the label, compare a night with your own usual range over several weeks. A single night up or down says little on its own.',
    ],
    hrvType: 'Not confirmed from official pages',
    sources: [
      { label: 'Google Health API (developer access)', url: 'https://developers.google.com/health' },
      { label: 'Google Health Help: Apple Health data types', url: 'https://support.google.com/googlehealth/answer/17037331' },
    ],
    status: 'closed',
    connect:
      'Google says the Google Health API is not onboarding new projects at this time, and the older Fitbit Web API is being shut down on 2026-10-30. So a direct connection is not possible for us right now.',
    appleHealth: `According to Google’s own help page, the Google Health app reads HRV from Apple Health but does not write HRV to it, so your Fitbit or Pixel Watch HRV will not reach ONDA that way. ${CAMERA}`,
    faq: [
      {
        q: 'Can ONDA read my Fitbit or Pixel Watch HRV?',
        a: 'Not directly: Google is not accepting new projects for its health API. ONDA can measure your pulse with the iPhone camera, and reads HRV from Apple Health (Apple Watch or another tracker that syncs there).',
      },
    ],
  },
  {
    slug: 'samsung',
    name: 'Samsung Galaxy Watch',
    metaTitle: 'How to Read Samsung Galaxy Watch HRV | ONDA Life',
    metaDescription:
      'How to read Samsung Galaxy Watch HRV against your own baseline, why numbers differ between devices, and whether Samsung Health data can connect to ONDA.',
    h1: 'How to read your Samsung Galaxy Watch HRV',
    lead:
      'Samsung Health shows heart and recovery data from Galaxy Watch. Read any HRV number there against your own recent nights rather than a population figure.',
    shows: [
      'We have not verified from Samsung’s own pages which HRV formula or time window Samsung Health uses, so we do not label it here.',
      'If you compare Samsung numbers with another device, expect them to differ: devices measure at different times and compute HRV differently.',
    ],
    hrvType: 'Not confirmed from official pages',
    sources: [],
    status: 'no-api',
    connect:
      'Samsung Health data is available to developers through an Android SDK on the phone, not through a web API that a website can connect to. So we cannot offer a direct connection from this site.',
    appleHealth: UNCONFIRMED_HEALTH('Samsung Health'),
    faq: [
      {
        q: 'Can ONDA read Samsung Health?',
        a: 'Not from this website: Samsung Health has no public web API. ONDA can measure your pulse with the iPhone camera, and reads HRV from Apple Health (Apple Watch or another tracker that syncs there).',
      },
    ],
  },
  {
    slug: 'withings',
    name: 'Withings',
    metaTitle: 'How to Read Your Withings Heart Data | ONDA Life',
    metaDescription:
      'How to read Withings heart and sleep data against your own baseline, whether Withings reports HRV through its API, and whether it can connect to ONDA.',
    h1: 'How to read your Withings heart data',
    lead:
      'Withings devices record heart rate and sleep. Here is what we could and could not confirm about HRV, and how to read your numbers against your own usual range.',
    shows: [
      'Withings mentions HRV data only in general terms in its developer documentation, without naming a field. We have not confirmed which HRV Withings reports or how it is computed.',
      'Resting heart rate and sleep are useful on their own: read them against your own recent weeks.',
    ],
    hrvType: 'Not confirmed',
    sources: [{ label: 'Withings developer documentation', url: 'https://developer.withings.com/llms.md' }],
    status: 'reviewing',
    connect:
      'Withings has a public API that does not require a contract. We are checking whether it provides HRV before deciding on a connection, so nothing is planned yet.',
    appleHealth: UNCONFIRMED_HEALTH('Withings'),
    faq: [
      {
        q: 'Does Withings measure HRV?',
        a: 'We could not confirm an HRV field in Withings’ public developer documentation, so we do not state it either way.',
      },
    ],
  },
  {
    slug: 'ultrahuman',
    name: 'Ultrahuman',
    metaTitle: 'How to Read Your Ultrahuman Ring HRV | ONDA Life',
    metaDescription:
      'How to read Ultrahuman Ring HRV against your own baseline, why ring and watch numbers differ, and whether Ultrahuman data can connect to ONDA.',
    h1: 'How to read your Ultrahuman Ring HRV',
    lead:
      'Ultrahuman rings show HRV and recovery-style scores in their app. Read them against your own recent nights, not against another device or another person.',
    shows: [
      'We have not verified from Ultrahuman’s own pages which HRV formula or time window its app uses, so we do not label it here.',
      'Scores that combine several signals are the maker’s own algorithm; look at the HRV and resting heart rate underneath them.',
    ],
    hrvType: 'Not confirmed from official pages',
    sources: [],
    status: 'no-api',
    connect:
      'We have not found an official public developer API from Ultrahuman, so we cannot offer a direct connection.',
    appleHealth: UNCONFIRMED_HEALTH('Ultrahuman'),
    faq: [
      {
        q: 'Can ONDA read my Ultrahuman data?',
        a: 'Not directly: we have not found an official public API. ONDA can measure your pulse with the iPhone camera, and reads HRV from Apple Health (Apple Watch or another tracker that syncs there).',
      },
    ],
  },
  {
    slug: 'ringconn',
    name: 'RingConn',
    metaTitle: 'How to Read Your RingConn HRV | ONDA Life',
    metaDescription:
      'How to read RingConn HRV against your own baseline, why ring and watch numbers differ, and whether RingConn data can connect to ONDA.',
    h1: 'How to read your RingConn HRV',
    lead:
      'RingConn shows HRV and sleep in its app. The useful question is how tonight compares with your own usual range.',
    shows: [
      'We have not verified from RingConn’s own pages which HRV formula or time window it uses, so we do not label it here.',
      'Compare like with like: the same device, at the same time of night, over several weeks.',
    ],
    hrvType: 'Not confirmed from official pages',
    sources: [],
    status: 'no-api',
    connect: 'RingConn does not offer a public developer API that we could find, so a direct connection is not possible.',
    appleHealth: UNCONFIRMED_HEALTH('RingConn'),
    faq: [
      {
        q: 'Can ONDA read my RingConn data?',
        a: 'Not directly: there is no public API we can use. ONDA can measure your pulse with the iPhone camera, and reads HRV from Apple Health (Apple Watch or another tracker that syncs there).',
      },
    ],
  },
  {
    slug: 'amazfit',
    name: 'Amazfit',
    metaTitle: 'How to Read Your Amazfit (Zepp) HRV | ONDA Life',
    metaDescription:
      'How to read Amazfit and Zepp HRV against your own baseline, why devices disagree, and whether Amazfit data can connect to ONDA.',
    h1: 'How to read your Amazfit (Zepp) HRV',
    lead:
      'Amazfit devices show HRV in the Zepp app. Read it against your own recent nights rather than a single target number.',
    shows: [
      'We have not verified from Zepp’s own pages which HRV formula or time window it uses, so we do not label it here.',
      'If a combined score looks off, check the HRV and resting heart rate behind it over several days.',
    ],
    hrvType: 'Not confirmed from official pages',
    sources: [],
    status: 'no-api',
    connect: 'Amazfit / Zepp does not offer a public developer API that we could find, so a direct connection is not possible.',
    appleHealth: UNCONFIRMED_HEALTH('Amazfit'),
    faq: [
      {
        q: 'Can ONDA read my Amazfit data?',
        a: 'Not directly: there is no public API we can use. ONDA can measure your pulse with the iPhone camera, and reads HRV from Apple Health (Apple Watch or another tracker that syncs there).',
      },
    ],
  },
  {
    slug: 'apple-watch',
    name: 'Apple Watch',
    metaTitle: 'How to Read Your Apple Watch HRV (SDNN) | ONDA Life',
    metaDescription:
      'How to read Apple Watch HRV: why Apple Health stores SDNN, why it is not comparable with RMSSD from rings, and how the ONDA app reads it to build your own baseline.',
    h1: 'How to read your Apple Watch HRV',
    lead:
      'Apple Watch records HRV automatically and stores it in Apple Health. Here is which HRV that is, why it differs from ring numbers, and how ONDA uses it.',
    shows: [
      'Apple Health stores HRV as SDNN — the standard deviation of the intervals between normal heartbeats — recorded automatically by Apple Watch.',
      'Recent Apple Watch models on watchOS also show two variants, Recovery HRV and Overall HRV. Apple has not stated how Recovery HRV is computed.',
      'SDNN and RMSSD are different measures, so an Apple Watch number cannot be compared directly with RMSSD from WHOOP or a ring.',
    ],
    hrvType: 'SDNN (Apple Health)',
    sources: [
      { label: 'Apple Developer: heartRateVariabilitySDNN', url: 'https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn' },
      { label: 'Apple Newsroom: Recovery HRV and Overall HRV (2026)', url: 'https://www.apple.com/newsroom/2026/09/apple-advances-health-and-fitness-capabilities-using-apple-intelligence/' },
    ],
    status: 'app',
    connect:
      'Apple Watch has no web API: its data stays in Apple Health on your iPhone. The ONDA iOS app reads it there, with your permission.',
    appleHealth:
      'Yes. The ONDA app reads Apple Watch HRV from Apple Health to build your own nightly baseline (mean ± SD over your recent nights, never a population norm), and Apple Watch supplies live pulse during practice. Live breathing biofeedback needs Apple Watch; without it, ONDA measures your pulse with the iPhone camera.',
    faq: [
      {
        q: 'Why is my Apple Watch HRV lower than my ring’s?',
        a: 'Apple Health stores SDNN; most rings report RMSSD, and devices measure over different windows. The numbers are not on the same scale.',
      },
      {
        q: 'Does ONDA read my Apple Watch HRV?',
        a: 'Yes, from Apple Health with your permission, to compare each night with your own baseline. It describes your numbers and does not diagnose anything.',
      },
    ],
  },
]

export function getConnectDevice(slug: string): ConnectDevice | undefined {
  return CONNECT_DEVICES.find((d) => d.slug === slug)
}

export const CONNECT_INDEX_META = {
  title: 'How to Read Your Wearable’s HRV | ONDA Life',
  description:
    'How to read HRV from Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit and Apple Watch: which HRV each shows, and whether it can connect to ONDA.',
  h1: 'How to read your device’s HRV',
}

/** Emergency list — same text as RED_FLAG_LIST in chatgpt-app and the why-is-my-hrv-low hub. */
export const CONNECT_RED_FLAGS =
  'chest pain or pressure; fainting or near-fainting; severe shortness of breath; fast, strong or irregular heartbeat that does not settle at rest (including with dizziness); sudden confusion, weakness on one side, trouble speaking'

const SITE_URL = 'https://onda-life.com'

/** Static JSON-LD (emitted by meta-inject; never effect-injected). */
export function connectJsonLd(slug?: string, lang = 'en', loc?: { h1: string; description: string }): Record<string, unknown>[] {
  if (!slug) {
    const url = lang === 'en' ? `${SITE_URL}/connect` : `${SITE_URL}/${lang}/connect`
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        name: loc?.h1 ?? CONNECT_INDEX_META.h1,
        description: loc?.description ?? CONNECT_INDEX_META.description,
        url,
        inLanguage: lang,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: CONNECT_DEVICES.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/connect/${d.slug}`,
            name: d.h1,
          })),
        },
      },
    ]
  }
  const d = getConnectDevice(slug)
  if (!d) return []
  const url = `${SITE_URL}/connect/${d.slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: d.h1,
      description: d.metaDescription,
      url,
      inLanguage: 'en',
      author: { '@id': `${SITE_URL}/#author` },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      about: [d.name, 'Heart rate variability'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: 'en',
      mainEntity: d.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
}
