import React from 'react';
import { X, Sparkles, Zap, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OndShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOnd: number;
  isLightTheme: boolean;
}

const OND_PRICE = 0.33; // $0.33 per OND

export const OndShopModal: React.FC<OndShopModalProps> = ({
  isOpen,
  onClose,
  currentOnd,
  isLightTheme
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const packages = [
    { ond: 100, bonus: 0, icon: Sparkles, color: 'from-blue-500 to-cyan-500', popular: false },
    { ond: 500, bonus: 10, icon: Zap, color: 'from-purple-500 to-pink-500', popular: true },
    { ond: 1000, bonus: 20, icon: Crown, color: 'from-yellow-500 to-orange-500', popular: false },
    { ond: 2500, bonus: 30, icon: Crown, color: 'from-emerald-500 to-teal-500', popular: false },
  ];

  const calculatePrice = (ond: number, bonus: number) => {
    const basePrice = ond * OND_PRICE;
    return basePrice.toFixed(2);
  };

  const calculateTotalOnd = (ond: number, bonus: number) => {
    return Math.floor(ond + (ond * bonus / 100));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-2xl ${
        isLightTheme
          ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
          : 'bg-gradient-to-br from-gray-900 to-black text-white'
      } shadow-2xl border ${
        isLightTheme ? 'border-gray-300' : 'border-white/10'
      } overflow-hidden`}><div className="overflow-y-auto max-h-[90vh] no-scrollbar">

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isLightTheme
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {t('shop.title', 'OND Shop')}
            </h2>
            <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
              {t('shop.subtitle', 'Accelerate your spiritual evolution')}
            </p>
            <div className={`mt-4 inline-block px-6 py-3 rounded-full ${
              isLightTheme ? 'bg-gray-200' : 'bg-white/10'
            }`}>
              <span className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                {t('shop.your_balance', 'Your Balance')}:
              </span>
              <span className="ml-2 text-2xl font-bold text-yellow-400">
                {currentOnd.toFixed(1)} OND
              </span>
              <span className={`ml-3 text-lg font-mono ${isLightTheme ? 'text-gray-500' : 'text-gray-500'}`}>
                ≈ ${(currentOnd * OND_PRICE).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              const totalOnd = calculateTotalOnd(pkg.ond, pkg.bonus);
              const price = calculatePrice(pkg.ond, pkg.bonus);

              return (
                <div
                  key={index}
                  className={`relative rounded-xl p-6 transition-all ${
                    isLightTheme
                      ? 'bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/10 hover:border-white/30 hover:shadow-2xl'
                  } ${pkg.popular ? 'transform scale-105' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                        {t('shop.popular', 'POPULAR')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${pkg.color}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {pkg.bonus > 0 && (
                      <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        +{pkg.bonus}%
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-4xl font-bold text-yellow-400 mb-1">
                      {totalOnd.toLocaleString()}
                    </div>
                    <div className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                      OND {pkg.bonus > 0 && (
                        <span className="text-emerald-400">
                          ({pkg.ond} + {totalOnd - pkg.ond} {t('shop.bonus', 'bonus')})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-1">
                      ${price}
                    </div>
                    <div className={`text-xs ${isLightTheme ? 'text-gray-500' : 'text-gray-500'}`}>
                      ${OND_PRICE} {t('shop.per_ond', 'per OND')}
                    </div>
                  </div>

                  <button
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : isLightTheme
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-white hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    {t('shop.buy_now', 'Buy Now')}
                  </button>
                </div>
              );
            })}
          </div>

          <div className={`rounded-xl p-6 ${
            isLightTheme
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30'
          }`}>
            <h3 className="text-xl font-bold mb-3">
              💡 {t('shop.info_title', 'What is OND?')}
            </h3>
            <ul className={`space-y-2 ${isLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
              <li>• {t('shop.info_1', 'OND is the quantum unit of your spiritual progress')}</li>
              <li>• {t('shop.info_2', 'Unlock premium practices and artifacts')}</li>
              <li>• {t('shop.info_3', 'Accelerate your journey through consciousness circuits')}</li>
              <li>• {t('shop.info_4', 'Earn OND through daily practices or purchase for instant access')}</li>
            </ul>
          </div>

          <div className={`mt-6 text-center text-xs ${isLightTheme ? 'text-gray-500' : 'text-gray-500'}`}>
            {t('shop.secure_payment', 'Secure payment processing via Stripe')}
          </div>
        </div>
      </div></div>
    </div>
  );
};
