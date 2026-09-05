import {
  DEFAULT_REFINING_DEFAULTS,
  DEFAULT_REFINING_ENCHANT,
  DEFAULT_REFINING_FOCUS_EFFICIENCY,
  DEFAULT_REFINING_RESOURCE_ID,
  DEFAULT_REFINING_TIER,
  REFINING_ENCHANT_PRICE_MULT,
  REFINING_RAW_PER_CRAFT,
  REFINING_RESOURCES,
  REFINING_TIERS,
  getRefiningResource,
  refiningFocusCost,
  resolveRefiningItem,
  type RefiningEconomicsDefaults,
  type RefiningEnchant,
  type RefiningFocusEfficiencyId,
  type RefiningResourceId,
  type RefiningTier,
} from "@/data/refining-economics";
import { PREMIUM_LISTING_TAX_RATE } from "@/lib/listing-tax";
import type { PriceMap, PriceMapKind } from "@/lib/albion-prices";
import { resolveSellPrice } from "@/lib/albion-prices";
import type { GuideProfitOutcomes, PricedLine } from "@/types/guide";
import { roundSilver } from "@/lib/format";

export type RefiningFocusMode = "with-focus" | "without-focus";

export interface RefiningComputeInputs {
  resourceId: RefiningResourceId;
  tier: RefiningTier;
  enchant?: RefiningEnchant;
  focusMode: RefiningFocusMode;
  focusEfficiencyId: RefiningFocusEfficiencyId;
  defaults: RefiningEconomicsDefaults;
  /** How many refined items to craft in this batch (minimum 1). */
  craftCount?: number;
  priceMapKind?: PriceMapKind;
  /** Item id → silver per unit. Overrides market/snapshot quotes. */
  unitPriceOverrides?: Record<string, number>;
}

export interface RefiningCraftResult {
  resourceId: RefiningResourceId;
  resourceLabel: string;
  station: string;
  bonusCity: string;
  tier: RefiningTier;
  enchant: RefiningEnchant;
  craftCount: number;
  outputName: string;
  rawLine: PricedLine;
  lowerRefinedLine: PricedLine;
  outputLine: PricedLine;
  returnedRawLine: PricedLine;
  returnedLowerLine: PricedLine;
  materialCost: number | null;
  returnedMaterialsTotal: number | null;
  netMaterialCost: number | null;
  materialReturnRate: number;
  stationFee: number | null;
  focusPointsPerCraft: number;
  focusPointsTotal: number;
  listingTax: number | null;
  grossOutput: number | null;
  /** Net silver for the full batch after fees. */
  netBatch: number | null;
  /** Net silver for a single craft (for /10k focus). */
  netPerCraft: number | null;
  profitPerTenThousandFocus: number | null;
}

export interface RefiningEconomicsResult {
  craft: RefiningCraftResult;
  craftsPerTenThousandFocus: number | null;
  profitPerTenThousandFocus: number | null;
  focusMode: RefiningFocusMode;
  focusEfficiencyId: RefiningFocusEfficiencyId;
}

function priceLine(
  prices: PriceMap,
  id: string,
  name: string,
  quantity: number,
  mapKind: PriceMapKind = "snapshot",
  unitPriceOverrides?: Record<string, number>,
): PricedLine {
  const override = unitPriceOverrides?.[id];
  if (override != null && override > 0) {
    return {
      id,
      name,
      quantity,
      unitPrice: override,
      lineTotal: roundSilver(override * quantity),
      priceSource: "fixed",
    };
  }

  const { unitPrice, priceSource } = resolveRefiningSellPrice(
    prices,
    id,
    mapKind,
  );
  return {
    id,
    name,
    quantity,
    unitPrice,
    lineTotal: unitPrice != null ? roundSilver(unitPrice * quantity) : null,
    priceSource,
  };
}

/**
 * Sell-order unit price. Enchanted ids missing from the live map are scaled
 * from the flat live quote so .1–.4 track the market without fetching every id.
 */
