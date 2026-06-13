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
    description: "T5 gear, Lazygrass Plain. Default tier matches one logged 30-min Bridgewatch run extrapolated to 1 hr.",
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
    description:
      "Fisherman cap + pork pie + GM rod, no garb/boots (~345 fish/hr). Full-loot roads: calculator includes ~0.06 deaths/hr on cheap kit.",
    outputMultiplier: 1,
    consumableMultiplier: 1,
    inputMultiplier: 1,
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
    description:
      "Full T8 fisherman set + pork pie (~450 fish/hr). Calculator models ~0.12 gear deaths/hr on lethal roads.",
    outputMultiplier: 1,
    inputMultiplier: 1,
  },
  avaExpert: {
    id: "expert",
    label: "T8 max spec (deep roads)",
    description:
      "Max fishing specs (~550 fish/hr on T8 road maps). Deep roads: ~0.18 deaths/hr in calculator.",
    outputMultiplier: 1,
    inputMultiplier: 1,
  },
  dungeonYellow: {
    id: "yellow",
    label: "Yellow / blue zones",
    description: "Knockdown only, safer solo RDs",
    outputMultiplier: 0.45,
    inputMultiplier: 0,
  },
  dungeonRed: {
    id: "red",
    label: "Red zones",
    description:
      "T6 red solo RDs (~400 runes/hr). Calculator models ~0.08 full-kit deaths/hr.",
    outputMultiplier: 0.75,
    inputMultiplier: 1,
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
    description: "Knockdown only, learning PvP (no gear-loss cost modeled)",
    outputMultiplier: 0.5,
    inputMultiplier: 0,
  },
  corruptedStalker: {
    id: "stalker",
    label: "Stalker (red)",
    description: "Full-loot Stalker runs; profit swings with invasions and deaths",
    outputMultiplier: 0.8,
    inputMultiplier: 1,
  },
  corruptedSlayer: {
    id: "slayer",
    label: "Slayer (black)",
    description: "Max rewards, highest death risk on full-loot Slayer",
    outputMultiplier: 1,
    inputMultiplier: 1.15,
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
    description:
      "Cash out floor 2 after ~30 min. Calculator figures are pre-tax and swing with PvP wins and extract timing.",
    outputMultiplier: 1,
  },
  depthsExpert: {
    id: "expert",
    label: "Floor 3 vault",
    description: "3 keys (duo) or 5 keys (trio) + Treasure Vault, high variance, sweaty PvP",
    outputMultiplier: 1.35,
    consumableMultiplier: 1.15,
  },
  trackingAvaRoads: {
    id: "ava-roads",
    label: "Group tracking",
    description:
      "Mixed veteran hunts on Avalonian Roads (~6-7 kills/hr): Golem, Dawnbird, Panther, Werewolf, Rare Quarry",
    outputMultiplier: 1,
    bonusOutput: [
      {
        id: "T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER",
        name: "Grandmaster's Golem Remnant",
        quantity: 0.18,
      },
      {
        id: "T8_ARTEFACT_2H_SHAPESHIFTER_AVALON",
        name: "Elder's Dawnbird Remnant",
        quantity: 0.1,
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
    label: "4-6 houses",
    description: "12-18 laborers (3 per house), T7 journals (~15 jobs per 22h cycle)",
    outputMultiplier: 0.5,
  },
  laborerMid: {
    id: "medium",
    label: "8-12 houses",
    description: "24-36 laborers (3 per house), T7 journals (~30 jobs per 22h at 150% yield)",
    outputMultiplier: 1,
  },
  laborerLarge: {
    id: "large",
    label: "16 houses",
    description: "48 laborers on a full T8 island (48 T7 journals per 22h at 150% yield)",
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
} as const satisfies Record<string, SkillTier>;

export function tiers(...items: SkillTier[]): SkillTier[] {
  return items;
}
