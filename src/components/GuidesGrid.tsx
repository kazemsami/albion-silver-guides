"use client";

import { useMemo } from "react";
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
import { sortGuidesByProfit, type GuideSort } from "@/lib/guide-display";

export function GuidesGrid({
  guides,
  profitRangesByCity,
  profitOutcomesByCity,
  sort = "profit-desc",
}: {
  guides: Guide[];
  profitRangesByCity: GuideProfitRangesByCity;
  profitOutcomesByCity: GuideProfitOutcomesByCity;
  sort?: GuideSort;
}) {
  const profitRanges = useProfitRangesForCity(profitRangesByCity);
  const { marketCity } = useMarketCity();

  const sorted = useMemo(
    () => sortGuidesByProfit(guides, profitRanges, sort),
    [guides, profitRanges, sort],
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {sorted.map((guide) => {
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
