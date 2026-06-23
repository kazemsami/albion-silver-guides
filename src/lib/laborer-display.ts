import { roundSilver } from "@/lib/format";
import { resolveBuyPrice } from "@/lib/albion-prices";
import type { PriceMap, PriceMapKind } from "@/lib/albion-prices";
import type { LaborerSpecialty } from "@/data/laborer-specialties";
import { laborerCountForTier } from "@/data/laborer-specialties";
import type { SkillTier } from "@/types/guide";
import type { GuideProfitOutcomes } from "@/types/guide";

export const LABORER_GUIDE_SLUG = "laborer-passive-income";

/** One completed journal job per laborer. */
export const LABORER_JOB_HOURS = 22;

/** Cumulative silver to upgrade a first personal island to level 6 (wiki). */
export const ISLAND_UPGRADE_LEVEL_6_FIRST_SILVER = 6_457_000;

/** Buying and upgrading a full island chain to level 6 (wiki, alternative path). */
export const ISLAND_UPGRADE_CHAIN_SILVER = 26_500_000;

export function isLaborerGuide(slug: string): boolean {
  return slug === LABORER_GUIDE_SLUG;
}

export function laborerCycleProfit(hourlyNet: number | null): number | null {
  if (hourlyNet == null) return null;
  return roundSilver(hourlyNet * LABORER_JOB_HOURS);
}

export function profitUnitLabel(slug: string): string {
  if (slug === "potions-crafting-bulk") return "/10k focus";
  if (isLaborerGuide(slug)) return "/22h cycle";
  return "/hr";
}

export function profitRangeTitle(slug: string): string {
  if (slug === "potions-crafting-bulk") {
    return "Profit range / 10k focus (conservative to high-roll)";
  }
  if (isLaborerGuide(slug)) {
    return "Profit range / 22h cycle (conservative to high-roll)";
  }
  return "Profit range / hr";
}

export function scaleLaborerOutcomes(
  outcomes: GuideProfitOutcomes,
): GuideProfitOutcomes {
  const scale = (value: number | null) => laborerCycleProfit(value);
  return {
    conservative: scale(outcomes.conservative),
    median: scale(outcomes.median),
    expected: scale(outcomes.expected),
    highRoll: scale(outcomes.highRoll),
  };
}

export interface LaborerFullSetupCosts {
  furnitureSilver: number;
  houseBuildSilver: number;
  islandUpgradeSilver: number;
  laborerContractsSilver: number | null;
  laborerCount: number;
  contractUnitPrice: number | null;
  total: number;
}

export function computeLaborerFullSetupCosts(params: {
  specialty: LaborerSpecialty;
  tier: SkillTier;
  priceMap: PriceMap;
  furnitureSilver: number;
  houseBuildSilver: number;
  mapKind?: PriceMapKind;
}): LaborerFullSetupCosts {
  const laborerCount = laborerCountForTier(params.tier);
  const contractUnitPrice = resolveBuyPrice(
    params.priceMap,
    params.specialty.contractItemId,
    params.mapKind ?? "snapshot",
  ).unitPrice;
  const laborerContractsSilver =
    contractUnitPrice != null
      ? roundSilver(contractUnitPrice * laborerCount)
      : null;

  const islandUpgradeSilver = ISLAND_UPGRADE_LEVEL_6_FIRST_SILVER;
  const total =
    params.furnitureSilver +
    params.houseBuildSilver +
    islandUpgradeSilver +
    (laborerContractsSilver ?? 0);

  return {
    furnitureSilver: params.furnitureSilver,
    houseBuildSilver: params.houseBuildSilver,
    islandUpgradeSilver,
    laborerContractsSilver,
    laborerCount,
    contractUnitPrice,
    total,
  };
}

export function computeLaborerPayback(
  setupTotalSilver: number,
  cycleNetAfterTax: number,
): { cycles: number; days: number } | null {
  if (setupTotalSilver <= 0 || cycleNetAfterTax <= 0) return null;
  const cycles = setupTotalSilver / cycleNetAfterTax;
  const days = (cycles * LABORER_JOB_HOURS) / 24;
  return { cycles, days };
}

export function formatPaybackDays(days: number): string {
  if (days < 14) return `${Math.round(days)} days`;
  if (days < 120) return `${Math.round(days / 7)} weeks`;
  return `${(days / 30).toFixed(1).replace(/\.0$/, "")} months`;
}
