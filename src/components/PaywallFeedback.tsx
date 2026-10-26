import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { useAnalytics } from '../hooks/useAnalytics';
import { analytics } from '../services/AnalyticsService';
import {
  PAYWALL_FEEDBACK_EVENT, PAYWALL_FEEDBACK_REASONS, type PaywallFeedbackReason,
  wasPaywallFeedbackAsked, markPaywallFeedbackAsked,
} from '../lib/paywallFeedback';

const LABEL_FALLBACK: Record<PaywallFeedbackReason, string> = {
  price: 'Too expensive',
  try_first: 'I want to try first',
  unclear_value: 'Not sure why I should pay',
  other: 'Other',
};

/** One-time "what stopped you?" sheet after a paywall closed without a purchase (101). */
export function PaywallFeedback() {
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const isLight = useTheme().resolved === 'light';
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<string>('unknown');

  useEffect(() => {
    const onReq = (e: Event) => {
      if (analytics.isInternalTraffic()) return;
      const src = (e as CustomEvent).detail?.source || 'unknown';
      void wasPaywallFeedbackAsked().then((asked) => {
        if (asked) return;
        void markPaywallFeedbackAsked(); // shown once, even if it is then dismissed
        setSource(src);
        setOpen(true);
      });
    };
    window.addEventListener(PAYWALL_FEEDBACK_EVENT, onReq);
    return () => window.removeEventListener(PAYWALL_FEEDBACK_EVENT, onReq);
  }, []);

  if (!open) return null;

  const answer = (reason: PaywallFeedbackReason) => {
    track('paywall_feedback', { reason, paywall_source: source });
    setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[210] flex justify-center px-4"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }} data-testid="paywall-feedback">
      <div className={`relative w-full max-w-md rounded-2xl p-5 shadow-xl ${isLight ? 'bg-white text-slate-800' : 'bg-slate-900/95 text-white border border-white/10'}`}>
        <button type="button" aria-label="Close" onClick={() => setOpen(false)} data-testid="paywall-feedback-close"
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full ${isLight ? 'bg-slate-100' : 'bg-white/10'}`}>
          <X className="h-4 w-4" />
        </button>
        <div className="mb-3 pr-8 text-sm font-semibold">{t('paywall_feedback.title', 'What stopped you?')}</div>
        <div className="flex flex-col gap-2">
          {PAYWALL_FEEDBACK_REASONS.map((r) => (
            <button key={r} type="button" onClick={() => answer(r)} data-testid={`paywall-feedback-${r}`}
              className={`rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${isLight ? 'bg-violet-50 hover:bg-violet-100 text-violet-800' : 'bg-white/10 hover:bg-white/15'}`}>
              {t(`paywall_feedback.${r}`, LABEL_FALLBACK[r])}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
