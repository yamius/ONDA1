/**
 * 101: purchase outcome → analytics. Only a short error CODE string is ever
 * sent (RevenueCat readableErrorCode / numeric code), never the message text.
 */
export type PurchaseOutcome =
  | { kind: 'ok' }
  | { kind: 'cancelled'; code: string }
  | { kind: 'failed'; code: string };

export function purchaseErrorCode(err: any): string {
  const raw = err?.readableErrorCode ?? err?.userInfo?.readableErrorCode ?? err?.code;
  if (raw == null || raw === '') return 'unknown';
  return String(raw).replace(/[^A-Za-z0-9_]/g, '_').slice(0, 40);
}

export function isUserCancelled(err: any): boolean {
  return !!err && (err.userCancelled === true || err.code === 1 || err.code === '1'
    || err.readableErrorCode === 'PURCHASE_CANCELLED' || err.readableErrorCode === 'PurchaseCancelledError');
}

export function classifyPurchaseError(err: any): PurchaseOutcome {
  return isUserCancelled(err)
    ? { kind: 'cancelled', code: 'user_cancelled' }
    : { kind: 'failed', code: purchaseErrorCode(err) };
}
