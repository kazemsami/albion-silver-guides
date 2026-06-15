/**
 * Static guide data validation (replaces scripts/validate-guides.mjs).
 * Item icon CDN checks live in item-icons-external.spec.ts (optional).
 */
import { test, expect } from "@playwright/test";
import { guides } from "@/data/guides";
import { guideReliabilityBySlug } from "@/data/guide-reliability";
import { guideEconomicsBySlug } from "@/data/guide-economics";
import {
  getAllExpectedGuideSlugs,
  getExpectedGuideSlugsByCategory,
  getPublishedCategories,
} from "./helpers";
import type { GuideCategory } from "@/types/guide";

test.describe("Guide catalog", () => {
  test("published slugs are derived from guides data", () => {
    expect(getAllExpectedGuideSlugs().sort()).toEqual(
      guides.map((guide) => guide.slug).sort(),
    );
  });

  test("category helpers match guides data", () => {
    for (const category of getPublishedCategories()) {
      expect(getExpectedGuideSlugsByCategory(category).sort()).toEqual(
        guides
          .filter((guide) => guide.category === category)
          .map((guide) => guide.slug)
          .sort(),
      );
    }

    const categorized = new Set(
      getPublishedCategories().flatMap((category: GuideCategory) =>
        getExpectedGuideSlugsByCategory(category),
      ),
    );
    expect(categorized.size).toBe(guides.length);
  });
});

test.describe("Guide data completeness", () => {
  for (const guide of guides) {
    test(`${guide.slug} has required fields and profitBuild structure`, () => {
      expect(guide.title.trim(), "title").not.toBe("");
      expect(guide.description.trim(), "description").not.toBe("");
      expect(guide.category, "category").toBeTruthy();
      expect(guide.difficulty, "difficulty").toBeTruthy();
      expect(guide.zoneType, "zoneType").toBeTruthy();

      expect(guide.requirements.length, "requirements").toBeGreaterThan(0);
      expect(guide.steps.length, "steps").toBeGreaterThan(0);
      expect(guide.tips.length, "tips").toBeGreaterThan(0);

      expect(guide.profitBuild, "profitBuild").toBeTruthy();
      const build = guide.profitBuild!;
      const hasSlots = Boolean(
        build.slots && Object.keys(build.slots).length > 0,
      );
      const hasInventory = Boolean(build.inventory && build.inventory.length > 0);
      expect(
        hasSlots || hasInventory,
        `${guide.slug} profitBuild must include slots or inventory`,
      ).toBe(true);
    });
  }

  test("every guide has reliability metadata", () => {
    const missing: string[] = [];
    for (const guide of guides) {
      if (!guideReliabilityBySlug[guide.slug]) {
        missing.push(guide.slug);
      }
    }
    expect(
      missing,
      `Guides missing reliability:\n${missing.join("\n")}`,
    ).toEqual([]);
  });

  test("reliability is attached on each guide object", () => {
    for (const guide of guides) {
      expect(guide.reliability?.status, guide.slug).toMatch(
        /reviewed|needs-review/,
      );
    }
  });

  test("every guide has hourly economics config", () => {
    const missing: string[] = [];
    for (const guide of guides) {
      if (!guideEconomicsBySlug[guide.slug]) {
        missing.push(guide.slug);
      }
    }
    expect(
      missing,
      `Guides missing economics:\n${missing.join("\n")}`,
    ).toEqual([]);
  });
});
