"use client";

import { useMemo } from "react";
import {
  useGuidePriceMap,
  useMarketCity,
} from "@/components/MarketCityProvider";
import { GuideMarketNote } from "@/components/GuideMarketNote";
import { ProfitOutcomesTable } from "@/components/ProfitOutcomesTable";
import { computeGuideProfitOutcomes } from "@/lib/guide-profit-outcomes";
import type { GuideMarketPrices } from "@/types/guide";
import type { MarketCityId } from "@/lib/market-cities";

export function GuideCalculatorOutcomes({
  guideSlug,
  defaultMarketCity,
  guidePrices,
}: {
  guideSlug: string;
  defaultMarketCity?: MarketCityId;
  guidePrices: GuideMarketPrices;
}) {
  const { priceMap, mapKind } = useGuidePriceMap(guidePrices, defaultMarketCity);
  const { listingTaxRate, premiumSeller } = useMarketCity();

  const outcomes = useMemo(() => {
    return computeGuideProfitOutcomes(guideSlug, priceMap, {
      listingTaxRate,
      premiumSeller,
      priceMapKind: mapKind,
    });
  }, [guideSlug, listingTaxRate, mapKind, premiumSeller, priceMap]);

  const outcomesLabel =
    guideSlug === "potions-crafting-bulk"
      ? "Profit outcomes / 10k focus (after tax)"
      : "Profit outcomes / hr (after tax)";
  const outcomesUnit =
    guideSlug === "potions-crafting-bulk" ? "/10k focus" : "/hr";

  return (
    <>
      <GuideMarketNote defaultMarketCity={defaultMarketCity} />
      <div className="wiki-note theme-surface mt-4 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
          {outcomesLabel}
        </p>
        <div className="mt-3">
          <ProfitOutcomesTable outcomes={outcomes} unitLabel={outcomesUnit} />
        </div>
      </div>
    </>
  );
}
