/**
 * Content lint tests.
 * Scans visible text for placeholders, broken punctuation, and duplicated step numbers.
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  DUPLICATED_STEP_NUMBER_PATTERN,
  blockLivePriceApis,
} from "./helpers";

const ALL_ROUTES = [
  "/",
  "/guides",
  ...CATEGORIES.map((c) => `/guides?category=${c}`),
  ...GUIDE_SLUGS.map((s) => `/guides/${s}`),
];

/** Forbidden patterns in visible page text.  Each entry has a pattern and a
 *  human-readable reason for the test failure message. */
const CONTENT_CHECKS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /\bNaN\b/,
    reason: "NaN rendered in page text - likely a missing number calculation",
  },
  {
    pattern: /\bundefined\b/,
    reason: "undefined rendered in page text - likely a missing data field",
  },
  {
    pattern: /\[object Object\]/,
    reason: "[object Object] rendered - object serialisation error",
  },
  {
    pattern: /guide s\b/i,
    reason: 'Broken pluralisation: "guide s"',
  },
  {
    pattern: /\bPotion s\b/,
    reason: 'Broken pluralisation: "Potion s"',
  },
  {
    pattern: /\{\{/,
    reason: "Unresolved template marker {{",
  },
  {
    pattern: /Loading filters…/,
    reason: 'SSR rendered "Loading filters…" placeholder',
  },
  {
    // Double punctuation: two periods not preceded by a digit (so "1.2.3." is ok,
    // "profits.." is not).
    pattern: /[a-zA-Z]\.\./,
    reason: 'Double punctuation like "estimates.."',
  },
];

test.describe("Content quality - no placeholder or broken text", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const route of ALL_ROUTES) {
    test(`${route} - no content defects`, async ({ page }) => {
      await page.goto(route);
      // Wait for main content
      await page.waitForSelector("main, article, [role='main']", {
        timeout: 10_000,
      }).catch(() => null);

      const text = await page.locator("body").innerText();

      for (const { pattern, reason } of CONTENT_CHECKS) {
        expect(text, reason).not.toMatch(pattern);
      }
    });
  }
});

test.describe("Guide pages have no duplicated step numbers in main content", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`/guides/${slug} - no duplicated step numbers`, async ({ page }) => {
      await page.goto(`/guides/${slug}`);
      await page.waitForSelector("main", { timeout: 10_000 });

      const text = await page.locator("main").innerText();
      expect(
        text,
        'Duplicated ordered-list numbers like "1. 1." or "1. 1"',
      ).not.toMatch(DUPLICATED_STEP_NUMBER_PATTERN);
    });
  }
});

test.describe("Header and footer consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  // Routes to check for consistent header/footer
  const HEADER_FOOTER_ROUTES = [
    "/",
    "/guides",
    "/guides?category=gathering",
    "/guides?category=dungeons",
    `/guides/${GUIDE_SLUGS[0]}`,
    `/guides/${GUIDE_SLUGS[4]}`,
  ];

  for (const route of HEADER_FOOTER_ROUTES) {
    test(`${route} has header with navigation and footer with license`, async ({
      page,
    }) => {
      await page.goto(route);

      // Header: must have the site logo/brand link to /
      const brandLink = page.locator('header a[href="/"]').first();
      await expect(brandLink, "Header brand link must exist").toBeVisible();

      // Header: "All Guides" or Guides nav link
      const guidesLink = page
        .locator('header a[href="/guides"]')
        .first();
      await expect(guidesLink, "Header must have /guides link").toBeVisible();

      // Footer: GPLv3 mention
      const footerText = await page.locator("footer").innerText();
      expect(
        footerText,
        "Footer must mention GPLv3",
      ).toMatch(/GPL.*v3|General Public License/i);

      // Footer: No "All rights reserved"
      expect(
        footerText,
        'Footer must not say "All rights reserved"',
      ).not.toMatch(/All rights reserved/i);

      // Footer: No "Source-available" license claim
      expect(
        footerText,
        'Footer must not claim "Source-available license"',
      ).not.toMatch(/Source-available license/i);
    });
  }

  test("Header contains Feedback button", async ({ page }) => {
    await page.goto("/guides");
    // Feedback button in header (text or aria-label)
    const feedbackBtn = page.locator(
      'header button:has-text("Feedback"), header a:has-text("Feedback")',
    ).first();
    await expect(feedbackBtn, "Header must have a Feedback button").toBeVisible();
  });

  test("Header contains Donate link", async ({ page }) => {
    await page.goto("/guides");
    const donateLink = page.locator(
      'header a:has-text("Donate"), header button:has-text("Donate")',
    ).first();
    await expect(donateLink, "Header must have a Donate link").toBeVisible();
  });

  test("Header contains Live prices control", async ({ page }) => {
    await page.goto("/guides");
    // The live prices toggle - look for the label or button
    const livePrices = page
      .locator('header [aria-label*="live prices" i], header label:has-text("Live"), header button:has-text("Live")')
      .first();
    await expect(livePrices, "Header must have Live prices control").toBeVisible();
  });

  test("Header contains market city selector", async ({ page }) => {
    await page.goto("/guides");
    // The city select dropdown
    const citySelect = page
      .locator('header select[id*="city" i], header select[aria-label*="city" i], header select')
      .first();
    await expect(citySelect, "Header must have a market city selector").toBeVisible();
  });
});
