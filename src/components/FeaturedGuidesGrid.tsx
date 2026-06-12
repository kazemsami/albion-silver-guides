"use client";

import { GuideCard } from "@/components/GuideCard";
import {
  useMarketCity,
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRangesByCity } from "@/lib/guide-economics";

export function FeaturedGuidesGrid({
  guides,
  profitRangesByCity,
}: {
  guides: Guide[];
  profitRangesByCity: GuideProfitRangesByCity;
}) {
  const { marketCity } = useMarketCity();
  const profitRanges = useProfitRangesForCity(profitRangesByCity);

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard
          key={guide.slug}
          guide={guide}
          profitRange={profitRanges[guide.slug]}
          marketCity={marketCity}
        />
      ))}
    </div>
  );
}
