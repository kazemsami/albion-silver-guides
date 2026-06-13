import {
  DEFAULT_POTION_DEFAULTS,
  getPotionRecipe,
  POTION_SELL_THROUGH_META,
  type PotionEconomicsDefaults,
  type PotionRecipe,
  type PotionRecipeId,
  type PotionSellThroughId,
} from "@/data/potion-economics";
import { PREMIUM_LISTING_TAX_RATE } from "@/lib/listing-tax";
import type { PriceMap, PriceMapKind } from "@/lib/albion-prices";
import { resolveBuyPrice, resolveSellPrice } from "@/lib/albion-prices";
import type { PricedLine } from "@/types/guide";
import { roundSilver } from "@/lib/format";

export type PotionFocusMode = "with-focus" | "without-focus";

export interface PotionComputeInputs {
  recipeId: PotionRecipeId;
  tierId: string;
  sellThroughId: PotionSellThroughId;
  focusMode: PotionFocusMode;
  valueFocus: boolean;
  defaults: PotionEconomicsDefaults;
  priceMapKind?: PriceMapKind;
}

/** @deprecated Use PotionFocusMode */
export type MajorHealingFocusMode = PotionFocusMode;

export interface PotionBatchResult {
  recipe: PotionRecipe;
  outputLine: PricedLine;
  materialLines: PricedLine[];
  returnedMaterialLines: PricedLine[];
  returnedMaterialsTotal: number | null;
  materialCost: number | null;
  netMaterialCost: number | null;
  materialReturnRate: number;
  craftSilverCost: number;
  listingTax: number | null;
  grossOutput: number | null;
  sellThroughHaircut: number | null;
  netBeforeFocus: number | null;
  netAfterSellThrough: number | null;
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
  focusMode: PotionFocusMode;
  recipe: PotionRecipe;
  batch: PotionBatchResult;
  /** Batches craftable per 10,000 focus (with-focus recipes only). */
  batchesPerTenThousandFocus: number | null;
  totalPotsPerTenThousandFocus: number | null;
  perTenThousandGrossOutput: number | null;
  perTenThousandMaterialCost: number | null;
  perTenThousandCraftSilver: number | null;
  perTenThousandListingTax: number | null;
  perTenThousandSellThroughHaircut: number | null;
  perTenThousandNetBeforeFocus: number | null;
  perTenThousandFocusOpportunityCost: number | null;
  perTenThousandNetAfterFocus: number | null;
  profitPerTenThousandFocus: number | null;
  hasEstimatedPrices: boolean;
}

function priceLine(
  prices: PriceMap,
  id: string,
  name: string,
  quantity: number,
  side: "buy" | "sell",
  mapKind: PriceMapKind = "snapshot",
): PricedLine {
  const { unitPrice, priceSource } =
    side === "buy"
      ? resolveBuyPrice(prices, id, mapKind)
      : resolveSellPrice(prices, id, mapKind);
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
  useFocusReturn: boolean,
  valueFocus: boolean,
  sellThroughDiscount: number,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
  mapKind: PriceMapKind = "snapshot",
): PotionBatchResult {
  const materialLines = recipe.materials.map((m) =>
    priceLine(prices, m.id, m.name, m.quantity, "buy", mapKind),
  );
  const materialCost = sumLines(materialLines);
  const materialReturnRate = useFocusReturn
    ? defaults.focusMaterialReturnRate
    : defaults.noFocusMaterialReturnRate;
  const returnedMaterialLines = materialLines.map((line) => {
    const returnedQuantity =
      Math.round(line.quantity * materialReturnRate * 100) / 100;
    return {
      ...line,
      quantity: returnedQuantity,
      lineTotal:
        line.unitPrice != null
          ? roundSilver(line.unitPrice * returnedQuantity)
          : null,
    };
  });
  const returnedMaterialsTotal = sumLines(returnedMaterialLines);
  const netMaterialCost =
    materialCost != null && returnedMaterialsTotal != null
      ? roundSilver(materialCost - returnedMaterialsTotal)
      : materialCost != null
        ? roundSilver(materialCost * (1 - materialReturnRate))
        : null;

  const outputLine = priceLine(
    prices,
    recipe.outputId,
    recipe.outputName,
    recipe.outputQuantity,
    "sell",
    mapKind,
  );
  const grossOutput = outputLine.lineTotal;

  const craftSilverCost = recipe.craftSilverCost ?? 0;

  const listingTax =
    grossOutput != null
      ? roundSilver(grossOutput * listingTaxRate)
      : null;

  const netBeforeFocus =
    grossOutput != null
      ? roundSilver(
          grossOutput -
            (netMaterialCost ?? 0) -
            craftSilverCost -
            (listingTax ?? 0),
        )
      : null;

  const sellThroughHaircut =
    grossOutput != null
      ? roundSilver(grossOutput * sellThroughDiscount)
      : null;

  const netAfterSellThrough =
    netBeforeFocus != null
      ? roundSilver(netBeforeFocus - (sellThroughHaircut ?? 0))
      : null;

  const focusCost =
    useFocusReturn && valueFocus
      ? roundSilver(recipe.focusCost * defaults.focusSilverPerPoint)
      : 0;

  const netAfterFocus =
    netAfterSellThrough != null
      ? roundSilver(netAfterSellThrough - focusCost)
      : null;

  const profitPerTenThousandFocus =
    useFocusReturn && recipe.focusCost > 0 && netAfterSellThrough != null
      ? roundSilver((netAfterSellThrough / recipe.focusCost) * 10_000)
      : null;

  return {
    recipe,
    outputLine,
    materialLines,
    returnedMaterialLines,
    returnedMaterialsTotal,
    materialCost,
    netMaterialCost,
    materialReturnRate,
    craftSilverCost,
    listingTax,
    grossOutput,
    sellThroughHaircut,
    netBeforeFocus,
    netAfterSellThrough,
    focusCost,
    netAfterFocus,
    profitPerTenThousandFocus,
  };
}

