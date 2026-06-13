"use client";

import { GuideCard } from "@/components/GuideCard";
import { useProfitRangesForCity } from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuidesListMarketData } from "@/lib/guide-economics";

export function FeaturedGuidesGrid({
  guides,
  marketData,
}: {
  guides: Guide[];
  marketData: GuidesListMarketData;
}) {
  const profitRanges = useProfitRangesForCity(marketData);

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard
          key={guide.slug}
          guide={guide}
          profitRange={profitRanges[guide.slug]}
        />
      ))}
    </div>
  );
}
