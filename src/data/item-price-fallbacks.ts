/**
 * Estimated silver/unit snapshots used by all profit calculators.
 * Regenerate from a market sample: npm run refresh-price-fallbacks
 */

export interface FallbackPrices {
  sell?: number;
  buy?: number;
}

/** Explicit overrides, thin markets, journals, rare drops, crafting mats. */
export const ITEM_PRICE_FALLBACKS: Record<string, FallbackPrices> = {
  // Tracking generic loot: runes / souls / relics / tomes
  T4_RUNE: { sell: 35, buy: 42 },
  T5_RUNE: { sell: 80, buy: 95 },
  T6_RUNE: { sell: 140, buy: 165 },
  T7_RUNE: { sell: 350, buy: 420 },
  T8_RUNE: { sell: 780, buy: 950 },
  T4_SOUL: { sell: 145, buy: 180 },
  T5_SOUL: { sell: 350, buy: 420 },
  T6_SOUL: { sell: 720, buy: 850 },
  T7_SOUL: { sell: 4400, buy: 5200 },
  T8_SOUL: { sell: 10_500, buy: 12_500 },
  T4_RELIC: { sell: 350, buy: 420 },
  T5_RELIC: { sell: 820, buy: 980 },
  T6_RELIC: { sell: 2000, buy: 2400 },
  T7_RELIC: { sell: 9000, buy: 11_000 },
  T8_RELIC: { sell: 26_000, buy: 32_000 },
  T4_SKILLBOOK_STANDARD: { sell: 8500, buy: 10_000 },
  // Legacy custom tracking IDs, keep only if old loot lines still use them
  T4_SHADOW_FUR: { sell: 6800, buy: 8500 },
  T5_SHADOW_FUR: { sell: 11_000, buy: 14_000 },
  T4_SHADOW_CLAWS: { sell: 4200, buy: 5200 },
  T5_SHADOW_CLAWS: { sell: 9500, buy: 12_000 },
  T6_SHADOW_CLAWS: { sell: 60_000, buy: 75_000 },
  T4_DAWNBIRD_FEATHER: { sell: 2200, buy: 2800 },
  T5_DAWNBIRD_FEATHER: { sell: 5200, buy: 6500 },
  T6_DAWNBIRD_FEATHER: { sell: 9500, buy: 12_000 },
  T8_DAWNBIRD_FEATHER: { sell: 28_000, buy: 35_000 },
  T5_DAWNBIRD_BEAK: { sell: 9500, buy: 12_000 },
  T6_DAWNBIRD_BEAK: { sell: 17_000, buy: 22_000 },
  T5_HELLFIRE_PAW: { sell: 12_000, buy: 15_000 },
  T7_HELLFIRE_PAW: { sell: 60_000, buy: 75_000 },
  T5_ROCKGIANT_HEART: { sell: 14_000, buy: 18_000 },
  T6_ROCKGIANT_HEART: { sell: 25_000, buy: 32_000 },
  T4_SPIRITBEAR_HEART: { sell: 6400, buy: 8000 },
  T5_SPIRITBEAR_HEART: { sell: 11_000, buy: 14_000 },
  T4_WEREWOLF_HEART: { sell: 7200, buy: 9000 },
  T5_WEREWOLF_HEART: { sell: 12_500, buy: 16_000 },
  T4_SPIRIT_REMAINS: { sell: 3600, buy: 4500 },
  T5_SPIRIT_REMAINS: { sell: 7200, buy: 9000 },
  T6_SPIRIT_REMAINS: { sell: 12_500, buy: 16_000 },
  T6_ANCIENT_SOUL: { sell: 9500, buy: 12_000 },
  T6_ANCIENT_STONE: { sell: 36_000, buy: 45_000 },
  T7_ANCIENT_STONE: { sell: 60_000, buy: 75_000 },
  // Real tracking animal-part IDs
  T3_ALCHEMY_RARE_PANTHER: { sell: 4200, buy: 5200 },
  T5_ALCHEMY_RARE_PANTHER: { sell: 9500, buy: 12_000 },
  T7_ALCHEMY_RARE_PANTHER: { sell: 60_000, buy: 75_000 },
  T3_ALCHEMY_RARE_EAGLE: { sell: 2200, buy: 2800 },
  T5_ALCHEMY_RARE_EAGLE: { sell: 5200, buy: 6500 },
  T7_ALCHEMY_RARE_EAGLE: { sell: 28_000, buy: 35_000 },
  T3_ALCHEMY_RARE_DIREBEAR: { sell: 6400, buy: 8000 },
  T5_ALCHEMY_RARE_DIREBEAR: { sell: 11_000, buy: 14_000 },
  T7_ALCHEMY_RARE_DIREBEAR: { sell: 60_000, buy: 75_000 },
  T3_ALCHEMY_RARE_WEREWOLF: { sell: 7200, buy: 9000 },
  T5_ALCHEMY_RARE_WEREWOLF: { sell: 12_500, buy: 16_000 },
  T7_ALCHEMY_RARE_WEREWOLF: { sell: 68_000, buy: 85_000 },
  T3_ALCHEMY_RARE_IMP: { sell: 8000, buy: 10_000 },
  T5_ALCHEMY_RARE_IMP: { sell: 12_000, buy: 15_000 },
  T7_ALCHEMY_RARE_IMP: { sell: 60_000, buy: 75_000 },
  T3_ALCHEMY_RARE_ELEMENTAL: { sell: 9500, buy: 12_000 },
  T5_ALCHEMY_RARE_ELEMENTAL: { sell: 14_000, buy: 18_000 },
  T7_ALCHEMY_RARE_ELEMENTAL: { sell: 60_000, buy: 75_000 },
  T3_ALCHEMY_RARE_ENT: { sell: 3600, buy: 4500 },
  T5_ALCHEMY_RARE_ENT: { sell: 7200, buy: 9000 },
  T7_ALCHEMY_RARE_ENT: { sell: 36_000, buy: 45_000 },
  // Shapeshifter artifact remnants: Dawnbird
  T4_ARTEFACT_2H_SHAPESHIFTER_AVALON: { sell: 20_000, buy: 25_000 },
  T5_ARTEFACT_2H_SHAPESHIFTER_AVALON: { sell: 68_000, buy: 85_000 },
  T6_ARTEFACT_2H_SHAPESHIFTER_AVALON: { sell: 180_000, buy: 225_000 },
  T7_ARTEFACT_2H_SHAPESHIFTER_AVALON: { sell: 520_000, buy: 650_000 },
  T8_ARTEFACT_2H_SHAPESHIFTER_AVALON: { sell: 1_440_000, buy: 1_800_000 },
  // Shapeshifter artifact remnants: Hellfire Imp
  T4_ARTEFACT_2H_SHAPESHIFTER_HELL: { sell: 20_000, buy: 25_000 },
  T5_ARTEFACT_2H_SHAPESHIFTER_HELL: { sell: 68_000, buy: 85_000 },
  T6_ARTEFACT_2H_SHAPESHIFTER_HELL: { sell: 180_000, buy: 225_000 },
  T7_ARTEFACT_2H_SHAPESHIFTER_HELL: { sell: 520_000, buy: 650_000 },
  T8_ARTEFACT_2H_SHAPESHIFTER_HELL: { sell: 1_440_000, buy: 1_800_000 },
  // Shapeshifter artifact remnants: Werewolf
  T4_ARTEFACT_2H_SHAPESHIFTER_MORGANA: { sell: 20_000, buy: 25_000 },
  T5_ARTEFACT_2H_SHAPESHIFTER_MORGANA: { sell: 68_000, buy: 85_000 },
  T6_ARTEFACT_2H_SHAPESHIFTER_MORGANA: { sell: 180_000, buy: 225_000 },
  T7_ARTEFACT_2H_SHAPESHIFTER_MORGANA: { sell: 520_000, buy: 650_000 },
  T8_ARTEFACT_2H_SHAPESHIFTER_MORGANA: { sell: 1_440_000, buy: 1_800_000 },
  // Shapeshifter artifact remnants: Runestone Golem
  T4_ARTEFACT_2H_SHAPESHIFTER_KEEPER: { sell: 20_000, buy: 25_000 },
  T5_ARTEFACT_2H_SHAPESHIFTER_KEEPER: { sell: 68_000, buy: 85_000 },
  T6_ARTEFACT_2H_SHAPESHIFTER_KEEPER: { sell: 180_000, buy: 225_000 },
  T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER: { sell: 520_000, buy: 650_000 },
  T8_ARTEFACT_2H_SHAPESHIFTER_KEEPER: { sell: 1_440_000, buy: 1_800_000 },
  // Tracking tool / essence
  T7_ESSENCE_POTION: { sell: 85_000, buy: 110_000 },
  T8_ESSENCE_POTION: { sell: 175_000, buy: 230_000 },
  T7_2H_TOOL_TRACKING: { sell: 36_000, buy: 106_000 },
  // T1 products
  T1_FISHCHOPS: { sell: 300, buy: 250 },
  T1_SEAWEED: { sell: 32, buy: 38 },
  T1_ALCHEMY_COMMON: { sell: 1300, buy: 4300 },
  T1_ROCK: { sell: 10, buy: 12 },
  T1_WOOD: { sell: 10, buy: 12 },
  T1_MEAL_SEAWEEDSALAD: { sell: 220, buy: 280 },
  // Gathering
  T4_ORE: { sell: 170, buy: 185 },
  T3_ORE: { sell: 105, buy: 115 },
  T5_ORE: { sell: 490, buy: 540 },
  "T4_ORE_LEVEL1@1": { sell: 180, buy: 200 },
  "T5_ORE_LEVEL1@1": { sell: 650, buy: 720 },
  T3_FIBER: { sell: 110, buy: 118 },
  T4_FIBER: { sell: 115, buy: 122 },
  T5_FIBER: { sell: 340, buy: 380 },
  "T4_FIBER_LEVEL2@2": { sell: 1100, buy: 1180 },
  "T5_FIBER_LEVEL1@1": { sell: 680, buy: 760 },
  "T5_FIBER_LEVEL2@2": { sell: 1360, buy: 1520 },
  T6_LEATHER: { sell: 2100, buy: 2400 },
  T7_ORE: { sell: 1795, buy: 860 },
  T7_WOOD: { sell: 2660, buy: 1308 },
  T7_FIBER: { sell: 1686, buy: 851 },
  T7_HIDE: { sell: 4696, buy: 2190 },
  T7_ROCK: { sell: 1936, buy: 853 },
  T7_FISH_FRESHWATER_ALL_COMMON: { sell: 2407, buy: 1095 },
  T7_METALBAR: { sell: 8486, buy: 3590 },
  T7_PLANKS: { sell: 11_210, buy: 7028 },
  T7_CLOTH: { sell: 9472, buy: 3966 },
  T7_LEATHER: { sell: 17_889, buy: 7849 },
  // Journals (empty = buy cost, full = sell value)
  T4_JOURNAL_ORE_EMPTY: { sell: 2800, buy: 3200 },
  T4_JOURNAL_ORE_FULL: { sell: 7800, buy: 9200 },
  T4_JOURNAL_FIBER_EMPTY: { sell: 2800, buy: 3200 },
  T4_JOURNAL_FIBER_FULL: { sell: 7800, buy: 9200 },
  T4_JOURNAL_FISHING_EMPTY: { sell: 2400, buy: 2800 },
  T4_JOURNAL_MERCENARY_EMPTY: { sell: 3000, buy: 3500 },
  T5_JOURNAL_FIBER_EMPTY: { sell: 5500, buy: 6500 },
  T5_JOURNAL_FIBER_FULL: { sell: 15_000, buy: 18_000 },
  T5_JOURNAL_MERCENARY_EMPTY: { sell: 6000, buy: 7000 },
  T5_JOURNAL_ORE_EMPTY: { sell: 5500, buy: 6500 },
  T7_JOURNAL_FISHING_EMPTY: { sell: 36_000, buy: 42_000 },
  T7_JOURNAL_FISHING_FULL: { sell: 82_000, buy: 98_000 },
  T7_JOURNAL_FIBER_EMPTY: { sell: 36_000, buy: 42_000 },
  T7_JOURNAL_FIBER_FULL: { sell: 82_000, buy: 98_000 },
  T7_JOURNAL_ORE_EMPTY: { sell: 36_000, buy: 42_000 },
  T7_JOURNAL_ORE_FULL: { sell: 141_000, buy: 115_000 },
  T7_JOURNAL_WOOD_EMPTY: { sell: 36_000, buy: 42_000 },
  T7_JOURNAL_WOOD_FULL: { sell: 82_000, buy: 98_000 },
  T7_JOURNAL_HIDE_EMPTY: { sell: 36_000, buy: 42_000 },
  T7_JOURNAL_HIDE_FULL: { sell: 82_000, buy: 98_000 },
  T7_JOURNAL_STONE_EMPTY: { sell: 14_487, buy: 5002 },
  T7_JOURNAL_STONE_FULL: { sell: 120_241, buy: 95_000 },
  T7_JOURNAL_MERCENARY_EMPTY: { sell: 36_000, buy: 42_000 },
  T7_JOURNAL_WARRIOR_EMPTY: { sell: 12_214, buy: 2029 },
  T7_JOURNAL_WARRIOR_FULL: { sell: 56_446, buy: 25_190 },
  T7_JOURNAL_HUNTER_EMPTY: { sell: 15_617, buy: 6853 },
  T7_JOURNAL_HUNTER_FULL: { sell: 89_986, buy: 76_012 },
  T7_JOURNAL_MAGE_EMPTY: { sell: 24_896, buy: 9149 },
  T7_JOURNAL_MAGE_FULL: { sell: 63_611, buy: 52_809 },
  T7_JOURNAL_TOOLMAKER_EMPTY: { sell: 20_430, buy: 7000 },
  T7_JOURNAL_TOOLMAKER_FULL: { sell: 67_533, buy: 30_006 },
  T7_JOURNAL_TROPHY_GENERAL_EMPTY: { sell: 38_000, buy: 45_000 },
  T7_JOURNAL_TROPHY_GENERAL_FULL: { sell: 15_989, buy: 5249 },
  T3_JOURNAL_MERCENARY_FULL: { sell: 5200, buy: 6200 },
  T4_JOURNAL_MERCENARY_FULL: { sell: 7800, buy: 9200 },
  T5_JOURNAL_MERCENARY_FULL: { sell: 15_000, buy: 18_000 },
  T6_JOURNAL_MERCENARY_FULL: { sell: 30_000, buy: 36_000 },
  T7_JOURNAL_MERCENARY_FULL: { sell: 60_000, buy: 72_000 },
  T8_JOURNAL_MERCENARY_FULL: { sell: 120_000, buy: 145_000 },
  T8_JOURNAL_MERCENARY_EMPTY: { sell: 48_000, buy: 58_000 },
  T2_JOURNAL_TROPHY_GENERAL_FULL: { sell: 2200, buy: 2800 },
  // T2 black-zone roam kit (approximate buy prices for death-cost modeling)
  T2_HEAD_PLATE_SET1: { sell: 1900, buy: 2200 },
  T2_ARMOR_PLATE_SET1: { sell: 2800, buy: 3200 },
  T2_SHOES_PLATE_SET1: { sell: 1600, buy: 1800 },
  T2_MAIN_FIRESTAFF: { sell: 1300, buy: 1500 },
  T2_OFF_SHIELD: { sell: 800, buy: 900 },
  T2_CAPE: { sell: 600, buy: 700 },
  T2_BAG: { sell: 2800, buy: 3200 },
  T2_MOUNT_MULE: { sell: 4500, buy: 5200 },
  T3_JOURNAL_TROPHY_GENERAL_FULL: { sell: 5200, buy: 6200 },
  T4_JOURNAL_TROPHY_GENERAL_FULL: { sell: 7800, buy: 9200 },
  T5_JOURNAL_TROPHY_GENERAL_FULL: { sell: 15_000, buy: 18_000 },
  T6_JOURNAL_TROPHY_GENERAL_FULL: { sell: 30_000, buy: 36_000 },
  T4_JOURNAL_FISHING_FULL: { sell: 7800, buy: 9200 },
  T5_JOURNAL_FISHING_FULL: { sell: 15_000, buy: 18_000 },
  QUESTITEM_TOKEN_ROYAL_T4: { sell: 2600, buy: 3200 },
  QUESTITEM_TOKEN_ROYAL_T5: { sell: 5200, buy: 6500 },
  QUESTITEM_TOKEN_ROYAL_T6: { sell: 10_500, buy: 13_000 },
  TREASURE_CEREMONIAL_RARITY2: { sell: 10_000, buy: 12_000 },
  TREASURE_CEREMONIAL_RARITY3: { sell: 20_000, buy: 24_000 },
  TREASURE_SILVERWARE_RARITY2: { sell: 10_000, buy: 12_000 },
  TREASURE_SILVERWARE_RARITY3: { sell: 20_000, buy: 24_000 },
  TREASURE_DECORATIVE_RARITY2: { sell: 10_000, buy: 12_000 },
  TREASURE_DECORATIVE_RARITY3: { sell: 20_000, buy: 24_000 },
  TREASURE_KNOWLEDGE_RARITY2: { sell: 80_000, buy: 95_000 },
  T5_FISH_FRESHWATER_ALL_COMMON: { sell: 2200, buy: 2800 },
  // Fishing
  T3_FISHINGBAIT: { sell: 180, buy: 210 },
  T7_FISH_FRESHWATER_AVALON_RARE: { sell: 80_000, buy: 65_000 },
  T8_FISH_FRESHWATER_ALL_COMMON: { sell: 9500, buy: 12_000 },
  // Food & potions
  T4_MEAL_STEW: { sell: 420, buy: 480 },
  T6_MEAL_STEW: { sell: 980, buy: 1280 },
  T6_MEAL_SANDWICH: { sell: 1650, buy: 2025 },
  T7_MEAL_PIE: { sell: 5_000, buy: 6_000 },
  T7_MEAL_OMELETTE: { sell: 18_000, buy: 22_000 },
  T8_MEAL_SANDWICH: { sell: 3400, buy: 4200 },
  T4_POTION_HEAL: { sell: 320, buy: 420 },
  T4_POTION_ENERGY: { sell: 290, buy: 380 },
  T6_POTION_HEAL: { sell: 10_100, buy: 10_800 },
  "T6_POTION_HEAL@1": { sell: 32_000, buy: 34_500 },
  "T6_POTION_HEAL@2": { sell: 65_000, buy: 69_500 },
  "T6_POTION_HEAL@3": { sell: 178_000, buy: 190_000 },
  T6_POTION_ENERGY: { sell: 9000, buy: 9900 },
  "T6_POTION_ENERGY@1": { sell: 30_000, buy: 32_500 },
  "T6_POTION_ENERGY@2": { sell: 80_000, buy: 85_500 },
  "T6_POTION_ENERGY@3": { sell: 190_000, buy: 203_000 },
  T6_POTION_COOLDOWN: { sell: 6000, buy: 6600 },
  T6_POTION_BERSERK: { sell: 1500, buy: 1800 },
  T6_POTION_LAVA: { sell: 1400, buy: 1700 },
  T6_POTION_GATHER: { sell: 2000, buy: 2500 },
  T6_POTION_TORNADO: { sell: 1600, buy: 2000 },
  T7_POTION_REVIVE: { sell: 14_000, buy: 15_400 },
  "T7_POTION_REVIVE@1": { sell: 32_000, buy: 34_500 },
  "T7_POTION_REVIVE@2": { sell: 61_000, buy: 65_500 },
  "T7_POTION_REVIVE@3": { sell: 160_000, buy: 171_000 },
  T7_POTION_STONESKIN: { sell: 14_500, buy: 15_950 },
  "T7_POTION_STONESKIN@1": { sell: 33_000, buy: 35_500 },
  "T7_POTION_STONESKIN@2": { sell: 58_000, buy: 62_000 },
  "T7_POTION_STONESKIN@3": { sell: 145_000, buy: 155_000 },
  T7_POTION_SLOWFIELD: { sell: 14_000, buy: 15_400 },
  T7_POTION_MOB_RESET: { sell: 8000, buy: 12_000 },
  T7_POTION_CLEANSE2: { sell: 3500, buy: 5000 },
  T7_POTION_ACID: { sell: 4000, buy: 5500 },
  T8_POTION_CLEANSE: { sell: 6850, buy: 15_150 },
  T8_POTION_COOLDOWN: { sell: 7500, buy: 10_000 },
  T8_POTION_BERSERK: { sell: 8500, buy: 11_000 },
  T8_POTION_LAVA: { sell: 8000, buy: 10_500 },
  T8_POTION_GATHER: { sell: 12_000, buy: 15_000 },
  T8_POTION_TORNADO: { sell: 9000, buy: 12_000 },
  // Stalker corrupted kit (approximate Caerleon buy prices for death-cost modeling)
  T6_HEAD_PLATE_SET1: { sell: 45_000, buy: 52_000 },
  T6_ARMOR_LEATHER_SET1: { sell: 72_000, buy: 82_000 },
  T6_SHOES_PLATE_SET1: { sell: 42_000, buy: 48_000 },
  T6_2H_CLAYMORE: { sell: 95_000, buy: 108_000 },
  T6_MAIN_RAPIER_MORGANA: { sell: 82_000, buy: 95_000 },
  T4_HEAD_CLOTH_SET1: { sell: 15_000, buy: 18_000 },
  T4_CAPEITEM_FW_THETFORD: { sell: 37_600, buy: 42_000 },
  // Crafting inputs (potions guide)
  T1_ALCHEMY_EXTRACT_LEVEL1: { sell: 2500, buy: 2800 },
  T1_ALCHEMY_EXTRACT_LEVEL2: { sell: 8500, buy: 9500 },
  T1_ALCHEMY_EXTRACT_LEVEL3: { sell: 36_000, buy: 40_000 },
  T2_AGARIC: { sell: 25, buy: 32 },
  T3_COMFREY: { sell: 480, buy: 526 },
  "T3_COMFREY@1": { sell: 1250, buy: 1380 },
  "T3_COMFREY@2": { sell: 3100, buy: 3450 },
  "T3_COMFREY@3": { sell: 7700, buy: 8600 },
  T3_EGG: { sell: 38, buy: 45 },
  "T3_EGG@1": { sell: 98, buy: 115 },
  "T3_EGG@2": { sell: 240, buy: 280 },
  "T3_EGG@3": { sell: 600, buy: 700 },
  T4_BURDOCK: { sell: 496, buy: 545 },
  "T4_BURDOCK@1": { sell: 1280, buy: 1420 },
  "T4_BURDOCK@2": { sell: 3200, buy: 3550 },
  "T4_BURDOCK@3": { sell: 8000, buy: 8900 },
  T5_EGG: { sell: 430, buy: 470 },
  "T5_EGG@1": { sell: 1100, buy: 1220 },
  "T5_EGG@2": { sell: 2750, buy: 3050 },
  "T5_EGG@3": { sell: 6900, buy: 7600 },
  T5_TEASEL: { sell: 482, buy: 530 },
  "T5_TEASEL@1": { sell: 1250, buy: 1380 },
  "T5_TEASEL@2": { sell: 3100, buy: 3450 },
  "T5_TEASEL@3": { sell: 7700, buy: 8600 },
  T6_FOXGLOVE: { sell: 500, buy: 550 },
  "T6_FOXGLOVE@1": { sell: 1300, buy: 1450 },
  "T6_FOXGLOVE@2": { sell: 3200, buy: 3600 },
  "T6_FOXGLOVE@3": { sell: 8000, buy: 9000 },
  T6_ALCOHOL: { sell: 410, buy: 450 },
  "T6_ALCOHOL@1": { sell: 1050, buy: 1180 },
  "T6_ALCOHOL@2": { sell: 2600, buy: 2900 },
  "T6_ALCOHOL@3": { sell: 6500, buy: 7200 },
  T6_MILK: { sell: 410, buy: 450 },
  "T6_MILK@1": { sell: 1050, buy: 1180 },
  "T6_MILK@2": { sell: 2600, buy: 2900 },
  "T6_MILK@3": { sell: 6500, buy: 7200 },
  T6_BUTTER: { sell: 180, buy: 220 },
  T7_MULLEIN: { sell: 528, buy: 580 },
  "T7_MULLEIN@1": { sell: 1370, buy: 1510 },
  "T7_MULLEIN@2": { sell: 3400, buy: 3780 },
  "T7_MULLEIN@3": { sell: 8500, buy: 9450 },
  T7_ALCOHOL: { sell: 468, buy: 514 },
  "T7_ALCOHOL@1": { sell: 1210, buy: 1340 },
  "T7_ALCOHOL@2": { sell: 3000, buy: 3350 },
  "T7_ALCOHOL@3": { sell: 7500, buy: 8400 },
  T8_YARROW: { sell: 4200, buy: 5000 },
  T8_MILK: { sell: 520, buy: 620 },
  T8_ALCOHOL: { sell: 2800, buy: 3400 },
  T8_BUTTER: { sell: 650, buy: 800 },
  // T8 laborer house materials
  T2_STONEBLOCK: { sell: 15, buy: 18 },
  T3_STONEBLOCK: { sell: 38, buy: 45 },
  T4_STONEBLOCK: { sell: 95, buy: 110 },
  T5_STONEBLOCK: { sell: 240, buy: 280 },
  T6_STONEBLOCK: { sell: 620, buy: 720 },
  T7_STONEBLOCK: { sell: 1600, buy: 1850 },
  T8_STONEBLOCK: { sell: 4100, buy: 4800 },
  T8_FURNITUREITEM_BED: { sell: 24_000, buy: 28_000 },
  T8_FURNITUREITEM_TABLE: { sell: 27_000, buy: 32_000 },
  T8_FURNITUREITEM_TROPHY_GENERAL: { sell: 38_000, buy: 45_000 },
  T8_FURNITUREITEM_TROPHY_ORE: { sell: 40_000, buy: 48_000 },
  T8_FURNITUREITEM_TROPHY_WOOD: { sell: 40_000, buy: 48_000 },
  T8_FURNITUREITEM_TROPHY_FIBER: { sell: 40_000, buy: 48_000 },
  T8_FURNITUREITEM_TROPHY_HIDE: { sell: 40_000, buy: 48_000 },
  T8_FURNITUREITEM_TROPHY_ROCK: { sell: 40_000, buy: 48_000 },
  T8_FURNITUREITEM_TROPHY_FISH: { sell: 160_173, buy: 130_000 },
  T8_FURNITUREITEM_TROPHY_MERCENARY: { sell: 20_224, buy: 16_500 },
};


