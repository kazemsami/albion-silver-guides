/**
 * Category filtering E2E tests.
 * Verifies category pages show only guides from that category and /guides lists every guide once.
 */
import { test, expect } from "@playwright/test";
import {
  CATEGORIES,
  blockLivePriceApis,
  collectGuideSlugsFromMain,
  getAllExpectedGuideSlugs,
  getExpectedGuideSlugsByCategory,
  getGuideSlugsNotInCategory,
} from "./helpers";

test.describe("Category pages show only guides from that category", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const category of CATEGORIES) {
    const expectedSlugs = getExpectedGuideSlugsByCategory(category);
    const forbiddenSlugs = getGuideSlugsNotInCategory(category);

    test(`/guides?category=${category} shows ${expectedSlugs.length} guide(s)`, async ({
      page,
    }) => {
      await page.goto(`/guides?category=${category}`);

      await page
        .waitForSelector('main a[href^="/guides/"]', {
          timeout: 10_000,
        })
        .catch(() => null);

      const uniqueSlugs = await collectGuideSlugsFromMain(page);

      for (const slug of expectedSlugs) {
        expect(
          uniqueSlugs,
          `${category} page must include guide "${slug}"`,
        ).toContain(slug);
      }

      for (const slug of forbiddenSlugs) {
        expect(
          uniqueSlugs,
          `${category} page must NOT include guide from another category: "${slug}"`,
        ).not.toContain(slug);
      }

      expect(
        uniqueSlugs.length,
        `${category} page must show exactly ${expectedSlugs.length} guide(s)`,
      ).toBe(expectedSlugs.length);
    });
  }
});

test.describe("Broken pluralisation never appears", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const category of CATEGORIES) {
    test(`/guides?category=${category} has no broken pluralisation`, async ({
      page,
    }) => {
      await page.goto(`/guides?category=${category}`);
      const text = await page.locator("body").innerText();

      expect(text, 'Must not contain "guide s"').not.toMatch(/guide s\b/i);
      expect(text, 'Must not contain "Potion s"').not.toMatch(/\bPotion s\b/);
      expect(text, 'Must not contain "guides s"').not.toMatch(/guides s\b/i);
    });
  }

  test("/guides has no broken pluralisation", async ({ page }) => {
    await page.goto("/guides");
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/guide s\b/i);
    expect(text).not.toMatch(/\bPotion s\b/);
  });
});

test.describe("Invalid category is handled gracefully", () => {
  test("/guides?category=pvp shows all guides or redirects cleanly", async ({
    page,
  }) => {
    await blockLivePriceApis(page);
    const response = await page.goto("/guides?category=pvp");
    expect(
      [200, 302, 308].includes(response?.status() ?? 0),
      `Invalid category must not 500`,
    ).toBe(true);

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Application error/i);
    expect(body).not.toMatch(/\[object Object\]/);
  });
});

test.describe("All guides page shows all published guides", () => {
  test("/guides shows every published guide exactly once", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/guides");

    await page
      .waitForSelector('main a[href^="/guides/"]', { timeout: 10_000 })
      .catch(() => null);

    const visibleSlugs = await collectGuideSlugsFromMain(page);
    const expectedSlugs = [...getAllExpectedGuideSlugs()].sort();

    expect(
      visibleSlugs,
      `Expected exactly ${expectedSlugs.length} guides on /guides`,
    ).toEqual(expectedSlugs);
  });
});
