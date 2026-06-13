"use client";

import { GuideCard } from "@/components/GuideCard";
import {
  useMarketCity,
  useProfitRangesForCity,
} from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitOutcomesByPremium, GuideProfitRangesByCity } from "@/lib/guide-economics";
import { pickGuideProfitOutcomes } from "@/lib/guide-economics";
import { effectiveMarketCity } from "@/lib/guide-market-city";

export function RelatedGuides({
  guides,
  profitRangesByCity,
  profitOutcomesByPremium,
}: {
  guides: Guide[];
  profitRangesByCity: GuideProfitRangesByCity;
  profitOutcomesByPremium: GuideProfitOutcomesByPremium;
}) {
  const profitRanges = useProfitRangesForCity(profitRangesByCity);
  const { marketCity, premiumSeller } = useMarketCity();

  return (
    <section className="mt-16 border-t border-gold/10 pt-10">
      <h2 className="font-display text-xl font-semibold text-parchment">
        Related Guides
      </h2>
      <div className="mt-6 grid gap-5">
        {guides.map((guide) => {
          const city = effectiveMarketCity(marketCity, guide.defaultMarketCity);
          const outcomes = pickGuideProfitOutcomes(
            profitOutcomesByPremium,
            premiumSeller,
            city,
            guide.slug,
          );
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
    </section>
  );
}
