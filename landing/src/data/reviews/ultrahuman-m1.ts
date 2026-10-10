import type { ToolReviewInput } from './types'

const ultrahumanM1: ToolReviewInput = {
  slug: 'ultrahuman-m1',
  name: 'Ultrahuman M1',
  brand: 'Ultrahuman',
  category: 'cgm',
  productType: 'CGM programme (Abbott Libre outside the US; Abbott Lingo via M2 Live in the US) with ring ecosystem',
  description:
    'Ultrahuman M1 review (2026): the CGM ecosystem play — glucose read with HRV, sleep and recovery in one app. In the US it is now sold as M2 Live with Abbott’s over-the-counter Lingo sensor from $99/month.',
  verdict:
    'The best ecosystem play — glucose data composed with HRV, sleep and recovery from the Ultrahuman Ring in one app.',
  summary:
    'Ultrahuman M1 is the CGM arm of the Ultrahuman platform — the same app that runs the Ultrahuman rings. Outside the US it uses Abbott FreeStyle Libre sensors; in the US, Ultrahuman launched M2 Live on 18 June 2026, built on Abbott’s over-the-counter Lingo sensor with no prescription needed. The differentiator is integration: meals, glucose curves, sleep, HRV, movement and recovery live on one timeline. Strong for Ultrahuman ring owners; weaker as a standalone CGM.',
  scores: [
    { criterionId: 'sensor-accuracy', score: 8.5, note: 'Abbott sensors throughout: FreeStyle Libre 3 outside the US, Abbott Lingo (14-day wear, Libre-based) in the US via M2 Live. In an independent head-to-head study (Eichenlaub et al. 2025) Libre 3 and Dexcom G7 were similarly accurate. Ultrahuman links its own published studies from its homepage instead of citing only general research.' },
    { criterionId: 'insights', score: 7.5, note: 'Solid meal-impact analysis plus the unique cross-signal view: glucose composed with HRV, sleep and recovery on the same timeline.' },
    { criterionId: 'coaching', score: 6.5, note: 'Mostly AI-driven (Jade AI insights). Plans include access to performance coaches, not dietitians or clinicians.' },
    { criterionId: 'app-integration', score: 8.0, note: 'Native integration with Ultrahuman rings for HRV/sleep/recovery; Apple Health, Google Fit and food-log support. The richest single-app stack in the category.' },
    { criterionId: 'flexibility', score: 7.0, note: 'US: single Lingo sensor $129 or a monthly subscription from $99, cancel anytime. The ring is optional but carries most of the extra value.' },
    { criterionId: 'value', score: 7.5, note: 'From $99/month in the US — on par with Stelo, cheaper than Levels. Best value if you already own an Ultrahuman ring.' },
  ],
  pros: [
    'Glucose, HRV, sleep and recovery in one app with an Ultrahuman ring',
    'US version (M2 Live) is over-the-counter — no prescription since June 2026',
    'Monthly plan from $99, cancel anytime; single sensor available',
    'Cross-signal insights you cannot get from a CGM-only programme',
  ],
  cons: [
    'Most of the extra value needs an Ultrahuman ring — and Ring Air is no longer sold in the US (Ring Pro is)',
    '60-minute sensor warm-up (Dexcom G7: 30 minutes)',
    'Coaching is AI plus performance coaches — no dietitian or clinician',
    'US Lingo version is for adults 18+ not on insulin only',
  ],
  bestFor: 'Best for users already inside the Ultrahuman ecosystem who want glucose composed with HRV and sleep.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Ultrahuman product documentation and press releases, Abbott sensor validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 99, note: 'US (M2 Live, Abbott Lingo): subscription from $99/month or $129 for a single 14-day sensor; ring optional', asOf: '2026-10-01' },
  link: 'https://www.ultrahuman.com/cyborg/',
  linkType: 'official',
  content: `## Our verdict in short

Ultrahuman M1 is a continuous glucose monitor (CGM) programme that lives inside the Ultrahuman app, next to the data from Ultrahuman’s smart rings. That is its whole point: your glucose curve sits on the same timeline as HRV, sleep and recovery. If you own an Ultrahuman ring, it is the most integrated CGM option there is. If you only want glucose data, cheaper or simpler options are just as good.

**Important US update:** on 18 June 2026 Ultrahuman launched **M2 Live** in the US. It uses Abbott’s over-the-counter **Lingo** sensor, so you no longer need a prescription or medical consultation. Pricing starts at $99 per month on subscription, or $129 for a single sensor. Outside the US, M1 still runs on Abbott FreeStyle Libre sensors.

## How does Ultrahuman M1 work?

You stick a small sensor on the back of your upper arm. A tiny filament under the skin measures glucose in the fluid between cells (not blood) for about 14 days. Your phone reads the sensor and the Ultrahuman app shows how meals, exercise, stress and sleep move your glucose. With a ring, the app also links those curves to HRV, sleep stages and recovery — for example, whether a late heavy dinner shows up as worse sleep and lower next-morning HRV.

## What does the evidence say?

Abbott’s Libre-family sensors are well validated in people with diabetes (the sensor, not the M1 app or its scores, which have not been validated); the maker reports a mean absolute error of about 9% for Libre 3 against lab glucose (maker figures do not count as evidence in ONDA scores), and in an independent head-to-head study (Eichenlaub et al. 2025) Libre 3 and Dexcom G7 were similarly accurate. For people **without** diabetes, the evidence is weaker. Glucose in healthy people stays in a narrow range, and small rises after meals are normal. There is no strong proof yet that chasing flatter curves improves long-term health. A CGM is best used as a feedback tool for habits, not as a health verdict.

## How much does Ultrahuman M1 cost?

| Option | Price (US) | Notes |
|---|---|---|
| Ultrahuman M2 Live (Lingo) | from $99/month; $129 single sensor | no prescription, ring optional |
| [Stelo](/reviews/stelo) (Dexcom) | $99 for 2 sensors (~30 days) | no prescription, simple app |
| [Lingo](/reviews/lingo) (Abbott app) | from $54 per 2-week sensor | same sensor, Abbott’s own app |
| [Levels](/reviews/levels) | Core membership $399/year | CGM month + lab panels |

If you also want the ring, the [Ultrahuman Ring Pro](/reviews/ultrahuman-ring-pro) is $479 one-time. The older Ring Air is no longer sold in the US after Oura’s patent win — the CGM itself was not part of that ban.

## What are the downsides of Ultrahuman M1?

Almost all the differentiation depends on also owning an Ultrahuman ring. As a standalone CGM, it is an Abbott sensor with a competent app — Abbott’s own Lingo app is cheaper per sensor, and Dexcom-based Stelo is cheaper on subscription. Coaching is mostly AI. The US Lingo version is only for adults 18+ who do not use insulin.

## Who should buy Ultrahuman M1 — and who should not?

**Buy it** if you already own (or plan to buy) an Ultrahuman ring and want glucose, sleep and HRV in one place.

**Skip it** if you only want glucose data (see [Lingo vs Stelo vs Ultrahuman M1](/reviews/vs/lingo-vs-stelo-vs-ultrahuman-m1)), if you want a human dietitian, or if you have diabetes or use insulin — then use a medical CGM with your doctor.

## Safety notes

Consumer CGMs are not diagnostic devices. They cannot diagnose or rule out diabetes or prediabetes; if your numbers worry you, ask a doctor for an HbA1c or fasting glucose test. The adhesive can irritate skin; rotate arms and stop if you see a rash or signs of infection.

For more options, see [the best CGMs for biohackers in 2026](/reviews/compare/best-cgm-for-biohackers-2026) and [Levels vs Ultrahuman M1](/reviews/vs/levels-vs-ultrahuman-m1).

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [AI biomarker tracking](/articles/ai-biomarker-tracking-predictive) — CGM as the highest-density consumer biomarker stream available
- [Can you track cortisol continuously yet?](/articles/chm-continuous-hormone-monitoring) — why no consumer wearable measures hormones today, unlike glucose
- [The gut-brain axis as a data link](/articles/gut-brain-axis-data-link) — where microbiome and glucose patterns meet
`,
  references: [
    { label: 'Ultrahuman Cyborg / M1 — official site', url: 'https://www.ultrahuman.com/cyborg/' },
    { label: 'Ultrahuman press release: M2 Live launches in the US with Abbott’s Lingo CGM (18 June 2026)', url: 'https://cyborg.ultrahuman.com/press-releases/ultrahuman-launches-m2-live-abbotts-lingo' },
    { label: 'Alva et al. 2023 — Accuracy of the third generation of a 14-day continuous glucose monitoring system (FreeStyle Libre 3; Diabetes Ther)', url: 'https://doi.org/10.1007/s13300-023-01385-6' },
  ],
  relatedSlugs: ['ultrahuman-ring-air', 'levels', 'lingo', 'veri'],
  faq: [
    { q: "How accurate is the Ultrahuman M1 CGM?", a: "Ultrahuman M1 uses Abbott sensors: FreeStyle Libre outside the US and Abbott Lingo in the US via M2 Live. Both offer 14-day, calibration-free wear. It scores 8.5/10 on sensor accuracy, the same as Dexcom G7 programmes, because in an independent head-to-head study (Eichenlaub et al. 2025) Libre 3 and Dexcom G7 were similarly accurate. Its overall ONDA score is 7.5/10." },
    { q: "How much does Ultrahuman M1 cost?", a: "In the US, Ultrahuman’s CGM is now sold as M2 Live with Abbott’s Lingo sensor: a monthly subscription from $99 or $129 for a single 14-day sensor, no prescription needed (June 2026 pricing). The Ultrahuman ring is optional and sold separately; Ring Pro costs $479." },
    { q: "Is Ultrahuman M1 worth it as a standalone CGM?", a: "Ultrahuman M1 is best for users already inside the Ultrahuman ecosystem, not as a standalone CGM. Its differentiator is composing glucose with HRV, sleep and recovery on one timeline, which needs an Ultrahuman ring. Standalone, Lingo or Stelo give similar glucose data for the same or less money." },
    { q: "Is Ultrahuman M1 worth it?", a: "Yes, if you own an Ultrahuman ring and want glucose next to sleep and HRV in one app. For glucose alone it is not better than Stelo or Abbott’s own Lingo app, and for people without diabetes a CGM is a habit-feedback tool, not proof of better health." },
    { q: "Do you need a prescription for Ultrahuman M1 in the US?", a: "Not any more. Since 18 June 2026 Ultrahuman sells M2 Live in the US with Abbott’s over-the-counter Lingo sensor, for adults 18+ who are not on insulin. The earlier US M1 required a medical consultation." },
    { q: "Is Ultrahuman M1 affected by the US Ultrahuman ring ban?", a: "No. The 2025 US import ban came from Oura’s patent case and covered Ultrahuman’s rings, such as Ring Air. The CGM programme stayed on sale, and Ultrahuman returned to the US ring market in 2026 with Ring Pro." },
  ],

  datePublished: '2026-05-21',
  dateModified: '2026-10-10',
}

export default ultrahumanM1
