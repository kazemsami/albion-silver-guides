"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_MARKET_CITY_ID,
  isMarketCityId,
  LIVE_PRICES_STORAGE_KEY,
  MARKET_CITY_STORAGE_KEY,
  type MarketCityId,
} from "@/lib/market-cities";
import {
  getGatheringYieldMultiplier,
  getListingTaxRate,
  PREMIUM_SELLER_STORAGE_KEY,
} from "@/lib/listing-tax";
import type { GuidesListMarketData } from "@/lib/guide-economics";
import { pickGuideProfitOutcomes, pickGuideProfitRanges } from "@/lib/guide-economics";
import { effectiveMarketCity } from "@/lib/guide-market-city";
import { deserializePriceMap, pickGuideMarketPrices } from "@/lib/guide-economics";
import type { PriceMapKind } from "@/lib/albion-prices";
import type { GuideMarketPrices } from "@/types/guide";

interface MarketCityContextValue {
  marketCity: MarketCityId;
  setMarketCity: (city: MarketCityId) => void;
  useLivePrices: boolean;
  setUseLivePrices: (enabled: boolean) => void;
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
  return false;
}

function readStoredUseLivePrices(): boolean {
  try {
    const stored = localStorage.getItem(LIVE_PRICES_STORAGE_KEY);
    if (stored === "false") return false;
    if (stored === "true") return true;
  } catch {
    // ignore
  }
  return false;
}

export function MarketCityProvider({ children }: { children: React.ReactNode }) {
  const [marketCity, setMarketCityState] = useState<MarketCityId>(
    DEFAULT_MARKET_CITY_ID,
  );
  const [useLivePrices, setUseLivePricesState] = useState(false);
  const [premiumSeller, setPremiumSellerState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMarketCityState(readStoredMarketCity());
    setUseLivePricesState(readStoredUseLivePrices());
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

  const setUseLivePrices = useCallback((enabled: boolean) => {
    setUseLivePricesState(enabled);
    try {
      localStorage.setItem(LIVE_PRICES_STORAGE_KEY, String(enabled));
    } catch {
      // ignore
    }
  }, []);

  const resolvedCity = mounted ? marketCity : DEFAULT_MARKET_CITY_ID;
  const resolvedUseLivePrices = mounted ? useLivePrices : false;
  const resolvedPremium = mounted ? premiumSeller : false;

  return (
    <MarketCityContext.Provider
      value={{
        marketCity: resolvedCity,
        setMarketCity,
        useLivePrices: resolvedUseLivePrices,
        setUseLivePrices,
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

export function useGuidesListMarketSource(
  marketData: GuidesListMarketData,
): GuidesListMarketData["estimated"] {
  const { useLivePrices } = useMarketCity();
  return useLivePrices ? marketData.live : marketData.estimated;
}

export function useProfitRangesForCity(
  marketData: GuidesListMarketData,
  guideDefaultCity?: MarketCityId,
) {
  const { marketCity, premiumSeller } = useMarketCity();
  const city = effectiveMarketCity(marketCity, guideDefaultCity);
  const source = useGuidesListMarketSource(marketData);
  return pickGuideProfitRanges(source.ranges, premiumSeller, city);
}

export function useGuideProfitOutcomes(
  marketData: GuidesListMarketData,
  slug: string,
  guideDefaultCity?: MarketCityId,
) {
  const { marketCity, premiumSeller } = useMarketCity();
  const city = effectiveMarketCity(marketCity, guideDefaultCity);
  const source = useGuidesListMarketSource(marketData);
  return pickGuideProfitOutcomes(
    source.outcomes,
    premiumSeller,
    city,
    slug,
  );
}

export function useEffectiveMarketCity(guideDefaultCity?: MarketCityId) {
  const { marketCity } = useMarketCity();
  return effectiveMarketCity(marketCity, guideDefaultCity);
}

export function useGuidePriceMap(
  guidePrices: GuideMarketPrices,
  guideDefaultCity?: MarketCityId,
) {
  const { useLivePrices } = useMarketCity();
  const effectiveCity = useEffectiveMarketCity(guideDefaultCity);
  const mapKind: PriceMapKind = useLivePrices ? "live" : "snapshot";

  const serialized = useMemo(
    () => pickGuideMarketPrices(guidePrices, effectiveCity, useLivePrices),
    [guidePrices, effectiveCity, useLivePrices],
  );

  const priceMap = useMemo(() => deserializePriceMap(serialized), [serialized]);

  return { priceMap, mapKind, useLivePrices, effectiveCity, serializedPrices: serialized };
}
