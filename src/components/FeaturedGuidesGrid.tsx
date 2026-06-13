"use client";

import { GuideCard } from "@/components/GuideCard";
import {
  useMarketCity,
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitOutcomesByPremium, GuideProfitRangesByCity } from "@/lib/guide-economics";
import { pickGuideProfitOutcomes } from "@/lib/guide-economics";
import { effectiveMarketCity } from "@/lib/guide-market-city";

export function FeaturedGuidesGrid({
  guides,
  profitRangesByCity,
  profitOutcomesByPremium,
}: {
  guides: Guide[];
  profitRangesByCity: GuideProfitRangesByCity;
  profitOutcomesByPremium: GuideProfitOutcomesByPremium;
}) {
  const profitRanges = useProfitRangesForCity(profitRangesByCity);
  const { marketCity, premiumSeller } = useMarketCity();

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => {
        const city = effectiveMarketCity(marketCity, guide.defaultMarketCity);
        const outcomes = pickGuideProfitOutcomes(
          profitOutcomesByPremium,
          premiumSeller,
          city,
          guide.slug,
        );
        return (
        <GuideCard
          key={guide.slug}
          guide={guide}
          profitRange={profitRanges[guide.slug]}
          profitOutcomes={outcomes}
        />
        );
      })}
    </div>
  );
}
