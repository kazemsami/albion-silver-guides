import {
  DEFAULT_DAILY_FOCUS_BUDGET,
  DEFAULT_FOCUS_SESSION_HOURS,
  DEFAULT_POTION_DEFAULTS,
  getPotionTierMultiplier,
  POTION_RECIPES,
  POTION_SELL_THROUGH_META,
  T6_POTION_SESSION,
  type PotionEconomicsDefaults,
  type PotionRecipe,
  type PotionSellThroughId,
} from "@/data/potion-economics";
import { getItemPriceFallback } from "@/data/item-price-fallbacks";
import { PREMIUM_LISTING_TAX_RATE } from "@/lib/guide-economics";
import type { PriceMap } from "@/lib/albion-prices";
import { getBuyPrice, getSellPrice } from "@/lib/albion-prices";
import type { PricedLine } from "@/types/guide";
import { roundSilver } from "@/lib/format";

export interface PotionComputeInputs {
  tierId: string;
  sellThroughId: PotionSellThroughId;
  valueFocus: boolean;
  defaults: PotionEconomicsDefaults;
}

export interface PotionBatchResult {
  recipe: PotionRecipe;
  outputLine: PricedLine;
  materialLines: PricedLine[];
  materialCost: number | null;
  stationFee: number | null;
  listingTax: number | null;
  grossOutput: number | null;
  netBeforeFocus: number | null;
  focusCost: number;
  netAfterFocus: number | null;
  profitPerTenThousandFocus: number | null;
}

export interface PotionEconomicsResult {
  tierId: string;
  sellThroughId: PotionSellThroughId;
  sellThroughLabel: string;
  sellThroughNote: string;
  valueFocus: boolean;
  healBatchesPerHour: number;
  energyBatchesPerHour: number;
  totalPotsPerHour: number;
  healBatch: PotionBatchResult;
  energyBatch: PotionBatchResult;
  hourlyGrossOutput: number | null;
  hourlyMaterialCost: number | null;
  hourlyStationFees: number | null;
  hourlyListingTax: number | null;
  hourlySellThroughHaircut: number | null;
  hourlyNetBeforeFocus: number | null;
  hourlyFocusOpportunityCost: number | null;
  hourlyFocusPointsBilled: number;
  hourlyNetAfterFocus: number | null;
  profitPerCraftingMinute: number | null;
  profitPerTenThousandFocus: number | null;
  estimatedSellThroughHours: number | null;
  hasEstimatedPrices: boolean;
}

function resolveSellPrice(
  prices: PriceMap,
  itemId: string,
): { unitPrice: number | null; priceSource: PricedLine["priceSource"] } {
  const market = getSellPrice(prices, itemId) ?? getBuyPrice(prices, itemId);
  if (market != null) return { unitPrice: market, priceSource: "market" };
  const fallback = getItemPriceFallback(itemId, "sell");
  if (fallback != null) return { unitPrice: fallback, priceSource: "estimated" };
  return { unitPrice: null, priceSource: "estimated" };
}

function resolveBuyPrice(
  prices: PriceMap,
  itemId: string,
): { unitPrice: number | null; priceSource: PricedLine["priceSource"] } {
  const market = getBuyPrice(prices, itemId) ?? getSellPrice(prices, itemId);
  if (market != null) return { unitPrice: market, priceSource: "market" };
  const fallback =
    getItemPriceFallback(itemId, "buy") ?? getItemPriceFallback(itemId, "sell");
  if (fallback != null) return { unitPrice: fallback, priceSource: "estimated" };
  return { unitPrice: null, priceSource: "estimated" };
}

function priceLine(
  prices: PriceMap,
  id: string,
  name: string,
  quantity: number,
  side: "buy" | "sell",
): PricedLine {
  const { unitPrice, priceSource } =
    side === "buy" ? resolveBuyPrice(prices, id) : resolveSellPrice(prices, id);
  return {
    id,
    name,
    quantity,
    unitPrice,
    lineTotal: unitPrice != null ? roundSilver(unitPrice * quantity) : null,
    priceSource,
  };
}

