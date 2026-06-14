"use client";

import { useMemo } from "react";
import {
  useGuidePriceMap,
  useMarketCity,
} from "@/components/MarketCityProvider";
import { GuideMarketNote } from "@/components/GuideMarketNote";
import { ProfitOutcomesTable } from "@/components/ProfitOutcomesTable";
import { computeGuideProfitOutcomes } from "@/lib/guide-profit-outcomes";
import { ABYSSAL_PROFIT_OUTCOME_HINTS } from "@/lib/abyssal-economics";
import {
  getListingTaxRate,
} from "@/lib/listing-tax";
import type { GatherYieldBaseline } from "@/lib/listing-tax";
import type { GuideMarketPrices } from "@/types/guide";
import type { MarketCityId } from "@/lib/market-cities";

export function GuideCalculatorOutcomes({
  guideSlug,
  defaultMarketCity,
  guidePrices,
  gatherYieldBaseline = "premium",
}: {
  guideSlug: string;
  defaultMarketCity?: MarketCityId;
  guidePrices: GuideMarketPrices;
  gatherYieldBaseline?: GatherYieldBaseline;
}) {
  const { priceMap, mapKind } = useGuidePriceMap(guidePrices, defaultMarketCity);
  const { premiumSeller } = useMarketCity();
  const usesLoggedStandardBaseline = gatherYieldBaseline === "standard";
  const outcomesPremiumSeller = usesLoggedStandardBaseline ? false : premiumSeller;

  const outcomes = useMemo(() => {
    return computeGuideProfitOutcomes(guideSlug, priceMap, {
      listingTaxRate: getListingTaxRate(outcomesPremiumSeller),
      premiumSeller: outcomesPremiumSeller,
      priceMapKind: mapKind,
    });
  }, [guideSlug, mapKind, outcomesPremiumSeller, priceMap]);

  const projectedPremiumOutcomes = useMemo(() => {
    if (!usesLoggedStandardBaseline || premiumSeller) return null;
    return computeGuideProfitOutcomes(guideSlug, priceMap, {
      listingTaxRate: getListingTaxRate(true),
      premiumSeller: true,
      priceMapKind: mapKind,
    });
  }, [guideSlug, mapKind, premiumSeller, priceMap, usesLoggedStandardBaseline]);

  const outcomesLabel =
    guideSlug === "potions-crafting-bulk"
      ? "Profit outcomes / 10k focus (after tax)"
      : "Profit outcomes / hr (after tax)";
  const outcomesUnit =
    guideSlug === "potions-crafting-bulk" ? "/10k focus" : "/hr";
  const isAbyssal = guideSlug === "abyssal-depths-farming";

  return (
    <>
      <GuideMarketNote defaultMarketCity={defaultMarketCity} />
      <div className="wiki-note theme-surface mt-4 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
          {usesLoggedStandardBaseline
            ? "Logged profit outcomes (Standard tax, no Premium)"
            : outcomesLabel}
        </p>
        {usesLoggedStandardBaseline && (
          <p className="mt-1 text-xs text-parchment/45">
            Matches reviewed runs without Premium. Toggle Premium in the header for
            projected upside in the breakdown below.
          </p>
        )}
        <div className="mt-3">
          <ProfitOutcomesTable
            outcomes={outcomes}
            unitLabel={outcomesUnit}
            outcomeHints={isAbyssal ? ABYSSAL_PROFIT_OUTCOME_HINTS : undefined}
          />
        </div>
        {isAbyssal && (
          <p className="mt-3 text-xs text-parchment/45">
            Expected value matches the Average floor-2 calculator preset (68%
            win rate, after bag loss). Median is the same route at a cautious
            65% win rate if you reset more often.
          </p>
        )}
        {projectedPremiumOutcomes && (
          <div className="mt-5 border-t border-gold/15 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Projected with Premium
            </p>
            <div className="mt-3">
              <ProfitOutcomesTable
                outcomes={projectedPremiumOutcomes}
                unitLabel={outcomesUnit}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
