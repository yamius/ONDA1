/**
 * 101: home_tap {target, is_first_session} — taps on the main home elements,
 * ONLY during the first session after install (see firstSession.ts). Low volume:
 * each target is sent at most once per first session, max HOME_TAP_CAP events.
 * One capture-phase document listener; targets come from stable data-testids
 * (or data-home-tap on practice cards), mapped to short ids below.
 */
import { isFirstSession } from './firstSession';

export const HOME_TAP_CAP = 25;

const BY_TESTID: Record<string, string> = {
  'button-menu': 'menu',
  'home-diary-button': 'diary',
  'biometric-connect-cta': 'connect_cta',
  'biometric-connect-watch': 'watch_connect',
  'button-connect-tracker-home': 'watch_connect',
  'biometric-connect-camera': 'camera_checkin',
  'button-stop-scan-home': 'camera_stop',
  'rec-start': 'recommendation',
  'anomaly-practice': 'signal_practice',
  'anomaly-cta': 'signal_cta',
  'quick-mood-voice-check': 'voice_check',
  'quick-mood-face-check': 'face_check',
  'baseline-shift': 'baseline_shift',
  'baseline-card-ring': 'baseline_card',
  'simple-restore': 'simple_restore',
};

/** Short stable target id for a clicked element, or null if it isn't tracked. */
export function resolveHomeTapTarget(el: Element | null): string | null {
  const hit = el?.closest?.('[data-home-tap],[data-testid]') ?? null;
  if (!hit) return null;
  const explicit = hit.getAttribute('data-home-tap');
  if (explicit) return explicit.slice(0, 60);
  const id = hit.getAttribute('data-testid') ?? '';
  if (BY_TESTID[id]) return BY_TESTID[id];
  if (id.startsWith('menu-item-')) return `menu_${id.slice(10).replace(/-/g, '_')}`; // menu_settings, menu_diary…
  // Nested non-tracked testid inside a tracked one (e.g. an icon) → look further up.
  return hit.parentElement ? resolveHomeTapTarget(hit.parentElement) : null;
}

export function installHomeTapTracking(
  send: (params: { target: string; is_first_session: 'true' }) => void,
): () => void {
  const sent = new Set<string>();
  const onClick = (e: Event) => {
    if (!isFirstSession() || sent.size >= HOME_TAP_CAP) return;
    const target = resolveHomeTapTarget(e.target as Element);
    if (!target || sent.has(target)) return;
    sent.add(target);
    send({ target, is_first_session: 'true' });
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