function sumLines(lines: PricedLine[]): number | null {
  let total = 0;
  let hasPrice = false;
  for (const line of lines) {
    if (line.lineTotal == null) continue;
    total += line.lineTotal;
    hasPrice = true;
  }
  return hasPrice ? roundSilver(total) : null;
}

function computeBatch(
  prices: PriceMap,
  recipe: PotionRecipe,
  defaults: PotionEconomicsDefaults,
  valueFocus: boolean,
): PotionBatchResult {
  const materialLines = recipe.materials.map((m) =>
    priceLine(prices, m.id, m.name, m.quantity, "buy"),
  );
  const materialCost = sumLines(materialLines);

  const outputLine = priceLine(
    prices,
    recipe.outputId,
    recipe.outputName,
    recipe.outputQuantity,
    "sell",
  );
  const grossOutput = outputLine.lineTotal;

  const stationFee =
    grossOutput != null
      ? roundSilver(grossOutput * defaults.stationFeeRate)
      : null;

  const listingTax =
    grossOutput != null
      ? roundSilver(grossOutput * PREMIUM_LISTING_TAX_RATE)
      : null;

  const netBeforeFocus =
    grossOutput != null
      ? roundSilver(
          grossOutput - (materialCost ?? 0) - (stationFee ?? 0) - (listingTax ?? 0),
        )
      : null;

  const focusCost = valueFocus
    ? roundSilver(recipe.focusCost * defaults.focusSilverPerPoint)
    : 0;

  const netAfterFocus =
    netBeforeFocus != null ? roundSilver(netBeforeFocus - focusCost) : null;

  const profitPerTenThousandFocus =
    recipe.focusCost > 0 && netBeforeFocus != null
      ? roundSilver((netBeforeFocus / recipe.focusCost) * 10_000)
      : null;

  return {
    recipe,
    outputLine,
    materialLines,
    materialCost,
    stationFee,
    listingTax,
    grossOutput,
    netBeforeFocus,
    focusCost,
    netAfterFocus,
    profitPerTenThousandFocus,
  };
}

