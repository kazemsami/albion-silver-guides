"use client";

import { useMarketCity } from "@/components/MarketCityProvider";

export function PremiumTaxToggle() {
  const { premiumSeller, setPremiumSeller } = useMarketCity();

  return (
    <label
      className="flex cursor-pointer select-none items-center gap-1.5 text-xs text-parchment/70"
      title={
        premiumSeller
          ? "Premium: 6.5% listing tax, +50% gather/fish yield"
          : "No Premium: 10.5% listing tax, no gather/fish bonus"
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
