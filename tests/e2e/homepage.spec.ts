/**
 * Homepage invariants.
 */
import { test, expect } from "@playwright/test";
import { GUIDE_SLUGS, CATEGORIES, blockLivePriceApis } from "./helpers";
import { guides, getFeaturedGuides } from "@/data/guides";
import { categoryLabels } from "@/types/guide";

test.describe("Homepage content", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("guide count stat matches published guides", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const guidesLabel = page.getByText("Guides", { exact: true }).first();
    const countEl = guidesLabel.locator("xpath=preceding-sibling::p[1]");
    await expect(countEl).toHaveText(String(guides.length));
    expect(GUIDE_SLUGS.length).toBe(guides.length);
  });

  test("featured guides link to valid guide pages", async ({ page, request }) => {
    await page.goto("/");
    const featured = getFeaturedGuides();
    expect(featured.length).toBeGreaterThan(0);

    const links = page.locator('main a[href^="/guides/"]');
    const hrefs = await links.evaluateAll((anchors) =>
      anchors
        .map((a) => a.getAttribute("href") ?? "")
        .filter((h) => h.startsWith("/guides/") && h !== "/guides/"),
    );

    for (const guide of featured) {
      expect(hrefs).toContain(`/guides/${guide.slug}`);
    }

    for (const guide of featured) {
      const response = await request.get(`/guides/${guide.slug}`);
      expect(response.status()).toBe(200);
    }
  });

  test("category cards link to correct category filters", async ({ page }) => {
    await page.goto("/");
    const browseSection = page
      .getByRole("heading", { name: "Browse by Category" })
      .locator("xpath=following-sibling::div[1]");

    for (const category of CATEGORIES) {
      const card = browseSection.getByRole("link", {
        name: new RegExp(categoryLabels[category]),
      });
      await expect(card).toHaveAttribute(
        "href",
        `/guides?category=${category}`,
      );
    }
  });

  test("silver per hour range stat is sane", async ({ page }) => {
    await page.goto("/");
    const rangeLabel = page.getByText("Silver/hr Range", { exact: true });
    const statBox = rangeLabel.locator("xpath=..");
    const text = await statBox.innerText();

    expect(text.toLowerCase()).not.toContain("nan");
    expect(text.toLowerCase()).not.toContain("undefined");

    const rangeMatch = text.match(/([\d.]+[kKmM]?)\s*[–-]\s*([\d.]+[kKmM]?)/);
    if (rangeMatch) {
      const parse = (s: string) => {
        const n = parseFloat(s);
        if (/m/i.test(s)) return n * 1_000_000;
        if (/k/i.test(s)) return n * 1_000;
        return n;
      };
      expect(parse(rangeMatch[1])).toBeLessThanOrEqual(parse(rangeMatch[2]));
    }
  });

  test("skip link targets main content", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toHaveAttribute("href", "#main-content");
  });

  test("exactly one h1 on homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
});
