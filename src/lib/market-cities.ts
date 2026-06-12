export const ROYAL_MARKET_CITIES = [
  "Caerleon",
  "Bridgewatch",
  "Lymhurst",
  "Martlock",
  "Fort Sterling",
  "Thetford",
] as const;

export type RoyalMarketCity = (typeof ROYAL_MARKET_CITIES)[number];

export const AVERAGE_MARKET_CITY_ID = "average" as const;

export type MarketCityId = typeof AVERAGE_MARKET_CITY_ID | RoyalMarketCity;

export const MARKET_CITY_STORAGE_KEY = "albion-silver-market-city";

export const DEFAULT_MARKET_CITY_ID: MarketCityId = AVERAGE_MARKET_CITY_ID;

export const MARKET_CITY_OPTIONS: {
  id: MarketCityId;
  label: string;
  /** Shorter label for the header dropdown when space is tight. */
  shortLabel?: string;
}[] = [
  {
    id: AVERAGE_MARKET_CITY_ID,
    label: "Average (all royal cities)",
    shortLabel: "Average",
  },
  ...ROYAL_MARKET_CITIES.map((city) => ({ id: city, label: city })),
];

export function isMarketCityId(value: string | null): value is MarketCityId {
  if (value === AVERAGE_MARKET_CITY_ID) return true;
  return ROYAL_MARKET_CITIES.includes(value as RoyalMarketCity);
}

export function getMarketCityLabel(id: MarketCityId): string {
  return MARKET_CITY_OPTIONS.find((option) => option.id === id)?.label ?? id;
}
