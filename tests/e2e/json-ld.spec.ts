/**
 * JSON-LD structured data tests (type-specific assertions).
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  CATEGORY_GUIDES,
  blockLivePriceApis,
} from "./helpers";
import {
  blocksOfType,
  firstBlockOfType,
  getJsonLdBlocks,
} from "./json-ld-helpers";
import { guides } from "@/data/guides";
import { siteName, siteUrl } from "@/lib/site";

test.describe("Home WebSite JSON-LD", () => {
  test("/", async ({ page }) => {
    await blockLivePriceApis(page);
    await page.goto("/");
    const blocks = await getJsonLdBlocks(page);
    const website = firstBlockOfType(blocks, "WebSite");

    expect(website, "Home must include WebSite JSON-LD").toBeTruthy();
    expect(website!.name).toBe(siteName);
    expect(website!.url).toBe(siteUrl);
    expect(String(website!.description ?? "")).not.toBe("");
    expect(website!.inLanguage).toBe("en-US");
  });
});

test.describe("Guides list ItemList JSON-LD", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("/guides ItemList matches published guides", async ({ page }) => {
    await page.goto("/guides");
    const blocks = await getJsonLdBlocks(page);
    const list = firstBlockOfType(blocks, "ItemList");

    expect(list, "/guides must include ItemList JSON-LD").toBeTruthy();
    expect(list!.numberOfItems).toBe(guides.length);

    const elements = list!.itemListElement as Array<Record<string, unknown>>;
    expect(Array.isArray(elements)).toBe(true);
    expect(elements.length).toBe(guides.length);

    for (const item of elements) {
      expect(item["@type"]).toBe("ListItem");
      expect(typeof item.position).toBe("number");
      expect(String(item.name ?? "")).not.toBe("");
      expect(String(item.url ?? "")).toMatch(/\/guides\/[a-z0-9-]+$/);
    }
  });

  for (const category of CATEGORIES) {
    test(`/guides?category=${category} ItemList matches category guides`, async ({
      page,
    }) => {
      await page.goto(`/guides?category=${category}`);
      const blocks = await getJsonLdBlocks(page);
      const list = firstBlockOfType(blocks, "ItemList");
      const expectedCount = CATEGORY_GUIDES[category].length;

      expect(list).toBeTruthy();
      expect(list!.numberOfItems).toBe(expectedCount);

      const elements = list!.itemListElement as Array<Record<string, unknown>>;
      const urls = elements.map((item) => String(item.url ?? ""));
      for (const slug of CATEGORY_GUIDES[category]) {
        expect(urls.some((url) => url.endsWith(`/guides/${slug}`))).toBe(true);
      }
    });
  }

  test("/guides?difficulty=beginner has no ItemList JSON-LD", async ({
    page,
  }) => {
    await page.goto("/guides?difficulty=beginner");
    const blocks = await getJsonLdBlocks(page);
    expect(blocksOfType(blocks, "ItemList")).toHaveLength(0);
  });
});

test.describe("Guide detail Article JSON-LD", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`/guides/${slug} Article and BreadcrumbList`, async ({ page }) => {
      const guide = guides.find((g) => g.slug === slug);
      expect(guide).toBeTruthy();

      await page.goto(`/guides/${slug}`);
      const blocks = await getJsonLdBlocks(page);

      const article = firstBlockOfType(blocks, "Article");
      expect(article, `${slug} must include Article JSON-LD`).toBeTruthy();
      expect(article!.headline).toBe(guide!.title);
      expect(String(article!.description ?? "")).not.toBe("");
      expect(String(article!.url ?? "")).toContain(`/guides/${slug}`);
      expect(article!.mainEntityOfPage).toBe(article!.url);
      expect(String(article!.datePublished ?? "")).not.toBe("");
      expect(String(article!.dateModified ?? "")).not.toBe("");

      const author = article!.author as Record<string, unknown>;
      expect(author["@type"]).toBe("Organization");
      expect(author.name).toBe(siteName);

      const breadcrumb = firstBlockOfType(blocks, "BreadcrumbList");
      expect(breadcrumb).toBeTruthy();
      const crumbs = breadcrumb!.itemListElement as Array<Record<string, unknown>>;
      expect(crumbs.length).toBeGreaterThanOrEqual(3);
      expect(String(crumbs[crumbs.length - 1].name ?? "")).toBeTruthy();
    });
  }
});
