"use client";

import { useEffect, useState } from "react";
import { GuideCard } from "@/components/GuideCard";
import { useProfitRangesForCity } from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRangeMap, GuidesListMarketData } from "@/lib/guide-economics";

export function RelatedGuides({
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
    <section className="mt-16 border-t border-gold/10 pt-10">
      <h2 className="font-display text-xl font-semibold text-parchment">
        Related Guides
      </h2>
      <div className="mt-6 grid gap-5">
        {guides.map((guide) => (
          <GuideCard
            key={guide.slug}
            guide={guide}
            profitRange={profitRanges[guide.slug] ?? null}
            priceSourceLabel={mounted ? undefined : "saved prices"}
          />
        ))}
      </div>
    </section>
  );
}
