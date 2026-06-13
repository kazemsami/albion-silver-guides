"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AVERAGE_MARKET_CITY_ID,
  DEFAULT_MARKET_CITY_ID,
  isMarketCityId,
  MARKET_CITY_STORAGE_KEY,
  type MarketCityId,
} from "@/lib/market-cities";
import {
  getGatheringYieldMultiplier,
  getListingTaxRate,
  PREMIUM_SELLER_STORAGE_KEY,
} from "@/lib/listing-tax";
import type { GuideProfitRangesByCity, GuideProfitOutcomesByPremium } from "@/lib/guide-economics";
import { pickGuideProfitOutcomes } from "@/lib/guide-economics";
import { effectiveMarketCity } from "@/lib/guide-market-city";

interface MarketCityContextValue {
  marketCity: MarketCityId;
  setMarketCity: (city: MarketCityId) => void;
  premiumSeller: boolean;
  setPremiumSeller: (premium: boolean) => void;
  listingTaxRate: number;
  gatheringYieldMultiplier: number;
}

const MarketCityContext = createContext<MarketCityContextValue | null>(null);

function readStoredMarketCity(): MarketCityId {
  try {
    const stored = localStorage.getItem(MARKET_CITY_STORAGE_KEY);
    if (isMarketCityId(stored)) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_MARKET_CITY_ID;
}

function readStoredPremiumSeller(): boolean {
  try {
    const stored = localStorage.getItem(PREMIUM_SELLER_STORAGE_KEY);
    if (stored === "false") return false;
    if (stored === "true") return true;
  } catch {
    // ignore
  }
  return true;
}

export function MarketCityProvider({ children }: { children: React.ReactNode }) {
  const [marketCity, setMarketCityState] = useState<MarketCityId>(
    DEFAULT_MARKET_CITY_ID,
  );
  const [premiumSeller, setPremiumSellerState] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMarketCityState(readStoredMarketCity());
    setPremiumSellerState(readStoredPremiumSeller());
    setMounted(true);
  }, []);

  const setMarketCity = useCallback((city: MarketCityId) => {
    setMarketCityState(city);
    try {
      localStorage.setItem(MARKET_CITY_STORAGE_KEY, city);
    } catch {
      // ignore
    }
  }, []);

  const setPremiumSeller = useCallback((premium: boolean) => {
    setPremiumSellerState(premium);
    try {
      localStorage.setItem(PREMIUM_SELLER_STORAGE_KEY, String(premium));
    } catch {
      // ignore
    }
  }, []);

  const resolvedCity = mounted ? marketCity : DEFAULT_MARKET_CITY_ID;
  const resolvedPremium = mounted ? premiumSeller : true;

  return (
    <MarketCityContext.Provider
      value={{
        marketCity: resolvedCity,
        setMarketCity,
        premiumSeller: resolvedPremium,
        setPremiumSeller,
        listingTaxRate: getListingTaxRate(resolvedPremium),
        gatheringYieldMultiplier: getGatheringYieldMultiplier(resolvedPremium),
      }}
    >
      {children}
    </MarketCityContext.Provider>
  );
}

export function useMarketCity(): MarketCityContextValue {
  const context = useContext(MarketCityContext);
  if (!context) {
    throw new Error("useMarketCity must be used within MarketCityProvider");
  }
  return context;
}

export function useProfitRangesForCity(
  profitRangesByCity: GuideProfitRangesByCity,
  guideDefaultCity?: MarketCityId,
) {
  const { marketCity } = useMarketCity();
  const city = effectiveMarketCity(marketCity, guideDefaultCity);
  return (
    profitRangesByCity[city] ??
    profitRangesByCity[AVERAGE_MARKET_CITY_ID] ??
    {}
  );
}

export function useGuideProfitOutcomes(
  profitOutcomesByPremium: GuideProfitOutcomesByPremium,
  slug: string,
  guideDefaultCity?: MarketCityId,
) {
  const { marketCity, premiumSeller } = useMarketCity();
  const city = effectiveMarketCity(marketCity, guideDefaultCity);
  return pickGuideProfitOutcomes(
    profitOutcomesByPremium,
    premiumSeller,
    city,
    slug,
  );
}

export function useEffectiveMarketCity(guideDefaultCity?: MarketCityId) {
  const { marketCity } = useMarketCity();
  return effectiveMarketCity(marketCity, guideDefaultCity);
}
