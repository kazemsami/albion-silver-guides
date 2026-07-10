/**
 * Navigation, global controls, and persisted preferences.
 */
import { test, expect } from "@playwright/test";
import {
  CATEGORIES,
  blockLivePriceApis,
} from "./helpers";
import { categoryLabels } from "@/types/guide";
import { PREMIUM_SELLER_STORAGE_KEY } from "@/lib/listing-tax";
import { paypalDonateUrl } from "@/lib/site";

test.describe("Desktop header navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("Guides dropdown category links land on filtered pages", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "All Guides" }).hover();

    for (const category of CATEGORIES) {
      const link = nav.getByRole("menuitem", {
        name: categoryLabels[category],
      });
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(
        new RegExp(`/guides\\?category=${category}$`),
      );
      await page.goto("/");
      await nav.getByRole("link", { name: "All Guides" }).hover();
    }
  });

  test("Feedback opens dialog and Buy me a coffee links to PayPal", async ({ page }) => {
    await page.goto("/guides");
    await page.getByRole("button", { name: "Feedback" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const coffeeLink = page.getByRole("link", { name: "Buy me a coffee" }).first();
    await expect(coffeeLink).toHaveAttribute("href", paypalDonateUrl);
  });

  test("Theme toggle switches without error", async ({ page }) => {
    await page.goto("/guides");
    const toggle = page.getByRole("button", {
      name: /Switch to (light|dark) theme/i,
    });
    await toggle.click();
    await expect(toggle).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("mobile menu exposes guide category links", async ({ page }) => {
    await page.goto("/guides");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();

    for (const category of CATEGORIES) {
      await expect(
        menu.getByRole("link", { name: categoryLabels[category] }),
      ).toBeVisible();
    }
  });
});

test.describe("Persisted market preferences", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("Premium, live prices, city, and server persist after reload", async ({
    page,
  }) => {
    await page.goto("/guides");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    const header = page.locator("header");

    await header.getByLabel("Premium account").check();
    await header.getByLabel("Use live market prices").check();
    await header.getByLabel("Market city for prices").selectOption("Caerleon");
    await header.getByLabel("Albion server region for prices").selectOption(
      "europe",
    );

    await expect(async () => {
      expect(
        await page.evaluate((key) => localStorage.getItem(key), PREMIUM_SELLER_STORAGE_KEY),
      ).toBe("true");
    }).toPass();

    await page.reload();

    await expect(header.getByLabel("Premium account")).toBeChecked({
      timeout: 10_000,
    });
    await expect(header.getByLabel("Use live market prices")).toBeChecked();
    await expect(header.getByLabel("Market city for prices")).toHaveValue(
      "Caerleon",
    );
    await expect(header.getByLabel("Albion server region for prices")).toHaveValue(
      "europe",
    );
  });
});
