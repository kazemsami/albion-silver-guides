import {
  AVERAGE_MARKET_CITY_ID,
  type MarketCityId,
} from "@/lib/market-cities";

/** Selected market city for price lookups. "average" uses the cross-city median. */
export function effectiveMarketCity(
  selectedCity: MarketCityId,
  _guideDefaultCity?: MarketCityId,
): MarketCityId {
  return selectedCity;
}
