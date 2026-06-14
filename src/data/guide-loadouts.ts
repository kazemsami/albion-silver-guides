import { getGuideBySlug } from "@/data/guides";
import type { EquipmentLoadout } from "@/types/guide";

const ESCAPE_SLOTS = {
  mainhand: {
    id: "T4_MAIN_RAPIER_MORGANA",
    name: "Adept's Bloodletter",
    hint: "Escape if dismounted",
  },
  armor: {
    id: "T4_ARMOR_LEATHER_SET3",
    name: "Adept's Assassin Jacket",
    hint: "Ambush invisibility",
  },
  shoes: {
    id: "T4_SHOES_GATHERER_ORE",
    name: "Adept's Miner Workboots",
    hint: "Flee sprint to remount",
  },
} as const;

/** Recommended mount for yellow Mists fishing. */
const MISTS_FISHING_MOUNT = {
  mount: {
    id: "T6_MOUNT_GIANTSTAG_MOOSE",
    name: "Master's Moose",
    hint: "Recommended mount for mists fishing loops",
  },
} as const;

/** Default mounted kit, rod stays in bag until you cast at a school. */
const FISHING_COMBAT_SLOTS = {
  mainhand: {
    id: "T4_MAIN_RAPIER_MORGANA",
    name: "Adept's Bloodletter",
    hint: "Escape if dismounted on dangerous maps",
  },
  cape: {
    id: "T4_CAPEITEM_FW_FORTSTERLING",
    name: "Adept's Fort Sterling Cape",
    hint: "CC reduction on dangerous maps",
  },
  bag: {
    id: "T4_BAG",
    name: "Adept's Bag",
    hint: "Store catches: rod lives in bag until you fish",
  },
  mount: {
    id: "T4_MOUNT_HORSE",
    name: "Adept's Riding Horse",
    hint: "Travel between fishing spots while rod stays in bag",
  },
} as const;

const FISHING_COMBAT_SLOTS_T5 = {
  ...FISHING_COMBAT_SLOTS,
  bag: {
    id: "T5_BAG",
    name: "Expert's Bag",
    hint: "More fish per trip: rod stays in bag until you cast",
  },
} as const;

