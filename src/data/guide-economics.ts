import type { GuideEconomics } from "@/types/guide";
import {
  buildLaborerHourlyEconomics,
  DEFAULT_LABORER_SPECIALTY_ID,
  getLaborerSpecialty,
} from "@/data/laborer-specialties";
import type { HourlyItem } from "@/types/guide";
import { SKILL_TIERS, tiers } from "@/data/guide-skill-tiers";
import {
  AVA_GREEDY_LOGGED_CATCH_PER_HOUR,
  AVA_LOGGED_JOURNAL_FILL_PER_HOUR,
  AVA_NORMAL_LOGGED_CATCH_PER_HOUR,
  AVA_SAFE_LOGGED_CATCH_PER_HOUR,
  AVA_SAFE_LOGGED_JOURNAL_FILL_PER_HOUR,
  AVA_T7_STURGEON_SHARE,
  AVA_T8_STURGEON_SHARE,
  PUREMIST_SNAPPER_PER_CATCH,
  type AvaLoggedCatchLine,
} from "@/data/ava-roads-economics";
import {
  MISTS_LOGGED_CHOPS_PER_HOUR,
  MISTS_LOGGED_JOURNAL_FILL_PER_HOUR,
  MISTS_MAX_SPEC_CHOPS_PER_HOUR,
  MISTS_MAX_SPEC_FISH_YIELD_PERCENT,
  MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_30_60,
  MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_60PLUS,
  MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_MAX_SPEC,
  MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_PREMIUM,
  MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_STANDARD,
  MISTS_PUREMIST_SNAPPER_PER_CATCH_MAX_SPEC_PREMIUM,
  MISTS_PUREMIST_SNAPPER_PER_CATCH_MAX_SPEC_STANDARD,
  mistsPuremistSnapperBonusLine,
} from "@/data/mists-economics";
import {
  TRACKING_AVERAGE_LOOT_PER_KILL,
  TRACKING_TIER_CONFIGS,
} from "@/data/tracking-economics";

/** Butchered T7-and-lower bycatch → chopped fish (avg). */
const AVA_CHOPS_PER_FISH = 15;

