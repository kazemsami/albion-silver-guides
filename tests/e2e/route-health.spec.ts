/**
 * Route health tests.
 * Verifies that every public page loads without 404/crash and does not render
 * application error tokens in visible content.
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  blockLivePriceApis,
  assertNoForbiddenText,
} from "./helpers";

const CRASH_PATTERNS = [
  /Application error/i,
  /500\s*[-–]\s*Internal/i,
  /ChunkLoadError/i,
  /Unhandled Runtime Error/i,
];

async function assertNotCrashed(
  page: import("@playwright/test").Page,
): Promise<void> {
  const body = await page.locator("body").innerText();
  for (const pattern of CRASH_PATTERNS) {
    expect(body, `Page must not crash: ${pattern}`).not.toMatch(pattern);
  }
}

test.describe("Static page routes", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("/ loads successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await assertNotCrashed(page);
    await assertNoForbiddenText(page);
  });

  test("/guides loads successfully", async ({ page }) => {
    const response = await page.goto("/guides");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await assertNotCrashed(page);
    await assertNoForbiddenText(page);
  });

  test("/license loads successfully", async ({ page }) => {
    const response = await page.goto("/license");
    expect(response?.status()).toBe(200);
    await assertNotCrashed(page);
  });

  for (const category of CATEGORIES) {
    test(`/guides?category=${category} loads successfully`, async ({
      page,
    }) => {
      const response = await page.goto(`/guides?category=${category}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await assertNotCrashed(page);
      await assertNoForbiddenText(page);
    });
  }
});

test.describe("Guide detail routes", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`/guides/${slug} loads successfully`, async ({ page }) => {
      const response = await page.goto(`/guides/${slug}`);
      expect(response?.status(), `${slug} should return 200`).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await assertNotCrashed(page);
      await assertNoForbiddenText(page);
    });
  }

  test("unknown guide slug returns 404", async ({ page }) => {
    const response = await page.goto("/guides/this-guide-does-not-exist");
    // Next.js not-found returns 404
    expect(response?.status()).toBe(404);
  });
});

test.describe("Invalid filter params handled gracefully", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("/guides?category=nonexistent is handled", async ({ page }) => {
    // Should redirect or show the full guide list without crashing
    const response = await page.goto("/guides?category=nonexistent");
    // Either a redirect to /guides (302/308) or render the page without crash
    const finalStatus = response?.status() ?? 0;
    expect(
      [200, 302, 308].includes(finalStatus),
      `Status ${finalStatus} not acceptable`,
    ).toBe(true);
    await assertNotCrashed(page);
  });

  test("/guides?sort=invalid is handled", async ({ page }) => {
    const response = await page.goto("/guides?sort=invalid");
    expect(response?.status()).toBe(200);
    await assertNotCrashed(page);
  });
});
