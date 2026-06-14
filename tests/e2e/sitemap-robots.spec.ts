/**
 * Sitemap and robots.txt tests.
 * Verifies that crawlable URLs are correctly exposed and protected pages
 * are not accidentally blocked.
 */
import { test, expect } from "@playwright/test";
import { GUIDE_SLUGS, CATEGORIES } from "./helpers";

test.describe("robots.txt", () => {
  test("allows all paths", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const text = await page.locator("body").innerText().catch(async () => {
      // Some Next.js versions return robots.txt as raw text content
      return response?.text() ?? "";
    });
    const raw = await response?.text() ?? text;

    expect(raw, "robots.txt must allow /").toMatch(/Allow:\s+\//);
    expect(raw, "robots.txt must not disallow /").not.toMatch(
      /Disallow:\s+\/\s*$/m,
    );
    expect(raw, "robots.txt must not disallow /guides").not.toMatch(
      /Disallow:\s+\/guides/,
    );
    expect(raw, "robots.txt must point to sitemap").toMatch(
      /Sitemap:\s+https?:\/\//,
    );
  });
});

test.describe("sitemap.xml", () => {
  test("is accessible and valid XML", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const content = await response?.text() ?? "";
    expect(content, "sitemap.xml must be XML").toMatch(/<\?xml|<urlset/);
  });

  test("includes / (home)", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const content = await page.locator("body").innerText().catch(async () => {
      const res = await page.goto("/sitemap.xml");
      return res?.text() ?? "";
    });
    const raw = await (await page.goto("/sitemap.xml"))?.text() ?? "";
    expect(raw, "sitemap must include home URL").toMatch(/<loc>[^<]*\/<\/loc>/);
  });

  test("includes /guides", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    const raw = await response?.text() ?? "";
    expect(raw, "sitemap must include /guides").toMatch(/<loc>[^<]*\/guides<\/loc>/);
  });

  test("includes all category pages", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    const raw = await response?.text() ?? "";
    for (const category of CATEGORIES) {
      expect(
        raw,
        `sitemap must include /guides?category=${category}`,
      ).toMatch(new RegExp(`<loc>[^<]*\/guides\\?category=${category}<\/loc>`));
    }
  });

  test("includes all published guide detail pages", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    const raw = await response?.text() ?? "";
    for (const slug of GUIDE_SLUGS) {
      expect(
        raw,
        `sitemap must include /guides/${slug}`,
      ).toMatch(new RegExp(`<loc>[^<]*/guides/${slug}</loc>`));
    }
  });

  test("does not include noindex filter pages", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    const raw = await response?.text() ?? "";
    // Pages like /guides?difficulty=beginner should not be in the sitemap
    expect(raw, "sitemap must not include ?difficulty= pages").not.toMatch(
      /\/guides\?[^<]*difficulty=/,
    );
    expect(raw, "sitemap must not include ?zone= pages").not.toMatch(
      /\/guides\?[^<]*zone=/,
    );
  });
});
