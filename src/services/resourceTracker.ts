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
  // Every `new Blob(...)` created — blob data sits in native memory even
  // without a URL assigned. IndexedDB writes of large audio blobs count too.
  totalBlobsEver: number;
  totalBlobBytesEver: number;
  // Every fetch() call; in-flight ones can pin a large ReadableStream/buffer.
  totalFetchesEver: number;
  liveFetches: number;
  // Every MediaElementAudioSourceNode created in any AudioContext. On iOS
  // these pin the HTMLAudioElement's decoder inside the native audio graph
  // and can't be freed while the AudioContext lives. With a singleton
  // context (never closed), they accumulate.
  totalMediaElementSourcesEver: number;
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
  totalBlobsEver: 0,
  totalBlobBytesEver: 0,
  totalFetchesEver: 0,
  liveFetches: 0,
  totalMediaElementSourcesEver: 0,
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

    // Patch createMediaElementSource on the prototype so ALL instances count.
    const proto = OrigAudioContext.prototype;
    const origCreateMES = proto.createMediaElementSource;
    if (typeof origCreateMES === 'function') {
      proto.createMediaElementSource = function patchedCreateMES(
        this: any,
        ...args: any[]
      ) {
        state.totalMediaElementSourcesEver += 1;
        return origCreateMES.apply(this, args);
      };
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

  // --- Blob constructor ---
  // useAudioCache does `new Blob(chunks, { type: 'audio/mpeg' })` which pins
  // the decoded mp3 (~20-30MB per track) in native memory independently of
  // whether URL.createObjectURL is ever called on it.
  const OrigBlob = (window as any).Blob;
  if (OrigBlob) {
    const PatchedBlob = function patchedBlob(this: any, parts?: any[], options?: any) {
      state.totalBlobsEver += 1;
      const instance = new OrigBlob(parts, options);
      try {
        state.totalBlobBytesEver += instance.size || 0;
      } catch (_) { /* ignore */ }
      return instance;
    };
    (PatchedBlob as any).prototype = OrigBlob.prototype;
    (window as any).Blob = PatchedBlob as any;
  }

  // --- fetch ---
  // An in-flight fetch with a large ReadableStream ties up native buffers.
  const origFetch = window.fetch.bind(window);
  (window as any).fetch = function patchedFetch(...args: any[]) {
    state.totalFetchesEver += 1;
    state.liveFetches += 1;
    return origFetch(...args).finally(() => {
      state.liveFetches = Math.max(0, state.liveFetches - 1);
    });
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
    totalBlobsEver: state.totalBlobsEver,
    totalBlobBytesEver: state.totalBlobBytesEver,
    totalFetchesEver: state.totalFetchesEver,
    liveFetches: state.liveFetches,
    totalMediaElementSourcesEver: state.totalMediaElementSourcesEver,
  };
}

const HEARTBEAT_KEY = 'onda_resource_heartbeats';
const HEARTBEAT_MAX = 20;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start a rolling ring-buffer of resource snapshots in localStorage.
 * If the WebView is OOM-killed, the post-mortem in main.tsx can ship the last
 * N snapshots so we can see what was growing in the seconds before the crash
 * (instead of only the snapshot at practice_view).
 */
export function startHeartbeat(intervalMs = 500): void {
  if (heartbeatInterval) return;
  heartbeatInterval = setInterval(() => {
    try {
      const snap = snapshotResources();
      const now = Date.now();
      const raw = localStorage.getItem(HEARTBEAT_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      list.push({ ts: now, ...snap });
      while (list.length > HEARTBEAT_MAX) list.shift();
      localStorage.setItem(HEARTBEAT_KEY, JSON.stringify(list));
    } catch (_) { /* ignore */ }
  }, intervalMs);
}

export function getHeartbeats(): any[] {
  try {
    const raw = localStorage.getItem(HEARTBEAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function clearHeartbeats(): void {
  try {
    localStorage.removeItem(HEARTBEAT_KEY);
  } catch (_) { /* ignore */ }
}
