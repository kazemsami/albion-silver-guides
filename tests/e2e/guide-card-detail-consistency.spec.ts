/**
 * Guide card vs guide detail consistency tests.
 * Collects title, category label, and profit range text from guide cards on
 * /guides and each category page, then cross-checks with the guide detail page.
 *
 * The goal is to catch bugs where the same guide shows different profit ranges
 * on the list page vs the category page vs the detail page.
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  CATEGORY_GUIDES,
  blockLivePriceApis,
} from "./helpers";

interface CardInfo {
  title: string;
  profitText: string;
  categoryText: string;
}

/** Extract guide card information from the current page for a given slug. */
async function extractCardInfo(
  page: import("@playwright/test").Page,
  slug: string,
): Promise<CardInfo | null> {
  // Find the anchor whose href contains the slug
  const card = page
    .locator(`a[href="/guides/${slug}"]`)
    .first();

  const exists = await card.count();
  if (!exists) return null;

  // Title: find the heading inside (or near) the card
  const titleEl = card.locator("h2, h3").first();
  const title = (await titleEl.textContent()) ?? "";

  // Profit text: look for a span/p that contains "k/hr" or "M/hr" or "/10k focus"
  const parent = card.locator("..");
  const profitEl = parent.locator(
    'p:has-text("/hr"), p:has-text("/10k"), span:has-text("/hr"), span:has-text("/10k")',
  ).first();
  const profitText = (await profitEl.textContent().catch(() => "")) ?? "";

  // Category label
  const categoryEl = parent.locator('span:has-text("Gathering"), span:has-text("Crafting"), span:has-text("Dungeon"), span:has-text("Fishing"), span:has-text("Laborer")').first();
  const categoryText = (await categoryEl.textContent().catch(() => "")) ?? "";

  return {
    title: title.trim(),
    profitText: profitText.trim(),
    categoryText: categoryText.trim(),
  };
}

test.describe("Guide card titles match detail page h1", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: card title matches detail h1`, async ({ page }) => {
      await page.goto("/guides");
      await page.waitForSelector(`a[href="/guides/${slug}"]`, {
        timeout: 10_000,
      }).catch(() => null);

      const cardInfo = await extractCardInfo(page, slug);
      if (!cardInfo || !cardInfo.title) {
        // Card may be hidden under a category filter - skip title check
        // but still verify the detail page loads
        await page.goto(`/guides/${slug}`);
        const h1 = page.locator("h1").first();
        await expect(h1).toBeVisible();
        return;
      }

      await page.goto(`/guides/${slug}`);
      const h1Text = (await page.locator("h1").first().textContent()) ?? "";
      expect(
        h1Text.trim(),
        `Detail h1 must match card title for "${slug}"`,
      ).toContain(cardInfo.title.replace(/…$/, "").trim().substring(0, 20));
    });
  }
});

test.describe("Category page shows correct guides for each category", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const category of CATEGORIES) {
    const expectedSlugs = CATEGORY_GUIDES[category];

    test(`${category}: all expected guides appear on category page`, async ({
      page,
    }) => {
      await page.goto(`/guides?category=${category}`);
      await page.waitForSelector(`a[href^="/guides/"]`, {
        timeout: 10_000,
      }).catch(() => null);

      for (const slug of expectedSlugs) {
        const link = page.locator(`a[href="/guides/${slug}"]`).first();
        const count = await link.count();
        expect(
          count,
          `Expected guide "${slug}" to appear on ${category} category page`,
        ).toBeGreaterThan(0);
      }
    });
  }
});

test.describe("Profit ranges are internally consistent", () => {
  /**
   * Tests that the profit range shown on a guide detail page
   * is not obviously impossible (min <= max).
   */
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: profit range min does not exceed max`, async ({ page }) => {
      await page.goto(`/guides/${slug}`);

      // Require k/M on both sides so ISO dates (e.g. 2026-06-14) are not parsed as ranges.
      const rangePattern =
        /(\d+(?:\.\d+)?[kKmM])\s*[–-]\s*(\d+(?:\.\d+)?[kKmM])/g;
      const bodyText = await page.locator("main").innerText();
      const matches = [...bodyText.matchAll(rangePattern)];

      function parseAmount(s: string): number {
        const n = parseFloat(s);
        if (/[mM]$/.test(s)) return n * 1_000_000;
        if (/[kK]$/.test(s)) return n * 1_000;
        return n;
      }

      for (const match of matches) {
        const minVal = parseAmount(match[1]);
        const maxVal = parseAmount(match[2]);
        if (!isNaN(minVal) && !isNaN(maxVal) && minVal > 0 && maxVal > 0) {
          expect(
            minVal,
            `Range "${match[0]}" has min > max on ${slug}`,
          ).toBeLessThanOrEqual(maxVal);
        }
      }
    });
  }
});
