/** Tracking profit model config for high-tier-group-tracking. */

export type TrackingScenarioId = "expected" | "good" | "lucky";

export interface TrackingRareDrop {
  id: string;
  name: string;
  /** Per-kill drop chance (0-1) for Expected scenario. */
  dropChance: number;
}

export interface TrackingTierConfig {
  id: string;
  label: string;
  description: string;
  killsPerHour: number;
  /** Rare Animal Remains per successful kill (group loot). */
  remainsPerKill: number;
  remnant: TrackingRareDrop;
  essence: { id: string; name: string; perKill: number };
}

export interface TrackingRiskDefaults {
  downtimePercent: number;
  failedHuntPercent: number;
  repairCostPerPlayerHour: number;
  deathProbabilityPerPlayerHour: number;
  kitReplacementCostPerPlayer: number;
}

export const DEFAULT_GROUP_SIZE = 5;
export const MIN_GROUP_SIZE = 4;
export const MAX_GROUP_SIZE = 8;

export const DEFAULT_TRACKING_RISK: TrackingRiskDefaults = {
  downtimePercent: 0.15,
  failedHuntPercent: 0.12,
  repairCostPerPlayerHour: 20_000,
  deathProbabilityPerPlayerHour: 0.04,
  kitReplacementCostPerPlayer: 350_000,
};

export const TRACKING_TIER_CONFIGS: TrackingTierConfig[] = [
  {
    id: "t6-red",
    label: "T6 red learning",
    description: "Learning T7 Golem flow in red zones: fewer kills, lower remnant odds.",
    killsPerHour: 3,
    remainsPerKill: 21,
    remnant: {
      id: "T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER",
      name: "Grandmaster's Golem Remnant",
      dropChance: 0.012,
    },
    essence: {
      id: "T7_ESSENCE_POTION",
      name: "Grandmaster's Essence",
      perKill: 0.6,
    },
  },
  {
    id: "t7-veteran",
    label: "T7 Golem (5-man)",
    description: "Baseline Runestone Golem veteran loop (~5 kills/hr when routes are clean).",
    killsPerHour: 5,
    remainsPerKill: 38,
    remnant: {
      id: "T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER",
      name: "Grandmaster's Golem Remnant",
      dropChance: 0.018,
    },
    essence: {
      id: "T7_ESSENCE_POTION",
      name: "Grandmaster's Essence",
      perKill: 1.5,
    },
  },
  {
    id: "t8-expert",
    label: "T8 Dawnbird expert",
    description: "Dawnbird veteran hunts (tier +1 toolkit): fewer kills, higher remnant upside.",
    killsPerHour: 4,
    remainsPerKill: 30,
    remnant: {
      id: "T8_ARTEFACT_2H_SHAPESHIFTER_AVALON",
      name: "Elder's Dawnbird Remnant",
      dropChance: 0.015,
    },
    essence: {
      id: "T8_ESSENCE_POTION",
      name: "Elder's Essence",
      perKill: 1.2,
    },
  },
];

export const TRACKING_SCENARIO_META: Record<
  TrackingScenarioId,
  { label: string; note: string }
> = {
  expected: {
    label: "Expected",
    note: "Probability-weighted average drops. Use this for planning and comparisons.",
  },
  good: {
    label: "Good hour",
    note: "Above-average drops and pace, but not jackpot-level. Happens on clean routes with decent RNG.",
  },
  lucky: {
    label: "Lucky hour",
    note: "Group hits at least one rare remnant plus normal remains/essence. Not a stable hourly average.",
  },
};

/** Per-player consumables used per hour of hunting (food + pots). */
export const TRACKING_CONSUMABLES_PER_PLAYER_HOUR = [
  { id: "T6_MEAL_SANDWICH", name: "Beef Sandwich", quantity: 1 },
  { id: "T6_POTION_HEAL", name: "Major Healing Potion", quantity: 2 },
  { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", quantity: 0.25 },
  { id: "T8_POTION_CLEANSE", name: "Invisibility Potion", quantity: 0.1 },
] as const;

/** Shared tracker toolkit wear per hour (fraction of toolkit value). */
export const TRACKING_TOOLKIT_WEAR_PER_HOUR = 0.15;

export function getTrackingTierConfig(tierId: string): TrackingTierConfig {
  const tier = TRACKING_TIER_CONFIGS.find((t) => t.id === tierId);
  return tier ?? TRACKING_TIER_CONFIGS[1];
}
