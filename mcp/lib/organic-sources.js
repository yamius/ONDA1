/**
 * organic_sources — "how do people find us in the App Store".
 *
 * The largest remaining blind spot: 86% of installs are organic, paid is
 * stopped, and revenue is coming from users whose origin we cannot name.
 *
 * This is the ANSWER LAYER over lib/sources/asc-analytics.js. It exists apart
 * from the tool so the reporting rules — thresholding, pending state, the
 * refusal to blend with the derived residual — live in one place.
 */

import {
  ascAnalyticsMissing, listReportRequests, findReport,
  instancesInWindow, segmentRows, rollUpBySource,
} from './sources/asc-analytics.js';
import { LOW_DATA_N, notConfigured, sourceError } from './shared.js';

/** Report names that carry the source-type dimension, matched loosely. */
const DISCOVERY_REPORT_NAMES = ['discovery and engagement', 'discovery & engagement'];

const LAG_NOTE =
  'App Store analytics for a given day are complete two days after it; the last ' +
  'day or two of any window is partial or missing.';

const THRESHOLD_NOTE =
  'Apple applies privacy thresholding to these reports: rows covering fewer than ' +
  '5 users or devices are OMITTED ENTIRELY, and statistical noise is added to ' +
  'the rest. Small sources can be absent altogether, so these rows do not sum to ' +
  'the true total. Shares below are computed against the VISIBLE sum, not against ' +
  'all installs — treat them as the shape of discovery, not as exact proportions.';

/**
 * Build the source-type breakdown for a window.
 *
 * `ascTotalInstalls` is the App Store Connect sales-report total for the same
 * window, used only to expose the gap left by thresholding — never to rescale
 * the rows, which would fabricate precision Apple deliberately removed.
 */
export async function organicSourceBreakdown(win, ascTotalInstalls = null) {
  const missing = ascAnalyticsMissing();
  if (missing.length) return { available: false, ...notConfigured('asc_analytics', missing) };

  try {
    const requests = await listReportRequests();
    const active = requests.filter((r) => !r.stoppedDueToInactivity);

    if (!requests.length) {
      return {
        available: false,
        reason: 'not_registered',
        note:
          'No analyticsReportRequest exists for this app. These reports only ' +
          'accumulate from the moment they are registered and are never ' +
          'backfilled, so every day without one is unrecoverable. Register with ' +
          'mcp/scripts/register-analytics-reports.mjs (a write, run by hand — the ' +
          'MCP server itself stays read-only).',
      };
    }

    const stopped = requests.filter((r) => r.stoppedDueToInactivity);
    if (!active.length) {
      return {
        available: false,
        reason: 'stopped_due_to_inactivity',
        stopped_access_types: stopped.map((r) => r.accessType),
        note:
          'Apple stopped the report request because it went unread for too long. ' +
          'Data is not accruing right now. Re-run the registration script.',
      };
    }

    // Prefer the snapshot when present: it carries the available history,
    // whereas an ONGOING request only has days since it was registered.
    const ordered = [
      ...active.filter((r) => r.accessType === 'ONE_TIME_SNAPSHOT'),
      ...active.filter((r) => r.accessType !== 'ONE_TIME_SNAPSHOT'),
    ];

    let matched = null;
    let seenReports = [];
    for (const req of ordered) {
      const { match, available } = await findReport(req.id, DISCOVERY_REPORT_NAMES);
      seenReports = available;
      if (match) { matched = { ...match, accessType: req.accessType }; break; }
    }

    if (!matched) {
      return {
        available: false,
        reason: 'report_pending',
        note:
          'The request exists but the Discovery and Engagement report has not been ' +
          'produced yet. The first one lands roughly 24-48h after registration.',
        reports_currently_available: seenReports,
      };
    }

    const instances = await instancesInWindow(matched.id, win.start_date, win.end_date);
    if (!instances.length) {
      return {
        available: false,
        reason: 'report_pending',
        report: { name: matched.name, access_type: matched.accessType },
        note:
          'The report exists but has no daily instances inside this window yet — ' +
          'normal while it is still accumulating, or if the window predates ' +
          'registration. An ONGOING report is never backfilled.',
        data_lag_note: LAG_NOTE,
      };
    }

    // Bounded: each instance is a separate download, and a wide window would
    // otherwise mean dozens of round trips inside one tool call.
    const MAX_INSTANCES = 35;
    const used = instances.slice(-MAX_INSTANCES);
    const rows = [];
    for (const inst of used) rows.push(...(await segmentRows(inst.id)));

    const rolled = rollUpBySource(rows);
    if (rolled.unrecognised) {
      return {
        available: false,
        reason: 'unrecognised_report_format',
        note:
          'The report downloaded but no source-type column was recognised, so no ' +
          'breakdown is being guessed from it.',
        columns_present: rolled.columns,
      };
    }

    // Shares are against the VISIBLE sum, and say so — see THRESHOLD_NOTE.
    const visibleTotal = rolled.bySource.reduce(
      (sum, r) => sum + r.impressions + r.product_page_views + r.taps + r.other, 0,
    );
    const bySource = rolled.bySource.map((r) => {
      const n = r.impressions + r.product_page_views + r.taps + r.other;
      return {
        source: r.source,
        impressions: r.impressions || null,
        product_page_views: r.product_page_views || null,
        taps: r.taps || null,
        events_total: n,
        share_of_visible: visibleTotal
          ? { pct: Math.round((n / visibleTotal) * 1000) / 10, n, of: visibleTotal, low_data: visibleTotal < LOW_DATA_N }
          : { pct: null, n, of: 0, low_data: true },
        // Where Apple gives both, this is the honest per-source conversion.
        page_view_rate: r.impressions
          ? { pct: Math.round((r.product_page_views / r.impressions) * 1000) / 10, n: r.product_page_views, of: r.impressions, low_data: r.impressions < LOW_DATA_N }
          : null,
      };
    });

    return {
      available: true,
      report: { name: matched.name, access_type: matched.accessType },
      days_covered: used.length,
      instances_skipped: instances.length - used.length,
      by_source: bySource,
      n: visibleTotal,
      low_data: visibleTotal < LOW_DATA_N,
      columns_used: rolled.columns_used,
      thresholding_note: THRESHOLD_NOTE,
      data_lag_note: LAG_NOTE,
      // Never silently reconciled with the subtraction residual: they measure
      // different things, and a mismatch is information, not an error to hide.
      versus_derived_organic:
        ascTotalInstalls == null
          ? 'App Store Connect install total unavailable for this window, so no comparison is made.'
          : 'These are DISCOVERY events (impressions, page views), not installs. They ' +
            `cannot be compared directly with the derived organic residual or with the ` +
            `${ascTotalInstalls} installs App Store Connect reports for this window. ` +
            'Use this for the shape of discovery; use the sales report for counts.',
      measurement_note:
        'Measured by Apple, unlike split.organic which is App Store Connect total ' +
        'minus Tenjin paid. The two are kept apart deliberately.',
    };
  } catch (err) {
    return { available: false, ...sourceError('asc_analytics', err) };
  }
}
