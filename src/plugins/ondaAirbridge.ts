import { registerPlugin } from '@capacitor/core';

/**
 * Native bridge to the Airbridge iOS SDK (v4).
 *
 * Lives alongside the JS Web SDK loaded in `index.html`. On iOS we route
 * every custom event through this plugin so it lands in the App Real-time
 * Log under the same IDFA as the auto-generated Install/Open events,
 * giving us a single attribution stream. On other platforms (web preview
 * builds, PWA) the plugin is unavailable and the helpers in
 * `src/lib/airbridge.ts` fall back to `window.airbridge('event', …)`.
 *
 * The Swift implementation lives in `ios/App/App/OndaAirbridgePlugin.swift`.
 */
export interface OndaAirbridgeTrackPayload {
  category: string;
  action?: string;
  label?: string;
  value?: number;
  /** Airbridge semantic attributes (transactionID, totalValue, …). */
  semanticAttributes?: Record<string, unknown>;
  /** Free-form key/value pairs surfaced in the dashboard's Custom Attributes. */
  customAttributes?: Record<string, unknown>;
}

export interface OndaAirbridgePlugin {
  trackEvent(payload: OndaAirbridgeTrackPayload): Promise<{ ok: boolean }>;
  setUserID(opts: { id: string | null }): Promise<void>;
  setUserEmail(opts: { email: string }): Promise<void>;
  setUserAlias(opts: { key: string; value: string }): Promise<void>;
  clearUser(): Promise<void>;
}

const OndaAirbridge = registerPlugin<OndaAirbridgePlugin>('OndaAirbridge');

export default OndaAirbridge;
