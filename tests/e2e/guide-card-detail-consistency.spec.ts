/**
 * Guide card vs guide detail consistency tests.
 * Cross-checks profit ranges and calculator display between list pages and detail pages.
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  CATEGORY_GUIDES,
  blockLivePriceApis,
} from "./helpers";
import {
  FEATURED_GUIDE_SLUGS,
  STANDARD_CALCULATOR_FEE_LABEL,
  ensurePremiumOff,
  extractCardProfitRange,
  extractDetailExpectedOutcome,
  extractDetailOutcomesRange,
  heroTakeHomeAmount,
  openGuideFromCard,
  readSnapshotRange,
  silverAsDisplayedOnCard,
  HERO_MATCHES_EXPECTED_SLUGS,
} from "./guide-profit-ui-helpers";

/** Guides reviewed against logged no-Premium runs; cards should still react to Premium toggle. */
const STANDARD_BASELINE_CARD_SLUGS = [
  "t4-ore-mining-yellow-zone",
  "fiber-farming-solo",
  "ava-roads-fishing",
] as const;

interface CardInfo {
  title: string;
  profitText: string;
  categoryText: string;
}

/** Extract guide card information from the current page for a given slug. */
async function extractCardInfo(
  page: import("@playwright/test").Page,
  slug: string,
): Promise<CardInfo | null> {
  const card = page.locator(`a[href="/guides/${slug}"]`).first();

  const exists = await card.count();
  if (!exists) return null;

  const titleEl = card.locator("h2, h3").first();
  const title = (await titleEl.textContent()) ?? "";

  const profitEl = card.locator("p.tabular-nums").first();
  const profitText = (await profitEl.textContent().catch(() => "")) ?? "";

  const categoryEl = card
    .locator(
      'span:has-text("Gathering"), span:has-text("Crafting"), span:has-text("Dungeon"), span:has-text("Fishing"), span:has-text("Laborer")',
    )
    .first();
  const categoryText = (await categoryEl.textContent().catch(() => "")) ?? "";

  return {
    title: title.trim(),
    profitText: profitText.trim(),
    categoryText: categoryText.trim(),
  };
}

test.describe("Guide cards always use computed profit ranges", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: /guides card never shows N/A profit`, async ({ page }) => {
      await page.goto("/guides");
      await ensurePremiumOff(page);

      const card = page.locator(`a[href="/guides/${slug}"]`).first();
      await expect(card).toBeVisible({ timeout: 15_000 });

      const profitText =
        (await card.locator("p.tabular-nums").first().textContent()) ?? "";
      expect(
        profitText,
        `Card for ${slug} must show computed profit, not N/A`,
      ).not.toMatch(/\bN\/A\b/);
      expect(profitText).toMatch(/(\/hr|\/10k focus)/);
    });
  }
});

test.describe("Logged baseline guide cards respond to Premium toggle", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of STANDARD_BASELINE_CARD_SLUGS) {
    test(`${slug}: /guides card profit range changes with Premium`, async ({
      page,
    }) => {
      await page.goto("/guides");

      const premium = page.getByLabel("Premium account");
      await premium.setChecked(false);

      const card = page.locator(`a[href="/guides/${slug}"]`).first();
      await expect(card).toBeVisible({ timeout: 15_000 });

      const standardRange = await extractCardProfitRange(card, slug);
      expect(standardRange).not.toBeNull();

      await premium.setChecked(true);
      const premiumRange = await extractCardProfitRange(card, slug);
      expect(premiumRange).not.toBeNull();

      const changed =
        premiumRange!.min !== standardRange!.min ||
        premiumRange!.max !== standardRange!.max;
      expect(
        changed,
        `Card for ${slug} should update when Premium is toggled`,
      ).toBe(true);
    });
  }
});

test.describe("Guide card profit range matches detail outcomes", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: /guides card matches detail outcomes table`, async ({
      page,
    }) => {
      const cardRange = await openGuideFromCard(page, "/guides", slug);
      const detailRange = await extractDetailOutcomesRange(page, slug);

      expect(
        detailRange,
        `Could not parse profit outcomes table on detail page for ${slug}`,
      ).not.toBeNull();

      expect(detailRange!.unit).toBe(cardRange.unit);
      expect(detailRange!.min).toBe(cardRange.min);
      expect(detailRange!.max).toBe(cardRange.max);
    });
  }
});

test.describe("Homepage featured card profit matches detail outcomes", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of FEATURED_GUIDE_SLUGS) {
    test(`${slug}: homepage card matches detail outcomes table`, async ({
      page,
    }) => {
      const cardRange = await openGuideFromCard(page, "/", slug);
      const detailRange = await extractDetailOutcomesRange(page, slug);

      expect(
        detailRange,
        `Could not parse profit outcomes table on detail page for ${slug}`,
      ).not.toBeNull();

      expect(detailRange!.unit).toBe(cardRange.unit);
      expect(detailRange!.min).toBe(cardRange.min);
      expect(detailRange!.max).toBe(cardRange.max);
    });
  }
});

