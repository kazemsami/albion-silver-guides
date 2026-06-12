/** Audit tracking loot totals vs reference session. */
import { readFileSync } from "fs";

const trackingSrc = readFileSync("src/data/tracking-economics.ts", "utf8");
const refMatch = trackingSrc.match(
  /TRACKING_REFERENCE_SESSION = \{([\s\S]*?)\} as const/,
);
const groupLoot = Number(
  refMatch?.[1]?.match(/groupLootSilver:\s*([\d_]+)/)?.[1]?.replace(/_/g, ""),
);
const perPlayerLoot = Number(
  refMatch?.[1]?.match(/perPlayerSilver:\s*([\d_]+)/)?.[1]?.replace(/_/g, ""),
);
const hours = Number(
  refMatch?.[1]?.match(/activeHours:\s*([\d.]+)/)?.[1],
);
const sampleKills = Number(
  refMatch?.[1]?.match(/sampleKills:\s*(\d+)/)?.[1],
);

const fallbacksSrc = readFileSync("src/data/item-price-fallbacks.ts", "utf8");
const prices = {};
for (const m of fallbacksSrc.matchAll(/^\s+(T[\w@]+):\s*\{\s*sell:\s*([\d_]+)/gm)) {
  prices[m[1]] = Number(m[2].replace(/_/g, ""));
}

const lootBlock = trackingSrc.match(
  /TRACKING_AVERAGE_LOOT_PER_KILL[^[]*\[([\s\S]*?)\];/,
)?.[1];
const loot = [
  ...lootBlock.matchAll(/\{\s*id:\s*"([^"]+)"[^}]*perKill:\s*([\d.]+)/g),
].map((m) => ({ id: m[1], perKill: Number(m[2]) }));

const kphMatch = trackingSrc.match(/killsPerHour:\s*REFERENCE_KILLS_PER_HOUR/);
const kph = sampleKills / hours;

let silverPerKill = 0;
for (const { id, perKill } of loot) {
  silverPerKill += perKill * (prices[id] ?? 0);
}

const scale = groupLoot / hours / (kph * silverPerKill);
const hourlyGross = kph * silverPerKill * scale;
const sessionGross = hourlyGross * hours;

console.log("Reference:", {
  groupLoot,
  perPlayerLoot,
  hours,
  sampleKills,
  kph: kph.toFixed(2),
});
console.log("Silver per kill (unscaled):", Math.round(silverPerKill));
console.log("Loot scale (Expected):", scale.toFixed(3));
console.log("Expected hourly gross:", Math.round(hourlyGross));
console.log("Expected session gross:", Math.round(sessionGross));
