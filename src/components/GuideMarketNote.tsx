"use client";

import { useMarketCity, useEffectiveMarketCity } from "@/components/MarketCityProvider";
import { AVERAGE_MARKET_CITY_ID, getMarketCityLabel } from "@/lib/market-cities";
import type { MarketCityId } from "@/lib/market-cities";

export function GuideMarketNote({
  defaultMarketCity,
}: {
  defaultMarketCity?: MarketCityId;
}) {
  const { marketCity, setMarketCity } = useMarketCity();
  const effectiveCity = useEffectiveMarketCity(defaultMarketCity);

  if (!defaultMarketCity || marketCity !== AVERAGE_MARKET_CITY_ID) {
    if (marketCity === AVERAGE_MARKET_CITY_ID) return null;
    return (
      <p className="mt-2 text-xs text-parchment/45">
        Prices: {getMarketCityLabel(effectiveCity)} (estimated snapshot).
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs text-parchment/45">
      This route defaults to{" "}
      <button
        type="button"
        onClick={() => setMarketCity(defaultMarketCity)}
        className="text-gold/90 underline decoration-gold/30 underline-offset-2 hover:text-gold"
      >
        {getMarketCityLabel(defaultMarketCity)} prices
      </button>
      . Change market in the header to compare cities.
    </p>
  );
}
