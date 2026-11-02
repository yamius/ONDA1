/**
 * Task 096: classify a completed purchase by the entitlement's periodType.
 * Only TRIAL ($0 free trial) or INTRO (intro price) is a "trial start".
 * NORMAL = a direct paid purchase -> only `purchase` fires (via the
 * not-paid -> paid detector in useSubscription), never trial_start.
 */
export type PurchasePeriodType = 'TRIAL' | 'INTRO' | 'NORMAL' | 'PREPAID' | null;

export function getEntitlementPeriodType(
  customerInfo: any,
  entitlementId: string,
): PurchasePeriodType {
  const ent = customerInfo?.entitlements?.active?.[entitlementId];
  if (!ent || !ent.isActive) return null;
  return (ent.periodType as PurchasePeriodType) ?? null;
}

export function isTrialOrIntro(periodType: PurchasePeriodType): periodType is 'TRIAL' | 'INTRO' {
  return periodType === 'TRIAL' || periodType === 'INTRO';
}
