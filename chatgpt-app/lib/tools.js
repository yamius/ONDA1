/**
 * The four v1 tools of the ONDA ChatGPT app. Each tool is pure: arguments in,
 * { structuredContent, text } out. Nothing about the user is stored or logged.
 *
 * Facts come only from generated site data (see landing/scripts/export-chatgpt-data.ts):
 * HRV norms, breathing patterns, adaptive practices and reviews. Bridge wording
 * follows landing/docs/onda-facts-source-of-truth.md — no numeric pacer claim,
 * HRV + personal baseline need Apple Watch, the camera pulse works on any iPhone.
 */
import { readFileSync } from 'node:fs';
import { interpretHrv, bandsFor } from './generated/hrv-norms.js';
import { BREATHING_PATTERNS } from './generated/breathing.js';
import { appStoreUrl, siteUrl } from './links.js';

// Literal paths so Vercel's file tracing bundles the data with the function.
const REVIEWS = JSON.parse(readFileSync(new URL('../data/reviews.json', import.meta.url), 'utf8'));
const PRACTICES = JSON.parse(readFileSync(new URL('../data/practices.json', import.meta.url), 'utf8'));

export const SAFETY_NOTE =
  'Not medical advice. If you have chest pain, fainting, severe shortness of breath or a racing heart that does not settle, contact emergency services or a doctor now.';

const ordinal = (n) => n + ([, 'st', 'nd', 'rd'][(n % 100 >> 3) ^ 1 && n % 10] || 'th');

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };

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

