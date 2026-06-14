/**
 * Internal link crawler.
 * Every internal link on public pages must resolve without unexpected 404/500.
 */
import { test, expect } from "@playwright/test";
import {
  GUIDE_SLUGS,
  CATEGORIES,
  blockLivePriceApis,
} from "./helpers";

const PUBLIC_ROUTES = [
  "/",
  "/guides",
  "/license",
  ...CATEGORIES.map((c) => `/guides?category=${c}`),
  ...GUIDE_SLUGS.map((s) => `/guides/${s}`),
];

function normalizeInternalHref(href: string): string | null {
  if (!href.startsWith("/")) return null;
  if (href.startsWith("//")) return null;
  const path = href.split("#")[0].split("?")[0];
  if (!path || path === "") return "/";
  return path;
}

test.describe("Internal links resolve", () => {
  test.beforeEach(async ({ page }) => {
    await blockLivePriceApis(page);
  });

  for (const route of PUBLIC_ROUTES) {
    test(`${route} has no broken internal links`, async ({ page, request }) => {
      await page.goto(route);
      await page.waitForSelector("main, [role='main'], body", {
        timeout: 15_000,
      });

      const hrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
        anchors
          .map((a) => a.getAttribute("href") ?? "")
          .filter((h) => h.startsWith("/") && !h.startsWith("//")),
      );

      const paths = [
        ...new Set(
          hrefs
            .map(normalizeInternalHref)
            .filter((p): p is string => p != null),
        ),
      ];

      const failures: string[] = [];

      for (const path of paths) {
        const url = new URL(path, page.url()).href;
        const response = await request.get(url);
        if (response.status() >= 400) {
          failures.push(`${path} (${response.status()})`);
        }
      }

      expect(
        failures,
        `Broken links on ${route}:\n${failures.join("\n")}`,
      ).toEqual([]);
    });
  }
});
