/**
 * The four v1 tools of the ONDA ChatGPT app. Each tool is pure: arguments in,
 * { structuredContent, text } out. Nothing about the user is stored or logged.
 *
 * Facts come only from generated site data (see landing/scripts/export-chatgpt-data.ts):
 * HRV distribution (Natarajan 2020, Fitbit users), breathing patterns, adaptive practices and reviews. Bridge wording
 * follows landing/docs/onda-facts-source-of-truth.md — no numeric pacer claim,
 * HRV + personal baseline need Apple Watch, the camera pulse works on any iPhone.
 */
import { readFileSync } from 'node:fs';
import { interpretHrvBoth, HRV_AGE_POINTS, HRV_VERDICT_TEXT, HRV_POSITION_TEXT, HRV_COMPARISON_DISCLAIMER, HRV_DEVICE_NOTE, HRV_NO_COMPARISON_NOTE } from './generated/hrv-norms.js';
import { BREATHING_PATTERNS } from './generated/breathing.js';
import { appStoreUrl, siteUrl } from './links.js';

// Literal paths so Vercel's file tracing bundles the data with the function.
const REVIEWS = JSON.parse(readFileSync(new URL('../data/reviews.json', import.meta.url), 'utf8'));
const PRACTICES = JSON.parse(readFileSync(new URL('../data/practices.json', import.meta.url), 'utf8'));

export const URGENT_MESSAGE =
  'Chest pain, fainting or severe shortness of breath need medical attention now — call your local emergency number or see a doctor urgently. An HRV number cannot tell you whether these symptoms are serious.';

export const SAFETY_NOTE =
  'Not medical advice. If you have chest pain, fainting, severe shortness of breath or a racing heart that does not settle, contact emergency services or a doctor now.';

/** Validation error whose message is safe to show (never contains the input values). */
export class InputError extends Error {}

// Pure computations over bundled site data: read-only, same input → same output, no outside calls.
const annotations = (title) => ({ title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false });

// ───────────────────────────────────────────────────────────── check_hrv ───

const DEVICE_METRIC = {
  apple_watch: 'sdnn',
  oura: 'rmssd',
  whoop: 'rmssd',
  garmin: 'rmssd',
  fitbit: 'rmssd',
  polar: 'rmssd',
  other: 'rmssd',
};

const SEXES = ['female', 'male', 'prefer_not_to_say'];
const GROUP = { female: 'Fitbit women', male: 'Fitbit men' };
const SOURCE_NOTE =
  'Natarajan A et al. Lancet Digital Health 2020 (Supplementary Table S3): RMSSD between 6 and 7 a.m. among about 8 million Fitbit users (wrist sensor, one day, self-reported age and sex). Three of four authors were Fitbit employees and Fitbit funded the study.';
const SDNN_MESSAGE =
  'Apple Watch reports SDNN, a different measure from RMSSD. The published distribution used here is for RMSSD only, so an SDNN value is not compared and gets no verdict. Compare your weekly average with your own baseline instead.';

function ageNote(age, point) {
  if (age < HRV_AGE_POINTS[0].minAge) return `The data start at age 20, so you are compared with ages ${point.label}.`;
  if (age > HRV_AGE_POINTS[HRV_AGE_POINTS.length - 1].maxAge) return `The data end at age 61, so you are compared with ages ${point.label}.`;
  return `Nearest age group in the data: ${point.label} (no estimate between groups).`;
}

const groupLine = (r) =>
  `${GROUP[r.sex]} aged ${r.point.label}: middle half ${r.ref.p25}–${r.ref.p75} ms, median ${r.ref.p50} ms (RMSSD, 6–7 a.m.)`;

