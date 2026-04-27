// Post-mortem crash detector — split out of main.tsx so it doesn't run on
// the cold-start critical path. Called from main.tsx via runWhenIdle().

export async function runCrashRecovery(): Promise<void> {
  try {
    const markerRaw = localStorage.getItem('onda_last_practice_view');
    if (!markerRaw) return;
    localStorage.removeItem('onda_last_practice_view');
    const marker = JSON.parse(markerRaw);
    const sinceLastView = Date.now() - (marker.ts || 0);
    // Only report if last practice_view was very recent (<10s).
    if (sinceLastView > 10000) return;

    const errorLogsRaw = localStorage.getItem('onda_error_logs') || '[]';
    const errorLogs = JSON.parse(errorLogsRaw);

    // resourceTracker was lazy-loaded in main.tsx; pull the same module
    // here for getHeartbeats. If it isn't ready yet (rare, only if this
    // runs before the tracker's idle callback), heartbeats will be empty
    // and the rest of the report still goes through.
    let heartbeats: unknown[] = [];
    try {
      const tracker = await import('./resourceTracker');
      heartbeats = tracker.getHeartbeats();
      tracker.clearHeartbeats();
    } catch {}

    const { analytics } = await import('./AnalyticsService');
    await analytics.track('app_crash_suspected', {
      crashed_practice_id: marker.practiceId,
      ms_since_practice_view: sinceLastView,
      session_practice_count: marker.sessionPracticeCount,
      prev_session_id: marker.sessionId,
      last_error_logs: errorLogs.slice(-5),
      pre_crash_heartbeats: heartbeats.slice(-10),
      platform: 'ios',
    });
    console.warn('[ONDA] Detected suspected crash after practice_view', {
      practiceId: marker.practiceId,
      sinceLastView,
      sessionPracticeCount: marker.sessionPracticeCount,
    });
  } catch (e) {
    console.error('[ONDA] Crash recovery check failed:', e);
  }
}
