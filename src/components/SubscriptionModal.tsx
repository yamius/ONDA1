import { useState, useMemo, useEffect } from 'react';
import { X, Infinity, Headphones, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import { useSubscription } from '../hooks/useSubscription';
import { LegalModal } from './LegalModal';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCircuit?: number;
}

export function SubscriptionModal({ isOpen, onClose, activeCircuit = 1 }: SubscriptionModalProps) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  
  const isIOS = useMemo(() => Capacitor.getPlatform() === 'ios', []);
  const isNative = useMemo(() => Capacitor.isNativePlatform(), []);
  
  const {
    isLoading,
    isPurchasing,
    isRestoring,
    offerings,
    isPremium,
    error,
    purchase,
    restore,
    getYearlyPackage,
    getMonthlyPackage,
    formatPrice,
    getTrialDuration,
  } = useSubscription();

  // Get packages
  const yearlyPackage = getYearlyPackage();
  const monthlyPackage = getMonthlyPackage();

  // Close modal if user becomes premium
  useEffect(() => {
    if (isPremium && isOpen) {
      onClose();
    }
  }, [isPremium, isOpen, onClose]);

  // Handle purchase
  const handlePurchase = async () => {
    setPurchaseError(null);
    
    const pkg = selectedPlan === 'yearly' ? yearlyPackage : monthlyPackage;
    if (!pkg) {
      setPurchaseError(t('subscription.error_no_product', 'Product not available'));
      return;
    }

    try {
      const success = await purchase(pkg);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setPurchaseError(err.message || t('subscription.error_purchase', 'Purchase failed'));
    }
  };

  // Handle restore
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

  // Format prices from RevenueCat or use fallback
  const yearlyPrice = yearlyPackage ? formatPrice(yearlyPackage) : '$64.99';
  const monthlyPrice = monthlyPackage ? formatPrice(monthlyPackage) : '$14.99';
  
  // Calculate monthly equivalent for yearly
  const yearlyMonthlyEquivalent = yearlyPackage 
    ? `${(yearlyPackage.product.price / 12).toFixed(2)} ${yearlyPackage.product.currencyCode}/mo.`
    : '5.42 USD/mo.';

  // Get trial durations
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
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div 
        className="relative w-full h-full sm:max-w-sm sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)',
          minHeight: isIOS ? '100%' : undefined,
        }}
      >
        <button
          onClick={onClose}
          className="absolute left-4 z-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors w-10 h-10"
          style={{
            top: isIOS ? 'calc(env(safe-area-inset-top) + 2px)' : '12px',
          }}
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
          <style>
            {`
              .subscription-content::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          
          <div>
            <p className="text-white/70 text-sm mb-1">{t('subscription.ready', 'Your plan is ready.')}</p>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {t('subscription.unlock', 'Unlock ONDA for free')}
            </h2>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Infinity className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                </div>
                <p className="text-yellow-400 font-medium pt-1 text-sm sm:text-base">
                  {t('subscription.feature1', 'Unlimited free access for 7 days')}
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                </div>
                <p className="text-white/80 pt-1 text-sm sm:text-base">
                  {t('subscription.feature2', '100+ audio practices for meditation, relaxation and growth')}
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                </div>
                <p className="text-white/80 pt-1 text-sm sm:text-base">
                  {t('subscription.feature3', 'Personalized practices based on your biometrics')}
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                </div>
                <p className="text-white/80 pt-1 text-sm sm:text-base">
                  {t('subscription.feature4', 'Real-time heart rate tracking during practices')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            {/* Yearly Plan */}
            <div className="relative mb-3">
              {yearlyTrial && (
                <div className="absolute -top-3 right-4 bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full z-10">
                  {yearlyTrial}
                </div>
              )}
              <button
                onClick={() => setSelectedPlan('yearly')}
                disabled={isLoading || isPurchasing}
                className={`w-full text-left rounded-xl p-3 sm:p-4 transition-all ${
                  selectedPlan === 'yearly'
                    ? 'border-2 border-violet-400 bg-violet-900/30'
                    : 'border border-white/20 bg-transparent hover:bg-white/5'
                } ${(isLoading || isPurchasing) ? 'opacity-50' : ''}`}
                data-testid="button-plan-yearly"
              >
                <p className="font-bold text-white mb-1 text-sm sm:text-base">{t('subscription.yearly', 'Yearly')}</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-white font-bold text-sm sm:text-base">{yearlyPrice}</span>
                  <span className="text-white/80 text-xs sm:text-sm">{yearlyMonthlyEquivalent}</span>
                </div>
              </button>
            </div>

            {/* Monthly Plan */}
            <div className="relative mb-4 sm:mb-6">
              {monthlyTrial && (
                <div className="absolute -top-3 right-4 bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full z-10">
                  {monthlyTrial}
                </div>
              )}
              <button
                onClick={() => setSelectedPlan('monthly')}
                disabled={isLoading || isPurchasing}
                className={`w-full text-left rounded-xl p-3 sm:p-4 transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-2 border-violet-400 bg-violet-900/30'
                    : 'border border-white/20 bg-transparent hover:bg-white/5'
                } ${(isLoading || isPurchasing) ? 'opacity-50' : ''}`}
                data-testid="button-plan-monthly"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-white text-sm sm:text-base">{t('subscription.monthly', 'Monthly')}</p>
                  <p className="text-white text-sm sm:text-base">{monthlyPrice}/mo.</p>
                </div>
              </button>
            </div>

            {/* Error message */}
            {(purchaseError || error) && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm text-center">
                {purchaseError || error}
              </div>
            )}

            {/* Purchase button */}
            <button
              onClick={handlePurchase}
              disabled={isLoading || isPurchasing || isRestoring}
              className={`w-full bg-white hover:bg-gray-100 text-indigo-900 font-bold py-3 sm:py-4 rounded-full transition-colors shadow-lg text-sm sm:text-base ${
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

            {/* Restore Purchases - Required by App Store */}
            {isNative && (
              <button
                onClick={handleRestore}
                disabled={isLoading || isPurchasing || isRestoring}
                className="w-full mt-3 text-white/60 hover:text-white/80 text-xs sm:text-sm flex items-center justify-center gap-2 py-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                {isRestoring 
                  ? t('subscription.restoring', 'Restoring...') 
                  : t('subscription.restore', 'Restore Purchases')
                }
              </button>
            )}

            {/* Legal Links - Required by App Store */}
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

      {/* Legal Modals */}
      {legalModal && (
        <LegalModal
          type={legalModal}
          onClose={() => setLegalModal(null)}
          isLightTheme={false}
        />
      )}
    </div>
  );
}
