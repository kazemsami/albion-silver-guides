import {
  DEFAULT_GROUP_SIZE,
  DEFAULT_TRACKING_RISK,
  getTrackingTierConfig,
  TRACKING_CONSUMABLES_PER_PLAYER_HOUR,
  TRACKING_SCENARIO_META,
  TRACKING_TIER_CONFIGS,
  TRACKING_TOOLKIT_WEAR_PER_HOUR,
  type TrackingRiskDefaults,
  type TrackingScenarioId,
} from "@/data/tracking-economics";
import { getItemPriceFallback } from "@/data/item-price-fallbacks";
import { PREMIUM_LISTING_TAX_RATE } from "@/lib/guide-economics";
import type { PriceMap } from "@/lib/albion-prices";
import { getBuyPrice, getSellPrice } from "@/lib/albion-prices";
import type { PricedLine } from "@/types/guide";
import { roundSilver } from "@/lib/format";

export type TrackingRiskInputs = TrackingRiskDefaults;

export interface TrackingComputeInputs {
  tierId: string;
  scenarioId: TrackingScenarioId;
  groupSize: number;
  risk: TrackingRiskInputs;
}

export interface TrackingRemnantAssumptions {
  killsPerHour: number;
  dropChance: number;
  remnantUnitPrice: number | null;
  expectedRemnantsPerHour: number;
  expectedRemnantValue: number | null;
  zeroRemnantProbability: number;
  luckyRemnantCount: number;
}

export interface TrackingEconomicsResult {
  tierId: string;
  tierLabel: string;
  scenarioId: TrackingScenarioId;
  scenarioLabel: string;
  scenarioNote: string;
  groupSize: number;
  remnantAssumptions: TrackingRemnantAssumptions;
  outputLines: PricedLine[];
  grossGroupLoot: number | null;
  consumableLines: PricedLine[];
  consumableTotal: number | null;
  toolkitCost: number | null;
  marketTaxTotal: number | null;
  repairCostTotal: number;
  deathLossTotal: number;
  netGroupBeforeRisk: number | null;
  adjustedNetGroup: number | null;
  netPerPlayer: number | null;
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

  const fallback = getItemPriceFallback(itemId, "buy") ?? getItemPriceFallback(itemId, "sell");
  if (fallback != null) return { unitPrice: fallback, priceSource: "estimated" };

  return { unitPrice: null, priceSource: "estimated" };
}

function priceOutputLine(
  prices: PriceMap,
  id: string,
  name: string,
  quantity: number,
): PricedLine {
  const { unitPrice, priceSource } = resolveSellPrice(prices, id);
  return {
    id,
    name,
    quantity,
    unitPrice,
    lineTotal:
      unitPrice != null ? roundSilver(unitPrice * quantity) : null,
    priceSource,
  };
}

