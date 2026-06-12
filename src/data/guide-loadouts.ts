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

/** Travel slots for yellow Mists — safe zone; wear your best gear. */
const MISTS_FISHING_TRAVEL_SLOTS = {
  cape: {
    id: "T4_CAPEITEM_AVALON",
    name: "Adept's Avalonian Cape",
    hint: "Best gathering cape you have",
  },
  bag: {
    id: "T8_BAG",
    name: "Elder's Bag",
    hint: "Best bag for more fish per trip",
  },
  mount: {
    id: "T8_MOUNT_OX",
    name: "Elder's Transport Ox",
    hint: "Best carry mount — yellow Mists are knockdown-only",
  },
} as const;

/** Default mounted kit, rod stays in bag until you cast at a school. */
const FISHING_COMBAT_SLOTS = {
  mainhand: {
    id: "T4_MAIN_RAPIER_MORGANA",
    name: "Adept's Bloodletter",
    hint: "Keep equipped while mounted: swap from rod if attacked",
  },
  cape: {
    id: "T4_CAPEITEM_FW_THETFORD",
    name: "Adept's Thetford Cape",
    hint: "Vanisher invis when HP drops low",
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
      description: "T4 miner set for blue and yellow zones. Cheap to replace.",
      slots: {
        head: { id: "T4_HEAD_GATHERER_ORE", name: "Adept's Miner Cap", hint: "Mining yield bonus" },
        armor: { id: "T4_ARMOR_GATHERER_ORE", name: "Adept's Miner Garb", hint: "Mining yield bonus" },
        shoes: { id: "T4_SHOES_GATHERER_ORE", name: "Adept's Miner Workboots", hint: "Yield + ore weight reduction" },
        mainhand: { id: "T4_2H_TOOL_PICK", name: "Adept's Pickaxe", hint: "Mines up to iron (T4)" },
        mount: { id: "T3_MOUNT_HORSE", name: "Journeyman's Riding Horse", hint: "Budget travel mount" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T4_JOURNAL_ORE_EMPTY", name: "Adept Prospector's Journal (Empty)", hint: "Optional bonus silver" },
      ],
    },
    mid: {
      title: "Standard Mining Gear",
      description: "Full T4 gathering set with a faster mount for yellow-zone loops.",
      slots: {
        head: { id: "T4_HEAD_GATHERER_ORE", name: "Adept's Miner Cap", hint: "Mining yield bonus" },
        armor: { id: "T4_ARMOR_GATHERER_ORE", name: "Adept's Miner Garb", hint: "Mining yield bonus" },
        shoes: { id: "T4_SHOES_GATHERER_ORE", name: "Adept's Miner Workboots", hint: "Yield + ore weight reduction" },
        mainhand: { id: "T4_2H_TOOL_PICK", name: "Adept's Pickaxe", hint: "Mines up to iron (T4)" },
        mount: { id: "T4_MOUNT_HORSE", name: "Adept's Riding Horse", hint: "Fast travel between clusters" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
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
        mainhand: { id: "T5_2H_TOOL_PICK", name: "Expert's Pickaxe", hint: "Mines titanium (T5)" },
        cape: { id: "T4_CAPEITEM_AVALON", name: "Adept's Avalonian Cape", hint: "Gathering yield bonus" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "High carry weight mount" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T5_JOURNAL_ORE_EMPTY", name: "Expert Prospector's Journal (Empty)", hint: "Higher-tier journal returns" },
      ],
    },
  },
  "fiber-farming-solo": {
    low: {
      title: "Beginner Fiber Gear",
      description: "T4 harvester set for hemp in safe zones.",
      slots: {
        head: { id: "T4_HEAD_GATHERER_FIBER", name: "Adept's Harvester Cap", hint: "Fiber yield bonus" },
        armor: { id: "T4_ARMOR_GATHERER_FIBER", name: "Adept's Harvester Garb", hint: "Fiber yield bonus" },
        shoes: { id: "T4_SHOES_GATHERER_FIBER", name: "Adept's Harvester Workboots", hint: "Yield + weight reduction" },
        mainhand: { id: "T4_2H_TOOL_SICKLE", name: "Adept's Sickle", hint: "Gathers hemp (T4)" },
        mount: { id: "T4_MOUNT_HORSE", name: "Adept's Riding Horse", hint: "Loop travel" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T4_JOURNAL_FIBER_EMPTY", name: "Adept Cropper's Journal (Empty)", quantity: 2, hint: "Carry two empties" },
      ],
    },
    mid: {
      title: "Standard Fiber Gear",
      description: "T5 harvester set for skyflower routes in swamp yellow zones.",
      slots: {
        head: { id: "T5_HEAD_GATHERER_FIBER", name: "Expert's Harvester Cap", hint: "Fiber yield bonus" },
        armor: { id: "T5_ARMOR_GATHERER_FIBER", name: "Expert's Harvester Garb", hint: "Fiber yield bonus" },
        shoes: { id: "T5_SHOES_GATHERER_FIBER", name: "Expert's Harvester Workboots", hint: "Yield + weight reduction" },
        mainhand: { id: "T5_2H_TOOL_SICKLE", name: "Expert's Sickle", hint: "Hemp + skyflower" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "Good carry weight" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T4_JOURNAL_FIBER_EMPTY", name: "Adept Cropper's Journal (Empty)", quantity: 2, hint: "Carry two empties" },
      ],
    },
    high: {
      title: "Advanced Fiber Gear",
      description: "T6 set with Avalonian cape and pork pie for max swamp yields.",
      slots: {
        head: { id: "T6_HEAD_GATHERER_FIBER", name: "Master's Harvester Cap", hint: "Max fiber yield" },
        armor: { id: "T6_ARMOR_GATHERER_FIBER", name: "Master's Harvester Garb", hint: "Max fiber yield" },
        shoes: { id: "T6_SHOES_GATHERER_FIBER", name: "Master's Harvester Workboots", hint: "Yield + weight reduction" },
        mainhand: { id: "T6_2H_TOOL_SICKLE", name: "Master's Sickle", hint: "T6 fiber nodes" },
        cape: { id: "T4_CAPEITEM_AVALON", name: "Adept's Avalonian Cape", hint: "Gathering yield bonus" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "High carry weight" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T5_JOURNAL_FIBER_EMPTY", name: "Expert Cropper's Journal (Empty)", hint: "Better laborer returns" },
      ],
    },
  },
  "solo-dungeon-farming": {
    yellow: {
      title: "Yellow Zone Build",
      description: "Budget T4 sustain build for safe solo RDs: knockdown only.",
      slots: {
        head: { id: "T4_HEAD_CLOTH_SET1", name: "Adept's Scholar Cowl", hint: "Energy regen" },
        armor: { id: "T4_ARMOR_LEATHER_SET1", name: "Adept's Mercenary Jacket", hint: "Damage + defense" },
        shoes: { id: "T4_SHOES_PLATE_SET1", name: "Adept's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T4_MAIN_RAPIER_MORGANA", name: "Adept's Bloodletter", hint: "Lifesteal sustain" },
        food: { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "+damage" },
        potion: { id: "T4_POTION_HEAL", name: "Healing Potion", hint: "Emergency heal" },
      },
    },
    red: {
      title: "Red Zone Build",
      description: "T5 mixed gear for red-zone solo RDs with better clear speed.",
      slots: {
        head: { id: "T4_HEAD_CLOTH_SET1", name: "Adept's Scholar Cowl", hint: "Energy regen" },
        armor: { id: "T5_ARMOR_LEATHER_SET1", name: "Expert's Mercenary Jacket", hint: "Stronger defense" },
        shoes: { id: "T5_SHOES_PLATE_SET1", name: "Expert's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T5_MAIN_RAPIER_MORGANA", name: "Expert's Bloodletter", hint: "Lifesteal + mobility" },
        cape: { id: "T4_CAPEITEM_FW_THETFORD", name: "Adept's Thetford Cape", hint: "Emergency invis" },
        food: { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "+damage" },
        potion: { id: "T4_POTION_HEAL", name: "Healing Potion", hint: "Sustain" },
      },
      inventory: [
        { id: "T4_POTION_ENERGY", name: "Energy Potion", hint: "Ability energy" },
      ],
    },
    black: {
      title: "Black Zone Build",
      description: "T6 bloodletter build for max solo RD profit in black zones.",
      slots: {
        head: { id: "T4_HEAD_CLOTH_SET1", name: "Adept's Scholar Cowl", hint: "Energy regen" },
        armor: { id: "T6_ARMOR_LEATHER_SET1", name: "Master's Mercenary Jacket", hint: "Strong damage + defense" },
        shoes: { id: "T6_SHOES_PLATE_SET1", name: "Master's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T6_MAIN_RAPIER_MORGANA", name: "Master's Bloodletter", hint: "Lifesteal sustain" },
        cape: { id: "T4_CAPEITEM_FW_THETFORD", name: "Adept's Thetford Cape", hint: "Emergency invis" },
        food: { id: "T6_MEAL_STEW", name: "Mutton Stew", hint: "+damage" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Emergency heal" },
      },
      inventory: [
        { id: "T6_POTION_ENERGY", name: "Major Energy Potion", hint: "Ability energy" },
      ],
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
        "1200 IP softcap setup — stack 15 Demonic Ferocity on floor 1, extract floor 2 for baseline profit.",
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
        "3 keys (duo) or 5 keys (trio) for the Treasure Vault. Sweaty PvP — vault portal is the safe extract on collapse.",
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
      description: "Budget T5 PvP build for knockdown-only corrupted dungeons.",
      slots: {
        head: { id: "T5_HEAD_PLATE_SET1", name: "Expert's Soldier Helmet", hint: "Shield option" },
        armor: { id: "T5_ARMOR_LEATHER_SET1", name: "Expert's Mercenary Jacket", hint: "Damage + defense" },
        shoes: { id: "T5_SHOES_PLATE_SET1", name: "Expert's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T5_MAIN_RAPIER_MORGANA", name: "Expert's Bloodletter", hint: "Burst + sustain" },
        food: { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "+damage" },
        potion: { id: "T4_POTION_HEAL", name: "Healing Potion", hint: "Sustain" },
      },
    },
    stalker: {
      title: "Stalker Build (Red)",
      description: "T6 mixed build for red-zone corrupted PvPvE.",
      slots: {
        head: { id: "T6_HEAD_PLATE_SET1", name: "Master's Soldier Helmet", hint: "Emergency shield" },
        armor: { id: "T6_ARMOR_LEATHER_SET1", name: "Master's Mercenary Jacket", hint: "Damage + defense" },
        shoes: { id: "T6_SHOES_PLATE_SET1", name: "Master's Soldier Boots", hint: "Gap close" },
        mainhand: { id: "T6_MAIN_RAPIER_MORGANA", name: "Master's Bloodletter", hint: "Burst + sustain" },
        cape: { id: "T4_CAPEITEM_FW_THETFORD", name: "Adept's Thetford Cape", hint: "Failsafe invis" },
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
        cape: { id: "T4_CAPEITEM_FW_THETFORD", name: "Adept's Thetford Cape", hint: "Failsafe invis" },
        food: { id: "T6_MEAL_STEW", name: "Mutton Stew", hint: "+damage" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Sustain" },
      },
      inventory: [
        { id: "T6_POTION_ENERGY", name: "Major Energy Potion", hint: "Ability energy" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage" },
      ],
    },
  },
  "t2-blackzone-roaming": {
    learning: {
      title: "T2 Budget Roam + Fish",
      description:
        "Full T2 Soldier + Fire Staff kit (~540 IP). Fish between camps, fill journals, gank when it is free.",
      slots: {
        head: {
          id: "T2_HEAD_PLATE_SET1",
          name: "Novice's Soldier Helmet",
          hint: "Minimal IP, low replacement cost",
        },
        armor: {
          id: "T2_ARMOR_PLATE_SET1",
          name: "Novice's Soldier Armor",
          hint: "Cheap plate for open-world fights",
        },
        shoes: {
          id: "T2_SHOES_PLATE_SET1",
          name: "Novice's Soldier Boots",
          hint: "Mobility for kiting and escapes",
        },
        mainhand: {
          id: "T2_MAIN_FIRESTAFF",
          name: "Novice's Fire Staff",
          hint: "1H fire for opportunistic ganks",
        },
        offhand: {
          id: "T2_OFF_SHIELD",
          name: "Novice's Shield",
          hint: "Extra survivability",
        },
        cape: {
          id: "T2_CAPE",
          name: "Novice's Cape",
          hint: "Cheap cape slot",
        },
        bag: {
          id: "T2_BAG",
          name: "Novice's Bag",
          hint: "Carry journals and loot",
        },
        mount: {
          id: "T2_MOUNT_MULE",
          name: "Novice's Mule",
          hint: "Cheap carry weight",
        },
        potion: {
          id: "T3_POTION_STONESKIN",
          name: "Minor Resistance Potion",
          hint: "CC resist + defense",
          quantity: 2,
        },
      },
      inventory: [
        { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "Food between fights", quantity: 2 },
        { id: "T4_2H_TOOL_FISHINGROD", name: "Adept's Fishing Rod", hint: "Swap in at schools only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Fish between camps" },
        { id: "T4_JOURNAL_FISHING_EMPTY", name: "Adept Fisherman's Journal (Empty)", hint: "Fills while fishing" },
        { id: "T4_JOURNAL_TROPHY_GENERAL_EMPTY", name: "Adept Generalist Trophy Journal (Empty)", hint: "Fills on any fame" },
      ],
    },
    verified: {
      title: "T2 Roam + Fish (Verified)",
      description:
        "Same ~540 IP kit with invis pot for banking journal stacks. Community verified ~11.5M over ~10–15 hr.",
      slots: {
        head: {
          id: "T2_HEAD_PLATE_SET1",
          name: "Novice's Soldier Helmet",
          hint: "Minimal IP, low replacement cost",
        },
        armor: {
          id: "T2_ARMOR_PLATE_SET1",
          name: "Novice's Soldier Armor",
          hint: "Cheap plate for open-world fights",
        },
        shoes: {
          id: "T2_SHOES_PLATE_SET1",
          name: "Novice's Soldier Boots",
          hint: "Mobility for kiting and escapes",
        },
        mainhand: {
          id: "T2_MAIN_FIRESTAFF",
          name: "Novice's Fire Staff",
          hint: "1H fire for opportunistic ganks",
        },
        offhand: {
          id: "T2_OFF_SHIELD",
          name: "Novice's Shield",
          hint: "Extra survivability",
        },
        cape: {
          id: "T2_CAPE",
          name: "Novice's Cape",
          hint: "Cheap cape slot",
        },
        bag: {
          id: "T2_BAG",
          name: "Novice's Bag",
          hint: "Carry journals and loot",
        },
        mount: {
          id: "T2_MOUNT_MULE",
          name: "Novice's Mule",
          hint: "Cheap carry weight",
        },
        potion: {
          id: "T3_POTION_STONESKIN",
          name: "Minor Resistance Potion",
          hint: "CC resist + defense",
          quantity: 2,
        },
      },
      inventory: [
        { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "Food between fights", quantity: 2 },
        { id: "T4_2H_TOOL_FISHINGROD", name: "Adept's Fishing Rod", hint: "Swap in at schools only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Fish between camps and chests" },
        { id: "T4_JOURNAL_FISHING_EMPTY", name: "Adept Fisherman's Journal (Empty)", hint: "Major income when full" },
        { id: "T4_JOURNAL_TROPHY_GENERAL_EMPTY", name: "Adept Generalist Trophy Journal (Empty)", hint: "Fills on fish, camps, kills" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Extract with journal stacks" },
        { id: "T4_POTION_ENERGY", name: "Energy Potion", hint: "Extra ability uptime in PvP" },
      ],
    },
    hot: {
      title: "T2 Roam (Active Zone)",
      description:
        "Same kit when zones are busy: more PvP and chests on top of the fishing + journal baseline.",
      slots: {
        head: {
          id: "T2_HEAD_PLATE_SET1",
          name: "Novice's Soldier Helmet",
          hint: "Minimal IP, low replacement cost",
        },
        armor: {
          id: "T2_ARMOR_PLATE_SET1",
          name: "Novice's Soldier Armor",
          hint: "Cheap plate for open-world fights",
        },
        shoes: {
          id: "T2_SHOES_PLATE_SET1",
          name: "Novice's Soldier Boots",
          hint: "Mobility for kiting and escapes",
        },
        mainhand: {
          id: "T2_MAIN_FIRESTAFF",
          name: "Novice's Fire Staff",
          hint: "1H fire for opportunistic ganks",
        },
        offhand: {
          id: "T2_OFF_SHIELD",
          name: "Novice's Shield",
          hint: "Extra survivability",
        },
        cape: {
          id: "T2_CAPE",
          name: "Novice's Cape",
          hint: "Cheap cape slot",
        },
        bag: {
          id: "T2_BAG",
          name: "Novice's Bag",
          hint: "Carry journals and loot",
        },
        mount: {
          id: "T2_MOUNT_MULE",
          name: "Novice's Mule",
          hint: "Cheap carry weight",
        },
        potion: {
          id: "T3_POTION_STONESKIN",
          name: "Minor Resistance Potion",
          hint: "CC resist + defense",
          quantity: 2,
        },
      },
      inventory: [
        { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "Food between fights", quantity: 2 },
        { id: "T4_2H_TOOL_FISHINGROD", name: "Adept's Fishing Rod", hint: "Swap in at schools only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Fish between fights" },
        { id: "T4_JOURNAL_FISHING_EMPTY", name: "Adept Fisherman's Journal (Empty)", hint: "Fills while fishing" },
        { id: "T4_JOURNAL_TROPHY_GENERAL_EMPTY", name: "Adept Generalist Trophy Journal (Empty)", hint: "Fills on any fame" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage" },
        { id: "T4_POTION_ENERGY", name: "Energy Potion", hint: "Ability energy" },
      ],
    },
  },
  "high-tier-group-tracking": {
    "t6-red": {
      title: "T6 Red Learning Group",
      description:
        "Budget T6 kit for learning T7 Golem veteran hunts in red zones. Tracker uses T6 toolkit (tracks up to T7 Golem).",
      slots: {
        head: {
          id: "T6_HEAD_LEATHER_SET1",
          name: "Master's Mercenary Hood",
          hint: "Budget DPS for learning clears",
        },
        armor: {
          id: "T6_ARMOR_LEATHER_SET1",
          name: "Master's Mercenary Jacket",
          hint: "Damage + defense",
        },
        shoes: {
          id: "T6_SHOES_LEATHER_SET3",
          name: "Master's Stalker Shoes",
          hint: "Mobility between hunt steps",
        },
        mainhand: {
          id: "T6_2H_FIRESTAFF",
          name: "Master's Wildfire Staff",
          hint: "AoE on Golem phases",
        },
        cape: {
          id: "T4_CAPEITEM_FW_FORTSTERLING",
          name: "Adept's Fort Sterling Cape",
          hint: "CC reduction",
        },
        food: { id: "T6_MEAL_SANDWICH", name: "Beef Sandwich", hint: "+defense food" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Sustain" },
      },
      inventory: [
        {
          id: "T6_2H_TOOL_TRACKING",
          name: "Master's Tracking Toolkit",
          hint: "Tracker: T6 toolkit tracks up to T7 Golem",
        },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Escape ganks" },
      ],
    },
    "t7-veteran": {
      title: "T7 Golem 5-Man Build",
      description:
        "Standard Golem farm comp: Wildfire DPS. Incubus tank, Fallen healer. Tracker uses T7 toolkit.",
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
          hint: "Tracker: T7 Golem and T8 Dawnbird (tier +1)",
        },
        { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", hint: "Burst on engage" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage gankers" },
      ],
    },
    "t8-expert": {
      title: "T8 Dawnbird Expert Group",
      description:
        "Heavier T7-T8 combat kit for Dawnbird veteran hunts. Tracker still uses a T7 toolkit (tier +1).",
      slots: {
        head: {
          id: "T7_HEAD_PLATE_SET2",
          name: "Grandmaster's Guardian Helmet",
          hint: "Tank slot: face Dawnbird burst",
        },
        armor: {
          id: "T7_ARMOR_PLATE_SET2",
          name: "Grandmaster's Guardian Armor",
          hint: "Tank survivability",
        },
        shoes: {
          id: "T7_SHOES_PLATE_SET2",
          name: "Grandmaster's Guardian Boots",
          hint: "Hold engage zone",
        },
        mainhand: {
          id: "T7_MAIN_MACE_HELL",
          name: "Grandmaster's Incubus Mace",
          hint: "Standard tracking tank weapon",
        },
        offhand: {
          id: "T7_OFF_SHIELD_HELL",
          name: "Grandmaster's Infernal Shield",
          hint: "Mitigation for Dawnbird phases",
        },
        cape: {
          id: "T4_CAPEITEM_FW_FORTSTERLING",
          name: "Adept's Fort Sterling Cape",
          hint: "CC reduction",
        },
        food: { id: "T8_MEAL_SANDWICH", name: "Beef Sandwich", hint: "+defense for long hunts" },
        potion: { id: "T6_POTION_HEAL", name: "Major Healing Potion", hint: "Sustain" },
      },
      inventory: [
        {
          id: "T7_2H_TOOL_TRACKING",
          name: "Grandmaster's Tracking Toolkit",
          hint: "Tracker: T8 Dawnbird via tier +1 (no T8 toolkit required)",
        },
        {
          id: "T7_2H_HOLYSTAFF_HELL",
          name: "Grandmaster's Fallen Staff",
          hint: "Healer off-set: swap with tank gear",
        },
        { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", hint: "Burst damage window" },
        { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Disengage contested hunts" },
      ],
    },
  },
  "shoreline-fishing-guide": {
    "10-30": {
      title: "New Angler Setup",
      description:
        "Weapon, cape, bag, and mount while traveling: equip the rod from your bag only at a school.",
      slots: {
        ...FISHING_COMBAT_SLOTS,
        mount: { id: "T3_MOUNT_HORSE", name: "Journeyman's Riding Horse", hint: "Cheap travel" },
      },
      inventory: [
        { id: "T3_2H_TOOL_FISHINGROD", name: "Journeyman's Fishing Rod", hint: "Equip at the school only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use every cast" },
      ],
    },
    "20-40": {
      title: "Mid-Level Shore Setup",
      description: "T4 rod in bag, combat kit equipped while riding between shoreline spots.",
      slots: {
        ...FISHING_COMBAT_SLOTS,
        food: { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "+carry weight" },
      },
      inventory: [
        { id: "T4_2H_TOOL_FISHINGROD", name: "Adept's Fishing Rod", hint: "Equip at the school only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use every cast" },
        { id: "T4_JOURNAL_FISHING_EMPTY", name: "Adept Fisherman's Journal (Empty)", hint: "Optional bonus" },
      ],
    },
    "40+": {
      title: "Optimized Shore Setup",
      description: "T5 fisherman armor with rod in bag: swap to rod only when casting.",
      slots: {
        head: { id: "T5_HEAD_GATHERER_FISH", name: "Expert's Fisherman Cap", hint: "Fishing yield" },
        armor: { id: "T5_ARMOR_GATHERER_FISH", name: "Expert's Fisherman Garb", hint: "Fishing yield" },
        shoes: { id: "T5_SHOES_GATHERER_FISH", name: "Expert's Fisherman Workboots", hint: "Weight reduction" },
        ...FISHING_COMBAT_SLOTS,
        food: { id: "T4_MEAL_STEW", name: "Goat Stew", hint: "+carry weight" },
      },
      inventory: [
        { id: "T5_2H_TOOL_FISHINGROD", name: "Expert's Fishing Rod", hint: "Equip at the school only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use every cast" },
        { id: "T4_JOURNAL_FISHING_EMPTY", name: "Adept Fisherman's Journal (Empty)", hint: "Bonus income" },
      ],
    },
  },
  "mists-fishing": {
    "10-30": {
      title: "Early Mists Fishing",
      description:
        "Expert fisherman set with rod in bag. Yellow Mists are knockdown-only — wear your best gear.",
      slots: {
        head: { id: "T5_HEAD_GATHERER_FISH", name: "Expert's Fisherman Cap", hint: "Fishing yield" },
        armor: { id: "T5_ARMOR_GATHERER_FISH", name: "Expert's Fisherman Garb", hint: "Fishing yield" },
        shoes: { id: "T5_SHOES_GATHERER_FISH", name: "Expert's Fisherman Workboots", hint: "Weight reduction" },
        ...MISTS_FISHING_TRAVEL_SLOTS,
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", hint: "+15% yield, +30% carry weight" },
      },
      inventory: [
        { id: "T5_2H_TOOL_FISHINGROD", name: "Expert's Fishing Rod", hint: "In bag — cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use at every school" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
    "30-60": {
      title: "Mid-Level Mists Fishing",
      description:
        "Master's fisherman set for T7 yellow Mist zones. Rod in bag — no need to equip it to cast.",
      slots: {
        head: { id: "T6_HEAD_GATHERER_FISH", name: "Master's Fisherman Cap", hint: "Fishing yield" },
        armor: { id: "T6_ARMOR_GATHERER_FISH", name: "Master's Fisherman Garb", hint: "Fishing yield" },
        shoes: { id: "T6_SHOES_GATHERER_FISH", name: "Master's Fisherman Workboots", hint: "Weight reduction" },
        ...MISTS_FISHING_TRAVEL_SLOTS,
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
      },
      inventory: [
        { id: "T6_2H_TOOL_FISHINGROD", name: "Master's Fishing Rod", hint: "In bag — cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use at every school" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
    "60+": {
      title: "Expert Mists Fishing",
      description:
        "Grandmaster fisherman set with your best cape, bag, and mount. Rod stays in bag the whole run.",
      slots: {
        head: { id: "T7_HEAD_GATHERER_FISH", name: "Grandmaster's Fisherman Cap", hint: "Max fishing yield" },
        armor: { id: "T7_ARMOR_GATHERER_FISH", name: "Grandmaster's Fisherman Garb", hint: "Max fishing yield" },
        shoes: { id: "T7_SHOES_GATHERER_FISH", name: "Grandmaster's Fisherman Workboots", hint: "Weight reduction" },
        ...MISTS_FISHING_TRAVEL_SLOTS,
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
      },
      inventory: [
        { id: "T7_2H_TOOL_FISHINGROD", name: "Grandmaster's Fishing Rod", hint: "In bag — cast without equipping" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Use at every school" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
        { id: "T1_MEAL_SEAWEEDSALAD", name: "Seaweed Salad", hint: "Optional speed buff" },
      ],
    },
  },
  "ava-roads-fishing": {
    safe: {
      title: "Safe Escape Build",
      description: "Cheap mobility setup: fisherman cap, pork pie ×2, rod in bag. Bloodletter equipped if dismounted.",
      slots: {
        head: { id: "T7_HEAD_GATHERER_FISH", name: "Grandmaster's Fisherman Cap", hint: "Fishing yield bonus" },
        ...ESCAPE_SLOTS,
        bag: { id: "T4_BAG", name: "Adept's Bag", hint: "+151 kg on mount" },
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
        mount: { id: "T3_MOUNT_HORSE", name: "Journeyman's Riding Horse", hint: "Cheap replacement mount" },
      },
      inventory: [
        { id: "T7_2H_TOOL_FISHINGROD", name: "Grandmaster's Fishing Rod", hint: "Equip at T8 schools only" },
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
        { id: "T7_2H_TOOL_FISHINGROD", name: "Grandmaster's Fishing Rod", hint: "Equip at T8 schools only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Every cast" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
    profit: {
      title: "T8 Max Profit Gear",
      description:
        "Full T8 fisherman set + pork pie (~4 T7/down + ~3 T8 fish per cast. Rod in bag between schools.",
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
        { id: "T8_2H_TOOL_FISHINGROD", name: "Elder's Fishing Rod", hint: "Equip at T8 schools only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Every cast" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
    expert: {
      title: "T8 Max Spec (Deep Roads)",
      description:
        "Max fishing specs on T8 road maps: highest fish-per-cast and best Puremist Snapper odds.",
      slots: {
        head: { id: "T8_HEAD_GATHERER_FISH", name: "Elder's Fisherman Cap", hint: "Fishing yield" },
        armor: { id: "T8_ARMOR_GATHERER_FISH", name: "Elder's Fisherman Garb", hint: "Fishing yield" },
        shoes: { id: "T8_SHOES_GATHERER_FISH", name: "Elder's Fisherman Workboots", hint: "Weight reduction" },
        mainhand: FISHING_COMBAT_SLOTS.mainhand,
        cape: { id: "T4_CAPEITEM_AVALON", name: "Adept's Avalonian Cape", hint: "Extra yield" },
        bag: FISHING_COMBAT_SLOTS_T5.bag,
        food: { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2, hint: "+15% yield, +30% carry weight, 2/hr" },
        potion: { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", hint: "Essential escape" },
        mount: { id: "T4_MOUNT_GIANTSTAG", name: "Adept's Giant Stag", hint: "High carry weight on road loops" },
      },
      inventory: [
        { id: "T8_2H_TOOL_FISHINGROD", name: "Elder's Fishing Rod", hint: "Equip at T8 schools only" },
        { id: "T3_FISHINGBAIT", name: "Fancy Fish Bait", hint: "Every cast" },
        { id: "T7_JOURNAL_FISHING_EMPTY", name: "Grandmaster Fisherman's Journal (Empty)", hint: "Fill while fishing" },
      ],
    },
  },
  "laborer-passive-income": {
    small: {
      title: "T8 Island (4-6 laborers)",
      description: "T8 houses with T8 furniture processing T7 journals at 150% yield (~5 jobs per 22h cycle.",
      slots: {},
      inventory: [
        { id: "T8_FURNITUREITEM_BED", name: "Elder's Bed", hint: "One T8 bed per laborer" },
        { id: "T8_FURNITUREITEM_TABLE", name: "Elder's Table", hint: "One T8 table per four laborers" },
        { id: "T8_FURNITUREITEM_TROPHY_GENERAL", name: "Ledger of Truths", hint: "T8 generalist trophy" },
        { id: "T8_FURNITUREITEM_TROPHY_ORE", name: "Adamantium Ore Sample", hint: "T8 prospector trophy" },
        { id: "T7_JOURNAL_TROPHY_GENERAL_FULL", name: "Grandmaster's Generalist Trophy Journal (Full)", hint: "Hand to laborer: fills on any fame" },
        { id: "T7_JOURNAL_ORE_FULL", name: "Grandmaster Prospector's Journal (Full)", hint: "Hand to prospector (~58 T7 ore at 150%" },
        { id: "T7_JOURNAL_FIBER_FULL", name: "Grandmaster Cropper's Journal (Full)", hint: "Hand to cropper (~58 T7 fiber at 150%" },
      ],
    },
    medium: {
      title: "T8 Island (8-12 laborers)",
      description: "Full T8 setup on T7 journals (~10 jobs per 22h at 150% yield (~58 T7 resources each).",
      slots: {},
      inventory: [
        { id: "T8_FURNITUREITEM_BED", name: "Elder's Bed", hint: "One T8 bed per laborer" },
        { id: "T8_FURNITUREITEM_TABLE", name: "Elder's Table", hint: "One T8 table per four laborers" },
        { id: "T8_FURNITUREITEM_TROPHY_GENERAL", name: "Ledger of Truths", hint: "T8 generalist trophy" },
        { id: "T8_FURNITUREITEM_TROPHY_ORE", name: "Adamantium Ore Sample", hint: "T8 prospector trophy" },
        { id: "T7_JOURNAL_TROPHY_GENERAL_FULL", name: "Grandmaster's Generalist Trophy Journal (Full)", hint: "Hand to laborer: fills on any fame" },
        { id: "T7_JOURNAL_ORE_FULL", name: "Grandmaster Prospector's Journal (Full)", hint: "Hand to prospector: one per 22h job" },
        { id: "T7_JOURNAL_FIBER_FULL", name: "Grandmaster Cropper's Journal (Full)", hint: "Hand to cropper: one per 22h job" },
        { id: "T7_JOURNAL_WOOD_FULL", name: "Grandmaster Lumberjack's Journal (Full)", hint: "Hand to lumberjack: one per 22h job" },
      ],
    },
    large: {
      title: "T8 Island (16 laborers)",
      description: "Maxed level-6 island (16 T8 laborers on T7 journals, 150% yield, 16 jobs per 22h cycle.",
      slots: {},
      inventory: [
        { id: "T8_FURNITUREITEM_BED", name: "Elder's Bed", hint: "One T8 bed per laborer" },
        { id: "T8_FURNITUREITEM_TABLE", name: "Elder's Table", hint: "One T8 table per four laborers" },
        { id: "T8_FURNITUREITEM_TROPHY_GENERAL", name: "Ledger of Truths", hint: "T8 generalist trophy" },
        { id: "T8_FURNITUREITEM_TROPHY_ORE", name: "Adamantium Ore Sample", hint: "T8 prospector trophy" },
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
        { id: "T4_JOURNAL_MERCENARY_EMPTY", name: "Adept Mercenary's Journal (Empty)", quantity: 1, hint: "Optional bonus" },
      ],
    },
    t6: {
      title: "T6 Bulk Alchemy",
      description:
        "Daily stock for Major Healing Potion (focus) and Major Energy Potion (no focus).",
      slots: {},
      inventory: [
        { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72, hint: "Per 5 pots: both T6 majors" },
        { id: "T5_EGG", name: "Goose Eggs", quantity: 18, hint: "Per 5 Major Healing Potions" },
        { id: "T6_MILK", name: "Sheep's Milk", quantity: 18, hint: "Per 5 Major Energy Potions" },
        { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18, hint: "Per 5 pots: both T6 majors" },
        { id: "T4_JOURNAL_MERCENARY_EMPTY", name: "Adept Mercenary's Journal (Empty)", quantity: 1, hint: "Optional bonus" },
      ],
    },
    t7: {
      title: "T7 War Potions",
      description:
        "Add T7 herbs and burdock before ZvZ: same T6 stock plus war-pot inputs for Gigantify and Resistance.",
      slots: {},
      inventory: [
        { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72, hint: "Per 5 T6 majors; 36 for war pots" },
        { id: "T5_EGG", name: "Goose Eggs", quantity: 18, hint: "Healing + Gigantify per 5" },
        { id: "T6_MILK", name: "Sheep's Milk", quantity: 18, hint: "Energy + Resistance per 5" },
        { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18, hint: "Per 5 T6 major recipes" },
        { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72, hint: "Per 5 Gigantify or Resistance" },
        { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 18, hint: "Per 5 war pots" },
        { id: "T4_BURDOCK", name: "Crenellated Burdock", quantity: 36, hint: "Per 5 Major Resistance Potions" },
        { id: "T5_JOURNAL_MERCENARY_EMPTY", name: "Expert Mercenary's Journal (Empty)", quantity: 1, hint: "Better returns" },
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
