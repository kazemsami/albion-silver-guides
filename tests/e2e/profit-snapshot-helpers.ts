import { readFileSync } from "node:fs";
import { guides } from "@/data/guides";
import { guideEconomicsBySlug } from "@/data/guide-economics";
import {
  fetchAllGuidesMarketDataByCity,
  pickGuideProfitOutcomes,
  resolveGuideOutcomesPremiumSeller,
} from "@/lib/guide-economics";
import { AVERAGE_MARKET_CITY_ID } from "@/lib/market-cities";
import { profitRangeFromOutcomes } from "@/lib/guide-profit-outcomes";

export const PROFIT_SNAPSHOT_FIXTURE_PATH = "tests/fixtures/profit-snapshots.json";

export type ProfitSnapshotEntry = {
  conservative: number | null;
  median: number | null;
  expected: number | null;
  highRoll: number | null;
  rangeMin: number | null;
  rangeMax: number | null;
};

export type ProfitSnapshotFixture = Record<string, ProfitSnapshotEntry>;

export async function buildProfitSnapshots(): Promise<ProfitSnapshotFixture> {
  const marketData = await fetchAllGuidesMarketDataByCity({
    includeLivePrices: false,
  });
  const fixture: ProfitSnapshotFixture = {};

  for (const guide of guides) {
    if (!guideEconomicsBySlug[guide.slug]) continue;

    const premiumSeller = resolveGuideOutcomesPremiumSeller(guide.slug, false);
    const outcomes = pickGuideProfitOutcomes(
      marketData.estimated.outcomes,
      premiumSeller,
      AVERAGE_MARKET_CITY_ID,
      guide.slug,
    );

    if (!outcomes) continue;

    const range = profitRangeFromOutcomes(outcomes);

    fixture[guide.slug] = {
      conservative: outcomes.conservative,
      median: outcomes.median,
      expected: outcomes.expected,
      highRoll: outcomes.highRoll,
      rangeMin: range?.min ?? null,
      rangeMax: range?.max ?? null,
    };
  }

  return fixture;
}

export function profitSnapshotEntriesEqual(
  a: ProfitSnapshotEntry,
  b: ProfitSnapshotEntry,
): boolean {
  return (
    a.conservative === b.conservative &&
    a.median === b.median &&
    a.expected === b.expected &&
    a.highRoll === b.highRoll &&
    a.rangeMin === b.rangeMin &&
    a.rangeMax === b.rangeMax
  );
}

export function readProfitSnapshotFixture(): ProfitSnapshotFixture {
  return JSON.parse(
    readFileSync(PROFIT_SNAPSHOT_FIXTURE_PATH, "utf8"),
  ) as ProfitSnapshotFixture;
}
