import { guideEconomicsBySlug } from "@/data/guide-economics";
import {
  buildLaborerHourlyEconomics,
  collectLaborerSpecialtyItemIds,
  getLaborerSpecialty,
  LABORER_SPECIALTIES,
} from "@/data/laborer-specialties";
import { T8_HOUSE_BUILD_ITEM_IDS } from "@/data/t8-house-cost";
import { getAllTierLoadouts, loadoutVariantForTier } from "@/data/guide-loadouts";
import { computeTrackingProfitRange } from "@/lib/tracking-economics";
import { collectPotionPricingItemIds } from "@/data/potion-economics";
import { computePotionProfitRange } from "@/lib/potion-economics";
import { computeAvaRoadsProfitRange } from "@/lib/ava-roads-economics";
import { computeAbyssalProfitRange } from "@/lib/abyssal-economics";
import {
  PREMIUM_LISTING_TAX_RATE,
  getListingTaxRate,
  isPremiumYieldItem,
} from "@/lib/listing-tax";
import type {
  AlbionItem,
  EquipmentLoadout,
  GuideEconomics,
  HourlyEconomicsResult,
  HourlyItem,
  LoadoutPricing,
  PricedLine,
  SerializedPriceMap,
  SerializedPricesByCity,
  SkillTier,
  TierLoadoutBundle,
  GuideMarketPrices,
} from "@/types/guide";
import {
  AVERAGE_MARKET_CITY_ID,
  type MarketCityId,
} from "@/lib/market-cities";
import {
  buildEstimatedPriceMapsByCity,
  fetchAlbionPricesByCity,
  resolveBuyPrice,
  resolveSellPrice,
  type PriceMap,
  type PriceMapKind,
  type PriceMapsByCity,
} from "@/lib/albion-prices";
import { computeGuideProfitOutcomes } from "@/lib/guide-profit-outcomes";
import type { GuideProfitOutcomesMap } from "@/lib/guide-profit-outcomes";
import type { GuideProfitOutcomes } from "@/types/guide";
import { roundSilver } from "@/lib/format";

function scaleQuantity(quantity: number, multiplier: number): number {
  const scaled = quantity * multiplier;
  if (scaled < 1) {
    return Math.round(scaled * 100) / 100;
  }
  return Math.max(1, Math.round(scaled));
}

function defaultCarryQuantity(itemId: string): number | undefined {
  if (itemId.includes("JOURNAL") && itemId.includes("EMPTY")) return 1;
  if (
    itemId.includes("POTION") ||
    itemId.includes("FISHINGBAIT") ||
    itemId.includes("_MEAL_")
  ) {
    return 1;
  }
  return undefined;
}

/** Attach per-hour quantities from economics onto loadout items for display. */
export function enrichLoadoutWithQuantities(
  loadout: EquipmentLoadout,
  economics: GuideEconomics,
  tier: SkillTier,
  gatheringYieldMultiplier: number = 1,
): EquipmentLoadout {
  const scaled = scaleGuideEconomics(economics, tier, {
    gatheringYieldMultiplier,
  });
  const quantityById = new Map<string, number>();

  for (const item of scaled.hourlyConsumables ?? []) {
    quantityById.set(item.id, item.quantity);
  }
  // Only journals from inputs, bulk craft materials use per-recipe qty in loadout data.
  for (const item of scaled.hourlyInputs ?? []) {
    if (item.id.includes("JOURNAL")) {
      quantityById.set(item.id, item.quantity);
    }
  }

  const enrichItem = (item: AlbionItem): AlbionItem => {
    if (item.quantity != null) return item;
    const qty = quantityById.get(item.id) ?? defaultCarryQuantity(item.id);
    if (qty == null) return item;
    return { ...item, quantity: Math.max(1, Math.round(qty)) };
  };

  return {
    ...loadout,
    slots: Object.fromEntries(
      Object.entries(loadout.slots).map(([key, item]) => [
        key,
        item ? enrichItem(item) : item,
      ]),
    ) as EquipmentLoadout["slots"],
    inventory: loadout.inventory?.map(enrichItem),
  };
}

