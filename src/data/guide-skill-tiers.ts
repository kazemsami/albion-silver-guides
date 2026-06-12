import type { SkillTier } from "@/types/guide";

export const SKILL_TIERS = {
  gatheringLow: {
    id: "low",
    label: "Beginner",
    description: "T4 gear, learning routes, fewer enchanted nodes",
    outputMultiplier: 0.55,
  },
  gatheringMid: {
    id: "mid",
    label: "Intermediate",
    description: "T5 gear, efficient loops, steady yield",
    outputMultiplier: 1,
  },
  gatheringHigh: {
    id: "high",
    label: "Advanced",
    description: "Optimized routes, enchanted nodes, premium buffs",
    outputMultiplier: 1.35,
  },
  fishing10_30: {
    id: "10-30",
    label: "Fishing 10-30",
    description: "Early fisherman spec, slower catches",
    outputMultiplier: 0.6,
  },
  fishing30_60: {
    id: "30-60",
    label: "Fishing 30-60",
    description: "Mid-level fishing, better rod and yield",
    outputMultiplier: 0.85,
  },
  fishing60plus: {
    id: "60+",
    label: "Fishing 60+",
    description: "T7 fisherman, max throughput",
    outputMultiplier: 1,
  },
  avaSafe: {
    id: "safe",
    label: "Safe escape build",
    description: "Fisherman cap + pork pie + GM rod, no garb/boots (~345 fish/hr)",
    outputMultiplier: 1,
    consumableMultiplier: 1,
  },
  avaGrandmaster: {
    id: "grandmaster",
    label: "T7 gear (middle spec)",
    description: "T7 fisherman set (~400 fish/hr",
    outputMultiplier: 1,
  },
  avaProfit: {
    id: "profit",
    label: "T8 max profit",
    description: "Full T8 fisherman set + pork pie (~450 fish/hr",
    outputMultiplier: 1,
  },
  avaExpert: {
    id: "expert",
    label: "T8 max spec (deep roads)",
    description: "Max fishing specs (~550 fish/hr on T8 road maps",
    outputMultiplier: 1,
  },
  dungeonYellow: {
    id: "yellow",
    label: "Yellow / blue zones",
    description: "Knockdown only, safer solo RDs",
    outputMultiplier: 0.45,
  },
  dungeonRed: {
    id: "red",
    label: "Red zones",
    description: "Better loot, full-loot risk",
    outputMultiplier: 0.75,
  },
  dungeonBlack: {
    id: "black",
    label: "Black zones",
    description: "Top-tier RD farming, high risk",
    outputMultiplier: 1,
  },
  corruptedHunter: {
    id: "hunter",
    label: "Hunter (blue/yellow)",
    description: "Knockdown only, learning PvP",
    outputMultiplier: 0.5,
  },
  corruptedStalker: {
    id: "stalker",
    label: "Stalker (red)",
    description: "Full-loot, moderate infamy",
    outputMultiplier: 0.8,
  },
  corruptedSlayer: {
    id: "slayer",
    label: "Slayer (black)",
    description: "Max rewards, top PvP risk",
    outputMultiplier: 1,
  },
  depthsLearning: {
    id: "learning",
    label: "Floor 1 extract",
    description: "Exit floor 1 with a soul when stacks are low or you are learning (~600k–800k/hr)",
    outputMultiplier: 0.65,
    consumableMultiplier: 0.85,
  },
  depthsStandard: {
    id: "standard",
    label: "Floor 2 extract (baseline)",
    description: "Cash out floor 2 after ~30 min, best risk/reward for most teams and solo PvE",
    outputMultiplier: 1,
  },
  depthsExpert: {
    id: "expert",
    label: "Floor 3 vault",
    description: "3 keys (duo) or 5 keys (trio) + Treasure Vault, high variance, sweaty PvP",
    outputMultiplier: 1.35,
    consumableMultiplier: 1.15,
  },
  trackingT6Red: {
    id: "t6-red",
    label: "T6 red learning",
    description: "T6 gear, learning T7 Golem veteran flow in red: slower kills",
    outputMultiplier: 0.55,
    consumableMultiplier: 0.7,
    bonusOutput: [
      {
        id: "T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER",
        name: "Grandmaster's Golem Remnant",
        quantity: 0.6,
      },
      {
        id: "T7_ESSENCE_POTION",
        name: "Grandmaster's Essence",
        quantity: 2,
      },
    ],
  },
  trackingT7Veteran: {
    id: "t7-veteran",
    label: "T7 Golem (5-man)",
    description: "Runestone Golem veteran loop with a T7 toolkit (~2-3M/hr per player",
    outputMultiplier: 1,
    bonusOutput: [
      {
        id: "T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER",
        name: "Grandmaster's Golem Remnant",
        quantity: 1.6,
      },
      {
        id: "T7_ESSENCE_POTION",
        name: "Grandmaster's Essence",
        quantity: 5,
      },
    ],
  },
  trackingT8Expert: {
    id: "t8-expert",
    label: "T8 Dawnbird expert",
    description: "Dawnbird veteran hunts with the same T7 toolkit (tier +1) (~3.5-5M/hr",
    outputMultiplier: 0.8,
    consumableMultiplier: 1.15,
    bonusOutput: [
      {
        id: "T8_ARTEFACT_2H_SHAPESHIFTER_AVALON",
        name: "Elder's Dawnbird Remnant",
        quantity: 1.85,
      },
      {
        id: "T8_ESSENCE_POTION",
        name: "Elder's Essence",
        quantity: 2.5,
      },
    ],
  },
  capitalLow: {
    id: "low-capital",
    label: "Low capital",
    description: "Smaller hauls or flip volume",
    outputMultiplier: 0.5,
    inputMultiplier: 0.5,
  },
  capitalMid: {
    id: "mid-capital",
    label: "Standard",
    description: "Typical session volume",
    outputMultiplier: 1,
    inputMultiplier: 1,
  },
  capitalHigh: {
    id: "high-capital",
    label: "High capital",
    description: "Large hauls or high-volume flipping",
    outputMultiplier: 1.6,
    inputMultiplier: 1.6,
  },
  laborerSmall: {
    id: "small",
    label: "4-6 laborers",
    description: "T8 houses, T7 journals (~5 jobs per 22h cycle",
    outputMultiplier: 0.5,
  },
  laborerMid: {
    id: "medium",
    label: "8-12 laborers",
    description: "T8 houses, T7 journals (~10 jobs per 22h at 150% yield",
    outputMultiplier: 1,
  },
  laborerLarge: {
    id: "large",
    label: "16 laborers",
    description: "Full T8 island (16 T7 journals per 22h at 150% yield",
    outputMultiplier: 1.6,
  },
  craftingT5: {
    id: "t5",
    label: "T5 crafting",
    description: "Lower volume alchemy",
    outputMultiplier: 0.7,
    inputMultiplier: 0.7,
  },
  craftingT6: {
    id: "t6",
    label: "T6 bulk",
    description: "Standard war-season batch size",
    outputMultiplier: 1,
    inputMultiplier: 1,
  },
  craftingT7: {
    id: "t7",
    label: "T7 + focus",
    description: "High spec with focus returns",
    outputMultiplier: 1.25,
    inputMultiplier: 1.1,
  },
  bzRoamingLearning: {
    id: "learning",
    label: "Learning routes",
    description: "Quiet zones, fewer fights (~500k/hr)",
    outputMultiplier: 0.55,
    consumableMultiplier: 0.8,
  },
  bzRoamingVerified: {
    id: "verified",
    label: "Community verified",
    description:
      "11.5M over ~10–15 hr (~750k–1.2M/hr): fish, journals, treasures, PvP loot",
    outputMultiplier: 1,
  },
  bzRoamingHot: {
    id: "hot",
    label: "Active zone",
    description: "Strong PvP and chest RNG on good days",
    outputMultiplier: 1.25,
  },
} as const satisfies Record<string, SkillTier>;

export function tiers(...items: SkillTier[]): SkillTier[] {
  return items;
}
