import { useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { trackEvent } from '../services/AnalyticsService';

/**
 * Persistent "Rate ONDA" row (1.9.3) — NOT a popup.
 *
 * Apple review-gating rule: the stars are DECORATION. Every star does exactly
 * the same thing (opens the App Store "Write a Review" page); we never store the
 * tapped value, never light up N stars, and never route people differently by
 * their choice (filtering who reaches the store is forbidden). The system
 * SKStoreReview prompt elsewhere is untouched.
 */
const APP_STORE_ID = '6755912529';

export type RatePlace = 'home' | 'results' | 'menu';

function openWriteReview() {
  const native = `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}?action=write-review`;
  const web = `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
  if (Capacitor.getPlatform() === 'ios') {
    // Capacitor hands non-http schemes to iOS → opens the App Store app straight
    // on the review sheet.
    window.location.href = native;
  } else {
    window.open(web, '_blank', 'noopener');
  }
}

// Once tapped (any star), the row is hidden for good on this device. The App
// Store never tells the app whether a review was actually left, so "tapped →
// went to the store" is the honest signal. Hiding is independent of WHICH star
// was tapped, so it's not review-gating.
const TAPPED_KEY = 'onda_rate_tapped';

export function RateOndaRow({ place, light }: { place: RatePlace; light: boolean }) {
  const { t } = useTranslation();
  const [tapped, setTapped] = useState<boolean>(() => {
    try { return localStorage.getItem(TAPPED_KEY) === '1'; } catch { return false; }
  });
  if (tapped) return null;
  const onTap = () => {
    try { trackEvent('rate_tap', { place }); } catch { /* noop */ }
    try { localStorage.setItem(TAPPED_KEY, '1'); } catch { /* noop */ }
    openWriteReview();
    setTapped(true);
  };
  const gray = light ? 'rgb(148,163,184)' : 'rgba(255,255,255,0.45)';
  return (
    <div className="flex flex-col items-center gap-1.5 py-2" data-testid={`rate-row-${place}`}>
      <div className="flex items-center gap-1.5" role="group" aria-label={t('rate.title', 'Rate ONDA')}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={onTap}
            aria-label={t('rate.title', 'Rate ONDA')}
            data-testid={`rate-star-${place}-${n}`}
            className="p-1 transition-transform active:scale-90"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Star className="w-7 h-7" style={{ color: gray }} strokeWidth={1.6} fill="none" />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onTap}
        className={`text-sm ${light ? 'text-slate-500' : 'text-white/60'}`}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        {t('rate.title', 'Rate ONDA')}
      </button>
    </div>
  );
}
