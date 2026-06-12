import type { AlbionItem, LoadoutPricing, PricedLine } from "@/types/guide";
import { getBuyPrice, getSellPrice, type PriceMap } from "@/lib/albion-prices";

/**
 * Materials to build a T8 Elder's House from a T2 Novice's House (cumulative upgrades).
 * Source: https://wiki.albiononline.com/wiki/House
 */
export const T8_HOUSE_BUILD_MATERIALS: AlbionItem[] = [
  { id: "T1_WOOD", name: "Rough Logs", quantity: 1920 },
  { id: "T1_ROCK", name: "Rough Stone", quantity: 192 },
  { id: "T2_STONEBLOCK", name: "Sandstone Block", quantity: 180 },
  { id: "T3_STONEBLOCK", name: "Travertine Block", quantity: 180 },
  { id: "T4_STONEBLOCK", name: "Granite Block", quantity: 180 },
  { id: "T5_STONEBLOCK", name: "Slate Block", quantity: 180 },
  { id: "T6_STONEBLOCK", name: "Basalt Block", quantity: 180 },
  { id: "T7_STONEBLOCK", name: "Marble Block", quantity: 180 },
  { id: "T8_STONEBLOCK", name: "Gneiss Block", quantity: 180 },
];

export const T8_HOUSE_BUILD_ITEM_IDS = T8_HOUSE_BUILD_MATERIALS.map((m) => m.id);

export function computeT8HouseBuildPricing(
  prices: PriceMap,
  houseCount = 1,
): LoadoutPricing {
  const lines: PricedLine[] = T8_HOUSE_BUILD_MATERIALS.map((material) => {
    const quantity = (material.quantity ?? 1) * houseCount;
    const unitPrice =
      getBuyPrice(prices, material.id) ?? getSellPrice(prices, material.id);
    return {
      id: material.id,
      name: material.name,
      quantity,
      unitPrice,
      lineTotal: unitPrice != null ? unitPrice * quantity : null,
    };
  });

  let total = 0;
  let hasPrice = false;
  for (const line of lines) {
    if (line.lineTotal == null) continue;
    total += line.lineTotal;
    hasPrice = true;
  }

  return {
    lines,
    gearTotal: hasPrice ? total : null,
    consumableTotal: null,
    total: hasPrice ? total : null,
  };
}
