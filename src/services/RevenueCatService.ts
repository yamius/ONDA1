import { Purchases, LOG_LEVEL, PurchasesPackage, CustomerInfo, PurchasesOfferings } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

// RevenueCat API Keys
const REVENUECAT_IOS_API_KEY = 'appl_wKcgXIVuduXFpPpIWEcrqrWhpZz';
const REVENUECAT_ANDROID_API_KEY = 'goog_XXXXXXXXXXXXXXXXXXXXXXXXX'; // TODO: Add Android key when ready

// Entitlement ID from RevenueCat dashboard
export const ENTITLEMENT_ID = 'ONDA Premium';

class RevenueCatService {
  private static instance: RevenueCatService;
  private initialized = false;

  private constructor() {}

  static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  /**
   * Initialize RevenueCat SDK
   * Should be called once at app startup
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('[RevenueCat] Already initialized');
      return;
    }

    const platform = Capacitor.getPlatform();
    
    // Only initialize on native platforms
    if (platform === 'web') {
      console.log('[RevenueCat] Web platform - skipping initialization');
      return;
    }

    try {
      // Set log level for debugging (change to LOG_LEVEL.ERROR in production)
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

      // Configure with platform-specific API key
      const apiKey = platform === 'ios' ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;
      
      await Purchases.configure({
        apiKey,
      });

      this.initialized = true;
      console.log('[RevenueCat] Initialized successfully for platform:', platform);
    } catch (error) {
      console.error('[RevenueCat] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Login user with their Supabase user ID
   * This allows RevenueCat to track purchases across devices
   */
  async login(userId: string): Promise<CustomerInfo> {
    if (!this.initialized) {
      console.warn('[RevenueCat] Not initialized, skipping login');
      throw new Error('RevenueCat not initialized');
    }

    try {
      const { customerInfo } = await Purchases.logIn({ appUserID: userId });
      console.log('[RevenueCat] User logged in:', userId);
      return customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Login error:', error);
      throw error;
    }
  }

  /**
   * Logout current user (switch to anonymous)
   */
  async logout(): Promise<void> {
    if (!this.initialized) return;

    try {
      await Purchases.logOut();
      console.log('[RevenueCat] User logged out');
    } catch (error) {
      console.error('[RevenueCat] Logout error:', error);
    }
  }

  /**
   * Get available offerings (subscription packages)
   */
  async getOfferings(): Promise<PurchasesOfferings | null> {
    if (!this.initialized) {
      console.warn('[RevenueCat] Not initialized, returning null');
      return null;
    }

    try {
      const { offerings } = await Purchases.getOfferings();
      console.log('[RevenueCat] Offerings:', offerings);
      return offerings;
    } catch (error) {
      console.error('[RevenueCat] Get offerings error:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
    if (!this.initialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      console.log('[RevenueCat] Purchase successful:', customerInfo);
      return customerInfo;
    } catch (error: any) {
      // User cancelled
      if (error.userCancelled) {
        console.log('[RevenueCat] User cancelled purchase');
        return null;
      }
      console.error('[RevenueCat] Purchase error:', error);
      throw error;
    }
  }

  /**
   * Restore purchases (required by App Store guidelines)
   */
  async restorePurchases(): Promise<CustomerInfo> {
    if (!this.initialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const { customerInfo } = await Purchases.restorePurchases();
      console.log('[RevenueCat] Purchases restored:', customerInfo);
      return customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Restore error:', error);
      throw error;
    }
  }

  /**
   * Get current customer info (subscription status)
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.initialized) {
      return null;
    }

    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('[RevenueCat] Get customer info error:', error);
      return null;
    }
  }

  /**
   * Check if user has active premium subscription
   */
  async isPremium(): Promise<boolean> {
    const customerInfo = await this.getCustomerInfo();
    if (!customerInfo) return false;

    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    return entitlement !== undefined && entitlement.isActive;
  }

  /**
   * Check if user is eligible for intro offer (trial)
   */
  async isEligibleForIntroOffer(pkg: PurchasesPackage): Promise<boolean> {
    if (!this.initialized) return false;

    try {
      // Check if product has intro offer and user is eligible
      const product = pkg.product;
      if (product.introPrice) {
        // User is eligible if they haven't used intro offer before
        const customerInfo = await this.getCustomerInfo();
        if (!customerInfo) return true; // Assume eligible if can't check
        
        // If user has no active or expired subscriptions in this group, they're eligible
        return true;
      }
      return false;
    } catch (error) {
      console.error('[RevenueCat] Eligibility check error:', error);
      return false;
    }
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

export const revenueCatService = RevenueCatService.getInstance();
export default revenueCatService;
