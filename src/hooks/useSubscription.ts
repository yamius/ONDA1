import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { PurchasesPackage, PurchasesOfferings, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { revenueCatService, ENTITLEMENT_ID } from '../services/RevenueCatService';
import { supabase } from '../lib/supabase';
import { trackTenjinSubscriptionPaid } from '../lib/tenjin';
import { trackEvent } from '../services/AnalyticsService';

// Persisted paid-state baseline for the real-purchase detector below.
// Value is 'notpaid' | '<productId>:<latestPurchaseDateMillis>'. Absent (null)
// means "no history on this install" → a paid state seen on first load is a
// pre-existing sub (reinstall / new device), not a new purchase.
const PAID_STATE_KEY = 'onda_sub_paid_state';

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

  // Set true by restore() and by login-restore (auth SIGNED_IN) so the
  // customerInfo change they cause is recorded as a baseline but NEVER fires
  // `purchase`. A real new purchase goes through purchase() and does not set
  // this, so it still fires.
  const suppressNextPurchaseRef = useRef(false);

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

  // ── Real-purchase detector (Firebase `purchase` = revenue endpoint) ──
  // DECISIVE RULE: fire ONLY on a genuine not-paid → paid(NORMAL) transition.
  // This single guard keeps phantom revenue out of GA4:
  //   • restore button / login-restore  → suppressed explicitly (ref above)
  //   • reinstall / new device (first load already paid, no local history)
  //       → pre-existing: recorded as baseline, NOT fired
  //   • renewal (active → active, only latestPurchaseDate moved)
  //       → NOT fired (renewals belong to subscription_renew via the webhook)
  //   • trial ($0)  → NOT fired; the later trial→paid flip IS fired
  // State persists in localStorage as 'notpaid' | '<productId>:<ms>' so the
  // off-app trial→paid conversion (seen at next launch) still counts. Trial
  // start ($0) is `trial_start` elsewhere — never `purchase` (old phantom bug).
  useEffect(() => {
    if (!isNative) return;
    if (!state.customerInfo) return; // still loading — don't touch baseline

    const ent = state.customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
    const isPaidActive = !!ent && ent.isActive && ent.periodType === 'NORMAL';

    let prev: string | null = null;
    try { prev = localStorage.getItem(PAID_STATE_KEY); } catch {}

    // Not paid (no entitlement / inactive / trial / intro). Record so a later
    // flip to paid reads as a real transition. Never fires. Also clear any
    // pending suppress flag — a restore that found nothing must not muzzle a
    // future genuine purchase.
    if (!isPaidActive || !ent) {
      suppressNextPurchaseRef.current = false;
      if (prev !== 'notpaid') {
        try { localStorage.setItem(PAID_STATE_KEY, 'notpaid'); } catch {}
      }
      return;
    }

    const txnSig = `${ent.productIdentifier}:${(ent as any).latestPurchaseDateMillis ?? (ent as any).latestPurchaseDate ?? ent.originalPurchaseDate ?? ''}`;

    // Restore button / login-restore: record baseline, do NOT fire.
    if (suppressNextPurchaseRef.current) {
      suppressNextPurchaseRef.current = false;
      try { localStorage.setItem(PAID_STATE_KEY, txnSig); } catch {}
      return;
    }

    // First load already paid with no local history → pre-existing sub
    // (reinstall / new device / bought elsewhere). Baseline only, no fire.
    if (prev === null) {
      try { localStorage.setItem(PAID_STATE_KEY, txnSig); } catch {}
      return;
    }

    // Already paid before (prev is a txnSig): reopen, or renewal (date moved).
    // Neither is a new purchase — refresh the baseline silently.
    if (prev !== 'notpaid') {
      if (prev !== txnSig) {
        try { localStorage.setItem(PAID_STATE_KEY, txnSig); } catch {}
      }
      return;
    }

    // prev === 'notpaid' → genuine not-paid → paid transition: real purchase or
    // trial→paid conversion. THE ONLY path that fires `purchase`.
    //
    // Need offerings to attach revenue. If not loaded yet, wait — the effect
    // re-runs when state.offerings arrives (it's a dep). Leave prev='notpaid'
    // so we don't lose the event.
    if (!state.offerings) return;

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
      // Offerings loaded but this product isn't in them — fire with value=0
      // rather than miss the conversion (rare; ROAS imprecise for this one).
      console.warn('[useSubscription] No package found for paid entitlement', ent.productIdentifier);
    }

    try { localStorage.setItem(PAID_STATE_KEY, txnSig); } catch {}
    // Firebase ecommerce `purchase` (revenue endpoint) via System A so it
    // survives the Tenjin-mirror removal. Keep the name + value/currency so
    // GA4 counts it as revenue.
    trackEvent('purchase', {
      value,
      currency,
      product_id: ent.productIdentifier,
      plan,
    });
    trackTenjinSubscriptionPaid({
      value,
      currency,
      productId: ent.productIdentifier,
      plan,
    });
    console.log('[useSubscription] purchase fired (notpaid→paid):', {
      productId: ent.productIdentifier,
      value,
      txnSig,
    });
  }, [isNative, state.customerInfo, state.offerings]);

  // Listen for auth changes to login/logout with RevenueCat
  useEffect(() => {
    if (!isNative) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          await revenueCatService.login(session.user.id);
          const customerInfo = await revenueCatService.getCustomerInfo();
          const isPremium = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]?.isActive ?? false;
          // Login pulls an EXISTING entitlement — never a new purchase. Suppress
          // so the detector records it as a baseline instead of firing.
          suppressNextPurchaseRef.current = true;
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

    // Restore is never a new purchase — suppress the detector for the
    // customerInfo change it's about to cause.
    suppressNextPurchaseRef.current = true;

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
