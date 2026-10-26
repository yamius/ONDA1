import { describe, it, expect } from 'vitest';
import { classifyPurchaseError, purchaseErrorCode } from './purchaseErrors';

describe('purchase errors (101)', () => {
  it('cancel vs fail, code only (no message)', () => {
    expect(classifyPurchaseError({ userCancelled: true, message: 'x@y.z' })).toEqual({ kind: 'cancelled', code: 'user_cancelled' });
    expect(classifyPurchaseError({ code: 1 })).toEqual({ kind: 'cancelled', code: 'user_cancelled' });
    expect(classifyPurchaseError({ code: 5, readableErrorCode: 'STORE_PROBLEM', message: 'secret' })).toEqual({ kind: 'failed', code: 'STORE_PROBLEM' });
    expect(purchaseErrorCode(new Error('boom'))).toBe('unknown');
    expect(purchaseErrorCode({ code: 'NETWORK ERROR!' })).toBe('NETWORK_ERROR_');
  });
});
