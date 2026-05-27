import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { PurchasesPackage, PurchasesOfferings, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { revenueCatService, ENTITLEMENT_ID } from '../services/RevenueCatService';
import { supabase } from '../lib/supabase';
import { trackTenjinSubscriptionPaid } from '../lib/tenjin';

interface SubscriptionState {
  // Loading states
  isLoading: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;
  
  // Data
  offerings: PurchasesOfferings | null;
  customerInfo: CustomerInfo | null;
  
  // Subscription status
  isPremium: boolean;
  
  // Error
  error: string | null;
}

interface UseSubscriptionReturn extends SubscriptionState {
  // Actions
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  refresh: () => Promise<void>;
  
  // Helpers
  getYearlyPackage: () => PurchasesPackage | undefined;
  getMonthlyPackage: () => PurchasesPackage | undefined;
  formatPrice: (pkg: PurchasesPackage) => string;
  getTrialDuration: (pkg: PurchasesPackage) => string | null;
}

export function useSubscription(): UseSubscriptionReturn {
  const [state, setState] = useState<SubscriptionState>({
    isLoading: true,
    isPurchasing: false,
    isRestoring: false,
    offerings: null,
    customerInfo: null,
    isPremium: false,
    error: null,
  });

  const platform = Capacitor.getPlatform();
  const isNative = platform === 'ios' || platform === 'android';

  // Initialize and load data
  useEffect(() => {
    const init = async () => {
      if (!isNative) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        await revenueCatService.initialize();

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await revenueCatService.login(user.id);
        }

        const [offerings, customerInfo] = await Promise.all([
          revenueCatService.getOfferings(),
          revenueCatService.getCustomerInfo(),
        ]);

        const isPremium = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]?.isActive ?? false;

        setState(prev => ({
          ...prev,
          isLoading: false,
          offerings,
          customerInfo,
          isPremium,
          error: null,
        }));
      } catch (error: any) {
        console.error('[useSubscription] Init error:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to initialize subscriptions',
        }));
      }
    };

    init();
  }, [isNative]);

  // Детектор реальной оплаты подписки (trial → paid конверсия или
  // прямая покупка без триала). Фаерит Firebase `purchase` event с
  // реальной выручкой — ровно один раз на транзакцию через localStorage
  // dedupe по (productId + originalPurchaseDate).
  //
  // Зачем: раньше Firebase `purchase` фаерилось на trial start с полной
  // ценой подписки → фантомная выручка в GA4 и врущий ROAS в Google Ads.
  // Trial — это $0 на стороне Apple; реальная выручка появляется когда
  // Apple списывает деньги после trial-периода. Это происходит off-app,
  // и detection срабатывает на следующем открытии (или сразу если юзер
  // в app в момент конверсии).
  useEffect(() => {
    if (!state.customerInfo) return;
    const ent = state.customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
    if (!ent || !ent.isActive) return;
    // Только реальное paid состояние — TRIAL и INTRO пропускаем.
    if (ent.periodType !== 'NORMAL') return;

    const txnKey = `onda_subscription_paid_fired_${ent.productIdentifier}_${ent.originalPurchaseDate}`;
    if (localStorage.getItem(txnKey) === '1') return;

    // Лукапим цену из offerings (для корректного value в Firebase).
    // Если offerings ещё не загружены — пропускаем, useEffect перезапустится
    // когда они придут.
    let value = 0;
    let currency = 'USD';
    let plan: string | undefined;
    const o = state.offerings as any;
    const offering = o?.current ?? o?.all?.['default'] ?? o;
    const allPkgs: PurchasesPackage[] = offering?.availablePackages
      ?? [offering?.monthly, offering?.annual, offering?.yearly].filter(Boolean);
    const pkg = allPkgs?.find(
      (p) => p.product?.identifier === ent.productIdentifier,
    );
    if (pkg?.product?.price != null) {
      value = pkg.product.price;
      currency = pkg.product.currencyCode ?? 'USD';
      plan = (pkg as any).packageType?.toString();
    } else {
      // Нет offerings → fall back на defaults и всё равно фаерим, чтобы
      // не потерять событие. ROAS будет неточным для этого случая, но
      // лучше чем пропустить транзакцию.
      console.warn('[useSubscription] No package found for paid entitlement', ent.productIdentifier);
    }

    localStorage.setItem(txnKey, '1');
    trackTenjinSubscriptionPaid({
      value,
      currency,
      productId: ent.productIdentifier,
      plan,
    });
    console.log('[useSubscription] subscription_paid fired:', {
      productId: ent.productIdentifier,
      value,
      originalPurchaseDate: ent.originalPurchaseDate,
    });
  }, [state.customerInfo, state.offerings]);

  // Listen for auth changes to login/logout with RevenueCat
  useEffect(() => {
    if (!isNative) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          await revenueCatService.login(session.user.id);
          const customerInfo = await revenueCatService.getCustomerInfo();
          const isPremium = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]?.isActive ?? false;
          setState(prev => ({ ...prev, customerInfo, isPremium }));
        } catch (error) {
          console.error('[useSubscription] Auth change login error:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        await revenueCatService.logout();
        setState(prev => ({ ...prev, customerInfo: null, isPremium: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [isNative]);

  // Purchase a package
  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    if (!isNative) {
      console.warn('[useSubscription] Purchase not available on web');
      return false;
    }

    setState(prev => ({ ...prev, isPurchasing: true, error: null }));

    try {
      const customerInfo = await revenueCatService.purchasePackage(pkg);
      
      if (customerInfo) {
        const isPremium = customerInfo.entitlements?.active?.[ENTITLEMENT_ID]?.isActive ?? false;
        setState(prev => ({
          ...prev,
          isPurchasing: false,
          customerInfo,
          isPremium,
        }));
        return isPremium;
      }

      // User cancelled
      setState(prev => ({ ...prev, isPurchasing: false }));
      return false;
    } catch (error: any) {
      console.error('[useSubscription] Purchase error:', error);
      setState(prev => ({
        ...prev,
        isPurchasing: false,
        error: error.message || 'Purchase failed',
      }));
      return false;
    }
  }, [isNative]);

  // Restore purchases
  const restore = useCallback(async (): Promise<boolean> => {
    if (!isNative) return false;

    setState(prev => ({ ...prev, isRestoring: true, error: null }));

    try {
      const customerInfo = await revenueCatService.restorePurchases();
      const isPremium = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]?.isActive ?? false;

      setState(prev => ({
        ...prev,
        isRestoring: false,
        customerInfo,
        isPremium,
      }));

      return isPremium;
    } catch (error: any) {
      console.error('[useSubscription] Restore error:', error);
      setState(prev => ({
        ...prev,
        isRestoring: false,
        error: error.message || 'Restore failed',
      }));
      return false;
    }
  }, [isNative]);

  // Refresh subscription status
  const refresh = useCallback(async (): Promise<void> => {
    if (!isNative) return;

    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      const isPremium = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]?.isActive ?? false;
      setState(prev => ({ ...prev, customerInfo, isPremium }));
    } catch (error) {
      console.error('[useSubscription] Refresh error:', error);
    }
  }, [isNative]);

  const getDefaultOffering = useCallback(() => {
    const o = state.offerings as any;
    if (!o) return null;
    // Direct current
    if (o.current) return o.current;
    // Via all map
    if (o.all?.['default']) return o.all['default'];
    // Offerings itself might be the offering (flat structure from Capacitor)
    if (o.availablePackages) return o;
    return null;
  }, [state.offerings]);

  // Helper: Get yearly package
  const getYearlyPackage = useCallback((): PurchasesPackage | undefined => {
    const offering = getDefaultOffering() as any;
    if (!offering) return undefined;
    // Try availablePackages first, then direct property (Capacitor plugin format)
    if (offering.availablePackages?.length) {
      return offering.availablePackages.find(
        (pkg: PurchasesPackage) => pkg.packageType === 'ANNUAL'
      );
    }
    return offering.annual ?? offering.yearly ?? undefined;
  }, [getDefaultOffering]);

  // Helper: Get monthly package
  const getMonthlyPackage = useCallback((): PurchasesPackage | undefined => {
    const offering = getDefaultOffering() as any;
    if (!offering) return undefined;
    if (offering.availablePackages?.length) {
      return offering.availablePackages.find(
        (pkg: PurchasesPackage) => pkg.packageType === 'MONTHLY'
      );
    }
    return offering.monthly ?? undefined;
  }, [getDefaultOffering]);

  // Helper: Format price string
  const formatPrice = useCallback((pkg: PurchasesPackage): string => {
    return pkg.product.priceString;
  }, []);

  // Helper: Get trial duration
  const getTrialDuration = useCallback((pkg: PurchasesPackage): string | null => {
    const introPrice = pkg.product.introPrice;
    if (!introPrice || introPrice.price !== 0) return null;

    const period = introPrice.periodNumberOfUnits;
    const unit = introPrice.periodUnit;

    switch (unit) {
      case 'DAY':
        return `${period}-Day Free Trial`;
      case 'WEEK':
        return period === 1 ? '7-Day Free Trial' : `${period * 7}-Day Free Trial`;
      case 'MONTH':
        return `${period}-Month Free Trial`;
      case 'YEAR':
        return `${period}-Year Free Trial`;
      default:
        return 'Free Trial';
    }
  }, []);

  return {
    ...state,
    purchase,
    restore,
    refresh,
    getYearlyPackage,
    getMonthlyPackage,
    formatPrice,
    getTrialDuration,
  };
}

export default useSubscription;
