import {
  AVA_CHOPS_PER_FISH,
  AVA_ROADS_SNAPPER_META,
  getAvaRoadsPreset,
  type AvaRoadsPresetId,
  type AvaRoadsSnapperViewId,
} from "@/data/ava-roads-economics";
import { PREMIUM_LISTING_TAX_RATE } from "@/lib/guide-economics";
import type { PriceMap } from "@/lib/albion-prices";
import { resolveBuyPrice, resolveSellPrice } from "@/lib/albion-prices";
import type { PricedLine } from "@/types/guide";
import { roundSilver } from "@/lib/format";

export interface AvaRoadsComputeInputs {
  presetId: AvaRoadsPresetId;
  snapperViewId: AvaRoadsSnapperViewId;
}

export interface AvaRoadsDeathBreakdown {
  deathsPerHour: number;
  gearReplacementCost: number | null;
  carriedFishValue: number | null;
  carriedLootFraction: number;
  bankingIntervalMinutes: number;
  totalExpectedDeathLoss: number | null;
  maxSingleDeathLoss: number | null;
}

export interface AvaRoadsEconomicsResult {
  presetId: AvaRoadsPresetId;
  presetLabel: string;
  presetDescription: string;
  snapperViewId: AvaRoadsSnapperViewId;
  snapperNote: string;
  effectiveFishPerHour: number;
  baseOutputLines: PricedLine[];
  snapperLine: PricedLine | null;
  journalLines: { empty: PricedLine; full: PricedLine };
  grossOutput: number | null;
  consumableLines: PricedLine[];
  consumableTotal: number | null;
  journalNet: number | null;
  marketTaxTotal: number | null;
  deathBreakdown: AvaRoadsDeathBreakdown;
  netBeforeDeath: number | null;
  netAfterTaxAndDeath: number | null;
  snapperRngValue: number | null;
  hasEstimatedPrices: boolean;
}

const GEAR_REPLACEMENT_SAFE = [
  "T4_MAIN_RAPIER_MORGANA",
  "T4_CAPEITEM_FW_THETFORD",
  "T4_BAG",
  "T3_MOUNT_HORSE",
] as const;

const GEAR_REPLACEMENT_GEARED = [
  "T4_MAIN_RAPIER_MORGANA",
  "T4_CAPEITEM_FW_THETFORD",
  "T5_BAG",
  "T4_MOUNT_GIANTSTAG",
  "T8_2H_TOOL_FISHINGROD",
] as const;


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

function kitReplacementCost(prices: PriceMap, geared: boolean): number | null {
  const ids = geared ? GEAR_REPLACEMENT_GEARED : GEAR_REPLACEMENT_SAFE;
  let total = 0;
  let hasPrice = false;
  for (const id of ids) {
    const { unitPrice } = resolveBuyPrice(prices, id);
    if (unitPrice == null) continue;
    const qty = id === "T8_2H_TOOL_FISHINGROD" ? 0.65 : 1;
    total += unitPrice * qty;
    hasPrice = true;
  }
  return hasPrice ? roundSilver(total) : null;
}

function fishOutputLines(
  prices: PriceMap,
  totalFish: number,
  sturgeonShare: number,
): PricedLine[] {
  const sturgeon = Math.round(totalFish * sturgeonShare);
  const butchered = totalFish - sturgeon;
  return [
    priceLine(
      prices,
      "T8_FISH_FRESHWATER_ALL_COMMON",
      "River Sturgeon",
      sturgeon,
      "sell",
    ),
    priceLine(
      prices,
      "T1_FISHCHOPS",
      "Chopped Fish (butchered bycatch)",
      butchered * AVA_CHOPS_PER_FISH,
      "sell",
    ),
  ];
}

