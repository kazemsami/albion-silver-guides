/** Bulk potion crafting model for potions-crafting-bulk. */

export type PotionSellThroughId = "instant" | "typical" | "slow";

export interface PotionRecipeMaterial {
  id: string;
  name: string;
  quantity: number;
}

export interface PotionRecipe {
  id: "heal" | "energy";
  name: string;
  outputId: string;
  outputName: string;
  outputQuantity: number;
  focusCost: number;
  materials: PotionRecipeMaterial[];
}

export interface PotionSessionMix {
  /** Major Healing batches per hour at T6 baseline (5 pots each). */
  healBatchesPerHour: number;
  /** Major Energy batches per hour at T6 baseline (5 pots each). */
  energyBatchesPerHour: number;
}

export interface PotionEconomicsDefaults {
  /** Brecilien alchemy lab station fee as fraction of batch output sell value. */
  stationFeeRate: number;
  /** Opportunity cost per focus point when focus is valued (silver). */
  focusSilverPerPoint: number;
  /** Minutes per batch action (craft + inventory). */
  minutesPerBatch: number;
  /** Conservative Caerleon sell-through for major pots (pots/hr at list price). */
  sellThroughPotsPerHour: number;
}

export const POTION_RECIPES: PotionRecipe[] = [
  {
    id: "heal",
    name: "Major Healing Potion batch",
    outputId: "T6_POTION_HEAL",
    outputName: "Major Healing Potion",
    outputQuantity: 5,
    focusCost: 768,
    materials: [
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72 },
      { id: "T5_EGG", name: "Goose Eggs", quantity: 18 },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18 },
    ],
  },
  {
    id: "energy",
    name: "Major Energy Potion batch",
    outputId: "T6_POTION_ENERGY",
    outputName: "Major Energy Potion",
    outputQuantity: 5,
    focusCost: 0,
    materials: [
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72 },
      { id: "T6_MILK", name: "Sheep's Milk", quantity: 18 },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18 },
    ],
  },
];

/** Realistic T6 session per active hour: heal capped by daily focus, energy fills lab time. */
export const T6_POTION_SESSION: PotionSessionMix = {
  /** ~15k focus/hr (768 × 20). Fits ~30k daily focus in a 2 hr craft block. */
  healBatchesPerHour: 20,
  energyBatchesPerHour: 35,
};

/** Planning defaults for optional focus opportunity cost (not spent silver). */
export const DEFAULT_DAILY_FOCUS_BUDGET = 30_000;
export const DEFAULT_FOCUS_SESSION_HOURS = 2;

export const DEFAULT_POTION_DEFAULTS: PotionEconomicsDefaults = {
  stationFeeRate: 0.045,
  focusSilverPerPoint: 100,
  minutesPerBatch: 0.4,
  sellThroughPotsPerHour: 350,
};

export const POTION_SELL_THROUGH_META: Record<
  PotionSellThroughId,
  { label: string; outputDiscount: number; note: string }
> = {
  instant: {
    label: "Instant sell",
    outputDiscount: 0,
    note: "Best case: stacks move at list price during prime hours. Uncommon for full bulk sessions.",
  },
  typical: {
    label: "Typical sell-through",
    outputDiscount: 0.05,
    note: "Relist once, minor undercutting, or partial stacks sit overnight. Default for planning.",
  },
  slow: {
    label: "Slow market",
    outputDiscount: 0.12,
    note: "Off-peak listing, price war, or holding inventory between ZvZ cycles.",
  },
};

export const POTION_TIER_MULTIPLIERS: Record<string, number> = {
  t5: 0.7,
  t6: 1,
  t7: 1.25,
};

export function getPotionTierMultiplier(tierId: string): number {
  return POTION_TIER_MULTIPLIERS[tierId] ?? 1;
}
