import { describe, it, expect } from 'vitest';
import { getEntitlementPeriodType, isTrialOrIntro } from './purchasePeriod';

const ci = (periodType: string, isActive = true) => ({
  entitlements: { active: { 'ONDA Premium': { isActive, periodType } } },
});

describe('purchasePeriod', () => {
  it('TRIAL and INTRO are trial starts', () => {
    expect(isTrialOrIntro(getEntitlementPeriodType(ci('TRIAL'), 'ONDA Premium'))).toBe(true);
    expect(isTrialOrIntro(getEntitlementPeriodType(ci('INTRO'), 'ONDA Premium'))).toBe(true);
  });
  it('NORMAL (direct paid) is not a trial start', () => {
    expect(isTrialOrIntro(getEntitlementPeriodType(ci('NORMAL'), 'ONDA Premium'))).toBe(false);
  });
  it('missing / inactive entitlement -> null, not a trial', () => {
    expect(getEntitlementPeriodType(null, 'ONDA Premium')).toBe(null);
    expect(getEntitlementPeriodType(ci('TRIAL', false), 'ONDA Premium')).toBe(null);
    expect(isTrialOrIntro(null)).toBe(false);
  });
});
