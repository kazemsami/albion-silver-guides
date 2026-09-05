import { test, expect } from "@playwright/test";

async function heroTakeHomeText(page: import("@playwright/test").Page): Promise<string> {
  const hero = page.locator(".profit-hero-panel").first();
  await expect(hero).toBeVisible();
  return ((await hero.locator("p.text-3xl").first().textContent()) ?? "").trim();
}

test("resource refining city picker changes live profit", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/guides/resource-refining-focus");
  await page.waitForSelector(".profit-hero-panel", { timeout: 60_000 });
  await page.getByLabel("Use live market prices").check();
  const citySelect = page.getByLabel("Market city for prices");
  await expect(citySelect).toBeEnabled({ timeout: 10_000 });

  await citySelect.selectOption("Thetford");
  await page.waitForTimeout(500);
  const thetford = await heroTakeHomeText(page);

  await citySelect.selectOption("Bridgewatch");
  await page.waitForTimeout(500);
  const bridgewatch = await heroTakeHomeText(page);

  console.log({ thetford, bridgewatch });
  expect(thetford).not.toBe(bridgewatch);
});