function priceInputLine(
  prices: PriceMap,
  id: string,
  name: string,
  quantity: number,
): PricedLine {
  const { unitPrice, priceSource } = resolveBuyPrice(prices, id);
  return {
    id,
    name,
    quantity,
    unitPrice,
    lineTotal:
      unitPrice != null ? roundSilver(unitPrice * quantity) : null,
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

interface ScenarioQuantities {
  killsPerHour: number;
  remainsPerKill: number;
  essencePerKill: number;
  remnantDropChance: number;
  luckyRemnantCount: number;
}

function scenarioQuantities(
  tier: ReturnType<typeof getTrackingTierConfig>,
  scenarioId: TrackingScenarioId,
): ScenarioQuantities {
  const base = {
    killsPerHour: tier.killsPerHour,
    remainsPerKill: tier.remainsPerKill,
    essencePerKill: tier.essence.perKill,
    remnantDropChance: tier.remnant.dropChance,
    luckyRemnantCount: 0,
  };

  if (scenarioId === "good") {
    return {
      killsPerHour: tier.killsPerHour + 0.5,
      remainsPerKill: tier.remainsPerKill * 1.15,
      essencePerKill: tier.essence.perKill * 1.3,
      remnantDropChance: tier.remnant.dropChance * 2.5,
      luckyRemnantCount: 0,
    };
  }

  if (scenarioId === "lucky") {
    return {
      killsPerHour: tier.killsPerHour + 0.5,
      remainsPerKill: tier.remainsPerKill * 1.15,
      essencePerKill: tier.essence.perKill * 1.4,
      remnantDropChance: tier.remnant.dropChance,
      luckyRemnantCount: 1,
    };
  }

  return base;
}

export function computeTrackingEconomics(
  prices: PriceMap,
  inputs: TrackingComputeInputs,
): TrackingEconomicsResult {
  const tier = getTrackingTierConfig(inputs.tierId);
  const scenario = TRACKING_SCENARIO_META[inputs.scenarioId];
  const qty = scenarioQuantities(tier, inputs.scenarioId);
  const groupSize = Math.max(4, Math.min(8, inputs.groupSize));

  const remainsQty = qty.killsPerHour * qty.remainsPerKill;
  const essenceQty = qty.killsPerHour * qty.essencePerKill;

  const expectedRemnantsPerHour =
    inputs.scenarioId === "lucky"
      ? qty.luckyRemnantCount
      : qty.killsPerHour * qty.remnantDropChance;

  const remnantPrice = resolveSellPrice(prices, tier.remnant.id);
  const zeroRemnantProbability = Math.pow(
    1 - tier.remnant.dropChance,
    qty.killsPerHour,
  );

  const outputLines: PricedLine[] = [
    priceOutputLine(
      prices,
      "T1_ALCHEMY_COMMON",
      "Rare Animal Remains (group)",
      remainsQty,
    ),
    priceOutputLine(
      prices,
      tier.essence.id,
      `${tier.essence.name} (group)`,
      essenceQty,
    ),
  ];

  if (expectedRemnantsPerHour > 0) {
    outputLines.push(
      priceOutputLine(
        prices,
        tier.remnant.id,
        `${tier.remnant.name} (${inputs.scenarioId === "lucky" ? "1 lucky drop" : "expected value"})`,
        expectedRemnantsPerHour,
      ),
    );
  }

  const grossGroupLoot = sumLines(outputLines);
  const marketTaxTotal =
    grossGroupLoot != null
      ? roundSilver(grossGroupLoot * PREMIUM_LISTING_TAX_RATE)
      : null;

  const consumableLines: PricedLine[] = TRACKING_CONSUMABLES_PER_PLAYER_HOUR.map(
    (item) =>
      priceInputLine(
        prices,
        item.id,
        `${item.name} (×${groupSize} players)`,
        item.quantity * groupSize,
      ),
  );

  const toolkitLine = priceInputLine(
    prices,
    "T7_2H_TOOL_TRACKING",
    "Tracking toolkit wear (group)",
    TRACKING_TOOLKIT_WEAR_PER_HOUR,
  );
  consumableLines.push(toolkitLine);

  const consumableTotal = sumLines(consumableLines);
  const toolkitCost = toolkitLine.lineTotal;

  const repairCostTotal = roundSilver(
    inputs.risk.repairCostPerPlayerHour * groupSize,
  );
  const deathLossTotal = roundSilver(
    inputs.risk.deathProbabilityPerPlayerHour *
      inputs.risk.kitReplacementCostPerPlayer *
      groupSize,
  );

  const netGroupBeforeRisk =
    grossGroupLoot != null
      ? roundSilver(
          grossGroupLoot -
            (consumableTotal ?? 0) -
            (marketTaxTotal ?? 0) -
            repairCostTotal -
            deathLossTotal,
        )
      : null;

  const uptimeFactor =
    (1 - inputs.risk.downtimePercent) * (1 - inputs.risk.failedHuntPercent);

  const adjustedNetGroup =
    netGroupBeforeRisk != null
      ? roundSilver(netGroupBeforeRisk * uptimeFactor)
      : null;

  const netPerPlayer =
    adjustedNetGroup != null
      ? roundSilver(adjustedNetGroup / groupSize)
      : null;

  const hasEstimatedPrices = [...outputLines, ...consumableLines].some(
    (line) => line.priceSource === "estimated",
  );

  return {
    tierId: tier.id,
    tierLabel: tier.label,
    scenarioId: inputs.scenarioId,
    scenarioLabel: scenario.label,
    scenarioNote: scenario.note,
    groupSize,
    remnantAssumptions: {
      killsPerHour: qty.killsPerHour,
      dropChance:
        inputs.scenarioId === "lucky"
          ? tier.remnant.dropChance
          : qty.remnantDropChance,
      remnantUnitPrice: remnantPrice.unitPrice,
      expectedRemnantsPerHour,
      expectedRemnantValue:
        remnantPrice.unitPrice != null
          ? roundSilver(expectedRemnantsPerHour * remnantPrice.unitPrice)
          : null,
      zeroRemnantProbability,
      luckyRemnantCount: qty.luckyRemnantCount,
    },
    outputLines,
    grossGroupLoot,
    consumableLines,
    consumableTotal,
    toolkitCost,
    marketTaxTotal,
    repairCostTotal,
    deathLossTotal,
    netGroupBeforeRisk,
    adjustedNetGroup,
    netPerPlayer,
    hasEstimatedPrices,
  };
}

export type TrackingProfitRange = {
  min: number;
  max: number;
  luckyMax?: number;
};

/** Expected per-player profit across tiers; lucky upside as max for card range. */
export function computeTrackingProfitRange(prices: PriceMap): TrackingProfitRange {
  const expectedOnly = TRACKING_TIER_CONFIGS.map((tier) => {
    const result = computeTrackingEconomics(prices, {
      tierId: tier.id,
      scenarioId: "expected",
      groupSize: DEFAULT_GROUP_SIZE,
      risk: DEFAULT_TRACKING_RISK,
    });
    return result.netPerPlayer ?? 0;
  }).filter((v) => v > 0);

  const luckyMax = Math.max(
    ...TRACKING_TIER_CONFIGS.map((tier) => {
      const result = computeTrackingEconomics(prices, {
        tierId: tier.id,
        scenarioId: "lucky",
        groupSize: DEFAULT_GROUP_SIZE,
        risk: DEFAULT_TRACKING_RISK,
      });
      return result.netPerPlayer ?? 0;
    }),
  );

  const goodMax = Math.max(
    ...TRACKING_TIER_CONFIGS.map((tier) => {
      const result = computeTrackingEconomics(prices, {
        tierId: tier.id,
        scenarioId: "good",
        groupSize: DEFAULT_GROUP_SIZE,
        risk: DEFAULT_TRACKING_RISK,
      });
      return result.netPerPlayer ?? 0;
    }),
  );

  return {
    min: roundSilver(Math.min(...expectedOnly)),
    max: roundSilver(Math.max(goodMax, ...expectedOnly)),
    luckyMax: roundSilver(luckyMax),
  };
}
