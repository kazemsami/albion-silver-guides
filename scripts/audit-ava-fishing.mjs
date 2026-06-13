/** Ava Roads profit audit: fish/hr model with optional chop price override. */
import { readFileSync } from "fs";

const CHOPS_PER_FISH = 15;
const SNAPPER_PER_CATCH = 4;
const T7_STURGEON_SHARE = 2 / 5;
const T8_STURGEON_SHARE = 3 / 7;
const CHOP_PRICE = Number(process.env.CHOP_PRICE ?? 340);

const fallbacks = Object.fromEntries(
  [...readFileSync("src/data/item-price-fallbacks.ts", "utf8").matchAll(
    /(\w+):\s*\{\s*(?:sell:\s*([\d_]+))?(?:,\s*)?(?:buy:\s*([\d_]+))?/g,
  )].map((m) => [
    m[1],
    {
      sell: m[2] ? Number(m[2].replace(/_/g, "")) : null,
      buy: m[3] ? Number(m[3].replace(/_/g, "")) : null,
    },
  ]),
);

function price(id, side) {
  if (id === "T1_FISHCHOPS") return CHOP_PRICE;
  const f = fallbacks[id];
  if (!f) return null;
  return side === "buy" ? f.buy ?? f.sell : f.sell ?? f.buy;
}

function fishOutput(totalFish, sturgeonShare) {
  const sturgeon = Math.round(totalFish * sturgeonShare);
  const butchered = totalFish - sturgeon;
  return { sturgeon, chops: butchered * CHOPS_PER_FISH, butchered, totalFish };
}

const baseConsumables = [
  { id: "T3_FISHINGBAIT", q: 10 },
  { id: "T7_MEAL_PIE", q: 2 },
  { id: "T8_POTION_CLEANSE", q: 1 },
];
const journalBuy = { id: "T7_JOURNAL_FISHING_EMPTY", q: 1 };

const tiers = [
  {
    id: "safe",
    fish: fishOutput(345, T7_STURGEON_SHARE),
    snapper: 0,
    consumables: [
      { id: "T3_FISHINGBAIT", q: 10 },
      { id: "T7_MEAL_PIE", q: 2 },
    ],
  },
  {
    id: "grandmaster",
    fish: fishOutput(400, T7_STURGEON_SHARE),
    snapper: 0.35,
    consumables: null,
  },
  {
    id: "profit",
    fish: fishOutput(450, T8_STURGEON_SHARE),
    snapper: 0.5,
    consumables: null,
  },
  {
    id: "expert",
    fish: fishOutput(550, T8_STURGEON_SHARE),
    snapper: 1.35,
    consumables: null,
  },
];

console.log(`Chop price: ${CHOP_PRICE}/unit, ${CHOPS_PER_FISH} chops per butchered fish\n`);

for (const tier of tiers) {
  const { sturgeon, chops, butchered, totalFish } = tier.fish;
  let gross =
    sturgeon * price("T8_FISH_FRESHWATER_ALL_COMMON", "sell") +
    chops * price("T1_FISHCHOPS", "sell") +
    price("T7_JOURNAL_FISHING_FULL", "sell");
  gross += tier.snapper * SNAPPER_PER_CATCH * price("T7_FISH_FRESHWATER_AVALON_RARE", "sell");

  let costs = journalBuy.q * price(journalBuy.id, "buy");
  const cons = tier.consumables ?? baseConsumables;
  for (const { id, q } of cons) {
    costs += q * price(id, "buy");
  }

  console.log(
    `${tier.id}: ${totalFish} fish/hr → ${sturgeon} Sturgeon + ${butchered} butchered → ${chops} chops`,
  );
  console.log(`  net ${Math.round(gross - costs).toLocaleString()}\n`);
}
