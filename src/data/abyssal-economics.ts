/** Abyssal Depths profit model for abyssal-depths-farming. */

export type AbyssalScenarioId =
  | "conservative"
  | "floor2"
  | "pvpWin"
  | "floor3Vault";

export type AbyssalTeamSizeId = "solo" | "duo" | "trio";

export interface AbyssalLootLine {
  id: string;
  name: string;
  quantity: number;
  fixedSilverPerUnit?: number;
}

export interface AbyssalScenario {
  id: AbyssalScenarioId;
  label: string;
  description: string;
  tierId: string;
  referenceRunMinutes: number;
  pveLoot: AbyssalLootLine[];
  pvpLoot: AbyssalLootLine[];
  defaultWinRate: number;
  deathsPerRun: number;
  bagFillAtDeath: number;
  includePvpByDefault: boolean;
  highVariance?: boolean;
}

export const ABYSSAL_RUN_DURATIONS = [20, 30, 45] as const;
export type AbyssalRunDurationMinutes = (typeof ABYSSAL_RUN_DURATIONS)[number];
export const DEFAULT_ABYSSAL_RUN_DURATION: AbyssalRunDurationMinutes = 30;

export const ABYSSAL_QUEUE_MINUTES: Record<AbyssalTeamSizeId, number> = {
  solo: 8,
  duo: 10,
  trio: 12,
};

export const ABYSSAL_TEAM_META: Record<
  AbyssalTeamSizeId,
  {
    label: string;
    description: string;
    winRateMultiplier: number;
    pvpLootMultiplier: number;
    deathMultiplier: number;
  }
> = {
  solo: {
    label: "Solo",
    description: "Handicapped in PvP; floor-2 PvE extracts still work.",
    winRateMultiplier: 0.88,
    pvpLootMultiplier: 0.35,
    deathMultiplier: 1.15,
  },
  duo: {
    label: "Duo",
    description: "Recommended queue size. 3 vault keys on floor 3.",
    winRateMultiplier: 1,
    pvpLootMultiplier: 1,
    deathMultiplier: 1,
  },
  trio: {
    label: "Trio",
    description: "5 vault keys, stronger PvP but slower queue.",
    winRateMultiplier: 1.06,
    pvpLootMultiplier: 1.25,
    deathMultiplier: 0.92,
  },
};

/** Consumables for a full ~45 min run (scaled by run duration in compute). */
export const ABYSSAL_CONSUMABLES_PER_45MIN = [
  { id: "T7_MEAL_PIE", name: "Pork Pie", quantity: 2 },
  { id: "T6_POTION_HEAL", name: "Major Healing Potion", quantity: 4 },
  { id: "T7_POTION_REVIVE", name: "Major Gigantify Potion", quantity: 1 },
] as const;

export const ABYSSAL_SCENARIOS: AbyssalScenario[] = [
  {
    id: "conservative",
    label: "Conservative PvE extract",
    description:
      "Floor 1 soul exit when stacks are low or you are learning. Low bag risk, lower ceiling.",
    tierId: "learning",
    referenceRunMinutes: 20,
    pveLoot: [
      {
        id: "T4_RUNE",
        name: "Silver bags (opened in bag)",
        quantity: 0.35,
        fixedSilverPerUnit: 500_000,
      },
      { id: "T7_RUNE", name: "Grandmaster's Rune (floor 1 chests)", quantity: 42 },
      { id: "T6_SOUL", name: "Master's Soul", quantity: 32 },
    ],
    pvpLoot: [],
    defaultWinRate: 0.78,
    deathsPerRun: 0.06,
    bagFillAtDeath: 0.55,
    includePvpByDefault: false,
  },
  {
    id: "floor2",
    label: "Average floor-2 extract",
    description:
      "15 stacks on floor 1, cash out floor 2. Baseline modeled pace for headline silver/hr.",
    tierId: "standard",
    referenceRunMinutes: 30,
    pveLoot: [
      {
        id: "T4_RUNE",
        name: "Silver bags (opened in bag)",
        quantity: 0.75,
        fixedSilverPerUnit: 500_000,
      },
      { id: "T7_RUNE", name: "Grandmaster's Rune (rooms + chests)", quantity: 95 },
      { id: "T6_SOUL", name: "Master's Soul", quantity: 62 },
      { id: "T8_RUNE", name: "Elder's Rune (floor 2 chests)", quantity: 28 },
    ],
    pvpLoot: [],
    defaultWinRate: 0.68,
    deathsPerRun: 0.11,
    bagFillAtDeath: 0.82,
    includePvpByDefault: false,
  },
  {
    id: "pvpWin",
    label: "PvP win run",
    description:
      "Floor 2 extract plus altar souls and player-kill loot. Win rate and bag risk both rise.",
    tierId: "standard",
    referenceRunMinutes: 35,
    pveLoot: [
      {
        id: "T4_RUNE",
        name: "Silver bags (opened in bag)",
        quantity: 0.85,
        fixedSilverPerUnit: 500_000,
      },
      { id: "T7_RUNE", name: "Grandmaster's Rune", quantity: 105 },
      { id: "T6_SOUL", name: "Master's Soul (PvE)", quantity: 68 },
      { id: "T8_RUNE", name: "Elder's Rune", quantity: 32 },
    ],
    pvpLoot: [
      { id: "T6_SOUL", name: "Enemy red souls (altar greed)", quantity: 38 },
      { id: "T7_SOUL", name: "Grandmaster's Soul (player kills)", quantity: 14 },
      {
        id: "T4_RUNE",
        name: "Silver from greed chests",
        quantity: 0.35,
        fixedSilverPerUnit: 500_000,
      },
    ],
    defaultWinRate: 0.58,
    deathsPerRun: 0.18,
    bagFillAtDeath: 0.88,
    includePvpByDefault: true,
  },
  {
    id: "floor3Vault",
    label: "Floor-3 vault high-roll",
    description:
      "Treasure Vault + contested keys. High upside when it hits; many runs reset or wipe.",
    tierId: "expert",
    referenceRunMinutes: 45,
    pveLoot: [
      {
        id: "T4_RUNE",
        name: "Silver bags (opened in bag)",
        quantity: 1.6,
        fixedSilverPerUnit: 500_000,
      },
      { id: "T7_RUNE", name: "Grandmaster's Rune", quantity: 185 },
      { id: "T6_SOUL", name: "Master's Soul", quantity: 105 },
      { id: "T8_RUNE", name: "Elder's Rune (floor 2-3)", quantity: 115 },
      { id: "T8_SOUL", name: "Elder's Soul (vault + PvP)", quantity: 22 },
    ],
    pvpLoot: [
      { id: "T7_SOUL", name: "Grandmaster's Soul (vault fights)", quantity: 18 },
      {
        id: "T4_RUNE",
        name: "Bonus silver (vault swing)",
        quantity: 0.5,
        fixedSilverPerUnit: 500_000,
      },
    ],
    defaultWinRate: 0.44,
    deathsPerRun: 0.32,
    bagFillAtDeath: 0.92,
    includePvpByDefault: true,
    highVariance: true,
  },
];

export function getAbyssalScenario(id: AbyssalScenarioId): AbyssalScenario {
  return ABYSSAL_SCENARIOS.find((s) => s.id === id) ?? ABYSSAL_SCENARIOS[1];
}

export const ABYSSAL_WIN_RATE_BOUNDS = { min: 0.35, max: 0.9, step: 0.01 };
