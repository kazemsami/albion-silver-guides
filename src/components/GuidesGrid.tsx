"use client";

import { useMemo } from "react";
import { GuideCard } from "@/components/GuideCard";
import {
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRangesByCity } from "@/lib/guide-economics";
import { sortGuidesByProfit, type GuideSort } from "@/lib/guide-display";

export function GuidesGrid({
  guides,
  profitRangesByCity,
  sort = "profit-desc",
}: {
  guides: Guide[];
  profitRangesByCity: GuideProfitRangesByCity;
  sort?: GuideSort;
}) {
  const profitRanges = useProfitRangesForCity(profitRangesByCity);

  const sorted = useMemo(
    () => sortGuidesByProfit(guides, profitRanges, sort),
    [guides, profitRanges, sort],
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {sorted.map((guide) => (
        <GuideCard
          key={guide.slug}
          guide={guide}
          profitRange={profitRanges[guide.slug]}
        />
      ))}
    </div>
  );
}
