import { storeSettings } from "@/lib/data/settings";

/**
 * PROTOTYPE ONLY — simulated Multibanco reference generator.
 *
 * This produces a deterministic, fake Entidade/Referência pair purely for
 * front-end demo purposes. In production, replace this with a server-side
 * call to a real Portuguese payment provider (e.g. IfThenPay, Easypay, or
 * SIBS/Multibanco direct integration) that returns a genuine reference
 * tied to the order, and never trust a client-generated value for payment.
 */
export interface MultibancoPayment {
  entity: string;
  reference: string;
  amount: number;
  expiresAt: string;
}

function hashToDigits(input: string, digits: number): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  const str = hash.toString().padStart(digits, "0");
  return str.slice(-digits);
}

export function generateMultibancoPayment(
  orderId: string,
  amount: number
): MultibancoPayment {
  const raw = hashToDigits(orderId, 9);
  const reference = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 9)}`;
  const expires = new Date();
  expires.setHours(
    expires.getHours() + storeSettings.payments.referenceValidityHours
  );

  return {
    entity: storeSettings.payments.multibancoEntity,
    reference,
    amount,
    expiresAt: expires.toISOString(),
  };
}

export function generateOrderId(): string {
  const num = Math.floor(10000 + Math.random() * 89999);
  return `LHP-${num}`;
}
