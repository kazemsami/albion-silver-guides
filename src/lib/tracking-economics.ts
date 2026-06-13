import {
  DEFAULT_GROUP_SIZE,
  DEFAULT_TRACKING_RISK,
  getTrackingTierConfig,
  TRACKING_CONSUMABLES_PER_PLAYER_HOUR,
  TRACKING_REFERENCE_SESSION,
  TRACKING_SCENARIO_META,
  TRACKING_TIER_CONFIGS,
  TRACKING_TOOLKIT_WEAR_PER_HOUR,
  type TrackingRiskDefaults,
  type TrackingScenarioId,
} from "@/data/tracking-economics";
import { PREMIUM_LISTING_TAX_RATE } from "@/lib/listing-tax";
import type { PriceMap, PriceMapKind } from "@/lib/albion-prices";
import { resolveBuyPrice, resolveSellPrice } from "@/lib/albion-prices";
import type { PricedLine } from "@/types/guide";
import { roundSilver } from "@/lib/format";

export type TrackingRiskInputs = TrackingRiskDefaults;

export interface TrackingComputeInputs {
  tierId: string;
  scenarioId: TrackingScenarioId;
  groupSize: number;
  risk: TrackingRiskInputs;
  priceMapKind?: PriceMapKind;
}

export interface TrackingRemnantAssumptions {
  killsPerHour: number;
  referenceGroupLoot: number;
  referencePerPlayerLoot: number;
  referenceHours: number;
  referenceKills: number;
  referenceHourlyGross: number;
  referencePerPlayerHourlyGross: number;
  lootQuantityScale: number;
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


function priceOutputLine(
  prices: PriceMap,
  id: string,
  name: string,
  quantity: number,
  mapKind: PriceMapKind = "snapshot",
): PricedLine {
  const { unitPrice, priceSource } = resolveSellPrice(prices, id, mapKind);
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
  mapKind: PriceMapKind = "snapshot",
): PricedLine {
  const { unitPrice, priceSource } = resolveBuyPrice(prices, id, mapKind);
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
  lootMultiplier: number;
}

function scenarioQuantities(
  tier: ReturnType<typeof getTrackingTierConfig>,
  scenarioId: TrackingScenarioId,
): ScenarioQuantities {
  const base = {
    killsPerHour: tier.killsPerHour,
    lootMultiplier: 1,
  };

  if (scenarioId === "good") {
    return {
      killsPerHour: tier.killsPerHour + 0.5,
      lootMultiplier: 1.08,
    };
  }

  if (scenarioId === "lucky") {
    return {
      killsPerHour: tier.killsPerHour + 0.5,
      lootMultiplier: 1.12,
    };
  }

  return base;
}

/** Scale loot quantities so Expected scenario matches the reference session hourly gross. */
export function trackingReferenceLootScale(
  prices: PriceMap,
  tier: ReturnType<typeof getTrackingTierConfig>,
  mapKind: PriceMapKind = "snapshot",
): number {
  let silverPerKill = 0;
  for (const loot of tier.averageLoot) {
    const { unitPrice } = resolveSellPrice(prices, loot.id, mapKind);
    if (unitPrice == null) continue;
    silverPerKill += loot.perKill * unitPrice;
  }

  const referenceHourly =
    TRACKING_REFERENCE_SESSION.groupLootSilver /
    TRACKING_REFERENCE_SESSION.activeHours;
  const referenceKillsPerHour =
    TRACKING_REFERENCE_SESSION.sampleKills /
    TRACKING_REFERENCE_SESSION.activeHours;

  if (silverPerKill <= 0) return 1;
  return referenceHourly / (referenceKillsPerHour * silverPerKill);
}

export function computeTrackingEconomics(
  prices: PriceMap,
  inputs: TrackingComputeInputs,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
): TrackingEconomicsResult {
  const mapKind = inputs.priceMapKind ?? "snapshot";
  const tier = getTrackingTierConfig(inputs.tierId);
  const scenario = TRACKING_SCENARIO_META[inputs.scenarioId];
  const qty = scenarioQuantities(tier, inputs.scenarioId);
  const groupSize = Math.max(4, Math.min(8, inputs.groupSize));
  const lootScale = trackingReferenceLootScale(prices, tier, mapKind);

  const outputLines: PricedLine[] = tier.averageLoot.map((loot) =>
    priceOutputLine(
      prices,
      loot.id,
      `${loot.name} (group)`,
      qty.killsPerHour * loot.perKill * qty.lootMultiplier * lootScale,
      mapKind,
    ),
  );

  const grossGroupLoot = sumLines(outputLines);
  const marketTaxTotal =
    grossGroupLoot != null
      ? roundSilver(grossGroupLoot * listingTaxRate)
      : null;

  const consumableLines: PricedLine[] = TRACKING_CONSUMABLES_PER_PLAYER_HOUR.map(
    (item) =>
      priceInputLine(
        prices,
        item.id,
        `${item.name} (×${groupSize} players)`,
        item.quantity * groupSize,
        mapKind,
      ),
  );

  const toolkitLine = priceInputLine(
    prices,
    "T7_2H_TOOL_TRACKING",
    "Tracking toolkit wear (group)",
    TRACKING_TOOLKIT_WEAR_PER_HOUR,
    mapKind,
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
      referenceGroupLoot: TRACKING_REFERENCE_SESSION.groupLootSilver,
      referencePerPlayerLoot: TRACKING_REFERENCE_SESSION.perPlayerSilver,
      referenceHours: TRACKING_REFERENCE_SESSION.activeHours,
      referenceKills: TRACKING_REFERENCE_SESSION.sampleKills,
      referenceHourlyGross: roundSilver(
        TRACKING_REFERENCE_SESSION.groupLootSilver /
          TRACKING_REFERENCE_SESSION.activeHours,
      ),
      referencePerPlayerHourlyGross: roundSilver(
        TRACKING_REFERENCE_SESSION.perPlayerSilver /
          TRACKING_REFERENCE_SESSION.activeHours,
      ),
      lootQuantityScale: roundSilver(lootScale * 1000) / 1000,
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
export function computeTrackingProfitRange(
  prices: PriceMap,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
): TrackingProfitRange {
  const expectedOnly = TRACKING_TIER_CONFIGS.map((tier) => {
    const result = computeTrackingEconomics(
      prices,
      {
        tierId: tier.id,
        scenarioId: "expected",
        groupSize: DEFAULT_GROUP_SIZE,
        risk: DEFAULT_TRACKING_RISK,
      },
      listingTaxRate,
    );
    return result.netPerPlayer ?? 0;
  }).filter((v) => v > 0);

  const luckyMax = Math.max(
    ...TRACKING_TIER_CONFIGS.map((tier) => {
      const result = computeTrackingEconomics(
        prices,
        {
          tierId: tier.id,
          scenarioId: "lucky",
          groupSize: DEFAULT_GROUP_SIZE,
          risk: DEFAULT_TRACKING_RISK,
        },
        listingTaxRate,
      );
      return result.netPerPlayer ?? 0;
    }),
  );

  const goodMax = Math.max(
    ...TRACKING_TIER_CONFIGS.map((tier) => {
      const result = computeTrackingEconomics(
        prices,
        {
          tierId: tier.id,
          scenarioId: "good",
          groupSize: DEFAULT_GROUP_SIZE,
          risk: DEFAULT_TRACKING_RISK,
        },
        listingTaxRate,
      );
      return result.netPerPlayer ?? 0;
    }),
  );

  return {
    min: roundSilver(Math.min(...expectedOnly)),
    max: roundSilver(Math.max(goodMax, ...expectedOnly)),
    luckyMax: roundSilver(luckyMax),
  };
}
