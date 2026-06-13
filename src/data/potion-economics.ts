/** Bulk potion crafting model for potions-crafting-bulk. */

export type PotionSellThroughId = "instant" | "typical" | "slow";

export type PotionRecipeId =
  | "heal"
  | "energy"
  | "poison"
  | "berserk"
  | "hellfire"
  | "gathering"
  | "tornado"
  | "gigantify"
  | "resistance"
  | "sticky"
  | "calming"
  | "cleansing"
  | "acid"
  | "poison-major"
  | "berserk-major"
  | "hellfire-major"
  | "gathering-major"
  | "tornado-major"
  | "invisibility";

export interface PotionRecipeMaterial {
  id: string;
  name: string;
  quantity: number;
}

export interface PotionRecipe {
  id: PotionRecipeId;
  tier: 6 | 7 | 8;
  name: string;
  shortName: string;
  outputId: string;
  outputName: string;
  outputQuantity: number;
  focusCost: number;
  /** Fixed silver charged by the lab per craft action (5 pots). */
  craftSilverCost?: number;
  materials: PotionRecipeMaterial[];
}

export interface PotionSessionMix {
  healBatchesPerHour: number;
  energyBatchesPerHour: number;
}

export interface PotionEconomicsDefaults {
  focusMaterialReturnRate: number;
  noFocusMaterialReturnRate: number;
  focusSilverPerPoint: number;
  minutesPerBatch: number;
  sellThroughPotsPerHour: number;
}

export const MAJOR_HEALING_CRAFT_SILVER = 2_500;

