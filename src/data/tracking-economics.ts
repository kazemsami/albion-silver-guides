/** Tracking profit model config for high-tier-group-tracking (Avalonian Roads). */

export type TrackingScenarioId = "expected" | "good" | "lucky";

export interface TrackingRareDrop {
  id: string;
  name: string;
  /** Per-kill drop chance (0-1) for Expected scenario. */
  dropChance: number;
}

/** Average group loot quantity per kill from a ~22 kill Roads session (20-24 kills). */
export interface TrackingLootLine {
  id: string;
  name: string;
  perKill: number;
}

export interface TrackingTierConfig {
  id: string;
  label: string;
  description: string;
  killsPerHour: number;
  averageLoot: TrackingLootLine[];
  remnant: TrackingRareDrop;
  /** Extra veteran remnants rolled on other mixed targets (Panther, Werewolf, Dawnbird, etc.). */
  extraRemnants?: TrackingRareDrop[];
}

export interface TrackingRiskDefaults {
  downtimePercent: number;
  failedHuntPercent: number;
  repairCostPerPlayerHour: number;
  deathProbabilityPerPlayerHour: number;
  kitReplacementCostPerPlayer: number;
}

/** Reference video session: ~4.95M per player (~19.8M group) in 3.6 active hours, 4-man split. */
export const TRACKING_REFERENCE_SESSION = {
  groupLootSilver: 19_800_000,
  perPlayerSilver: 4_950_000,
  activeHours: 3.6,
  sampleKills: 22,
  groupSize: 4,
} as const;

/** Midpoint of the 20-24 kill session sample used for average loot quantities. */
export const TRACKING_SAMPLE_KILLS = TRACKING_REFERENCE_SESSION.sampleKills;

/**
 * Average loot per kill from a mixed veteran Roads session (~19.8M group / ~4.95M per player in materials tab).
 * Quantities = screenshot totals ÷ 22 kills. Remnants are included here (not rolled twice).
 */
export const TRACKING_AVERAGE_LOOT_PER_KILL: TrackingLootLine[] = [
  { id: "T1_ALCHEMY_COMMON", name: "Rare Animal Remains", perKill: 7.91 }, // 174 total

  { id: "T4_RUNE", name: "Adept's Rune (T4)", perKill: 9.41 }, // 207 total
  { id: "T5_RUNE", name: "Expert's Rune (T5)", perKill: 6.82 }, // 150 total
  { id: "T6_RUNE", name: "Master's Rune (T6)", perKill: 2.27 }, // 50 total
  { id: "T7_RUNE", name: "Grandmaster's Rune (T7)", perKill: 0.14 }, // 3 total
  { id: "T8_RUNE", name: "Elder's Rune (T8)", perKill: 0.32 }, // 7 total

  { id: "T4_SOUL", name: "Adept's Soul (T4)", perKill: 4.55 }, // 100 total
  { id: "T5_SOUL", name: "Expert's Soul (T5)", perKill: 2.77 }, // 61 total
  { id: "T6_SOUL", name: "Master's Soul (T6)", perKill: 0.68 }, // 15 total
  { id: "T7_SOUL", name: "Grandmaster's Soul (T7)", perKill: 0.32 }, // 7 total
  { id: "T8_SOUL", name: "Elder's Soul (T8)", perKill: 0.09 }, // 2 total

  { id: "T4_RELIC", name: "Adept's Relic (T4)", perKill: 1.86 }, // 41 total
  { id: "T5_RELIC", name: "Expert's Relic (T5)", perKill: 0.82 }, // 18 total
  { id: "T6_RELIC", name: "Master's Relic (T6)", perKill: 0.45 }, // 10 total

  { id: "T4_SKILLBOOK_STANDARD", name: "Adept's Tome of Insight (T4)", perKill: 0.36 }, // 8 total

  { id: "T5_ALCHEMY_RARE_PANTHER", name: "Fine Shadow Claws (T5)", perKill: 0.27 }, // 6 total
  { id: "T7_ALCHEMY_RARE_PANTHER", name: "Excellent Shadow Claws (T7)", perKill: 0.05 }, // 1 total

  { id: "T5_ALCHEMY_RARE_EAGLE", name: "Fine Dawnfeather (T5)", perKill: 0.14 }, // 3 total
  { id: "T7_ALCHEMY_RARE_EAGLE", name: "Excellent Dawnfeather (T7)", perKill: 0.23 }, // 5 total

  { id: "T5_ALCHEMY_RARE_DIREBEAR", name: "Fine Spirit Paws (T5)", perKill: 0.32 }, // 7 total
  { id: "T7_ALCHEMY_RARE_DIREBEAR", name: "Excellent Spirit Paws (T7)", perKill: 0.05 }, // 1 total

  { id: "T5_ALCHEMY_RARE_WEREWOLF", name: "Fine Werewolf Fangs (T5)", perKill: 0.14 }, // 3 total

  { id: "T5_ALCHEMY_RARE_IMP", name: "Fine Imp's Horn (T5)", perKill: 0.14 }, // 3 total
  { id: "T7_ALCHEMY_RARE_IMP", name: "Excellent Imp's Horn (T7)", perKill: 0.05 }, // 1 total

  { id: "T5_ALCHEMY_RARE_ELEMENTAL", name: "Fine Runestone Tooth (T5)", perKill: 0.05 }, // 1 total

  { id: "T5_ALCHEMY_RARE_ENT", name: "Fine Sylvian Root (T5)", perKill: 0.14 }, // 3 total

  { id: "T5_ARTEFACT_2H_SHAPESHIFTER_AVALON", name: "Expert's Dawnbird Remnant (T5)", perKill: 0.23 }, // 5 total
  { id: "T7_ARTEFACT_2H_SHAPESHIFTER_AVALON", name: "Grandmaster's Dawnbird Remnant (T7)", perKill: 0.14 }, // 3 total

  { id: "T4_ARTEFACT_2H_SHAPESHIFTER_MORGANA", name: "Adept's Werewolf Remnant (T4)", perKill: 0.05 }, // 1 total
  { id: "T5_ARTEFACT_2H_SHAPESHIFTER_MORGANA", name: "Expert's Werewolf Remnant (T5)", perKill: 0.05 }, // 1 total

  { id: "T4_ARTEFACT_2H_SHAPESHIFTER_KEEPER", name: "Adept's Runestone Golem Remnant (T4)", perKill: 0.05 }, // 1 total
  { id: "T5_ARTEFACT_2H_SHAPESHIFTER_KEEPER", name: "Expert's Runestone Golem Remnant (T5)", perKill: 0.5 }, // 11 total
];

