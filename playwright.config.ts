import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.BASE_URL ??
  process.env.PLAYWRIGHT_BASE_URL ??
  "http://localhost:3000";

const useExternalServer = !/^https?:\/\/localhost(?::\d+)?\/?$/i.test(
  baseURL.replace(/\/$/, ""),
);

/**
 * Playwright configuration for E2E tests.
 * Local: next build && next start via webServer.
 * Vercel CI: set BASE_URL to the deployment URL (webServer skipped).
 * Run: npm run test:e2e
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,

  use: {
    baseURL,
    trace: "on-first-retry",
    // Disable JavaScript-based market price fetching so tests use snapshot
    // prices only and are not sensitive to live Albion API responses.
    // Individual tests may override this via page.route() if needed.
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  ...(useExternalServer
    ? {}
    : {
        webServer: {
          command: "npm run build && npm run start",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          stdout: "pipe",
          stderr: "pipe",
        },
      }),
});