export function scaleGuideEconomics(
  economics: GuideEconomics,
  tier: SkillTier,
  options?: { gatheringYieldMultiplier?: number },
): Pick<GuideEconomics, "hourlyOutput" | "hourlyInputs" | "hourlyConsumables"> {
  const outM = tier.outputMultiplier;
  const inM = tier.inputMultiplier ?? tier.outputMultiplier;
  const conM = tier.consumableMultiplier ?? tier.outputMultiplier;
  const yieldMul = options?.gatheringYieldMultiplier ?? 1;

  const outputSource = tier.hourlyOutput ?? economics.hourlyOutput;
  const scaleOutputQty = (item: HourlyItem, tierMul: number) => {
    const premiumMul = isPremiumYieldItem(item.id) ? yieldMul : 1;
    return scaleQuantity(item.quantity, tierMul * premiumMul);
  };

  return {
    hourlyOutput: [
      ...outputSource.map((item) => ({
        ...item,
        quantity: scaleOutputQty(item, outM),
      })),
      ...(tier.bonusOutput ?? []).map((item) => ({
        ...item,
        quantity: scaleOutputQty(item, 1),
      })),
    ],
    hourlyInputs: (tier.hourlyInputs ?? economics.hourlyInputs)?.map((item) => ({
      ...item,
      quantity: scaleQuantity(item.quantity, inM),
    })),
    hourlyConsumables: (tier.hourlyConsumables ?? economics.hourlyConsumables)?.map(
      (item) => ({
        ...item,
        quantity: scaleQuantity(item.quantity, conM),
      }),
    ),
  };
}

export function serializePriceMap(prices: PriceMap): SerializedPriceMap {
  const result: SerializedPriceMap = {};
  for (const [id, value] of prices) {
    result[id] = value;
  }
  return result;
}

export function deserializePriceMap(serialized: SerializedPriceMap): PriceMap {
  return new Map(Object.entries(serialized));
}

export function serializePriceMapsByCity(
  priceMaps: PriceMapsByCity,
): SerializedPricesByCity {
  const result: SerializedPricesByCity = {};
  for (const [city, map] of Object.entries(priceMaps)) {
    result[city] = serializePriceMap(map);
  }
  return result;
}

export function pickSerializedPrices(
  pricesByCity: SerializedPricesByCity,
  city: MarketCityId,
): SerializedPriceMap {
  return (
    pricesByCity[city] ??
    pricesByCity[AVERAGE_MARKET_CITY_ID] ??
    Object.values(pricesByCity)[0] ??
    {}
  );
}

export function pickGuideMarketPrices(
  guidePrices: GuideMarketPrices,
  city: MarketCityId,
  useLivePrices: boolean,
): SerializedPriceMap {
  const source = useLivePrices
    ? guidePrices.liveByCity
    : guidePrices.estimatedByCity;
  return pickSerializedPrices(source, city);
}

export function toGuideMarketPrices(
  estimatedByCity: SerializedPricesByCity,
  liveByCity?: SerializedPricesByCity,
): GuideMarketPrices {
  return {
    estimatedByCity,
    liveByCity: liveByCity ?? estimatedByCity,
  };
}

export type GuideProfitRange = { min: number; max: number };
export type GuideProfitRangeMap = Record<string, GuideProfitRange>;
export type GuideProfitRangesByCity = Record<string, GuideProfitRangeMap>;

function guideUsesGatheringYield(economics: GuideEconomics): boolean {
  const items = [
    ...economics.hourlyOutput,
    ...economics.skillTiers.flatMap((tier) => [
      ...(tier.hourlyOutput ?? []),
      ...(tier.bonusOutput ?? []),
    ]),
  ];
  return items.some((item) => isPremiumYieldItem(item.id));
}

function netTotalsForEconomics(
  economics: GuideEconomics,
  prices: PriceMap,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
  gatheringYieldMultiplier: number = 1,
): (number | null)[] {
  const yieldOptions = guideUsesGatheringYield(economics)
    ? { gatheringYieldMultiplier }
    : undefined;

  if (economics.defaultLaborerSpecialtyId) {
    return LABORER_SPECIALTIES.flatMap((specialty) =>
      economics.skillTiers.map((tier) => {
        const scaled = buildLaborerHourlyEconomics(specialty, tier);
        return computeHourlyEconomics(
          { ...economics, ...scaled },
          prices,
          AVERAGE_MARKET_CITY_ID,
          listingTaxRate,
        ).netAfterTax;
      }),
    );
  }

  return economics.skillTiers.map((tier) => {
    const scaled = scaleGuideEconomics(economics, tier, yieldOptions);
    return computeHourlyEconomics(
      { ...economics, ...scaled },
      prices,
      AVERAGE_MARKET_CITY_ID,
      listingTaxRate,
    ).netAfterTax;
  });
}

