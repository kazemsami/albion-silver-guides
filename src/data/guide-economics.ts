import type { GuideEconomics } from "@/types/guide";
import {
  buildLaborerHourlyEconomics,
  DEFAULT_LABORER_SPECIALTY_ID,
  getLaborerSpecialty,
} from "@/data/laborer-specialties";
import type { HourlyItem } from "@/types/guide";
import { SKILL_TIERS, tiers } from "@/data/guide-skill-tiers";
import {
  AVA_T7_STURGEON_SHARE,
  AVA_T8_STURGEON_SHARE,
  PUREMIST_SNAPPER_PER_CATCH,
} from "@/data/ava-roads-economics";
import {
  TRACKING_AVERAGE_LOOT_PER_KILL,
  TRACKING_TIER_CONFIGS,
} from "@/data/tracking-economics";

/** Butchered T7-and-lower bycatch → chopped fish (avg). */
const AVA_CHOPS_PER_FISH = 15;

/** Split total fish/hr into Sturgeon (sold raw) vs butchered bycatch → chops. */
function avaRoadsFishOutput(
  totalFish: number,
  sturgeonFraction: number,
): HourlyItem[] {
  const sturgeon = Math.round(totalFish * sturgeonFraction);
  const butchered = totalFish - sturgeon;
  return [
    {
      id: "T8_FISH_FRESHWATER_ALL_COMMON",
      name: "River Sturgeon",
      quantity: sturgeon,
    },
    {
      id: "T1_FISHCHOPS",
      name: "Chopped Fish (butchered bycatch)",
      quantity: butchered * AVA_CHOPS_PER_FISH,
    },
    {
      id: "T7_JOURNAL_FISHING_FULL",
      name: "Grandmaster Fisherman's Journal (Full)",
      quantity: 1,
    },
  ];
}

const AVA_FISHING_JOURNAL_EMPTY: HourlyItem = {
  id: "T7_JOURNAL_FISHING_EMPTY",
  name: "Grandmaster Fisherman's Journal (Empty)",
  quantity: 1,
  side: "sell",
};

function avaRoadsDeathInputs(
  deathRate: number,
  geared: boolean,
  fishingRodId: "T7_2H_TOOL_FISHINGROD" | "T8_2H_TOOL_FISHINGROD" = "T8_2H_TOOL_FISHINGROD",
): HourlyItem[] {
  const base: HourlyItem[] = [
    {
      id: "T4_MAIN_RAPIER_MORGANA",
      name: "Bloodletter (death replacement)",
      quantity: deathRate,
      side: "buy",
    },
    {
      id: "T4_CAPEITEM_FW_FORTSTERLING",
      name: "Fort Sterling Cape (death replacement)",
      quantity: deathRate,
      side: "buy",
    },
  ];

  if (geared) {
    return [
      AVA_FISHING_JOURNAL_EMPTY,
      ...base,
      {
        id: "T5_BAG",
        name: "Bag (death replacement)",
        quantity: deathRate,
        side: "buy",
      },
      {
        id: "T4_MOUNT_GIANTSTAG",
        name: "Giant Stag (death replacement)",
        quantity: deathRate,
        side: "buy",
      },
      {
        id: fishingRodId,
        name: "Fishing rod (death replacement)",
        quantity: deathRate * 0.65,
        side: "buy",
      },
    ];
  }

  return [
    AVA_FISHING_JOURNAL_EMPTY,
    ...base,
    {
      id: "T4_BAG",
      name: "Bag (death replacement)",
      quantity: deathRate,
      side: "buy",
    },
    {
      id: "T3_MOUNT_HORSE",
      name: "Riding horse (death replacement)",
      quantity: deathRate,
      side: "buy",
    },
  ];
}

/** Bonus enchanted fiber spawns on Lazygrass Plain loops (mid/advanced tiers only). */
const FIBER_ENCHANT_BONUS_LOW: HourlyItem[] = [
  { id: "T4_FIBER_LEVEL2@2", name: "Rare Hemp", quantity: 4 },
];
const FIBER_ENCHANT_BONUS_MID: HourlyItem[] = [
  { id: "T4_FIBER_LEVEL2@2", name: "Rare Hemp", quantity: 8 },
  { id: "T5_FIBER_LEVEL1@1", name: "Uncommon Skyflower", quantity: 6 },
  { id: "T5_FIBER_LEVEL2@2", name: "Rare Skyflower", quantity: 5 },
];
const FIBER_ENCHANT_BONUS_HIGH: HourlyItem[] = [
  { id: "T4_FIBER_LEVEL2@2", name: "Rare Hemp", quantity: 12 },
  { id: "T5_FIBER_LEVEL1@1", name: "Uncommon Skyflower", quantity: 10 },
  { id: "T5_FIBER_LEVEL2@2", name: "Rare Skyflower", quantity: 8 },
];

