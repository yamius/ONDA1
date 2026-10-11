/**
 * EN copy of the per-category review hubs (/reviews/<category-url-slug>):
 * h1 + intro (page) and meta description (meta-inject). Translations live in
 * public/locales/<lang>/reviews.json#categoryHubs.<category-url-slug> (schema:
 * src/data/i18n-schema.ts `categoryHubs`).
 */
import type { ReviewCategory } from './types'

/** Per-category intro copy. Kept here rather than in i18n so each page has
 *  a category-specific, search-keyword-aware lead paragraph without forcing
 *  a translation round-trip for every category we add. */
export const CATEGORY_INTRO: Record<ReviewCategory, { h1: string; intro: string }> = {
  'hrv-wearable': {
    h1: 'HRV Tracker Reviews (2026)',
    intro:
      'Heart-rate variability is only as useful as the device measuring it. ONDA scored the most-searched HRV trackers of 2026 — rings, bands, smartwatches and chest straps — against the same rubric so the right pick is obvious from the trade-offs, not the marketing.',
  },
  'meditation-app': {
    h1: 'Meditation App Reviews (2026)',
    intro:
      'A meditation app is judged on the depth of the teaching, not the slickness of the interface. ONDA scored the most-used apps of 2026 against the same seven criteria — library, teaching quality, personalisation, free tier, evidence and value — so the right pick is obvious from the trade-offs.',
  },
  'sleep-app': {
    h1: 'Sleep App Reviews (2026)',
    intro:
      'A sleep app either measures sleep, helps you get it, or both. ONDA scored the most-used sleep apps of 2026 against the same rubric — tracking accuracy, wind-down content, sleep-science grounding, insights and value — so the right pick is obvious from your use case.',
  },
  'vagus-stim': {
    h1: 'Vagus Nerve Stimulator Reviews (2026)',
    intro:
      'The vagus-stimulator market mixes regulated medical devices, evidence-backed consumer hardware and wellness products whose mechanism barely touches the vagus nerve. ONDA scored the ten most credible devices of 2026 — auricular tVNS, cervical tVNS, vibrotactile, infrasonic and one implanted reference — so the field reads as one ordered list.',
  },
  cgm: {
    h1: 'CGM Reviews for Biohackers (2026)',
    intro:
      'The biohacker CGM market in 2026 is two sensors and ten wrappers. Eight of the ten programmes here ride on the same two pieces of hardware — Abbott Libre 3 or Dexcom G7 — and compete on what the software, coaching and ecosystem do with the data. ONDA scored all of them on the same six criteria so the trade-offs are explicit.',
  },
  'eeg-headset': {
    h1: 'EEG & Brain-Training Headset Reviews (2026)',
    intro:
      'The brain-training headset market splits across three modalities — EEG measurement, fNIRS prefrontal sensing and tDCS stimulation — plus clinical-prescribed and multi-modal-premium entries. ONDA scored the ten most credible devices of 2026 across all modalities against the same rubric, so the cross-modality trade-offs are explicit.',
  },
  'red-light': {
    h1: 'Red Light Therapy Panel Reviews (2026)',
    intro:
      'Red light therapy is one of the most marketing-noisy biohacker categories on the market — inflated irradiance claims, EMF and flicker hidden behind the spec sheet, premium pricing not always backed by the build. ONDA scored the ten most credible panels of 2026 against the same six axes, with independent irradiance measurement and EMF/flicker discipline carrying weight on purpose.',
  },
  'cold-plunge': {
    h1: 'Cold Plunge & Ice Bath Reviews (2026)',
    intro:
      'Cold plunge hardware went from niche to mainstream over 2023–2026, and the market split into three clean tiers: chiller-built premium tubs, mid-tier insulated tubs, and budget portable plunges. ONDA scored the ten most credible options of 2026 against the same six axes — with chiller capacity, build longevity and total cost of ownership carrying the rubric.',
  },
  sauna: {
    h1: 'Sauna Reviews: Infrared and Traditional (2026)',
    intro:
      'The home-sauna category divides cleanly across heat sources — full-spectrum IR, near-IR incandescent, traditional Finnish convection — and form factors from blanket to outdoor barrel. ONDA scored the ten most credible options of 2026 against the same six axes, with heat-source spectrum honesty and independently-measured EMF carrying weight on purpose.',
  },
  'sleep-climate': {
    h1: 'Smart Sleep Climate System Reviews (2026)',
    intro:
      'Bed-surface temperature regulation went from niche biohacker hardware to mainstream biohacker reference in 2024–2026, driven by Eight Sleep’s Pod and the long-running Sleepme (ChiliPad) lineage. ONDA scored the ten most credible smart sleep-climate systems of 2026 against the same six axes — climate range, build, app and tracking, form factor, subscription model and value.',
  },
  pemf: {
    h1: 'PEMF Device Reviews (2026)',
    intro:
      'Pulsed electromagnetic field hardware divides cleanly across three form factors — full-body mats (Bemer, Healthy Wave, HigherDOSE), localised coil systems (Pulse Centers, Curatron, iMRS) and the new wearable tier (Resona Health VIBE). ONDA scored the ten most-searched PEMF devices of 2026 against the same six axes — field strength, waveform research, build, programmability, form factor and value.',
  },
  'breathwork-app': {
    h1: 'Breathwork App Reviews (2026)',
    intro:
      'Breathwork went from niche somatic-therapy modality to mainstream nervous-system tool in 2024–2026, driven by the Stanford cyclic-sighing research and the Wim Hof / Othership crossover into recovery culture. ONDA scored the ten most credible breathwork apps of 2026 against the same six axes — session library, technique coverage, evidence grounding, app experience, biofeedback integration and value.',
  },
  'red-light-mask': {
    h1: 'Red Light Face Mask Reviews (2026)',
    intro:
      'Red light face masks in 2026 range from long-running light-therapy lines (Omnilux Contour, LightStim) and a dermatologist\'s brand (Dr. Dennis Gross SpectraLite) to consumer-brand premium devices (CurrentBody Series 2, HigherDOSE, TheraFace, Lumara Viso). Form factor is the second axis — flexible silicone vs hard shell vs handheld wand. ONDA scored the ten most credible masks of 2026 against the same six axes — irradiance, wavelength coverage, LED count and facial coverage, clinical evidence, comfort and value.',
  },
  'breathing-aid': {
    h1: 'Mouth Tape & Nasal Breathing Aid Reviews (2026)',
    intro:
      'Mouth taping and nasal-breathing hardware went mainstream in 2024–2026 driven by James Nestor\'s Breath, the Wim Hof breathing crossover and the Hostage Tape biohacker brand. The category splits across mouth tape (full-seal vs porous) and nasal dilators (external strips vs internal stents). ONDA scored the ten most credible products of 2026 against the same six axes — adhesion and comfort, breathing mechanism, evidence and safety, form factor, material safety and value.',
  },
  'massage-gun': {
    h1: 'Massage Gun Reviews (2026)',
    intro:
      'Percussion-therapy hardware split into clear tiers by 2026: premium reference brands (Therabody Theragun PRO Plus, Hyperice Hypervolt 2 Pro), mid-tier (Theragun Elite, Achedaway Pro), and credible budget alternatives that closed the spec gap meaningfully (Bob and Brad Q2 Mini, Renpho R3, OPOVE M3 Pro 2). ONDA scored the ten most credible massage guns of 2026 against the same six axes — stall force and amplitude, build and attachments, battery and noise, app features, ergonomics and value.',
  },
  'air-purifier': {
    h1: 'Air Purifier Reviews (2026)',
    intro:
      'Air purification went from allergy-niche product to biohacker-adjacent recovery hardware in 2024–2026, driven by wildfire-PM2.5 awareness and the indoor-air-quality crossover into sleep / longevity protocols. The category splits cleanly: clinical-tier HEPA references (IQAir, Molekule), consumer premium (Dyson, Coway Airmega, Blueair), mid-budget smart (Levoit, Winix), and entry budget (Levoit Core 300). ONDA scored the ten most credible air purifiers of 2026 against the same six axes — filtration technology, CADR and coverage, build and noise, smart features, maintenance cost and value.',
  },
}


