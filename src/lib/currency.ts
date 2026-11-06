const formatter = new Intl.NumberFormat('en-AE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Returns e.g. "AED 40". */
export function formatPrice(amount: number): string {
  return `AED ${formatter.format(amount)}`;
}

/** Amount only, e.g. "40" — used beside a small "AED" label. */
export function formatAmount(amount: number): string {
  return formatter.format(amount);
}
