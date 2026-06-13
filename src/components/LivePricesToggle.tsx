"use client";

import { useMarketCity } from "@/components/MarketCityProvider";

export function LivePricesToggle() {
  const { useLivePrices, setUseLivePrices } = useMarketCity();

  return (
    <label
      className="flex cursor-pointer select-none items-center gap-2 text-xs text-parchment/70 sm:text-sm"
      title="Live prices from west.albion-online-data.com (Albion Online Data Project), refreshed about hourly. Off uses site snapshot averages."
    >
      <input
        type="checkbox"
        checked={useLivePrices}
        onChange={(event) => setUseLivePrices(event.target.checked)}
        className="h-3.5 w-3.5 rounded border-gold/30 bg-obsidian text-gold focus:ring-gold/40"
        aria-label="Use live market prices"
      />
      <span className="whitespace-nowrap">Live prices</span>
    </label>
  );
}
