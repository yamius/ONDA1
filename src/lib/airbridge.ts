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
 * @param action   One of: 'View' | 'Start' | 'Stop' | 'Finish'
 * @param practiceName Human-readable name (localized). Used as the event label.
 */
export function trackAirbridgePractice(
  action: 'View' | 'Start' | 'Stop' | 'Finish',
  practiceName: string | undefined | null
): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.airbridge !== 'function') return;
    const label = (practiceName ?? '').toString();
    window.airbridge('event', {
      category: 'practice',
      action: `${action} Practice`,
      label,
    });
    console.log('[Airbridge] Practice event:', `${action} Practice`, label);
  } catch (e) {
    console.warn('[Airbridge] Failed to track practice event:', action, e);
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
