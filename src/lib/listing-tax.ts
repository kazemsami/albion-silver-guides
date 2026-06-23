// Market fee component breakdown (Albion Online marketplace fees)
export const SETUP_FEE_RATE = 0.025; // 2.5% setup fee (same for Standard and Premium)
export const STANDARD_TRANSACTION_TAX_RATE = 0.08; // 8% transaction tax (Standard)
export const PREMIUM_TRANSACTION_TAX_RATE = 0.04; // 4% transaction tax (Premium)

// Total market fees for sell orders (setup fee + transaction tax)
export const STANDARD_MARKET_FEE_RATE = SETUP_FEE_RATE + STANDARD_TRANSACTION_TAX_RATE; // 10.5%
export const PREMIUM_MARKET_FEE_RATE = SETUP_FEE_RATE + PREMIUM_TRANSACTION_TAX_RATE; // 6.5%

// Legacy aliases (deprecated naming, use MARKET_FEE_RATE instead)
export const PREMIUM_LISTING_TAX_RATE = PREMIUM_MARKET_FEE_RATE;
export const STANDARD_LISTING_TAX_RATE = STANDARD_MARKET_FEE_RATE;

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

/** User-facing breakdown of sell-order fees (setup + transaction, no combined total). */
export const STANDARD_MARKET_FEE_LABEL =
  "Standard sell-order market fees: 2.5% setup fee + 8% transaction tax";

export const PREMIUM_MARKET_FEE_LABEL =
  "Premium sell-order market fees: 2.5% setup fee + 4% transaction tax";

export function listingTaxRowLabel(premiumSeller: boolean): string {
  return premiumSeller
    ? "Minus Premium sell-order fees (2.5% setup fee + 4% transaction tax)"
    : "Minus Standard sell-order fees (2.5% setup fee + 8% transaction tax)";
}

export type TakeHomeFormulaNoteKind = "gathering" | "laborer" | "none";

/** Footer copy for guide profit calculators; reflects the active Premium toggle. */
export function takeHomeFormulaNote(
  premiumSeller: boolean,
  gatherYieldBaseline: GatherYieldBaseline = "premium",
  noteKind: TakeHomeFormulaNoteKind = "gathering",
): string {
  let yieldNote = "";
  if (noteKind === "laborer") {
    yieldNote =
      " Each laborer finishes one journal every 22 hours. Returns depend on journal tier, happiness, and market prices. Compare feeding journals vs selling full journals before you commit. Premium affects fame while filling journals, not the laborer payout itself.";
  } else if (noteKind === "gathering") {
    if (gatherYieldBaseline === "standard") {
      yieldNote = premiumSeller
        ? " Yields are scaled up +50% vs the logged no-Premium baseline."
        : " Matches the logged no-Premium baseline (yields and Standard tax).";
    } else if (premiumSeller) {
      yieldNote = " Gather/fish yields use the Premium baseline.";
    } else {
      yieldNote = " Gather/fish yields are scaled down for no Premium.";
    }
  }
  const feeLabel = premiumSeller
    ? PREMIUM_MARKET_FEE_LABEL
    : STANDARD_MARKET_FEE_LABEL;
  const yieldScaleNote =
    noteKind === "gathering"
      ? " Yields scale with your selected skill level."
      : "";
  return `Take-home = output sell value - input buys - consumables - ${feeLabel} on gross output.${yieldNote} Deaths, repairs, and station fees are not included unless listed as inputs.${yieldScaleNote}`;
}
