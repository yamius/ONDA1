import { X } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { METRIC_DETAILS, type MetricDetail } from '../data/bioMetrics';

interface MetricInfoModalProps {
  metricKey: string | null;
  onClose: () => void;
  isLightTheme: boolean;
}

/**
 * Description popup for an individual biometric card on the Connection screen.
 * Source of truth for the texts is `src/data/bioMetrics.ts`, which mirrors
 * the structured copy on the public bio page (https://onda-life.com/bio).
 *
 * Style intentionally matches the parent ConnectionModal — same outer frame,
 * same close button, same scroll behaviour — minus the extra ornamentation
 * (no arrows, no per-card decorative chrome) per the request.
 *
 * The bio copy is currently English-only because the marketing page itself
 * is English-only. When the bio page gets localized, swap METRIC_DETAILS for
 * an i18n-keyed equivalent here.
 */
export const MetricInfoModal: React.FC<MetricInfoModalProps> = ({
  metricKey,
  onClose,
  isLightTheme,
}) => {
  if (!metricKey) return null;

  const detail: MetricDetail | undefined = METRIC_DETAILS[metricKey];
  if (!detail) return null;

  const isAndroid = Capacitor.getPlatform() === 'android';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div
        className={`max-w-md w-full h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-3rem)] rounded-2xl border relative flex flex-col ${
          isLightTheme
            ? 'bg-white border-gray-300'
            : 'bg-gradient-to-br from-gray-900 to-black border-purple-500/30'
        }`}
      >
        <div
          className={`sticky top-0 z-10 pt-6 px-6 sm:pt-8 sm:px-8 pb-4 rounded-t-2xl ${
            isLightTheme ? 'bg-white' : 'bg-gradient-to-br from-gray-900 to-gray-900'
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute right-4 p-2 rounded-full transition-all ${
              isAndroid ? 'top-8' : 'top-4'
            } ${isLightTheme ? 'hover:bg-gray-200' : 'hover:bg-white/10'}`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-light mb-1 pr-8">{detail.shortTitle}</h2>
            <p className={`text-xs sm:text-sm ${isLightTheme ? 'text-gray-600' : 'text-white/70'}`}>
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
                  <h3
                    className={`text-base sm:text-lg font-semibold ${
                      isLightTheme ? 'text-gray-900' : 'text-purple-200'
                    }`}
                  >
                    {section.heading}
                  </h3>
                )}
                {section.body && (
                  <p className={isLightTheme ? 'text-gray-700' : 'text-white/80'}>
                    {section.body}
                  </p>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {section.bullets.map((b, j) => (
                      <li key={j} className={isLightTheme ? 'text-gray-700' : 'text-white/80'}>
                        <span
                          className={`block font-semibold ${
                            isLightTheme ? 'text-gray-900' : 'text-purple-300'
                          }`}
                        >
                          {b.label}
                        </span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.highlight && (
                  <p
                    className={`mt-3 italic px-4 py-3 rounded-lg border-l-2 ${
                      isLightTheme
                        ? 'bg-purple-50 border-purple-300 text-gray-800'
                        : 'bg-purple-500/10 border-purple-400/60 text-white/90'
                    }`}
                  >
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