export const POTION_RECIPES: PotionRecipe[] = [
  {
    id: "heal",
    tier: 6,
    name: "Major Healing Potion batch",
    shortName: "Major Healing",
    outputId: "T6_POTION_HEAL",
    outputName: "Major Healing Potion",
    outputQuantity: 5,
    focusCost: 2746,
    craftSilverCost: MAJOR_HEALING_CRAFT_SILVER,
    materials: [
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72 },
      { id: "T5_EGG", name: "Goose Eggs", quantity: 18 },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18 },
    ],
  },
  {
    id: "energy",
    tier: 6,
    name: "Major Energy Potion batch",
    shortName: "Major Energy",
    outputId: "T6_POTION_ENERGY",
    outputName: "Major Energy Potion",
    outputQuantity: 5,
    focusCost: 3323,
    materials: [
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72 },
      { id: "T6_MILK", name: "Sheep's Milk", quantity: 18 },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 18 },
    ],
  },
  {
    id: "poison",
    tier: 6,
    name: "Poison Potion batch",
    shortName: "Poison",
    outputId: "T6_POTION_COOLDOWN",
    outputName: "Poison Potion",
    outputQuantity: 5,
    focusCost: 1635,
    materials: [
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 24 },
      { id: "T5_TEASEL", name: "Dragon Teasel", quantity: 12 },
      { id: "T3_COMFREY", name: "Brightleaf Comfrey", quantity: 12 },
      { id: "T6_MILK", name: "Sheep's Milk", quantity: 6 },
    ],
  },
  {
    id: "berserk",
    tier: 6,
    name: "Berserk Potion batch",
    shortName: "Berserk",
    outputId: "T6_POTION_BERSERK",
    outputName: "Berserk Potion",
    outputQuantity: 10,
    focusCost: 298,
    materials: [
      { id: "T5_ALCHEMY_RARE_WEREWOLF", name: "Fine Werewolf Fangs", quantity: 1 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 48 },
      { id: "T2_AGARIC", name: "Arcane Agaric", quantity: 24 },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 12 },
    ],
  },
  {
    id: "hellfire",
    tier: 6,
    name: "Hellfire Potion batch",
    shortName: "Hellfire",
    outputId: "T6_POTION_LAVA",
    outputName: "Hellfire Potion",
    outputQuantity: 10,
    focusCost: 294,
    materials: [
      { id: "T5_ALCHEMY_RARE_IMP", name: "Fine Imp's Horn", quantity: 1 },
      { id: "T6_MILK", name: "Sheep's Milk", quantity: 48 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 24 },
      { id: "T3_EGG", name: "Hen Eggs", quantity: 12 },
    ],
  },
  {
    id: "gathering",
    tier: 6,
    name: "Gathering Potion batch",
    shortName: "Gathering",
    outputId: "T6_POTION_GATHER",
    outputName: "Gathering Potion",
    outputQuantity: 10,
    focusCost: 310,
    materials: [
      { id: "T5_ALCHEMY_RARE_ELEMENTAL", name: "Fine Runestone Tooth", quantity: 1 },
      { id: "T6_BUTTER", name: "Sheep's Butter", quantity: 48 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 24 },
      { id: "T5_TEASEL", name: "Dragon Teasel", quantity: 12 },
    ],
  },
  {
    id: "tornado",
    tier: 6,
    name: "Tornado in a Bottle batch",
    shortName: "Tornado",
    outputId: "T6_POTION_TORNADO",
    outputName: "Tornado in a Bottle",
    outputQuantity: 10,
    focusCost: 294,
    materials: [
      { id: "T5_ALCHEMY_RARE_EAGLE", name: "Fine Dawnfeather", quantity: 1 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 48 },
      { id: "T5_TEASEL", name: "Dragon Teasel", quantity: 24 },
      { id: "T3_EGG", name: "Hen Eggs", quantity: 12 },
    ],
  },
  {
    id: "gigantify",
    tier: 7,
    name: "Major Gigantify Potion batch",
    shortName: "Major Gigantify",
    outputId: "T7_POTION_REVIVE",
    outputName: "Major Gigantify Potion",
    outputQuantity: 5,
    focusCost: 4413,
    materials: [
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 36 },
      { id: "T5_EGG", name: "Goose Eggs", quantity: 18 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 18 },
    ],
  },
  {
    id: "resistance",
    tier: 7,
    name: "Major Resistance Potion batch",
    shortName: "Major Resistance",
    outputId: "T7_POTION_STONESKIN",
    outputName: "Major Resistance Potion",
    outputQuantity: 5,
    focusCost: 5503,
    materials: [
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 36 },
      { id: "T4_BURDOCK", name: "Crenellated Burdock", quantity: 36 },
      { id: "T6_MILK", name: "Sheep's Milk", quantity: 18 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 18 },
    ],
  },
  {
    id: "sticky",
    tier: 7,
    name: "Major Sticky Potion batch",
    shortName: "Major Sticky",
    outputId: "T7_POTION_SLOWFIELD",
    outputName: "Major Sticky Potion",
    outputQuantity: 5,
    focusCost: 5503,
    materials: [
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 36 },
      { id: "T4_BURDOCK", name: "Crenellated Burdock", quantity: 36 },
      { id: "T5_EGG", name: "Goose Eggs", quantity: 18 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 18 },
    ],
  },
  {
    id: "calming",
    tier: 7,
    name: "Major Calming Potion batch",
    shortName: "Major Calming",
    outputId: "T7_POTION_MOB_RESET",
    outputName: "Major Calming Potion",
    outputQuantity: 10,
    focusCost: 1272,
    materials: [
      { id: "T7_ALCHEMY_RARE_PANTHER", name: "Excellent Shadow Claws", quantity: 1 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 144 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72 },
      { id: "T3_COMFREY", name: "Brightleaf Comfrey", quantity: 72 },
      { id: "T2_AGARIC", name: "Arcane Agaric", quantity: 36 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 36 },
    ],
  },
  {
    id: "cleansing",
    tier: 7,
    name: "Major Cleansing Potion batch",
    shortName: "Major Cleansing",
    outputId: "T7_POTION_CLEANSE2",
    outputName: "Major Cleansing Potion",
    outputQuantity: 10,
    focusCost: 1283,
    materials: [
      { id: "T7_ALCHEMY_RARE_ENT", name: "Excellent Sylvian Root", quantity: 1 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 144 },
      { id: "T4_BURDOCK", name: "Crenellated Burdock", quantity: 72 },
      { id: "T3_COMFREY", name: "Brightleaf Comfrey", quantity: 72 },
      { id: "T6_BUTTER", name: "Sheep's Butter", quantity: 36 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 36 },
    ],
  },
  {
    id: "acid",
    tier: 7,
    name: "Major Acid Potion batch",
    shortName: "Major Acid",
    outputId: "T7_POTION_ACID",
    outputName: "Major Acid Potion",
    outputQuantity: 10,
    focusCost: 1296,
    materials: [
      { id: "T7_ALCHEMY_RARE_DIREBEAR", name: "Excellent Spirit Paws", quantity: 1 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 144 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 72 },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 72 },
      { id: "T6_MILK", name: "Sheep's Milk", quantity: 36 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 36 },
    ],
  },
  {
    id: "invisibility",
    tier: 8,
    name: "Invisibility Potion batch",
    shortName: "Invisibility",
    outputId: "T8_POTION_CLEANSE",
    outputName: "Invisibility Potion",
    outputQuantity: 5,
    focusCost: 1272,
    materials: [
      { id: "T8_YARROW", name: "Ghoul Yarrow", quantity: 72 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 36 },
      { id: "T5_TEASEL", name: "Dragon Teasel", quantity: 36 },
      { id: "T8_MILK", name: "Cow's Milk", quantity: 18 },
      { id: "T8_ALCOHOL", name: "Pumpkin Moonshine", quantity: 18 },
    ],
  },
  {
    id: "poison-major",
    tier: 8,
    name: "Major Poison Potion batch",
    shortName: "Major Poison",
    outputId: "T8_POTION_COOLDOWN",
    outputName: "Major Poison Potion",
    outputQuantity: 5,
    focusCost: 1272,
    materials: [
      { id: "T8_YARROW", name: "Ghoul Yarrow", quantity: 72 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 36 },
      { id: "T5_TEASEL", name: "Dragon Teasel", quantity: 36 },
      { id: "T8_MILK", name: "Cow's Milk", quantity: 18 },
      { id: "T8_ALCOHOL", name: "Pumpkin Moonshine", quantity: 18 },
    ],
  },
  {
    id: "berserk-major",
    tier: 8,
    name: "Major Berserk Potion batch",
    shortName: "Major Berserk",
    outputId: "T8_POTION_BERSERK",
    outputName: "Major Berserk Potion",
    outputQuantity: 10,
    focusCost: 1307,
    materials: [
      { id: "T7_ALCHEMY_RARE_WEREWOLF", name: "Excellent Werewolf Fangs", quantity: 1 },
      { id: "T8_YARROW", name: "Ghoul Yarrow", quantity: 144 },
      { id: "T3_COMFREY", name: "Brightleaf Comfrey", quantity: 72 },
      { id: "T6_ALCOHOL", name: "Potato Schnapps", quantity: 72 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 36 },
      { id: "T8_ALCOHOL", name: "Pumpkin Moonshine", quantity: 36 },
    ],
  },
  {
    id: "hellfire-major",
    tier: 8,
    name: "Major Hellfire Potion batch",
    shortName: "Major Hellfire",
    outputId: "T8_POTION_LAVA",
    outputName: "Major Hellfire Potion",
    outputQuantity: 10,
    focusCost: 1272,
    materials: [
      { id: "T7_ALCHEMY_RARE_IMP", name: "Excellent Imp's Horn", quantity: 1 },
      { id: "T8_MILK", name: "Cow's Milk", quantity: 144 },
      { id: "T8_YARROW", name: "Ghoul Yarrow", quantity: 72 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72 },
      { id: "T5_EGG", name: "Goose Eggs", quantity: 36 },
      { id: "T8_ALCOHOL", name: "Pumpkin Moonshine", quantity: 36 },
    ],
  },
  {
    id: "gathering-major",
    tier: 8,
    name: "Major Gathering Potion batch",
    shortName: "Major Gathering",
    outputId: "T8_POTION_GATHER",
    outputName: "Major Gathering Potion",
    outputQuantity: 10,
    focusCost: 1319,
    materials: [
      { id: "T7_ALCHEMY_RARE_ELEMENTAL", name: "Excellent Runestone Tooth", quantity: 1 },
      { id: "T8_BUTTER", name: "Cow's Butter", quantity: 144 },
      { id: "T8_YARROW", name: "Ghoul Yarrow", quantity: 72 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72 },
      { id: "T6_FOXGLOVE", name: "Elusive Foxglove", quantity: 36 },
      { id: "T8_ALCOHOL", name: "Pumpkin Moonshine", quantity: 36 },
    ],
  },
  {
    id: "tornado-major",
    tier: 8,
    name: "Major Tornado in a Bottle batch",
    shortName: "Major Tornado",
    outputId: "T8_POTION_TORNADO",
    outputName: "Major Tornado in a Bottle",
    outputQuantity: 10,
    focusCost: 1296,
    materials: [
      { id: "T7_ALCHEMY_RARE_EAGLE", name: "Excellent Dawnfeather", quantity: 1 },
      { id: "T8_YARROW", name: "Ghoul Yarrow", quantity: 144 },
      { id: "T7_MULLEIN", name: "Firetouched Mullein", quantity: 72 },
      { id: "T7_ALCOHOL", name: "Corn Hooch", quantity: 72 },
      { id: "T5_EGG", name: "Goose Eggs", quantity: 36 },
      { id: "T8_ALCOHOL", name: "Pumpkin Moonshine", quantity: 36 },
    ],
  },
];

