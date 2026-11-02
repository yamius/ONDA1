/**
 * 101 (optional item): ask ONCE per install why a paywall was closed without a
 * purchase. Never again after an answer OR a dismiss (marker in Preferences).
 * Never for internal traffic (TestFlight builds bake internal=true, and the
 * 7-tap marks own devices) — keeps paywall_view test runs out of the data.
 */
import { Preferences } from '@capacitor/preferences';

export const PAYWALL_FEEDBACK_EVENT = 'onda:paywall-feedback';
const ASKED_KEY = 'onda_paywall_feedback_asked';
export type PaywallFeedbackReason = 'price' | 'try_first' | 'unclear_value' | 'other';
export const PAYWALL_FEEDBACK_REASONS: PaywallFeedbackReason[] = ['price', 'try_first', 'unclear_value', 'other'];

export async function wasPaywallFeedbackAsked(): Promise<boolean> {
  try { const { value } = await Preferences.get({ key: ASKED_KEY }); if (value) return true; } catch { /* noop */ }
  try { return localStorage.getItem(ASKED_KEY) != null; } catch { return false; }
}

export async function markPaywallFeedbackAsked(): Promise<void> {
  try { localStorage.setItem(ASKED_KEY, '1'); } catch { /* noop */ }
  try { await Preferences.set({ key: ASKED_KEY, value: '1' }); } catch { /* noop */ }
}

/** Called by SubscriptionModal on a dismiss without purchase. */
export function requestPaywallFeedback(source: string | undefined, opts: { force?: boolean } = {}): void {
  // force: internal debug button only — skips the once-per-install marker and the internal check.
  try { window.dispatchEvent(new CustomEvent(PAYWALL_FEEDBACK_EVENT, { detail: { source, force: !!opts.force } })); } catch { /* noop */ }
}
