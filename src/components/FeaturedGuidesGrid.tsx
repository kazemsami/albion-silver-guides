"use client";

import { useEffect, useState } from "react";
import { GuideCard } from "@/components/GuideCard";
import { useProfitRangesForCity } from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRangeMap, GuidesListMarketData } from "@/lib/guide-economics";

export function FeaturedGuidesGrid({
  guides,
  marketData,
  serverProfitRanges,
}: {
  guides: Guide[];
  marketData: GuidesListMarketData;
  serverProfitRanges: GuideProfitRangeMap;
}) {
  const clientProfitRanges = useProfitRangesForCity(marketData, guides);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profitRanges = mounted ? clientProfitRanges : serverProfitRanges;

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard
          key={guide.slug}
          guide={guide}
          profitRange={profitRanges[guide.slug] ?? null}
          priceSourceLabel={mounted ? undefined : "saved prices"}
        />
      ))}
    </div>
  );
}
