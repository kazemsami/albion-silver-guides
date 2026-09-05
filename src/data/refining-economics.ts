/** Resource refining model for resource-refining-focus. */

import type { MarketCityId } from "@/lib/market-cities";

export type RefiningResourceId = "ore" | "wood" | "fiber" | "hide";
export type RefiningTier = 4 | 5 | 6 | 7 | 8;
/** 0 = flat (.0), 1 = uncommon, 2 = rare, 3 = exceptional, 4 = pristine. */
export type RefiningEnchant = 0 | 1 | 2 | 3 | 4;
export type RefiningFocusEfficiencyId = "low" | "mid" | "high" | "max";

export const REFINING_TIERS: RefiningTier[] = [4, 5, 6, 7, 8];

export const REFINING_ENCHANTS: RefiningEnchant[] = [0, 1, 2, 3, 4];

export const REFINING_ENCHANT_META: Record<
  RefiningEnchant,
  { label: string; shortLabel: string; namePrefix: string }
> = {
  0: { label: "Normal (.0)", shortLabel: ".0", namePrefix: "" },
  1: { label: "Uncommon (.1)", shortLabel: ".1", namePrefix: "Uncommon " },
  2: { label: "Rare (.2)", shortLabel: ".2", namePrefix: "Rare " },
  3: {
    label: "Exceptional (.3)",
    shortLabel: ".3",
    namePrefix: "Exceptional ",
  },
  4: { label: "Pristine (.4)", shortLabel: ".4", namePrefix: "Pristine " },
};

export const DEFAULT_REFINING_ENCHANT: RefiningEnchant = 0;

/** Raw resources needed per craft (plus 1× lower-tier refined above T2). */
export const REFINING_RAW_PER_CRAFT: Record<RefiningTier, number> = {
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 5,
};

/**
 * Base focus cost at 0 Destiny Board efficiency (wiki Crafting Focus table).
 * Rows are enchant level; columns are resource tier.
 */
export const REFINING_BASE_FOCUS_COST: Record<
  RefiningEnchant,
  Record<RefiningTier, number>
> = {
  0: { 4: 54, 5: 94, 6: 164, 7: 287, 8: 503 },
  1: { 4: 94, 5: 164, 6: 287, 7: 503, 8: 880 },
  2: { 4: 164, 5: 287, 6: 503, 7: 880, 8: 1539 },
  3: { 4: 287, 5: 503, 6: 880, 7: 1539, 8: 2694 },
  4: { 4: 503, 5: 880, 6: 1539, 7: 2694, 8: 4714 },
};

/**
 * Focus cost efficiency presets (wiki: cost halves every 10,000 efficiency).
 * Mid ≈ one full mastery path; high ≈ strong specialization; max ≈ T4–T8 fully maxed.
 */
export const REFINING_FOCUS_EFFICIENCY: Record<
  RefiningFocusEfficiencyId,
  { label: string; note: string; efficiency: number }
> = {
  low: {
    label: "Low spec",
    note: "Little refining mastery. Focus costs stay near base.",
    efficiency: 0,
  },
  mid: {
    label: "Mid spec",
    note: "~10,000 focus-cost efficiency. Focus costs about half of base.",
    efficiency: 10_000,
  },
  high: {
    label: "High spec",
    note: "~20,000 efficiency. Focus costs about a quarter of base.",
    efficiency: 20_000,
  },
  max: {
    label: "Max board",
    note: "~40,000 efficiency (full T4–T8 refining). Focus at 6.25% of base.",
    efficiency: 40_000,
  },
};

export const DEFAULT_REFINING_FOCUS_EFFICIENCY: RefiningFocusEfficiencyId =
  "mid";

/** Typical royal-city resource return rates (wiki / community tables). */
export const REFINING_RETURN_RATES = {
  bonusCityWithFocus: 0.539,
  bonusCityNoFocus: 0.367,
  otherCityWithFocus: 0.435,
  otherCityNoFocus: 0.152,
} as const;

export interface RefiningEconomicsDefaults {
  /** Fraction of materials returned (0–1). */
  materialReturnRate: number;
  /** Player-station usage fee as % of refined sell value (0 on your island). */
  stationFeePercent: number;
}

export const DEFAULT_REFINING_DEFAULTS: RefiningEconomicsDefaults = {
  materialReturnRate: REFINING_RETURN_RATES.bonusCityWithFocus,
  stationFeePercent: 0,
};

