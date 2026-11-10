/**
 * Payments.
 *
 * The default provider is a manual bank transfer: KR8 has a Nigerian business
 * account and no card processor, so anything else would be fiction. Every order
 * gets a unique reference that the client quotes in the transfer narration, and
 * the team confirms it in the dashboard.
 *
 * Swapping providers means adding one object here and setting
 * PAYMENT_PROVIDER — no page, route or component changes. Paystack and Flutterwave
 * are stubbed with the exact shape they need, so wiring them later is
 * configuration, not a rebuild.
 */
import site from '../../data/site.json';

export type Currency = 'USD' | 'NGN';
export type Intent = {
  orderId: string;
  reference: string;
  amount: number;
  currency: Currency;
  provider: string;
  instructions: string[];
  fields: { label: string; value: string }[];
  confirmHint: string;
};

export type Provider = {
  id: string;
  label: string;
  available: () => boolean;
  create: (order: { id: string; reference: string; amountUsd: number; amountNgn: number; note: string }) => Intent;
};

const BANK = {
  bankName: process.env.KR8_BANK_NAME || 'Provided on confirmed invoice',
  accountName: process.env.KR8_BANK_ACCOUNT_NAME || site.company.legalName,
  accountNumber: process.env.KR8_BANK_ACCOUNT || 'Provided on confirmed invoice',
};

const bank: Provider = {
  id: 'bank_transfer',
  label: 'Manual bank transfer',
  available: () => true,
  create: (o) => ({
    orderId: o.id,
    reference: o.reference,
    amount: o.amountNgn,
    currency: 'NGN',
    provider: 'bank_transfer',
    instructions: [
      'Transfer the exact amount below to the KR8 Digitals account.',
      'Use the payment reference as the transfer narration. It is how we match your money to this order.',
      'Send the receipt on WhatsApp. Nothing is released until the transfer is confirmed — this is a manual reconciliation by a person, not an automatic check.',
      'Your order sits at “awaiting transfer” until we confirm, then it moves to “paid” and work is scheduled.',
    ],
    fields: [
      { label: 'Bank', value: BANK.bankName },
      { label: 'Account name', value: BANK.accountName },
      { label: 'Account number', value: BANK.accountNumber },
      { label: 'Amount', value: `₦${o.amountNgn.toLocaleString('en-NG')} (≈ $${o.amountUsd.toLocaleString('en-US')})` },
      { label: 'Reference', value: o.reference },
    ],
    confirmHint: 'Send the receipt to +234 812 568 7509 on WhatsApp and quote the reference.',
  }),
};

const paystack: Provider = {
  id: 'paystack',
  label: 'Card, transfer and USSD via Paystack',
  available: () => false, // Disabled until verified checkout/webhooks are implemented.
  create: (o) => ({
    orderId: o.id,
    reference: o.reference,
    amount: o.amountNgn,
    currency: 'NGN',
    provider: 'paystack',
    instructions: [
      'You will be redirected to Paystack to pay by card, bank transfer or USSD.',
      'The order is marked paid automatically when Paystack confirms the transaction.',
    ],
    fields: [{ label: 'Amount', value: `₦${o.amountNgn.toLocaleString('en-NG')}` }],
    confirmHint: 'No receipt needed — Paystack notifies us directly.',
  }),
};

const registry: Provider[] = [bank, paystack];

export function activeProvider(): Provider {
  const wanted = process.env.PAYMENT_PROVIDER;
  const found = registry.find((p) => p.id === wanted && p.available());
  return found || bank;
}

export function providerList() {
  return registry.map((p) => ({ id: p.id, label: p.label, available: p.available() }));
}
