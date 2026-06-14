/**
 * Ensures default calculator profit outcomes match committed snapshots.
 * Regenerate after intentional formula changes:
 *   npx tsx scripts/check-profit-snapshots.ts --write
 */
import { readFileSync, writeFileSync } from "node:fs";
import { guides } from "../src/data/guides";
import { guideEconomicsBySlug } from "../src/data/guide-economics";
import {
  fetchAllGuidesMarketDataByCity,
  pickGuideProfitOutcomes,
  resolveGuideOutcomesPremiumSeller,
} from "../src/lib/guide-economics";
import { AVERAGE_MARKET_CITY_ID } from "../src/lib/market-cities";
import { profitRangeFromOutcomes } from "../src/lib/guide-profit-outcomes";

const FIXTURE_PATH = "tests/fixtures/profit-snapshots.json";

export type ProfitSnapshotEntry = {
  conservative: number | null;
  median: number | null;
  expected: number | null;
  highRoll: number | null;
  rangeMin: number | null;
  rangeMax: number | null;
};

export type ProfitSnapshotFixture = Record<string, ProfitSnapshotEntry>;

async function buildSnapshots(): Promise<ProfitSnapshotFixture> {
  const marketData = await fetchAllGuidesMarketDataByCity();
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

function entriesEqual(
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

async function main() {
  const writeMode = process.argv.includes("--write");
  const snapshots = await buildSnapshots();

  if (writeMode) {
    writeFileSync(
      FIXTURE_PATH,
      `${JSON.stringify(snapshots, null, 2)}\n`,
      "utf8",
    );
    console.log(
      `Wrote ${Object.keys(snapshots).length} profit snapshots to ${FIXTURE_PATH}`,
    );
    return;
  }

  let expected: ProfitSnapshotFixture;
  try {
    expected = JSON.parse(
      readFileSync(FIXTURE_PATH, "utf8"),
    ) as ProfitSnapshotFixture;
  } catch {
    console.log(
      `FAIL missing ${FIXTURE_PATH}. Run: npx tsx scripts/check-profit-snapshots.ts --write`,
    );
    process.exit(1);
  }

  let failed = 0;
  const slugs = Object.keys(snapshots).sort();

  for (const slug of slugs) {
    const current = snapshots[slug];
    const baseline = expected[slug];

    if (!baseline) {
      console.log(`FAIL ${slug}: missing from fixture (run --write)`);
      failed++;
      continue;
    }

    if (!entriesEqual(current, baseline)) {
      console.log(`FAIL ${slug}:`);
      console.log(`  current:  ${JSON.stringify(current)}`);
      console.log(`  expected: ${JSON.stringify(baseline)}`);
      failed++;
    }
  }

  for (const slug of Object.keys(expected)) {
    if (!snapshots[slug]) {
      console.log(`FAIL ${slug}: removed guide still in fixture`);
      failed++;
    }
  }

  if (failed > 0) {
    console.log(`${failed} snapshot mismatch(es). Run --write if intentional.`);
    process.exit(1);
  }

  console.log(`All ${slugs.length} profit snapshots match ${FIXTURE_PATH}.`);
}

main();
