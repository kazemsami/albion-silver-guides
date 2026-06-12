/**
 * Fallback silver/unit when Albion Data Project has no royal-city listings.
 * Live market prices always win; these are used only as a last resort.
 *
 * Regenerate snapshots when not rate-limited: npm run refresh-price-fallbacks
 */

export interface FallbackPrices {
  sell?: number;
  buy?: number;
}

/** Explicit overrides, thin markets, journals, rare drops, crafting mats. */
export const ITEM_PRICE_FALLBACKS: Record<string, FallbackPrices> = {
  // T1 products
  T1_FISHCHOPS: { sell: 52, buy: 48 },
  T1_SEAWEED: { sell: 38, buy: 32 },
  T1_ALCHEMY_COMMON: { sell: 4300, buy: 1300 },
  T1_ROCK: { sell: 12, buy: 10 },
  T1_WOOD: { sell: 12, buy: 10 },
  T1_MEAL_SEAWEEDSALAD: { sell: 280, buy: 220 },

  // Gathering
  T4_ORE: { sell: 111, buy: 121 },
  T4_FIBER: { sell: 95, buy: 88 },
  T5_FIBER: { sell: 380, buy: 340 },
  T6_LEATHER: { sell: 2400, buy: 2100 },

  // Journals (empty = buy cost, full = sell value)
  T4_JOURNAL_ORE_EMPTY: { buy: 3200, sell: 2800 },
  T4_JOURNAL_ORE_FULL: { sell: 9200, buy: 7800 },
  T4_JOURNAL_FIBER_EMPTY: { buy: 3200, sell: 2800 },
  T4_JOURNAL_FIBER_FULL: { sell: 9200, buy: 7800 },
  T4_JOURNAL_FISHING_EMPTY: { buy: 2800, sell: 2400 },
  T4_JOURNAL_MERCENARY_EMPTY: { buy: 3500, sell: 3000 },
  T5_JOURNAL_FIBER_EMPTY: { buy: 6500, sell: 5500 },
  T5_JOURNAL_MERCENARY_EMPTY: { buy: 7000, sell: 6000 },
  T5_JOURNAL_ORE_EMPTY: { buy: 6500, sell: 5500 },
  T7_JOURNAL_FISHING_EMPTY: { buy: 42000, sell: 36000 },
  T7_JOURNAL_FISHING_FULL: { sell: 98000, buy: 82000 },
  T7_JOURNAL_FIBER_EMPTY: { buy: 42000, sell: 36000 },
  T7_JOURNAL_ORE_EMPTY: { buy: 42000, sell: 36000 },
  T7_JOURNAL_WOOD_EMPTY: { buy: 42000, sell: 36000 },
  T7_JOURNAL_TROPHY_GENERAL_EMPTY: { buy: 45000, sell: 38000 },
  T3_JOURNAL_MERCENARY_FULL: { sell: 6200, buy: 5200 },
  T4_JOURNAL_MERCENARY_FULL: { sell: 9200, buy: 7800 },
  T5_JOURNAL_MERCENARY_FULL: { sell: 18_000, buy: 15_000 },
  T6_JOURNAL_MERCENARY_FULL: { sell: 36_000, buy: 30_000 },
  T7_JOURNAL_MERCENARY_FULL: { sell: 72_000, buy: 60_000 },
  T8_JOURNAL_MERCENARY_FULL: { sell: 145_000, buy: 120_000 },
  T2_JOURNAL_TROPHY_GENERAL_FULL: { sell: 2800, buy: 2200 },

  // T2 black-zone roam kit (approximate buy prices for death-cost modeling)
  T2_HEAD_PLATE_SET1: { sell: 2200, buy: 1900 },
  T2_ARMOR_PLATE_SET1: { sell: 3200, buy: 2800 },
  T2_SHOES_PLATE_SET1: { sell: 1800, buy: 1600 },
  T2_MAIN_FIRESTAFF: { sell: 1500, buy: 1300 },
  T2_OFF_SHIELD: { sell: 900, buy: 800 },
  T2_CAPE: { sell: 700, buy: 600 },
  T2_BAG: { sell: 3200, buy: 2800 },
  T2_MOUNT_MULE: { sell: 5200, buy: 4500 },
  T3_JOURNAL_TROPHY_GENERAL_FULL: { sell: 6200, buy: 5200 },
  T4_JOURNAL_TROPHY_GENERAL_FULL: { sell: 9200, buy: 7800 },
  T5_JOURNAL_TROPHY_GENERAL_FULL: { sell: 18_000, buy: 15_000 },
  T6_JOURNAL_TROPHY_GENERAL_FULL: { sell: 36_000, buy: 30_000 },
  T4_JOURNAL_FISHING_FULL: { sell: 9200, buy: 7800 },
  T5_JOURNAL_FISHING_FULL: { sell: 18_000, buy: 15_000 },
  T4_RELIC: { sell: 420, buy: 350 },
  T5_RELIC: { sell: 980, buy: 820 },
  T5_RUNE: { sell: 95, buy: 80 },
  T4_RUNE: { sell: 42, buy: 35 },
  T5_SOUL: { sell: 420, buy: 350 },
  QUESTITEM_TOKEN_ROYAL_T4: { sell: 3200, buy: 2600 },
  QUESTITEM_TOKEN_ROYAL_T5: { sell: 6500, buy: 5200 },
  QUESTITEM_TOKEN_ROYAL_T6: { sell: 13_000, buy: 10_500 },
  TREASURE_CEREMONIAL_RARITY2: { sell: 12_000, buy: 10_000 },
  TREASURE_CEREMONIAL_RARITY3: { sell: 24_000, buy: 20_000 },
  TREASURE_SILVERWARE_RARITY2: { sell: 12_000, buy: 10_000 },
  TREASURE_SILVERWARE_RARITY3: { sell: 24_000, buy: 20_000 },
  TREASURE_DECORATIVE_RARITY2: { sell: 12_000, buy: 10_000 },
  TREASURE_DECORATIVE_RARITY3: { sell: 24_000, buy: 20_000 },
  TREASURE_KNOWLEDGE_RARITY2: { sell: 95_000, buy: 80_000 },
  T5_FISH_FRESHWATER_ALL_COMMON: { sell: 2800, buy: 2200 },

  // Dungeon / Depths / Corrupted loot
  T6_RUNE: { sell: 165, buy: 140 },
  T7_RUNE: { sell: 420, buy: 350 },
  T8_RUNE: { sell: 950, buy: 780 },
  T6_SOUL: { sell: 850, buy: 720 },
  T7_SOUL: { sell: 5200, buy: 4400 },
  T8_SOUL: { sell: 12500, buy: 10500 },

  // Tracking (trade-chat estimates, rarely on royal markets)
  T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER: { sell: 950_000 },
  T8_ARTEFACT_2H_SHAPESHIFTER_AVALON: { sell: 2_100_000 },
  T7_ESSENCE_POTION: { sell: 110_000, buy: 85_000 },
  T8_ESSENCE_POTION: { sell: 230_000, buy: 175_000 },
  T7_2H_TOOL_TRACKING: { sell: 106_000, buy: 36_000 },

  // Fishing
  T3_FISHINGBAIT: { sell: 210, buy: 180 },
  T7_FISH_FRESHWATER_AVALON_RARE: { sell: 450_000, buy: 380_000 },
  T8_FISH_FRESHWATER_ALL_COMMON: { sell: 12_000, buy: 9500 },

  // Food & potions
  T4_MEAL_STEW: { sell: 480, buy: 420 },
  T6_MEAL_STEW: { sell: 1280, buy: 980 },
  T6_MEAL_SANDWICH: { sell: 2025, buy: 1650 },
  T7_MEAL_PIE: { sell: 18_500, buy: 15_200 },
  T7_MEAL_OMELETTE: { sell: 22_000, buy: 18_000 },
  T8_MEAL_SANDWICH: { sell: 4200, buy: 3400 },
  T4_POTION_HEAL: { sell: 420, buy: 320 },
  T4_POTION_ENERGY: { sell: 380, buy: 290 },
  T6_POTION_HEAL: { sell: 8080, buy: 3620 },
  T6_POTION_ENERGY: { sell: 6200, buy: 2800 },
  T7_POTION_REVIVE: { sell: 11_000, buy: 4360 },
  T8_POTION_CLEANSE: { sell: 15_150, buy: 6850 },

  // Stalker corrupted kit (approximate Caerleon buy prices for death-cost modeling)
  T6_HEAD_PLATE_SET1: { sell: 52_000, buy: 45_000 },
  T6_ARMOR_LEATHER_SET1: { sell: 82_000, buy: 72_000 },
  T6_SHOES_PLATE_SET1: { sell: 48_000, buy: 42_000 },
  T6_2H_CLAYMORE: { sell: 108_000, buy: 95_000 },
  T4_CAPEITEM_FW_THETFORD: { sell: 42_000, buy: 37_600 },

  // Crafting inputs (potions guide)
  T3_EGG: { sell: 45, buy: 38 },
  T4_MILK: { sell: 120, buy: 95 },
  T4_BURDOCK: { sell: 280, buy: 240 },
  T5_EGG: { sell: 95, buy: 78 },
  T6_FOXGLOVE: { sell: 420, buy: 360 },
  T6_ALCOHOL: { sell: 380, buy: 320 },
  T6_MILK: { sell: 320, buy: 270 },
  T7_MULLEIN: { sell: 2400, buy: 2000 },
  T7_ALCOHOL: { sell: 1800, buy: 1500 },

  // T8 laborer house materials
  T2_STONEBLOCK: { sell: 18, buy: 15 },
  T3_STONEBLOCK: { sell: 45, buy: 38 },
  T4_STONEBLOCK: { sell: 110, buy: 95 },
  T5_STONEBLOCK: { sell: 280, buy: 240 },
  T6_STONEBLOCK: { sell: 720, buy: 620 },
  T7_STONEBLOCK: { sell: 1850, buy: 1600 },
  T8_STONEBLOCK: { sell: 4800, buy: 4100 },
  T8_FURNITUREITEM_BED: { sell: 28_000, buy: 24_000 },
  T8_FURNITUREITEM_TABLE: { sell: 32_000, buy: 27_000 },
  T8_FURNITUREITEM_TROPHY_GENERAL: { sell: 45_000, buy: 38_000 },
  T8_FURNITUREITEM_TROPHY_ORE: { sell: 48_000, buy: 40_000 },
};

