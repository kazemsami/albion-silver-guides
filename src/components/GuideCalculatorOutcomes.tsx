"use client";

import { useMemo } from "react";
import {
  useEffectiveMarketCity,
  useMarketCity,
} from "@/components/MarketCityProvider";
import { GuideMarketNote } from "@/components/GuideMarketNote";
import { ProfitOutcomesTable } from "@/components/ProfitOutcomesTable";
import { computeGuideProfitOutcomes } from "@/lib/guide-profit-outcomes";
import { deserializePriceMap, pickSerializedPrices } from "@/lib/guide-economics";
import type { SerializedPricesByCity } from "@/types/guide";
import type { MarketCityId } from "@/lib/market-cities";

export function GuideCalculatorOutcomes({
  guideSlug,
  defaultMarketCity,
  pricesByCity,
}: {
  guideSlug: string;
  defaultMarketCity?: MarketCityId;
  pricesByCity: SerializedPricesByCity;
}) {
  const effectiveCity = useEffectiveMarketCity(defaultMarketCity);
  const prices = pickSerializedPrices(pricesByCity, effectiveCity);
  const { listingTaxRate, premiumSeller } = useMarketCity();

  const outcomes = useMemo(() => {
    const priceMap = deserializePriceMap(prices);
    return computeGuideProfitOutcomes(guideSlug, priceMap, {
      listingTaxRate,
      premiumSeller,
    });
  }, [guideSlug, listingTaxRate, premiumSeller, prices]);

  return (
    <>
      <GuideMarketNote defaultMarketCity={defaultMarketCity} />
      <div className="wiki-note theme-surface mt-4 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
          Profit outcomes / hr (after tax)
        </p>
        <div className="mt-3">
          <ProfitOutcomesTable outcomes={outcomes} />
        </div>
      </div>
    </>
  );
}