function resolveRefiningSellPrice(
  prices: PriceMap,
  itemId: string,
  mapKind: PriceMapKind,
): { unitPrice: number | null; priceSource: PricedLine["priceSource"] } {
  const direct = resolveSellPrice(prices, itemId, mapKind);
  if (mapKind !== "live") return direct;
  if (direct.priceSource === "market") return direct;

  const match = itemId.match(/^(.+)_LEVEL(\d+)@\d+$/);
  if (!match) return direct;

  const flatId = match[1]!;
  const enchant = Number.parseInt(match[2]!, 10) as RefiningEnchant;
  if (enchant < 1 || enchant > 4) return direct;

  const flat = resolveSellPrice(prices, flatId, mapKind);
  if (flat.unitPrice == null) return direct;

  return {
    unitPrice: roundSilver(
      flat.unitPrice * REFINING_ENCHANT_PRICE_MULT[enchant],
    ),
    priceSource: flat.priceSource,
  };
}

function lowerTier(tier: RefiningTier): 3 | 4 | 5 | 6 | 7 {
  return (tier - 1) as 3 | 4 | 5 | 6 | 7;
}

export function computeRefiningCraft(
  prices: PriceMap,
  inputs: RefiningComputeInputs,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
): RefiningCraftResult {
  const family = getRefiningResource(inputs.resourceId);
  const tier = inputs.tier;
  const enchant = inputs.enchant ?? DEFAULT_REFINING_ENCHANT;
  const lower = lowerTier(tier);
  const craftCount = Math.max(1, Math.floor(inputs.craftCount ?? 1));
  const rawQty = REFINING_RAW_PER_CRAFT[tier] * craftCount;
  const lowerQty = craftCount;
  const mapKind = inputs.priceMapKind ?? "snapshot";
  const returnRate = inputs.defaults.materialReturnRate;
  const overrides = inputs.unitPriceOverrides;

  const raw = resolveRefiningItem(family.rawByTier[tier], enchant, tier);
  const lowerRefined = resolveRefiningItem(
    family.refinedByTier[lower],
    enchant,
    lower,
  );
  const output = resolveRefiningItem(family.refinedByTier[tier], enchant, tier);

  const rawLine = priceLine(
    prices,
    raw.id,
    raw.name,
    rawQty,
    mapKind,
    overrides,
  );
  const lowerRefinedLine = priceLine(
    prices,
    lowerRefined.id,
    lowerRefined.name,
    lowerQty,
    mapKind,
    overrides,
  );
  const outputLine = priceLine(
    prices,
    output.id,
    output.name,
    craftCount,
    mapKind,
    overrides,
  );

  const returnedRawLine = priceLine(
    prices,
    raw.id,
    `${raw.name} (returned)`,
    Math.round(rawQty * returnRate * 1000) / 1000,
    mapKind,
    overrides,
  );
  const returnedLowerLine = priceLine(
    prices,
    lowerRefined.id,
    `${lowerRefined.name} (returned)`,
    Math.round(lowerQty * returnRate * 1000) / 1000,
    mapKind,
    overrides,
  );

  const materialCost =
    rawLine.lineTotal != null && lowerRefinedLine.lineTotal != null
      ? roundSilver(rawLine.lineTotal + lowerRefinedLine.lineTotal)
      : null;

  const returnedMaterialsTotal =
    returnedRawLine.lineTotal != null && returnedLowerLine.lineTotal != null
      ? roundSilver(returnedRawLine.lineTotal + returnedLowerLine.lineTotal)
      : null;

  const netMaterialCost =
    materialCost != null && returnedMaterialsTotal != null
      ? roundSilver(materialCost - returnedMaterialsTotal)
      : materialCost;

  const grossOutput = outputLine.lineTotal;
  const stationFee =
    grossOutput != null
      ? roundSilver((grossOutput * inputs.defaults.stationFeePercent) / 100)
      : null;
  const listingTax =
    grossOutput != null ? roundSilver(grossOutput * listingTaxRate) : null;

  const focusPointsPerCraft =
    inputs.focusMode === "with-focus"
      ? refiningFocusCost(tier, inputs.focusEfficiencyId, enchant)
      : 0;
  const focusPointsTotal = focusPointsPerCraft * craftCount;

  let netBatch: number | null = null;
  if (grossOutput != null && netMaterialCost != null) {
    netBatch = roundSilver(
      grossOutput -
        netMaterialCost -
        (stationFee ?? 0) -
        (listingTax ?? 0),
    );
  }

  const netPerCraft =
    netBatch != null ? roundSilver(netBatch / craftCount) : null;

  const profitPerTenThousandFocus =
    netPerCraft != null && focusPointsPerCraft > 0
      ? roundSilver((netPerCraft * 10_000) / focusPointsPerCraft)
      : null;

  return {
    resourceId: family.id,
    resourceLabel: family.label,
    station: family.station,
    bonusCity: family.bonusCity,
    tier,
    enchant,
    craftCount,
    outputName: output.name,
    rawLine,
    lowerRefinedLine,
    outputLine,
    returnedRawLine,
    returnedLowerLine,
    materialCost,
    returnedMaterialsTotal,
    netMaterialCost,
    materialReturnRate: returnRate,
    stationFee,
    focusPointsPerCraft,
    focusPointsTotal,
    listingTax,
    grossOutput,
    netBatch,
    netPerCraft,
    profitPerTenThousandFocus,
  };
}

