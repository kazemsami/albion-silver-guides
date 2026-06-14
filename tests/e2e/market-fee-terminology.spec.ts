/**
 * Market fee terminology and constants tests.
 * Ensures visible copy uses setup fee + transaction tax breakdowns,
 * never bare combined totals like 10.5% or 6.5%.
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  blockLivePriceApis,
  getPageText,
  assertNoBareMarketFeeTotals,
} from "./helpers";
import {
  STANDARD_MARKET_FEE_RATE,
  PREMIUM_MARKET_FEE_RATE,
  SETUP_FEE_RATE,
  STANDARD_TRANSACTION_TAX_RATE,
  PREMIUM_TRANSACTION_TAX_RATE,
} from "@/lib/listing-tax";

const ALL_ROUTES = [
  "/",
  "/guides",
  ...CATEGORIES.map((c) => `/guides?category=${c}`),
  ...GUIDE_SLUGS.map((s) => `/guides/${s}`),
];

test.describe("Market fee terminology consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const route of ALL_ROUTES) {
    test(`${route} - no bare 10.5% or 6.5% market fee totals`, async ({
      page,
    }) => {
      await page.goto(route);
      await page
        .waitForSelector("main, article, [role='main']", { timeout: 10_000 })
        .catch(() => null);

      const text = await getPageText(page);
      assertNoBareMarketFeeTotals(text);
    });
  }

  for (const slug of GUIDE_SLUGS) {
    test(`${slug} - avoids misleading standalone "listing tax" terminology`, async ({
      page,
    }) => {
      await page.goto(`/guides/${slug}`);
      const text = await getPageText(page);

      const hasListingTax = /listing tax|listing fee/i.test(text);

      if (hasListingTax) {
        const hasGoodContext =
          /setup fee.*transaction tax|transaction tax.*setup fee|market fee|sell-order fee/i.test(
            text,
          );

        expect(
          hasGoodContext,
          `Guide uses "listing tax" terminology without clear context. ` +
            `Prefer "market fee", "sell-order fee", or explicitly mention "setup fee + transaction tax".`,
        ).toBe(true);
      }
    });
  }

  test("guides prefer clear market fee terminology", async ({ page }) => {
    let guidesWithGoodTerminology = 0;

    for (const slug of GUIDE_SLUGS) {
      await page.goto(`/guides/${slug}`);
      const text = await getPageText(page);

      const usesGoodTerminology =
        /market fee|sell-order fee|setup fee|transaction tax/i.test(text);

      if (usesGoodTerminology) {
        guidesWithGoodTerminology++;
      }
    }

    expect(
      guidesWithGoodTerminology,
      "At least some guides should use clear market fee terminology",
    ).toBeGreaterThan(0);
  });
});

test.describe("Centralized market fee constants", () => {
  test("Standard market fee rate equals setup fee plus Standard transaction tax", () => {
    expect(STANDARD_MARKET_FEE_RATE).toBeCloseTo(
      SETUP_FEE_RATE + STANDARD_TRANSACTION_TAX_RATE,
      5,
    );
    expect(STANDARD_MARKET_FEE_RATE).toBeCloseTo(0.105, 5);
  });

  test("Premium market fee rate equals setup fee plus Premium transaction tax", () => {
    expect(PREMIUM_MARKET_FEE_RATE).toBeCloseTo(
      SETUP_FEE_RATE + PREMIUM_TRANSACTION_TAX_RATE,
      5,
    );
    expect(PREMIUM_MARKET_FEE_RATE).toBeCloseTo(0.065, 5);
  });

  test("component rates match expected Albion Online values", () => {
    expect(SETUP_FEE_RATE).toBeCloseTo(0.025, 5); // 2.5%
    expect(STANDARD_TRANSACTION_TAX_RATE).toBeCloseTo(0.08, 5); // 8%
    expect(PREMIUM_TRANSACTION_TAX_RATE).toBeCloseTo(0.04, 5); // 4%
  });

  test("Standard total is 10.5% and Premium total is 6.5%", () => {
    // Standard: 2.5% + 8% = 10.5%
    expect(STANDARD_MARKET_FEE_RATE).toBeCloseTo(0.105, 5);

    // Premium: 2.5% + 4% = 6.5%
    expect(PREMIUM_MARKET_FEE_RATE).toBeCloseTo(0.065, 5);
  });
});
