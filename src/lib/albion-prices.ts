import {
  AVERAGE_MARKET_CITY_ID,
  ROYAL_MARKET_CITIES,
  type MarketCityId,
  type RoyalMarketCity,
} from "@/lib/market-cities";
import {
  ALBION_PRICE_SERVERS,
  DEFAULT_ALBION_PRICE_SERVER_ID,
  getAlbionPriceServerApiHost,
  type AlbionPriceServerId,
} from "@/lib/albion-servers";
import { getItemPriceFallback } from "@/data/item-price-fallbacks";

const DEFAULT_API_HOST = getAlbionPriceServerApiHost(
  DEFAULT_ALBION_PRICE_SERVER_ID,
);

export { ROYAL_MARKET_CITIES };

export interface AlbionPriceRow {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_max: number;
  buy_price_min: number;
  buy_price_max: number;
}

export interface ItemPrices {
  sell: number | null;
  buy: number | null;
}

export type PriceMap = Map<string, ItemPrices>;

export type PriceMapsByCity = Record<MarketCityId, PriceMap>;

/** Median ignores million-silver outlier sell orders that skew profit estimates. */
function medianPositive(values: number[]): number | null {
  const valid = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (valid.length === 0) return null;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 === 0
    ? Math.round((valid[mid - 1]! + valid[mid]!) / 2)
    : valid[mid]!;
}

/** Median across royal cities; one value per city listing per item. */
function aggregateRows(rows: AlbionPriceRow[]): PriceMap {
  const sellBuckets = new Map<string, number[]>();
  const buyBuckets = new Map<string, number[]>();

  for (const row of rows) {
    if (row.sell_price_min > 0) {
      const list = sellBuckets.get(row.item_id) ?? [];
      list.push(
        row.sell_price_max > 0
          ? (row.sell_price_min + row.sell_price_max) / 2
          : row.sell_price_min,
      );
      sellBuckets.set(row.item_id, list);
    }

    if (row.buy_price_max > 0) {
      const list = buyBuckets.get(row.item_id) ?? [];
      list.push(
        row.buy_price_min > 0
          ? (row.buy_price_min + row.buy_price_max) / 2
          : row.buy_price_max,
      );
      buyBuckets.set(row.item_id, list);
    }
  }

  const result: PriceMap = new Map();
  const allIds = new Set([...sellBuckets.keys(), ...buyBuckets.keys()]);

  for (const itemId of allIds) {
    result.set(itemId, {
      sell: medianPositive(sellBuckets.get(itemId) ?? []),
      buy: medianPositive(buyBuckets.get(itemId) ?? []),
    });
  }

  return result;
}

export function buildPriceMapsFromRows(rows: AlbionPriceRow[]): PriceMapsByCity {
  const byCity: PriceMapsByCity = {
    [AVERAGE_MARKET_CITY_ID]: aggregateRows(rows),
  } as PriceMapsByCity;

  for (const city of ROYAL_MARKET_CITIES) {
    byCity[city] = aggregateRows(rows.filter((row) => row.city === city));
  }

  return byCity;
}

