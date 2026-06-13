"use client";

import { GuideCard } from "@/components/GuideCard";
import {
  useGuideProfitOutcomes,
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRange, GuidesListMarketData } from "@/lib/guide-economics";

function FeaturedGuideCard({
  guide,
  marketData,
  profitRange,
}: {
  guide: Guide;
  marketData: GuidesListMarketData;
  profitRange?: GuideProfitRange | null;
}) {
  const outcomes = useGuideProfitOutcomes(
    marketData,
    guide.slug,
    guide.defaultMarketCity,
  );

  return (
    <GuideCard
      guide={guide}
      profitRange={profitRange}
      profitOutcomes={outcomes}
    />
  );
}

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
        <FeaturedGuideCard
          key={guide.slug}
          guide={guide}
          marketData={marketData}
          profitRange={profitRanges[guide.slug]}
        />
      ))}
    </div>
  );
}
