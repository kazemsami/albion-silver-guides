import type { HourlyItem } from "@/types/guide";

/**
 * Item quantities from the community-verified ~11.5M haul (four inventory tabs)
 * over ~10–15 hours of T2 open-world roaming. Divided by 12.5 hr for hourly rates.
 */
export const T2_ROAM_VERIFIED_SESSION_HOURS = 12.5;

const perHour = (sessionQty: number): number =>
  Math.round((sessionQty / T2_ROAM_VERIFIED_SESSION_HOURS) * 100) / 100;

interface VerifiedLootLine {
  id: string;
  name: string;
  sessionQty: number;
  estimatedSilverPerUnit?: number;
}

const verifiedSessionLoot: VerifiedLootLine[] = [
  // - Filled mercenary journals - { id: "T8_JOURNAL_MERCENARY_FULL", name: "Elder's Mercenary Journal (Full)", sessionQty: 1 },
  { id: "T7_JOURNAL_MERCENARY_FULL", name: "Grandmaster's Mercenary Journal (Full)", sessionQty: 1 },
  { id: "T6_JOURNAL_MERCENARY_FULL", name: "Master's Mercenary Journal (Full)", sessionQty: 5 },
  { id: "T5_JOURNAL_MERCENARY_FULL", name: "Expert's Mercenary Journal (Full)", sessionQty: 17 },
  { id: "T4_JOURNAL_MERCENARY_FULL", name: "Adept's Mercenary Journal (Full)", sessionQty: 55 },
  { id: "T3_JOURNAL_MERCENARY_FULL", name: "Journeyman's Mercenary Journal (Full)", sessionQty: 15 },

  // - Filled generalist trophy journals - { id: "T6_JOURNAL_TROPHY_GENERAL_FULL", name: "Master's Generalist Trophy Journal (Full)", sessionQty: 3 },
  { id: "T5_JOURNAL_TROPHY_GENERAL_FULL", name: "Expert's Generalist Trophy Journal (Full)", sessionQty: 1 },
  { id: "T4_JOURNAL_TROPHY_GENERAL_FULL", name: "Adept's Generalist Trophy Journal (Full)", sessionQty: 113 },
  { id: "T3_JOURNAL_TROPHY_GENERAL_FULL", name: "Journeyman's Generalist Trophy Journal (Full)", sessionQty: 1 },
  { id: "T2_JOURNAL_TROPHY_GENERAL_FULL", name: "Novice's Generalist Trophy Journal (Full)", sessionQty: 614 },

  // Royal sigils come from Expeditions / Arena / crafting, not open-world roaming — excluded from economics.
  // { id: "QUESTITEM_TOKEN_ROYAL_T5", name: "Expert's Royal Sigil", sessionQty: 55 },
  // { id: "QUESTITEM_TOKEN_ROYAL_T4", name: "Adept's Royal Sigil", sessionQty: 131 },

  // - Runes - { id: "T8_RUNE", name: "Elder's Rune", sessionQty: 3 },
  { id: "T7_RUNE", name: "Grandmaster's Rune", sessionQty: 26 },
  { id: "T6_RUNE", name: "Master's Rune", sessionQty: 116 },
  { id: "T5_RUNE", name: "Expert's Rune", sessionQty: 85 },
  { id: "T4_RUNE", name: "Adept's Rune", sessionQty: 7 },

  // - Souls - { id: "T8_SOUL", name: "Elder's Soul", sessionQty: 1 },
  { id: "T7_SOUL", name: "Grandmaster's Soul", sessionQty: 2 },
  { id: "T6_SOUL", name: "Master's Soul", sessionQty: 62 },
  { id: "T5_SOUL", name: "Expert's Soul", sessionQty: 170 },

  // - Relics & fish - { id: "T4_RELIC", name: "Adept's Relic", sessionQty: 200 },
  { id: "T5_FISH_FRESHWATER_ALL_COMMON", name: "River Sturgeon", sessionQty: 2 },

  // - Luxury fishing treasures - { id: "TREASURE_CEREMONIAL_RARITY3", name: "Golden Crown / Golden Harp", sessionQty: 4 },
  { id: "TREASURE_CEREMONIAL_RARITY2", name: "Golden Ornament", sessionQty: 1 },
  { id: "TREASURE_SILVERWARE_RARITY3", name: "Silver Candelabrum", sessionQty: 7 },
  { id: "TREASURE_SILVERWARE_RARITY2", name: "Silver Cup / Silver Platter", sessionQty: 7 },
  { id: "TREASURE_DECORATIVE_RARITY3", name: "Dragon Bust / Stone Statue (T6)", sessionQty: 4 },
  { id: "TREASURE_DECORATIVE_RARITY2", name: "Black Horn / Stone Statue (T5)", sessionQty: 16 },

  // Tomes & PvP gear (estimated, thin market)
  {
    id: "TREASURE_KNOWLEDGE_RARITY2",
    name: "Tomes of Insight (mixed tiers)",
    sessionQty: 16,
    estimatedSilverPerUnit: 95_000,
  },
  {
    id: "T5_ARMOR_LEATHER_SET1",
    name: "PvP gear loot (mixed tiers / enchants)",
    sessionQty: 42,
    estimatedSilverPerUnit: 72_000,
  },
];

export function getT2RoamVerifiedHourlyOutput(): HourlyItem[] {
  return verifiedSessionLoot.map(({ sessionQty, ...line }) => ({
    ...line,
    quantity: perHour(sessionQty),
  }));
}