export const checkHrv = {
  name: 'check_hrv',
  title: 'Compare HRV with Fitbit users your age',
  widget: 'hrv',
  description:
    "ONDA Life — HRV by age: compares one heart rate variability (RMSSD) value with a published distribution from one wearable's users (Natarajan 2020, about 8 million Fitbit users, morning RMSSD by age and sex). " +
    "It is a comparison, not a medical norm: it says whether the value is lower than most, within the middle half, or higher than most users of the nearest age group (ages 20–61 in the data: 18–19 is compared with 20–21 and 62–64 with 60–61; above 64 no comparison is made and the 60–61 distribution is shown for information only). The distribution comes from Fitbit wrist data, so for other devices the comparison is approximate. " +
    "Oura, Whoop, Garmin, Fitbit and Polar report RMSSD and are compared; Apple Watch reports SDNN, a different measure that is not compared. Sex is optional; without it the value is shown against both women and men. " +
    "Use for: is my HRV normal for my age; good HRV for my age; Oura or Whoop HRV score; heart rate variability by age; Apple Watch HRV meaning. " +
    "The optional red_flag_symptoms flag covers only acute symptoms: chest pain or pressure; fainting or nearly fainting; severe shortness of breath; " +
    "a racing, pounding or irregular heartbeat that does not settle at rest; new confusion, weakness on one side or trouble speaking. " +
    "When the flag is true the tool returns urgent-care guidance only and no interpretation. It does not apply to ordinary questions about sleep, stress, tiredness, training or a low value on its own.",
  inputSchema: {
    type: 'object',
    properties: {
      age: { type: 'integer', minimum: 18, maximum: 100, description: 'Age in years (18+).' },
      hrv_ms: { type: 'number', minimum: 3, maximum: 300, description: 'HRV value in milliseconds.' },
      device: {
        type: 'string',
        enum: Object.keys(DEVICE_METRIC),
        description: 'Where the value comes from; "other" for any other RMSSD source. Apple Watch values (SDNN) are not compared.',
      },
      sex: {
        type: 'string',
        enum: SEXES,
        description: 'Optional. "prefer_not_to_say" or omitted: the value is shown against both women and men, without a single verdict.',
      },
      red_flag_symptoms: {
        type: 'boolean',
        description:
          'Whether the person reported one of the acute symptoms listed in the tool description (chest pain or pressure, fainting, severe shortness of breath, a racing or irregular heartbeat that does not settle, new confusion, one-sided weakness or trouble speaking). When true, the tool returns urgent-care guidance only. Defaults to false.',
      },
    },
    required: ['age', 'hrv_ms', 'device'],
    additionalProperties: false,
  },
  outputSchema: {"type":"object","description":"Either the HRV comparison, or { urgent: true, message } when red_flag_symptoms is true.","properties":{"urgent":{"type":"boolean"},"message":{"type":"string"},"age":{"type":"number"},"value":{"type":"number"},"metric":{"type":"string","enum":["SDNN","RMSSD"]},"device":{"type":"string"},"sex":{"type":"string"},"compared":{"type":"boolean"},"ageGroup":{"type":"string"},"ageNote":{"type":"string"},"deviceNote":{"type":"string"},"comparisons":{"type":"array","items":{"type":"object","properties":{"group":{"type":"string"},"sex":{"type":"string"},"p25":{"type":"number"},"p50":{"type":"number"},"p75":{"type":"number"},"verdict":{"type":"string","enum":["lower","middle","higher"]},"verdictText":{"type":"string"}},"required":[]}},"verdict":{"type":"string","enum":["lower","middle","higher"]},"verdictText":{"type":"string"},"disclaimer":{"type":"string"},"metricNote":{"type":"string"},"source":{"type":"string"},"bridge":{"type":"object","properties":{"text":{"type":"string"},"url":{"type":"string"}},"required":["url"]},"learnMore":{"type":"string"},"safety":{"type":"string"}}},
  annotations: annotations('Compare HRV with Fitbit users your age'),
  invoking: 'Comparing HRV…',
  invoked: 'HRV compared',
  run({ age, hrv_ms, device, sex, red_flag_symptoms }) {
    if (red_flag_symptoms === true || red_flag_symptoms === 'true') {
      return {
        structuredContent: { urgent: true, message: URGENT_MESSAGE },
        text: URGENT_MESSAGE + ' Do not interpret the HRV number in this situation.',
      };
    }
    if (!DEVICE_METRIC[device]) {
      throw new InputError('Invalid input: device must be one of apple_watch, oura, whoop, garmin, fitbit, polar or other.');
    }
    if (sex != null && !SEXES.includes(sex)) {
      throw new InputError('Invalid input: sex must be female, male or prefer_not_to_say.');
    }
    const metric = DEVICE_METRIC[device];
    const value = Math.round(Number(hrv_ms));
    if (!(Number(age) >= 18 && Number(age) <= 100) || !(value >= 3 && value <= 300)) {
      throw new InputError('Invalid input: age must be a whole number from 18 to 100, and hrv_ms a value from 3 to 300 milliseconds.');
    }
    const a = Number(age);
    const base = {
      age: a,
      value,
      metric: metric.toUpperCase(),
      device,
      sex: sex || 'prefer_not_to_say',
      bridge: {
        text: 'ONDA builds your personal norm from your Apple Watch history and checks your HRV against it every day.',
        url: appStoreUrl('chatgpt_hrv'),
      },
      learnMore: siteUrl('/tools/hrv', 'chatgpt_hrv'),
      safety: SAFETY_NOTE,
    };
    if (metric === 'sdnn') {
      const out = { ...base, compared: false, metricNote: SDNN_MESSAGE, disclaimer: HRV_COMPARISON_DISCLAIMER };
      return { structuredContent: out, text: `${value} ms (SDNN, Apple Watch) at age ${a}: not compared. ${SDNN_MESSAGE}` };
    }
    const both = interpretHrvBoth(a, value);
    const single = sex === 'female' || sex === 'male' ? both[sex] : null;
    const point = both.female.point;
    const list = single ? [single] : [both.female, both.male];
    if (!both.female.compared) {
      // Above HRV_MAX_COMPARED_AGE: no verdict; the oldest group is shown for information only.
      const out = {
        ...base,
        compared: false,
        ageGroup: point.label,
        ageNote: HRV_NO_COMPARISON_NOTE,
        comparisons: list.map((r) => ({ group: `${GROUP[r.sex]} aged ${r.point.label} (for information only)`, sex: r.sex, p25: r.ref.p25, p50: r.ref.p50, p75: r.ref.p75 })),
        deviceNote: HRV_DEVICE_NOTE,
        disclaimer: HRV_COMPARISON_DISCLAIMER,
        source: SOURCE_NOTE,
      };
      const text = `${value} ms RMSSD at age ${a}: no verdict. ${HRV_NO_COMPARISON_NOTE} For information only: ${list.map(groupLine).join('; ')}. ${HRV_DEVICE_NOTE} ${HRV_COMPARISON_DISCLAIMER}`;
      return { structuredContent: out, text };
    }
    const comparisons = list.map((r) => ({
      group: `${GROUP[r.sex]} aged ${r.point.label}`,
      sex: r.sex,
      p25: r.ref.p25,
      p50: r.ref.p50,
      p75: r.ref.p75,
      verdict: r.verdict,
      verdictText: single ? HRV_VERDICT_TEXT[r.verdict] : `Your value is ${HRV_POSITION_TEXT[r.verdict]}`,
    }));
    const out = {
      ...base,
      compared: true,
      ageGroup: point.label,
      ageNote: ageNote(a, point),
      comparisons,
      ...(single ? { verdict: single.verdict, verdictText: HRV_VERDICT_TEXT[single.verdict] } : {}),
      deviceNote: HRV_DEVICE_NOTE,
      disclaimer: HRV_COMPARISON_DISCLAIMER,
      metricNote: 'Morning RMSSD from a wrist sensor. Other devices and other times of day give different numbers.',
      source: SOURCE_NOTE,
    };
    const text = single
      ? `${value} ms RMSSD at age ${a}: ${HRV_VERDICT_TEXT[single.verdict]}. Compared with ${groupLine(single)}. ${out.ageNote} ${HRV_DEVICE_NOTE} ${HRV_COMPARISON_DISCLAIMER}`
      : `${value} ms RMSSD at age ${a} (sex not given, so no single verdict). Compared with ${groupLine(both.female)}: ${HRV_POSITION_TEXT[both.female.verdict]}. Compared with ${groupLine(both.male)}: ${HRV_POSITION_TEXT[both.male.verdict]}. ${out.ageNote} ${HRV_DEVICE_NOTE} ${HRV_COMPARISON_DISCLAIMER}`;
    return { structuredContent: out, text };
  },
};

