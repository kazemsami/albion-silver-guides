import { guideEconomicsBySlug } from "@/data/guide-economics";
import type { GuideEconomics, GuideMarketPrices, GuideProfitOutcomes } from "@/types/guide";
import type { MarketCityId } from "@/lib/market-cities";
import {
  deserializePriceMap,
  pickGuideMarketPrices,
} from "@/lib/guide-economics";
import { computeGuideProfitOutcomes } from "@/lib/guide-profit-outcomes";
import { formatSilverPrice } from "@/lib/format";
import { STANDARD_LISTING_TAX_RATE } from "@/lib/listing-tax";

export function computeGuideProfitOutcomesAtCity(
  slug: string,
  guidePrices: GuideMarketPrices,
  marketCity: MarketCityId,
): GuideProfitOutcomes | null {
  const economics = guideEconomicsBySlug[slug];
  if (!economics) return null;

  const priceMap = deserializePriceMap(
    pickGuideMarketPrices(guidePrices, marketCity, false),
  );

  return computeGuideProfitOutcomes(slug, priceMap, {
    listingTaxRate: STANDARD_LISTING_TAX_RATE,
    premiumSeller: false,
    priceMapKind: "snapshot",
  });
}

function formatTakeHome(amount: number | null): string | null {
  return amount != null ? `${formatSilverPrice(amount)}/hr` : null;
}

/** Server-rendered intro line that tracks saved-price calculator outcomes. */
export function buildGuideProfitIntroText(
  slug: string,
  guidePrices: GuideMarketPrices,
  marketCity: MarketCityId,
  economics: GuideEconomics,
): string | null {
  const outcomes = computeGuideProfitOutcomesAtCity(slug, guidePrices, marketCity);
  if (!outcomes?.expected) return null;

  const cityLabel = marketCity;
  const expected = formatTakeHome(outcomes.expected);
  const highRoll = formatTakeHome(outcomes.highRoll);
  const conservative = formatTakeHome(outcomes.conservative);

  if (slug === "mists-fishing") {
    const defaultTier =
      economics.skillTiers.find((tier) => tier.id === economics.defaultSkillTierId) ??
      economics.skillTiers[economics.skillTiers.length - 1];
    const beginnerTier = economics.skillTiers[0];
    return (
      `Yellow-zone Mists are knockdown-only and safe to learn in, but the logged calculator tier is ${defaultTier?.label ?? "Fishing 60+"} with T7 fisherman gear, T7 Avalonian rod, bait, and Grandmaster journals: ${expected} at saved ${cityLabel} prices (Standard tax, no Premium). ` +
      `${beginnerTier?.label ?? "Fishing 10-30"} models about ${conservative ?? "a lower hourly rate"} before that setup. Snapper stays RNG upside.`
    );
  }

  if (slug === "t4-ore-mining-yellow-zone" || slug === "fiber-farming-solo") {
    const highRollNote =
      outcomes.highRoll != null &&
      outcomes.expected != null &&
      outcomes.highRoll > outcomes.expected
        ? ` Advanced tier high-roll up to ${highRoll}.`
        : "";
    return `Saved ${cityLabel} prices on the default logged tier: ${expected} take-home (Standard tax, no Premium).${highRollNote}`;
  }

  return null;
}