async function fetchPriceBatch(
  itemIds: string[],
  apiHost: string = DEFAULT_API_HOST,
): Promise<AlbionPriceRow[]> {
  const encoded = itemIds.map((id) => encodeURIComponent(id)).join(",");
  const locations = ROYAL_MARKET_CITIES.join(",");
  const url = `${apiHost}/api/v2/stats/prices/${encoded}.json?locations=${locations}&qualities=1`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Albion price API error ${res.status} for ${itemIds.length} items`);
  }

  return res.json() as Promise<AlbionPriceRow[]>;
}

/** Fetch raw price rows for all royal cities (hourly revalidation). */
export async function fetchAlbionPriceRows(
  itemIds: string[],
  apiHost: string = DEFAULT_API_HOST,
): Promise<AlbionPriceRow[]> {
  const unique = [...new Set(itemIds)];
  if (unique.length === 0) return [];

  const merged: AlbionPriceRow[] = [];
  const chunkSize = 40;
  let chunkFailures = 0;
  const chunkCount = Math.ceil(unique.length / chunkSize);

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    try {
      merged.push(...(await fetchPriceBatch(chunk, apiHost)));
    } catch {
      chunkFailures += 1;
    }
  }

  const usable = merged.some(
    (row) => row.sell_price_min > 0 || row.buy_price_max > 0,
  );

  // Empty or all-zero payloads must fail so callers do not treat snapshots as live.
  if (!usable) {
    throw new Error(
      `Albion price API returned no usable prices for ${unique.length} items (${apiHost}; ${chunkFailures}/${chunkCount} chunks failed)`,
    );
  }

  return merged;
}

/** Overlay live buy/sell onto a base map; keep base values when live is missing. */
export function mergePriceMap(base: PriceMap, overlay: PriceMap): PriceMap {
  const result: PriceMap = new Map(base);
  for (const [itemId, live] of overlay) {
    const prev = result.get(itemId) ?? { sell: null, buy: null };
    result.set(itemId, {
      sell: live.sell != null && live.sell > 0 ? live.sell : prev.sell,
      buy: live.buy != null && live.buy > 0 ? live.buy : prev.buy,
    });
  }
  return result;
}

export function mergePriceMapsByCity(
  base: PriceMapsByCity,
  overlay: PriceMapsByCity,
): PriceMapsByCity {
  const result = { ...base } as PriceMapsByCity;
  for (const city of Object.keys(overlay) as MarketCityId[]) {
    const baseMap = base[city] ?? new Map();
    const overlayMap = overlay[city] ?? new Map();
    result[city] = mergePriceMap(baseMap, overlayMap);
  }
  return result;
}

/**
 * Fetch per-city price maps for every Albion price server region.
 * When `baseMaps` is provided, live quotes overlay that full map (e.g. estimated
 * including enchanted ids not requested from the API).
 */
export async function fetchAlbionPricesByCityAllServers(
  itemIds: string[],
  baseMaps?: PriceMapsByCity,
): Promise<Record<AlbionPriceServerId, PriceMapsByCity>> {
  const fallback = baseMaps ?? buildEstimatedPriceMapsByCity(itemIds);
  const entries = await Promise.all(
    ALBION_PRICE_SERVERS.map(async (server) => {
      try {
        const rows = await fetchAlbionPriceRows(itemIds, server.apiHost);
        const live = buildPriceMapsFromRows(rows);
        return [server.id, mergePriceMapsByCity(fallback, live)] as const;
      } catch {
        return [server.id, fallback] as const;
      }
    }),
  );
  return Object.fromEntries(entries) as Record<
    AlbionPriceServerId,
    PriceMapsByCity
  >;
}

/** Fetch median buy/sell prices across all royal cities (default). */
export async function fetchAlbionPrices(
  itemIds: string[],
  apiHost: string = DEFAULT_API_HOST,
): Promise<PriceMap> {
  const rows = await fetchAlbionPriceRows(itemIds, apiHost);
  return buildPriceMapsFromRows(rows)[AVERAGE_MARKET_CITY_ID];
}

/** Fetch per-city price maps plus the cross-city average. */
export async function fetchAlbionPricesByCity(
  itemIds: string[],
  apiHost: string = DEFAULT_API_HOST,
): Promise<PriceMapsByCity> {
  const rows = await fetchAlbionPriceRows(itemIds, apiHost);
  return buildPriceMapsFromRows(rows);
}

export function getSellPrice(prices: PriceMap, itemId: string): number | null {
  return prices.get(itemId)?.sell ?? null;
}

export function getBuyPrice(prices: PriceMap, itemId: string): number | null {
  return prices.get(itemId)?.buy ?? null;
}

/** Loadout gear is priced at average sell (replacement cost), with static fallback. */
export function getLoadoutUnitPrice(
  _prices: PriceMap,
  itemId: string,
): number | null {
  return getItemPriceFallback(itemId, "sell");
}

export type PriceMapKind = "live" | "snapshot";

export function resolveSellPrice(
  prices: PriceMap,
  itemId: string,
  mapKind: PriceMapKind = "snapshot",
): { unitPrice: number | null; priceSource: "market" | "snapshot" | "estimated" } {
  const fromMap = prices.get(itemId)?.sell;
  if (fromMap != null && fromMap > 0) {
    return {
      unitPrice: fromMap,
      priceSource: mapKind === "live" ? "market" : "snapshot",
    };
  }
  const fallback = getItemPriceFallback(itemId, "sell");
  return { unitPrice: fallback, priceSource: "estimated" };
}

export function resolveBuyPrice(
  prices: PriceMap,
  itemId: string,
  mapKind: PriceMapKind = "snapshot",
): { unitPrice: number | null; priceSource: "market" | "snapshot" | "estimated" } {
  const fromMap = prices.get(itemId)?.buy;
  if (fromMap != null && fromMap > 0) {
    return {
      unitPrice: fromMap,
      priceSource: mapKind === "live" ? "market" : "snapshot",
    };
  }
  const fallback = getItemPriceFallback(itemId, "buy");
  return { unitPrice: fallback, priceSource: "estimated" };
}

/** Build a price map from site snapshot estimates (no live API). */
export function buildEstimatedPriceMap(itemIds: string[]): PriceMap {
  const unique = [...new Set(itemIds)];
  const result: PriceMap = new Map();

  for (const itemId of unique) {
    result.set(itemId, {
      sell: getItemPriceFallback(itemId, "sell"),
      buy: getItemPriceFallback(itemId, "buy"),
    });
  }

  return result;
}

/** Same estimated map for every city (snapshots are not city-specific). */
export function buildEstimatedPriceMapsByCity(
  itemIds: string[],
): PriceMapsByCity {
  const average = buildEstimatedPriceMap(itemIds);
  const result: PriceMapsByCity = {
    [AVERAGE_MARKET_CITY_ID]: average,
  } as PriceMapsByCity;

  for (const city of ROYAL_MARKET_CITIES) {
    result[city] = average;
  }

  return result;
}
