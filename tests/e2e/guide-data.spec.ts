/**
 * Static guide data validation (replaces scripts/validate-guides.mjs).
 * Item icon CDN checks live in item-icons.spec.ts.
 */
import { test, expect } from "@playwright/test";
import { guides } from "@/data/guides";
import { guideReliabilityBySlug } from "@/data/guide-reliability";
import { guideEconomicsBySlug } from "@/data/guide-economics";
import { GUIDE_SLUGS } from "./helpers";

test.describe("Guide catalog", () => {
  test("GUIDE_SLUGS matches published guides", () => {
    const publishedSlugs = guides.map((guide) => guide.slug).sort();
    expect([...GUIDE_SLUGS].sort()).toEqual(publishedSlugs);
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

      expect(guide.silverPerHour.min, "silverPerHour.min").toBeGreaterThan(0);
      expect(guide.silverPerHour.max, "silverPerHour.max").toBeGreaterThan(0);
      expect(
        guide.silverPerHour.min,
        "silverPerHour min must not exceed max",
      ).toBeLessThanOrEqual(guide.silverPerHour.max);

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