export const DEFAULT_GROUP_SIZE = 4;
export const MIN_GROUP_SIZE = 4;
export const MAX_GROUP_SIZE = 8;

export const DEFAULT_TRACKING_RISK: TrackingRiskDefaults = {
  downtimePercent: 0.12,
  failedHuntPercent: 0.1,
  repairCostPerPlayerHour: 20_000,
  deathProbabilityPerPlayerHour: 0.04,
  kitReplacementCostPerPlayer: 350_000,
};

const REFERENCE_KILLS_PER_HOUR =
  TRACKING_REFERENCE_SESSION.sampleKills /
  TRACKING_REFERENCE_SESSION.activeHours;

export const TRACKING_TIER_CONFIGS: TrackingTierConfig[] = [
  {
    id: "ava-roads",
    label: "Group tracking",
    description:
      "Mixed veteran hunts on Avalonian Roads (~6.1 kills/hr from a 3.6 hr reference session). Expected loot is calibrated to ~4.95M per player (~19.8M group) in that session.",
    killsPerHour: REFERENCE_KILLS_PER_HOUR,
    averageLoot: TRACKING_AVERAGE_LOOT_PER_KILL,
    remnant: {
      id: "T7_ARTEFACT_2H_SHAPESHIFTER_KEEPER",
      name: "Grandmaster's Golem Remnant",
      dropChance: 0,
    },
    extraRemnants: [],
  },
];

export const TRACKING_SCENARIO_META: Record<
  TrackingScenarioId,
  { label: string; note: string }
> = {
  expected: {
    label: "Expected",
    note: "Calibrated to ~4.95M per player (~19.8M group) in a 3.6 hr reference session (~22 kills). Remnants are averaged into the loot table.",
  },
  good: {
    label: "Good hour",
    note: "Above-average material drops and pace on clean Roads routes.",
  },
  lucky: {
    label: "Lucky hour",
    note: "Strong material hour with a bit more loot than the reference session. Not a stable hourly average.",
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
  return TRACKING_TIER_CONFIGS.find((t) => t.id === tierId) ?? TRACKING_TIER_CONFIGS[0];
}

/** All item ids used in the tracking loot model (for price snapshots). */
export function getTrackingLootItemIds(): string[] {
  const ids = new Set<string>();
  for (const tier of TRACKING_TIER_CONFIGS) {
    for (const loot of tier.averageLoot) ids.add(loot.id);
    ids.add(tier.remnant.id);
    for (const extra of tier.extraRemnants ?? []) ids.add(extra.id);
  }
  for (const item of TRACKING_CONSUMABLES_PER_PLAYER_HOUR) ids.add(item.id);
  ids.add("T7_2H_TOOL_TRACKING");
  return [...ids];
}