export interface RefiningResourceLine {
  id: string;
  name: string;
}

export interface RefiningResourceFamily {
  id: RefiningResourceId;
  label: string;
  station: string;
  /** City with the local production bonus for this resource. */
  bonusCity: MarketCityId;
  rawByTier: Record<RefiningTier | 3, RefiningResourceLine>;
  refinedByTier: Record<RefiningTier | 3, RefiningResourceLine>;
}

export const REFINING_RESOURCES: RefiningResourceFamily[] = [
  {
    id: "ore",
    label: "Metal bars",
    station: "Smelter",
    bonusCity: "Thetford",
    rawByTier: {
      3: { id: "T3_ORE", name: "Tin Ore" },
      4: { id: "T4_ORE", name: "Iron Ore" },
      5: { id: "T5_ORE", name: "Titanium Ore" },
      6: { id: "T6_ORE", name: "Runite Ore" },
      7: { id: "T7_ORE", name: "Meteorite Ore" },
      8: { id: "T8_ORE", name: "Adamantium Ore" },
    },
    refinedByTier: {
      3: { id: "T3_METALBAR", name: "Tin Bar" },
      4: { id: "T4_METALBAR", name: "Steel Bar" },
      5: { id: "T5_METALBAR", name: "Titanium Steel Bar" },
      6: { id: "T6_METALBAR", name: "Runite Steel Bar" },
      7: { id: "T7_METALBAR", name: "Meteorite Steel Bar" },
      8: { id: "T8_METALBAR", name: "Adamantium Steel Bar" },
    },
  },
  {
    id: "wood",
    label: "Planks",
    station: "Lumbermill",
    bonusCity: "Fort Sterling",
    rawByTier: {
      3: { id: "T3_WOOD", name: "Chestnut Logs" },
      4: { id: "T4_WOOD", name: "Pine Logs" },
      5: { id: "T5_WOOD", name: "Cedar Logs" },
      6: { id: "T6_WOOD", name: "Bloodoak Logs" },
      7: { id: "T7_WOOD", name: "Ashenbark Logs" },
      8: { id: "T8_WOOD", name: "Whitewood Logs" },
    },
    refinedByTier: {
      3: { id: "T3_PLANKS", name: "Chestnut Planks" },
      4: { id: "T4_PLANKS", name: "Pine Planks" },
      5: { id: "T5_PLANKS", name: "Cedar Planks" },
      6: { id: "T6_PLANKS", name: "Bloodoak Planks" },
      7: { id: "T7_PLANKS", name: "Ashenbark Planks" },
      8: { id: "T8_PLANKS", name: "Whitewood Planks" },
    },
  },
  {
    id: "fiber",
    label: "Cloth",
    station: "Weaver",
    bonusCity: "Lymhurst",
    rawByTier: {
      3: { id: "T3_FIBER", name: "Flax" },
      4: { id: "T4_FIBER", name: "Hemp" },
      5: { id: "T5_FIBER", name: "Skyflower" },
      6: { id: "T6_FIBER", name: "Amberleaf Cotton" },
      7: { id: "T7_FIBER", name: "Sunflax" },
      8: { id: "T8_FIBER", name: "Ghost Hemp" },
    },
    refinedByTier: {
      3: { id: "T3_CLOTH", name: "Neat Cloth" },
      4: { id: "T4_CLOTH", name: "Fine Cloth" },
      5: { id: "T5_CLOTH", name: "Ornate Cloth" },
      6: { id: "T6_CLOTH", name: "Lavish Cloth" },
      7: { id: "T7_CLOTH", name: "Opulent Cloth" },
      8: { id: "T8_CLOTH", name: "Baroque Cloth" },
    },
  },
  {
    id: "hide",
    label: "Leather",
    station: "Tanner",
    bonusCity: "Martlock",
    rawByTier: {
      3: { id: "T3_HIDE", name: "Thin Hide" },
      4: { id: "T4_HIDE", name: "Medium Hide" },
      5: { id: "T5_HIDE", name: "Heavy Hide" },
      6: { id: "T6_HIDE", name: "Robust Hide" },
      7: { id: "T7_HIDE", name: "Thick Hide" },
      8: { id: "T8_HIDE", name: "Resilient Hide" },
    },
    refinedByTier: {
      3: { id: "T3_LEATHER", name: "Thick Leather" },
      4: { id: "T4_LEATHER", name: "Worked Leather" },
      5: { id: "T5_LEATHER", name: "Cured Leather" },
      6: { id: "T6_LEATHER", name: "Hardened Leather" },
      7: { id: "T7_LEATHER", name: "Reinforced Leather" },
      8: { id: "T8_LEATHER", name: "Fortified Leather" },
    },
  },
];

