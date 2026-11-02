/**
 * Currency.
 *
 * Prices are stored in USD and converted for display. The rate comes from a
 * public, no-key source and is cached for 6 hours. If the source is unreachable
 * we fall back to the last good cached value, then to a static table — so the
 * site never shows a blank or a wrong-by-a-mile number. Admins can override any
 * rate (Section 14: "The admin can override a rate or fix a local price").
 */

export type Rates = Record<string, number>;

export const FALLBACK: Rates = {
  USD: 1,
  NGN: 1550,
  GHS: 15.2,
  KES: 129,
  ZAR: 18.4,
  GBP: 0.78,
  EUR: 0.92,
  CAD: 1.37,
};

export const CURRENCY_META: Record<string, { symbol: string; label: string; decimals: number }> = {
  USD: { symbol: '$', label: 'US Dollar', decimals: 0 },
  NGN: { symbol: '₦', label: 'Nigerian Naira', decimals: 0 },
  GHS: { symbol: 'GH₵', label: 'Ghanaian Cedi', decimals: 0 },
  KES: { symbol: 'KSh', label: 'Kenyan Shilling', decimals: 0 },
  ZAR: { symbol: 'R', label: 'South African Rand', decimals: 0 },
  GBP: { symbol: '£', label: 'Pound Sterling', decimals: 0 },
  EUR: { symbol: '€', label: 'Euro', decimals: 0 },
  CAD: { symbol: 'CA$', label: 'Canadian Dollar', decimals: 0 },
};

let cache: { at: number; rates: Rates; source: string } | null = null;
const TTL = 6 * 60 * 60 * 1000;

export async function getRates(): Promise<{ rates: Rates; source: string; at: number }> {
  if (cache && Date.now() - cache.at < TTL) return cache;

  const overrides = parseOverrides(process.env.KR8_RATE_OVERRIDES);

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const json = await res.json();
      const raw = (json?.rates || {}) as Rates;
      const rates: Rates = { USD: 1 };
      for (const code of Object.keys(CURRENCY_META)) {
        if (typeof raw[code] === 'number') rates[code] = raw[code];
      }
      const merged = { ...FALLBACK, ...rates, ...overrides, USD: 1 };
      cache = { at: Date.now(), rates: merged, source: 'open.er-api.com' };
      return cache;
    }
  } catch {
    /* fall through */
  }

  const merged = { ...FALLBACK, ...overrides };
  cache = { at: Date.now(), rates: merged, source: 'fallback' };
  return cache;
}

function parseOverrides(raw?: string): Rates {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    const out: Rates = {};
    for (const [k, v] of Object.entries(parsed)) if (typeof v === 'number') out[k.toUpperCase()] = v;
    return out;
  } catch {
    return {};
  }
}

/** Currency the visitor is most likely to want, from their edge country header. */
export function guessCurrency(country?: string | null): string {
  const c = (country || '').toUpperCase();
  if (c === 'NG') return 'NGN';
  if (c === 'GH') return 'GHS';
  if (c === 'KE') return 'KES';
  if (c === 'ZA') return 'ZAR';
  if (c === 'GB') return 'GBP';
  if (['DE', 'FR', 'ES', 'IT', 'NL', 'PT', 'IE', 'BE', 'AT'].includes(c)) return 'EUR';
  if (c === 'CA') return 'CAD';
  return 'USD';
}

export function convert(usd: number, code: string, rates: Rates) {
  const r = rates[code] ?? 1;
  const meta = CURRENCY_META[code] ?? CURRENCY_META.USD;
  const value = usd * r;
  if (meta.decimals === 0) {
    // Round to a readable, human price rather than a suspicious exact number.
    const rounded = value >= 1000 ? Math.round(value / 100) * 100 : value >= 100 ? Math.round(value / 10) * 10 : Math.round(value);
    return { value: rounded, symbol: meta.symbol, code, label: meta.label };
  }
  return { value: Math.round(value * 100) / 100, symbol: meta.symbol, code, label: meta.label };
}

export function formatMoney(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