function parseTier(itemId: string): number {
  const match = itemId.match(/^T(\d+)/);
  return match ? Number.parseInt(match[1]!, 10) : 4;
}

function scale(base: number, tier: number, referenceTier = 4, ratio = 1.9): number {
  return Math.round(base * ratio ** (tier - referenceTier));
}

/** Pattern-based estimates for loadout gear and items not in the map above. */
function inferFallbackPrice(
  itemId: string,
  side: "buy" | "sell",
): number | null {
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

export function getItemPriceFallback(
  itemId: string,
  side: "buy" | "sell" = "sell",
): number | null {
  const entry = ITEM_PRICE_FALLBACKS[itemId];
  if (entry) {
    if (side === "buy") {
      return entry.buy ?? entry.sell ?? null;
    }
    return entry.sell ?? entry.buy ?? null;
  }

  const enchantMatch = itemId.match(/^(.+)@(\d+)$/);
  if (enchantMatch) {
    const baseId = enchantMatch[1]!;
    const level = Number.parseInt(enchantMatch[2]!, 10);
    const basePrice = getItemPriceFallback(baseId, side);
    if (basePrice != null && level >= 1) {
      const multipliers: Record<number, { buy: number; sell: number }> = {
        1: { buy: 2.6, sell: 2.6 },
        2: { buy: 6.5, sell: 6.5 },
        3: { buy: 16, sell: 16 },
      };
      const mult = multipliers[level] ?? { buy: 1, sell: 1 };
      const multiplier = side === "buy" ? mult.buy : mult.sell;
      return Math.round(basePrice * multiplier);
    }
  }

  return inferFallbackPrice(itemId, side);
}
