"use client";

import { useMemo } from "react";
import { GuideCard } from "@/components/GuideCard";
import {
  useGuideProfitOutcomes,
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRange, GuidesListMarketData } from "@/lib/guide-economics";
import { sortGuidesByProfit, type GuideSort } from "@/lib/guide-display";

function GuideGridCard({
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

export function GuidesGrid({
  guides,
  marketData,
  sort = "profit-desc",
}: {
  guides: Guide[];
  marketData: GuidesListMarketData;
  sort?: GuideSort;
}) {
  const profitRanges = useProfitRangesForCity(marketData);

  const sorted = useMemo(
    () => sortGuidesByProfit(guides, profitRanges, sort),
    [guides, profitRanges, sort],
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {sorted.map((guide) => (
        <GuideGridCard
          key={guide.slug}
          guide={guide}
          marketData={marketData}
          profitRange={profitRanges[guide.slug]}
        />
      ))}
    </div>
  );
}
