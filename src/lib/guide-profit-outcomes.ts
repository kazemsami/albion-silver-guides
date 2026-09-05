import { guideEconomicsBySlug } from "@/data/guide-economics";
import {
  buildLaborerHourlyEconomics,
  getLaborerSpecialty,
} from "@/data/laborer-specialties";
import {
  DEFAULT_GROUP_SIZE,
  DEFAULT_TRACKING_RISK,
  TRACKING_TIER_CONFIGS,
} from "@/data/tracking-economics";
import type { GuideEconomics, GuideProfitOutcomes } from "@/types/guide";
import type { PriceMap, PriceMapKind } from "@/lib/albion-prices";
import {
  computeHourlyEconomics,
  scaleGuideEconomics,
} from "@/lib/guide-economics";
import { computeTrackingEconomics } from "@/lib/tracking-economics";
import { computeAvaRoadsEconomics } from "@/lib/ava-roads-economics";
import { computeAbyssalProfitOutcomes } from "@/lib/abyssal-economics";
import { computePotionGuideProfitOutcomes } from "@/lib/potion-economics";
import { computeRefiningGuideProfitOutcomes } from "@/lib/refining-economics";
import {
  getGatheringYieldMultiplier,
  PREMIUM_LISTING_TAX_RATE,
} from "@/lib/listing-tax";
import { roundSilver } from "@/lib/format";
import { isLaborerGuide, scaleLaborerOutcomes } from "@/lib/laborer-display";

export type GuideProfitOutcomesMap = Record<string, GuideProfitOutcomes>;

export type GuideCardProfitRange = { min: number; max: number };

