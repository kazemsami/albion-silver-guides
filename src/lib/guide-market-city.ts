import {
  AVERAGE_MARKET_CITY_ID,
  type MarketCityId,
} from "@/lib/market-cities";

/** When the user has "Average" selected, use the guide's route city for estimates. */
export function effectiveMarketCity(
  selectedCity: MarketCityId,
  guideDefaultCity?: MarketCityId,
): MarketCityId {
  if (selectedCity === AVERAGE_MARKET_CITY_ID && guideDefaultCity) {
    return guideDefaultCity;
  }
  return selectedCity;
}