export const DEFAULT_REFINING_RESOURCE_ID: RefiningResourceId = "ore";
export const DEFAULT_REFINING_TIER: RefiningTier = 6;

export const REFINING_FOCUS_COST_NOTE =
  "Focus per craft depends on refining mastery and specialization. Calculator presets map to focus-cost efficiency: cost halves every 10,000 efficiency (wiki).";

export function getRefiningResource(
  id: RefiningResourceId,
): RefiningResourceFamily {
  return (
    REFINING_RESOURCES.find((r) => r.id === id) ?? REFINING_RESOURCES[0]!
  );
}

export const REFINING_ENCHANT_MIN_TIER = 4;

/** Raw and refined enchant variants exist from T4 up (T3 refined is flat only). */
export function refiningTierSupportsEnchant(tier: number): boolean {
  return tier >= REFINING_ENCHANT_MIN_TIER;
}

/** Albion item id for a flat or enchanted resource (`T6_ORE_LEVEL2@2`). */
export function refiningItemId(baseId: string, enchant: RefiningEnchant): string {
  if (enchant === 0) return baseId;
  return `${baseId}_LEVEL${enchant}@${enchant}`;
}

export function refiningItemName(
  baseName: string,
  enchant: RefiningEnchant,
): string {
  if (enchant === 0) return baseName;
  return `${REFINING_ENCHANT_META[enchant].namePrefix}${baseName}`;
}

export function resolveRefiningItem(
  line: RefiningResourceLine,
  enchant: RefiningEnchant,
  tier: number,
): RefiningResourceLine {
  if (enchant === 0 || !refiningTierSupportsEnchant(tier)) {
    return { id: line.id, name: line.name };
  }
  return {
    id: refiningItemId(line.id, enchant),
    name: refiningItemName(line.name, enchant),
  };
}

export function refiningFocusCost(
  tier: RefiningTier,
  efficiencyId: RefiningFocusEfficiencyId,
  enchant: RefiningEnchant = 0,
): number {
  const base = REFINING_BASE_FOCUS_COST[enchant][tier];
  const { efficiency } = REFINING_FOCUS_EFFICIENCY[efficiencyId];
  return Math.max(1, Math.round(base * Math.pow(0.5, efficiency / 10_000)));
}

export function defaultReturnRateForFocus(
  withFocus: boolean,
  inBonusCity: boolean,
): number {
  if (withFocus) {
    return inBonusCity
      ? REFINING_RETURN_RATES.bonusCityWithFocus
      : REFINING_RETURN_RATES.otherCityWithFocus;
  }
  return inBonusCity
    ? REFINING_RETURN_RATES.bonusCityNoFocus
    : REFINING_RETURN_RATES.otherCityNoFocus;
}

export function collectRefiningPricingItemIds(): string[] {
  const ids = new Set<string>();
  for (const family of REFINING_RESOURCES) {
    for (const tier of [3, 4, 5, 6, 7, 8] as const) {
      const enchants = refiningTierSupportsEnchant(tier)
        ? REFINING_ENCHANTS
        : ([0] as RefiningEnchant[]);
      for (const enchant of enchants) {
        ids.add(refiningItemId(family.rawByTier[tier].id, enchant));
        ids.add(refiningItemId(family.refinedByTier[tier].id, enchant));
      }
    }
  }
  return [...ids];
}

/** Flat (.0) ids only. Live enchanted quotes are sparse; scale from flat live prices. */
export function collectRefiningLivePricingItemIds(): string[] {
  const ids = new Set<string>();
  for (const family of REFINING_RESOURCES) {
    for (const tier of [3, 4, 5, 6, 7, 8] as const) {
      ids.add(family.rawByTier[tier].id);
      ids.add(family.refinedByTier[tier].id);
    }
  }
  return [...ids];
}

/** Typical sell-order multiples vs flat when enchanted live quotes are missing. */
export const REFINING_ENCHANT_PRICE_MULT: Record<RefiningEnchant, number> = {
  0: 1,
  1: 2.6,
  2: 6.5,
  3: 16,
  4: 40,
};