export function computePotionEconomics(
  prices: PriceMap,
  inputs: PotionComputeInputs,
): PotionEconomicsResult {
  const tierMultiplier = getPotionTierMultiplier(inputs.tierId);
  const sellThrough = POTION_SELL_THROUGH_META[inputs.sellThroughId];

  const healBatchesPerHour = roundSilver(
    T6_POTION_SESSION.healBatchesPerHour * tierMultiplier,
  );
  const energyBatchesPerHour = roundSilver(
    T6_POTION_SESSION.energyBatchesPerHour * tierMultiplier,
  );

  const healRecipe = POTION_RECIPES[0];
  const energyRecipe = POTION_RECIPES[1];

  const healBatch = computeBatch(
    prices,
    healRecipe,
    inputs.defaults,
    inputs.valueFocus,
  );
  const energyBatch = computeBatch(
    prices,
    energyRecipe,
    inputs.defaults,
    inputs.valueFocus,
  );

  const scale = (batchValue: number | null, batches: number) =>
    batchValue != null ? roundSilver(batchValue * batches) : null;

  const hourlyGrossOutput =
    scale(healBatch.grossOutput, healBatchesPerHour) != null ||
    scale(energyBatch.grossOutput, energyBatchesPerHour) != null
      ? roundSilver(
          (scale(healBatch.grossOutput, healBatchesPerHour) ?? 0) +
            (scale(energyBatch.grossOutput, energyBatchesPerHour) ?? 0),
        )
      : null;

  const hourlyMaterialCost = roundSilver(
    (scale(healBatch.materialCost, healBatchesPerHour) ?? 0) +
      (scale(energyBatch.materialCost, energyBatchesPerHour) ?? 0),
  );

  const hourlyStationFees = roundSilver(
    (scale(healBatch.stationFee, healBatchesPerHour) ?? 0) +
      (scale(energyBatch.stationFee, energyBatchesPerHour) ?? 0),
  );

  const hourlyListingTax = roundSilver(
    (scale(healBatch.listingTax, healBatchesPerHour) ?? 0) +
      (scale(energyBatch.listingTax, energyBatchesPerHour) ?? 0),
  );

  const hourlySellThroughHaircut =
    hourlyGrossOutput != null
      ? roundSilver(hourlyGrossOutput * sellThrough.outputDiscount)
      : null;

  const hourlyNetBeforeFocus =
    hourlyGrossOutput != null
      ? roundSilver(
          hourlyGrossOutput -
            hourlyMaterialCost -
            hourlyStationFees -
            hourlyListingTax -
            (hourlySellThroughHaircut ?? 0),
        )
      : null;

  const hourlyFocusPointsBilled = inputs.valueFocus
    ? Math.min(
        healRecipe.focusCost * healBatchesPerHour,
        DEFAULT_DAILY_FOCUS_BUDGET / DEFAULT_FOCUS_SESSION_HOURS,
      )
    : 0;

  const hourlyFocusOpportunityCost = inputs.valueFocus
    ? roundSilver(
        hourlyFocusPointsBilled * inputs.defaults.focusSilverPerPoint,
      )
    : 0;

  const hourlyNetAfterFocus =
    hourlyNetBeforeFocus != null
      ? roundSilver(hourlyNetBeforeFocus - hourlyFocusOpportunityCost)
      : null;

  const totalBatchesPerHour = healBatchesPerHour + energyBatchesPerHour;
  const minutesPerHour = totalBatchesPerHour * inputs.defaults.minutesPerBatch;
  const profitPerCraftingMinute =
    hourlyNetAfterFocus != null && minutesPerHour > 0
      ? roundSilver(hourlyNetAfterFocus / minutesPerHour)
      : null;

  const totalPotsPerHour = roundSilver(
    healBatchesPerHour * healRecipe.outputQuantity +
      energyBatchesPerHour * energyRecipe.outputQuantity,
  );

  const estimatedSellThroughHours =
    inputs.defaults.sellThroughPotsPerHour > 0
      ? Math.round((totalPotsPerHour / inputs.defaults.sellThroughPotsPerHour) * 10) /
        10
      : null;

  const hasEstimatedPrices = [
    ...healBatch.materialLines,
    ...energyBatch.materialLines,
    healBatch.outputLine,
    energyBatch.outputLine,
  ].some((line) => line.priceSource === "estimated");

  return {
    tierId: inputs.tierId,
    sellThroughId: inputs.sellThroughId,
    sellThroughLabel: sellThrough.label,
    sellThroughNote: sellThrough.note,
    valueFocus: inputs.valueFocus,
    healBatchesPerHour,
    energyBatchesPerHour,
    totalPotsPerHour,
    healBatch,
    energyBatch,
    hourlyGrossOutput,
    hourlyMaterialCost,
    hourlyStationFees,
    hourlyListingTax,
    hourlySellThroughHaircut,
    hourlyNetBeforeFocus,
    hourlyFocusOpportunityCost,
    hourlyFocusPointsBilled: roundSilver(hourlyFocusPointsBilled),
    hourlyNetAfterFocus,
    profitPerCraftingMinute,
    profitPerTenThousandFocus: healBatch.profitPerTenThousandFocus,
    estimatedSellThroughHours,
    hasEstimatedPrices,
  };
}

export type PotionProfitRange = { min: number; max: number };

/** Per-hour range for guide cards (typical sell-through, focus treated as free). */
export function computePotionProfitRange(prices: PriceMap): PotionProfitRange {
  const conservative = computePotionEconomics(prices, {
    tierId: "t5",
    sellThroughId: "slow",
    valueFocus: false,
    defaults: DEFAULT_POTION_DEFAULTS,
  });
  const typical = computePotionEconomics(prices, {
    tierId: "t6",
    sellThroughId: "typical",
    valueFocus: false,
    defaults: DEFAULT_POTION_DEFAULTS,
  });

  return {
    min: conservative.hourlyNetAfterFocus ?? 80_000,
    max: typical.hourlyNetAfterFocus ?? 350_000,
  };
}
