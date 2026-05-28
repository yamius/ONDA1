import { registerPlugin } from '@capacitor/core';

/**
 * Native bridge to `SKStoreReviewController.requestReview(in:)`.
 *
 * Swift side lives in `ios/App/App/OndaStoreReviewPlugin.swift`. On
 * non-iOS platforms (web preview, Android) `requestReview()` resolves
 * to `{ requested: false, reason: 'unavailable' }` via Capacitor's
 * unavailable-method behaviour and the helper below short-circuits.
 *
 * USAGE NOTE: Apple silently caps the prompt to ~3 displays per user
 * per 365 days. Calling `requestReview()` more than that is a no-op
 * at the system level but it's still considerate to gate on a value
 * moment (e.g. N-th completed practice).
 */

export interface OndaStoreReviewResult {
  /** `true` when the request was dispatched to the system — does NOT
   *  mean the user actually saw the dialog. */
  requested: boolean;
  /** Diagnostic flag set on iOS < 14 (we ship 15+, so never expected). */
  legacy?: boolean;
  /** Set when iOS refused — e.g. no foreground window scene. */
  reason?: string;
}

export interface OndaStoreReviewPlugin {
  requestReview(): Promise<OndaStoreReviewResult>;
}

const OndaStoreReview = registerPlugin<OndaStoreReviewPlugin>('OndaStoreReview');

export default OndaStoreReview;

/**
 * Safe helper — swallows errors on platforms without the native plugin
 * so the JS caller doesn't have to wrap in try/catch. Returns the same
 * result shape, with `requested: false` + a reason on failure.
 */
export async function requestAppStoreReview(): Promise<OndaStoreReviewResult> {
  try {
    return await OndaStoreReview.requestReview();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('[OndaStoreReview] unavailable on this platform:', err);
    return { requested: false, reason: 'unavailable' };
  }
}
