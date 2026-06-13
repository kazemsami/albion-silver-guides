"use client";

import { useProfitRangesForCity } from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuidesListMarketData } from "@/lib/guide-economics";
import { formatSilverRange } from "@/lib/format";

export function HomeProfitRangeStat({
  guides,
  marketData,
}: {
  guides: Guide[];
  marketData: GuidesListMarketData;
}) {
  const profitRanges = useProfitRangesForCity(marketData);

  const liveMins = Object.values(profitRanges).map((r) => r.min);
  const liveMaxs = Object.values(profitRanges).map((r) => r.max);

  const totalSilverRange =
    liveMins.length > 0
      ? { min: Math.min(...liveMins), max: Math.max(...liveMaxs) }
      : guides.reduce(
          (acc, g) => ({
            min: Math.min(acc.min, g.silverPerHour.min),
            max: Math.max(acc.max, g.silverPerHour.max),
          }),
          { min: Infinity, max: 0 },
        );

  return (
    <p className="text-2xl font-bold text-gold">
      {formatSilverRange(totalSilverRange.min, totalSilverRange.max)}
    </p>
  );
}
