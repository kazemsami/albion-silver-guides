"use client";

import { useMarketCity } from "@/components/MarketCityProvider";

export function PremiumTaxToggle() {
  const { premiumSeller, setPremiumSeller } = useMarketCity();

  return (
    <label
      className="flex cursor-pointer select-none items-center gap-2 text-xs text-parchment/70 sm:text-sm"
      title={
        premiumSeller
          ? "Premium: 2.5% setup fee + 4% transaction tax on sell orders, +50% gather/fish yield"
          : "No Premium: 2.5% setup fee + 8% transaction tax on sell orders, no gather/fish bonus"
      }
    >
      <input
        type="checkbox"
        checked={premiumSeller}
        onChange={(event) => setPremiumSeller(event.target.checked)}
        className="h-3.5 w-3.5 rounded border-gold/30 bg-obsidian text-gold focus:ring-gold/40"
        aria-label="Premium account"
      />
      <span className="whitespace-nowrap">Premium</span>
    </label>
  );
}