/** Bonus enchanted ore from logged mid-tier runs (not available at beginner T4). 30-min ×1.9/hr. */
const ORE_ENCHANT_BONUS_MID: HourlyItem[] = [
  { id: "T4_ORE_LEVEL1@1", name: "Uncommon Iron Ore", quantity: 53 },
  { id: "T5_ORE_LEVEL1@1", name: "Uncommon Titanium Ore", quantity: 32 },
];
const ORE_ENCHANT_BONUS_HIGH: HourlyItem[] = [
  { id: "T4_ORE_LEVEL1@1", name: "Uncommon Iron Ore", quantity: 68 },
  { id: "T5_ORE_LEVEL1@1", name: "Uncommon Titanium Ore", quantity: 41 },
];

/** Per-hour yields at skill tier multiplier 1.0, profit is scaled by chosen skill level. */
export const guideEconomicsBySlug: Record<string, GuideEconomics> = {
  "t4-ore-mining-yellow-zone": {
    gatherYieldBaseline: "standard",
    hourlyOutput: [
      { id: "T4_ORE", name: "Iron Ore", quantity: 361 },
      { id: "T3_ORE", name: "Tin Ore", quantity: 770 },
      { id: "T5_ORE", name: "Titanium Ore", quantity: 129 },
    ],
    hourlyInputs: [],
    hourlyConsumables: [{ id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 1 }],
    skillTiers: tiers(
      {
        ...SKILL_TIERS.gatheringLow,
        consumableMultiplier: 1,
        description:
          "T4 miner gear + Pork Pie, flat iron and tin only (no titanium or enchanted ore)",
        hourlyOutput: [
          { id: "T4_ORE", name: "Iron Ore", quantity: 361 },
          { id: "T3_ORE", name: "Tin Ore", quantity: 770 },
        ],
      },
      {
        ...SKILL_TIERS.gatheringMid,
        consumableMultiplier: 1,
        description:
          "T5 miner gear + Pork Pie + bag, Eldon Hill (Martlock). Logged 30-min run mining every node on path, extrapolated to 1 hr at ×1.9.",
        bonusOutput: ORE_ENCHANT_BONUS_MID,
      },
      {
        ...SKILL_TIERS.gatheringHigh,
        consumableMultiplier: 1,
        description:
          "Iron-focused route + Pork Pie: skip tin, prioritize iron and titanium (projected ~15% more iron/hr, not logged)",
        outputMultiplier: 1.15,
        bonusOutput: ORE_ENCHANT_BONUS_HIGH,
      },
    ),
    defaultSkillTierId: "mid",
  },
  "fiber-farming-solo": {
    gatherYieldBaseline: "standard",
    hourlyOutput: [
      { id: "T5_FIBER", name: "Skyflower", quantity: 282 },
      { id: "T4_FIBER", name: "Hemp", quantity: 500 },
      { id: "T3_FIBER", name: "Flax", quantity: 450 },
      { id: "T5_JOURNAL_FIBER_FULL", name: "Expert Cropper's Journal (Full)", quantity: 2 },
    ],
    hourlyInputs: [
      {
        id: "T5_JOURNAL_FIBER_EMPTY",
        name: "Expert Cropper's Journal (Empty)",
        quantity: 2,
        side: "sell",
      },
    ],
    hourlyConsumables: [{ id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 1 }],
    skillTiers: tiers(
      {
        ...SKILL_TIERS.gatheringLow,
        consumableMultiplier: 1,
        hourlyOutput: [
          { id: "T5_FIBER", name: "Skyflower", quantity: 155 },
          { id: "T4_FIBER", name: "Hemp", quantity: 275 },
          { id: "T3_FIBER", name: "Flax", quantity: 248 },
          { id: "T4_JOURNAL_FIBER_FULL", name: "Adept Cropper's Journal (Full)", quantity: 1.5 },
        ],
        hourlyInputs: [
          {
            id: "T4_JOURNAL_FIBER_EMPTY",
            name: "Adept Cropper's Journal (Empty)",
            quantity: 1.5,
            side: "sell",
          },
        ],
        bonusOutput: FIBER_ENCHANT_BONUS_LOW,
        description:
          "T4 harvester gear + Pork Pie, flat fiber only; rare hemp at most (no skyflower enchants)",
      },
      {
        ...SKILL_TIERS.gatheringMid,
        consumableMultiplier: 1,
        bonusOutput: FIBER_ENCHANT_BONUS_MID,
      },
      {
        ...SKILL_TIERS.gatheringHigh,
        consumableMultiplier: 1,
        bonusOutput: FIBER_ENCHANT_BONUS_HIGH,
      },
    ),
    defaultSkillTierId: "mid",
  },
  "solo-dungeon-farming": {
    hourlyOutput: [
      { id: "T6_RUNE", name: "Master's Rune", quantity: 400 },
      { id: "T6_SOUL", name: "Master's Soul", quantity: 120 },
      { id: "T6_LEATHER", name: "Hardened Leather", quantity: 25 },
    ],
    hourlyInputs: [
      {
        id: "T4_HEAD_CLOTH_SET1",
        name: "Adept's Scholar Cowl (kit replacement)",
        quantity: 0.08,
        side: "buy",
      },
      {
        id: "T6_ARMOR_LEATHER_SET1",
        name: "Master's Mercenary Jacket (kit replacement)",
        quantity: 0.08,
        side: "buy",
      },
      {
        id: "T6_SHOES_PLATE_SET1",
        name: "Master's Soldier Boots (kit replacement)",
        quantity: 0.08,
        side: "buy",
      },
      {
        id: "T6_MAIN_RAPIER_MORGANA",
        name: "Master's Bloodletter (kit replacement)",
        quantity: 0.08,
        side: "buy",
      },
      {
        id: "T4_CAPEITEM_FW_THETFORD",
        name: "Adept's Thetford Cape (kit replacement)",
        quantity: 0.08,
        side: "buy",
      },
    ],
    hourlyConsumables: [
      { id: "T6_MEAL_STEW", name: "Mutton Stew", quantity: 2 },
      { id: "T6_POTION_HEAL", name: "Major Healing Potion", quantity: 3 },
    ],
    skillTiers: tiers(
      SKILL_TIERS.dungeonYellow,
      SKILL_TIERS.dungeonRed,
      SKILL_TIERS.dungeonBlack,
    ),
    defaultSkillTierId: "red",
  },
  "abyssal-depths-farming": {
    // Baseline ~1M/hr floor-2 extract; duo soul PvP pushes higher. One ~45 min run per hour with queue.
    hourlyOutput: [
      {
        id: "T4_RUNE",
        name: "Silver bags (safe in inventory until death)",
        quantity: 1,
        fixedSilverPerUnit: 500_000,
      },
      { id: "T7_RUNE", name: "Grandmaster's Rune (room + altar chests)", quantity: 140 },
      { id: "T6_SOUL", name: "Master's Soul", quantity: 90 },
      { id: "T8_RUNE", name: "Elder's Rune (floor 2–3 chests)", quantity: 45 },
    ],
    hourlyInputs: [
      {
        id: "T8_JOURNAL_MERCENARY_EMPTY",
        name: "T8 mercenary journals (optional floor-3 fill, death risk)",
        quantity: 2,
        side: "buy",
      },
    ],
    hourlyConsumables: [
      { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
      { id: "T6_POTION_HEAL", name: "Major Healing Potion", quantity: 4 },
      { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", quantity: 1 },
    ],
    skillTiers: tiers(
      SKILL_TIERS.depthsLearning,
      SKILL_TIERS.depthsStandard,
      SKILL_TIERS.depthsExpert,
    ),
    defaultSkillTierId: "standard",
  },
  "high-tier-group-tracking": {
    // Average mixed Roads loot from a ~22 kill session (20-24 kills), scaled to 7 kills/hr.
    hourlyOutput: TRACKING_AVERAGE_LOOT_PER_KILL.map((loot) => ({
      id: loot.id,
      name: loot.name,
      quantity: Math.round(loot.perKill * TRACKING_TIER_CONFIGS[0]!.killsPerHour * 10) / 10,
    })),
    hourlyConsumables: [
      {
        id: "T7_2H_TOOL_TRACKING",
        name: "Grandmaster's Tracking Toolkit",
        quantity: 0.2,
      },
      { id: "T6_MEAL_SANDWICH", name: "Beef Sandwich", quantity: 1.2 },
      { id: "T6_POTION_HEAL", name: "Major Healing Potion", quantity: 3 },
      { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", quantity: 1 },
      { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", quantity: 0.4 },
    ],
    skillTiers: tiers(SKILL_TIERS.trackingAvaRoads),
    defaultSkillTierId: "ava-roads",
  },
  "corrupted-dungeons-pvpve": {
    // Conservative soul/rune pace for completed Stalker runs; not peak ZvZ liquidity.
    // Kit replacement = ~0.3 full-loot deaths/hr at Stalker (banish via shards or flee unfavorable invasions).
    hourlyOutput: [
      { id: "T7_SOUL", name: "Grandmaster's Soul", quantity: 110 },
      { id: "T6_RUNE", name: "Master's Rune", quantity: 220 },
      { id: "T8_SOUL", name: "Elder's Soul", quantity: 22 },
    ],
    hourlyInputs: [
      {
        id: "T6_HEAD_PLATE_SET1",
        name: "Master's Soldier Helmet (kit replacement)",
        quantity: 0.3,
        side: "buy",
      },
      {
        id: "T6_ARMOR_LEATHER_SET1",
        name: "Master's Mercenary Jacket (kit replacement)",
        quantity: 0.3,
        side: "buy",
      },
      {
        id: "T6_SHOES_PLATE_SET1",
        name: "Master's Soldier Boots (kit replacement)",
        quantity: 0.3,
        side: "buy",
      },
      {
        id: "T6_2H_CLAYMORE",
        name: "Master's Claymore (kit replacement)",
        quantity: 0.3,
        side: "buy",
      },
      {
        id: "T4_CAPEITEM_FW_THETFORD",
        name: "Adept's Thetford Cape (kit replacement)",
        quantity: 0.3,
        side: "buy",
      },
    ],
    hourlyConsumables: [
      { id: "T6_MEAL_STEW", name: "Mutton Stew", quantity: 2 },
      { id: "T6_POTION_HEAL", name: "Major Healing Potion", quantity: 4 },
      { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", quantity: 2 },
    ],
    skillTiers: tiers(
      SKILL_TIERS.corruptedHunter,
      SKILL_TIERS.corruptedStalker,
      SKILL_TIERS.corruptedSlayer,
    ),
    defaultSkillTierId: "stalker",
  },
  "mists-fishing": {
    hourlyOutput: [
      { id: "T1_FISHCHOPS", name: "Chopped Fish", quantity: 3200 },
      { id: "T1_SEAWEED", name: "Seaweed", quantity: 120 },
    ],
    hourlyInputs: [],
    hourlyConsumables: [
      { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
      { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
    ],
    skillTiers: tiers(
      {
        ...SKILL_TIERS.fishing10_30,
        description:
          "Uncommon starting mist, chopped fish income. No T7 journal or Snapper modeled.",
      },
      {
        ...SKILL_TIERS.fishing30_60,
        description:
          "Hunt Rare+ nested mists for T7 zones. Slow journal fill (~0.15/hr) and low Snapper odds at this level.",
        hourlyOutput: [
          { id: "T1_FISHCHOPS", name: "Chopped Fish", quantity: 3200 },
          { id: "T1_SEAWEED", name: "Seaweed", quantity: 120 },
          {
            id: "T7_JOURNAL_FISHING_FULL",
            name: "Grandmaster Fisherman's Journal (Full)",
            quantity: 0.15,
          },
        ],
        hourlyInputs: [
          {
            id: "T7_JOURNAL_FISHING_EMPTY",
            name: "Grandmaster Fisherman's Journal (Empty)",
            quantity: 0.15,
            side: "sell",
          },
        ],
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (Rare+ T7 mist, avg)",
            quantity: 0.08 * PUREMIST_SNAPPER_PER_CATCH,
          },
        ],
      },
      {
        ...SKILL_TIERS.fishing60plus,
        description:
          "Rare/Epic/Legendary T7 mists with GM gear. ~1 T7 journal/hr and best Snapper odds when you find good zones.",
        hourlyOutput: [
          { id: "T1_FISHCHOPS", name: "Chopped Fish", quantity: 3200 },
          { id: "T1_SEAWEED", name: "Seaweed", quantity: 120 },
          {
            id: "T7_JOURNAL_FISHING_FULL",
            name: "Grandmaster Fisherman's Journal (Full)",
            quantity: 1,
          },
        ],
        hourlyInputs: [
          {
            id: "T7_JOURNAL_FISHING_EMPTY",
            name: "Grandmaster Fisherman's Journal (Empty)",
            quantity: 1,
            side: "sell",
          },
        ],
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (Rare+ T7 mist, avg)",
            quantity: 0.4 * PUREMIST_SNAPPER_PER_CATCH,
          },
        ],
      },
    ),
    defaultSkillTierId: "30-60",
  },
  "ava-roads-fishing": {
    // 350-550 fish/hr by gear; T8 baseline 450 fish → 193 Sturgeon + 257 butchered × 15 chops
    hourlyOutput: avaRoadsFishOutput(450, AVA_T8_STURGEON_SHARE),
    hourlyInputs: avaRoadsDeathInputs(0.12, true),
    hourlyConsumables: [
      { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
      { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
      { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", quantity: 1 },
    ],
    skillTiers: tiers(
      {
        ...SKILL_TIERS.avaSafe,
        hourlyOutput: avaRoadsFishOutput(345, AVA_T7_STURGEON_SHARE),
        hourlyInputs: avaRoadsDeathInputs(0.06, false),
        hourlyConsumables: [
          { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
          { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
        ],
      },
      {
        ...SKILL_TIERS.avaGrandmaster,
        hourlyOutput: avaRoadsFishOutput(400, AVA_T7_STURGEON_SHARE),
        hourlyInputs: avaRoadsDeathInputs(0.1, true, "T7_2H_TOOL_FISHINGROD"),
        description:
          "T7 fisherman set, ~400 fish/hr, 2/5 Sturgeon and 3/5 butchered to chops",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (avg)",
            quantity: 0.35 * PUREMIST_SNAPPER_PER_CATCH,
          },
        ],
      },
      {
        ...SKILL_TIERS.avaProfit,
        hourlyInputs: avaRoadsDeathInputs(0.12, true, "T8_2H_TOOL_FISHINGROD"),
        description:
          "T8 fisherman set, ~450 fish/hr, 3/7 Sturgeon and 4/7 butchered to chops",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (avg)",
            quantity: 0.5 * PUREMIST_SNAPPER_PER_CATCH,
          },
        ],
      },
      {
        ...SKILL_TIERS.avaExpert,
        hourlyOutput: avaRoadsFishOutput(550, AVA_T8_STURGEON_SHARE),
        hourlyInputs: avaRoadsDeathInputs(0.18, true, "T8_2H_TOOL_FISHINGROD"),
        description:
          "T8 max spec, ~550 fish/hr on deep T8 road maps. Sturgeon/Snapper from zone-tier RNG on normal schools.",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (avg)",
            quantity: 1.35 * PUREMIST_SNAPPER_PER_CATCH,
          },
        ],
      },
    ),
    defaultSkillTierId: "grandmaster",
  },
  "laborer-passive-income": {
    /** T8 houses, T7 journals, 150% yield, all laborers same specialty; baseline 10 houses (30 laborers), 22h per job. */
    ...buildLaborerHourlyEconomics(
      getLaborerSpecialty(DEFAULT_LABORER_SPECIALTY_ID),
      SKILL_TIERS.laborerMid,
    ),
    skillTiers: tiers(
      SKILL_TIERS.laborerSmall,
      SKILL_TIERS.laborerMid,
      SKILL_TIERS.laborerLarge,
    ),
    defaultSkillTierId: "medium",
    defaultLaborerSpecialtyId: DEFAULT_LABORER_SPECIALTY_ID,
  },
  "potions-crafting-bulk": {
    // ~150 crafts/hr (2:1 heal-to-energy split) incl. buying and listing time, war pots excluded.
    hourlyOutput: [
      { id: "T6_POTION_HEAL", name: "Major Healing Potion", quantity: 500 },
      { id: "T6_POTION_ENERGY", name: "Major Energy Potion", quantity: 250 },
    ],
    hourlyInputs: [
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 10800, side: "buy" },
      { id: "T5_EGG", name: "Goose Eggs", quantity: 1800, side: "buy" },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 2700, side: "buy" },
      { id: "T6_MILK", name: "Sheep's Milk", quantity: 900, side: "buy" },
    ],
    skillTiers: tiers(
      SKILL_TIERS.craftingT5,
      SKILL_TIERS.craftingT6,
      {
        ...SKILL_TIERS.craftingT7,
        description:
          "T7 spec + focus, same T6 bulk; craft Gigantify / Resistance separately before CTAs",
      },
    ),
    defaultSkillTierId: "t6",
  },
};

export function getGuideEconomics(slug: string): GuideEconomics | undefined {
  return guideEconomicsBySlug[slug];
}
