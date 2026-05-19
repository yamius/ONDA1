import { X, Sparkles, Zap, Crown, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OndShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOnd: number;
}

const OND_PRICE = 0.33;

export const OndShopModal: React.FC<OndShopModalProps> = ({
  isOpen,
  onClose,
  currentOnd,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const packages = [
    { ond: 100, bonus: 0, icon: Sparkles, color: 'from-blue-500 to-cyan-500', popular: false },
    { ond: 500, bonus: 10, icon: Zap, color: 'from-purple-500 to-pink-500', popular: true },
    { ond: 1000, bonus: 20, icon: Crown, color: 'from-yellow-500 to-orange-500', popular: false },
    { ond: 2500, bonus: 30, icon: Crown, color: 'from-emerald-500 to-teal-500', popular: false },
  ];

  const calculatePrice = (ond: number) => {
    const basePrice = ond * OND_PRICE;
    return basePrice.toFixed(2);
  };

  const calculateTotalOnd = (ond: number, bonus: number) => {
    return Math.floor(ond + (ond * bonus / 100));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto pt-[env(safe-area-inset-top)]">
      <div className="bg-bg text-text-primary max-w-6xl w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl border border-cyan-500/30 shadow-2xl my-4">
        <div className="sticky top-0 bg-bg/95 backdrop-blur-sm border-b border-cyan-500/30 p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-bold">{t('shop.title', 'OND Shop')}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-all"
            data-testid="button-close-shop"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="text-center">
            <p className="text-text-muted mb-4">
              {t('shop.subtitle', 'Accelerate your spiritual evolution')}
            </p>
            <div className="inline-block px-4 sm:px-6 py-3 rounded-full bg-surface-2 border border-cyan-500/20">
              <span className="text-sm text-text-muted">
                {t('shop.your_balance', 'Your Balance')}:
              </span>
              <span className="ml-2 text-xl sm:text-2xl font-bold text-yellow-400">
                {currentOnd.toFixed(1)} OND
              </span>
              <span className="ml-2 sm:ml-3 text-base sm:text-lg font-mono text-text-muted">
                ≈ ${(currentOnd * OND_PRICE).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              const totalOnd = calculateTotalOnd(pkg.ond, pkg.bonus);
              const price = calculatePrice(pkg.ond);

              return (
                <div
                  key={index}
                  className={`relative rounded-xl p-4 sm:p-5 transition-all bg-surface-2 border ${
                    pkg.popular
                      ? 'border-accent-2/50 shadow-lg shadow-accent-2/10'
                      : 'border-border/15 hover:border-border/25'
                  }`}
                  data-testid={`shop-package-${pkg.ond}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {t('shop.popular', 'POPULAR')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${pkg.color}`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    {pkg.bonus > 0 && (
                      <div className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        +{pkg.bonus}%
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-0.5">
                      {totalOnd.toLocaleString()}
                    </div>
                    <div className="text-sm text-text-muted">
                      OND {pkg.bonus > 0 && (
                        <span className="text-emerald-400">
                          ({pkg.ond} + {totalOnd - pkg.ond} {t('shop.bonus', 'bonus')})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xl sm:text-2xl font-bold">
                      ${price}
                    </div>
                    <div className="text-xs text-text-muted">
                      ${OND_PRICE} {t('shop.per_ond', 'per OND')}
                    </div>
                  </div>

                  <button
                    className={`w-full py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'bg-surface hover:opacity-80 text-text-primary'
                    }`}
                    data-testid={`button-buy-${pkg.ond}`}
                  >
                    {t('shop.buy_now', 'Buy Now')}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl p-4 sm:p-5 bg-surface-2 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold">
                {t('shop.info_title', 'What is OND?')}
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{t('shop.info_1', 'OND is the quantum unit of your spiritual progress')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{t('shop.info_2', 'Unlock premium practices and artifacts')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{t('shop.info_3', 'Accelerate your journey through consciousness circuits')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{t('shop.info_4', 'Earn OND through daily practices or purchase for instant access')}</span>
              </li>
            </ul>
          </div>

          <div className="text-center text-xs text-text-muted">
            {t('shop.secure_payment', 'Secure payment processing via Stripe')}
          </div>
        </div>
      </div>
    </div>
  );
};