test.describe("Guide card profit matches profit snapshot fixture", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: /guides card range matches profit-snapshots.json`, async ({
      page,
    }) => {
      const snapshotRange = readSnapshotRange(slug);
      expect(
        snapshotRange,
        `Missing snapshot range for ${slug}`,
      ).not.toBeNull();

      await page.goto("/guides");
      await ensurePremiumOff(page);

      const card = page.locator(`a[href="/guides/${slug}"]`).first();
      await expect(card).toBeVisible({ timeout: 15_000 });

      const cardRange = await extractCardProfitRange(card, slug);
      expect(cardRange).not.toBeNull();

      expect(
        cardRange!.min,
        `Card min vs snapshot for ${slug}`,
      ).toBe(silverAsDisplayedOnCard(snapshotRange!.min));
      expect(
        cardRange!.max,
        `Card max vs snapshot for ${slug}`,
      ).toBe(silverAsDisplayedOnCard(snapshotRange!.max));
    });
  }
});

test.describe("Hero take-home fits card profit range", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: default hero take-home is within card range`, async ({
      page,
    }) => {
      const cardRange = await openGuideFromCard(page, "/guides", slug);
      await page.waitForSelector(".profit-hero-panel", { timeout: 15_000 });

      const heroAmount = await heroTakeHomeAmount(page);
      expect(
        heroAmount,
        `Hero take-home missing on ${slug}`,
      ).not.toBeNull();

      expect(
        heroAmount!,
        `Hero ${heroAmount} below card min ${cardRange.min} on ${slug}`,
      ).toBeGreaterThanOrEqual(cardRange.min);
      expect(
        heroAmount!,
        `Hero ${heroAmount} above card max ${cardRange.max} on ${slug}`,
      ).toBeLessThanOrEqual(cardRange.max);
    });
  }
});

test.describe("Hero take-home matches expected outcome row", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of HERO_MATCHES_EXPECTED_SLUGS) {
    test(`${slug}: hero aligns with outcomes Expected value`, async ({
      page,
    }) => {
      await page.goto(`/guides/${slug}`);
      await ensurePremiumOff(page);
      await page.waitForSelector(".profit-hero-panel", { timeout: 15_000 });

      const heroAmount = await heroTakeHomeAmount(page);
      const expectedOutcome = await extractDetailExpectedOutcome(page);

      expect(heroAmount).not.toBeNull();
      expect(
        expectedOutcome,
        `Expected value row missing in outcomes table for ${slug}`,
      ).not.toBeNull();

      expect(
        heroAmount,
        `Hero take-home should match Expected value on ${slug}`,
      ).toBe(expectedOutcome);
    });
  }
});

test.describe("Guide detail calculator shows Standard sell-order fee breakdown", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: calculator breakdown uses setup fee + transaction tax`, async ({
      page,
    }) => {
      await page.goto(`/guides/${slug}`);
      await ensurePremiumOff(page);
      await page.waitForSelector(".profit-hero-panel", { timeout: 15_000 });

      await expect(page.locator("main")).toContainText(
        STANDARD_CALCULATOR_FEE_LABEL,
      );
    });
  }
});

test.describe("Guide card titles match detail page h1", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: card title matches detail h1`, async ({ page }) => {
      await page.goto("/guides");
      await page
        .waitForSelector(`a[href="/guides/${slug}"]`, {
          timeout: 10_000,
        })
        .catch(() => null);

      const cardInfo = await extractCardInfo(page, slug);
      if (!cardInfo || !cardInfo.title) {
        await page.goto(`/guides/${slug}`);
        const h1 = page.locator("h1").first();
        await expect(h1).toBeVisible();
        return;
      }

      await page.goto(`/guides/${slug}`);
      const h1Text = (await page.locator("h1").first().textContent()) ?? "";
      expect(h1Text.trim()).toContain(
        cardInfo.title.replace(/…$/, "").trim().substring(0, 20),
      );
    });
  }
});

test.describe("Category page shows correct guides for each category", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const category of CATEGORIES) {
    const expectedSlugs = CATEGORY_GUIDES[category];

    test(`${category}: all expected guides appear on category page`, async ({
      page,
    }) => {
      await page.goto(`/guides?category=${category}`);
      await page
        .waitForSelector(`a[href^="/guides/"]`, {
          timeout: 10_000,
        })
        .catch(() => null);

      for (const slug of expectedSlugs) {
        const link = page.locator(`a[href="/guides/${slug}"]`).first();
        expect(await link.count()).toBeGreaterThan(0);
      }
    });
  }
});

test.describe("Profit ranges are internally consistent", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const slug of GUIDE_SLUGS) {
    test(`${slug}: profit range min does not exceed max`, async ({ page }) => {
      await page.goto(`/guides/${slug}`);

      const rangePattern =
        /(\d+(?:\.\d+)?[kKmM])\s*[–-]\s*(\d+(?:\.\d+)?[kKmM])/g;
      const bodyText = await page.locator("main").innerText();
      const matches = [...bodyText.matchAll(rangePattern)];

      function parseAmount(s: string): number {
        const n = parseFloat(s);
        if (/[mM]$/.test(s)) return n * 1_000_000;
        if (/[kK]$/.test(s)) return n * 1_000;
        return n;
      }

      for (const match of matches) {
        const minVal = parseAmount(match[1]);
        const maxVal = parseAmount(match[2]);
        if (!isNaN(minVal) && !isNaN(maxVal) && minVal > 0 && maxVal > 0) {
          expect(minVal).toBeLessThanOrEqual(maxVal);
        }
      }
    });
  }
});
