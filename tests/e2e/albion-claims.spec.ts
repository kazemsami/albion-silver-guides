/**
 * Albion-specific factual claim tests.
 * These tests guard against misleading or incorrect Albion Online game
 * mechanics claims. They test game-knowledge correctness, not just formatting.
 */
import { test, expect } from "@playwright/test";
import { blockLivePriceApis, getPageText } from "./helpers";

test.describe("Solo Dungeon Maps - Instance privacy claims", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  test("does not claim maps guarantee a private instance", async ({ page }) => {
    await page.goto("/guides/dungeon-maps-solo");
    const text = await getPageText(page);

    // These would be flat-out wrong: maps open a hidden entrance but others can enter
    expect(
      text,
      'Must not claim "Maps guarantee a private instance"',
    ).not.toMatch(/maps?\s+guarantee\s+a?\s*private\s+instance/i);

    expect(
      text,
      'Must not claim "no other player can take your chest"',
    ).not.toMatch(/no other player can take your chest/i);

    // "private dungeon entrance" without any qualification is misleading
    // Allow it only if it is followed by a qualifier
    const privEntranceMatch = text.match(/private\s+dungeon\s+entrance/i);
    if (privEntranceMatch) {
      const context = text.substring(
        Math.max(0, text.indexOf(privEntranceMatch[0]) - 100),
        text.indexOf(privEntranceMatch[0]) + 300,
      );
      const isQualified =
        /may still enter|can enter|other players|not guaranteed|hidden entrance|first access/i.test(
          context,
        );
      expect(
        isQualified,
        `"private dungeon entrance" appears without qualification. Context: "${context}"`,
      ).toBe(true);
    }
  });

  test("solo dungeon maps page mentions that other players may enter", async ({
    page,
  }) => {
    await page.goto("/guides/dungeon-maps-solo");
    const text = await getPageText(page);

    // The guide should acknowledge that the entrance is hidden but not exclusive
    // We do a soft check: if the page talks about privacy at all, it should
    // also mention the caveat.
    const talkAboutPrivacy =
      /private|hidden entrance|solo instance|exclusive/i.test(text);
    if (talkAboutPrivacy) {
      const talkAboutCaveat =
        /other players|can still enter|may enter|entrance appears|not guaranteed|not exclusive/i.test(
          text,
        );
      expect(
        talkAboutCaveat,
        "If guide discusses map privacy, it must mention the caveat that others may enter",
      ).toBe(true);
    }
  });
});

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
