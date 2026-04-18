import { useState, useMemo, useEffect } from 'react';
import { X, Infinity, Headphones, Heart, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { useSubscription } from '../hooks/useSubscription';
import { useAnalytics } from '../hooks/useAnalytics';
import { supabase } from '../lib/supabase';
import { LegalModal } from './LegalModal';
import { AuthModal } from './AuthModal';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCircuit?: number;
}

const THEMES = {
  yearly: {
    gradient: 'linear-gradient(180deg, #1e1b4b 0%, #3b1565 30%, #5b1f8a 60%, #1e1b4b 100%)',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-300',
    featureHighlight: 'text-yellow-400',
    badgeBg: 'bg-yellow-400',
    badgeText: 'text-indigo-900',
    selectedBorder: 'border-amber-400',
    selectedBg: 'bg-amber-900/20',
    taglineColor: 'text-amber-300',
    ctaClass: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-indigo-900 hover:from-yellow-300 hover:to-amber-400',
  },
  monthly: {
    gradient: 'linear-gradient(180deg, #071525 0%, #0c2340 30%, #0a3260 60%, #071525 100%)',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-300',
    featureHighlight: 'text-cyan-400',
    badgeBg: 'bg-cyan-400',
    badgeText: 'text-slate-900',
    selectedBorder: 'border-cyan-400',
    selectedBg: 'bg-cyan-900/20',
    taglineColor: 'text-cyan-300',
    ctaClass: 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 hover:from-cyan-300 hover:to-teal-300',
  },
} as const;

