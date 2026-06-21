/**
 * Calculator interaction tests.
 * Verifies global toggles and in-page calculator controls update profit output.
 * Live Albion API calls are mocked so results stay deterministic.
 */
import { test, expect } from "@playwright/test";
import { blockLivePriceApis, GUIDE_SLUGS } from "./helpers";

const STANDARD_FEE_LABEL =
  /Standard sell-order fees \(2\.5% setup fee \+ 8% transaction tax\)/;
const PREMIUM_FEE_LABEL =
  /Premium sell-order fees \(2\.5% setup fee \+ 4% transaction tax\)/;

async function heroTakeHomeText(
  page: import("@playwright/test").Page,
): Promise<string> {
  const hero = page.locator(".profit-hero-panel").first();
  await expect(hero).toBeVisible();
  return ((await hero.locator("p.text-3xl").first().textContent()) ?? "").trim();
}

test.describe("Premium tax toggle", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug} switches Standard and Premium sell-order fee labels`, async ({
      page,
    }) => {
      await page.goto(`/guides/${slug}`);
      await page.waitForSelector(".profit-hero-panel", { timeout: 15_000 });

      const premium = page.getByLabel("Premium account");
      await premium.setChecked(false);
      await expect(page.locator("main")).toContainText(STANDARD_FEE_LABEL);

      const standardProfit = await heroTakeHomeText(page);
      await premium.setChecked(true);
      await expect(page.locator("main")).toContainText(PREMIUM_FEE_LABEL);

      const premiumProfit = await heroTakeHomeText(page);
      expect(premiumProfit, "Premium toggle should change take-home").not.toBe(
        standardProfit,
      );
    });
  }
});

test.describe("Skill tier picker", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("fiber farming skill tier changes hero take-home", async ({ page }) => {
    await page.goto("/guides/fiber-farming-solo");
    await page.waitForSelector('[aria-label="Skill level"]', {
      timeout: 15_000,
    });

    const group = page.getByRole("radiogroup", { name: "Skill level" });
    const tiers = group.getByRole("radio");
    const tierCount = await tiers.count();
    expect(tierCount).toBeGreaterThan(1);

    const firstProfit = await heroTakeHomeText(page);
    await tiers.nth(tierCount - 1).click();
    await expect(async () => {
      const nextProfit = await heroTakeHomeText(page);
      expect(nextProfit).not.toBe(firstProfit);
    }).toPass({ timeout: 10_000 });
  });
});

test.describe("Laborer specialty picker", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("laborer specialty changes hero take-home", async ({ page }) => {
    await page.goto("/guides/laborer-passive-income");
    await page.waitForSelector('[aria-label="Laborer specialty"]', {
      timeout: 15_000,
    });

    const group = page.getByRole("radiogroup", { name: "Laborer specialty" });
    const options = group.getByRole("radio");
    expect(await options.count()).toBeGreaterThan(1);

    const baseline = await heroTakeHomeText(page);
    await options.nth(1).click();
    await expect(async () => {
      expect(await heroTakeHomeText(page)).not.toBe(baseline);
    }).toPass({ timeout: 10_000 });
  });
});

test.describe("Potion sell strategy", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("event holding strategy changes profit per 10k focus", async ({ page }) => {
    await page.goto("/guides/potions-crafting-bulk");
    await page.waitForSelector(".profit-hero-panel", { timeout: 15_000 });

    const normal = await heroTakeHomeText(page);
    await page.getByRole("radio", { name: /Hold for events/i }).click();
    await expect(async () => {
      const eventProfit = await heroTakeHomeText(page);
      expect(eventProfit).not.toBe(normal);
    }).toPass({ timeout: 10_000 });

    await expect(page.locator("main")).toContainText(/Hold for events/i);
  });
});

test.describe("Live prices toggle (mocked API)", () => {
  test("enabling live prices unlocks market controls and keeps calculator numeric", async ({
    page,
  }) => {
    await page.route(/albion-online-data\.com\/api\/v2\/stats\/prices\//, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.goto("/guides/fiber-farming-solo");
    await page.waitForSelector(".profit-hero-panel", { timeout: 15_000 });

    const citySelect = page.getByLabel("Market city for prices");
    const serverSelect = page.getByLabel("Albion server region for prices");
    await expect(citySelect).toBeDisabled();
    await expect(serverSelect).toBeDisabled();

    await page.getByLabel("Use live market prices").check();
    await expect(citySelect).toBeEnabled();
    await expect(serverSelect).toBeEnabled();

    const profit = await heroTakeHomeText(page);
    expect(profit).toMatch(/\d/);
    expect(profit.toLowerCase()).not.toContain("nan");
  });
});
