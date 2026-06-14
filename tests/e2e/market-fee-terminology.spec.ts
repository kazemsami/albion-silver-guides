/**
 * Market fee terminology and constants tests.
 * Ensures guides use clear, consistent terminology for Albion marketplace costs
 * and that constants are properly centralized.
 */
import { test, expect } from "@playwright/test";
import { GUIDE_SLUGS, blockLivePriceApis, getPageText } from "./helpers";
import {
  STANDARD_MARKET_FEE_RATE,
  PREMIUM_MARKET_FEE_RATE,
  SETUP_FEE_RATE,
  STANDARD_TRANSACTION_TAX_RATE,
  PREMIUM_TRANSACTION_TAX_RATE,
} from "@/lib/listing-tax";

test.describe("Market fee terminology consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug} - avoids misleading standalone "listing tax" terminology`, async ({
      page,
    }) => {
      await page.goto(`/guides/${slug}`);
      const text = await getPageText(page);

      // Check for problematic standalone phrases that don't explain components
      const hasListingTax = /listing tax|listing fee/i.test(text);

      if (hasListingTax) {
        // If "listing tax" appears, check that it's clarified with proper context
        // about setup fee + transaction tax, OR the page uses better terminology
        const hasGoodContext =
          /setup fee.*transaction tax|transaction tax.*setup fee|market fee|sell-order fee/i.test(
            text,
          );

        if (!hasGoodContext) {
          // Allow legacy "listing tax" only if immediately followed by breakdown like "(10.5%)"
          // and the page explains it elsewhere
          const hasPercentageBreakdown = /listing tax.*\(.*10\.5%.*\)|listing tax.*\(.*6\.5%.*\)/i.test(
            text,
          );
          expect(
            hasPercentageBreakdown,
            `Guide uses "listing tax" terminology without clear context. ` +
              `Prefer "market fee", "sell-order fee", or explicitly mention "setup fee + transaction tax".`,
          ).toBe(true);
        }
      }
    });
  }

  test("guides prefer clear market fee terminology", async ({ page }) => {
    // Check that at least some guides use the preferred terminology
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
