/**
 * sensorSource — the pulse-source abstraction.
 *
 * The practice/biofeedback consumes ONE resolved pulse stream; it does not care
 * whether the beats come from a watch, BLE strap, HealthKit, an Android
 * notification, or the phone camera. This pure module decides the active source
 * and HR from the raw inputs, and enforces the coherence honesty invariant.
 *
 * Pure + framework-free so the selection logic and the camera coherence gate are
 * unit-testable directly (not "as written" inside a hook).
 */

export type PulseSource = 'ble' | 'watch' | 'healthkit' | 'notification' | 'camera' | null;

export interface SourceInputs {
  bleConnected: boolean;
  bleHr: number | null;
  watchHr: number | null;
  healthkitHr: number | null; // already gated on "monitoring" by the caller
  notificationHr: number | null;
  cameraActive: boolean;
  cameraHr: number | null;
}

export interface ResolvedSource {
  source: PulseSource;
  hr: number | null;
}

/**
 * Resolve which pulse source drives the experience.
 *
 * Camera is an EXPLICIT choice — the practice only activates it when it intends
 * the camera to drive the feedback (no-watch user, or the user switched to
 * camera because the watch isn't worn). So when camera is active it OVERRIDES,
 * including when a watch is present. When the camera is not active, fall back to
 * the precise channels in priority order. The watch stays the precise upgrade.
 */
export function resolvePulseSource(i: SourceInputs): ResolvedSource {
  if (i.cameraActive && i.cameraHr != null) return { source: 'camera', hr: i.cameraHr };
  if (i.bleConnected && i.bleHr != null) return { source: 'ble', hr: i.bleHr };
  if (i.watchHr != null) return { source: 'watch', hr: i.watchHr };
  if (i.healthkitHr != null) return { source: 'healthkit', hr: i.healthkitHr };
  if (i.notificationHr != null) return { source: 'notification', hr: i.notificationHr };
  // camera active but no committed bpm yet → keep the source 'camera' so the UI
  // shows the camera "searching" state rather than falling back to "no sensor".
  if (i.cameraActive) return { source: 'camera', hr: null };
  return { source: null, hr: null };
}

/**
 * HONESTY INVARIANT — coherence is WATCH-GRADE ONLY.
 *
 * Camera PPG at ~30 Hz cannot time beats precisely enough for an honest
 * coherence number, so coherence is HARD-GATED to null for the camera source.
 * Camera HR must NEVER surface as a coherence value. Everything else passes
 * through unchanged. (Covered by an explicit unit test.)
 */
export function coherenceForSource(rawCoherence: number | null, source: PulseSource): number | null {
  return source === 'camera' ? null : rawCoherence;
}
