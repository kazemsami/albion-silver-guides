import { unstable_cache } from "next/cache";
import { getGuideEconomics } from "@/data/guide-economics";
import {
  fetchAllGuidesMarketDataByCity,
  fetchGuidePricing,
  fetchGuidesMarketDataForSlugs,
} from "@/lib/guide-economics";

const MARKET_REVALIDATE_SECONDS = 3600;

export const getCachedAllGuidesMarketData = unstable_cache(
  () => fetchAllGuidesMarketDataByCity(),
  ["guides-market-data-all-v8"],
  { revalidate: MARKET_REVALIDATE_SECONDS },
);

export function getCachedGuidesMarketDataForSlugs(slugs: string[]) {
  const key = [...slugs].sort().join(",");
  return unstable_cache(
    () => fetchGuidesMarketDataForSlugs(slugs),
    ["guides-market-data-slugs-v8", key],
    { revalidate: MARKET_REVALIDATE_SECONDS },
  )();
}

export function getCachedGuidePricing(slug: string) {
  const economics = getGuideEconomics(slug);
  return unstable_cache(
    () => fetchGuidePricing(slug, economics),
    ["guide-pricing-v8", slug],
    { revalidate: MARKET_REVALIDATE_SECONDS },
  )();
}