export function computeProfitRange(
  economics: GuideEconomics,
  prices: PriceMap,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
  gatheringYieldMultiplier: number = 1,
): { min: number | null; max: number | null } {
  const valid = netTotalsForEconomics(
    economics,
    prices,
    listingTaxRate,
    gatheringYieldMultiplier,
  ).filter(
    (n): n is number => n != null,
  );
  if (valid.length === 0) return { min: null, max: null };
  return {
    min: roundSilver(Math.min(...valid)),
    max: roundSilver(Math.max(...valid)),
  };
}

function computeAllGuideProfitRanges(
  slugs: string[],
  priceMaps: PriceMapsByCity,
): GuideProfitRangesByCity {
  const result: GuideProfitRangesByCity = {};

  for (const city of Object.keys(priceMaps)) {
    const prices = priceMaps[city as MarketCityId];
    const cityRanges: GuideProfitRangeMap = {};

    for (const slug of slugs) {
      const economics = guideEconomicsBySlug[slug];
      if (slug === "high-tier-group-tracking") {
        const range = computeTrackingProfitRange(prices);
        cityRanges[slug] = range;
        continue;
      }
      if (slug === "potions-crafting-bulk") {
        cityRanges[slug] = computePotionProfitRange(prices);
        continue;
      }
      if (slug === "ava-roads-fishing") {
        cityRanges[slug] = computeAvaRoadsProfitRange(prices);
        continue;
      }
      if (slug === "abyssal-depths-farming") {
        cityRanges[slug] = computeAbyssalProfitRange(prices);
        continue;
      }
      const range = computeProfitRange(economics, prices);
      if (range.min != null && range.max != null) {
        cityRanges[slug] = { min: range.min, max: range.max };
      }
    }

    result[city] = cityRanges;
  }

  return result;
}

/** Compute profit/hr ranges for every guide with economics using estimated prices. */
export async function fetchAllGuidesProfitRanges(): Promise<
  Record<string, GuideProfitRange>
> {
  const byCity = await fetchAllGuidesProfitRangesByCity();
  return byCity[AVERAGE_MARKET_CITY_ID] ?? {};
}

export type GuideProfitOutcomesByCity = Record<string, GuideProfitOutcomesMap>;

export type GuideProfitOutcomesByPremium = {
  premium: GuideProfitOutcomesByCity;
  standard: GuideProfitOutcomesByCity;
};

/** Snapshot and live market data for guide list cards. */
export type GuidesListMarketData = {
  estimated: {
    ranges: GuideProfitRangesByCity;
    outcomes: GuideProfitOutcomesByPremium;
  };
  live: {
    ranges: GuideProfitRangesByCity;
    outcomes: GuideProfitOutcomesByPremium;
  };
};

function buildGuidesListMarketSlice(
  slugs: string[],
  priceMaps: PriceMapsByCity,
): GuidesListMarketData["estimated"] {
  return {
    ranges: computeAllGuideProfitRanges(slugs, priceMaps),
    outcomes: {
      premium: computeAllGuideProfitOutcomes(slugs, priceMaps, true),
      standard: computeAllGuideProfitOutcomes(slugs, priceMaps, false),
    },
  };
}

function computeAllGuideProfitOutcomes(
  slugs: string[],
  priceMaps: PriceMapsByCity,
  premiumSeller: boolean,
): GuideProfitOutcomesByCity {
  const listingTaxRate = getListingTaxRate(premiumSeller);
  const result: GuideProfitOutcomesByCity = {};
  for (const city of Object.keys(priceMaps)) {
    const prices = priceMaps[city as MarketCityId];
    const cityOutcomes: GuideProfitOutcomesMap = {};
    for (const slug of slugs) {
      cityOutcomes[slug] = computeGuideProfitOutcomes(slug, prices, {
        premiumSeller,
        listingTaxRate,
      });
    }
    result[city] = cityOutcomes;
  }
  return result;
}

