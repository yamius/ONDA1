/**
 * retention_review — "do they come back".
 *
 * This is the tool that decides which conversation to have. The funnel already
 * showed that the paywall is not the obstacle: 94.5% of the people who see it
 * walk past it into the app, and only 3 leave. So either those people return,
 * and the question is what would make premium worth paying for; or they do not,
 * and the question is not about money at all. Without this number both stories
 * are equally believable and any decision is a guess.
 *
 * TWO DEFINITIONS, REPORTED SEPARATELY AND NEVER BLENDED:
 *
 *   by_open      — GA4's own notion of an active user. Launching the app counts.
 *   by_practice  — a user counts only if they actually started a practice.
 *
 * They are different numbers and must not look alike. Opening an app is not
 * retention; it is the weakest possible evidence of it. by_practice is the one
 * to act on, and it will always be the lower of the two.
 */

import { ga4Missing, cohortReport, internalFilter, appVersionFilter, andFilters } from '../lib/sources/ga4.js';
import { windowFor, rate, ok, notConfigured, sourceError, DATA_LAG, LOW_DATA_N } from '../lib/shared.js';

/**
 * The point of comparison the redesign was measured against.
 * Tenjin, 2026-05-23 to 2026-06-22, 145 installs, pre-onboarding-redesign.
 */
const BASELINE = {
  source: 'Tenjin, 2026-05-23 to 2026-06-22, pre-redesign',
  installs: 145,
  d1_pct: 3.42,
  d7_pct: 0.68,
  cost_per_d7_retained_usd: 1861,
};

/** Apple/GA4 lag: a cohort needs the day to have actually happened AND landed. */
const REPORTING_LAG_DAYS = 2;

export const retentionReviewSchema = {
  name: 'retention_review',
  description:
    'Do people come back? Cohort retention from GA4, reported two ways: by app ' +
    'open (GA4 active users) and by actually starting a practice. Includes d1/d7/' +
    'd30 against the pre-redesign baseline, per-cohort N, and explicit flags for ' +
    'cohorts too young to have a d7 yet. Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      since: { type: 'integer', description: 'Days back. Default 28.', default: 28 },
      app_version: { type: 'string', description: 'Filter to one marketing version, e.g. "1.8.7".' },
      internal: {
        type: 'string', enum: ['exclude', 'include', 'only'], default: 'exclude',
        description: "Own devices. 'exclude' (default) drops them.",
      },
      view: { type: 'string', enum: ['top', 'by_cohort', 'full'], default: 'top' },
    },
  },
};

const MILESTONES = [1, 7, 30];