export function computePotionEconomics(
  prices: PriceMap,
  inputs: PotionComputeInputs,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
): PotionEconomicsResult {
  const sellThrough = POTION_SELL_THROUGH_META[inputs.sellThroughId];
  const useFocusReturn = inputs.focusMode === "with-focus";
  const recipe = getPotionRecipe(inputs.recipeId);

  const batch = computeBatch(
    prices,
    recipe,
    inputs.defaults,
    useFocusReturn,
    inputs.valueFocus,
    sellThrough.outputDiscount,
    listingTaxRate,
    inputs.priceMapKind ?? "snapshot",
  );

  const batchesPerTenThousandFocus =
    useFocusReturn && recipe.focusCost > 0
      ? Math.round((10_000 / recipe.focusCost) * 100) / 100
      : null;

  const scalePer10k = (batchValue: number | null) =>
    batchValue != null && batchesPerTenThousandFocus != null
      ? roundSilver(batchValue * batchesPerTenThousandFocus)
      : null;

  const perTenThousandGrossOutput = scalePer10k(batch.grossOutput);
  const perTenThousandMaterialCost = scalePer10k(batch.netMaterialCost);
  const perTenThousandCraftSilver = scalePer10k(batch.craftSilverCost);
  const perTenThousandListingTax = scalePer10k(batch.listingTax);
  const perTenThousandSellThroughHaircut = scalePer10k(batch.sellThroughHaircut);

  const perTenThousandNetBeforeFocus =
    perTenThousandGrossOutput != null
      ? roundSilver(
          perTenThousandGrossOutput -
            (perTenThousandMaterialCost ?? 0) -
            (perTenThousandCraftSilver ?? 0) -
            (perTenThousandListingTax ?? 0) -
            (perTenThousandSellThroughHaircut ?? 0),
        )
      : null;

  const perTenThousandFocusOpportunityCost =
    useFocusReturn && inputs.valueFocus
      ? roundSilver(10_000 * inputs.defaults.focusSilverPerPoint)
      : 0;

  const perTenThousandNetAfterFocus =
    perTenThousandNetBeforeFocus != null
      ? roundSilver(perTenThousandNetBeforeFocus - perTenThousandFocusOpportunityCost)
      : null;

  const totalPotsPerTenThousandFocus =
    batchesPerTenThousandFocus != null
      ? roundSilver(batchesPerTenThousandFocus * recipe.outputQuantity)
      : null;

  const hasEstimatedPrices = [
    ...batch.materialLines,
    batch.outputLine,
  ].some((line) => line.priceSource === "estimated");

  return {
    tierId: inputs.tierId,
    sellThroughId: inputs.sellThroughId,
    sellThroughLabel: sellThrough.label,
    sellThroughNote: sellThrough.note,
    valueFocus: inputs.valueFocus,
    focusMode: inputs.focusMode,
    recipe,
    batch,
    batchesPerTenThousandFocus,
    totalPotsPerTenThousandFocus,
    perTenThousandGrossOutput,
    perTenThousandMaterialCost,
    perTenThousandCraftSilver,
    perTenThousandListingTax,
    perTenThousandSellThroughHaircut,
    perTenThousandNetBeforeFocus,
    perTenThousandFocusOpportunityCost,
    perTenThousandNetAfterFocus,
    profitPerTenThousandFocus: batch.profitPerTenThousandFocus,
    hasEstimatedPrices,
  };
}

export type PotionProfitRange = { min: number; max: number };

/** Per 10k focus range for guide cards (Major Healing with focus). */
export function computePotionProfitRange(prices: PriceMap): PotionProfitRange {
  const conservative = computePotionEconomics(prices, {
    recipeId: "heal",
    tierId: "t6",
    sellThroughId: "slow",
    focusMode: "with-focus",
    valueFocus: false,
    defaults: DEFAULT_POTION_DEFAULTS,
  });
  const typical = computePotionEconomics(prices, {
    recipeId: "heal",
    tierId: "t6",
    sellThroughId: "typical",
    focusMode: "with-focus",
    valueFocus: false,
    defaults: DEFAULT_POTION_DEFAULTS,
  });

  return {
    min: conservative.profitPerTenThousandFocus ?? 0,
    max: typical.profitPerTenThousandFocus ?? 150_000,
  };
}
