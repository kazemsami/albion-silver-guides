/**
 * Optional external network checks (Albion render CDN).
 * Not part of the default CI suite — run with: npm run test:e2e:external
 */
import { test, expect } from "@playwright/test";
import {
  collectConfiguredItemIds,
  iconUrlForItemId,
  parseItemIdFromIconSrc,
} from "./item-icon-helpers";

const configuredItemIds = collectConfiguredItemIds();

test.describe("Configured item icon catalog (Albion render API)", () => {
  test("every configured item ID returns a valid icon from Albion render API", async ({
    request,
  }) => {
    test.setTimeout(120_000);

    expect(
      configuredItemIds.length,
      "Expected at least one configured item ID",
    ).toBeGreaterThan(0);

    const failures: string[] = [];
    const batchSize = 20;

    for (let i = 0; i < configuredItemIds.length; i += batchSize) {
      const batch = configuredItemIds.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (itemId) => {
          const url = iconUrlForItemId(itemId);
          const response = await request.get(url);
          const contentType = response.headers()["content-type"] ?? "";
          return { itemId, status: response.status(), contentType };
        }),
      );

      for (const { itemId, status, contentType } of results) {
        if (status !== 200) {
          failures.push(`${itemId} (${status})`);
          continue;
        }
        if (!contentType.includes("image")) {
          failures.push(`${itemId} (not an image: ${contentType})`);
        }
      }
    }

    expect(
      failures,
      `Invalid item icons:\n${failures.join("\n")}`,
    ).toEqual([]);
  });

  test("getItemIconUrl encodes item IDs consistently", () => {
    for (const itemId of configuredItemIds) {
      const url = iconUrlForItemId(itemId);
      expect(parseItemIdFromIconSrc(url), `Round-trip failed for ${itemId}`).toBe(
        itemId,
      );
    }
  });
});
