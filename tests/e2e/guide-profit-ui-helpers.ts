import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { guides } from "@/data/guides";
import { formatSilverPrice } from "@/lib/format";
import { blockLivePriceApis } from "./helpers";
import { readProfitSnapshotFixture } from "./profit-snapshot-helpers";

export const FEATURED_GUIDE_SLUGS = guides
  .filter((g) => g.featured)
  .map((g) => g.slug);

/** Guides whose hero uses the same default preset as the outcomes Expected value row. */
export const HERO_MATCHES_EXPECTED_SLUGS = [
  "t4-ore-mining-yellow-zone",
  "fiber-farming-solo",
  "corrupted-dungeons-pvpve",
  "mists-fishing",
  "laborer-passive-income",
  "potions-crafting-bulk",
  "abyssal-depths-farming",
  "high-tier-group-tracking",
] as const;

export interface ParsedProfitRange {
  min: number;
  max: number;
  unit: string;
}

export function profitUnitForSlug(slug: string): string {
  return slug === "potions-crafting-bulk" ? "/10k focus" : "/hr";
}

/** Parse compact silver tokens like 209k, 1.1m (matches formatSilver). */
export function parseSilverToken(token: string): number {
  const t = token.trim();
  const sign = t.startsWith("-") ? -1 : 1;
  const unsigned = t.replace(/^-/, "");
  const n = parseFloat(unsigned);
  if (/m$/i.test(unsigned)) return sign * Math.round(n * 1_000_000);
  if (/k$/i.test(unsigned)) return sign * Math.round(n * 1_000);
  return sign * Math.round(n);
}

/** How a silver amount appears on cards after formatSilver + parse round-trip. */
export function silverAsDisplayedOnCard(silver: number): number {
  return parseSilverToken(formatSilverPrice(silver));
}

/** Parse card/outcomes profit display: "209k – 290k/hr" or "94k/10k focus". */
export function parseProfitRangeDisplay(
  text: string,
  expectedUnit: string,
): ParsedProfitRange | null {
  const body = text.split("·")[0].trim();
  const unitMatch = body.match(/(\/hr|\/10k focus)\s*$/);
  const unit = unitMatch?.[1] ?? expectedUnit;
  const amountPart = body.replace(/(\/hr|\/10k focus)\s*$/, "").trim();

  const rangeMatch = amountPart.match(
    /^([\d.-]+[kKmM]?)\s*[–-]\s*([\d.-]+[kKmM]?)$/i,
  );
  if (rangeMatch) {
    return {
      min: parseSilverToken(rangeMatch[1]),
      max: parseSilverToken(rangeMatch[2]),
      unit,
    };
  }

  const singleMatch = amountPart.match(/^([\d.-]+[kKmM]?)$/i);
  if (singleMatch) {
    const value = parseSilverToken(singleMatch[1]);
    return { min: value, max: value, unit };
  }

  return null;
}

export async function extractCardProfitRange(
  card: Locator,
  slug: string,
): Promise<ParsedProfitRange | null> {
  const profitEl = card.locator("p.tabular-nums").first();
  await expect(profitEl).toBeVisible();
  const text = (await profitEl.textContent()) ?? "";
  return parseProfitRangeDisplay(text, profitUnitForSlug(slug));
}

export async function extractDetailOutcomesRange(
  page: Page,
  slug: string,
): Promise<ParsedProfitRange | null> {
  const unit = profitUnitForSlug(slug);
  const outcomesPanel = page
    .locator("div.rounded-xl")
    .filter({
      has: page.getByText(/Profit outcomes|Logged profit outcomes/i),
    })
    .first();
  await expect(outcomesPanel).toBeVisible({ timeout: 15_000 });

  const table = outcomesPanel.locator("table").first();
  await expect(table).toBeVisible();

  async function rowAmount(label: string): Promise<number | null> {
    const row = table.locator("tbody tr").filter({ hasText: label }).first();
    if ((await row.count()) === 0) return null;
    const raw = (await row.locator("td").nth(1).textContent())?.trim() ?? "";
    if (!raw || raw === "N/A") return null;
    return parseSilverToken(raw);
  }

  const conservative = await rowAmount("Conservative");
  const median = await rowAmount("Median");
  const expected = await rowAmount("Expected value");
  const highRoll = await rowAmount("High-roll");

  const lo = conservative ?? median;
  const hi = highRoll ?? expected ?? median;
  if (lo == null && hi == null) return null;

  const min = Math.min(lo ?? hi!, hi ?? lo!);
  const max = Math.max(lo ?? hi!, hi ?? lo!);
  return { min, max, unit };
}

export async function extractDetailExpectedOutcome(
  page: Page,
): Promise<number | null> {
  const outcomesPanel = page
    .locator("div.rounded-xl")
    .filter({
      has: page.getByText(/Profit outcomes|Logged profit outcomes/i),
    })
    .first();
  await expect(outcomesPanel).toBeVisible({ timeout: 15_000 });

  const row = outcomesPanel
    .locator("tbody tr")
    .filter({ hasText: "Expected value" })
    .first();
  if ((await row.count()) === 0) return null;
  const raw = (await row.locator("td").nth(1).textContent())?.trim() ?? "";
  if (!raw || raw === "N/A") return null;
  return parseSilverToken(raw);
}

export async function heroTakeHomeAmount(page: Page): Promise<number | null> {
  const hero = page.locator(".profit-hero-panel").first();
  await expect(hero).toBeVisible({ timeout: 15_000 });
  const text = ((await hero.locator("p.text-3xl").first().textContent()) ?? "").trim();
  if (!text || text === "N/A") return null;
  return parseSilverToken(text);
}

export async function ensurePremiumOff(page: Page): Promise<void> {
  const premium = page.getByLabel("Premium account");
  await expect(premium).toBeVisible();
  await premium.setChecked(false);
}

export async function openGuideFromCard(
  page: Page,
  listPath: string,
  slug: string,
): Promise<ParsedProfitRange> {
  await page.goto(listPath);
  await ensurePremiumOff(page);

  const card = page.locator(`a[href="/guides/${slug}"]`).first();
  await expect(card, `Guide card for ${slug} on ${listPath}`).toBeVisible({
    timeout: 15_000,
  });

  const cardRange = await extractCardProfitRange(card, slug);
  expect(
    cardRange,
    `Could not parse profit range from card for ${slug} on ${listPath}`,
  ).not.toBeNull();

  await card.click();
  await page.waitForURL(`**/guides/${slug}`, { timeout: 15_000 });

  return cardRange!;
}

export function readSnapshotRange(slug: string): ParsedProfitRange | null {
  const fixture = readProfitSnapshotFixture();
  const entry = fixture[slug];
  if (!entry || entry.rangeMin == null || entry.rangeMax == null) return null;
  return {
    min: entry.rangeMin,
    max: entry.rangeMax,
    unit: profitUnitForSlug(slug),
  };
}

export { blockLivePriceApis };

export const STANDARD_CALCULATOR_FEE_LABEL =
  /Standard sell-order fees \(2\.5% setup fee \+ 8% transaction tax\)/;
