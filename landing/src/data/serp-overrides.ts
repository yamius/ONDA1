/**
 * Hand-written SERP titles/descriptions for EN pages that already rank on
 * Google page 1 but get few clicks (GSC near_top, 2026-09-01..28). They replace
 * the generated title/description in meta-inject; everything else (schema,
 * canonical, OG image) stays generated. Keep titles <= 60 chars including the
 * " | ONDA Life" suffix, descriptions <= 155 chars, and every fact in sync with
 * the page itself (price, score, verdict). Re-check against GSC after ~4 weeks.
 */
export const SERP_OVERRIDES: Record<string, { title?: string; description?: string }> = {
  // --- CGM reviews ---
  '/reviews/lingo': {
    title: 'Lingo Review 2026: $54 CGM, No Prescription | ONDA Life',
    description:
      'Abbott’s over-the-counter CGM on Libre 3 hardware: $54 per 2-week sensor, no prescription needed. Who Lingo suits, its limits, and how it compares with Stelo.',
  },
  '/reviews/levels': {
    title: 'Levels Review 2026: New Plans, Worth It? | ONDA Life',
    description:
      'Levels now sells tiered memberships, from an app-only plan to yearly plans with CGM and lab tests. What each plan includes, who it suits, cheaper options.',
  },
  '/reviews/stelo': {
    title: 'Stelo Review 2026: Dexcom CGM, No Prescription | ONDA Life',
    description:
      'Stelo puts Dexcom G7 hardware in an over-the-counter CGM for non-diabetics: $99 for about 30 days. Accuracy, app limits and how it compares with Lingo.',
  },
  // --- breathing apps ---
  '/reviews/breathe-to-relax': {
    title: 'Breathe2Relax Review: Free App, Worth It? | ONDA Life',
    description:
      'A completely free breathing app built by US military telehealth for stress and PTSD. Strong clinical roots, dated design. Our verdict and better options.',
  },
  '/reviews/prana-breath': {
    title: 'Prana Breath Review 2026: Pros, Cons, Price | ONDA Life',
    description:
      'The most customisable pattern-based breathing app: mostly free, $10 one-time premium, Android-first. What it does well, where it feels dated, alternatives.',
  },
  '/compare/apps-combining-breathing-hrv-realtime-feedback': {
    title: 'Best Breathing Apps With Live HRV Feedback | ONDA Life',
    description:
      'Most apps either guide your breathing or read your HRV. These do both and show the feedback live. Ranked with honest pros and cons, including free options.',
  },
  // --- wearables ---
  '/reviews/ultrahuman-ring-air': {
    title: 'Ultrahuman Ring Air Review: Battery, US Ban | ONDA Life',
    description:
      'A light, subscription-free smart ring with good sleep tracking, but widespread battery failure reports and no longer sold in the US. What to buy instead.',
  },
  '/reviews/vs/apple-watch-series-12-vs-whoop-5-0': {
    title: 'Apple Watch 12 vs Whoop 5.0: Which Is Better? | ONDA Life',
    description:
      'No-subscription smartwatch vs subscription-only recovery band. We compare HRV accuracy, sleep, recovery scores, battery and total cost to help you choose.',
  },
  '/reviews/vs/apple-watch-series-12-vs-oura-ring-4': {
    title: 'Apple Watch 12 vs Oura Ring 4: Which to Buy? | ONDA Life',
    description:
      'Watch or ring? Apple Watch Series 12 vs Oura Ring 4 for HRV, sleep, recovery, comfort, battery and subscription cost, compared point by point.',
  },
  '/reviews/vs/whoop-5-0-vs-garmin-venu-4': {
    title: 'Whoop 5.0 vs Garmin Venu 4: Which Is Better? | ONDA Life',
    description:
      'Subscription recovery coach vs do-everything training watch. HRV, sleep, training load, battery and total cost compared, and who should pick which.',
  },
  '/reviews/vs/whoop-5-0-vs-polar-h10': {
    title: 'Whoop 5.0 vs Polar H10: HRV Accuracy Compared | ONDA Life',
    description:
      'A 24/7 recovery band vs the ECG chest strap used as a research reference. Which gives better HRV data, when each makes sense, and total cost.',
  },
  '/reviews/vs/oura-ring-4-vs-whoop-5-0-vs-garmin-venu-4': {
    title: 'Oura vs Whoop vs Garmin (2026): Which to Buy? | ONDA Life',
    description:
      'Ring, recovery band or training watch? Oura Ring 4, Whoop 5.0 and Garmin Venu 4 compared on HRV, sleep, battery, subscription and who each one suits.',
  },
  '/reviews/vs/apple-watch-series-11-vs-fitbit-charge-6': {
    title: 'Apple Watch 11 vs Fitbit Charge 6: Which? | ONDA Life',
    description:
      'Premium smartwatch vs budget fitness tracker. HRV, sleep, heart-rate accuracy, battery and price compared, and when the cheaper Fitbit is enough.',
  },
  '/reviews/vs/amazfit-helio-ring-vs-ringconn-gen-2': {
    title: 'Amazfit Helio vs RingConn Gen 2 Rings | ONDA Life',
    description:
      'Two budget smart rings with no subscription. Price, battery life, sizing, sleep and HRV tracking compared, and which one we would buy.',
  },
  // --- neurotech, light, recovery ---
  '/reviews/neurosity-crown': {
    title: 'Neurosity Crown Review 2026: Is It Worth $1,499? | ONDA Life',
    description:
      'An 8-electrode EEG headset with an open SDK and raw data, no subscription. What it does for focus, who it suits, and cheaper EEG alternatives.',
  },
  '/reviews/sens-ai': {
    title: 'Sens.ai Review 2026: Is It Worth $1,250? | ONDA Life',
    description:
      'Sens.ai combines EEG neurofeedback, photobiomodulation and HRV training in one $1,250 headset plus a membership. What the evidence says and who it suits.',
  },
  '/reviews/omnilux-contour-face': {
    title: 'Omnilux Contour Face Review 2026: Worth $395? | ONDA Life',
    description:
      'The flexible red light mask with the strongest dermatology evidence. Results to expect, how to use it, price and cheaper alternatives.',
  },
  '/reviews/kineon-move-plus': {
    title: 'Kineon Move+ Review 2026: Red Light for Joints | ONDA Life',
    description:
      'A $499 wrap-around laser and LED device for knees, elbows and other joints. What the evidence shows, how to use it and how it compares with panels.',
  },
  '/reviews/resona-health-vibe': {
    title: 'Resona Health VIBE Review: Worth $299? | ONDA Life',
    description:
      'A wearable PEMF device with 130+ built-in programmes, no app and no mat to set up, for $299. What PEMF can and cannot do, pros, cons and alternatives.',
  },
  '/reviews/hypervolt-3-pro': {
    title: 'Hypervolt 3 Pro Review: vs Theragun (2026) | ONDA Life',
    description:
      'Hyperice’s 2026 flagship: 70 lbs stall force, quieter motor, 4-hour battery, $349. How it compares with Theragun PRO Plus and the Hypervolt 2 Pro.',
  },
  '/reviews/compare/best-massage-guns-2026': {
    title: 'Best Massage Guns 2026: Ranked and Compared | ONDA Life',
    description:
      'Hypervolt 3 Pro, Theragun PRO Plus, Theragun Elite and budget picks ranked on power, noise, battery and price, with who each massage gun suits.',
  },
  // --- 3-way duels whose generated titles collided with the 2-way pages ---
  "/reviews/vs/joovv-solo-3-vs-mito-red-mitopro-1500-vs-platinumled-biomax-600": {
    title: "Joovv vs Mito Red vs PlatinumLED BioMax | ONDA Life",
  },
  "/reviews/vs/theragun-pro-plus-vs-hypervolt-2-pro-vs-achedaway-pro": {
    title: "Theragun vs Hypervolt vs Achedaway Pro | ONDA Life",
  },
}
