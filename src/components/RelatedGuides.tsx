"use client";

import { GuideCard } from "@/components/GuideCard";
import {
  useGuideProfitOutcomes,
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRange, GuidesListMarketData } from "@/lib/guide-economics";

function RelatedGuideCard({
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

export function RelatedGuides({
  guides,
  marketData,
}: {
  guides: Guide[];
  marketData: GuidesListMarketData;
}) {
  const profitRanges = useProfitRangesForCity(marketData);

  return (
    <section className="mt-16 border-t border-gold/10 pt-10">
      <h2 className="font-display text-xl font-semibold text-parchment">
        Related Guides
      </h2>
      <div className="mt-6 grid gap-5">
        {guides.map((guide) => (
          <RelatedGuideCard
            key={guide.slug}
            guide={guide}
            marketData={marketData}
            profitRange={profitRanges[guide.slug]}
          />
        ))}
      </div>
    </section>
  );
}