export function pickGuideProfitOutcomes(
  data: GuideProfitOutcomesByPremium,
  premiumSeller: boolean,
  city: MarketCityId,
  slug: string,
): GuideProfitOutcomes | undefined {
  const byCity = premiumSeller ? data.premium : data.standard;
  return (
    byCity[city]?.[slug] ?? byCity[AVERAGE_MARKET_CITY_ID]?.[slug]
  );
}

/** Profit ranges per market city for list pages and the city selector. */
export async function fetchAllGuidesProfitRangesByCity(): Promise<
  GuideProfitRangesByCity
> {
  const data = await fetchAllGuidesMarketDataByCity();
  return data.estimated.ranges;
}

export async function fetchAllGuidesMarketDataByCity(): Promise<GuidesListMarketData> {
  const slugs = Object.keys(guideEconomicsBySlug);
  const allItemIds = new Set<string>();

  for (const slug of slugs) {
    const economics = guideEconomicsBySlug[slug];
    const tierLoadouts = getAllTierLoadouts(
      slug,
      economics.skillTiers.map((t) => t.id),
    );
    for (const id of collectGuideItemIds(tierLoadouts, economics)) {
      allItemIds.add(id);
    }
    if (slug === "potions-crafting-bulk") {
      for (const id of collectPotionPricingItemIds()) {
        allItemIds.add(id);
      }
    }
  }

  const itemIdList = [...allItemIds];
  const estimatedPriceMaps = buildEstimatedPriceMapsByCity(itemIdList);
  let livePriceMaps: PriceMapsByCity = estimatedPriceMaps;
  try {
    livePriceMaps = await fetchAlbionPricesByCity(itemIdList);
  } catch {
    // Live API unavailable; cards fall back to snapshot maps for live slice too.
  }

  return {
    estimated: buildGuidesListMarketSlice(slugs, estimatedPriceMaps),
    live: buildGuidesListMarketSlice(slugs, livePriceMaps),
  };
}

const CONSUMABLE_IDS = new Set([
  "T4_MEAL_STEW",
  "T6_MEAL_STEW",
  "T7_MEAL_PIE",
  "T1_MEAL_SEAWEEDSALAD",
  "T3_FISHINGBAIT",
  "T6_POTION_HEAL",
  "T6_POTION_ENERGY",
  "T6_POTION_COOLDOWN",
  "T6_POTION_BERSERK",
  "T6_POTION_LAVA",
  "T6_POTION_GATHER",
  "T6_POTION_TORNADO",
  "T7_POTION_REVIVE",
  "T7_POTION_STONESKIN",
  "T7_POTION_SLOWFIELD",
  "T7_POTION_MOB_RESET",
  "T7_POTION_CLEANSE2",
  "T7_POTION_ACID",
  "T8_POTION_CLEANSE",
  "T8_POTION_COOLDOWN",
  "T8_POTION_BERSERK",
  "T8_POTION_LAVA",
  "T8_POTION_GATHER",
  "T8_POTION_TORNADO",
  "T8_MEAL_STEW",
  "T7_MEAL_OMELETTE",
]);

function resolveUnitPrice(
  item: HourlyItem | AlbionItem,
  prices: PriceMap,
  side: "buy" | "sell",
  mapKind: PriceMapKind = "snapshot",
): { unitPrice: number | null; priceSource?: PricedLine["priceSource"] } {
  const fixedSilver =
    "fixedSilverPerUnit" in item ? item.fixedSilverPerUnit : undefined;
  if (fixedSilver != null) {
    return { unitPrice: fixedSilver, priceSource: "fixed" };
  }

  const itemEstimate =
    "estimatedSilverPerUnit" in item ? item.estimatedSilverPerUnit : undefined;
  if (itemEstimate != null) {
    return { unitPrice: itemEstimate, priceSource: "estimated" };
  }

  const resolved =
    side === "buy"
      ? resolveBuyPrice(prices, item.id, mapKind)
      : resolveSellPrice(prices, item.id, mapKind);
  if (resolved.unitPrice != null) {
    return { unitPrice: resolved.unitPrice, priceSource: resolved.priceSource };
  }

  return { unitPrice: null };
}

