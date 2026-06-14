# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sitemap-robots.spec.ts >> sitemap.xml >> includes / (home)
- Location: tests\e2e\sitemap-robots.spec.ts:40:7

# Error details

```
Error: sitemap must include home URL

expect(received).toMatch(expected)

Expected pattern: /<loc>[^<]*\/<\/loc>/
Received string:  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">
<url>
<loc>https://www.albion-silver.me/guides?category=gathering</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.85</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides?category=crafting</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.85</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides?category=dungeons</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.85</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides?category=fishing</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.85</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides?category=laborers</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.85</priority>
</url>
<url>
<loc>https://www.albion-silver.me/license</loc>
<lastmod>2026-06-14T12:24:16.259Z</lastmod>
<changefreq>yearly</changefreq>
<priority>0.3</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/t4-ore-mining-yellow-zone</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/fiber-farming-solo</loc>
<lastmod>2026-06-13T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/corrupted-dungeons-pvpve</loc>
<lastmod>2026-06-12T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/dungeon-maps-solo</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/abyssal-depths-farming</loc>
<lastmod>2026-06-13T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/high-tier-group-tracking</loc>
<lastmod>2026-06-13T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/mists-fishing</loc>
<lastmod>2026-06-13T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/ava-roads-fishing</loc>
<lastmod>2026-06-14T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/laborer-passive-income</loc>
<lastmod>2026-06-13T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://www.albion-silver.me/guides/potions-crafting-bulk</loc>
<lastmod>2026-06-13T00:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
</urlset>
"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]: This XML file does not appear to have any style information associated with it. The document tree is shown below.
  - generic [ref=e4]:
    - generic [ref=e7]:
      - text: <urlset
      - generic [ref=e8]: xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      - text: ">"
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e13]: <url>
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: <loc>
            - text: https://www.albion-silver.me/guides?category=gathering
            - generic [ref=e17]: </loc>
          - generic [ref=e18]:
            - generic [ref=e19]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e20]: </lastmod>
          - generic [ref=e21]:
            - generic [ref=e22]: <changefreq>
            - text: weekly
            - generic [ref=e23]: </changefreq>
          - generic [ref=e24]:
            - generic [ref=e25]: <priority>
            - text: "0.85"
            - generic [ref=e26]: </priority>
        - generic [ref=e28]: </url>
      - generic [ref=e29]:
        - generic [ref=e32]: <url>
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic [ref=e35]: <loc>
            - text: https://www.albion-silver.me/guides?category=crafting
            - generic [ref=e36]: </loc>
          - generic [ref=e37]:
            - generic [ref=e38]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e39]: </lastmod>
          - generic [ref=e40]:
            - generic [ref=e41]: <changefreq>
            - text: weekly
            - generic [ref=e42]: </changefreq>
          - generic [ref=e43]:
            - generic [ref=e44]: <priority>
            - text: "0.85"
            - generic [ref=e45]: </priority>
        - generic [ref=e47]: </url>
      - generic [ref=e48]:
        - generic [ref=e51]: <url>
        - generic [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]: <loc>
            - text: https://www.albion-silver.me/guides?category=dungeons
            - generic [ref=e55]: </loc>
          - generic [ref=e56]:
            - generic [ref=e57]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e58]: </lastmod>
          - generic [ref=e59]:
            - generic [ref=e60]: <changefreq>
            - text: weekly
            - generic [ref=e61]: </changefreq>
          - generic [ref=e62]:
            - generic [ref=e63]: <priority>
            - text: "0.85"
            - generic [ref=e64]: </priority>
        - generic [ref=e66]: </url>
      - generic [ref=e67]:
        - generic [ref=e70]: <url>
        - generic [ref=e71]:
          - generic [ref=e72]:
            - generic [ref=e73]: <loc>
            - text: https://www.albion-silver.me/guides?category=fishing
            - generic [ref=e74]: </loc>
          - generic [ref=e75]:
            - generic [ref=e76]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e77]: </lastmod>
          - generic [ref=e78]:
            - generic [ref=e79]: <changefreq>
            - text: weekly
            - generic [ref=e80]: </changefreq>
          - generic [ref=e81]:
            - generic [ref=e82]: <priority>
            - text: "0.85"
            - generic [ref=e83]: </priority>
        - generic [ref=e85]: </url>
      - generic [ref=e86]:
        - generic [ref=e89]: <url>
        - generic [ref=e90]:
          - generic [ref=e91]:
            - generic [ref=e92]: <loc>
            - text: https://www.albion-silver.me/guides?category=laborers
            - generic [ref=e93]: </loc>
          - generic [ref=e94]:
            - generic [ref=e95]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e96]: </lastmod>
          - generic [ref=e97]:
            - generic [ref=e98]: <changefreq>
            - text: weekly
            - generic [ref=e99]: </changefreq>
          - generic [ref=e100]:
            - generic [ref=e101]: <priority>
            - text: "0.85"
            - generic [ref=e102]: </priority>
        - generic [ref=e104]: </url>
      - generic [ref=e105]:
        - generic [ref=e108]: <url>
        - generic [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]: <loc>
            - text: https://www.albion-silver.me/license
            - generic [ref=e112]: </loc>
          - generic [ref=e113]:
            - generic [ref=e114]: <lastmod>
            - text: 2026-06-14T12:24:16.259Z
            - generic [ref=e115]: </lastmod>
          - generic [ref=e116]:
            - generic [ref=e117]: <changefreq>
            - text: yearly
            - generic [ref=e118]: </changefreq>
          - generic [ref=e119]:
            - generic [ref=e120]: <priority>
            - text: "0.3"
            - generic [ref=e121]: </priority>
        - generic [ref=e123]: </url>
      - generic [ref=e124]:
        - generic [ref=e127]: <url>
        - generic [ref=e128]:
          - generic [ref=e129]:
            - generic [ref=e130]: <loc>
            - text: https://www.albion-silver.me/guides/t4-ore-mining-yellow-zone
            - generic [ref=e131]: </loc>
          - generic [ref=e132]:
            - generic [ref=e133]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e134]: </lastmod>
          - generic [ref=e135]:
            - generic [ref=e136]: <changefreq>
            - text: weekly
            - generic [ref=e137]: </changefreq>
          - generic [ref=e138]:
            - generic [ref=e139]: <priority>
            - text: "0.8"
            - generic [ref=e140]: </priority>
        - generic [ref=e142]: </url>
      - generic [ref=e143]:
        - generic [ref=e146]: <url>
        - generic [ref=e147]:
          - generic [ref=e148]:
            - generic [ref=e149]: <loc>
            - text: https://www.albion-silver.me/guides/fiber-farming-solo
            - generic [ref=e150]: </loc>
          - generic [ref=e151]:
            - generic [ref=e152]: <lastmod>
            - text: 2026-06-13T00:00:00.000Z
            - generic [ref=e153]: </lastmod>
          - generic [ref=e154]:
            - generic [ref=e155]: <changefreq>
            - text: weekly
            - generic [ref=e156]: </changefreq>
          - generic [ref=e157]:
            - generic [ref=e158]: <priority>
            - text: "0.8"
            - generic [ref=e159]: </priority>
        - generic [ref=e161]: </url>
      - generic [ref=e162]:
        - generic [ref=e165]: <url>
        - generic [ref=e166]:
          - generic [ref=e167]:
            - generic [ref=e168]: <loc>
            - text: https://www.albion-silver.me/guides/corrupted-dungeons-pvpve
            - generic [ref=e169]: </loc>
          - generic [ref=e170]:
            - generic [ref=e171]: <lastmod>
            - text: 2026-06-12T00:00:00.000Z
            - generic [ref=e172]: </lastmod>
          - generic [ref=e173]:
            - generic [ref=e174]: <changefreq>
            - text: weekly
            - generic [ref=e175]: </changefreq>
          - generic [ref=e176]:
            - generic [ref=e177]: <priority>
            - text: "0.8"
            - generic [ref=e178]: </priority>
        - generic [ref=e180]: </url>
      - generic [ref=e181]:
        - generic [ref=e184]: <url>
        - generic [ref=e185]:
          - generic [ref=e186]:
            - generic [ref=e187]: <loc>
            - text: https://www.albion-silver.me/guides/dungeon-maps-solo
            - generic [ref=e188]: </loc>
          - generic [ref=e189]:
            - generic [ref=e190]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e191]: </lastmod>
          - generic [ref=e192]:
            - generic [ref=e193]: <changefreq>
            - text: weekly
            - generic [ref=e194]: </changefreq>
          - generic [ref=e195]:
            - generic [ref=e196]: <priority>
            - text: "0.8"
            - generic [ref=e197]: </priority>
        - generic [ref=e199]: </url>
      - generic [ref=e200]:
        - generic [ref=e203]: <url>
        - generic [ref=e204]:
          - generic [ref=e205]:
            - generic [ref=e206]: <loc>
            - text: https://www.albion-silver.me/guides/abyssal-depths-farming
            - generic [ref=e207]: </loc>
          - generic [ref=e208]:
            - generic [ref=e209]: <lastmod>
            - text: 2026-06-13T00:00:00.000Z
            - generic [ref=e210]: </lastmod>
          - generic [ref=e211]:
            - generic [ref=e212]: <changefreq>
            - text: weekly
            - generic [ref=e213]: </changefreq>
          - generic [ref=e214]:
            - generic [ref=e215]: <priority>
            - text: "0.8"
            - generic [ref=e216]: </priority>
        - generic [ref=e218]: </url>
      - generic [ref=e219]:
        - generic [ref=e222]: <url>
        - generic [ref=e223]:
          - generic [ref=e224]:
            - generic [ref=e225]: <loc>
            - text: https://www.albion-silver.me/guides/high-tier-group-tracking
            - generic [ref=e226]: </loc>
          - generic [ref=e227]:
            - generic [ref=e228]: <lastmod>
            - text: 2026-06-13T00:00:00.000Z
            - generic [ref=e229]: </lastmod>
          - generic [ref=e230]:
            - generic [ref=e231]: <changefreq>
            - text: weekly
            - generic [ref=e232]: </changefreq>
          - generic [ref=e233]:
            - generic [ref=e234]: <priority>
            - text: "0.8"
            - generic [ref=e235]: </priority>
        - generic [ref=e237]: </url>
      - generic [ref=e238]:
        - generic [ref=e241]: <url>
        - generic [ref=e242]:
          - generic [ref=e243]:
            - generic [ref=e244]: <loc>
            - text: https://www.albion-silver.me/guides/mists-fishing
            - generic [ref=e245]: </loc>
          - generic [ref=e246]:
            - generic [ref=e247]: <lastmod>
            - text: 2026-06-13T00:00:00.000Z
            - generic [ref=e248]: </lastmod>
          - generic [ref=e249]:
            - generic [ref=e250]: <changefreq>
            - text: weekly
            - generic [ref=e251]: </changefreq>
          - generic [ref=e252]:
            - generic [ref=e253]: <priority>
            - text: "0.8"
            - generic [ref=e254]: </priority>
        - generic [ref=e256]: </url>
      - generic [ref=e257]:
        - generic [ref=e260]: <url>
        - generic [ref=e261]:
          - generic [ref=e262]:
            - generic [ref=e263]: <loc>
            - text: https://www.albion-silver.me/guides/ava-roads-fishing
            - generic [ref=e264]: </loc>
          - generic [ref=e265]:
            - generic [ref=e266]: <lastmod>
            - text: 2026-06-14T00:00:00.000Z
            - generic [ref=e267]: </lastmod>
          - generic [ref=e268]:
            - generic [ref=e269]: <changefreq>
            - text: weekly
            - generic [ref=e270]: </changefreq>
          - generic [ref=e271]:
            - generic [ref=e272]: <priority>
            - text: "0.8"
            - generic [ref=e273]: </priority>
        - generic [ref=e275]: </url>
      - generic [ref=e276]:
        - generic [ref=e279]: <url>
        - generic [ref=e280]:
          - generic [ref=e281]:
            - generic [ref=e282]: <loc>
            - text: https://www.albion-silver.me/guides/laborer-passive-income
            - generic [ref=e283]: </loc>
          - generic [ref=e284]:
            - generic [ref=e285]: <lastmod>
            - text: 2026-06-13T00:00:00.000Z
            - generic [ref=e286]: </lastmod>
          - generic [ref=e287]:
            - generic [ref=e288]: <changefreq>
            - text: weekly
            - generic [ref=e289]: </changefreq>
          - generic [ref=e290]:
            - generic [ref=e291]: <priority>
            - text: "0.8"
            - generic [ref=e292]: </priority>
        - generic [ref=e294]: </url>
      - generic [ref=e295]:
        - generic [ref=e298]: <url>
        - generic [ref=e299]:
          - generic [ref=e300]:
            - generic [ref=e301]: <loc>
            - text: https://www.albion-silver.me/guides/potions-crafting-bulk
            - generic [ref=e302]: </loc>
          - generic [ref=e303]:
            - generic [ref=e304]: <lastmod>
            - text: 2026-06-13T00:00:00.000Z
            - generic [ref=e305]: </lastmod>
          - generic [ref=e306]:
            - generic [ref=e307]: <changefreq>
            - text: weekly
            - generic [ref=e308]: </changefreq>
          - generic [ref=e309]:
            - generic [ref=e310]: <priority>
            - text: "0.8"
            - generic [ref=e311]: </priority>
        - generic [ref=e313]: </url>
    - generic [ref=e315]: </urlset>
```

