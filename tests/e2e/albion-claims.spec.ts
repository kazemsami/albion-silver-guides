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
});

test.describe("Corrupted Dungeons - Tax assumption consistency", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("does not statically mix Standard and Premium tax assumptions without labelling", async ({
    page,
  }) => {
    await page.goto("/guides/corrupted-dungeons-pvpve");
    const text = await getPageText(page);

    // If the page mentions both Standard and Premium tax, they must be
    // clearly distinguished (not mixed in the same profit calculation).
    const mentionsStandard = /standard\s+tax|standard\s+player|non-premium/i.test(text);
    const mentionsPremium = /premium\s+tax|with\s+premium|premium\s+tog/i.test(text);

    if (mentionsStandard && mentionsPremium) {
      // Both are mentioned: they must be in separate labeled sections or
      // the premium toggle must be mentioned as controlling the assumption.
      const isClearlyLabeled =
        /premium\s+toggle|toggle\s+controls|switch\s+between|premium\s+vs|vs.*premium|standard.*separately|different\s+tax/i.test(
          text,
        );
      expect(
        isClearlyLabeled,
        "Corrupted Dungeons mentions both Standard and Premium taxes. " +
          "They must be clearly separated (e.g. via Premium toggle, not mixed in one calculation).",
      ).toBe(true);
    }
  });

  test("corrupted dungeons page mentions tax", async ({ page }) => {
    await page.goto("/guides/corrupted-dungeons-pvpve");
    const text = await getPageText(page);
    // Tax should be mentioned since it significantly affects profit
    expect(text, "Corrupted Dungeons guide must mention tax").toMatch(
      /tax|listing fee|market fee/i,
    );
  });
});