export const POTION_RECIPE_ORDER: PotionRecipeId[] = POTION_RECIPES.map(
  (recipe) => recipe.id,
);

export const POTION_RECIPE_GROUPS: {
  tier: string;
  recipeIds: PotionRecipeId[];
  comingSoon?: boolean;
}[] = [
  {
    tier: "T6",
    recipeIds: POTION_RECIPES.filter((r) => r.tier === 6)
      .map((r) => r.id)
      .slice(0, 3),
  },
  {
    tier: "T7",
    recipeIds: POTION_RECIPES.filter((r) => r.tier === 7)
      .map((r) => r.id)
      .slice(0, 3),
  },
  {
    tier: "T8",
    recipeIds: [],
    comingSoon: true,
  },
];

const recipeById = Object.fromEntries(
  POTION_RECIPES.map((recipe) => [recipe.id, recipe]),
) as Record<PotionRecipeId, PotionRecipe>;

export function getPotionRecipe(recipeId: PotionRecipeId): PotionRecipe {
  return recipeById[recipeId];
}

export const T6_POTION_SESSION: PotionSessionMix = {
  healBatchesPerHour: 20,
  energyBatchesPerHour: 35,
};

export const DEFAULT_DAILY_FOCUS_BUDGET = 30_000;
export const DEFAULT_FOCUS_SESSION_HOURS = 2;

export const DEFAULT_POTION_DEFAULTS: PotionEconomicsDefaults = {
  focusMaterialReturnRate: 0.45,
  noFocusMaterialReturnRate: 0.15,
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

export const MAJOR_HEALING_RECIPE = getPotionRecipe("heal");

export function getPotionTierMultiplier(tierId: string): number {
  return POTION_TIER_MULTIPLIERS[tierId] ?? 1;
}