// ─────────────────────────────────────────────────────────── breathe_now ───

const TECHNIQUES = {
  coherent: { name: 'Slow, even breathing', how: 'Breathe in for about 5.5 seconds and out for about 5.5 seconds, softly through the nose.', goodFor: 'everyday calm and a steady heart rhythm' },
  '478': { name: '4-7-8 breathing', how: 'In for 4, hold for 7, out for 8 through the mouth.', goodFor: 'winding down before sleep' },
  box: { name: 'Box breathing', how: 'In 4, hold 4, out 4, hold 4.', goodFor: 'staying composed under pressure' },
  sigh: { name: 'Physiological sigh', how: 'A full inhale through the nose, a short top-up inhale, then a long slow exhale.', goodFor: 'a fast reset when you feel tense' },
  calming: { name: 'Longer exhale', how: 'In for 4, out for 6.', goodFor: 'easing nerves before a meeting or a call' },
};

export const breatheNow = {
  name: 'breathe_now',
  title: 'Breathe now',
  widget: 'breathe',
  description:
    "ONDA Life — guided breathing: shows a live animated breathing guide with a timer in the conversation. " +
    "Techniques: coherent (slow, even breathing; default), 478 (4-7-8, often used before sleep), box, sigh (physiological sigh, a quick reset), calming (longer exhale). " +
    "Use for: breathing exercise to calm down; can’t sleep; feeling anxious or nervous before a meeting; 4-7-8 breathing; box breathing; physiological sigh; a quick way to relax. " +
    "A relaxation exercise, not a treatment for breathlessness caused by illness.",
  inputSchema: {
    type: 'object',
    properties: {
      technique: { type: 'string', enum: Object.keys(TECHNIQUES), description: 'Breathing technique. Default: coherent.' },
      minutes: { type: 'integer', minimum: 1, maximum: 10, description: 'Session length. Default 3.' },
    },
    additionalProperties: false,
  },
  outputSchema: {"type":"object","properties":{"technique":{"type":"string"},"name":{"type":"string"},"how":{"type":"string"},"goodFor":{"type":"string"},"minutes":{"type":"number"},"phases":{"type":"array","items":{"type":"object","properties":{"kind":{"type":"string","enum":["in","topup","hold","out"]},"seconds":{"type":"number"},"scale":{"type":"number"}},"required":[]}},"caution":{"type":"string"},"bridge":{"type":"object","properties":{"text":{"type":"string"},"url":{"type":"string"}},"required":["url"]},"learnMore":{"type":"string"}},"required":["technique","name","minutes","phases"]},
  annotations: annotations('Breathe now'),
  invoking: 'Preparing a breathing guide…',
  invoked: 'Breathing guide ready',
  run({ technique = 'coherent', minutes = 3 } = {}) {
    const id = TECHNIQUES[String(technique)] ? String(technique) : 'coherent';
    const pattern = BREATHING_PATTERNS.find((p) => p.id === id);
    const m = Math.min(10, Math.max(1, Math.round(Number(minutes) || 3)));
    const t = TECHNIQUES[id];
    const out = {
      technique: id,
      name: t.name,
      how: t.how,
      goodFor: t.goodFor,
      minutes: m,
      phases: pattern.phases,
      caution:
        id === '478' || id === 'box'
          ? 'Skip the breath holds if you are pregnant, have a heart or lung condition, or feel dizzy — just breathe in and out slowly.'
          : 'If you feel dizzy, stop and breathe normally.',
      bridge: {
        text: 'In ONDA you breathe with a guided practice and see your pulse before and after — with just the iPhone camera, or with Apple Watch.',
        url: appStoreUrl('chatgpt_breathe'),
      },
      learnMore: siteUrl(`/tools/breathing?p=${id}`, 'chatgpt_breathe'),
    };
    return { structuredContent: out, text: `${t.name} for ${m} min. ${t.how}` };
  },
};

