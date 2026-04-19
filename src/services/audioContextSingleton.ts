/**
 * Process-lifetime singleton AudioContext.
 *
 * Why: on iOS WebKit (WKWebView) every `new AudioContext()` allocates a large
 * native audio buffer pool that is NOT fully reclaimed on `.close()`. When
 * practice intros mount/unmount a RemoteAudioPlayer, the per-mount AudioContext
 * accumulates native memory even though close() is called in the cleanup.
 * After ~3 cycles iOS hits memory pressure and kills the WebView process.
 *
 * Fix: share a single AudioContext across all players/components for the
 * lifetime of the JS process. The native leak happens at most once per app
 * launch instead of once per practice open.
 *
 * API:
 *   getAudioContext() — returns the shared instance, lazily constructed.
 *   NEVER call close() on it. Only per-source nodes should be disconnect()'d
 *   in component cleanup.
 */

let shared: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (shared) return shared;
  try {
    const Ctor =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    shared = new Ctor();
    return shared;
  } catch (e) {
    console.error('[audioContextSingleton] Failed to create AudioContext:', e);
    return null;
  }
}

/**
 * If caller has explicitly stopped all audio and wants to free the native
 * backing buffer (e.g. before backgrounding for a long time), this resets
 * the singleton. Expect callers to recreate on next use. Most code paths
 * should NOT call this.
 */
export function resetAudioContextSingleton(): void {
  if (shared) {
    try {
      shared.close();
    } catch (_) {
      // ignore
    }
    shared = null;
  }
}
