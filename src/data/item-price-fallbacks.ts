/**
 * Estimated silver/unit snapshots used by all profit calculators.
 * Regenerate from a market sample: npm run refresh-price-fallbacks
 */

export interface FallbackPrices {
  sell?: number;
  buy?: number;
}

/** Explicit overrides, thin markets, journals, rare drops, crafting mats. */
export const ITEM_PRICE_FALLBACKS: Record<string, FallbackPrices> = {
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
  if (
    itemId.endsWith("_ORE") ||
    itemId.endsWith("_WOOD") ||
    itemId.endsWith("_FIBER") ||
    itemId.endsWith("_HIDE") ||
    itemId.endsWith("_ROCK") ||
    itemId.endsWith("_CLOTH") ||
    itemId.endsWith("_PLANKS") ||
    itemId.endsWith("_METALBAR") ||
    itemId.endsWith("_LEATHER")
  ) {
    return Math.round(scale(900, tier, 4, 2.05) * sellBias);
  }
  if (itemId.includes("_JOURNAL_") && itemId.endsWith("_EMPTY")) {
    return Math.round(scale(3200, tier, 4, 2.15) * sellBias);
  }
  if (itemId.includes("_JOURNAL_") && itemId.endsWith("_FULL")) {
    return Math.round(scale(7800, tier, 4, 2.15) * sellBias);
  }
  if (itemId.includes("_FURNITUREITEM_TROPHY_")) {
    return Math.round(scale(9200, tier, 4, 2.12) * sellBias);
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

  const enchantMatch = itemId.match(/^(.+)@(\d+)$/);
  if (enchantMatch) {
    const baseId = enchantMatch[1]!;
    const level = Number.parseInt(enchantMatch[2]!, 10);
    const basePrice = getItemPriceFallback(baseId, side);
    if (basePrice != null && level >= 1) {
      const multipliers: Record<number, { buy: number; sell: number }> = {
        1: { buy: 2.6, sell: 2.6 },
        2: { buy: 6.5, sell: 6.5 },
        3: { buy: 16, sell: 16 },
      };
      const mult = multipliers[level] ?? { buy: 1, sell: 1 };
      const multiplier = side === "buy" ? mult.buy : mult.sell;
      return Math.round(basePrice * multiplier);
    }
  }

  return inferFallbackPrice(itemId, side);
}
