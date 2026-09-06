import type { ToolReview } from './types'

const eightSleepPod5: ToolReview = {
  slug: 'eight-sleep-pod-5',
  name: 'Eight Sleep Pod 5',
  brand: 'Eight Sleep',
  category: 'sleep-climate',
  productType: 'Premium smart sleep-climate cover + mattress system',
  description:
    'ONDA review of the Eight Sleep Pod 5 — the flagship Pod 5 Ultra adds an adjustable base, top-down cooling and audio, but jumps to $6,099+. The core tech is shared with the Pod 4.',
  verdict:
    'The maximal Eight Sleep — the Pod 5 Ultra adds an adjustable base, a top-down hydro-powered blanket, built-in audio and snore mitigation, but at $6,099+ the price roughly doubles. The core dual-zone climate and HRV tech are the same as the Pod 4, which remains the value.',
  summary:
    'The Eight Sleep Pod 5 is the 2026 generation of the category-leading sleep-climate system. The flagship Pod 5 Ultra is a fuller bed system: an adjustable base, a hydro-powered blanket that adds cooling/heating from above as well as below, built-in soundscapes and speakers, and automatic snore mitigation that gently raises your head. The Pod 5 Core (cover-only) adds faster heating/cooling and smarter AI. But the fundamentals — dual-zone temperature, AI Autopilot, HRV and sleep-stage tracking, vibrating alarm — are identical to the Pod 4, and the April 2026 Autopilot 4.0 "sleep agent" (Apple/Google Health integration, plain-language morning brief) reaches the Pod 4 too. The Pod 5 Ultra starts around $6,099 (queen) to $6,300 (king) versus the Pod 4’s $2,449–$2,649, and the subscription is still required.',
  overallScore: 8.5,
  scores: [
    { criterionId: 'climate-range', score: 9.7, note: 'The Pod 5 Ultra adds a hydro-powered blanket for top-down temperature control on top of the dual-zone cover — the fullest climate envelope in the category. Pod 5 Core adds faster heating/cooling. Dual-zone (his/her) carries over.' },
    { criterionId: 'build', score: 8.5, note: 'Premium cover plus, on the Ultra, an adjustable base and quieter hub. Refined physical controls. Multi-year reliability track record largely positive.' },
    { criterionId: 'app-tracking', score: 9.0, note: 'Same best-in-class sleep/HRV tracking, now with Autopilot 4.0 — a "sleep agent" that integrates Apple Health / Google Health Connect and writes a plain-language morning brief. Notably, that software also reaches the Pod 4.' },
    { criterionId: 'form-factor', score: 8.0, note: 'The Ultra is a fuller system: adjustable base, built-in speakers and automatic snore mitigation (raises the head). More capable, but a bigger install and footprint than a cover-only Pod.' },
    { criterionId: 'subscription', score: 5.0, note: 'Unchanged — the Autopilot subscription is still required for full features (~$15–25/month). Premium hardware behind an ongoing membership remains the editorial sticking point.' },
    { criterionId: 'value', score: 4.0, note: 'Pod 5 Ultra $6,099–$6,300 (queen/king) plus subscription — roughly double the Pod 4. For the core sleep-climate experience the Pod 4 (or Pod 5 Core) delivers most of the value for far less.' },
  ],
  pros: [
    'Fullest climate control in the category — top-down hydro blanket plus dual-zone cover (Ultra)',
    'Adjustable base, built-in audio and automatic snore mitigation on the Ultra',
    'Best sleep/HRV tracking of any climate system, now with the Autopilot 4.0 sleep agent',
    'Multi-year reliability track record largely positive',
  ],
  cons: [
    'Pod 5 Ultra roughly doubles the price ($6,099+) for additive, not core, features',
    'Autopilot subscription still required for full features',
    'The headline software (Autopilot 4.0) also comes to the Pod 4 — less reason to upgrade',
    'Bigger install and footprint; locked into the Eight Sleep ecosystem',
  ],
  bestFor: 'Best for buyers who want the maximal full-bed system — adjustable base, top-down climate, audio and snore mitigation — and will absorb the price and subscription. For the core experience, the Pod 4 or Pod 5 Core is the smarter buy.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Eight Sleep specifications and independent 2026 reviews of the Pod 5 Ultra and Pod 4. Not hands-on tested by ONDA.',
  price: { usd: 6099, note: 'Pod 5 Ultra, queen (king ~$6,300); Pod 5 Core cheaper; + ~$20/mo subscription', asOf: '2026-09-06' },
  link: 'https://www.eightsleep.com/',
  linkType: 'official',
  content: `## Where it leads

The Eight Sleep Pod 5 extends the category lead the [Pod 4](/reviews/eight-sleep-pod-4) set. On the flagship Pod 5 Ultra, a hydro-powered blanket adds cooling and heating from above to the dual-zone cover below — the fullest temperature envelope any smart sleep system offers — alongside an adjustable base, built-in audio and automatic snore mitigation. The tracking is still best in class, now driven by the Autopilot 4.0 "sleep agent" that reads across Apple/Google Health and writes a plain-language morning brief.

## What actually changed vs the Pod 4

The additions are real but they sit on top of an unchanged core. Dual-zone temperature, AI Autopilot, HRV and sleep-stage tracking and the vibrating alarm are identical to the Pod 4 — and the Autopilot 4.0 software reaches the Pod 4 as well. So the Pod 5 Ultra’s genuine advantages are the adjustable base, the top-down blanket, the audio and the snore mitigation, not the sleep-climate fundamentals. See the full [Pod 4 vs Pod 5](/reviews/vs/eight-sleep-pod-4-vs-eight-sleep-pod-5) breakdown.

## The catch

Price and the subscription. The Pod 5 Ultra starts around $6,099 (queen) — roughly double the Pod 4 — and still requires the Autopilot membership for full features. That is a lot of money for additive comforts when the core experience is shared.

## Who it is for

Choose the Pod 5 Ultra if you want the maximal full-bed system and the price is not the deciding factor. If you want the Eight Sleep sleep-climate experience for the best value, the [Pod 4](/reviews/eight-sleep-pod-4) — or the cheaper Pod 5 Core — is the smarter buy. For the wider field, see the [best smart sleep-climate systems](/reviews/sleep-climate).
`,
  references: [
    { label: 'Eight Sleep — official site', url: 'https://www.eightsleep.com/' },
    { label: 'Tom’s Guide — Eight Sleep Pod 5 Ultra launch', url: 'https://www.tomsguide.com/mattresses/eight-sleep-launches-pod-5-ultra' },
  ],
  relatedSlugs: ['eight-sleep-pod-4', 'eight-sleep-pod-cover-pro', 'chilipad-dock-pro', 'bedjet-3'],
  publishOn: '2026-09-06',
  datePublished: '2026-09-06',
  dateModified: '2026-09-06',
}

export default eightSleepPod5
