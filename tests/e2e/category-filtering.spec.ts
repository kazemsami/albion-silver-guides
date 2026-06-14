/**
 * Category filtering tests.
 * Verifies that category pages show only guides from that category,
 * guide counts are correct, pluralisation is sane, and invalid
 * categories are handled gracefully.
 */
import { test, expect } from "@playwright/test";
import { CATEGORIES, CATEGORY_GUIDES, blockLivePriceApis } from "./helpers";

// Slugs that must NOT appear on a given category page
function guidesNotInCategory(category: string): string[] {
  return Object.entries(CATEGORY_GUIDES)
    .filter(([cat]) => cat !== category)
    .flatMap(([, slugs]) => slugs);
}

test.describe("Category pages show only guides from that category", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const category of CATEGORIES) {
    const expectedSlugs = CATEGORY_GUIDES[category];
    const forbiddenSlugs = guidesNotInCategory(category);

    test(`/guides?category=${category} shows ${expectedSlugs.length} guide(s)`, async ({
      page,
    }) => {
      await page.goto(`/guides?category=${category}`);

      // Wait for guides to render
      await page.waitForSelector("[data-guide-slug], article, .guide-card, a[href^='/guides/']", {
        timeout: 10_000,
      }).catch(() => null);

      // Collect all guide links on the page (exclude nav links)
      const guideLinks = page.locator('main a[href^="/guides/"]');
      const hrefs = await guideLinks.evaluateAll((anchors) =>
        anchors
          .map((a) => a.getAttribute("href") ?? "")
          .filter((h) => h.startsWith("/guides/") && h !== "/guides/")
          .map((h) => h.replace("/guides/", "").split("?")[0])
      );

      const uniqueSlugs = [...new Set(hrefs)];

      // Every expected guide must be present
      for (const slug of expectedSlugs) {
        expect(
          uniqueSlugs,
          `${category} page must include guide "${slug}"`,
        ).toContain(slug);
      }

      // No guide from another category should be present
      for (const slug of forbiddenSlugs) {
        expect(
          uniqueSlugs,
          `${category} page must NOT include guide from another category: "${slug}"`,
        ).not.toContain(slug);
      }
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

    // Must not crash
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Application error/i);
    expect(body).not.toMatch(/\[object Object\]/);
  });
});

test.describe("All guides page shows all 10 guides", () => {
  test("/guides shows all published guides", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/guides");

    await page.waitForSelector('a[href^="/guides/"]', { timeout: 10_000 }).catch(() => null);

    const guideLinks = page.locator('main a[href^="/guides/"]');
    const hrefs = await guideLinks.evaluateAll((anchors) =>
      anchors
        .map((a) => a.getAttribute("href") ?? "")
        .filter((h) => h.startsWith("/guides/") && h !== "/guides/")
        .map((h) => h.replace("/guides/", "").split("?")[0])
    );
    const uniqueSlugs = [...new Set(hrefs)];

    // All 10 published guides should appear
    expect(
      uniqueSlugs.length,
      `Expected 10 guides on /guides, got ${uniqueSlugs.length}: ${uniqueSlugs.join(", ")}`,
    ).toBeGreaterThanOrEqual(10);
  });
});
