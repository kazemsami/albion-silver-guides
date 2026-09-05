"use client";

import { useMarketCity, useEffectiveMarketCity } from "@/components/MarketCityProvider";
import { AVERAGE_MARKET_CITY_ID, getMarketCityLabel } from "@/lib/market-cities";
import type { MarketCityId } from "@/lib/market-cities";

export function GuideMarketNote({
  defaultMarketCity,
  routeLogged = false,
}: {
  defaultMarketCity?: MarketCityId;
  /** True when the guide has attached test-log evidence (not just a default city). */
  routeLogged?: boolean;
}) {
  const { marketCity, setMarketCity, useLivePrices } = useMarketCity();
  const effectiveCity = useEffectiveMarketCity(defaultMarketCity);
  const usingLivePrices =
    useLivePrices && marketCity !== AVERAGE_MARKET_CITY_ID;
  const priceKindLabel = usingLivePrices ? "live" : "saved snapshot";

  if (!defaultMarketCity || marketCity !== AVERAGE_MARKET_CITY_ID) {
    if (marketCity === AVERAGE_MARKET_CITY_ID) {
      if (!useLivePrices) return null;
      return (
        <p className="mt-2 text-xs text-parchment/45">
          Live prices need a royal city. Average stays on saved snapshots until
          you pick one in the header.
        </p>
      );
    }
    return (
      <p className="mt-2 text-xs text-parchment/45">
        Prices: {getMarketCityLabel(effectiveCity)} ({priceKindLabel}).
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs text-parchment/45">
      Average uses the median price across all six royal cities.{" "}
      {routeLogged ? (
        <>
          This route was logged in{" "}
          <button
            type="button"
            onClick={() => setMarketCity(defaultMarketCity)}
            className="text-gold/90 underline decoration-gold/30 underline-offset-2 hover:text-gold"
          >
            {getMarketCityLabel(defaultMarketCity)}
          </button>
          .
        </>
      ) : (
        <>
          Calculator defaults use{" "}
          <button
            type="button"
            onClick={() => setMarketCity(defaultMarketCity)}
            className="text-gold/90 underline decoration-gold/30 underline-offset-2 hover:text-gold"
          >
            {getMarketCityLabel(defaultMarketCity)}
          </button>{" "}
          {useLivePrices ? "live" : "saved snapshot"} prices.
        </>
      )}{" "}
      {useLivePrices
        ? "Pick a royal city in the header for live quotes. Average stays on saved snapshots."
        : "Turn on Live prices in the header, then pick a royal city for route-specific quotes."}
    </p>
  );
}