// ─────────────────────────────────────────────────────────── find_practice ───

const EXPERIENCE_LEVELS = { beginner: 0, occasional: 1, regular: 2 };
const SETTING_FIT = {
  // what the person can do right now → which practice settings are fine
  sitting: ['anywhere', 'sitting'],
  lying: ['anywhere', 'lying', 'sitting'],
  standing: ['anywhere', 'standing', 'sitting'],
  moving: ['anywhere', 'moving', 'standing'],
};

export const findPractice = {
  name: 'find_practice',
  title: 'Find an ONDA practice',
  widget: 'practice',
  description:
    "ONDA Life — short guided practices: suggests 1–3 free 6-minute practices matched to a goal (calm, sleep, focus or energy), experience and position; each can be played free in the browser. " +
    "Use for: how to start meditating; short meditation for beginners; something to help me sleep; a quick practice for stress or anxiety; focus before work; an energy boost when tired; mindfulness exercise.",
  inputSchema: {
    type: 'object',
    properties: {
      goal: { type: 'string', enum: ['calm', 'sleep', 'focus', 'energy'], description: 'What the person wants.' },
      minutes: { type: 'integer', minimum: 1, maximum: 60, description: 'Time available, if mentioned.' },
      experience: { type: 'string', enum: Object.keys(EXPERIENCE_LEVELS), description: 'Meditation experience, if mentioned.' },
      position: { type: 'string', enum: Object.keys(SETTING_FIT), description: 'How they can practise right now (e.g. lying in bed), if mentioned.' },
    },
    required: ['goal'],
    additionalProperties: false,
  },
  outputSchema: {"type":"object","properties":{"goal":{"type":"string"},"practices":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"emoji":{"type":"string"},"minutes":{"type":"number"},"why":{"type":"string"},"firstSteps":{"type":"array","items":{"type":"string"}},"position":{"type":"string"},"playUrl":{"type":"string"}},"required":[]}},"timeNote":{"type":["string","null"]},"tryFree":{"type":"object","properties":{"text":{"type":"string"},"url":{"type":"string"}},"required":["url"]},"bridge":{"type":"object","properties":{"button":{"type":"string"},"text":{"type":"string"},"url":{"type":"string"}},"required":[]}},"required":["goal","practices"]},
  annotations: annotations('Find an ONDA practice'),
  invoking: 'Finding a practice…',
  invoked: 'Practices found',
  run({ goal, minutes, experience = 'beginner', position } = {}) {
    if (!['calm', 'sleep', 'focus', 'energy'].includes(goal)) {
      throw new InputError('Invalid input: goal is required and must be one of calm, sleep, focus or energy.');
    }
    if (position !== undefined && !SETTING_FIT[position]) {
      throw new InputError('Invalid input: position must be one of sitting, lying, standing or moving.');
    }
    const exp = EXPERIENCE_LEVELS[experience] ?? 0;
    const okSettings = position ? SETTING_FIT[position] : null;
    const ranked = PRACTICES.practices
      .map((p) => {
        const gi = p.goals.indexOf(goal);
        if (gi === -1) return null;
        if (okSettings && !okSettings.includes(p.setting)) return null;
        let score = gi === 0 ? 10 : 6;
        score -= Math.max(0, EXPERIENCE_LEVELS[p.level] - exp) * 3;
        return { p, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.p.id.localeCompare(b.p.id))
      .slice(0, 3)
      .map(({ p }) => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        minutes: p.minutes,
        why: p.line,
        firstSteps: p.firstSteps,
        position: p.setting,
        playUrl: siteUrl(`/emoton?practice=${p.id}`, 'chatgpt_practice'),
      }));
    const tryUrl = siteUrl('/emoton', 'chatgpt_practice');
    const out = {
      goal,
      practices: ranked,
      timeNote: minutes && minutes < 6 ? 'These practices take about 6 minutes — the first steps work as a shorter version.' : null,
      tryFree: { text: 'Try free now in the browser', url: tryUrl },
      bridge: {
        button: 'Full version with pulse — App Store',
        text: 'In the app the same practice shows your pulse before and after, and ONDA picks the next one for how you feel.',
        url: appStoreUrl('chatgpt_practice'),
      },
    };
    const names = ranked.map((r) => `${r.name} (${r.minutes} min)`).join(', ');
    return {
      structuredContent: out,
      text: ranked.length ? `For ${goal}: ${names}. Free to play at ${tryUrl}` : `No practice in ONDA’s free set matches that combination.`,
    };
  },
};

