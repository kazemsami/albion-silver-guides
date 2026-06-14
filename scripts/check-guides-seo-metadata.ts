/**
 * SEO metadata checks for /guides list and category landing pages.
 * Run: npx tsx scripts/check-guides-seo-metadata.ts
 */
import { guides } from "../src/data/guides";
import {
  computeGuideListProfitRanges,
  fetchAllGuidesMarketDataByCity,
} from "../src/lib/guide-economics";
import { profitRangeFromOutcomes } from "../src/lib/guide-profit-outcomes";
import {
  pickGuideProfitOutcomes,
  resolveGuideOutcomesPremiumSeller,
} from "../src/lib/guide-economics";
import { effectiveMarketCity } from "../src/lib/guide-market-city";
import { AVERAGE_MARKET_CITY_ID } from "../src/lib/market-cities";
import {
  guidesCategorySeo,
  guidesListSeo,
  isGuidesCategoryLandingPage,
  resolveGuidesListSeo,
  shouldNoIndexGuidesList,
} from "../src/lib/guides-seo";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.log(`FAIL ${message}`);
    process.exitCode = 1;
  }
}

async function main() {
  const gatheringSeo = resolveGuidesListSeo({ category: "gathering" });
  assert(
    gatheringSeo.title.includes("Gathering"),
    "gathering title should mention Gathering",
  );
  assert(
    gatheringSeo.path === "/guides?category=gathering",
    "gathering canonical path",
  );
  assert(
    !shouldNoIndexGuidesList({ category: "gathering" }),
    "category-only pages should be indexable",
  );

  const dungeonsSeo = resolveGuidesListSeo({ category: "dungeons" });
  assert(
    dungeonsSeo.title.includes("Dungeon") || dungeonsSeo.title.includes("PvE"),
    "dungeons title should mention Dungeon or PvE",
  );
  assert(
    dungeonsSeo.path === "/guides?category=dungeons",
    "dungeons canonical path",
  );
  assert(
    isGuidesCategoryLandingPage({ category: "dungeons" }),
    "dungeons-only is a category landing page",
  );
  assert(
    shouldNoIndexGuidesList({
      category: "dungeons",
      difficulty: "advanced",
    }),
    "multi-filter pages should noindex",
  );

  assert(
    resolveGuidesListSeo({}).title === guidesListSeo.title,
    "/guides uses main list SEO title",
  );

  for (const category of Object.keys(guidesCategorySeo)) {
    const seo = guidesCategorySeo[category as keyof typeof guidesCategorySeo];
    assert(seo.path.includes(`category=${category}`), `${category} path`);
    assert(seo.description.length > 40, `${category} description length`);
  }

  const marketData = await fetchAllGuidesMarketDataByCity();
  const dungeonGuides = guides.filter((g) => g.category === "dungeons");
  const serverRanges = computeGuideListProfitRanges(marketData, dungeonGuides);
  const source = marketData.estimated;

  for (const guide of dungeonGuides) {
    const city = effectiveMarketCity(
      AVERAGE_MARKET_CITY_ID,
      guide.defaultMarketCity,
    );
    const outcomes = pickGuideProfitOutcomes(
      source.outcomes,
      resolveGuideOutcomesPremiumSeller(guide.slug, false),
      city,
      guide.slug,
    );
    const expected = outcomes ? profitRangeFromOutcomes(outcomes) : null;
    const actual = serverRanges[guide.slug];
    assert(Boolean(expected && actual), `${guide.slug} has server profit range`);
    if (expected && actual) {
      assert(
        expected.min === actual.min && expected.max === actual.max,
        `${guide.slug} server range matches outcomes (${actual.min}-${actual.max})`,
      );
    }
  }

  if (process.exitCode === 1) {
    console.log("Guides SEO metadata checks failed.");
    process.exit(1);
  }

  console.log("Guides SEO metadata checks passed.");
}

main();