/** Meta description per category hub. */
export const CATEGORY_META_DESCRIPTION: Partial<Record<ReviewCategory, string>> = {
  'hrv-wearable':
    'Independent ONDA reviews of HRV trackers — rings, bands, smartwatches and chest straps — scored on measurement accuracy, sleep, data access, wearability and value.',
  'meditation-app':
    'Independent ONDA reviews of meditation apps — scored on library, teaching quality, personalisation, free tier, evidence base and value.',
  'sleep-app':
    'Independent ONDA reviews of sleep apps — trackers and wind-down tools — scored on tracking accuracy, content, sleep-science grounding, insights and value.',
  'vagus-stim':
    'Independent ONDA reviews of vagus nerve stimulators — auricular and cervical tVNS, vibrotactile and infrasonic devices — scored on evidence, mechanism, protocols and value.',
  cgm:
    'Independent ONDA reviews of CGMs for biohackers — Levels, Nutrisense, Stelo, Lingo, Ultrahuman, Signos, Veri, Zoe and more — scored on insights, accuracy, coaching and value.',
  'eeg-headset':
    'Independent ONDA reviews of EEG and brain-training headsets — Muse, Neurosity Crown, Emotiv, Mendi, FocusCalm and more — scored on signal, content, openness and value.',
  'red-light':
    'Independent ONDA reviews of red light therapy panels — Joovv, Mito Red, PlatinumLED, GembaRed, Hooga and more — scored on irradiance, wavelength coverage, EMF and value.',
  'cold-plunge':
    'Independent ONDA reviews of cold plunge tubs and ice baths — Plunge, BlueCube, Ice Barrel, Cold Pod, Edge and more — scored on chiller capacity, build, filtration and value.',
  sauna:
    'Independent ONDA reviews of infrared and traditional saunas — Sunlighten, Clearlight, HigherDose, SaunaSpace, Therasage and more — scored on heat source, EMF, build and value.',
  'sleep-climate':
    'Independent ONDA reviews of smart sleep climate systems — Eight Sleep Pod, ChiliPad, BedJet, Sleepme, OOLER and more — scored on climate range, build, app and value.',
  pemf:
    'Independent ONDA reviews of PEMF devices — Bemer, Healthy Wave, Pulse Centers, Curatron, iMRS, OMI, EarthPulse and more — scored on field strength, waveform research, build and value.',
  'breathwork-app':
    'Independent ONDA reviews of breathwork apps — Breathwrk, Othership, SOMA Breath, Wim Hof Method, Open, Pause and more — scored on library, technique coverage, evidence and value.',
  'red-light-mask':
    'Independent ONDA reviews of red light face masks — Omnilux Contour, CurrentBody Series 2, Dr. Dennis Gross, Lumara Viso, TheraFace, HigherDOSE and more — scored on irradiance, wavelength, evidence and value.',
  'breathing-aid':
    'Independent ONDA reviews of mouth tape and nasal breathing aids — Hostage Tape, Somnifix, Dream Recovery, Intake Breathing, Mute, Breathe Right and more — scored on adhesion, mechanism, safety and value.',
  'massage-gun':
    'Independent ONDA reviews of massage guns — Theragun PRO Plus, Hypervolt 2 Pro, Theragun Elite, Achedaway, Bob and Brad, Renpho, OPOVE and more — scored on stall force, amplitude, build and value.',
  'air-purifier':
    'Independent ONDA reviews of air purifiers — IQAir, Molekule, Dyson, Coway Airmega, Blueair, Levoit, Winix, Honeywell and more — scored on filtration, CADR, noise and value.',
}
