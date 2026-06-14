export const PREMIUM_LISTING_TAX_RATE = 0.065;
export const STANDARD_LISTING_TAX_RATE = 0.105;
export const PREMIUM_SELLER_STORAGE_KEY = "albion-premium-seller";

/** Premium adds +50% gathering and fishing yield vs non-Premium. */
export const PREMIUM_GATHERING_YIELD_BONUS = 0.5;

/** Whether configured hourly gather/fish yields were logged with Premium active. */
export type GatherYieldBaseline = "premium" | "standard";

/**
 * Scale gather/fish output lines when the Premium toggle changes.
 * - premium baseline (default): configured yields match a Premium run; Standard scales down.
 * - standard baseline: configured yields match a non-Premium run; Premium scales up.
 */
export function getGatheringYieldMultiplier(
  premiumSeller: boolean,
  baseline: GatherYieldBaseline = "premium",
): number {
  if (baseline === "standard") {
    return premiumSeller ? 1 + PREMIUM_GATHERING_YIELD_BONUS : 1;
  }
  return premiumSeller ? 1 : 1 / (1 + PREMIUM_GATHERING_YIELD_BONUS);
}

export function isPremiumYieldItem(itemId: string): boolean {
  // Journal fill rates are set explicitly per guide; do not scale with Premium toggle.
  if (itemId.includes("_JOURNAL_")) return false;
  if (itemId.includes("_ORE") || itemId.includes("_FIBER")) return true;
  if (
    itemId.includes("_FISH") ||
    itemId.includes("FISHCHOPS") ||
    itemId.includes("SEAWEED")
  ) {
    return true;
  }
  return false;
}

export function getListingTaxRate(premiumSeller: boolean): number {
  return premiumSeller ? PREMIUM_LISTING_TAX_RATE : STANDARD_LISTING_TAX_RATE;
}

export function formatListingTaxPercent(rate: number): string {
  return `${Math.round(rate * 1000) / 10}%`;
}

export function listingTaxRowLabel(premiumSeller: boolean): string {
  const rate = formatListingTaxPercent(getListingTaxRate(premiumSeller));
  return premiumSeller
    ? `Minus Premium listing tax (~${rate})`
    : `Minus Standard listing tax (~${rate})`;
}

/** Footer copy for guide profit calculators; reflects the active Premium toggle. */
export function takeHomeFormulaNote(
  premiumSeller: boolean,
  gatherYieldBaseline: GatherYieldBaseline = "premium",
): string {
  const rate = formatListingTaxPercent(getListingTaxRate(premiumSeller));
  const taxTier = premiumSeller ? "Premium" : "Standard";
  let yieldNote = "";
  if (gatherYieldBaseline === "standard") {
    yieldNote = premiumSeller
      ? " Yields are scaled up +50% vs the logged no-Premium baseline."
      : " Matches the logged no-Premium baseline (yields and Standard tax).";
  } else if (premiumSeller) {
    yieldNote = " Gather/fish yields use the Premium baseline.";
  } else {
    yieldNote = " Gather/fish yields are scaled down for no Premium.";
  }
  return `Take-home = output sell value - input buys - consumables - ~${rate} ${taxTier} listing tax on gross output.${yieldNote} Deaths, repairs, and station fees are not included unless listed as inputs. Yields scale with your selected skill level.`;
}
