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
  DEFAULT_ALBION_PRICE_SERVER_ID,
  isAlbionPriceServerId,
  ALBION_PRICE_SERVER_STORAGE_KEY,
  type AlbionPriceServerId,
} from "@/lib/albion-servers";
import {
  getGatheringYieldMultiplier,
  getListingTaxRate,
  PREMIUM_SELLER_STORAGE_KEY,
} from "@/lib/listing-tax";
import type { GuidesListMarketData, GuidesListMarketSlice } from "@/lib/guide-economics";
import {
  pickGuideProfitOutcomes,
  pickGuideProfitRanges,
} from "@/lib/guide-economics";
import { profitRangeFromOutcomes } from "@/lib/guide-profit-outcomes";
import { effectiveMarketCity } from "@/lib/guide-market-city";
import { deserializePriceMap, pickGuideMarketPrices } from "@/lib/guide-economics";
import type { PriceMapKind } from "@/lib/albion-prices";
import type { GuideMarketPrices } from "@/types/guide";

interface MarketCityContextValue {
  marketCity: MarketCityId;
  setMarketCity: (city: MarketCityId) => void;
  priceServer: AlbionPriceServerId;
  setPriceServer: (server: AlbionPriceServerId) => void;
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

function readStoredPriceServer(): AlbionPriceServerId {
  try {
    const stored = localStorage.getItem(ALBION_PRICE_SERVER_STORAGE_KEY);
    if (isAlbionPriceServerId(stored)) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_ALBION_PRICE_SERVER_ID;
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
  const [priceServer, setPriceServerState] = useState<AlbionPriceServerId>(
    DEFAULT_ALBION_PRICE_SERVER_ID,
  );
  const [useLivePrices, setUseLivePricesState] = useState(false);
  const [premiumSeller, setPremiumSellerState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMarketCityState(readStoredMarketCity());
    setPriceServerState(readStoredPriceServer());
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

  const setPriceServer = useCallback((server: AlbionPriceServerId) => {
    setPriceServerState(server);
    try {
      localStorage.setItem(ALBION_PRICE_SERVER_STORAGE_KEY, server);
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
  const resolvedPriceServer = mounted
    ? priceServer
    : DEFAULT_ALBION_PRICE_SERVER_ID;
  const resolvedUseLivePrices = mounted ? useLivePrices : false;
  const resolvedPremium = mounted ? premiumSeller : false;

  return (
    <MarketCityContext.Provider
      value={{
        marketCity: resolvedCity,
        setMarketCity,
        priceServer: resolvedPriceServer,
        setPriceServer,
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
): GuidesListMarketSlice {
  const { useLivePrices, priceServer } = useMarketCity();
  if (!useLivePrices) return marketData.estimated;
  return (
    marketData.liveByServer[priceServer] ??
    marketData.liveByServer[DEFAULT_ALBION_PRICE_SERVER_ID]
  );
}

export function useProfitRangesForCity(
  marketData: GuidesListMarketData,
  guideList: readonly {
    slug: string;
    defaultMarketCity?: MarketCityId;
  }[] = [],
) {
  const { marketCity, premiumSeller } = useMarketCity();
  const source = useGuidesListMarketSource(marketData);

  return useMemo(() => {
    if (guideList.length === 0) {
      return pickGuideProfitRanges(source.ranges, premiumSeller, marketCity);
    }

    const result: Record<string, { min: number; max: number }> = {};
    for (const guide of guideList) {
      const city = effectiveMarketCity(marketCity, guide.defaultMarketCity);
      const outcomes = pickGuideProfitOutcomes(
        source.outcomes,
        premiumSeller,
        city,
        guide.slug,
      );
      const range = outcomes ? profitRangeFromOutcomes(outcomes) : null;
      if (range) {
        result[guide.slug] = range;
      }
    }
    return result;
  }, [guideList, marketCity, premiumSeller, source]);
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
  const { useLivePrices, priceServer } = useMarketCity();
  const effectiveCity = useEffectiveMarketCity(guideDefaultCity);
  const mapKind: PriceMapKind = useLivePrices ? "live" : "snapshot";

  const serialized = useMemo(
    () =>
      pickGuideMarketPrices(
        guidePrices,
        effectiveCity,
        useLivePrices,
        priceServer,
      ),
    [guidePrices, effectiveCity, useLivePrices, priceServer],
  );

  const priceMap = useMemo(() => deserializePriceMap(serialized), [serialized]);

  return { priceMap, mapKind, useLivePrices, effectiveCity, serializedPrices: serialized };
}
