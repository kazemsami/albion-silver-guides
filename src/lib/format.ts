export function roundSilver(amount: number): number {
  return Math.round(amount);
}

export function formatSilver(amount: number): string {
  const rounded = roundSilver(amount);
  if (rounded === 0) return "0";

  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);

  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    const formatted =
      millions % 1 === 0 ? String(millions) : millions.toFixed(1);
    return `${sign}${formatted}M`;
  }
  if (abs >= 1_000) {
    const thousands = abs / 1_000;
    const formatted =
      thousands % 1 === 0 ? String(thousands) : thousands.toFixed(0);
    return `${sign}${formatted}k`;
  }
  return String(rounded);
}

export function formatSilverRange(min: number, max: number): string {
  return `${formatSilver(min)} - ${formatSilver(max)}`;
}

/** Full silver amount with thousands separators for market prices. */
export function formatSilverExact(amount: number): string {
  return roundSilver(amount).toLocaleString("en-US");
}

export function formatSilverPrice(amount: number | null): string {
  if (amount == null) return "N/A";
  const rounded = roundSilver(amount);
  const prefix = rounded < 0 ? "-" : "";
  return `${prefix}${formatSilverExact(Math.abs(rounded))} silver`;
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
