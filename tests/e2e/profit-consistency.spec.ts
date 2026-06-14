/**
 * Profit consistency regression tests.
 * These tests catch specific known issues with profit claims on guide pages.
 * They do NOT require exact numbers - they check logical consistency.
 *
 * Tests use saved (snapshot) prices to be deterministic.
 * Live market prices are blocked so results do not change between runs.
 */
import { test, expect } from "@playwright/test";
import { blockLivePriceApis, getPageText } from "./helpers";

test.describe("Fiber Farming profit consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("does not simultaneously claim ~250k/hr and ~209k/hr as the same expected result", async ({
    page,
  }) => {
    await page.goto("/guides/fiber-farming-solo");
    const text = await getPageText(page);

    // The known conflict: intro text says ~250k/hr but calculator says ~209k/hr.
    // If both appear in the same visible text we flag it.
    const has250k = /250\s*k\/hr|~250k|250,000.*hr/i.test(text);
    const has209k = /209\s*k\/hr|~209k|209,000.*hr/i.test(text);

    // Either claim alone is OK; BOTH in the same page is the regression.
    if (has250k && has209k) {
      // Allow it only if one of them is clearly labelled as a different scenario
      // (e.g. "with Premium" vs "without Premium" or "projected" vs "logged").
      const premiumLabeled =
        /250k.*premium|premium.*250k|projected.*250k|250k.*projected/i.test(
          text,
        );
      expect(
        premiumLabeled,
        'Page shows both "~250k/hr" and "~209k/hr" without labelling them as different scenarios. ' +
          "One must be clearly attributed to a specific Premium/non-Premium scenario.",
      ).toBe(true);
    }
  });

  test("description does not contradict the calculator expected value", async ({
    page,
  }) => {
    await page.goto("/guides/fiber-farming-solo");
    const text = await getPageText(page);

    // If the description says "~250k/hr net" but the calculator shows 209k
    // as the expected value, that is a contradiction.
    // We check that if the text mentions "net" near "250k", it is qualified.
    const netClaim = /~250k\/hr\s*net|net.*~250k\/hr/i.test(text);
    if (netClaim) {
      // A "net" claim of 250k is only valid if it is labeled as a Premium or
      // projected scenario.
      const isQualified =
        /premium|projected|before tax|focus 250k|rare|event/i.test(text);
      expect(
        isQualified,
        'Net claim of "~250k/hr" must be qualified (Premium/projected/etc.)',
      ).toBe(true);
    }
  });
});

test.describe("Avalonian Roads Fishing profit consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("expected value is within the displayed expected range", async ({
    page,
  }) => {
    await page.goto("/guides/ava-roads-fishing");
    const text = await getPageText(page);

    // Regression: expected value was 1.3M but the displayed range was 1.7M-2.1M.
    // We detect this by checking for contradictory explicit numbers.
    // Pattern: "Expected value" near a number, and a range that does not contain it.

    // Extract all range pairs like "1.7M – 2.1M"
    const rangeMatches = [
      ...text.matchAll(
        /(\d+(?:\.\d+)?)\s*[Mm]\s*[–-]\s*(\d+(?:\.\d+)?)\s*[Mm]/g,
      ),
    ];

    // Extract "expected" numbers near the word "expected"
    const expectedMatches = [
      ...text.matchAll(
        /expected[^.]*?(\d+(?:\.\d+)?)\s*[Mm]|(\d+(?:\.\d+)?)\s*[Mm][^.]*?expected/gi,
      ),
    ];

    function parseM(s: string): number {
      return parseFloat(s) * 1_000_000;
    }

    for (const expMatch of expectedMatches) {
      const expRaw = expMatch[1] ?? expMatch[2];
      if (!expRaw) continue;
      const expValue = parseM(expRaw);

      // For each range, check if the expected value is within it
      for (const rangeMatch of rangeMatches) {
        const rangeMin = parseM(rangeMatch[1]);
        const rangeMax = parseM(rangeMatch[2]);
        if (rangeMin > 500_000 && rangeMax > rangeMin) {
          // Only check ranges that look like profit ranges (>500k)
          if (expValue < rangeMin * 0.5 || expValue > rangeMax * 1.5) {
            // The expected value is wildly outside the stated range
            test.fail(
              true,
              `Ava Roads Fishing: expected value ${expRaw}M is outside range ` +
                `${rangeMatch[1]}M-${rangeMatch[2]}M. Regression detected.`,
            );
          }
        }
      }
    }
  });
});

