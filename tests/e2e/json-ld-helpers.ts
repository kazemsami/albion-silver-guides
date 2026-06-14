import type { Page } from "@playwright/test";

export type JsonLdBlock = Record<string, unknown>;

/** Parse all JSON-LD blocks from the current page. */
export async function getJsonLdBlocks(page: Page): Promise<JsonLdBlock[]> {
  const rawTexts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) =>
      nodes
        .map((node) => node.textContent?.trim() ?? "")
        .filter(Boolean),
    );

  const blocks: JsonLdBlock[] = [];
  for (const text of rawTexts) {
    const parsed = JSON.parse(text) as JsonLdBlock | JsonLdBlock[];
    if (Array.isArray(parsed)) {
      blocks.push(...parsed);
    } else {
      blocks.push(parsed);
    }
  }
  return blocks;
}

export function blocksOfType(
  blocks: JsonLdBlock[],
  type: string,
): JsonLdBlock[] {
  return blocks.filter((block) => block["@type"] === type);
}

export function firstBlockOfType(
  blocks: JsonLdBlock[],
  type: string,
): JsonLdBlock | undefined {
  return blocksOfType(blocks, type)[0];
}
