# Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) tests.
All tests run against a local production build of the site.

---

## Test categories

Specs in `tests/e2e/` fall into three groups (same folder today; optional future split shown below):

| Category | Purpose | Example files |
|----------|---------|---------------|
| **E2E** | Routing, navigation, rendered UI, calculator interactions | `route-health.spec.ts`, `navigation.spec.ts`, `calculator-interactions.spec.ts` |
| **Data integrity** | Guide metadata, slugs, categories, economics, SEO config | `guide-data.spec.ts`, `profit-calculator-data.spec.ts`, `guides-seo-config.spec.ts` |
| **Content lint** | Bad phrases, duplicated numbering, `NaN`, market-fee wording | `content-quality.spec.ts`, `market-fee-terminology.spec.ts`, `albion-claims.spec.ts` |

Optional future layout:

```txt
tests/e2e      — browser E2E only
tests/data     — static data / economics validation
tests/content  — copy and claims lint
```

Guide slugs and category membership are **derived from `src/data/guides.ts`** via helpers in `tests/e2e/helpers.ts`. Do not maintain a second manual slug list.

---

## Installation

Playwright is already in `devDependencies`. To install it fresh:

```bash
npm install
npx playwright install --with-deps chromium
```

---

## Running the tests

### All tests

```bash
npm test
```

Runs the full Playwright suite (same as `npm run test:e2e`).

### E2E tests only (fastest for development)

```bash
npm run test:e2e
```

This builds the app (`next build && next start`) if no server is running on port 3000,
then runs all Playwright tests headlessly (excluding optional external CDN checks).

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
| `tests/e2e/category-filtering.spec.ts` | Each category page shows only guides from that category; `/guides` lists every published guide exactly once; no broken pluralisation |
| `tests/e2e/guide-card-detail-consistency.spec.ts` | Card titles match detail page h1; every expected guide appears on its category page; profit range min is not greater than max |
| `tests/e2e/content-quality.spec.ts` | No `NaN`, `undefined`, `[object Object]`, "guide s", "Potion s", `{{`, double punctuation, duplicated list numbers, SSR loading placeholders; header/footer consistent across all routes |
| `tests/e2e/profit-consistency.spec.ts` | Fiber Farming: no contradictory net profit claims; Ava Roads Fishing: expected value is within stated range; Group Tracking: per-player expected value is inside scenario range; Potion Crafting: event profits are labeled; Laborers: all-calculator-extreme range is correctly labeled |
| `tests/e2e/albion-claims.spec.ts` | Laborer guide: distinguishes gathering vs crafting vs mercenary laborers; Corrupted Dungeons: Standard vs Premium tax is not silently mixed |
| `tests/e2e/sitemap-robots.spec.ts` | sitemap.xml includes home, /guides, all category pages, all guide detail pages; excludes noindex filter pages; robots.txt allows all and disallows nothing |
| `tests/e2e/console-errors.spec.ts` | No app-owned console errors or uncaught exceptions on any public route |
| `tests/e2e/item-icons.spec.ts` | Rendered item icons match `data-item-id` URLs on guide pages |
| `tests/e2e/item-icons-external.spec.ts` | **Optional:** Albion render API returns valid images for all configured item IDs |
| `tests/e2e/calculator-interactions.spec.ts` | Premium toggle, skill tiers, laborer specialty, potion sell strategy, and mocked live prices update calculator output |
| `tests/e2e/internal-links.spec.ts` | Internal links on all public pages resolve without 404/500 |
| `tests/e2e/json-ld.spec.ts` | Type-specific JSON-LD: `WebSite` on `/`, `ItemList` on guides list/category landings, `Article` + `BreadcrumbList` on guide detail pages |
| `tests/e2e/navigation.spec.ts` | Header dropdown, mobile menu, feedback/donate, theme toggle, persisted market preferences |
| `tests/e2e/homepage.spec.ts` | Guide count, featured guide links, category cards, silver/hr range sanity, skip link, single h1 |
| `tests/e2e/guide-data.spec.ts` | Required guide fields, profitBuild structure, reliability and economics entries, derived slug/category helpers |
| `tests/e2e/guides-seo-config.spec.ts` | `guides-seo.ts` category landing rules, noindex logic, dungeon server profit ranges vs calculator outcomes |
| `tests/e2e/profit-calculator-data.spec.ts` | Guide card profit ranges match baked outcomes; default calculator outcomes match `tests/fixtures/profit-snapshots.json` |

All former offline validation scripts are covered by Playwright tests above.

Regenerate profit snapshots after intentional calculator changes:

```bash
npm run test:snapshots:write
```

### Optional external CDN checks

```bash
npm run test:e2e:external
```

Hits `render.albiononline.com` for every configured item ID. Not part of default CI.

---

## Adding new tests

- Put new test files in `tests/e2e/`.
- Import shared helpers from `tests/e2e/helpers.ts` (`getAllExpectedGuideSlugs`, `getExpectedGuideSlugsByCategory`, etc.).
- Always call `blockLivePriceApis(page)` in `beforeEach` unless the test explicitly needs live data (and then mock it with `page.route()`).
- Avoid pixel-perfect or element-position assertions.
- Document any ignored console error pattern in `console-errors.spec.ts` with an explanation.
- External network checks belong in `item-icons-external.spec.ts`, not the default suite.

---

## CI

The GitHub Actions workflow at `.github/workflows/playwright.yml` runs E2E tests on every push and pull request to `main`/`master`. It:

1. Installs Node 20 and npm dependencies
2. Installs the Chromium browser for Playwright
3. Builds the app (`npm run build`)
4. Runs `npm run test:e2e` (default suite; no Albion CDN dependency)
5. Uploads the Playwright HTML report as an artifact (kept for 14 days)

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

5. **Add a guide** in `src/data/guides.ts` only. Slugs and category membership in tests update automatically via `tests/e2e/helpers.ts`.

6. **Regenerate profit snapshots** after intentional calculator changes:
   ```bash
   npm run test:snapshots:write
   ```
