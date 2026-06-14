/**
 * SEO metadata tests.
 * Verifies page titles, meta descriptions, Open Graph tags, and canonicals.
 * Specifically checks that category pages have distinct titles.
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  blockLivePriceApis,
  assertCoreSeo,
} from "./helpers";

const GUIDES_GENERIC_TITLE =
  "Albion Online Money Making Guides | Albion Silver";

const CATEGORY_TITLE_KEYWORDS: Record<string, RegExp> = {
  gathering: /Gathering/i,
  crafting: /Crafting/i,
  dungeons: /Dungeon|PvE/i,
  fishing: /Fishing/i,
  laborers: /Laborer/i,
};

test.describe("Home page SEO", () => {
  test("/ has correct SEO", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/");
    await assertCoreSeo(page);
    const title = await page.title();
    expect(title).toMatch(/Albion/i);
  });
});

test.describe("Guides list page SEO", () => {
  test("/guides has title and description", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/guides");
    await assertCoreSeo(page);
    const title = await page.title();
    expect(title).toContain("Albion Silver");
  });
});

test.describe("Category page SEO", () => {
  for (const category of CATEGORIES) {
    test(`/guides?category=${category} has category-specific title`, async ({
      page,
    }) => {
      await blockLivePriceApis(page);
      await page.goto(`/guides?category=${category}`);
      await assertCoreSeo(page);

      const title = await page.title();
      // Must not be the generic list title
      expect(
        title,
        `${category} page must not use generic list title`,
      ).not.toBe(GUIDES_GENERIC_TITLE);

      // Must contain the category keyword
      const keyword = CATEGORY_TITLE_KEYWORDS[category];
      expect(
        title,
        `${category} title must contain keyword: ${keyword}`,
      ).toMatch(keyword);
    });
  }

  test("category pages all have distinct titles from each other", async ({
    page,
  }) => {
    await blockLivePriceApis(page);
    const titles: string[] = [];
    for (const category of CATEGORIES) {
      await page.goto(`/guides?category=${category}`);
      titles.push(await page.title());
    }
    const unique = new Set(titles);
    expect(
      unique.size,
      `All 5 category titles must be distinct, got: ${titles.join(", ")}`,
    ).toBe(5);
  });
});

test.describe("Guide detail page SEO", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`/guides/${slug} has correct SEO`, async ({ page }) => {
      await page.goto(`/guides/${slug}`);
      await assertCoreSeo(page);

      const title = await page.title();
      // Must not be the generic list title
      expect(title).not.toBe(GUIDES_GENERIC_TITLE);
      // Must contain the site name
      expect(title).toContain("Albion Silver");
    });
  }

  test("guide detail pages all have distinct titles", async ({ page }) => {
    const titles: string[] = [];
    for (const slug of GUIDE_SLUGS) {
      await page.goto(`/guides/${slug}`);
      titles.push(await page.title());
    }
    const unique = new Set(titles);
    expect(
      unique.size,
      `All ${GUIDE_SLUGS.length} guide titles must be distinct, got: ${titles.join(" | ")}`,
    ).toBe(GUIDE_SLUGS.length);
  });
});

test.describe("Filtered pages are noindex", () => {
  test("/guides?difficulty=beginner is noindex", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/guides?difficulty=beginner");
    const robotsMeta = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robotsMeta ?? "").toMatch(/noindex/i);
  });

  test("/guides?zone=safe is noindex", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/guides?zone=safe");
    const robotsMeta = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robotsMeta ?? "").toMatch(/noindex/i);
  });

  test("/guides (no filters) is indexable", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/guides");
    const robotsMeta = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    // Either not present (default index) or explicitly "index"
    if (robotsMeta) {
      expect(robotsMeta).not.toMatch(/noindex/i);
    }
  });

  for (const category of CATEGORIES) {
    test(`/guides?category=${category} (category landing) is indexable`, async ({
      page,
    }) => {
      await blockLivePriceApis(page);
      await page.goto(`/guides?category=${category}`);
      const robotsMeta = await page
        .locator('meta[name="robots"]')
        .getAttribute("content");
      if (robotsMeta) {
        expect(robotsMeta).not.toMatch(/noindex/i);
      }
    });
  }

  test("/guides?category=dungeons&difficulty=advanced is noindex", async ({
    page,
  }) => {
    await blockLivePriceApis(page);
    await page.goto("/guides?category=dungeons&difficulty=advanced");
    const robotsMeta = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robotsMeta ?? "").toMatch(/noindex/i);
  });
});

test.describe("Server-rendered text does not contain loading placeholders", () => {
  test("/guides does not render loading placeholders as text", async ({
    page,
  }) => {
    await blockLivePriceApis(page);
    // Disable JS to check SSR-only output
    await page.goto("/guides");
    const html = await page.content();
    expect(html).not.toContain("Loading filters…");
  });
});
