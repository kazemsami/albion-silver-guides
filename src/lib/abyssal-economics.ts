import {
  ABYSSAL_CONSUMABLES_PER_45MIN,
  ABYSSAL_QUEUE_MINUTES,
  ABYSSAL_TEAM_META,
  getAbyssalScenario,
  type AbyssalRunDurationMinutes,
  type AbyssalScenarioId,
  type AbyssalTeamSizeId,
  type AbyssalLootLine,
} from "@/data/abyssal-economics";
import { PREMIUM_LISTING_TAX_RATE } from "@/lib/listing-tax";
import type { PriceMap, PriceMapKind } from "@/lib/albion-prices";
import { resolveBuyPrice, resolveSellPrice } from "@/lib/albion-prices";
import type { PricedLine } from "@/types/guide";
import { roundSilver } from "@/lib/format";

export interface AbyssalComputeInputs {
  scenarioId: AbyssalScenarioId;
  teamSizeId: AbyssalTeamSizeId;
  winRate: number;
  runDurationMinutes: AbyssalRunDurationMinutes;
  includePvpLoot: boolean;
  includeMercJournal: boolean;
  priceMapKind?: PriceMapKind;
}

export interface AbyssalDeathBreakdown {
  deathsPerRun: number;
  deathsPerHour: number;
  avgBagLootAtDeath: number | null;
  expectedBagLossPerHour: number | null;
  bagFillAtDeath: number;
}

export interface AbyssalEconomicsResult {
  scenarioId: AbyssalScenarioId;
  scenarioLabel: string;
  scenarioDescription: string;
  highVariance: boolean;
  teamSizeId: AbyssalTeamSizeId;
  teamLabel: string;
  winRate: number;
  effectiveWinRate: number;
  runDurationMinutes: number;
  queueMinutes: number;
  runsPerHour: number;
  includePvpLoot: boolean;
  pveOutputLines: PricedLine[];
  pvpOutputLines: PricedLine[];
  grossPerSuccessfulRun: number | null;
  expectedGrossPerHour: number | null;
  consumableLines: PricedLine[];
  consumableTotal: number | null;
  marketTaxTotal: number | null;
  deathBreakdown: AbyssalDeathBreakdown;
  netAfterTaxAndDeath: number | null;
  netBeforeDeath: number | null;
  hasEstimatedPrices: boolean;
}


