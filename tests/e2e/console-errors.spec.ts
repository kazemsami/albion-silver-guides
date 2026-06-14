/**
 * Console error tests.
 * Listens for console errors during page load and fails on app-owned errors.
 * Third-party / browser noise is explicitly documented and ignored.
 *
 * Patterns listed in IGNORED_ERROR_PATTERNS are well-known browser or
 * third-party messages that are not caused by application code.
 */
import { test, expect } from "@playwright/test";
import { GUIDE_SLUGS, CATEGORIES, blockLivePriceApis } from "./helpers";

/**
 * Patterns for console errors that are known to be third-party or browser-level
 * and are NOT caused by application code. These are explicitly documented here.
 */
const IGNORED_ERROR_PATTERNS: RegExp[] = [
  // Browser-generated errors for blocked requests (from our own blockLivePriceApis)
  /net::ERR_FAILED/,
  /net::ERR_ABORTED/,
  // PayPal donate button (third-party, not app-owned)
  /paypal\.com/i,
  // Google tag manager / analytics (if present)
  /google-analytics\.com|googletagmanager\.com/i,
  // HMR / development-only messages (should not appear in production build)
  /\[HMR\]|\[Fast Refresh\]/,
  // Chrome extensions that inject scripts
  /chrome-extension:\/\//,
  // ResizeObserver loop limit (browser quirk, not an app bug)
  /ResizeObserver loop/,
];

function isIgnoredError(message: string): boolean {
  return IGNORED_ERROR_PATTERNS.some((p) => p.test(message));
}

const ROUTES_TO_CHECK = [
  "/",
  "/guides",
  ...CATEGORIES.map((c) => `/guides?category=${c}`),
  ...GUIDE_SLUGS.map((s) => `/guides/${s}`),
];

test.describe("No app-owned console errors", () => {
  for (const route of ROUTES_TO_CHECK) {
    test(`${route} - no console errors`, async ({ page }) => {
      await blockLivePriceApis(page);

      const appErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          if (!isIgnoredError(text)) {
            appErrors.push(text);
          }
        }
      });

      page.on("pageerror", (err) => {
        if (!isIgnoredError(err.message)) {
          appErrors.push(`[pageerror] ${err.message}`);
        }
      });

      await page.goto(route);
      // Wait briefly for any delayed errors
      await page.waitForTimeout(1_000);

      expect(
        appErrors,
        `Unexpected console errors on ${route}:\n${appErrors.join("\n")}`,
      ).toHaveLength(0);
    });
  }
});