/** Same span as ProfitOutcomesTable compact mode (conservative through high-roll). */
export function profitRangeFromOutcomes(
  outcomes: GuideProfitOutcomes,
): GuideCardProfitRange | null {
  const lo = outcomes.conservative ?? outcomes.median;
  const hi = outcomes.highRoll ?? outcomes.expected ?? outcomes.median;
  if (lo == null && hi == null) return null;
  const min = lo ?? hi!;
  const max = hi ?? lo!;
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

function medianValue(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return roundSilver((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return roundSilver(sorted[mid]);
}

function outcomesFromTierNets(
  nets: { tierId: string; net: number | null }[],
  defaultTierId: string,
): GuideProfitOutcomes {
  const valid = nets.filter((n): n is { tierId: string; net: number } => n.net != null);
  if (valid.length === 0) {
    return { conservative: null, median: null, expected: null, highRoll: null };
  }
  const sorted = [...valid].sort((a, b) => a.net - b.net);
  const expectedEntry =
    valid.find((n) => n.tierId === defaultTierId) ??
    sorted[Math.floor(sorted.length / 2)];

  return {
    conservative: sorted[0].net,
    median: medianValue(valid.map((n) => n.net)),
    expected: expectedEntry.net,
    highRoll: sorted[sorted.length - 1].net,
  };
}

function computeGenericOutcomes(
  economics: GuideEconomics,
  prices: PriceMap,
  listingTaxRate: number,
  gatheringYieldMultiplier: number,
  premiumSeller: boolean,
  mapKind: PriceMapKind = "snapshot",
): GuideProfitOutcomes {
  if (economics.defaultLaborerSpecialtyId) {
    const specialty = getLaborerSpecialty(economics.defaultLaborerSpecialtyId);
    const nets = economics.skillTiers.map((tier) => {
      const scaled = buildLaborerHourlyEconomics(specialty, tier);
      return {
        tierId: tier.id,
        net: computeHourlyEconomics(
          { ...economics, ...scaled },
          prices,
          undefined,
          listingTaxRate,
          mapKind,
        ).netAfterTax,
      };
    });
    return outcomesFromTierNets(nets, economics.defaultSkillTierId);
  }

  const yieldOptions = { gatheringYieldMultiplier, premiumSeller };
  const nets = economics.skillTiers.map((tier) => ({
    tierId: tier.id,
    net: computeHourlyEconomics(
      { ...economics, ...scaleGuideEconomics(economics, tier, yieldOptions) },
      prices,
      undefined,
      listingTaxRate,
      mapKind,
    ).netAfterTax,
  }));
  return outcomesFromTierNets(nets, economics.defaultSkillTierId);
}

export function computeGuideProfitOutcomes(
  slug: string,
  prices: PriceMap,
  options?: {
    listingTaxRate?: number;
    premiumSeller?: boolean;
    priceMapKind?: PriceMapKind;
  },
): GuideProfitOutcomes {
  const listingTaxRate = options?.listingTaxRate ?? PREMIUM_LISTING_TAX_RATE;
  const priceMapKind = options?.priceMapKind ?? "snapshot";
  const premiumSeller = options?.premiumSeller ?? false;
  const economicsForSlug = guideEconomicsBySlug[slug];
  const gatheringYieldMultiplier = getGatheringYieldMultiplier(
    premiumSeller,
    economicsForSlug?.gatherYieldBaseline,
  );

  if (slug === "high-tier-group-tracking") {
    const defaultTier = TRACKING_TIER_CONFIGS.find((t) => t.id === "ava-roads")!;
    const conservative = computeTrackingEconomics(
      prices,
      {
        tierId: "t6-red",
        scenarioId: "expected",
        groupSize: DEFAULT_GROUP_SIZE,
        risk: DEFAULT_TRACKING_RISK,
        priceMapKind,
      },
      listingTaxRate,
    ).netPerPlayer;
    const expected = computeTrackingEconomics(
      prices,
      {
        tierId: defaultTier.id,
        scenarioId: "expected",
        groupSize: DEFAULT_GROUP_SIZE,
        risk: DEFAULT_TRACKING_RISK,
        priceMapKind,
      },
      listingTaxRate,
    ).netPerPlayer;
    const median = computeTrackingEconomics(
      prices,
      {
        tierId: defaultTier.id,
        scenarioId: "good",
        groupSize: DEFAULT_GROUP_SIZE,
        risk: DEFAULT_TRACKING_RISK,
        priceMapKind,
      },
      listingTaxRate,
    ).netPerPlayer;
    const highRoll = computeTrackingEconomics(
      prices,
      {
        tierId: defaultTier.id,
        scenarioId: "lucky",
        groupSize: DEFAULT_GROUP_SIZE,
        risk: DEFAULT_TRACKING_RISK,
        priceMapKind,
      },
      listingTaxRate,
    ).netPerPlayer;

    return {
      conservative: conservative ?? null,
      median: median ?? null,
      expected: expected ?? null,
      highRoll: highRoll ?? null,
    };
  }

  if (slug === "ava-roads-fishing") {
    const conservative = computeAvaRoadsEconomics(
      prices,
      { presetId: "safe", snapperViewId: "expected", priceMapKind },
      listingTaxRate,
      gatheringYieldMultiplier,
    ).netAfterTaxAndDeath;
    const median = computeAvaRoadsEconomics(
      prices,
      { presetId: "normal", snapperViewId: "expected", priceMapKind },
      listingTaxRate,
      gatheringYieldMultiplier,
    ).netAfterTaxAndDeath;
    const expected = median;
    const highRoll = computeAvaRoadsEconomics(
      prices,
      { presetId: "greedy", snapperViewId: "lucky", priceMapKind },
      listingTaxRate,
      gatheringYieldMultiplier,
    ).netAfterTaxAndDeath;

    return {
      conservative: conservative ?? null,
      median: median ?? null,
      expected: expected ?? null,
      highRoll: highRoll ?? null,
    };
  }

  if (slug === "abyssal-depths-farming") {
    return computeAbyssalProfitOutcomes(prices, listingTaxRate, priceMapKind);
  }

  if (slug === "potions-crafting-bulk") {
    return computePotionGuideProfitOutcomes(
      prices,
      listingTaxRate,
      priceMapKind,
    );
  }

  if (slug === "resource-refining-focus") {
    return computeRefiningGuideProfitOutcomes(
      prices,
      listingTaxRate,
      priceMapKind,
    );
  }

  const economics = guideEconomicsBySlug[slug];
  if (!economics) {
    return { conservative: null, median: null, expected: null, highRoll: null };
  }

  const outcomes = computeGenericOutcomes(
    economics,
    prices,
    listingTaxRate,
    gatheringYieldMultiplier,
    premiumSeller,
    priceMapKind,
  );

  return isLaborerGuide(slug) ? scaleLaborerOutcomes(outcomes) : outcomes;
}
