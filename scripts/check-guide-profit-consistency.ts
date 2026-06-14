/**
 * Ensures list-card profit ranges match detail-page profit outcomes.
 * Run: npx tsx scripts/check-guide-profit-consistency.ts
 */
import { guides } from "../src/data/guides";
import { guideEconomicsBySlug } from "../src/data/guide-economics";
import {
  fetchAllGuidesMarketDataByCity,
  pickGuideProfitOutcomes,
  resolveGuideOutcomesPremiumSeller,
} from "../src/lib/guide-economics";
import { effectiveMarketCity } from "../src/lib/guide-market-city";
import { AVERAGE_MARKET_CITY_ID } from "../src/lib/market-cities";
import { profitRangeFromOutcomes } from "../src/lib/guide-profit-outcomes";

async function main() {
  const marketData = await fetchAllGuidesMarketDataByCity();
  const source = marketData.estimated;
  let failed = 0;

  for (const guide of guides) {
    if (!guideEconomicsBySlug[guide.slug]) continue;

    const city = effectiveMarketCity(
      AVERAGE_MARKET_CITY_ID,
      guide.defaultMarketCity,
    );

    for (const premiumSeller of [false, true]) {
      const outcomesPremiumSeller = resolveGuideOutcomesPremiumSeller(
        guide.slug,
        premiumSeller,
      );
      const premiumKey = outcomesPremiumSeller ? "premium" : "standard";
      const outcomes = pickGuideProfitOutcomes(
        source.outcomes,
        outcomesPremiumSeller,
        city,
        guide.slug,
      );
      const cardRange = outcomes ? profitRangeFromOutcomes(outcomes) : null;
      const listRange =
        source.ranges[premiumKey][city]?.[guide.slug] ??
        source.ranges[premiumKey][AVERAGE_MARKET_CITY_ID]?.[guide.slug];

      if (!cardRange || !listRange) {
        console.log(`FAIL ${guide.slug} (premium=${premiumSeller}): missing range`);
        failed++;
        continue;
      }

      if (
        cardRange.min !== listRange.min ||
        cardRange.max !== listRange.max
      ) {
        console.log(
          `FAIL ${guide.slug} (premium=${premiumSeller}): card ${cardRange.min}-${cardRange.max} vs baked ${listRange.min}-${listRange.max}`,
        );
        failed++;
      }
    }
  }

  if (failed > 0) {
    console.log(`${failed} consistency error(s).`);
    process.exit(1);
  }

  console.log(
    `All ${Object.keys(guideEconomicsBySlug).length} guide card ranges match profit outcomes.`,
  );
}

main();