export function computeAvaRoadsEconomics(
  prices: PriceMap,
  inputs: AvaRoadsComputeInputs,
): AvaRoadsEconomicsResult {
  const preset = getAvaRoadsPreset(inputs.presetId);
  const snapperMeta = AVA_ROADS_SNAPPER_META[inputs.snapperViewId];

  const uptimeFactor = 1 - preset.portalSearchDowntime;
  const effectiveFishPerHour = roundSilver(preset.fishPerHour * uptimeFactor);

  const baseOutputLines = fishOutputLines(
    prices,
    effectiveFishPerHour,
    preset.sturgeonShare,
  );

  const snapperQty =
    inputs.snapperViewId === "lucky" && preset.snapperLuckyCount > 0
      ? preset.snapperLuckyCount
      : preset.snapperExpectedPerHour * uptimeFactor;

  const snapperLine =
    snapperQty > 0
      ? priceLine(
          prices,
          "T7_FISH_FRESHWATER_AVALON_RARE",
          inputs.snapperViewId === "lucky"
            ? "Puremist Snapper (lucky bonus)"
            : "Puremist Snapper (expected avg)",
          snapperQty,
          "sell",
        )
      : null;

  const journalEmpty = priceLine(
    prices,
    "T7_JOURNAL_FISHING_EMPTY",
    "Grandmaster Fisherman's Journal (Empty)",
    1,
    "sell",
  );
  const journalFull = priceLine(
    prices,
    "T7_JOURNAL_FISHING_FULL",
    "Grandmaster Fisherman's Journal (Full)",
    1,
    "sell",
  );
  const journalNet =
    journalFull.lineTotal != null && journalEmpty.lineTotal != null
      ? roundSilver(journalFull.lineTotal - journalEmpty.lineTotal)
      : null;

  const outputLines = [
    ...baseOutputLines,
    ...(snapperLine ? [snapperLine] : []),
    journalFull,
  ];
  const grossOutput = sumLines(outputLines);

  const consumableLines: PricedLine[] = [
    priceLine(
      prices,
      "T3_FISHINGBAIT",
      "Fancy Fish Bait",
      preset.consumables.baitPerHour * uptimeFactor,
      "buy",
    ),
    priceLine(
      prices,
      "T7_MEAL_PIE",
      "Pork Pie",
      preset.consumables.porkPiePerHour * uptimeFactor,
      "buy",
    ),
  ];
  if (preset.consumables.invisPerHour > 0) {
    consumableLines.push(
      priceLine(
        prices,
        "T8_POTION_CLEANSE",
        "Invisibility Potion",
        preset.consumables.invisPerHour * uptimeFactor,
        "buy",
      ),
    );
  }
  consumableLines.push(journalEmpty);

  const consumableTotal = sumLines(consumableLines);
  const marketTaxTotal =
    grossOutput != null
      ? roundSilver(grossOutput * PREMIUM_LISTING_TAX_RATE)
      : null;

  const baseFishGross = sumLines(baseOutputLines);
  const carriedLootFraction = preset.bankingIntervalMinutes / 60;
  const carriedFishValue =
    baseFishGross != null
      ? roundSilver(baseFishGross * carriedLootFraction)
      : null;

  const kitCost = kitReplacementCost(prices, preset.geared);
  const gearReplacementCost =
    kitCost != null
      ? roundSilver(kitCost * preset.deathsPerHour)
      : null;
  const lootDeathCost =
    carriedFishValue != null
      ? roundSilver(carriedFishValue * preset.deathsPerHour)
      : null;
  const totalExpectedDeathLoss =
    gearReplacementCost != null || lootDeathCost != null
      ? roundSilver((gearReplacementCost ?? 0) + (lootDeathCost ?? 0))
      : null;

  const maxSingleDeathLoss =
    kitCost != null && carriedFishValue != null
      ? roundSilver(kitCost + carriedFishValue)
      : null;

  const netBeforeDeath =
    grossOutput != null
      ? roundSilver(
          grossOutput - (consumableTotal ?? 0) - (marketTaxTotal ?? 0),
        )
      : null;

  const netAfterTaxAndDeath =
    netBeforeDeath != null
      ? roundSilver(netBeforeDeath - (totalExpectedDeathLoss ?? 0))
      : null;

  const snapperRngValue = snapperLine?.lineTotal ?? null;

  const hasEstimatedPrices = [...outputLines, ...consumableLines].some(
    (line) => line.priceSource === "estimated",
  );

  return {
    presetId: preset.id,
    presetLabel: preset.label,
    presetDescription: preset.description,
    snapperViewId: inputs.snapperViewId,
    snapperNote: snapperMeta.note,
    effectiveFishPerHour,
    baseOutputLines,
    snapperLine,
    journalLines: { empty: journalEmpty, full: journalFull },
    grossOutput,
    consumableLines,
    consumableTotal,
    journalNet,
    marketTaxTotal,
    deathBreakdown: {
      deathsPerHour: preset.deathsPerHour,
      gearReplacementCost,
      carriedFishValue,
      carriedLootFraction,
      bankingIntervalMinutes: preset.bankingIntervalMinutes,
      totalExpectedDeathLoss,
      maxSingleDeathLoss,
    },
    netBeforeDeath,
    netAfterTaxAndDeath,
    snapperRngValue,
    hasEstimatedPrices,
  };
}

export type AvaRoadsProfitRange = { min: number; max: number; luckyMax?: number };

export function computeAvaRoadsProfitRange(prices: PriceMap): AvaRoadsProfitRange {
  const safe = computeAvaRoadsEconomics(prices, {
    presetId: "safe",
    snapperViewId: "expected",
  });
  const normal = computeAvaRoadsEconomics(prices, {
    presetId: "normal",
    snapperViewId: "expected",
  });
  const greedyLucky = computeAvaRoadsEconomics(prices, {
    presetId: "greedy",
    snapperViewId: "lucky",
  });

  return {
    min: safe.netAfterTaxAndDeath ?? 400_000,
    max: normal.netAfterTaxAndDeath ?? 1_800_000,
    luckyMax: greedyLucky.netAfterTaxAndDeath ?? undefined,
  };
}