function priceOutputLine(
  prices: PriceMap,
  line: AbyssalLootLine,
  mapKind: PriceMapKind = "snapshot",
): PricedLine {
  const resolved = resolveSellPrice(prices, line.id, mapKind);
  const unitPrice = line.fixedSilverPerUnit ?? resolved.unitPrice;
  const priceSource = line.fixedSilverPerUnit ? ("estimated" as const) : resolved.priceSource;

  return {
    id: line.id,
    name: line.name,
    quantity: line.quantity,
    unitPrice,
    lineTotal:
      unitPrice != null ? roundSilver(unitPrice * line.quantity) : null,
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

function scaleLootLines(
  lines: AbyssalLootLine[],
  referenceMinutes: number,
  runMinutes: number,
  multiplier: number,
): AbyssalLootLine[] {
  const durationScale = runMinutes / referenceMinutes;
  return lines.map((line) => ({
    ...line,
    quantity: line.quantity * durationScale * multiplier,
  }));
}

export function computeAbyssalEconomics(
  prices: PriceMap,
  inputs: AbyssalComputeInputs,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
): AbyssalEconomicsResult {
  const mapKind = inputs.priceMapKind ?? "snapshot";
  const scenario = getAbyssalScenario(inputs.scenarioId);
  const team = ABYSSAL_TEAM_META[inputs.teamSizeId];
  const queueMinutes = ABYSSAL_QUEUE_MINUTES[inputs.teamSizeId];
  const runsPerHour = 60 / (inputs.runDurationMinutes + queueMinutes);

  const effectiveWinRate = Math.min(
    0.95,
    Math.max(0.05, inputs.winRate * team.winRateMultiplier),
  );

  const includePvp =
    inputs.includePvpLoot || scenario.includePvpByDefault;

  const scaledPve = scaleLootLines(
    scenario.pveLoot,
    scenario.referenceRunMinutes,
    inputs.runDurationMinutes,
    1,
  );
  const scaledPvp = includePvp
    ? scaleLootLines(
        scenario.pvpLoot,
        scenario.referenceRunMinutes,
        inputs.runDurationMinutes,
        team.pvpLootMultiplier,
      )
    : [];

  const pveOutputLines = scaledPve.map((line) =>
    priceOutputLine(prices, line, mapKind),
  );
  const pvpOutputLines = scaledPvp.map((line) =>
    priceOutputLine(prices, line, mapKind),
  );
  const allOutputLines = [...pveOutputLines, ...pvpOutputLines];

  const grossPerSuccessfulRun = sumLines(allOutputLines);
  const expectedGrossPerHour =
    grossPerSuccessfulRun != null
      ? roundSilver(grossPerSuccessfulRun * effectiveWinRate * runsPerHour)
      : null;

  const consumableScale = inputs.runDurationMinutes / 45;
  const consumableLines: PricedLine[] = ABYSSAL_CONSUMABLES_PER_45MIN.map(
    (item) =>
      priceInputLine(
        prices,
        item.id,
        item.name,
        item.quantity * consumableScale,
        mapKind,
      ),
  );

  if (inputs.includeMercJournal && scenario.id === "floor3Vault") {
    consumableLines.push(
      priceInputLine(
        prices,
        "T8_JOURNAL_MERCENARY_EMPTY",
        "T8 mercenary journals (empty, inventory risk)",
        2 * consumableScale,
        mapKind,
      ),
    );
  }

  const consumableTotalPerRun = sumLines(consumableLines);
  const consumableTotal =
    consumableTotalPerRun != null
      ? roundSilver(consumableTotalPerRun * runsPerHour)
      : null;

  const marketTaxTotal =
    expectedGrossPerHour != null
      ? roundSilver(expectedGrossPerHour * listingTaxRate)
      : null;

  const deathsPerRun =
    scenario.deathsPerRun * team.deathMultiplier;
  const deathsPerHour = deathsPerRun * runsPerHour;

  const avgBagLootAtDeath =
    grossPerSuccessfulRun != null
      ? roundSilver(
          grossPerSuccessfulRun *
            scenario.bagFillAtDeath *
            effectiveWinRate,
        )
      : null;

  const expectedBagLossPerHour =
    avgBagLootAtDeath != null
      ? roundSilver(avgBagLootAtDeath * deathsPerHour)
      : null;

  const netBeforeDeath =
    expectedGrossPerHour != null
      ? roundSilver(
          expectedGrossPerHour -
            (consumableTotal ?? 0) -
            (marketTaxTotal ?? 0),
        )
      : null;

  const netAfterTaxAndDeath =
    netBeforeDeath != null
      ? roundSilver(netBeforeDeath - (expectedBagLossPerHour ?? 0))
      : null;

  const hasEstimatedPrices = [...allOutputLines, ...consumableLines].some(
    (line) => line.priceSource === "estimated",
  );

  return {
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    scenarioDescription: scenario.description,
    highVariance: scenario.highVariance ?? false,
    teamSizeId: inputs.teamSizeId,
    teamLabel: team.label,
    winRate: inputs.winRate,
    effectiveWinRate,
    runDurationMinutes: inputs.runDurationMinutes,
    queueMinutes,
    runsPerHour: roundSilver(runsPerHour * 100) / 100,
    includePvpLoot: includePvp,
    pveOutputLines,
    pvpOutputLines,
    grossPerSuccessfulRun,
    expectedGrossPerHour,
    consumableLines,
    consumableTotal,
    marketTaxTotal,
    deathBreakdown: {
      deathsPerRun,
      deathsPerHour: roundSilver(deathsPerHour * 1000) / 1000,
      avgBagLootAtDeath,
      expectedBagLossPerHour,
      bagFillAtDeath: scenario.bagFillAtDeath,
    },
    netAfterTaxAndDeath,
    netBeforeDeath,
    hasEstimatedPrices,
  };
}

export type AbyssalProfitRange = { min: number; max: number; highRoll?: number };

export function computeAbyssalProfitRange(
  prices: PriceMap,
  listingTaxRate: number = PREMIUM_LISTING_TAX_RATE,
): AbyssalProfitRange {
  const conservative = computeAbyssalEconomics(
    prices,
    {
      scenarioId: "conservative",
      teamSizeId: "solo",
      winRate: 0.72,
      runDurationMinutes: 20,
      includePvpLoot: false,
      includeMercJournal: false,
    },
    listingTaxRate,
  );
  const floor2 = computeAbyssalEconomics(
    prices,
    {
      scenarioId: "floor2",
      teamSizeId: "duo",
      winRate: 0.65,
      runDurationMinutes: 30,
      includePvpLoot: false,
      includeMercJournal: false,
    },
    listingTaxRate,
  );
  const vaultHigh = computeAbyssalEconomics(
    prices,
    {
      scenarioId: "floor3Vault",
      teamSizeId: "trio",
      winRate: 0.5,
      runDurationMinutes: 45,
      includePvpLoot: true,
      includeMercJournal: false,
    },
    listingTaxRate,
  );

  return {
    min: conservative.netAfterTaxAndDeath ?? 350_000,
    max: floor2.netAfterTaxAndDeath ?? 1_100_000,
    highRoll: vaultHigh.netAfterTaxAndDeath ?? undefined,
  };
}
