/**
 * Calculator profit data checks (replaces validate scripts).
 * - Card/list baked ranges match computed outcomes
 * - Default outcomes match tests/fixtures/profit-snapshots.json
 */
import { test, expect } from "@playwright/test";
import { guides } from "@/data/guides";
import { guideEconomicsBySlug } from "@/data/guide-economics";
import {
  fetchAllGuidesMarketDataByCity,
  pickGuideProfitOutcomes,
} from "@/lib/guide-economics";
import { AVERAGE_MARKET_CITY_ID } from "@/lib/market-cities";
import { profitRangeFromOutcomes } from "@/lib/guide-profit-outcomes";
import {
  buildProfitSnapshots,
  profitSnapshotEntriesEqual,
  readProfitSnapshotFixture,
} from "./profit-snapshot-helpers";

test.describe("Guide card profit ranges match baked outcomes", () => {
  test.describe.configure({ timeout: 120_000 });

  test("every guide with economics has consistent standard and premium ranges", async () => {
    const marketData = await fetchAllGuidesMarketDataByCity();
    const source = marketData.estimated;
    const mismatches: string[] = [];

    for (const guide of guides) {
      if (!guideEconomicsBySlug[guide.slug]) continue;

      const city = AVERAGE_MARKET_CITY_ID;

      for (const premiumSeller of [false, true]) {
        const premiumKey = premiumSeller ? "premium" : "standard";
        const outcomes = pickGuideProfitOutcomes(
          source.outcomes,
          premiumSeller,
          city,
          guide.slug,
        );
        const cardRange = outcomes ? profitRangeFromOutcomes(outcomes) : null;
        const listRange =
          source.ranges[premiumKey][city]?.[guide.slug] ??
          source.ranges[premiumKey][AVERAGE_MARKET_CITY_ID]?.[guide.slug];

        if (!cardRange || !listRange) {
          mismatches.push(
            `${guide.slug} (premium=${premiumSeller}): missing range`,
          );
          continue;
        }

        if (
          cardRange.min !== listRange.min ||
          cardRange.max !== listRange.max
        ) {
          mismatches.push(
            `${guide.slug} (premium=${premiumSeller}): card ${cardRange.min}-${cardRange.max} vs baked ${listRange.min}-${listRange.max}`,
          );
        }
      }
    }

    expect(
      mismatches,
      `Guide card profit range mismatches:\n${mismatches.join("\n")}`,
    ).toEqual([]);
  });
});

test.describe("Profit outcome snapshots", () => {
  test.describe.configure({ timeout: 120_000 });

  test("default calculator outcomes match committed fixture", async () => {
    const current = await buildProfitSnapshots();
    const expected = readProfitSnapshotFixture();
    const mismatches: string[] = [];
    const slugs = Object.keys(current).sort();

    for (const slug of slugs) {
      const baseline = expected[slug];
      if (!baseline) {
        mismatches.push(`${slug}: missing from fixture (run npm run test:snapshots:write)`);
        continue;
      }

      if (!profitSnapshotEntriesEqual(current[slug], baseline)) {
        mismatches.push(
          `${slug}:\n  current:  ${JSON.stringify(current[slug])}\n  expected: ${JSON.stringify(baseline)}`,
        );
      }
    }

    for (const slug of Object.keys(expected)) {
      if (!current[slug]) {
        mismatches.push(`${slug}: removed guide still in fixture`);
      }
    }

    expect(
      mismatches,
      `Profit snapshot mismatches:\n${mismatches.join("\n\n")}`,
    ).toEqual([]);
  });
});
