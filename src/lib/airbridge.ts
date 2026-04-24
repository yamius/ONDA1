declare global {
  interface Window {
    airbridge: ((method: string, ...args: any[]) => void) & {
      queue: any[];
      _i: number;
    };
  }
}

export function trackAirbridgeEvent(
  category: string,
  action: string,
  data?: Record<string, unknown>
): void {
  try {
    if (typeof window.airbridge === 'function') {
      window.airbridge('event', { category, action, ...data });
      console.log('[Airbridge] Event tracked:', category, action);
    }
  } catch (e) {
    console.warn('[Airbridge] Failed to track event:', category, action, e);
  }
}

/**
 * Track practice lifecycle events: View / Start / Stop / Finish.
 * Safe to call when Airbridge SDK is not loaded — silently no-ops.
 *
 * Event names (per Airbridge mapping):
 *   - basic    → "View Practice"          / "Start Practice"          / …
 *   - adaptive → "View Adaptive Practice" / "Start Adaptive Practice" / …
 *
 * @param action       One of: 'View' | 'Start' | 'Stop' | 'Finish'
 * @param practiceName Human-readable name (localized). Used as the event label.
 * @param opts.surface 'basic' (default) | 'adaptive' — controls event name prefix
 * @param opts.extra   Additional fields to merge into the event payload
 *                     (e.g. stress/energy for Finish Adaptive Practice).
 */
export function trackAirbridgePractice(
  action: 'View' | 'Start' | 'Stop' | 'Finish',
  practiceName: string | undefined | null,
  opts?: {
    surface?: 'basic' | 'adaptive';
    extra?: Record<string, unknown>;
  }
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const label = (practiceName ?? '').toString();
    const surface = opts?.surface ?? 'basic';
    const eventAction =
      surface === 'adaptive' ? `${action} Adaptive Practice` : `${action} Practice`;
    window.airbridge('event', {
      category: 'practice',
      action: eventAction,
      label,
      ...(opts?.extra ?? {}),
    });
    console.log('[Airbridge] Practice event:', eventAction, label, opts?.extra ?? '');
  } catch (e) {
    console.warn('[Airbridge] Failed to track practice event:', action, e);
  }
}

/**
 * Track emotional check-in events.
 *
 * Event names:
 *   - Start  → "Start Emotional Check"   (no label — user just tapped record)
 *   - Finish → "Finish Emotional Check"  (label = resolved emotion name)
 *
 * @param action       'Start' | 'Finish'
 * @param emotionName  Localized emotion label (only for Finish)
 */
export function trackAirbridgeEmotionalCheck(
  action: 'Start' | 'Finish',
  emotionName?: string | null
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const eventAction = `${action} Emotional Check`;
    const label = (emotionName ?? '').toString();
    window.airbridge('event', {
      category: 'emotional_check',
      action: eventAction,
      label,
    });
    console.log('[Airbridge] EmotionalCheck event:', eventAction, label);
  } catch (e) {
    console.warn('[Airbridge] Failed to track emotional check event:', action, e);
  }
}

/**
 * Paywall: fired once each time the subscription screen opens.
 */
export function trackAirbridgePaywallView(): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    window.airbridge('event', {
      category: 'paywall',
      action: 'View Paywall',
    });
    console.log('[Airbridge] Paywall event: View Paywall');
  } catch (e) {
    console.warn('[Airbridge] Failed to track paywall view:', e);
  }
}

/**
 * Paywall: fired when the user taps a purchase button.
 * @param subscriptionType e.g. 'monthly' | 'yearly'
 */
export function trackAirbridgePaywallClick(subscriptionType: string): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    window.airbridge('event', {
      category: 'paywall',
      action: 'Click Paywall Button',
      label: subscriptionType,
    });
    console.log('[Airbridge] Paywall event: Click Paywall Button', subscriptionType);
  } catch (e) {
    console.warn('[Airbridge] Failed to track paywall click:', e);
  }
}

/**
 * Paywall: fired after a successful purchase.
 * Uses Airbridge's standard semantic fields (value, currency) so the
 * revenue dashboard picks it up without extra mapping.
 */
export function trackAirbridgeSubscribe(params: {
  value: number;
  currency?: string;
  productId?: string;
  plan?: string;
}): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const payload: Record<string, unknown> = {
      category: 'paywall',
      action: 'Subscribe',
      value: params.value,
      currency: params.currency ?? 'USD',
    };
    if (params.productId) payload.product_id = params.productId;
    if (params.plan) payload.label = params.plan;
    window.airbridge('event', payload);
    console.log('[Airbridge] Paywall event: Subscribe', payload);
  } catch (e) {
    console.warn('[Airbridge] Failed to track subscribe:', e);
  }
}

export function identifyAirbridgeUser(params: {
  id?: string;
  email?: string;
  alias?: string;
}): void {
  try {
    if (typeof window.airbridge === 'function') {
      window.airbridge('setUserID', params.id ?? null);
      if (params.email) window.airbridge('setUserEmail', params.email);
      if (params.alias) window.airbridge('setUserAlias', params.alias);
      console.log('[Airbridge] User identified:', params.id);
    }
  } catch (e) {
    console.warn('[Airbridge] Failed to identify user:', e);
  }
}

export function initAirbridgeDeepLinkHandler(): void {
  window.addEventListener('airbridge-deeplink', (e: Event) => {
    const event = e as CustomEvent<{ url: string }>;
    const url = event.detail?.url;
    if (!url) return;

    console.log('[Airbridge] Deep link received in JS handler:', url);

    try {
      const parsed = new URL(url);
      const params: Record<string, string> = {};
      parsed.searchParams.forEach((v, k) => { params[k] = v; });

      if (typeof window.airbridge === 'function') {
        window.airbridge('event', {
          category: 'airbridge',
          action: 'app_open',
          label: url,
          deeplink: url,
          ...params,
        });
      }

      console.log('[Airbridge] Deep link forwarded to SDK, params:', params);
    } catch (e) {
      console.warn('[Airbridge] Failed to parse deep link URL:', url, e);
    }
  });

  console.log('[Airbridge] Deep link handler initialized');
}
