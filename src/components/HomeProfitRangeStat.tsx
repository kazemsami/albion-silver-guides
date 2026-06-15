"use client";

import { useProfitRangesForCity } from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import type { GuideProfitRange, GuidesListMarketData } from "@/lib/guide-economics";
import { formatSilverRange } from "@/lib/format";

function spanFromRanges(ranges: GuideProfitRange[]): GuideProfitRange | null {
  if (ranges.length === 0) return null;
  return {
    min: Math.min(...ranges.map((r) => r.min)),
    max: Math.max(...ranges.map((r) => r.max)),
  };
}

export function HomeProfitRangeStat({
  guides,
  marketData,
  serverProfitRanges,
}: {
  guides: Guide[];
  marketData: GuidesListMarketData;
  serverProfitRanges: Record<string, GuideProfitRange>;
}) {
  const clientProfitRanges = useProfitRangesForCity(marketData, guides);
  const liveSpan = spanFromRanges(Object.values(clientProfitRanges));
  const serverSpan = spanFromRanges(Object.values(serverProfitRanges));
  const totalSilverRange = liveSpan ?? serverSpan;

  return (
    <p className="text-2xl font-bold text-gold">
      {totalSilverRange
        ? formatSilverRange(totalSilverRange.min, totalSilverRange.max)
        : "N/A"}
    </p>
  );
}
