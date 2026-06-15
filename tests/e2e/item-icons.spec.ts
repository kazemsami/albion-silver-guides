/**
 * Item icon E2E tests (rendered DOM only).
 * CDN availability checks live in item-icons-external.spec.ts (optional).
 */
import { test, expect } from "@playwright/test";
import {
  iconSrcMatchesItemId,
  parseItemIdFromIconSrc,
} from "./item-icon-helpers";
import { GUIDE_SLUGS, blockLivePriceApis } from "./helpers";

test.describe("Guide page item icons", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`/guides/${slug} shows item icons that match their item IDs`, async ({
      page,
    }) => {
      await page.goto(`/guides/${slug}`);
      await page.waitForSelector("main", { timeout: 15_000 });

      const iconHosts = page.locator("[data-item-id]");
      await expect
        .poll(async () => iconHosts.count(), {
          message: `Expected item icons on /guides/${slug}`,
          timeout: 15_000,
        })
        .toBeGreaterThan(0);

      const count = await iconHosts.count();
      const mismatches: string[] = [];
      const broken: string[] = [];

      for (let i = 0; i < count; i++) {
        const icon = iconHosts.nth(i);
        const itemId = await icon.getAttribute("data-item-id");
        if (!itemId) continue;

        const img = icon.locator("img");
        const imgCount = await img.count();
        if (imgCount === 0) {
          broken.push(`${itemId}: icon fell back to placeholder (no img)`);
          continue;
        }

        await img.scrollIntoViewIfNeeded();

        const src = await img.getAttribute("src");
        if (!src) {
          broken.push(`${itemId}: missing img src`);
          continue;
        }

        if (!iconSrcMatchesItemId(src, itemId)) {
          mismatches.push(
            `${itemId}: img src resolves to "${parseItemIdFromIconSrc(src)}"`,
          );
          continue;
        }

        await expect(async () => {
          const naturalWidth = await img.evaluate(
            (el: HTMLImageElement) => el.naturalWidth,
          );
          expect(naturalWidth).toBeGreaterThan(0);
        }).toPass({ timeout: 15_000 });
      }

      expect(
        mismatches,
        `Item icon URL/id mismatches on ${slug}:\n${mismatches.join("\n")}`,
      ).toEqual([]);

      expect(
        broken,
        `Broken item icons on ${slug}:\n${broken.join("\n")}`,
      ).toEqual([]);
    });
  }
});

test.describe("Economics table item icons", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`/guides/${slug} economics rows use icons tied to the listed item name`, async ({
      page,
    }) => {
      await page.goto(`/guides/${slug}`);
      await page.waitForSelector("table tbody tr", { timeout: 15_000 }).catch(
        () => null,
      );

      const rows = page.locator("table tbody tr");
      const rowCount = await rows.count();
      if (rowCount === 0) return;

      const issues: string[] = [];

      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const icon = row.locator("[data-item-id]").first();
        if ((await icon.count()) === 0) continue;

        const itemId = await icon.getAttribute("data-item-id");
        const nameCell = row.locator("td").first();
        const itemName = ((await nameCell.textContent()) ?? "").trim();
        const img = icon.locator("img");
        const src = await img.getAttribute("src");

        if (!itemId || !src) {
          issues.push(`Row "${itemName}": missing item id or icon src`);
          continue;
        }

        if (!iconSrcMatchesItemId(src, itemId)) {
          issues.push(
            `Row "${itemName}": expected icon for ${itemId}, got ${parseItemIdFromIconSrc(src)}`,
          );
        }
      }

      expect(
        issues,
        `Economics table icon issues on ${slug}:\n${issues.join("\n")}`,
      ).toEqual([]);
    });
  }
});
