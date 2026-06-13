import type { GuideRiskProfile } from "@/types/guide";
import type { MarketCityId } from "@/lib/market-cities";

/** Route-relevant default market for each guide's profit calculator. */
export const guideDefaultMarketCityBySlug: Record<string, MarketCityId> = {
  "t4-ore-mining-yellow-zone": "Martlock",
  "fiber-farming-solo": "Bridgewatch",
  "solo-dungeon-farming": "Martlock",
  "corrupted-dungeons-pvpve": "Caerleon",
  "abyssal-depths-farming": "Caerleon",
  "high-tier-group-tracking": "Caerleon",
  "mists-fishing": "Martlock",
  "ava-roads-fishing": "Caerleon",
  "laborer-passive-income": "Thetford",
  "potions-crafting-bulk": "Bridgewatch",
};

export const guideRiskProfileBySlug: Record<string, GuideRiskProfile> = {
  "t4-ore-mining-yellow-zone": "beginner-safe",
  "fiber-farming-solo": "beginner-safe",
  "mists-fishing": "beginner-safe",
  "solo-dungeon-farming": "rng-heavy",
  "corrupted-dungeons-pvpve": "rng-heavy",
  "abyssal-depths-farming": "rng-heavy",
  "high-tier-group-tracking": "rng-heavy",
  "ava-roads-fishing": "rng-heavy",
  "laborer-passive-income": "safe-passive",
  "potions-crafting-bulk": "rng-heavy",
};