export function SubscriptionModal({ isOpen, onClose, activeCircuit = 1 }: SubscriptionModalProps) {
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isIOS = useMemo(() => Capacitor.getPlatform() === 'ios', []);

  const theme = THEMES[selectedPlan];

  const {
    isLoading,
    isPurchasing,
    isRestoring,
    isPremium,
    error,
    purchase,
    restore,
    getYearlyPackage,
    getMonthlyPackage,
    formatPrice,
    getTrialDuration,
  } = useSubscription();

  const yearlyPackage = getYearlyPackage();
  const monthlyPackage = getMonthlyPackage();


  useEffect(() => {
    if (isPremium && isOpen) {
      onClose();
    }
  }, [isPremium, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (!showAuthModal) return;

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setShowAuthModal(false);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [isOpen, showAuthModal]);

  const handlePurchase = async () => {
    setPurchaseError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      track('paywall_auth_required', { plan: selectedPlan });
      setShowAuthModal(true);
      return;
    }

    const pkg = selectedPlan === 'yearly' ? yearlyPackage : monthlyPackage;
    if (!pkg) {
      setPurchaseError(t('subscription.error_no_product', 'Product not available'));
      return;
    }

    track('purchase_started', {
      plan: selectedPlan,
      product_id: pkg.product.identifier,
      price: pkg.product.price,
      currency: pkg.product.currencyCode,
    });

    try {
      const success = await purchase(pkg);
      if (success) {
        track('purchase_succeeded', {
          plan: selectedPlan,
          product_id: pkg.product.identifier,
        });
        onClose();
      } else {
        track('purchase_cancelled', { plan: selectedPlan });
      }
    } catch (err: any) {
      track('purchase_failed', {
        plan: selectedPlan,
        error: err?.message ?? 'unknown',
      });
      setPurchaseError(err.message || t('subscription.error_purchase', 'Purchase failed'));
    }
  };

  const handleRestore = async () => {
    setPurchaseError(null);
    try {
      const success = await restore();
      if (success) {
        onClose();
      } else {
        setPurchaseError(t('subscription.error_no_purchases', 'No purchases to restore'));
      }
    } catch (err: any) {
      setPurchaseError(err.message || t('subscription.error_restore', 'Restore failed'));
    }
  };

  const yearlyPrice = yearlyPackage ? formatPrice(yearlyPackage) : '$64.99';
  const monthlyPrice = monthlyPackage ? formatPrice(monthlyPackage) : '$14.99';

  const yearlyMonthlyEquivalent = yearlyPackage
    ? `${(yearlyPackage.product.price / 12).toFixed(2)} ${yearlyPackage.product.currencyCode}/mo.`
    : '5.42 USD/mo.';

  const yearlyTrial = yearlyPackage ? getTrialDuration(yearlyPackage) : t('subscription.trial_badge_yearly', '14-Day Free Trial');
  const monthlyTrial = monthlyPackage ? getTrialDuration(monthlyPackage) : t('subscription.trial_badge', '7-Day Free Trial');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full h-full sm:max-w-sm sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.gradient,
          minHeight: isIOS ? '100%' : undefined,
        }}
      >
        <button
          onClick={onClose}
          className="absolute left-4 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors w-10 h-10"
          style={{ top: isIOS ? 'calc(env(safe-area-inset-top) + 2px)' : '12px' }}
          data-testid="button-close-subscription"
        >
          <X className="w-5 h-5 text-white/80" />
        </button>

        <div
          className="flex-1 overflow-y-auto p-6 pb-6 flex flex-col justify-center sm:justify-start"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingTop: isIOS ? 'calc(env(safe-area-inset-top) + 56px)' : '56px',
            paddingBottom: isIOS ? 'calc(env(safe-area-inset-bottom) + 24px)' : '24px',
          }}
        >
          {/* Header */}
          <div>
            <p className="text-white/70 text-sm mb-1">{t('subscription.ready', 'Your plan is ready.')}</p>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {t('subscription.unlock', 'Unlock ONDA for free')}
            </h2>

            {/* Features */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 mt-6">
              {/* Feature 1 — trial highlight, changes color with theme */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${theme.iconBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                  <Infinity className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.featureHighlight} transition-colors duration-500`} />
                </div>
                <p className={`${theme.featureHighlight} font-medium pt-1 text-sm sm:text-base transition-colors duration-500`}>
                  {selectedPlan === 'yearly'
                    ? t('subscription.feature1_yearly', 'Unlimited free access for 14 days')
                    : t('subscription.feature1', 'Unlimited free access for 7 days')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${theme.iconBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                  <Headphones className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.iconColor} transition-colors duration-500`} />
                </div>
                <p className="text-white/80 pt-1 text-sm sm:text-base">
                  {t('subscription.feature2', '100+ audio practices for meditation, relaxation and growth')}
                </p>
              </div>

              {/* Feature 3 (was feature4) — heart rate */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${theme.iconBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.iconColor} transition-colors duration-500`} />
                </div>
                <p className="text-white/80 pt-1 text-sm sm:text-base">
                  {t('subscription.feature4', 'Real-time heart rate tracking during practices')}
                </p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="mt-4 sm:mt-6">
            {/* Yearly Plan */}
            <div className="relative mb-3">
              {yearlyTrial && (
                <div className={`absolute -top-3 right-4 ${theme.badgeBg} ${theme.badgeText} text-xs font-bold px-3 py-1 rounded-full z-10 transition-colors duration-500`}>
                  {yearlyTrial}
                </div>
              )}
              <button
                onClick={() => setSelectedPlan('yearly')}
                disabled={isLoading || isPurchasing}
                className={`w-full text-left rounded-xl p-3 sm:p-4 transition-all duration-300 ${
                  selectedPlan === 'yearly'
                    ? `border-2 ${theme.selectedBorder} ${theme.selectedBg}`
                    : 'border border-white/20 bg-transparent hover:bg-white/5'
                } ${(isLoading || isPurchasing) ? 'opacity-50' : ''}`}
                data-testid="button-plan-yearly"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-bold text-white text-sm sm:text-base">{t('subscription.yearly', 'Yearly')}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-bold text-sm sm:text-base">{yearlyPrice}</span>
                    <span className="text-white/60 text-xs">{yearlyMonthlyEquivalent}</span>
                  </div>
                </div>
                {/* Tagline expands when selected */}
                <div className={`overflow-hidden transition-all duration-300 ${selectedPlan === 'yearly' ? 'max-h-8 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <p className={`text-xs font-medium ${theme.taglineColor}`}>
                    {t('subscription.yearly_tagline', 'Best value · Save 64%')}
                  </p>
                </div>
              </button>
            </div>

            {/* Monthly Plan */}
            <div className="relative mb-4 sm:mb-6">
              {monthlyTrial && (
                <div className={`absolute -top-3 right-4 ${theme.badgeBg} ${theme.badgeText} text-xs font-bold px-3 py-1 rounded-full z-10 transition-colors duration-500`}>
                  {monthlyTrial}
                </div>
              )}
              <button
                onClick={() => setSelectedPlan('monthly')}
                disabled={isLoading || isPurchasing}
                className={`w-full text-left rounded-xl p-3 sm:p-4 transition-all duration-300 ${
                  selectedPlan === 'monthly'
                    ? `border-2 ${theme.selectedBorder} ${theme.selectedBg}`
                    : 'border border-white/20 bg-transparent hover:bg-white/5'
                } ${(isLoading || isPurchasing) ? 'opacity-50' : ''}`}
                data-testid="button-plan-monthly"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-bold text-white text-sm sm:text-base">{t('subscription.monthly', 'Monthly')}</p>
                  <p className="text-white text-sm sm:text-base">{monthlyPrice}/mo.</p>
                </div>
                {/* Tagline expands when selected */}
                <div className={`overflow-hidden transition-all duration-300 ${selectedPlan === 'monthly' ? 'max-h-8 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <p className={`text-xs font-medium ${theme.taglineColor}`}>
                    {t('subscription.monthly_tagline', 'Full flexibility · Cancel anytime')}
                  </p>
                </div>
              </button>
            </div>

            {/* Error */}
            {(purchaseError || error) && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm text-center">
                {purchaseError || error}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handlePurchase}
              disabled={isLoading || isPurchasing || isRestoring}
              className={`w-full ${theme.ctaClass} font-bold py-3 sm:py-4 rounded-full transition-all duration-500 shadow-lg text-sm sm:text-base ${
                (isLoading || isPurchasing || isRestoring) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              data-testid="button-start-trial"
            >
              {isPurchasing ? (
                t('subscription.processing', 'Processing...')
              ) : isLoading ? (
                t('subscription.loading', 'Loading...')
              ) : selectedPlan === 'yearly' ? (
                t('subscription.try_free_14', 'Try 14 Days Free')
              ) : (
                t('subscription.try_free', 'Try 7 Days Free')
              )}
            </button>

            {/* Disclaimer */}
            <p className="text-white/50 text-xs text-center mt-2 pb-1 leading-relaxed">
              {selectedPlan === 'yearly'
                ? t('subscription.disclaimer_yearly', 'Totally free for 14 days, then 5.42 USD/month, billed annually at 64.99 USD/year. Cancel anytime.')
                : t('subscription.disclaimer_monthly', 'Totally free for 7 days, then 14.99 USD/month. Cancel anytime.')}
            </p>

            {/* Restore Purchases — required by App Store */}
            <button
              onClick={handleRestore}
              disabled={isLoading || isPurchasing || isRestoring}
              className="w-full mt-3 text-white/60 hover:text-white/80 text-xs sm:text-sm flex items-center justify-center gap-2 py-2 transition-colors"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              {isRestoring
                ? t('subscription.restoring', 'Restoring...')
                : t('subscription.restore', 'Restore Purchases')}
            </button>

            {/* Legal Links */}
            <div className="flex items-center justify-center gap-3 mt-4 text-white/40 text-xs">
              <button
                onClick={() => setLegalModal('terms')}
                className="hover:text-white/60 underline transition-colors"
              >
                {t('auth.terms_of_use', 'Terms of Use')}
              </button>
              <span>|</span>
              <button
                onClick={() => setLegalModal('privacy')}
                className="hover:text-white/60 underline transition-colors"
              >
                {t('auth.privacy_policy', 'Privacy Policy')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {legalModal && (
        <LegalModal
          type={legalModal}
          onClose={() => setLegalModal(null)}
          isLightTheme={false}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          isLightTheme={false}
        />
      )}
    </div>
  );
}