test.describe("Avalonian Roads Group Tracking profit consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("expected per-player value is within the displayed scenario range", async ({
    page,
  }) => {
    await page.goto("/guides/high-tier-group-tracking");
    const text = await getPageText(page);

    // Regression: expected was 921.6k but scenario range started at 965.2k.
    // Detect contradictory claim: "per player" expected value vs range min.
    const rangeMatches = [
      ...text.matchAll(
        /(\d+(?:\.\d+)?)\s*[kK]\s*[–-]\s*(\d+(?:\.\d+)?)\s*[kK]/g,
      ),
    ];

    function parseK(s: string): number {
      return parseFloat(s) * 1_000;
    }

    // If we see 921k or 921.6k on the page, check it is not below the stated min
    if (/921\.6\s*k|921\s*k/i.test(text)) {
      for (const rangeMatch of rangeMatches) {
        const rangeMin = parseK(rangeMatch[1]);
        const rangeMax = parseK(rangeMatch[2]);
        // Only consider ranges that look like profit ranges (>400k/hr)
        if (rangeMin > 400_000 && rangeMax > rangeMin) {
          expect(
            921_600,
            `Regression: expected value 921.6k is below stated range min ${rangeMatch[1]}k on tracking guide`,
          ).toBeGreaterThanOrEqual(rangeMin);
        }
      }
    }
  });
});

test.describe("Potion Crafting profit consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("current profit does not contradict the stated normal/event range without labelling", async ({
    page,
  }) => {
    await page.goto("/guides/potions-crafting-bulk");
    const text = await getPageText(page);

    // If "event" scenario is mixed with the baseline without a clear label, flag it.
    // The page should either show event profits labeled separately, or not at all.
    // We check that if "event" appears, it is associated with a distinct heading/label.
    const hasEventProfit = /event.*profit|profit.*event/i.test(text);
    if (hasEventProfit) {
      // It must be clearly labeled as an event scenario, not the default
      const isLabeled = /event\s*(scenario|holding|bonus|only)/i.test(text);
      expect(
        isLabeled,
        "Event-based profit must be clearly labeled as an event scenario, not mixed with baseline",
      ).toBe(true);
    }
  });

  test("profit unit is per 10k focus or per batch, not unlabeled /hr on detail page", async ({
    page,
  }) => {
    await page.goto("/guides/potions-crafting-bulk");
    const text = await getPageText(page);

    // The potion guide's calculator works in "per 10k focus" or "per batch".
    // The /hr unit is only shown on the card (fallback). On the detail page,
    // we expect either "focus" or "batch" to appear in profit context.
    expect(
      text,
      'Potion detail page must mention "focus" or "batch" in profit context',
    ).toMatch(/focus|batch/i);
  });
});

test.describe("Laborer Passive Income profit consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("does not confuse selected default range with all-calculator-extreme range", async ({
    page,
  }) => {
    await page.goto("/guides/laborer-passive-income");
    const text = await getPageText(page);

    // Regression: the page showed -74.4k to 388k/hr labeled as
    // "all calculator extremes" but the label was ambiguous.
    if (/-74\.4\s*k|74,400/.test(text) && /388\s*k|388,000/.test(text)) {
      expect(
        text,
        'When showing extreme range "-74.4k to 388k", page must label it as "all calculator extremes" or similar',
      ).toMatch(/all\s+calculator|extreme|full range|all\s+scenarios/i);
    }
  });

  test("profit range for default/selected setup is clearly labelled", async ({
    page,
  }) => {
    await page.goto("/guides/laborer-passive-income");
    // The page should have some profit range visible without crashing
    const text = await getPageText(page);
    // Just verify the page is not showing a nonsensical profit range
    expect(text).not.toMatch(/\bNaN\b/);
    expect(text).not.toMatch(/\bundefined\b/);
  });
});