function priceLine(
  item: HourlyItem | AlbionItem,
  quantity: number,
  prices: PriceMap,
  side: "buy" | "sell" = "sell",
  mapKind: PriceMapKind = "snapshot",
): PricedLine {
  const { unitPrice, priceSource } = resolveUnitPrice(
    item,
    prices,
    side,
    mapKind,
  );

  return {
    id: item.id,
    name: item.name,
    quantity,
    unitPrice,
    lineTotal:
      unitPrice != null ? roundSilver(unitPrice * quantity) : null,
    priceSource,
  };
}

function sumLines(lines: PricedLine[]): number | null {
  if (lines.length === 0) return null;
  let total = 0;
  let hasPrice = false;
  for (const line of lines) {
    if (line.lineTotal == null) continue;
    total += line.lineTotal;
    hasPrice = true;
  }
  return hasPrice ? roundSilver(total) : null;
}

export function collectGuideItemIds(
  loadouts: (EquipmentLoadout | undefined)[],
  economics?: GuideEconomics,
): string[] {
  const ids = new Set<string>();

  for (const loadout of loadouts) {
    if (!loadout) continue;
    for (const item of Object.values(loadout.slots)) {
      if (item) ids.add(item.id);
    }
    for (const item of loadout.inventory ?? []) {
      ids.add(item.id);
    }
  }

  if (economics) {
    for (const item of economics.hourlyOutput) ids.add(item.id);
    for (const item of economics.hourlyInputs ?? []) ids.add(item.id);
    for (const item of economics.hourlyConsumables ?? []) ids.add(item.id);
    for (const tier of economics.skillTiers) {
      for (const item of tier.bonusOutput ?? []) ids.add(item.id);
      for (const item of tier.hourlyOutput ?? []) ids.add(item.id);
      for (const item of tier.hourlyConsumables ?? []) ids.add(item.id);
    }
    if (economics.defaultLaborerSpecialtyId) {
      for (const id of collectLaborerSpecialtyItemIds()) ids.add(id);
      for (const id of T8_HOUSE_BUILD_ITEM_IDS) ids.add(id);
    }
  }

  return [...ids];
}

export function computeLoadoutPricing(
  loadout: EquipmentLoadout,
  prices: PriceMap,
): LoadoutPricing {
  const lines: PricedLine[] = [];

  for (const item of Object.values(loadout.slots)) {
    if (item) {
      const quantity = item.quantity ?? 1;
      const { unitPrice, priceSource } = resolveUnitPrice(item, prices, "sell");
      lines.push({
        id: item.id,
        name: item.name,
        quantity,
        unitPrice,
        lineTotal:
          unitPrice != null ? roundSilver(unitPrice * quantity) : null,
        priceSource,
      });
    }
  }
  for (const item of loadout.inventory ?? []) {
    const quantity = item.quantity ?? 1;
    const { unitPrice, priceSource } = resolveUnitPrice(item, prices, "sell");
    lines.push({
      id: item.id,
      name: item.name,
      quantity,
      unitPrice,
      lineTotal:
        unitPrice != null ? roundSilver(unitPrice * quantity) : null,
      priceSource,
    });
  }

  const gearLines = lines.filter((l) => !CONSUMABLE_IDS.has(l.id));
  const consumableLines = lines.filter((l) => CONSUMABLE_IDS.has(l.id));

  const gearTotal = sumLines(gearLines);
  const consumableTotal = sumLines(consumableLines);
  const total =
    gearTotal != null || consumableTotal != null
      ? (gearTotal ?? 0) + (consumableTotal ?? 0)
      : null;

  return { lines, gearTotal, consumableTotal, total };
}

export { PREMIUM_LISTING_TAX_RATE };

export const ESTIMATED_PRICES_NOTE =
  "Estimated snapshot prices. Set station fee in calculator assumptions. Toggle Premium seller for listing tax rate.";

export function marketCityLocationNote(_city: MarketCityId): string {
  return ESTIMATED_PRICES_NOTE;
}