// ───────────────────────────────────────────────────────────────── compare ───

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const tokens = (s) => norm(s).split(' ').filter(Boolean);

/** Reviews a free-text product name can mean, best first: only those with the
 *  highest share of the query's words (at least half), then tightest fit, then newest. */
function reviewCandidates(query) {
  const q = tokens(query).filter((t) => !['the', 'app', 'vs'].includes(t));
  if (!q.length) return [];
  const hits = [];
  for (const r of REVIEWS.reviews) {
    const hay = new Set([...tokens(r.name), ...tokens(r.slug), ...tokens(r.brand)]);
    const hit = q.filter((t) => hay.has(t)).length;
    if (hit) hits.push({ r, key: [hit / q.length, hit / hay.size, r.dateModified] });
  }
  const top = Math.max(0, ...hits.map((h) => h.key[0]));
  if (top < 0.5) return [];
  return hits
    .filter((h) => h.key[0] === top)
    .sort((a, b) => b.key[1] - a.key[1] || (b.key[2] > a.key[2] ? 1 : b.key[2] < a.key[2] ? -1 : 0))
    .map((h) => h.r);
}

/** Best review for a free-text product name, or null. */
export function matchReview(query) {
  return reviewCandidates(query)[0] ?? null;
}

const permutations = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p])));