/** Days since a cohort formed, in whole UTC days. */
function ageOf(cohortDay, today) {
  return Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${cohortDay}T00:00:00Z`)) / 86400000);
}

/**
 * Window-level retention at each milestone.
 *
 * Only cohorts old enough to HAVE that milestone are counted. A cohort that
 * installed yesterday has a d7 of zero by arithmetic, not by behaviour;
 * averaging it in reads as a collapse. Those cohorts are excluded from the rate
 * and reported separately as pending.
 */
function summarise(rows, today) {
  const totals = {};
  for (const r of rows) {
    if (!totals[r.cohort]) totals[r.cohort] = { size: 0, active: {} };
    // cohortTotalUsers repeats on every row of a cohort; take it once.
    totals[r.cohort].size = Math.max(totals[r.cohort].size, r.totalUsers);
    totals[r.cohort].active[r.nthDay] = (totals[r.cohort].active[r.nthDay] ?? 0) + r.activeUsers;
  }

  const milestones = {};
  for (const day of MILESTONES) {
    let retained = 0;
    let cohortUsers = 0;
    const included = [];
    const pending = [];
    for (const [cohort, t] of Object.entries(totals)) {
      const age = ageOf(cohort, today);
      if (age >= day + REPORTING_LAG_DAYS) {
        retained += t.active[day] ?? 0;
        cohortUsers += t.size;
        included.push(cohort);
      } else {
        pending.push(cohort);
      }
    }
    milestones[`d${day}`] = {
      ...rate(retained, cohortUsers),
      cohorts_included: included.length,
      cohorts_too_young: pending.length,
      ...(cohortUsers === 0
        ? {
            incomplete: true,
            note:
              `No cohort in this window is yet ${day + REPORTING_LAG_DAYS} days old, so d${day} ` +
              'cannot be measured at all. This is not zero retention — it is no data.',
          }
        : {}),
    };
  }

  const byCohort = Object.entries(totals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cohort, t]) => {
      const age = ageOf(cohort, today);
      const row = { cohort, installs: t.size, age_days: age };
      for (const day of MILESTONES) {
        const complete = age >= day + REPORTING_LAG_DAYS;
        row[`d${day}`] = complete
          ? rate(t.active[day] ?? 0, t.size)
          : { pct: null, n: null, of: t.size, incomplete: true, reason: `cohort is ${age}d old; d${day} needs ${day + REPORTING_LAG_DAYS}d` };
      }
      return row;
    });

  return { milestones, byCohort };
}

export async function retentionReview(args = {}) {
  const missing = ga4Missing();
  if (missing.length) return notConfigured('ga4', missing);

  const win = windowFor(args.since);
  const view = args.view || 'top';
  const internal = args.internal || 'exclude';
  const today = win.end_date;
  const baseFilter = andFilters(internalFilter(internal), appVersionFilter(args.app_version));

  try {
    const [openRows, practiceRows] = await Promise.all([
      cohortReport({ startDate: win.start_date, endDate: win.end_date, days: 30, baseFilter }),
      cohortReport({ startDate: win.start_date, endDate: win.end_date, days: 30, baseFilter, eventName: 'practice_start' }),
    ]);

    const open = summarise(openRows, today);
    const practice = summarise(practiceRows, today);

    const result = {
      window: win,
      filters: { internal, app_version: args.app_version ?? null },
      data_lag_note:
        `${DATA_LAG.ga4} A cohort also needs the days themselves to have passed: ` +
        `d7 requires the cohort to be at least ${7 + REPORTING_LAG_DAYS} days old. ` +
        'Cohorts younger than that are excluded from the rates and listed as ' +
        'too_young rather than counted as zero.',

      definitions: {
        by_open:
          "GA4 active users — the app was launched. This is the industry-standard " +
          'retention number and the one comparable to most benchmarks.',
        by_practice:
          "The user actually started a practice (event practice_start) on that day. " +
          'Stricter and more honest: opening an app is not retention. Always lower ' +
          'than by_open; the gap between them is people who came back and did nothing.',
      },

      by_open: { milestones: open.milestones },
      by_practice: { milestones: practice.milestones },

      baseline: {
        ...BASELINE,
        comparison: MILESTONES.filter((d) => d !== 30).map((d) => {
          const now = open.milestones[`d${d}`];
          const base = BASELINE[`d${d}_pct`];
          return {
            milestone: `d${d}`,
            baseline_pct: base,
            current_pct_by_open: now?.pct ?? null,
            current_n: now ? `${now.n}/${now.of}` : null,
            delta_pp: now?.pct == null ? null : Math.round((now.pct - base) * 100) / 100,
            comparable_to_baseline: true,
            note:
              'Baseline is by app open (Tenjin), so it is compared against by_open. ' +
              'by_practice is a stricter definition and has no baseline.',
          };
        }),
        caution:
          'The baseline covered 145 installs; this window is far smaller, so a ' +
          'difference of a few percentage points can be one or two people. Read ' +
          'the N, not the percentage.',
      },

      low_data_note:
        `Any rate whose denominator is under ${LOW_DATA_N} is flagged low_data. At ~49 ` +
        'installs a month, per-day cohorts are single digits and essentially always ' +
        'low_data — which is why the headline numbers above pool every eligible ' +
        'cohort in the window rather than reporting one day at a time.',
    };

    if (view === 'by_cohort' || view === 'full') {
      result.by_open.by_cohort = open.byCohort;
      result.by_practice.by_cohort = practice.byCohort;
    }

    if (view === 'full') {
      // Channel needs the acquisition source alongside a cohortSpec, and GA4
      // restricts which dimensions may accompany one. Not attempted blind:
      // Tenjin is the channel-capable retention source and is not wired here.
      result.by_channel = {
        available: false,
        reason:
          'GA4 cohort reports restrict the dimensions that can accompany a ' +
          'cohortSpec, so acquisition source is not requested here rather than ' +
          'guessed at. Tenjin holds channel-level cohort retention and is not ' +
          'wired into this tool yet.',
      };
    }

    return ok(result);
  } catch (err) {
    return sourceError('ga4', err);
  }
}
