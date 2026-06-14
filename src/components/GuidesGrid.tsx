"use client";

import { useEffect, useMemo, useState } from "react";
import { GuideCard } from "@/components/GuideCard";
import { useProfitRangesForCity } from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRangeMap, GuidesListMarketData } from "@/lib/guide-economics";
import { sortGuidesByProfit, type GuideSort } from "@/lib/guide-display";

export function GuidesGrid({
  guides,
  marketData,
  sort = "profit-desc",
  serverProfitRanges,
}: {
  guides: Guide[];
  marketData: GuidesListMarketData;
  sort?: GuideSort;
  serverProfitRanges: GuideProfitRangeMap;
}) {
  const clientProfitRanges = useProfitRangesForCity(marketData, guides);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profitRanges = mounted ? clientProfitRanges : serverProfitRanges;

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
          priceSourceLabel={mounted ? undefined : "saved prices"}
        />
      ))}
    </div>
  );
}