# Test source

```ts
  1  | /**
  2  |  * Sitemap and robots.txt tests.
  3  |  * Verifies that crawlable URLs are correctly exposed and protected pages
  4  |  * are not accidentally blocked.
  5  |  */
  6  | import { test, expect } from "@playwright/test";
  7  | import { GUIDE_SLUGS, CATEGORIES } from "./helpers";
  8  | 
  9  | test.describe("robots.txt", () => {
  10 |   test("allows all paths", async ({ page }) => {
  11 |     const response = await page.goto("/robots.txt");
  12 |     expect(response?.status()).toBe(200);
  13 |     const text = await page.locator("body").innerText().catch(async () => {
  14 |       // Some Next.js versions return robots.txt as raw text content
  15 |       return response?.text() ?? "";
  16 |     });
  17 |     const raw = await response?.text() ?? text;
  18 | 
  19 |     expect(raw, "robots.txt must allow /").toMatch(/Allow:\s+\//);
  20 |     expect(raw, "robots.txt must not disallow /").not.toMatch(
  21 |       /Disallow:\s+\/\s*$/m,
  22 |     );
  23 |     expect(raw, "robots.txt must not disallow /guides").not.toMatch(
  24 |       /Disallow:\s+\/guides/,
  25 |     );
  26 |     expect(raw, "robots.txt must point to sitemap").toMatch(
  27 |       /Sitemap:\s+https?:\/\//,
  28 |     );
  29 |   });
  30 | });
  31 | 
  32 | test.describe("sitemap.xml", () => {
  33 |   test("is accessible and valid XML", async ({ page }) => {
  34 |     const response = await page.goto("/sitemap.xml");
  35 |     expect(response?.status()).toBe(200);
  36 |     const content = await response?.text() ?? "";
  37 |     expect(content, "sitemap.xml must be XML").toMatch(/<\?xml|<urlset/);
  38 |   });
  39 | 
  40 |   test("includes / (home)", async ({ page }) => {
  41 |     await page.goto("/sitemap.xml");
  42 |     const content = await page.locator("body").innerText().catch(async () => {
  43 |       const res = await page.goto("/sitemap.xml");
  44 |       return res?.text() ?? "";
  45 |     });
  46 |     const raw = await (await page.goto("/sitemap.xml"))?.text() ?? "";
> 47 |     expect(raw, "sitemap must include home URL").toMatch(/<loc>[^<]*\/<\/loc>/);
     |                                                  ^ Error: sitemap must include home URL
  48 |   });
  49 | 
  50 |   test("includes /guides", async ({ page }) => {
  51 |     const response = await page.goto("/sitemap.xml");
  52 |     const raw = await response?.text() ?? "";
  53 |     expect(raw, "sitemap must include /guides").toMatch(/<loc>[^<]*\/guides<\/loc>/);
  54 |   });
  55 | 
  56 |   test("includes all category pages", async ({ page }) => {
  57 |     const response = await page.goto("/sitemap.xml");
  58 |     const raw = await response?.text() ?? "";
  59 |     for (const category of CATEGORIES) {
  60 |       expect(
  61 |         raw,
  62 |         `sitemap must include /guides?category=${category}`,
  63 |       ).toMatch(new RegExp(`<loc>[^<]*\/guides\\?category=${category}<\/loc>`));
  64 |     }
  65 |   });
  66 | 
  67 |   test("includes all published guide detail pages", async ({ page }) => {
  68 |     const response = await page.goto("/sitemap.xml");
  69 |     const raw = await response?.text() ?? "";
  70 |     for (const slug of GUIDE_SLUGS) {
  71 |       expect(
  72 |         raw,
  73 |         `sitemap must include /guides/${slug}`,
  74 |       ).toMatch(new RegExp(`<loc>[^<]*/guides/${slug}</loc>`));
  75 |     }
  76 |   });
  77 | 
  78 |   test("does not include noindex filter pages", async ({ page }) => {
  79 |     const response = await page.goto("/sitemap.xml");
  80 |     const raw = await response?.text() ?? "";
  81 |     // Pages like /guides?difficulty=beginner should not be in the sitemap
  82 |     expect(raw, "sitemap must not include ?difficulty= pages").not.toMatch(
  83 |       /\/guides\?[^<]*difficulty=/,
  84 |     );
  85 |     expect(raw, "sitemap must not include ?zone= pages").not.toMatch(
  86 |       /\/guides\?[^<]*zone=/,
  87 |     );
  88 |   });
  89 | });
  90 | 
```