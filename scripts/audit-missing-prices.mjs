/**
 * List item IDs used in profit calculators that have no sell/buy estimate.
 * Usage: node scripts/audit-missing-prices.mjs
 */
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

const SOURCE_FILES = [
  "src/data/guides.ts",
  "src/data/guide-economics.ts",
  "src/data/guide-loadouts.ts",
  "src/data/guide-skill-tiers.ts",
  "src/data/laborer-specialties.ts",
  "src/data/t8-house-cost.ts",
  "src/data/tracking-economics.ts",
  "src/data/potion-economics.ts",
  "src/data/abyssal-economics.ts",
  "src/data/ava-roads-economics.ts",
];

const ID_PATTERNS = [
  /id: ["'](T\d+_[^"']+)["']/g,
  /journalEmptyId: ["'](T\d+_[^"']+)["']/g,
  /journalFullId: ["'](T\d+_[^"']+)["']/g,
  /outputId: ["'](T\d+_[^"']+)["']/g,
  /trophyId: ["'](T\d+_[^"']+)["']/g,
];

const ids = new Set();
for (const rel of SOURCE_FILES) {
  const src = readFileSync(join(ROOT, rel), "utf8");
  for (const re of ID_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) ids.add(m[1]);
  }
}

const fallbacksSrc = readFileSync(
  join(ROOT, "src/data/item-price-fallbacks.ts"),
  "utf8",
);

const explicit = new Set();
const explicitRe = /^\s+(T\d+_[A-Z0-9_@]+):/gm;
let em;
while ((em = explicitRe.exec(fallbacksSrc))) explicit.add(em[1]);

function parseTier(itemId) {
  const match = itemId.match(/^T(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 4;
}

function scale(base, tier, referenceTier = 4, ratio = 1.9) {
  return Math.round(base * ratio ** (tier - referenceTier));
}

function inferFallbackPrice(itemId, side) {
  const tier = parseTier(itemId);
  const sellBias = side === "sell" ? 1 : 0.82;

  if (itemId.includes("_TOOL_TRACKING")) {
    return Math.round(scale(28_000, tier, 6, 2.1) * sellBias);
  }
  if (itemId.includes("_TOOL_FISHINGROD")) {
    return Math.round(scale(1200, tier, 3, 2.05) * sellBias);
  }
  if (itemId.includes("_TOOL_PICK") || itemId.includes("_TOOL_SICKLE")) {
    return Math.round(scale(800, tier, 4, 2.0) * sellBias);
  }
  if (
    itemId.endsWith("_ORE") ||
    itemId.endsWith("_WOOD") ||
    itemId.endsWith("_FIBER") ||
    itemId.endsWith("_HIDE") ||
    itemId.endsWith("_ROCK") ||
    itemId.endsWith("_CLOTH") ||
    itemId.endsWith("_PLANKS") ||
    itemId.endsWith("_METALBAR") ||
    itemId.endsWith("_LEATHER")
  ) {
    return Math.round(scale(900, tier, 4, 2.05) * sellBias);
  }
  if (itemId.includes("_JOURNAL_") && itemId.endsWith("_EMPTY")) {
    return Math.round(scale(3200, tier, 4, 2.15) * sellBias);
  }
  if (itemId.includes("_JOURNAL_") && itemId.endsWith("_FULL")) {
    return Math.round(scale(7800, tier, 4, 2.15) * sellBias);
  }
  if (itemId.includes("_FURNITUREITEM_TROPHY_")) {
    return Math.round(scale(9200, tier, 4, 2.12) * sellBias);
  }
  if (itemId.includes("_MOUNT_HORSE")) {
    return Math.round(scale(2500, tier, 3, 2.2) * sellBias);
  }
  if (itemId.includes("_MOUNT_GIANTSTAG")) {
    return Math.round(45_000 * sellBias);
  }
  if (itemId.includes("_BAG")) {
    return Math.round(scale(2000, tier, 4, 2.15) * sellBias);
  }
  if (itemId.includes("_CAPEITEM")) {
    return Math.round(scale(3500, tier, 4, 1.85) * sellBias);
  }
  if (
    itemId.includes("_HEAD_GATHERER") ||
    itemId.includes("_ARMOR_GATHERER") ||
    itemId.includes("_SHOES_GATHERER")
  ) {
    return Math.round(scale(1200, tier, 4, 2.05) * sellBias);
  }
  if (
    itemId.includes("_HEAD_") ||
    itemId.includes("_ARMOR_") ||
    itemId.includes("_SHOES_")
  ) {
    const enchant = itemId.includes("@") ? 1.35 : 1;
    return Math.round(scale(4500, tier, 4, 2.08) * enchant * sellBias);
  }
  if (
    itemId.includes("_2H_") ||
    itemId.includes("_MAIN_") ||
    itemId.includes("_OFF_")
  ) {
    const enchant = itemId.includes("@") ? 1.4 : 1;
    return Math.round(scale(6000, tier, 4, 2.1) * enchant * sellBias);
  }
  return null;
}

function hasPrice(id, side) {
  if (explicit.has(id)) return true;
  return inferFallbackPrice(id, side) != null;
}

const missing = [...ids]
  .filter((id) => !hasPrice(id, "sell") || !hasPrice(id, "buy"))
  .sort();

console.log(`Total item IDs scanned: ${ids.size}`);
console.log(`Explicit fallbacks: ${explicit.size}`);
console.log(`Missing any price: ${missing.length}`);
for (const id of missing) console.log(`  ${id}`);

if (missing.length > 0) process.exit(1);
