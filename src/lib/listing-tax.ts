export const PREMIUM_LISTING_TAX_RATE = 0.065;
export const STANDARD_LISTING_TAX_RATE = 0.105;
export const PREMIUM_SELLER_STORAGE_KEY = "albion-premium-seller";

/** Premium adds +50% gathering and fishing yield vs non-Premium. */
export const PREMIUM_GATHERING_YIELD_BONUS = 0.5;

/**
 * Guide baseline yields assume Premium is active. Non-Premium scales down;
 * Premium leaves configured rates unchanged.
 */
export function getGatheringYieldMultiplier(premiumSeller: boolean): number {
  return premiumSeller ? 1 : 1 / (1 + PREMIUM_GATHERING_YIELD_BONUS);
}

export function isPremiumYieldItem(itemId: string): boolean {
  if (itemId.includes("_JOURNAL_") && itemId.endsWith("_FULL")) {
    return /_JOURNAL_(ORE|FIBER|WOOD|HIDE|ROCK|FISHING)_/.test(itemId);
  }
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
