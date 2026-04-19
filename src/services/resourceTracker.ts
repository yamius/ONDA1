/**
 * Lightweight resource tracker for diagnosing WebView OOM-kills on iOS.
 *
 * iOS WKWebView doesn't expose performance.memory, so we approximate memory
 * pressure by counting things that commonly leak:
 *   - live setInterval timers
 *   - live setTimeout timers (uncleared)
 *   - DOM nodes
 *   - <audio> / <video> elements
 *   - AudioContext instances
 *
 * If any of these grow monotonically across practice_view events, we've found
 * the leak.
 *
 * Must be imported BEFORE any module that calls setInterval/setTimeout/new
 * AudioContext, otherwise early calls won't be counted.
 */

interface ResourceStats {
  liveIntervals: number;
  totalIntervalsEver: number;
  liveTimeouts: number;
  totalTimeoutsEver: number;
  liveAudioContexts: number;
  totalAudioContextsEver: number;
  domNodes: number;
  audioElements: number;
  videoElements: number;
  jsHeapUsedMB: number | null;
  jsHeapTotalMB: number | null;
  // Counts ALL HTMLAudioElement instances ever created via `new Audio(...)`,
  // including detached ones that document.getElementsByTagName('audio') misses.
  totalAudioElementsEver: number;
  // Counts URL.createObjectURL minus URL.revokeObjectURL — blob URLs leak
  // native memory on iOS WebKit (they reference a Blob buffer).
  liveBlobUrls: number;
  totalBlobUrlsEver: number;
}

// Per-module mutable counters. Patches below update these.
const state = {
  liveIntervals: 0,
  totalIntervalsEver: 0,
  liveTimeouts: 0,
  totalTimeoutsEver: 0,
  liveAudioContexts: 0,
  totalAudioContextsEver: 0,
  totalAudioElementsEver: 0,
  liveBlobUrls: 0,
  totalBlobUrlsEver: 0,
};

let patched = false;