function avaLoggedCatchHourlyOutput(
  catchLines: AvaLoggedCatchLine[],
  journalName: string,
  journalQuantity: number,
): HourlyItem[] {
  return [
    ...catchLines.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantityPerHour,
    })),
    {
      id: "T7_JOURNAL_FISHING_FULL",
      name: journalName,
      quantity: journalQuantity,
    },
  ];
}

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
    gatherYieldBaseline: "standard",
    hourlyOutput: [
      { id: "T1_FISHCHOPS", name: "Chopped Fish", quantity: MISTS_LOGGED_CHOPS_PER_HOUR },
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
          "Uncommon starting mist, chopped fish only. No T7 journal or Snapper modeled.",
      },
      {
        ...SKILL_TIERS.fishing30_60,
        description:
          "Hunt Epic and Legendary nested mists for dependable T7 zones. Scaled below the logged T7 gear session; slow Snapper odds.",
        hourlyOutput: [
          {
            id: "T1_FISHCHOPS",
            name: "Chopped Fish",
            quantity: Math.round(MISTS_LOGGED_CHOPS_PER_HOUR * 0.85),
          },
          {
            id: "T7_JOURNAL_FISHING_FULL",
            name: "Grandmaster Fisherman's Journal (Full)",
            quantity: Math.round(MISTS_LOGGED_JOURNAL_FILL_PER_HOUR * 0.85 * 100) / 100,
          },
        ],
        hourlyInputs: [
          {
            id: "T7_JOURNAL_FISHING_EMPTY",
            name: "Grandmaster Fisherman's Journal (Empty)",
            quantity: Math.round(MISTS_LOGGED_JOURNAL_FILL_PER_HOUR * 0.85 * 100) / 100,
            side: "sell",
          },
        ],
        bonusOutput: [
          mistsPuremistSnapperBonusLine(
            MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_30_60,
            MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_STANDARD,
            MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_PREMIUM,
          ),
        ],
      },
      {
        ...SKILL_TIERS.fishing60plus,
        description:
          "Logged 30-min yellow Mists run (2026-06-14): T7 fisherman set, T7 Avalonian rod, Pork Pie, no Premium. 1,171 chopped fish and 5,580/6,640 journal fill extrapolated to 1 hr. Snapper is RNG upside.",
        hourlyOutput: [
          {
            id: "T1_FISHCHOPS",
            name: "Chopped Fish",
            quantity: MISTS_LOGGED_CHOPS_PER_HOUR,
          },
          {
            id: "T7_JOURNAL_FISHING_FULL",
            name: "Grandmaster Fisherman's Journal (Full, 84% per 30 min logged)",
            quantity: MISTS_LOGGED_JOURNAL_FILL_PER_HOUR,
          },
        ],
        hourlyInputs: [
          {
            id: "T7_JOURNAL_FISHING_EMPTY",
            name: "Grandmaster Fisherman's Journal (Empty)",
            quantity: MISTS_LOGGED_JOURNAL_FILL_PER_HOUR,
            side: "sell",
          },
        ],
        bonusOutput: [
          mistsPuremistSnapperBonusLine(
            MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_60PLUS,
            MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_STANDARD,
            MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_PREMIUM,
          ),
        ],
      },
      {
        ...SKILL_TIERS.mistsMaxSpec,
        description:
          `Elder Avalonian rod (+2.5%), Elder fisherman garb (+10%), cap and boots (+5% each), fishing 100 and spec 100 (+26.75%, ~${MISTS_MAX_SPEC_FISH_YIELD_PERCENT}% more chopped fish vs the logged T7 session). Journal fill stays at 5,580/6,640 per 30 min.`,
        hourlyOutput: [
          {
            id: "T1_FISHCHOPS",
            name: "Chopped Fish (T8 gear, fishing 100, spec 100)",
            quantity: MISTS_MAX_SPEC_CHOPS_PER_HOUR,
          },
          {
            id: "T7_JOURNAL_FISHING_FULL",
            name: "Grandmaster Fisherman's Journal (Full, logged fill rate)",
            quantity: MISTS_LOGGED_JOURNAL_FILL_PER_HOUR,
          },
        ],
        hourlyInputs: [
          {
            id: "T7_JOURNAL_FISHING_EMPTY",
            name: "Grandmaster Fisherman's Journal (Empty)",
            quantity: MISTS_LOGGED_JOURNAL_FILL_PER_HOUR,
            side: "sell",
          },
        ],
        bonusOutput: [
          mistsPuremistSnapperBonusLine(
            MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_MAX_SPEC,
            MISTS_PUREMIST_SNAPPER_PER_CATCH_MAX_SPEC_STANDARD,
            MISTS_PUREMIST_SNAPPER_PER_CATCH_MAX_SPEC_PREMIUM,
          ),
        ],
      },
    ),
    defaultSkillTierId: "60+",
  },
  "ava-roads-fishing": {
    // Safe escape and Normal use logged raw-fish species mix. Greedy keeps Sturgeon + chops model.
    gatherYieldBaseline: "standard",
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
        hourlyOutput: avaLoggedCatchHourlyOutput(
          AVA_SAFE_LOGGED_CATCH_PER_HOUR,
          "Grandmaster Fisherman's Journal (Full, 0.84 per 30 min logged)",
          AVA_SAFE_LOGGED_JOURNAL_FILL_PER_HOUR,
        ),
        hourlyInputs: avaRoadsDeathInputs(0.06, false),
        hourlyConsumables: [
          { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", quantity: 10 },
          { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
        ],
      },
      {
        ...SKILL_TIERS.avaGrandmaster,
        hourlyOutput: avaLoggedCatchHourlyOutput(
          AVA_NORMAL_LOGGED_CATCH_PER_HOUR,
          "Grandmaster Fisherman's Journal (Full, 0.84 per 30 min logged, fixed)",
          AVA_LOGGED_JOURNAL_FILL_PER_HOUR,
        ),
        hourlyInputs: avaRoadsDeathInputs(0.1, true, "T7_2H_TOOL_FISHINGROD"),
        description:
          "T7 fisherman garb (+30%) and workboots (+12.5%) on logged Safe escape school-fish mix (Sturgeon unchanged; T7 cap already in baseline). Puremist Snapper stays on the separate RNG line.",
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
        hourlyOutput: avaLoggedCatchHourlyOutput(
          AVA_GREEDY_LOGGED_CATCH_PER_HOUR,
          "Grandmaster Fisherman's Journal (Full, 0.84 per 30 min logged, fixed)",
          AVA_LOGGED_JOURNAL_FILL_PER_HOUR,
        ),
        hourlyInputs: avaRoadsDeathInputs(0.18, true, "T8_2H_TOOL_FISHINGROD"),
        description:
          "Full T8 fisherman set plus max fishing 100 and spec 100 (+26.75% fish vs logged fishing 78). Journal fixed at 0.84. Puremist Snapper on separate RNG line.",
      },
    ),
    defaultSkillTierId: "safe",
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
    takeHomeFormulaNoteKind: "laborer",
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
