import { X } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';
import { METRIC_DETAILS, type MetricDetail } from '../data/bioMetrics';
import { METRIC_DETAILS_ES } from '../data/bioMetrics.es';
import { METRIC_DETAILS_RU } from '../data/bioMetrics.ru';
import { METRIC_DETAILS_UK } from '../data/bioMetrics.uk';
import { METRIC_DETAILS_ZH } from '../data/bioMetrics.zh';

// Metric descriptions per UI language; English is the fallback.
const DETAILS_BY_LANG: Record<string, Record<string, MetricDetail>> = {
  en: METRIC_DETAILS,
  es: METRIC_DETAILS_ES,
  ru: METRIC_DETAILS_RU,
  uk: METRIC_DETAILS_UK,
  zh: METRIC_DETAILS_ZH,
};

interface MetricInfoModalProps {
  metricKey: string | null;
  onClose: () => void;
}

/**
 * Description popup for an individual biometric card on the Connection screen.
 * Source of truth for the texts is `src/data/bioMetrics.ts`. The texts describe
 * the app's own formulas in `src/hooks/useVitals.ts` and intentionally differ
 * from the website's in-browser camera tool (https://onda-life.com/bio).
 *
 * Style intentionally matches the parent ConnectionModal — same outer frame,
 * same close button, same scroll behaviour — minus the extra ornamentation
 * (no arrows, no per-card decorative chrome) per the request.
 *
 * Translations live next to it in src/data/bioMetrics.<lang>.ts (es, ru, uk,
 * zh); the popup follows the UI language and falls back to English. Keep the
 * translations in sync when bioMetrics.ts changes.
 */
export const MetricInfoModal: React.FC<MetricInfoModalProps> = ({
  metricKey,
  onClose,
}) => {
  const { i18n } = useTranslation();
  if (!metricKey) return null;

  const lang = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
  const detail: MetricDetail | undefined =
    (DETAILS_BY_LANG[lang] ?? METRIC_DETAILS)[metricKey] ?? METRIC_DETAILS[metricKey];
  if (!detail) return null;

  const isAndroid = Capacitor.getPlatform() === 'android';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div className="max-w-md w-full h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-3rem)] rounded-2xl border border-border/15 relative flex flex-col bg-bg text-text-primary">
        <div className="sticky top-0 z-10 pt-6 px-6 sm:pt-8 sm:px-8 pb-4 rounded-t-2xl bg-bg">
          <button
            onClick={onClose}
            className={`absolute right-4 p-2 rounded-full transition-all hover:bg-border/10 ${
              isAndroid ? 'top-8' : 'top-4'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-light mb-1 pr-8">{detail.shortTitle}</h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              {detail.title}
            </p>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="space-y-5 text-sm sm:text-base leading-relaxed">
            {detail.sections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                {section.heading && (
                  <h3 className="text-base sm:text-lg font-semibold text-accent-2">
                    {section.heading}
                  </h3>
                )}
                {section.body && (
                  <p className="text-text-primary/80">
                    {section.body}
                  </p>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="text-text-primary/80">
                        <span className="block font-semibold text-accent-2">
                          {b.label}
                        </span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.highlight && (
                  <p className="mt-3 italic px-4 py-3 rounded-lg border-l-2 bg-accent-2/10 border-accent-2/60 text-text-primary/90">
                    {section.highlight}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricInfoModal;
