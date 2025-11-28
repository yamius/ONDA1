import { useState } from 'react';
import { X, Infinity, Headphones, Sparkles, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCircuit?: number;
}

export function SubscriptionModal({ isOpen, onClose, activeCircuit = 1 }: SubscriptionModalProps) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div 
        className="relative w-full h-full rounded-none sm:max-w-sm sm:max-h-[90vh] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          data-testid="button-close-subscription"
        >
          <X className="w-4 h-4 text-white/80" />
        </button>

        <div 
          className="flex-1 overflow-y-auto p-6 pt-14 pb-0 flex flex-col justify-center"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
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

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
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
            <div className="relative mb-3">
              <div className="absolute -top-3 right-4 bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full z-10">
                {t('subscription.trial_badge', '7-Day Free Trial')}
              </div>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`w-full text-left rounded-xl p-3 sm:p-4 transition-all ${
                  selectedPlan === 'yearly'
                    ? 'border-2 border-violet-400 bg-violet-900/30'
                    : 'border border-white/20 bg-transparent hover:bg-white/5'
                }`}
                data-testid="button-plan-yearly"
              >
                <p className="font-bold text-white mb-1 text-sm sm:text-base">{t('subscription.yearly', 'Yearly')}</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-white/50 line-through text-xs sm:text-sm">199.99 EUR</span>
                  <span className="text-white font-bold text-sm sm:text-base">49.99 EUR/</span>
                  <span className="text-white/80 text-xs sm:text-sm">4.17 EUR/mo. yr.</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`w-full text-left rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-2 border-violet-400 bg-violet-900/30'
                  : 'border border-white/20 bg-transparent hover:bg-white/5'
              }`}
              data-testid="button-plan-monthly"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-white text-sm sm:text-base">{t('subscription.monthly', 'Monthly')}</p>
                <p className="text-white text-sm sm:text-base">9.99 EUR/mo.</p>
              </div>
            </button>

            <button
              onClick={() => {
                window.open('https://chatgpt.com/s/t_6929571b682081919694a949d0609de8', '_blank');
              }}
              className="w-full bg-white hover:bg-gray-100 text-indigo-900 font-bold py-3 sm:py-4 rounded-full transition-colors shadow-lg text-sm sm:text-base"
              data-testid="button-start-trial"
            >
              {t('subscription.try_free', 'Try 7 Days Free')}
            </button>

            <p className="text-white/50 text-xs text-center mt-2 pb-1 leading-relaxed">
              {t('subscription.disclaimer', 'Totally free for 7 days, then 4.17 EUR/month, billed annually at 49.99 EUR/year. Cancel anytime.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