function parseTier(itemId: string): number {
  const match = itemId.match(/^T(\d+)/);
  return match ? Number.parseInt(match[1]!, 10) : 4;
}

function scale(base: number, tier: number, referenceTier = 4, ratio = 1.9): number {
  return Math.round(base * ratio ** (tier - referenceTier));
}

/** Pattern-based estimates for loadout gear and items not in the map above. */
function inferFallbackPrice(
  itemId: string,
  side: "buy" | "sell",
): number | null {
  const tier = parseTier(itemId);
  const sellBias = side === "sell" ? 1 : 0.82;

  if (itemId.includes("_TOOL_TRACKING")) {
    return Math.round(scale(28_000, tier, 6, 2.1) * sellBias);
  }
  if (itemId.includes("_TOOL_FISHINGROD")) {
    return Math.round(scale(1200, tier, 3, 2.05) * sellBias);
  }
  if (itemId.includes("_TOOL_PICK") || itemId.includes("_TOOL_SICKLE")) {
    return Math.round(scale(800, tier, 4, 2.0) * sellBias);
  }
  if (itemId.includes("_MOUNT_HORSE")) {
    return Math.round(scale(2500, tier, 3, 2.2) * sellBias);
  }
  if (itemId.includes("_MOUNT_GIANTSTAG")) {
    return Math.round(45_000 * sellBias);
  }
  if (itemId.includes("_BAG")) {
    return Math.round(scale(2000, tier, 4, 2.15) * sellBias);
  }
  if (itemId.includes("_CAPEITEM")) {
    return Math.round(scale(3500, tier, 4, 1.85) * sellBias);
  }
  if (
    itemId.includes("_HEAD_GATHERER") ||
    itemId.includes("_ARMOR_GATHERER") ||
    itemId.includes("_SHOES_GATHERER")
  ) {
    return Math.round(scale(1200, tier, 4, 2.05) * sellBias);
  }
  if (
    itemId.includes("_HEAD_") ||
    itemId.includes("_ARMOR_") ||
    itemId.includes("_SHOES_")
  ) {
    const enchant = itemId.includes("@") ? 1.35 : 1;
    return Math.round(scale(4500, tier, 4, 2.08) * enchant * sellBias);
  }
  if (
    itemId.includes("_2H_") ||
    itemId.includes("_MAIN_") ||
    itemId.includes("_OFF_")
  ) {
    const enchant = itemId.includes("@") ? 1.4 : 1;
    return Math.round(scale(6000, tier, 4, 2.1) * enchant * sellBias);
  }

  return null;
}

export function getItemPriceFallback(
  itemId: string,
  side: "buy" | "sell" = "sell",
): number | null {
  const entry = ITEM_PRICE_FALLBACKS[itemId];
  if (entry) {
    if (side === "buy") {
      return entry.buy ?? entry.sell ?? null;
    }
    return entry.sell ?? entry.buy ?? null;
  }
  return inferFallbackPrice(itemId, side);
}
