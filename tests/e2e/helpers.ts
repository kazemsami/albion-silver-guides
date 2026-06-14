import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/** All published guide slugs. Matches guides.ts generateStaticParams output. */
export const GUIDE_SLUGS = [
  "t4-ore-mining-yellow-zone",
  "fiber-farming-solo",
  "corrupted-dungeons-pvpve",
  "dungeon-maps-solo",
  "abyssal-depths-farming",
  "high-tier-group-tracking",
  "mists-fishing",
  "ava-roads-fishing",
  "laborer-passive-income",
  "potions-crafting-bulk",
] as const;

export const CATEGORIES = [
  "gathering",
  "crafting",
  "dungeons",
  "fishing",
  "laborers",
] as const;

export const CATEGORY_GUIDES: Record<string, string[]> = {
  gathering: ["t4-ore-mining-yellow-zone", "fiber-farming-solo"],
  crafting: ["potions-crafting-bulk"],
  dungeons: [
    "corrupted-dungeons-pvpve",
    "dungeon-maps-solo",
    "abyssal-depths-farming",
    "high-tier-group-tracking",
  ],
  fishing: ["mists-fishing", "ava-roads-fishing"],
  laborers: ["laborer-passive-income"],
};

/** Patterns that must never appear in visible page text. */
export const FORBIDDEN_TEXT_PATTERNS = [
  /\bNaN\b/,
  /\bnull\b/,
  /\bundefined\b/,
  /\[object Object\]/,
  /guide s\b/i,
  /\bPotion s\b/,
  /\{\{/,
  // duplicated ordered-list numbers checked per-guide page in content-quality.spec.ts
  /Loading filters…/,
];

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

  // Canonical: if present it must point to a real URL (not a relative path)
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  if (canonical) {
    expect(canonical, "canonical must be absolute URL").toMatch(
      /^https?:\/\//,
    );
  }
}

/**
 * Return page text as a single normalised string.
 */
export async function getPageText(page: Page): Promise<string> {
  return page.locator("body").innerText();
}
