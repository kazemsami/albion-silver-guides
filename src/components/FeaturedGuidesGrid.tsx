"use client";

import { GuideCard } from "@/components/GuideCard";
import {
  useMarketCity,
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type {
  GuideProfitOutcomesByCity,
  GuideProfitRangesByCity,
} from "@/lib/guide-economics";
import { effectiveMarketCity } from "@/lib/guide-market-city";

export function FeaturedGuidesGrid({
  guides,
  profitRangesByCity,
  profitOutcomesByCity,
}: {
  guides: Guide[];
  profitRangesByCity: GuideProfitRangesByCity;
  profitOutcomesByCity: GuideProfitOutcomesByCity;
}) {
  const profitRanges = useProfitRangesForCity(profitRangesByCity);
  const { marketCity } = useMarketCity();

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => {
        const city = effectiveMarketCity(marketCity, guide.defaultMarketCity);
        const outcomes =
          profitOutcomesByCity[city]?.[guide.slug] ??
          profitOutcomesByCity.average?.[guide.slug];
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
