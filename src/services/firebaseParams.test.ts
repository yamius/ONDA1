import { describe, it, expect } from 'vitest';
import { _sanitizeFirebaseParams, FIREBASE_NUMERIC_PARAMS } from './AnalyticsService';

describe('_sanitizeFirebaseParams (103)', () => {
  it('stringifies custom numbers, keeps reserved e-commerce numbers', () => {
    const out = _sanitizeFirebaseParams({
      time_percent: 87, practice_index: 2, quality: 0.8333333333333334,
      value: 9.99, price: 4.99, quantity: 1, currency: 'USD',
    });
    expect(out.time_percent).toBe('87');
    expect(out.practice_index).toBe('2');
    expect(out.quality).toBe('0.8333333333333334');
    expect(out.value).toBe(9.99);
    expect(out.price).toBe(4.99);
    expect(out.quantity).toBe(1);
    expect(out.currency).toBe('USD');
    expect(FIREBASE_NUMERIC_PARAMS.has('value')).toBe(true);
  });

  it('booleans become strings, null/undefined are dropped', () => {
    const out = _sanitizeFirebaseParams({ a: true, b: false, c: null, d: undefined });
    expect(out).toEqual({ a: 'true', b: 'false' });
  });

  it('purchase keeps value number + currency string', () => {
    const out = _sanitizeFirebaseParams({ value: 0, currency: 'EUR', product_id: 'x', plan: 'ANNUAL' });
    expect(out).toEqual({ value: 0, currency: 'EUR', product_id: 'x', plan: 'ANNUAL' });
  });
});