export const checkHrv = {
  name: 'check_hrv',
  title: 'Check HRV for your age',
  widget: 'hrv',
  description:
    'Compare one heart rate variability (HRV) number with population norms for the person’s age. ' +
    'Use when someone asks whether their HRV is normal, good or low for their age. ' +
    'Apple Watch reports SDNN; Oura, Whoop, Garmin, Fitbit and Polar apps report RMSSD — the tool picks the right table from the device. ' +
    'Do not use for symptoms (chest pain, fainting, palpitations): tell the person to seek medical help instead.',
  inputSchema: {
    type: 'object',
    properties: {
      age: { type: 'integer', minimum: 18, maximum: 100, description: 'Age in years (18+).' },
      hrv_ms: { type: 'number', minimum: 3, maximum: 300, description: 'HRV value in milliseconds.' },
      device: {
        type: 'string',
        enum: Object.keys(DEVICE_METRIC),
        description: 'Where the number comes from. Ask if unknown; use "other" for any RMSSD source.',
      },
    },
    required: ['age', 'hrv_ms', 'device'],
    additionalProperties: false,
  },
  annotations: READ_ONLY,
  invoking: 'Checking HRV norms…',
  invoked: 'HRV checked',
  run({ age, hrv_ms, device }) {
    const metric = DEVICE_METRIC[device] ?? 'rmssd';
    const value = Math.round(Number(hrv_ms));
    if (!(Number(age) >= 18 && Number(age) <= 100) || !(value >= 3 && value <= 300)) {
      throw new Error('age must be 18–100 and hrv_ms 3–300');
    }
    const r = interpretHrv(Number(age), value, metric);
    const out = {
      age: Number(age),
      value,
      metric: metric.toUpperCase(),
      device,
      ageBand: r.band.label,
      percentile: r.percentile,
      tier: r.tier,
      tierLabel: r.tierLabel,
      summary: r.summary,
      band: { p10: r.band.p10, p25: r.band.p25, p50: r.band.p50, p75: r.band.p75, p90: r.band.p90 },
      allBands: bandsFor(metric).map((b) => ({ label: b.label, p50: b.p50 })),
      trendNote: 'One reading says little — compare your weekly average with your own baseline.',
      metricNote:
        metric === 'sdnn'
          ? 'Apple Watch SDNN comes from short readings and runs lower than RMSSD — never compare it with Oura or Whoop numbers.'
          : 'Night-time RMSSD, the window Oura, Whoop and Garmin measure. Daytime spot readings run lower.',
      bridge: {
        text: 'ONDA builds your personal norm from your Apple Watch history and checks your HRV against it every day.',
        url: appStoreUrl('chatgpt_hrv'),
      },
      learnMore: siteUrl('/tools/hrv', 'chatgpt_hrv'),
      safety: SAFETY_NOTE,
    };
    return {
      structuredContent: out,
      text: `${value} ms (${out.metric}) at age ${out.age}: about the ${ordinal(r.percentile)} percentile for ${r.band.label} — ${r.tierLabel}. ${r.summary}`,
    };
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
    'Show a live animated breathing guide with a timer, right in the chat. ' +
    'Use when someone wants to calm down, can’t sleep, feels nervous before an event, or asks to be taught a breathing technique ' +
    '(4-7-8, box breathing, physiological sigh, slow/coherent breathing). ' +
    'Pick the technique that fits: 478 for sleep, sigh for a quick reset, calming for nerves, coherent as the default. ' +
    'Do not use for someone who is short of breath because of illness or panic with chest pain — advise medical help.',
  inputSchema: {
    type: 'object',
    properties: {
      technique: { type: 'string', enum: Object.keys(TECHNIQUES), description: 'Breathing technique. Default: coherent.' },
      minutes: { type: 'integer', minimum: 1, maximum: 10, description: 'Session length. Default 3.' },
    },
    additionalProperties: false,
  },
  annotations: READ_ONLY,
  invoking: 'Preparing a breathing guide…',
  invoked: 'Breathing guide ready',
  run({ technique = 'coherent', minutes = 3 } = {}) {
    const id = TECHNIQUES[technique] ? technique : 'coherent';
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
    'Suggest 1–3 short guided practices from ONDA’s free adaptive set (6 minutes each, playable free on onda-life.com/emoton). ' +
    'Use when someone wants to start meditating, needs something short for sleep, calm, focus or energy, or asks what practice to do right now. ' +
    'Ask for the goal if it is unclear.',
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
  annotations: READ_ONLY,
  invoking: 'Finding a practice…',
  invoked: 'Practices found',
  run({ goal, minutes, experience = 'beginner', position } = {}) {
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
      }));
    const tryUrl = siteUrl('/emoton', 'chatgpt_practice');
    const out = {
      goal,
      practices: ranked,
      timeNote: minutes && minutes < 6 ? 'These practices take about 6 minutes — the first steps work as a shorter version.' : null,
      tryFree: { text: 'Play these practices free in your browser', url: tryUrl },
      bridge: {
        text: 'The ONDA app picks a practice for how you feel and shows your pulse before and after.',
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

/** Best review for a free-text product name, or null. */
export function matchReview(query) {
  const q = tokens(query).filter((t) => !['the', 'app', 'vs'].includes(t));
  if (!q.length) return null;
  let best = null;
  for (const r of REVIEWS.reviews) {
    const hay = new Set([...tokens(r.name), ...tokens(r.slug), ...tokens(r.brand)]);
    const hit = q.filter((t) => hay.has(t)).length;
    if (!hit) continue;
    const cover = hit / q.length;
    const tight = hit / hay.size;
    const key = [cover, tight, r.dateModified];
    if (!best || key[0] > best.key[0] || (key[0] === best.key[0] && (key[1] > best.key[1] || (key[1] === best.key[1] && key[2] > best.key[2])))) {
      best = { r, key };
    }
  }
  return best && best.key[0] >= 0.5 ? best.r : null;
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
    'Side-by-side comparison card of 2–3 wellness devices or apps from ONDA’s editorial reviews (onda-life.com/reviews): ' +
    'price, subscription, which HRV metric they report, score, verdict and a link to the full review. ' +
    'Covers HRV wearables (Oura, Whoop, Apple Watch, Garmin, Polar, smart rings), meditation, sleep and breathwork apps, CGMs, EEG headsets, red light, saunas, cold plunges and more. ' +
    'Use for “X or Y?” / “X vs Y” questions.',
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
  annotations: READ_ONLY,
  invoking: 'Pulling ONDA reviews…',
  invoked: 'Comparison ready',
  run({ products = [], priority } = {}) {
    const asked = products.slice(0, 3);
    const ownProduct = asked.some((p) => /\bonda\b/i.test(p));
    const found = [];
    const missing = [];
    for (const name of asked) {
      if (/\bonda\b/i.test(name)) continue;
      const r = matchReview(name);
      if (r && !found.some((f) => f.slug === r.slug)) found.push(r);
      else if (!r) missing.push(name);
    }
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
            text: 'ONDA reads HRV from Apple Watch only. Without it, ONDA measures your pulse with the iPhone camera.',
            url: appStoreUrl('chatgpt_compare'),
          }
        : null,
      source: 'ONDA Life editorial reviews — prices verified on the date shown.',
    };
    const text = rows.length
      ? (duel ? `${duel.title}: ${duel.verdict} ` : '') +
        rows.map((r) => `${r.name} — ${r.score}/10, ${r.priceUsd ? `$${r.priceUsd}` : 'price n/a'}. ${r.verdict}`).join(' ')
      : 'None of these products has an ONDA review.';
    return { structuredContent: out, text: missing.length ? `${text} Not reviewed by ONDA: ${missing.join(', ')}.` : text };
  },
};

export const TOOLS = [checkHrv, breatheNow, findPractice, compare];