/** When a name is ambiguous ("HigherDOSE" is a face mask and a PEMF mat), prefer the
 *  reading that is one of ONDA's head-to-head pages; fewest steps from each best match wins. */
function pickDuelReading(cands) {
  const present = cands.map((c, i) => (c.length ? i : -1)).filter((i) => i >= 0);
  if (present.length < 2) return null;
  let best = null;
  for (const h of REVIEWS.headToHeads) {
    if (h.products.length !== present.length) continue;
    for (const order of permutations(h.products)) {
      const ranks = order.map((slug, k) => cands[present[k]].findIndex((r) => r.slug === slug));
      if (ranks.some((x) => x < 0)) continue;
      const cost = ranks.reduce((a, b) => a + b, 0);
      if (!best || cost < best.cost) best = { cost, picks: present.map((i, k) => [i, cands[i][ranks[k]]]) };
    }
  }
  if (!best) return null;
  const out = cands.map((c) => c[0] ?? null);
  for (const [i, r] of best.picks) out[i] = r;
  return out;
}

const PRIORITY_CRITERIA = {
  hrv: ['hrv-accuracy', 'sensor', 'biofeedback'],
  sleep: ['sleep-accuracy', 'tracking-accuracy'],
  price: ['value', 'free-tier', 'subscription'],
  battery: ['wearability', 'battery-noise'],
  content: ['content-library', 'session-library', 'teaching'],
};

