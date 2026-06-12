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
import type { GuideProfitRangesByCity } from "@/lib/guide-economics";

interface MarketCityContextValue {
  marketCity: MarketCityId;
  setMarketCity: (city: MarketCityId) => void;
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

export function MarketCityProvider({ children }: { children: React.ReactNode }) {
  const [marketCity, setMarketCityState] = useState<MarketCityId>(
    DEFAULT_MARKET_CITY_ID,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMarketCityState(readStoredMarketCity());
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

  return (
    <MarketCityContext.Provider
      value={{ marketCity: mounted ? marketCity : DEFAULT_MARKET_CITY_ID, setMarketCity }}
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
) {
  const { marketCity } = useMarketCity();
  return (
    profitRangesByCity[marketCity] ??
    profitRangesByCity[AVERAGE_MARKET_CITY_ID] ??
    {}
  );
}