/** Skill-tier loadouts keyed by tier id (matches guide-economics skillTiers). */
export const guideLoadoutsBySlug: Record<string, Record<string, EquipmentLoadout>> = {
  "t4-ore-mining-yellow-zone": {
    low: {
      title: "Beginner Mining Gear",
      description: "T4 miner set with Pork Pie for blue and yellow zones. Cheap to replace.",
      slots: {
        head: { id: "T4_HEAD_GATHERER_ORE", name: "Adept's Miner Cap", hint: "Mining yield bonus" },
        armor: { id: "T4_ARMOR_GATHERER_ORE", name: "Adept's Miner Garb", hint: "Mining yield bonus" },
        shoes: { id: "T4_SHOES_GATHERER_ORE", name: "Adept's Miner Workboots", hint: "Yield + ore weight reduction" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "Best yellow-zone gather mount: speed plus carry weight" },
        cape: {
          id: "T4_BACKPACK_GATHERER_ORE",
          name: "Adept's Miner Backpack",
          hint: "Cape slot: -30% ore weight",
        },
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "Pick in bag until you mine; extra carry weight" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T4_2H_TOOL_PICK", name: "Adept's Pickaxe", hint: "In bag. Equip to mine up to iron (T4)" },
        { id: "T4_JOURNAL_ORE_EMPTY", name: "Adept Prospector's Journal (Empty)", hint: "Optional bonus silver" },
      ],
    },
    mid: {
      title: "Standard Mining Gear",
      description:
        "T5 miner set for Eldon Hill. Logged 30-min run, no Premium: ~205k/hr net with Standard tax, Pork Pie, miner backpack, gatherer bag.",
      slots: {
        head: { id: "T5_HEAD_GATHERER_ORE", name: "Expert's Miner Cap", hint: "Mining yield bonus" },
        armor: { id: "T5_ARMOR_GATHERER_ORE", name: "Expert's Miner Garb", hint: "Mining yield bonus" },
        shoes: { id: "T5_SHOES_GATHERER_ORE", name: "Expert's Miner Workboots", hint: "Yield + ore weight reduction" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "Best yellow-zone gather mount: speed plus carry weight" },
        cape: {
          id: "T5_BACKPACK_GATHERER_ORE",
          name: "Expert's Miner Backpack",
          hint: "Cape slot: -30% ore weight",
        },
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "Pick in bag until you mine; more ore per trip" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T5_2H_TOOL_PICK", name: "Expert's Pickaxe", hint: "In bag. Equip to mine titanium (T5)" },
        { id: "T4_JOURNAL_ORE_EMPTY", name: "Adept Prospector's Journal (Empty)", hint: "Fill while mining" },
      ],
    },
    high: {
      title: "Advanced Mining Gear",
      description: "T5 miner set for titanium nodes and enchanted ore hunting in yellow zones.",
      slots: {
        head: { id: "T5_HEAD_GATHERER_ORE", name: "Expert's Miner Cap", hint: "Higher mining yield" },
        armor: { id: "T5_ARMOR_GATHERER_ORE", name: "Expert's Miner Garb", hint: "Higher mining yield" },
        shoes: { id: "T5_SHOES_GATHERER_ORE", name: "Expert's Miner Workboots", hint: "Yield + weight reduction" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "Best yellow-zone gather mount: speed plus carry weight" },
        cape: {
          id: "T5_BACKPACK_GATHERER_ORE",
          name: "Expert's Miner Backpack",
          hint: "Cape slot: -30% ore weight",
        },
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "Pick in bag until you mine; extra carry weight" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T5_2H_TOOL_PICK", name: "Expert's Pickaxe", hint: "In bag. Equip to mine titanium (T5)" },
        { id: "T4_JOURNAL_ORE_EMPTY", name: "Adept Prospector's Journal (Empty)", hint: "Same T4 journal as baseline loop" },
      ],
    },
  },
  "fiber-farming-solo": {
    low: {
      title: "Beginner Fiber Gear",
      description: "T4 harvester set with Pork Pie for hemp in safe zones.",
      slots: {
        head: { id: "T4_HEAD_GATHERER_FIBER", name: "Adept's Harvester Cap", hint: "Fiber yield bonus" },
        armor: { id: "T4_ARMOR_GATHERER_FIBER", name: "Adept's Harvester Garb", hint: "Fiber yield bonus" },
        shoes: { id: "T4_SHOES_GATHERER_FIBER", name: "Adept's Harvester Workboots", hint: "Yield + weight reduction" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "Best yellow-zone gather mount: speed plus carry weight" },
        cape: {
          id: "T4_BACKPACK_GATHERER_FIBER",
          name: "Adept's Harvester Backpack",
          hint: "Cape slot: -30% fiber weight",
        },
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "Sickle in bag until you harvest; extra carry weight" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T4_2H_TOOL_SICKLE", name: "Adept's Sickle", hint: "In bag. Equip to gather hemp (T4)" },
        { id: "T4_JOURNAL_FIBER_EMPTY", name: "Adept Cropper's Journal (Empty)", quantity: 2, hint: "Carry two empties" },
      ],
    },
    mid: {
      title: "Standard Fiber Gear",
      description:
        "T5 harvester set + Pork Pie, Lazygrass Plain. Logged 30-min run extrapolated to 1 hr (~250k/hr net with Standard tax and 1 Pork Pie, no Premium).",
      slots: {
        head: { id: "T5_HEAD_GATHERER_FIBER", name: "Expert's Harvester Cap", hint: "Fiber yield bonus" },
        armor: { id: "T5_ARMOR_GATHERER_FIBER", name: "Expert's Harvester Garb", hint: "Fiber yield bonus" },
        shoes: { id: "T5_SHOES_GATHERER_FIBER", name: "Expert's Harvester Workboots", hint: "Yield + weight reduction" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "Best yellow-zone gather mount: speed plus carry weight" },
        cape: {
          id: "T5_BACKPACK_GATHERER_FIBER",
          name: "Expert's Harvester Backpack",
          hint: "Cape slot: -30% fiber weight",
        },
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "Sickle in bag until you harvest; extra carry weight" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T5_2H_TOOL_SICKLE", name: "Expert's Sickle", hint: "In bag. Equip to gather hemp and skyflower" },
        { id: "T5_JOURNAL_FIBER_EMPTY", name: "Expert Cropper's Journal (Empty)", quantity: 2, hint: "Carry two empties; fill two per hour" },
      ],
    },
    high: {
      title: "Advanced Fiber Gear",
      description: "T6 set with Pork Pie. Not logged on this route yet; treat as an upside scenario.",
      slots: {
        head: { id: "T6_HEAD_GATHERER_FIBER", name: "Master's Harvester Cap", hint: "Max fiber yield" },
        armor: { id: "T6_ARMOR_GATHERER_FIBER", name: "Master's Harvester Garb", hint: "Max fiber yield" },
        shoes: { id: "T6_SHOES_GATHERER_FIBER", name: "Master's Harvester Workboots", hint: "Yield + weight reduction" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "Best yellow-zone gather mount: speed plus carry weight" },
        cape: {
          id: "T6_BACKPACK_GATHERER_FIBER",
          name: "Master's Harvester Backpack",
          hint: "Cape slot: -30% fiber weight",
        },
        bag: { id: "T5_BAG", name: "Expert's Bag", hint: "Sickle in bag until you harvest; extra carry weight" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T6_2H_TOOL_SICKLE", name: "Master's Sickle", hint: "In bag. Equip for T6 fiber nodes" },
        { id: "T5_JOURNAL_FIBER_EMPTY", name: "Expert Cropper's Journal (Empty)", quantity: 2, hint: "Carry two empties" },
      ],
    },
  },
  "dungeon-maps-solo": {
    "t8-2": {
      title: "T8.2 Map Build (~1540 IP)",
      description:
        "Elder's gear setup from the logged 2.5-hour T8.2 dungeon map session. ~1540 Item Power. Adjust weapon to your preferred AoE clear style.",
      slots: {
        head: {
          id: "T8_HEAD_CLOTH_SET1",
          name: "Elder's Scholar Cowl",
          hint: "Energy regen on every spell cast",
        },
        armor: {
          id: "T8_ARMOR_LEATHER_SET1",
          name: "Elder's Mercenary Jacket",
          hint: "Strong AoE damage output",
        },
        shoes: {
          id: "T8_SHOES_PLATE_SET1",
          name: "Elder's Soldier Boots",
          hint: "Gap close between mob packs",
        },
        mainhand: {
          id: "T8_XBOW_HEAVY",
          name: "Elder's Heavy Crossbow",
          hint: "High AoE bolts for fast pack clearing",
        },
        cape: {
          id: "T8_CAPEITEM_FW_CAERLEON",
          name: "Elder's Caerleon Cape",
          hint: "Chain Lightning burst on large packs",
        },
        food: {
          id: "T8_MEAL_STEW",
          name: "Elder's Mutton Stew",
          hint: "+damage to speed up clears",
        },
        potion: {
          id: "T8_POTION_HEAL",
          name: "Elder's Healing Potion",
          hint: "Emergency heal between pulls",
        },
      },
    },
    "t8-1": {
      title: "T8.1 Map Build",
      description:
        "Budget version of the T8.2 build. Use T8.1 maps (~30k each) for lower investment. Loot runs roughly 75% of T8.2 value.",
      slots: {
        head: { id: "T8_HEAD_CLOTH_SET1", name: "Elder's Scholar Cowl", hint: "Energy regen" },
        armor: { id: "T8_ARMOR_LEATHER_SET1", name: "Elder's Mercenary Jacket", hint: "AoE damage" },
        shoes: { id: "T8_SHOES_PLATE_SET1", name: "Elder's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T8_XBOW_HEAVY", name: "Elder's Heavy Crossbow", hint: "AoE clearing" },
        cape: { id: "T8_CAPEITEM_FW_CAERLEON", name: "Elder's Caerleon Cape", hint: "Chain Lightning" },
        food: { id: "T8_MEAL_STEW", name: "Elder's Mutton Stew", hint: "+damage" },
        potion: { id: "T8_POTION_HEAL", name: "Elder's Healing Potion", hint: "Emergency sustain" },
      },
    },
    "t8-3": {
      title: "T8.3 Map Build",
      description:
        "T8.3 maps (~65k each) for maximum loot potential. High variance; top drops can exceed 2M/hr gross. Same gear as T8.2 baseline.",
      slots: {
        head: { id: "T8_HEAD_CLOTH_SET1", name: "Elder's Scholar Cowl", hint: "Energy regen" },
        armor: { id: "T8_ARMOR_LEATHER_SET1", name: "Elder's Mercenary Jacket", hint: "AoE damage" },
        shoes: { id: "T8_SHOES_PLATE_SET1", name: "Elder's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T8_XBOW_HEAVY", name: "Elder's Heavy Crossbow", hint: "AoE clearing" },
        cape: { id: "T8_CAPEITEM_FW_CAERLEON", name: "Elder's Caerleon Cape", hint: "Chain Lightning" },
        food: { id: "T8_MEAL_STEW", name: "Elder's Mutton Stew", hint: "+damage" },
        potion: { id: "T8_POTION_HEAL", name: "Elder's Healing Potion", hint: "Emergency sustain" },
      },
    },
  },
  "abyssal-depths-farming": {
    learning: {
      title: "Floor 1 Extract",
      description:
        "Budget ~1200 IP kit. Learn statue buffs, soul exits, and when to reset on floor 1.",
      slots: {
        head: {
          id: "T5_HEAD_LEATHER_SET3",
          name: "Expert's Assassin Hood",
          hint: "Budget burst near softcap",
        },
        armor: {
          id: "T5_ARMOR_CLOTH_SET2",
          name: "Expert's Cleric Robe",
          hint: "Defensive cooldowns",
        },
        shoes: {
          id: "T5_SHOES_PLATE_SET2",
          name: "Expert's Royal Sandals",
          hint: "Mobility between rooms",
        },
        mainhand: {
          id: "T5_2H_FROSTSTAFF@1",
          name: "Expert's Permafrost Prism (.1)",
          hint: "AoE room clear under 1200 IP",
        },
        cape: {
          id: "T4_CAPEITEM_MORGANA",
          name: "Adept's Morgana Cape",
          hint: "Cheap defense under softcap",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "Carry weight for early extracts",
        },
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "Empty before entry" },
        food: { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "Low-cost damage food" },
        potion: { id: "T4_POTION_HEAL", name: "Healing Potion", hint: "Backup sustain" },
      },
      inventory: [
        { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Backup heal" },
      ],
    },
    standard: {
      title: "Floor 2 Farm",
      description:
        "1200 IP softcap setup, stack 15 Demonic Ferocity on floor 1, extract floor 2 for baseline profit.",
      slots: {
        head: {
          id: "T6_HEAD_LEATHER_SET3",
          name: "Master's Assassin Hood",
          hint: "Burst / defense near 1200 IP",
        },
        armor: {
          id: "T6_ARMOR_CLOTH_SET2",
          name: "Master's Cleric Robe",
          hint: "Pop armor during big pulls",
        },
        shoes: {
          id: "T6_SHOES_PLATE_SET2",
          name: "Master's Royal Sandals",
          hint: "Room-to-room mobility",
        },
        mainhand: {
          id: "T6_2H_HOLYSTAFF@4",
          name: "Master's Astral Staff (.4)",
          hint: "AoE clear + full Fame Bonus",
        },
        cape: {
          id: "T4_CAPEITEM_FW_CAERLEON",
          name: "Adept's Caerleon Cape",
          hint: "Defense in orange zone",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "High carry weight for extracts",
        },
        bag: { id: "T5_BAG", name: "Expert's Bag", hint: "Empty before entry" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "Extra food for long runs" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Between pulls and PvP" },
      },
      inventory: [
        { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", hint: "Burst rooms / fights" },
      ],
    },
    expert: {
      title: "Floor 3 Vault Push",
      description:
        "3 keys (duo) or 5 keys (trio) for the Treasure Vault. Sweaty PvP, vault portal is the safe extract on collapse.",
      slots: {
        head: {
          id: "T6_HEAD_LEATHER_SET3",
          name: "Master's Assassin Hood",
          hint: "Vault fights at softcap",
        },
        armor: {
          id: "T6_ARMOR_CLOTH_SET2",
          name: "Master's Cleric Robe",
          hint: "Survivability",
        },
        shoes: {
          id: "T6_SHOES_PLATE_SET2",
          name: "Master's Royal Sandals",
          hint: "Kite vault contesters",
        },
        mainhand: {
          id: "T6_2H_HOLYSTAFF@4",
          name: "Master's Astral Staff (.4)",
          hint: "AoE in vault chaos",
        },
        cape: {
          id: "T4_CAPEITEM_FW_CAERLEON",
          name: "Adept's Caerleon Cape",
          hint: "Defense",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "Carry vault loot out",
        },
        bag: { id: "T5_BAG", name: "Expert's Bag", hint: "Empty before entry" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "Long floor-3 push" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Sustain" },
      },
      inventory: [
        { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", hint: "Vault burst" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage vault fights" },
      ],
    },
  },
  "corrupted-dungeons-pvpve": {
    hunter: {
      title: "Hunter Build (Blue/Yellow)",
      description: "Budget T5 Claymore burst build for knockdown-only corrupted dungeons.",
      slots: {
        head: { id: "T5_HEAD_PLATE_SET1", name: "Expert's Soldier Helmet", hint: "Shield option" },
        armor: { id: "T5_ARMOR_LEATHER_SET1", name: "Expert's Mercenary Jacket", hint: "Damage + defense" },
        shoes: { id: "T5_SHOES_PLATE_SET1", name: "Expert's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T5_2H_CLAYMORE", name: "Expert's Claymore", hint: "Burst for 1v1 corrupted fights" },
        food: { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "+damage" },
        potion: { id: "T4_POTION_HEAL", name: "Healing Potion", hint: "Sustain" },
      },
    },
    stalker: {
      title: "Stalker Build (Red)",
      description: "T6 Claymore burst build for red-zone corrupted PvPvE.",
      slots: {
        head: { id: "T6_HEAD_PLATE_SET1", name: "Master's Soldier Helmet", hint: "Emergency shield" },
        armor: { id: "T6_ARMOR_LEATHER_SET1", name: "Master's Mercenary Jacket", hint: "Damage + defense" },
        shoes: { id: "T6_SHOES_PLATE_SET1", name: "Master's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T6_2H_CLAYMORE", name: "Master's Claymore", hint: "High burst for 1v1 corrupted fights" },
        cape: { id: "T4_CAPEITEM_FW_THETFORD", name: "Adept's Thetford Cape", hint: "Chain Lightning burst" },
        food: { id: "T6_MEAL_STEW", name: "Mutton Stew", hint: "+damage" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Sustain" },
      },
      inventory: [
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage" },
      ],
    },
    slayer: {
      title: "Slayer Build (Red/Black)",
      description: "T6 claymore burst for Slayer corrupted dungeons (100k+ infamy. T8 mobs, highest IP cap.",
      slots: {
        head: { id: "T6_HEAD_PLATE_SET1", name: "Master's Soldier Helmet", hint: "Emergency shield" },
        armor: { id: "T6_ARMOR_LEATHER_SET1", name: "Master's Mercenary Jacket", hint: "Damage + defense" },
        shoes: { id: "T6_SHOES_PLATE_SET1", name: "Master's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T6_2H_CLAYMORE", name: "Master's Claymore", hint: "High burst for 1v1" },
        cape: { id: "T4_CAPEITEM_FW_THETFORD", name: "Adept's Thetford Cape", hint: "Chain Lightning burst" },
        food: { id: "T6_MEAL_STEW", name: "Mutton Stew", hint: "+damage" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Sustain" },
      },
      inventory: [
        { id: "T6_POTION_ENERGY", name: "Major Energy Potion", hint: "Ability energy" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage" },
      ],
    },
  },
  "high-tier-group-tracking": {
    "ava-roads": {
      title: "Avalonian Roads Group Tracking",
      description:
        "4-man mixed veteran comp on Roads: Wildfire DPS, Incubus tank, Fallen healer. Tracker uses T7 toolkit for Golem, Dawnbird, Panther, Werewolf, and Rare Quarry hunts.",
      slots: {
        head: {
          id: "T7_HEAD_LEATHER_SET1",
          name: "Grandmaster's Mercenary Hood",
          hint: "DPS burst",
        },
        armor: {
          id: "T7_ARMOR_LEATHER_SET1",
          name: "Grandmaster's Mercenary Jacket",
          hint: "Damage + defense",
        },
        shoes: {
          id: "T7_SHOES_LEATHER_SET3",
          name: "Grandmaster's Stalker Shoes",
          hint: "Reposition during hunts",
        },
        mainhand: {
          id: "T7_2H_FIRESTAFF",
          name: "Grandmaster's Wildfire Staff",
          hint: "Sustained AoE on veteran targets",
        },
        cape: {
          id: "T4_CAPEITEM_FW_FORTSTERLING",
          name: "Adept's Fort Sterling Cape",
          hint: "CC reduction for long fights",
        },
        food: { id: "T6_MEAL_SANDWICH", name: "Beef Sandwich", hint: "+defense food" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Sustain" },
      },
      inventory: [
        {
          id: "T7_2H_TOOL_TRACKING",
          name: "Grandmaster's Tracking Toolkit",
          hint: "Tracker: mixed T7/T8 veteran hunts on Roads (tier +1)",
        },
        { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", hint: "Burst on engage" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage gankers on Roads" },
      ],
    },
  },
  "mists-fishing": {
    "10-30": {
      title: "Early Mists Fishing",
      description:
        "Wear your best gear plus fisherman set, Avalonian rod, bait, and journal. Moose mount recommended. Fish your starting Uncommon mist.",
      slots: {
        head: { id: "T5_HEAD_GATHERER_FISH", name: "Expert's Fisherman Cap", hint: "Best fisherman head you can wear" },
        armor: { id: "T5_ARMOR_GATHERER_FISH", name: "Expert's Fisherman Garb", hint: "Best fisherman armor you can wear" },
        shoes: { id: "T5_SHOES_GATHERER_FISH", name: "Expert's Fisherman Workboots", hint: "Best fisherman boots you can wear" },
        ...MISTS_FISHING_MOUNT,
      },
      inventory: [
        { id: "T5_2H_TOOL_FISHINGROD_AVALON", name: "Expert's Avalonian Fishing Rod", hint: "In bag. Cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use at every school" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fills slowly at this level" },
      ],
    },
    "30-60": {
      title: "Mid-Level Mists Fishing",
      description:
        "Wear your best gear plus fisherman set, Avalonian rod, bait, and journal. Moose mount recommended. Hunt Rare+ nested mists for T7 zones.",
      slots: {
        head: { id: "T6_HEAD_GATHERER_FISH", name: "Master's Fisherman Cap", hint: "Best fisherman head you can wear" },
        armor: { id: "T6_ARMOR_GATHERER_FISH", name: "Master's Fisherman Garb", hint: "Best fisherman armor you can wear" },
        shoes: { id: "T6_SHOES_GATHERER_FISH", name: "Master's Fisherman Workboots", hint: "Best fisherman boots you can wear" },
        ...MISTS_FISHING_MOUNT,
      },
      inventory: [
        { id: "T6_2H_TOOL_FISHINGROD_AVALON", name: "Master's Avalonian Fishing Rod", hint: "In bag. Cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use at every school" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Slow fill until you land Rare+ T7 mists consistently" },
      ],
    },
    "60+": {
      title: "Expert Mists Fishing",
      description:
        "Wear your best gear plus fisherman set, Avalonian rod, bait, and journal. Moose mount recommended. Scout Rare/Epic/Legendary mists at 5:00 on the timer.",
      slots: {
        head: { id: "T7_HEAD_GATHERER_FISH", name: "Grandmaster's Fisherman Cap", hint: "Best fisherman head you can wear" },
        armor: { id: "T7_ARMOR_GATHERER_FISH", name: "Grandmaster's Fisherman Garb", hint: "Best fisherman armor you can wear" },
        shoes: { id: "T7_SHOES_GATHERER_FISH", name: "Grandmaster's Fisherman Workboots", hint: "Best fisherman boots you can wear" },
        ...MISTS_FISHING_MOUNT,
      },
      inventory: [
        { id: "T7_2H_TOOL_FISHINGROD_AVALON", name: "Grandmaster's Avalonian Fishing Rod", hint: "In bag. Cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use at every school" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "~1/hr in Rare+ T7 mists with this gear" },
      ],
    },
  },
  "ava-roads-fishing": {
    safe: {
      title: "Safe Escape Build",
      description: "Cheap mobility setup: fisherman cap, pork pie ×2, rod in bag. Bloodletter for escape if dismounted.",
      slots: {
        head: { id: "T7_HEAD_GATHERER_FISH", name: "Grandmaster's Fisherman Cap", hint: "Fishing yield bonus" },
        ...ESCAPE_SLOTS,
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "+151 kg on mount" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
        mount: { id: "T3_MOUNT_HORSE", name: "Journeyman's Riding Horse", hint: "Cheap replacement mount" },
      },
      inventory: [
        { id: "T7_2H_TOOL_FISHINGROD", name: "Grandmaster's Fishing Rod", hint: "In bag, cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Every cast" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
    grandmaster: {
      title: "T7 Fishing Gear (Middle Spec)",
      description:
        "T7 fisherman set + pork pie (~3 T7/down + ~2 T8 fish per cast. Upgrade to T8 armor for ~33% more yield.",
      slots: {
        head: { id: "T7_HEAD_GATHERER_FISH", name: "Grandmaster's Fisherman Cap", hint: "Fishing yield" },
        armor: { id: "T7_ARMOR_GATHERER_FISH", name: "Grandmaster's Fisherman Garb", hint: "Fishing yield" },
        shoes: { id: "T7_SHOES_GATHERER_FISH", name: "Grandmaster's Fisherman Workboots", hint: "Weight reduction" },
        ...FISHING_COMBAT_SLOTS,
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
        potion: { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Essential escape" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "High carry weight on road loops" },
      },
      inventory: [
        { id: "T7_2H_TOOL_FISHINGROD", name: "Grandmaster's Fishing Rod", hint: "In bag, cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Every cast" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
    profit: {
      title: "T8 Max Profit Gear",
      description:
        "Full T8 fisherman set + pork pie (~4 T7/down + ~3 T8 fish per cast. Rod in bag, cast without equipping.",
      slots: {
        head: { id: "T8_HEAD_GATHERER_FISH", name: "Elder's Fisherman Cap", hint: "Fishing yield" },
        armor: { id: "T8_ARMOR_GATHERER_FISH", name: "Elder's Fisherman Garb", hint: "Fishing yield" },
        shoes: { id: "T8_SHOES_GATHERER_FISH", name: "Elder's Fisherman Workboots", hint: "Weight reduction" },
        ...FISHING_COMBAT_SLOTS,
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
        potion: { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Essential escape" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "High carry weight on road loops" },
      },
      inventory: [
        { id: "T8_2H_TOOL_FISHINGROD", name: "Elder's Fishing Rod", hint: "In bag, cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Every cast" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
    expert: {
      title: "T8 Max Spec (Deep Roads)",
      description:
        "Max fishing specs on T8 road maps: highest fish-per-cast and best Snapper drop odds from T7/T8 zone fishing.",
      slots: {
        head: { id: "T8_HEAD_GATHERER_FISH", name: "Elder's Fisherman Cap", hint: "Fishing yield" },
        armor: { id: "T8_ARMOR_GATHERER_FISH", name: "Elder's Fisherman Garb", hint: "Fishing yield" },
        shoes: { id: "T8_SHOES_GATHERER_FISH", name: "Elder's Fisherman Workboots", hint: "Weight reduction" },
        ...FISHING_COMBAT_SLOTS_T5,
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
        potion: { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Essential escape" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "High carry weight on road loops" },
      },
      inventory: [
        { id: "T8_2H_TOOL_FISHINGROD", name: "Elder's Fishing Rod", hint: "In bag, cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Every cast" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
  },
  "laborer-passive-income": {
    small: {
      title: "T8 Island (4-6 houses)",
      description: "12-18 laborers (3 per house), T7 journals at 150% yield (~15 jobs per 22h cycle).",
      slots: {},
      inventory: [
        { id: "T8_FURNITUREITEM_BED", name: "Elder's Bed", hint: "One T8 bed per laborer" },
        { id: "T8_FURNITUREITEM_TABLE", name: "Elder's Table", hint: "One T8 table per four laborers" },
        { id: "T8_FURNITUREITEM_TROPHY_GENERAL", name: "Ledger of Truths", hint: "Optional T8 general trophy" },
        { id: "T8_FURNITUREITEM_TROPHY_ORE", name: "Adamantium Ore Sample", hint: "Optional T8 prospector trophy" },
        { id: "T7_JOURNAL_TROPHY_GENERAL_FULL", name: "Grandmaster's Generalist Trophy Journal (Full)", hint: "Optional: fill on any fame, hand in for trophy returns" },
        { id: "T7_JOURNAL_ORE_FULL", name: "Grandmaster Prospector's Journal (Full)", hint: "Hand to prospector (~58 T7 ore at 150%)" },
        { id: "T7_JOURNAL_FIBER_FULL", name: "Grandmaster Cropper's Journal (Full)", hint: "Hand to cropper (~58 T7 fiber at 150%)" },
      ],
    },
    medium: {
      title: "T8 Island (8-12 houses)",
      description: "24-36 laborers (3 per house) on T7 journals (~30 jobs per 22h at 150% yield, ~58 T7 resources each).",
      slots: {},
      inventory: [
        { id: "T8_FURNITUREITEM_BED", name: "Elder's Bed", hint: "One T8 bed per laborer" },
        { id: "T8_FURNITUREITEM_TABLE", name: "Elder's Table", hint: "One T8 table per four laborers" },
        { id: "T8_FURNITUREITEM_TROPHY_GENERAL", name: "Ledger of Truths", hint: "Optional T8 general trophy" },
        { id: "T8_FURNITUREITEM_TROPHY_ORE", name: "Adamantium Ore Sample", hint: "Optional T8 prospector trophy" },
        { id: "T7_JOURNAL_TROPHY_GENERAL_FULL", name: "Grandmaster's Generalist Trophy Journal (Full)", hint: "Optional: fill on any fame, hand in for trophy returns" },
        { id: "T7_JOURNAL_ORE_FULL", name: "Grandmaster Prospector's Journal (Full)", hint: "Hand to prospector: one per 22h job" },
        { id: "T7_JOURNAL_FIBER_FULL", name: "Grandmaster Cropper's Journal (Full)", hint: "Hand to cropper: one per 22h job" },
        { id: "T7_JOURNAL_WOOD_FULL", name: "Grandmaster Lumberjack's Journal (Full)", hint: "Hand to lumberjack: one per 22h job" },
      ],
    },
    large: {
      title: "T8 Island (16 houses)",
      description: "Maxed level-6 island: 48 laborers (3 per house) on T7 journals, 150% yield, 48 jobs per 22h cycle.",
      slots: {},
      inventory: [
        { id: "T8_FURNITUREITEM_BED", name: "Elder's Bed", hint: "One T8 bed per laborer" },
        { id: "T8_FURNITUREITEM_TABLE", name: "Elder's Table", hint: "One T8 table per four laborers" },
        { id: "T8_FURNITUREITEM_TROPHY_GENERAL", name: "Ledger of Truths", hint: "Optional T8 general trophy" },
        { id: "T8_FURNITUREITEM_TROPHY_ORE", name: "Adamantium Ore Sample", hint: "Optional T8 prospector trophy" },
        { id: "T7_JOURNAL_ORE_FULL", name: "Grandmaster Prospector's Journal (Full)", hint: "Hand to prospector: one per 22h job" },
        { id: "T7_JOURNAL_FIBER_FULL", name: "Grandmaster Cropper's Journal (Full)", hint: "Hand to cropper: one per 22h job" },
        { id: "T7_JOURNAL_WOOD_FULL", name: "Grandmaster Lumberjack's Journal (Full)", hint: "Hand to lumberjack: one per 22h job" },
      ],
    },
  },
  "potions-crafting-bulk": {
    t5: {
      title: "T5 Alchemy Setup",
      description:
        "Stock T4 herbs and farm goods: craft Healing Potion and Energy Potion until T6 majors unlock.",
      slots: {},
      inventory: [
        { id: "T4_BURDOCK", name: "Crenellated Burdock", quantity: 24, hint: "Per 5 pots: both T4 recipes" },
        { id: "T3_EGG", name: "Hen Eggs", quantity: 6, hint: "Per 5 Healing Potions" },
        { id: "T4_MILK", name: "Goat's Milk", quantity: 6, hint: "Per 5 Energy Potions" },
      ],
    },
    t6: {
      title: "T6 Bulk Alchemy",
      description:
        "Daily stock for Major Healing .1 (3,461 focus), Major Energy .1 (4,188 focus), and Poison (1,635 focus). Pick the best profit per 10k focus in the calculator.",
      slots: {},
      inventory: [
        { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72, hint: "Per 5 Major Healing or Energy" },
        { id: "T5_EGG", name: "Goose Eggs", quantity: 18, hint: "Per 5 Major Healing Potions" },
        { id: "T6_MILK", name: "Sheep's Milk", quantity: 18, hint: "Per 5 Major Energy Potions" },
        { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18, hint: "Per 5 Healing or Energy" },
        { id: "T1_ALCHEMY_EXTRACT_LEVEL1", name: "Basic Arcane Extract", quantity: 45, hint: "Per 5 .1 major pots" },
        { id: "T5_TEASEL", name: "Dragon Teasel", quantity: 12, hint: "Per 5 Poison Potions" },
        { id: "T3_COMFREY", name: "Brightleaf Comfrey", quantity: 12, hint: "Per 5 Poison Potions" },
      ],
    },
    t7: {
      title: "T7 War Potions",
      description:
        "Before ZvZ: Gigantify .1 (5,278 focus), Resistance .1 (6,368 focus), and Sticky (5,503 focus). Each batch is 5 pots.",
      slots: {},
      inventory: [
        { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72, hint: "Per 5 T6 majors; 36 for war pots" },
        { id: "T5_EGG", name: "Goose Eggs", quantity: 18, hint: "Healing + Gigantify per 5" },
        { id: "T6_MILK", name: "Sheep's Milk", quantity: 18, hint: "Energy + Resistance per 5" },
        { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18, hint: "Per 5 T6 major recipes" },
        { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72, hint: "Per 5 Gigantify or Resistance" },
        { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 18, hint: "Per 5 war pots" },
        { id: "T1_ALCHEMY_EXTRACT_LEVEL1", name: "Basic Arcane Extract", quantity: 45, hint: "Per 5 .1 war pots" },
        { id: "T4_BURDOCK", name: "Crenellated Burdock", quantity: 36, hint: "Per 5 Major Resistance Potions" },
      ],
    },
  },
};

export function getGuideLoadouts(slug: string): Record<string, EquipmentLoadout> {
  return guideLoadoutsBySlug[slug] ?? {};
}

/** Fallback to guide profitBuild/safeBuild if tier loadout missing. */
export function getLoadoutForTier(slug: string, tierId: string): EquipmentLoadout | undefined {
  const tierLoadouts = getGuideLoadouts(slug);
  if (tierLoadouts[tierId]) return tierLoadouts[tierId];

  const guide = getGuideBySlug(slug);
  if (!guide) return undefined;
  if (tierId === "safe" && guide.safeBuild) return guide.safeBuild;
  return guide.profitBuild;
}

export function getAllTierLoadouts(
  slug: string,
  tierIds: string[],
): EquipmentLoadout[] {
  return tierIds
    .map((id) => getLoadoutForTier(slug, id))
    .filter((l): l is EquipmentLoadout => l != null);
}

export function loadoutVariantForTier(
  tierId: string,
): "safe" | "profit" | "default" {
  if (tierId === "safe" || tierId.includes("yellow") || tierId === "low" || tierId === "10-30" || tierId === "hunter" || tierId === "small" || tierId === "low-capital" || tierId === "t5" || tierId === "learning") {
    return tierId === "safe" ? "safe" : "default";
  }
  if (tierId === "profit" || tierId === "grandmaster" || tierId === "expert" || tierId === "high" || tierId === "black" || tierId === "slayer" || tierId === "60+" || tierId === "40+" || tierId === "large" || tierId === "high-capital" || tierId === "t7" || tierId === "standard") {
    return "profit";
  }
  return "default";
}
