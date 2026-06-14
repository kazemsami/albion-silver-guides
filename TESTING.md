# Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) tests.
All tests run against a local production build of the site.

---

## Installation

Playwright is already in `devDependencies`. To install it fresh:

```bash
npm install
npx playwright install --with-deps chromium
```

---

## Running the tests

### All tests (validate scripts + E2E)

```bash
npm test
```

### E2E tests only (fastest for development)

```bash
npm run test:e2e
```

This builds the app (`next build && next start`) if no server is running on port 3000,
then runs all Playwright tests headlessly.

> Tip: If you already have `npm run start` running, Playwright reuses it
> (`reuseExistingServer: true` in `playwright.config.ts`).

### Headed mode (browser window visible)

```bash
npm run test:e2e:headed
```

### Interactive UI mode

```bash
npm run test:e2e:ui
```

Opens the Playwright UI where you can run, filter, and time-travel through tests.

### Debug mode (step through a single test)

```bash
npm run test:e2e:debug
```

---

## Test coverage

| File | What it tests |
|------|---------------|
| `tests/e2e/route-health.spec.ts` | All public pages return 200; no crash tokens; 404 for unknown guides; invalid filters handled gracefully |
| `tests/e2e/seo-metadata.spec.ts` | Page titles, meta descriptions, OG tags, canonical links; category pages have distinct titles; noindex on filter-only pages |
| `tests/e2e/category-filtering.spec.ts` | Each category page shows only guides from that category; no broken pluralisation; invalid category gracefully handled |
| `tests/e2e/guide-card-detail-consistency.spec.ts` | Card titles match detail page h1; every expected guide appears on its category page; profit range min is not greater than max |
| `tests/e2e/content-quality.spec.ts` | No `NaN`, `undefined`, `[object Object]`, "guide s", "Potion s", `{{`, double punctuation, duplicated list numbers, SSR loading placeholders; header/footer consistent across all routes |
| `tests/e2e/profit-consistency.spec.ts` | Fiber Farming: no contradictory net profit claims; Ava Roads Fishing: expected value is within stated range; Group Tracking: per-player expected value is inside scenario range; Potion Crafting: event profits are labeled; Laborers: all-calculator-extreme range is correctly labeled |
| `tests/e2e/albion-claims.spec.ts` | Solo Dungeon Maps: no false privacy guarantees; Laborer guide: distinguishes gathering vs crafting vs mercenary laborers; Corrupted Dungeons: Standard vs Premium tax is not silently mixed |
| `tests/e2e/sitemap-robots.spec.ts` | sitemap.xml includes home, /guides, all category pages, all 10 guide detail pages; excludes noindex filter pages; robots.txt allows all and disallows nothing |
| `tests/e2e/console-errors.spec.ts` | No app-owned console errors or uncaught exceptions on any public route |
| `tests/e2e/item-icons.spec.ts` | All configured item IDs return valid Albion icons; rendered icons match `data-item-id` URLs |
| `tests/e2e/calculator-interactions.spec.ts` | Premium toggle, skill tiers, laborer specialty, potion sell strategy, and mocked live prices update calculator output |
| `tests/e2e/internal-links.spec.ts` | Internal links on all public pages resolve without 404/500 |
| `tests/e2e/json-ld.spec.ts` | Type-specific JSON-LD: `WebSite` on `/`, `ItemList` on guides list/category landings, `Article` + `BreadcrumbList` on guide detail pages |
| `tests/e2e/navigation.spec.ts` | Header dropdown, mobile menu, feedback/donate, theme toggle, persisted market preferences |
| `tests/e2e/homepage.spec.ts` | Guide count, featured guide links, category cards, silver/hr range sanity, skip link, single h1 |

### Offline validation (`npm run validate`)

| Script | What it checks |
|--------|----------------|
| `scripts/validate-guides.mjs` | Guide data completeness and item icon CDN availability |
| `scripts/check-guide-profit-consistency.ts` | Guide card profit ranges match calculator outcomes |
| `scripts/check-guides-seo-metadata.ts` | Server-rendered SEO metadata |
| `scripts/check-profit-snapshots.ts` | Default profit outcomes match `tests/fixtures/profit-snapshots.json` |

Regenerate profit snapshots after intentional calculator changes:

```bash
npx tsx scripts/check-profit-snapshots.ts --write
```

---

## Architecture decisions

**Snapshot prices only**
All tests block live Albion market API calls (`albion-online-data.com`).
This makes tests deterministic and prevents flakiness from price fluctuations.
Tests compare structure and logical consistency, not exact silver amounts.

**Production build**
Tests run against `next build && next start` rather than `next dev`.
This catches SSR rendering issues, static generation bugs, and build-time metadata problems.

**No visual/pixel tests**
No screenshot comparisons. Tests only check content correctness, routing, and semantic structure.

---

## Debugging failures

1. **Re-run with headed browser** to see what is on screen:
   ```bash
   npm run test:e2e:headed
   ```

2. **Open the Playwright trace viewer** after a failed CI run:
   ```bash
   npx playwright show-trace playwright-report/
   ```

3. **Run a single test file**:
   ```bash
   npx playwright test tests/e2e/route-health.spec.ts
   ```

4. **Run a single test by name** (partial match):
   ```bash
   npx playwright test -g "fiber farming"
   ```

5. **Update GUIDE_SLUGS in `tests/e2e/helpers.ts`** if you add or remove guides.
   The slug list is the source of truth for route-health and SEO tests.

---

## Adding new tests

- Put new test files in `tests/e2e/`.
- Import shared helpers from `tests/e2e/helpers.ts`.
- Always call `blockLivePriceApis(page)` in `beforeEach` unless the test explicitly needs live data (and then mock it with `page.route()`).
- Avoid pixel-perfect or element-position assertions.
- Document any ignored console error pattern in `console-errors.spec.ts` with an explanation.

---

## CI

The GitHub Actions workflow at `.github/workflows/playwright.yml` runs E2E tests on every push and pull request to `main`/`master`. It:

1. Installs Node 20 and npm dependencies
2. Installs the Chromium browser for Playwright
3. Builds the app (`npm run build`)
4. Runs `npm run test:e2e`
5. Uploads the Playwright HTML report as an artifact (kept for 14 days)
