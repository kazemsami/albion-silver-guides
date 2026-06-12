import type { GuideEconomics } from "@/types/guide";
import {
  buildLaborerHourlyEconomics,
  DEFAULT_LABORER_SPECIALTY_ID,
  getLaborerSpecialty,
} from "@/data/laborer-specialties";
import type { HourlyItem } from "@/types/guide";
import { SKILL_TIERS, tiers } from "@/data/guide-skill-tiers";
import { getT2RoamVerifiedHourlyOutput } from "@/data/t2-roam-verified-loot";

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

/** T7 gear: ~3 T7/down + ~2 T8 per cast → 2/5 of fish are Sturgeon. */
const AVA_T7_STURGEON_SHARE = 2 / 5;
/** T8 gear: ~4 T7/down + ~3 T8 per cast → 3/7 of fish are Sturgeon. */
const AVA_T8_STURGEON_SHARE = 3 / 7;

/** Per-hour yields at skill tier multiplier 1.0, profit is scaled by chosen skill level. */
export const guideEconomicsBySlug: Record<string, GuideEconomics> = {
  "t4-ore-mining-yellow-zone": {
    hourlyOutput: [
      { id: "T4_ORE", name: "Iron Ore", quantity: 2000 },
      { id: "T4_JOURNAL_ORE_FULL", name: "Adept Prospector's Journal (Full)", quantity: 1 },
    ],
    hourlyConsumables: [{ id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 1 }],
    skillTiers: tiers(
      SKILL_TIERS.gatheringLow,
      SKILL_TIERS.gatheringMid,
      SKILL_TIERS.gatheringHigh,
    ),
    defaultSkillTierId: "mid",
  },
  "fiber-farming-solo": {
    hourlyOutput: [
      { id: "T5_FIBER", name: "Skyflower", quantity: 900 },
      { id: "T4_FIBER", name: "Hemp", quantity: 400 },
      { id: "T4_JOURNAL_FIBER_FULL", name: "Adept Cropper's Journal (Full)", quantity: 2 },
    ],
    hourlyConsumables: [{ id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 1 }],
    skillTiers: tiers(
      SKILL_TIERS.gatheringLow,
      SKILL_TIERS.gatheringMid,
      SKILL_TIERS.gatheringHigh,
    ),
    defaultSkillTierId: "mid",
  },
  "solo-dungeon-farming": {
    hourlyOutput: [
      { id: "T6_RUNE", name: "Master's Rune", quantity: 400 },
      { id: "T6_SOUL", name: "Master's Soul", quantity: 120 },
      { id: "T6_LEATHER", name: "Hardened Leather", quantity: 25 },
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
        estimatedSilverPerUnit: 650_000,
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
    // Shared drop from any veteran kill; target-specific loot lives in skill-tier bonusOutput.
    hourlyOutput: [
      { id: "T1_ALCHEMY_COMMON", name: "Rare Animal Remains", quantity: 38 },
    ],
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
    skillTiers: tiers(
      SKILL_TIERS.trackingT6Red,
      SKILL_TIERS.trackingT7Veteran,
      SKILL_TIERS.trackingT8Expert,
    ),
    defaultSkillTierId: "t7-veteran",
  },
  "corrupted-dungeons-pvpve": {
    hourlyOutput: [
      { id: "T7_SOUL", name: "Grandmaster's Soul", quantity: 180 },
      { id: "T6_RUNE", name: "Master's Rune", quantity: 350 },
      { id: "T8_SOUL", name: "Elder's Soul", quantity: 40 },
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
  "t2-blackzone-roaming": {
    hourlyOutput: getT2RoamVerifiedHourlyOutput(),
    hourlyInputs: [
      {
        id: "T4_JOURNAL_FISHING_EMPTY",
        name: "Empty fisher journals (restock)",
        quantity: 2,
        side: "buy",
      },
      {
        id: "T2_MAIN_FIRESTAFF",
        name: "Full T2 kit replacement (avg deaths/hr)",
        quantity: 0.15,
        side: "buy",
      },
    ],
    hourlyConsumables: [
      { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
      { id: "T4_MEAL_STEW", name: "Goat Stew", quantity: 2 },
      { id: "T3_POTION_STONESKIN", name: "Minor Resistance Potion", quantity: 2 },
      { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", quantity: 1 },
    ],
    skillTiers: tiers(
      SKILL_TIERS.bzRoamingLearning,
      SKILL_TIERS.bzRoamingVerified,
      SKILL_TIERS.bzRoamingHot,
    ),
    defaultSkillTierId: "verified",
  },
  "shoreline-fishing-guide": {
    hourlyOutput: [
      { id: "T1_FISHCHOPS", name: "Chopped Fish", quantity: 280 },
      { id: "T1_SEAWEED", name: "Seaweed", quantity: 90 },
    ],
    hourlyConsumables: [
      { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 12 },
      { id: "T4_MEAL_STEW", name: "Goat Stew", quantity: 1 },
    ],
    skillTiers: tiers(
      SKILL_TIERS.fishing10_30,
      { ...SKILL_TIERS.fishing30_60, label: "Fishing 20-40", id: "20-40" },
      { ...SKILL_TIERS.fishing60plus, label: "Fishing 40+", id: "40+", outputMultiplier: 1.15 },
    ),
    defaultSkillTierId: "20-40",
  },
  "mists-fishing": {
    hourlyOutput: [
      { id: "T1_FISHCHOPS", name: "Chopped Fish", quantity: 3200 },
      { id: "T1_SEAWEED", name: "Seaweed", quantity: 120 },
      { id: "T7_JOURNAL_FISHING_FULL", name: "Grandmaster Fisherman's Journal (Full)", quantity: 1 },
    ],
    hourlyInputs: [
      { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", quantity: 1, side: "buy" },
    ],
    hourlyConsumables: [
      { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
      { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
    ],
    skillTiers: tiers(
      SKILL_TIERS.fishing10_30,
      {
        ...SKILL_TIERS.fishing30_60,
        description:
          "Master's gear, fish in T7 yellow Mist. Snapper is a random zone-tier catch, not a separate school.",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (T7 yellow mist, avg)",
            quantity: 0.25,
          },
        ],
      },
      {
        ...SKILL_TIERS.fishing60plus,
        description:
          "Grandmaster gear, T7 yellow Mist. Best Snapper odds from zone-tier fishing, not dedicated schools.",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (T7 yellow mist, avg)",
            quantity: 0.4,
          },
        ],
      },
    ),
    defaultSkillTierId: "30-60",
  },
  "ava-roads-fishing": {
    // 350-550 fish/hr by gear; T8 baseline 450 fish → 193 Sturgeon + 257 butchered × 15 chops
    hourlyOutput: avaRoadsFishOutput(450, AVA_T8_STURGEON_SHARE),
    hourlyInputs: [
      { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", quantity: 1, side: "buy" },
    ],
    hourlyConsumables: [
      { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
      { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
      { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", quantity: 1 },
    ],
    skillTiers: tiers(
      {
        ...SKILL_TIERS.avaSafe,
        hourlyOutput: avaRoadsFishOutput(345, AVA_T7_STURGEON_SHARE),
        hourlyConsumables: [
          { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
          { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
        ],
      },
      {
        ...SKILL_TIERS.avaGrandmaster,
        hourlyOutput: avaRoadsFishOutput(400, AVA_T7_STURGEON_SHARE),
        description:
          "T7 fisherman set, ~400 fish/hr, 2/5 Sturgeon and 3/5 butchered to chops",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (avg)",
            quantity: 0.35,
          },
        ],
      },
      {
        ...SKILL_TIERS.avaProfit,
        description:
          "T8 fisherman set, ~450 fish/hr, 3/7 Sturgeon and 4/7 butchered to chops",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (avg)",
            quantity: 0.5,
          },
        ],
      },
      {
        ...SKILL_TIERS.avaExpert,
        hourlyOutput: avaRoadsFishOutput(550, AVA_T8_STURGEON_SHARE),
        description:
          "T8 max spec, ~550 fish/hr on deep T8 road maps. Sturgeon/Snapper from zone-tier RNG on normal schools.",
        bonusOutput: [
          {
            id: "T7_FISH_FRESHWATER_AVALON_RARE",
            name: "Puremist Snapper (avg)",
            quantity: 1.35,
          },
        ],
      },
    ),
    defaultSkillTierId: "profit",
  },
  "laborer-passive-income": {
    /** T8 houses, T7 journals, 150% yield, all laborers same specialty; baseline 10 laborers, 22h per job. */
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
