import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { PurchasesPackage, PurchasesOfferings, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { revenueCatService, ENTITLEMENT_ID } from '../services/RevenueCatService';
import { supabase } from '../lib/supabase';

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
        // Initialize RevenueCat
        await revenueCatService.initialize();

        // Login with Supabase user ID if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await revenueCatService.login(user.id);
        }

        // Load offerings and customer info
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

  // Helper: Get yearly package
  const getYearlyPackage = useCallback((): PurchasesPackage | undefined => {
    return state.offerings?.current?.availablePackages.find(
      pkg => pkg.packageType === 'ANNUAL'
    );
  }, [state.offerings]);

  // Helper: Get monthly package
  const getMonthlyPackage = useCallback((): PurchasesPackage | undefined => {
    return state.offerings?.current?.availablePackages.find(
      pkg => pkg.packageType === 'MONTHLY'
    );
  }, [state.offerings]);

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
