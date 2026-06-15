/**
 * Guides list SEO config and server profit range checks
 * (replaces scripts/check-guides-seo-metadata.ts).
 */
import { test, expect } from "@playwright/test";
import { guides } from "@/data/guides";
import {
  computeGuideListProfitRanges,
  pickGuideProfitOutcomes,
  resolveGuideOutcomesPremiumSeller,
} from "@/lib/guide-economics";
import { profitRangeFromOutcomes } from "@/lib/guide-profit-outcomes";
import { AVERAGE_MARKET_CITY_ID } from "@/lib/market-cities";
import {
  guidesCategorySeo,
  guidesListSeo,
  isGuidesCategoryLandingPage,
  resolveGuidesListSeo,
  shouldNoIndexGuidesList,
} from "@/lib/guides-seo";
import type { GuideCategory } from "@/types/guide";
import { fetchGuideMarketDataForTests } from "./helpers";

test.describe("Guides list SEO config", () => {
  test("gathering category landing resolves indexable SEO", () => {
    const seo = resolveGuidesListSeo({ category: "gathering" });
    expect(seo.title).toMatch(/Gathering/);
    expect(seo.path).toBe("/guides?category=gathering");
    expect(shouldNoIndexGuidesList({ category: "gathering" })).toBe(false);
  });

  test("dungeons category landing resolves indexable SEO", () => {
    const seo = resolveGuidesListSeo({ category: "dungeons" });
    expect(seo.title).toMatch(/Dungeon|PvE/);
    expect(seo.path).toBe("/guides?category=dungeons");
    expect(isGuidesCategoryLandingPage({ category: "dungeons" })).toBe(true);
  });

  test("multi-filter guide list views should noindex", () => {
    expect(
      shouldNoIndexGuidesList({
        category: "dungeons",
        difficulty: "advanced",
      }),
    ).toBe(true);
  });

  test("/guides uses the main list SEO title", () => {
    expect(resolveGuidesListSeo({}).title).toBe(guidesListSeo.title);
  });

  for (const category of Object.keys(guidesCategorySeo) as GuideCategory[]) {
    test(`${category} category SEO entry has path and description`, () => {
      const seo = guidesCategorySeo[category];
      expect(seo.path).toContain(`category=${category}`);
      expect(seo.description.length).toBeGreaterThan(40);
      expect(seo.title.trim()).not.toBe("");
    });
  }
});

test.describe("Dungeon guide server profit ranges", () => {
  test.describe.configure({ timeout: 120_000 });

  test("match calculator outcomes for saved prices", async () => {
    const marketData = await fetchGuideMarketDataForTests();
    const dungeonGuides = guides.filter((guide) => guide.category === "dungeons");
    const serverRanges = computeGuideListProfitRanges(marketData, dungeonGuides);
    const source = marketData.estimated;
    const mismatches: string[] = [];

    for (const guide of dungeonGuides) {
      const outcomes = pickGuideProfitOutcomes(
        source.outcomes,
        resolveGuideOutcomesPremiumSeller(guide.slug, false),
        AVERAGE_MARKET_CITY_ID,
        guide.slug,
      );
      const expected = outcomes ? profitRangeFromOutcomes(outcomes) : null;
      const actual = serverRanges[guide.slug];

      if (!expected || !actual) {
        mismatches.push(`${guide.slug}: missing server profit range`);
        continue;
      }

      if (expected.min !== actual.min || expected.max !== actual.max) {
        mismatches.push(
          `${guide.slug}: expected ${expected.min}-${expected.max}, got ${actual.min}-${actual.max}`,
        );
      }
    }

    expect(
      mismatches,
      `Dungeon server profit range mismatches:\n${mismatches.join("\n")}`,
    ).toEqual([]);
  });
});
