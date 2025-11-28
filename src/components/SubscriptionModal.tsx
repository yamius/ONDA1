import { X, Infinity, Headphones, Sparkles, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCircuit?: number;
}

export function SubscriptionModal({ isOpen, onClose, activeCircuit = 1 }: SubscriptionModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div 
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
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
          <X className="w-5 h-5 text-white/80" />
        </button>

        <div className="p-6 pt-16 pb-4">
          <p className="text-white/70 text-sm mb-1">{t('subscription.ready', 'Your plan is ready.')}</p>
          <h2 className="text-white text-2xl font-bold mb-6">
            {t('subscription.unlock', 'Unlock ONDA for free')}
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                <Infinity className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-yellow-400 font-medium pt-1">
                {t('subscription.feature1', 'Unlimited free access for 7 days')}
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-4 h-4 text-white/80" />
              </div>
              <p className="text-white/80 pt-1">
                {t('subscription.feature2', '100+ audio practices for meditation and relaxation')}
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white/80" />
              </div>
              <p className="text-white/80 pt-1">
                {t('subscription.feature3', 'Personalized practices based on your biometrics')}
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-white/80" />
              </div>
              <p className="text-white/80 pt-1">
                {t('subscription.feature4', 'Real-time heart rate tracking during practices')}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="relative mb-3">
            <div className="absolute -top-3 right-4 bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">
              {t('subscription.trial_badge', '7-Day Free Trial')}
            </div>
            <div className="border-2 border-violet-400 rounded-xl p-4 bg-violet-900/30">
              <p className="font-bold text-white mb-1">{t('subscription.yearly', 'Yearly')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-white/50 line-through text-sm">199.99 EUR</span>
                <span className="text-white font-bold">49.99 EUR/</span>
                <span className="text-white/80 text-sm">4.17 EUR/mo. yr.</span>
              </div>
            </div>
          </div>

          <div className="border border-white/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="font-bold text-white">{t('subscription.monthly', 'Monthly')}</p>
              <p className="text-white">9.99 EUR/mo.</p>
            </div>
          </div>

          <button
            className="w-full bg-white hover:bg-gray-100 text-indigo-900 font-bold py-4 rounded-full transition-colors shadow-lg"
            data-testid="button-start-trial"
          >
            {t('subscription.try_free', 'Try 7 Days Free')}
          </button>

          <p className="text-white/50 text-xs text-center mt-4 leading-relaxed">
            {t('subscription.disclaimer', 'Totally free for 7 days, then 4.17 EUR/month, billed annually at 49.99 EUR/year. Cancel anytime.')}
          </p>
        </div>
      </div>
    </div>
  );
}