export function computeRefiningEconomics(
  prices: PriceMap,
  inputs: RefiningComputeInputs,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
): RefiningEconomicsResult {
  const craft = computeRefiningCraft(prices, inputs, listingTaxRate);
  const craftsPerTenThousandFocus =
    craft.focusPointsPerCraft > 0
      ? Math.round((10_000 / craft.focusPointsPerCraft) * 100) / 100
      : null;

  return {
    craft,
    craftsPerTenThousandFocus,
    profitPerTenThousandFocus: craft.profitPerTenThousandFocus,
    focusMode: inputs.focusMode,
    focusEfficiencyId: inputs.focusEfficiencyId,
  };
}

function profitMetric(
  prices: PriceMap,
  inputs: RefiningComputeInputs,
  listingTaxRate: number,
): number | null {
  const result = computeRefiningEconomics(prices, inputs, listingTaxRate);
  if (inputs.focusMode === "with-focus") {
    return result.profitPerTenThousandFocus;
  }
  return result.craft.netPerCraft;
}

/** Outcomes for cards: with-focus /10k focus across resources and tiers. */
export function computeRefiningGuideProfitOutcomes(
  prices: PriceMap,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
  priceMapKind: PriceMapKind = "snapshot",
): GuideProfitOutcomes {
  const defaults: RefiningEconomicsDefaults = {
    ...DEFAULT_REFINING_DEFAULTS,
  };

  const withFocusProfits: number[] = [];
  for (const resource of REFINING_RESOURCES) {
    for (const tier of REFINING_TIERS) {
      const profit = profitMetric(
        prices,
        {
          resourceId: resource.id,
          tier,
          focusMode: "with-focus",
          focusEfficiencyId: DEFAULT_REFINING_FOCUS_EFFICIENCY,
          defaults,
          priceMapKind,
        },
        listingTaxRate,
      );
      if (profit != null) withFocusProfits.push(profit);
    }
  }

  const expected = profitMetric(
    prices,
    {
      resourceId: DEFAULT_REFINING_RESOURCE_ID,
      tier: DEFAULT_REFINING_TIER,
      focusMode: "with-focus",
      focusEfficiencyId: DEFAULT_REFINING_FOCUS_EFFICIENCY,
      defaults,
      priceMapKind,
    },
    listingTaxRate,
  );

  if (withFocusProfits.length === 0) {
    return {
      conservative: null,
      median: null,
      expected: null,
      highRoll: null,
    };
  }

  const sorted = [...withFocusProfits].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? roundSilver((sorted[mid - 1]! + sorted[mid]!) / 2)
      : sorted[mid]!;

  return {
    conservative: sorted[0]!,
    median,
    expected: expected != null ? roundSilver(expected) : median,
    highRoll: sorted[sorted.length - 1]!,
  };
}

export const REFINING_PROFIT_OUTCOME_HINTS: Partial<
  Record<keyof GuideProfitOutcomes, string>
> = {
  conservative: "Worst resource/tier at mid focus efficiency (per 10k focus)",
  median: "Median across T4–T8 resources (per 10k focus)",
  expected: "T6 metal bars in Thetford, mid focus efficiency (default)",
  highRoll: "Best resource/tier at mid focus efficiency (per 10k focus)",
};

export type RefiningProfitRange = { min: number; max: number };

export function computeRefiningProfitRange(
  prices: PriceMap,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
  priceMapKind: PriceMapKind = "snapshot",
): RefiningProfitRange {
  const outcomes = computeRefiningGuideProfitOutcomes(
    prices,
    listingTaxRate,
    priceMapKind,
  );
  return {
    min: outcomes.conservative ?? outcomes.median ?? 0,
    max: outcomes.highRoll ?? outcomes.expected ?? 0,
  };
}
