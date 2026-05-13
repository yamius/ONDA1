import { registerPlugin } from '@capacitor/core';

/**
 * Native bridge to the Tenjin iOS SDK.
 *
 * Replaces the old `OndaAirbridge` plugin (deleted in the same release).
 * The Swift implementation lives in `ios/App/App/OndaTenjinPlugin.swift`.
 *
 * On iOS, calls hit the native Tenjin SDK and produce server-side
 * postbacks to ad networks. On other platforms (web preview, Android
 * until we add a counterpart) the plugin is unavailable and the helpers
 * in `src/lib/tenjin.ts` short-circuit to no-ops.
 */
export interface OndaTenjinTrackEventPayload {
  /**
   * Tenjin event name. Free-form, but we keep snake_case across the JS
   * layer for consistency with Firebase's reserved-event schema.
   */
  name: string;
  /**
   * Optional integer-coercible numeric value (durations, counts, etc.).
   * Tenjin's `andEventValue:` expects an NSString-encoded integer; the
   * native plugin rounds floats for us.
   */
  value?: number;
}

export interface OndaTenjinTrackTransactionPayload {
  /** Product identifier — App Store / Play Store SKU. */
  productName: string;
  /** ISO 4217 currency code, e.g. 'USD', 'EUR', 'UAH'. */
  currencyCode: string;
  /** Integer quantity. RevenueCat purchases are always 1. */
  quantity: number;
  /** Decimal unit price. Forwarded as-is to NSDecimalNumber on iOS. */
  unitPrice: number;
}

export interface OndaTenjinPlugin {
  /**
   * Fire TenjinSDK.connect() — the install postback to AppLovin / Google
   * Ads / Meta. MUST be called AFTER the ATT prompt has resolved (any
   * outcome). Idempotent: subsequent calls in the same process no-op.
   */
  connect(): Promise<{ ok: boolean; alreadyConnected: boolean }>;
  trackEvent(payload: OndaTenjinTrackEventPayload): Promise<{ ok: boolean }>;
  trackTransaction(payload: OndaTenjinTrackTransactionPayload): Promise<{ ok: boolean }>;
}

const OndaTenjin = registerPlugin<OndaTenjinPlugin>('OndaTenjin');

export default OndaTenjin;