export function installResourceTracker(): void {
  if (patched) return;
  patched = true;

  // --- setInterval / clearInterval ---
  const origSetInterval = window.setInterval;
  const origClearInterval = window.clearInterval;
  // We can't fully track cleared timers without storing IDs; keep a Set so
  // clearInterval can decrement accurately even if called more than once.
  const liveIntervalIds = new Set<number>();

  (window as any).setInterval = function patchedSetInterval(
    handler: TimerHandler,
    timeout?: number,
    ...rest: any[]
  ): number {
    const id = origSetInterval.call(window, handler as any, timeout as any, ...rest) as unknown as number;
    liveIntervalIds.add(id);
    state.liveIntervals = liveIntervalIds.size;
    state.totalIntervalsEver += 1;
    return id;
  };

  (window as any).clearInterval = function patchedClearInterval(id?: number): void {
    if (id !== undefined && liveIntervalIds.has(id)) {
      liveIntervalIds.delete(id);
      state.liveIntervals = liveIntervalIds.size;
    }
    return origClearInterval.call(window, id as any);
  };

  // --- setTimeout / clearTimeout ---
  const origSetTimeout = window.setTimeout;
  const origClearTimeout = window.clearTimeout;
  const liveTimeoutIds = new Set<number>();

  (window as any).setTimeout = function patchedSetTimeout(
    handler: TimerHandler,
    timeout?: number,
    ...rest: any[]
  ): number {
    const id = origSetTimeout.call(window, ((...a: any[]) => {
      liveTimeoutIds.delete(id);
      state.liveTimeouts = liveTimeoutIds.size;
      if (typeof handler === 'function') return (handler as (...args: any[]) => void)(...a);
      // String handlers are legacy; eval-style, rarely used
      // eslint-disable-next-line no-new-func
      return new Function(String(handler))();
    }) as any, timeout as any, ...rest) as unknown as number;
    liveTimeoutIds.add(id);
    state.liveTimeouts = liveTimeoutIds.size;
    state.totalTimeoutsEver += 1;
    return id;
  };

  (window as any).clearTimeout = function patchedClearTimeout(id?: number): void {
    if (id !== undefined && liveTimeoutIds.has(id)) {
      liveTimeoutIds.delete(id);
      state.liveTimeouts = liveTimeoutIds.size;
    }
    return origClearTimeout.call(window, id as any);
  };

  // --- AudioContext ---
  const OrigAudioContext =
    (window as any).AudioContext || (window as any).webkitAudioContext;
  if (OrigAudioContext) {
    const PatchedAudioContext = function patchedAudioContext(
      this: any,
      ...args: any[]
    ) {
      const instance = new OrigAudioContext(...args);
      state.liveAudioContexts += 1;
      state.totalAudioContextsEver += 1;
      // Wrap close() so we can decrement on explicit close.
      const origClose = instance.close?.bind(instance);
      if (origClose) {
        instance.close = async function wrappedClose(...closeArgs: any[]) {
          state.liveAudioContexts = Math.max(0, state.liveAudioContexts - 1);
          return origClose(...closeArgs);
        };
      }
      return instance;
    };
    (PatchedAudioContext as any).prototype = OrigAudioContext.prototype;
    (window as any).AudioContext = PatchedAudioContext as any;
    if ((window as any).webkitAudioContext) {
      (window as any).webkitAudioContext = PatchedAudioContext as any;
    }
  }

  // --- HTMLAudioElement (new Audio(...)) ---
  // Each `new Audio(url)` on iOS WebKit allocates a native audio decoder +
  // buffer. Detached elements (not in DOM) still hold that memory.
  const OrigAudio = (window as any).Audio;
  if (OrigAudio) {
    const PatchedAudio = function patchedAudio(this: any, ...args: any[]) {
      state.totalAudioElementsEver += 1;
      return new OrigAudio(...args);
    };
    (PatchedAudio as any).prototype = OrigAudio.prototype;
    (window as any).Audio = PatchedAudio as any;
  }

  // --- URL.createObjectURL / revokeObjectURL ---
  // Blob URLs from useAudioCache keep the underlying Blob (decoded mp3 data)
  // pinned in memory on iOS until revoked. Count live ones.
  const origCreateObjectURL = URL.createObjectURL.bind(URL);
  const origRevokeObjectURL = URL.revokeObjectURL.bind(URL);
  (URL as any).createObjectURL = function patchedCreateObjectURL(obj: any) {
    const url = origCreateObjectURL(obj);
    state.liveBlobUrls += 1;
    state.totalBlobUrlsEver += 1;
    return url;
  };
  (URL as any).revokeObjectURL = function patchedRevokeObjectURL(url: string) {
    state.liveBlobUrls = Math.max(0, state.liveBlobUrls - 1);
    return origRevokeObjectURL(url);
  };
}

export function snapshotResources(): ResourceStats {
  const perfMem = (performance as any).memory;
  return {
    liveIntervals: state.liveIntervals,
    totalIntervalsEver: state.totalIntervalsEver,
    liveTimeouts: state.liveTimeouts,
    totalTimeoutsEver: state.totalTimeoutsEver,
    liveAudioContexts: state.liveAudioContexts,
    totalAudioContextsEver: state.totalAudioContextsEver,
    // DOM can be heavy to query — '*' is fine but bounded by WebKit
    domNodes: document.getElementsByTagName('*').length,
    audioElements: document.getElementsByTagName('audio').length,
    videoElements: document.getElementsByTagName('video').length,
    jsHeapUsedMB: perfMem?.usedJSHeapSize
      ? Math.round((perfMem.usedJSHeapSize / 1024 / 1024) * 10) / 10
      : null,
    jsHeapTotalMB: perfMem?.totalJSHeapSize
      ? Math.round((perfMem.totalJSHeapSize / 1024 / 1024) * 10) / 10
      : null,
    totalAudioElementsEver: state.totalAudioElementsEver,
    liveBlobUrls: state.liveBlobUrls,
    totalBlobUrlsEver: state.totalBlobUrlsEver,
  };
}