export function computeHourlyEconomics(
  economics: GuideEconomics,
  prices: PriceMap,
  marketCity: MarketCityId = AVERAGE_MARKET_CITY_ID,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
  mapKind: PriceMapKind = "snapshot",
): HourlyEconomicsResult {
  const output = economics.hourlyOutput.map((item) =>
    priceLine(item, item.quantity, prices, item.side ?? "sell", mapKind),
  );
  const input = (economics.hourlyInputs ?? []).map((item) =>
    priceLine(item, item.quantity, prices, item.side ?? "buy", mapKind),
  );
  const consumables = (economics.hourlyConsumables ?? []).map((item) =>
    priceLine(item, item.quantity, prices, "buy", mapKind),
  );

  const outputTotal = sumLines(output);
  const inputTotal = sumLines(input);
  const consumableTotal = sumLines(consumables);

  const netTotal =
    outputTotal != null || inputTotal != null || consumableTotal != null
      ? roundSilver(
          (outputTotal ?? 0) - (inputTotal ?? 0) - (consumableTotal ?? 0),
        )
      : null;

  const marketTaxTotal =
    outputTotal != null
      ? roundSilver(outputTotal * listingTaxRate)
      : null;
  const netAfterTax =
    netTotal != null && marketTaxTotal != null
      ? roundSilver(netTotal - marketTaxTotal)
      : null;

  const hasEstimatedPrices = [...output, ...input, ...consumables].some(
    (line) => line.priceSource === "estimated",
  );

  return {
    output,
    outputTotal,
    input,
    inputTotal,
    consumables,
    consumableTotal,
    netTotal,
    marketTaxTotal,
    netAfterTax,
    pricedAt: new Date().toISOString(),
    locationNote: marketCityLocationNote(marketCity),
    hasEstimatedPrices,
  };
}

export function buildTierLoadoutBundles(
  slug: string,
  economics: GuideEconomics,
  prices: PriceMap,
): TierLoadoutBundle[] {
  return economics.skillTiers
    .map((tier) => {
      const loadouts = getAllTierLoadouts(slug, [tier.id]);
      const loadout = loadouts[0];
      if (!loadout) return null;

      return {
        tierId: tier.id,
        loadout,
        pricing: computeLoadoutPricing(loadout, prices),
        variant: loadoutVariantForTier(tier.id),
      };
    })
    .filter((bundle): bundle is TierLoadoutBundle => bundle != null);
}

export async function fetchGuidePricing(
  slug: string,
  economics?: GuideEconomics,
) {
  const tierLoadouts = economics
    ? getAllTierLoadouts(
        slug,
        economics.skillTiers.map((t) => t.id),
      )
    : [];

  const itemIds = [
    ...collectGuideItemIds(tierLoadouts, economics),
    ...(slug === "potions-crafting-bulk" ? collectPotionPricingItemIds() : []),
  ];
  const estimatedPriceMaps = buildEstimatedPriceMapsByCity(itemIds);
  let livePriceMaps: PriceMapsByCity = estimatedPriceMaps;
  try {
    livePriceMaps = await fetchAlbionPricesByCity(itemIds);
  } catch {
    // Live API unavailable; fall back to snapshot maps.
  }
  const prices = estimatedPriceMaps[AVERAGE_MARKET_CITY_ID];

  const defaultTier = economics?.skillTiers.find(
    (t) => t.id === economics.defaultSkillTierId,
  );
  const scaledEconomics =
    economics && defaultTier
      ? {
          ...economics,
          ...(economics.defaultLaborerSpecialtyId
            ? buildLaborerHourlyEconomics(
                getLaborerSpecialty(economics.defaultLaborerSpecialtyId),
                defaultTier,
              )
            : scaleGuideEconomics(economics, defaultTier)),
        }
      : economics;

  const tierLoadoutBundles =
    economics != null ? buildTierLoadoutBundles(slug, economics, prices) : [];

  return {
    prices,
    serializedPrices: serializePriceMap(prices),
    serializedPricesByCity: serializePriceMapsByCity(estimatedPriceMaps),
    guidePrices: {
      estimatedByCity: serializePriceMapsByCity(estimatedPriceMaps),
      liveByCity: serializePriceMapsByCity(livePriceMaps),
    },
    tierLoadoutBundles,
    hourlyEconomics: scaledEconomics
      ? computeHourlyEconomics(scaledEconomics, prices)
      : null,
    profitRange:
      economics && slug === "high-tier-group-tracking"
        ? computeTrackingProfitRange(prices)
        : economics && slug === "potions-crafting-bulk"
          ? computePotionProfitRange(prices)
          : economics && slug === "ava-roads-fishing"
            ? computeAvaRoadsProfitRange(prices)
            : economics && slug === "abyssal-depths-farming"
              ? computeAbyssalProfitRange(prices)
              : economics
                ? computeProfitRange(economics, prices)
                : null,
  };
}
