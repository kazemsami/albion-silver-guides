/**
 * Albion-specific factual claim tests.
 * These tests guard against misleading or incorrect Albion Online game
 * mechanics claims. They test game-knowledge correctness, not just formatting.
 */
import { test, expect } from "@playwright/test";
import { blockLivePriceApis, getPageText } from "./helpers";

test.describe("Laborer Passive Income - Laborer type accuracy", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("does not claim all laborers return unrefined T7 resources", async ({
    page,
  }) => {
    await page.goto("/guides/laborer-passive-income");
    const text = await getPageText(page);

    // This would be wrong: crafting laborers return refined materials,
    // mercenaries return silver, trophy laborers return trophies.
    expect(
      text,
      'Must not claim "all laborers return unrefined T7 resources"',
    ).not.toMatch(/all\s+laborers?\s+return\s+unrefined/i);

    expect(
      text,
      'Must not claim "each laborer returns unrefined T7"',
    ).not.toMatch(/each\s+laborer\s+returns?\s+unrefined/i);
  });

  test("distinguishes gathering laborers from crafting laborers", async ({
    page,
  }) => {
    await page.goto("/guides/laborer-passive-income");
    const text = await getPageText(page);

    // The guide covers laborers - if it discusses returns, it should distinguish types.
    const talksAboutReturns =
      /return|yield|produce|brings back|gives/i.test(text) &&
      /laborer|worker/i.test(text);

    if (talksAboutReturns) {
      // Must distinguish between gathering and crafting (or refined vs raw)
      const distinguishes =
        /gathering laborer|crafting laborer|refined.*raw|raw.*refined|mercenary|trophy/i.test(
          text,
        );
      expect(
        distinguishes,
        "Guide discusses laborer returns but does not distinguish gathering vs crafting vs mercenary laborers",
      ).toBe(true);
    }
  });

  test("mentions opportunity cost when discussing self-filled journals", async ({
    page,
  }) => {
    await page.goto("/guides/laborer-passive-income");
    const text = await getPageText(page);

    // If the page recommends filling journals yourself, it should mention opportunity cost
    const recommendsSelfFilling = /filling?\s+journals?\s+yourself|self-fill/i.test(text);

    if (recommendsSelfFilling) {
      const mentionsOpportunityCost =
        /opportunity cost|sell value|selling full journals|compare.*profit|market value.*journal/i.test(
          text,
        );
      expect(
        mentionsOpportunityCost,
        "When recommending self-filling journals, guide must mention opportunity cost or sell value comparison",
      ).toBe(true);
    }
  });
});

test.describe("Corrupted Dungeons - Tax assumption consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("does not claim calculator uses only Premium tax as default", async ({
    page,
  }) => {
    await page.goto("/guides/corrupted-dungeons-pvpve");
    const text = await getPageText(page);

    // Calculator should mention the Premium toggle, not claim one tax as "already subtracted"
    // without conditioning it on toggle state.
    const claimsPremiumDefault = /calculator.*already.*premium|calculator.*subtracts.*6\.5%.*without/i.test(text);
    expect(
      claimsPremiumDefault,
      "Page must not claim calculator uses Premium tax by default without mentioning the toggle",
    ).toBe(false);
  });

  test("premium tax mention includes conditional language", async ({
    page,
  }) => {
    await page.goto("/guides/corrupted-dungeons-pvpve");
    const text = await getPageText(page);

    if (/4% transaction tax.*premium|premium.*4% transaction tax/i.test(text)) {
      const hasPremiumContext =
        /premium.*toggle|with premium|premium.*enabled|standard.*premium/i.test(
          text,
        );
      expect(
        hasPremiumContext,
        "When Premium transaction tax is mentioned, page must include Premium toggle or conditional context",
      ).toBe(true);
    }
  });

  test("mentions both Standard and Premium market fees with clear distinction", async ({
    page,
  }) => {
    await page.goto("/guides/corrupted-dungeons-pvpve");
    const text = await getPageText(page);

    const mentionsStandard =
      /standard.*2\.5% setup fee \+ 8% transaction tax|2\.5% setup fee \+ 8% transaction tax.*standard/i.test(
        text,
      );
    const mentionsPremium =
      /premium.*2\.5% setup fee \+ 4% transaction tax|2\.5% setup fee \+ 4% transaction tax.*premium/i.test(
        text,
      );

    if (mentionsStandard && mentionsPremium) {
      const clearlyContrasted =
        /standard.*premium|premium.*standard|toggle|vs|or.*with premium/i.test(
          text,
        );
      expect(
        clearlyContrasted,
        "When both Standard and Premium rates are mentioned, they must be clearly contrasted",
      ).toBe(true);
    }
  });

  test("corrupted dungeons page mentions market fees", async ({ page }) => {
    await page.goto("/guides/corrupted-dungeons-pvpve");
    const text = await getPageText(page);
    // Market fees should be mentioned since they significantly affect profit
    expect(text, "Corrupted Dungeons guide must mention market fees").toMatch(
      /market fee|setup fee|transaction tax/i,
    );
  });
});