export const compare = {
  name: 'compare',
  title: 'Compare devices or apps',
  widget: 'compare',
  description:
    "ONDA Life — wearable and wellness-app comparisons: puts 2–3 products side by side from ONDA’s editorial reviews (onda-life.com/reviews): " +
    "price, subscription, which HRV metric they report, score, verdict and a link to the full review. " +
    "Covers HRV wearables (Oura, Whoop, Apple Watch, Garmin, Polar, smart rings), meditation, sleep and breathwork apps, CGMs, EEG headsets, red light, saunas, cold plunges and more. " +
    "Use for: Oura vs Whoop; which smart ring to buy; Apple Watch or Garmin for HRV; best HRV tracker; Calm or Headspace; which meditation app; compare sleep trackers. " +
    "Products without an ONDA review are listed as not reviewed.",
  inputSchema: {
    type: 'object',
    properties: {
      products: {
        type: 'array',
        items: { type: 'string' },
        minItems: 2,
        maxItems: 3,
        description: 'Product names as the person wrote them, e.g. ["Oura Ring 4", "Whoop 5.0"].',
      },
      priority: { type: 'string', enum: Object.keys(PRIORITY_CRITERIA), description: 'What matters most to the person, if said.' },
    },
    required: ['products'],
    additionalProperties: false,
  },
  outputSchema: {"type":"object","properties":{"products":{"type":"array","items":{"type":"object","properties":{"slug":{"type":"string"},"name":{"type":"string"},"type":{"type":"string"},"priceUsd":{"type":["number","null"]},"priceNote":{"type":["string","null"]},"priceAsOf":{"type":["string","null"]},"score":{"type":"number"},"hrvMetric":{"type":["string","null"]},"verdict":{"type":"string"},"bestFor":{"type":"string"},"pros":{"type":"array","items":{"type":"string"}},"cons":{"type":"array","items":{"type":"string"}},"focus":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"score":{"type":"number"},"note":{"type":"string"}},"required":[]}},"worksWithOnda":{"type":"string","enum":["yes","partly","not-a-device"]},"worksWithOndaNote":{"type":["string","null"]},"reviewUrl":{"type":"string"},"assessed":{"type":"string"}},"required":[]}},"duel":{"type":["object","null"],"properties":{"title":{"type":"string"},"verdict":{"type":"string"},"winner":{"type":["string","null"]},"winnerStatus":{"type":"string","enum":["winner","practically-equal","depends-on-the-job"]},"label":{"type":"string"},"onda_scores":{"type":"object"},"axes":{"type":"array"},"url":{"type":"string"}},"required":["winner","winnerStatus","label","onda_scores"]},"notFound":{"type":"array","items":{"type":"string"}},"ownProductNote":{"type":["string","null"]},"bridge":{"type":["object","null"]},"source":{"type":"string"}},"required":["products","notFound"]},
  annotations: annotations('Compare devices or apps'),
  invoking: 'Pulling ONDA reviews…',
  invoked: 'Comparison ready',
  run({ products = [], priority } = {}) {
    if (!Array.isArray(products) || products.length < 2 || products.length > 3 || !products.every((p) => typeof p === 'string' && p.trim())) {
      throw new InputError('Invalid input: products must be a list of 2 or 3 product names, e.g. ["Oura Ring 4", "Whoop 5.0"].');
    }
    if (priority !== undefined && !PRIORITY_CRITERIA[priority]) {
      throw new InputError('Invalid input: priority must be one of hrv, sleep, price, battery or content.');
    }
    const asked = products.slice(0, 3);
    const ownProduct = asked.some((p) => /\bonda\b/i.test(p));
    const found = [];
    const missing = [];
    const names = asked.filter((name) => !/\bonda\b/i.test(name));
    const cands = names.map(reviewCandidates);
    const picked = pickDuelReading(cands) ?? cands.map((c) => c[0] ?? null);
    names.forEach((name, i) => {
      const r = picked[i];
      if (r && !found.some((f) => f.slug === r.slug)) found.push(r);
      else if (!r) missing.push(name);
    });
    const key = found.map((r) => r.slug).sort().join('|');
    const duel = REVIEWS.headToHeads.find((h) => [...h.products].sort().join('|') === key) ?? null;
    const focus = priority ? PRIORITY_CRITERIA[priority] : null;

    const rows = found.map((r) => ({
      slug: r.slug,
      name: r.name,
      type: r.productType,
      priceUsd: r.priceUsd,
      priceNote: r.priceNote,
      priceAsOf: r.priceAsOf,
      score: r.score,
      hrvMetric: r.hrvMetric,
      verdict: r.verdict,
      bestFor: r.bestFor,
      pros: r.pros.slice(0, 2),
      cons: r.cons.slice(0, 2),
      focus: focus ? r.scores.filter((s) => focus.includes(s.id)) : [],
      worksWithOnda: r.worksWithOnda,
      worksWithOndaNote: r.worksWithOndaNote,
      reviewUrl: siteUrl(new URL(r.url).pathname, 'chatgpt_compare'),
      assessed: r.testStatus === 'hands-on' ? 'hands-on tested' : 'evidence-based review (not hands-on tested)',
    }));

    const out = {
      products: rows,
      duel: duel
        ? {
            title: duel.title,
            verdict: duel.verdict,
            winner: duel.winner,
            winnerStatus: duel.winnerStatus,
            label: duel.label,
            onda_scores: duel.onda_scores,
            axes: duel.axes,
            url: siteUrl(new URL(duel.url).pathname, 'chatgpt_compare'),
          }
        : null,
      notFound: missing,
      ownProductNote: ownProduct
        ? 'ONDA Life is our own product, so it is not scored against others here. It is an iPhone app for guided breathing and HRV biofeedback: pulse via the iPhone camera, HRV and a personal baseline with Apple Watch.'
        : null,
      bridge: rows.some((r) => r.worksWithOnda !== 'not-a-device')
        ? {
            text: 'ONDA builds your personal baseline from Apple Health — Apple Watch, or another device that syncs heart data there. No device? ONDA measures your pulse with the iPhone camera.',
            url: appStoreUrl('chatgpt_compare'),
          }
        : null,
      source: 'ONDA Life editorial reviews — prices verified on the date shown.',
    };
    const text = rows.length
      ? (duel ? `${duel.title}: ${duel.label}. ${duel.verdict} ` : '') +
        rows.map((r) => `${r.name} — ${Number(r.score).toFixed(1)}/10, ${r.priceUsd ? `$${r.priceUsd}` : 'price n/a'}. ${r.verdict}`).join(' ')
      : 'None of these products has an ONDA review.';
    return { structuredContent: out, text: missing.length ? `${text} Not reviewed by ONDA: ${missing.join(', ')}.` : text };
  },
};

export const TOOLS = [checkHrv, breatheNow, findPractice, compare];
