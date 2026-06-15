/**
 * Shared Playwright helpers for E2E, data-integrity, and content-lint specs.
 *
 * Guide slugs and category membership are derived from `src/data/guides.ts`.
 * Do not hardcode a second copy of category-to-guide mappings here.
 *
 * Future layout (optional):
 *   tests/e2e     — routing, navigation, rendered UI, calculator interactions
 *   tests/data    — guide metadata, economics config, SEO config
 *   tests/content — copy lint, claims, forbidden phrases
 */
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { guides, getGuidesByCategory } from "@/data/guides";
import type { Guide, GuideCategory } from "@/types/guide";
import { categoryLabels } from "@/types/guide";
import { fetchAllGuidesMarketDataByCity } from "@/lib/guide-economics";

/** All published guides from the app data source. */
export function getPublishedGuides(): readonly Guide[] {
  return guides;
}

/** Slugs for every published guide (sorted for stable assertions). */
export function getAllExpectedGuideSlugs(): string[] {
  return guides.map((guide) => guide.slug);
}

/** Categories that have at least one published guide, in site display order. */
export function getPublishedCategories(): GuideCategory[] {
  return (Object.keys(categoryLabels) as GuideCategory[]).filter((category) =>
    guides.some((guide) => guide.category === category),
  );
}

/** Published guide slugs for a category landing page. */
export function getExpectedGuideSlugsByCategory(
  category: GuideCategory,
): string[] {
  return getGuidesByCategory(category).map((guide) => guide.slug);
}

/** Guide slugs that belong to any category other than the given one. */
export function getGuideSlugsNotInCategory(category: GuideCategory): string[] {
  return guides
    .filter((guide) => guide.category !== category)
    .map((guide) => guide.slug);
}

/** Convenience alias for `for (const slug of …)` loops in specs. */
export const GUIDE_SLUGS = getAllExpectedGuideSlugs();

/** Convenience alias for category filter specs. */
export const CATEGORIES = getPublishedCategories();

/** Patterns that must never appear in visible page text. */
export const FORBIDDEN_TEXT_PATTERNS = [
  /\bNaN\b/,
  /\bnull\b/,
  /\bundefined\b/,
  /\[object Object\]/,
  /guide s\b/i,
  /\bPotion s\b/,
  /\{\{/,
  /Loading filters…/,
];

/** Duplicated ordered-list numbers in rendered copy (e.g. "1. 1." or "1. 1"). */
export const DUPLICATED_STEP_NUMBER_PATTERN = /\b(\d+)\.\s+\1\b/;

/**
 * Collect unique guide slugs linked from the main content area.
 * Excludes bare `/guides/` nav links; deduplicates and sorts for exact comparisons.
 */
export async function collectGuideSlugsFromMain(page: Page): Promise<string[]> {
  const hrefs = await page.locator('main a[href^="/guides/"]').evaluateAll(
    (anchors) =>
      anchors
        .map((a) => a.getAttribute("href") ?? "")
        .filter((h) => h.startsWith("/guides/") && h !== "/guides/")
        .map((h) => h.replace("/guides/", "").split("?")[0]),
  );
  return [...new Set(hrefs)].sort();
}

/**
 * Block live market price API calls so tests use snapshot prices only.
 * This prevents flakiness caused by Albion market data fluctuations.
 */
export async function blockLivePriceApis(page: Page): Promise<void> {
  await page.route(/albion-online-data\.com/, (route) => route.abort());
}

/**
 * Assert that no forbidden text patterns appear in visible body text.
 */
export async function assertNoForbiddenText(page: Page): Promise<void> {
  const bodyText = await page.locator("body").innerText();
  for (const pattern of FORBIDDEN_TEXT_PATTERNS) {
    expect(
      bodyText,
      `Page must not contain: ${pattern.toString()}`,
    ).not.toMatch(pattern);
  }
}

/**
 * Assert that the page title is non-empty and does not contain known bad tokens.
 */
export async function assertPageTitle(
  page: Page,
  options: {
    contains?: string | RegExp;
    notEquals?: string;
  } = {},
): Promise<void> {
  const title = await page.title();
  expect(title.trim(), "Page title must not be empty").not.toBe("");
  expect(title, "Page title must contain | Albion Silver").toContain(
    "Albion Silver",
  );
  if (options.contains) {
    expect(title).toMatch(options.contains);
  }
  if (options.notEquals) {
    expect(title).not.toBe(options.notEquals);
  }
}

/**
 * Assert core meta tags exist and are non-empty.
 */
export async function assertCoreSeo(page: Page): Promise<void> {
  const title = await page.title();
  expect(title.trim()).not.toBe("");

  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(
    description?.trim(),
    "meta description must not be empty",
  ).toBeTruthy();

  const ogTitle = await page
    .locator('meta[property="og:title"]')
    .getAttribute("content");
  expect(ogTitle?.trim(), "og:title must not be empty").toBeTruthy();

  const ogDescription = await page
    .locator('meta[property="og:description"]')
    .getAttribute("content");
  expect(ogDescription?.trim(), "og:description must not be empty").toBeTruthy();

  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  if (canonical) {
    expect(canonical, "canonical must be absolute URL").toMatch(
      /^https?:\/\//,
    );
  }
}

/** Combined fee totals must not appear in user-facing copy; use setup + transaction breakdown. */
export const BARE_MARKET_FEE_TOTAL_PATTERNS: Array<{
  pattern: RegExp;
  reason: string;
}> = [
  {
    pattern: /\b10\.5\s*%/,
    reason:
      'Use "2.5% setup fee + 8% transaction tax" instead of bare 10.5% market fee totals',
  },
  {
    pattern: /\b6\.5\s*%/,
    reason:
      'Use "2.5% setup fee + 4% transaction tax" instead of bare 6.5% market fee totals',
  },
];

export function assertNoBareMarketFeeTotals(text: string): void {
  for (const { pattern, reason } of BARE_MARKET_FEE_TOTAL_PATTERNS) {
    expect(text, reason).not.toMatch(pattern);
  }
}

/**
 * Return page text as a single normalised string.
 */
export async function getPageText(page: Page): Promise<string> {
  return page.locator("body").innerText();
}

/** Saved snapshot prices only. Avoids slow live Albion API calls in Playwright hooks. */
export function fetchGuideMarketDataForTests() {
  return fetchAllGuidesMarketDataByCity({ includeLivePrices: false });
}
