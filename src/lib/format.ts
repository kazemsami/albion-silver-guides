export function roundSilver(amount: number): number {
  return Math.round(amount);
}

function formatCompactMagnitude(abs: number): string {
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    const formatted = Number.isInteger(millions)
      ? String(millions)
      : millions.toFixed(1).replace(/\.0$/, "");
    return `${formatted}m`;
  }
  if (abs >= 1_000) {
    const thousands = abs / 1_000;
    const formatted = Number.isInteger(thousands)
      ? String(thousands)
      : thousands.toFixed(1).replace(/\.0$/, "");
    return `${formatted}k`;
  }
  return String(abs);
}

/** Compact silver display: 260k, 1m, 2.5m, or plain under 1k. */
export function formatSilver(amount: number): string {
  const rounded = roundSilver(amount);
  if (rounded === 0) return "0";

  const sign = rounded < 0 ? "-" : "";
  return `${sign}${formatCompactMagnitude(Math.abs(rounded))}`;
}

export function formatSilverRange(min: number, max: number): string {
  return `${formatSilver(min)} - ${formatSilver(max)}`;
}

/** Silver amount for tables and line items (compact at 1k+). */
export function formatSilverExact(amount: number): string {
  return formatSilver(amount);
}

export function formatSilverPrice(amount: number | null): string {
  if (amount == null) return "N/A";
  return formatSilver(amount);
}

/** Rounded stack / per-hour quantity for tables and item badges. */
export function formatItemQuantity(quantity: number): string {
  const rounded = Math.round(quantity * 100) / 100;
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString("en-US");
  }
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/** Whole-number quantity for gear loadout badges. */
export function formatLoadoutQuantity(quantity: number): string {
  return Math.max(1, Math.round(quantity)).toLocaleString("en-US");
}

/** Percentage for drop odds and downtime sliders (0.018 → 1.8%). */
export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`;
}
