/**
 * Fetch royal-city median prices and print ITEM_PRICE_FALLBACKS entries
 * to refresh site-wide estimated price snapshots.
 *
 * Usage: node scripts/refresh-price-fallbacks.mjs
 * (Respect Albion Data Project rate limits: 100 req/min)
 */
import { readFileSync } from "fs";

const ROYAL_CITIES =
  "Caerleon,Thetford,Bridgewatch,Martlock,Lymhurst,Fort_Sterling";
const SOURCE_FILES = [
  "src/data/guides.ts",
  "src/data/guide-economics.ts",
  "src/data/guide-loadouts.ts",
  "src/data/guide-skill-tiers.ts",
  "src/data/laborer-specialties.ts",
  "src/data/t8-house-cost.ts",
];

const ids = new Set();
const re = /id: "(T\d+_[^"]+)"/g;
for (const file of SOURCE_FILES) {
  const src = readFileSync(file, "utf8");
  let match;
  while ((match = re.exec(src))) ids.add(match[1]);
}

const list = [...ids].sort();

function median(values) {
  const valid = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (valid.length === 0) return null;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 === 0
    ? Math.round((valid[mid - 1] + valid[mid]) / 2)
    : valid[mid];
}

function aggregate(rows) {
  const sells = [];
  const buys = [];
  for (const row of rows) {
    if (row.sell_price_min > 0) {
      sells.push(
        row.sell_price_max > 0
          ? (row.sell_price_min + row.sell_price_max) / 2
          : row.sell_price_min,
      );
    }
    if (row.buy_price_max > 0) {
      buys.push((row.buy_price_min + row.buy_price_max) / 2);
    }
  }
  return { sell: median(sells), buy: median(buys) };
}

const fetched = {};

for (let i = 0; i < list.length; i += 40) {
  const chunk = list.slice(i, i + 40);
  const encoded = chunk.map(encodeURIComponent).join(",");
  const url = `https://west.albion-online-data.com/api/v2/stats/prices/${encoded}.json?locations=${ROYAL_CITIES}&qualities=1`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`API ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const rows = await res.json();
  for (const id of chunk) {
    const prices = aggregate(rows.filter((row) => row.item_id === id));
    if (prices.sell != null || prices.buy != null) fetched[id] = prices;
  }
  await new Promise((r) => setTimeout(r, 700));
}

console.log(`Fetched ${Object.keys(fetched).length}/${list.length} items.\n`);
console.log("// Paste into ITEM_PRICE_FALLBACKS in src/data/item-price-fallbacks.ts\n");
for (const [id, prices] of Object.entries(fetched).sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  const parts = [];
  if (prices.sell != null) parts.push(`sell: ${prices.sell}`);
  if (prices.buy != null) parts.push(`buy: ${prices.buy}`);
  console.log(`  ${id}: { ${parts.join(", ")} },`);
}
