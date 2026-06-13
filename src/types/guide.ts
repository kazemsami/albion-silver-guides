import type { MarketCityId } from "@/lib/market-cities";

export type GuideCategory =
  | "gathering"
  | "crafting"
  | "dungeons"
  | "fishing"
  | "laborers";

export type Difficulty = "beginner" | "intermediate" | "advanced";

/** Where the activity primarily takes place, safe royal/yellow zones vs full-loot risk. */
export type ZoneType = "safe" | "dangerous";

/** How thoroughly the guide's numbers and steps have been verified. */
export type GuideReviewStatus =
  | "tested-by-me"
  | "community-checked"
  | "tested-and-community-checked"
  | "needs-review";

/** Beginner-safe vs high variance / full-loot / RNG-heavy content. */
export type GuideRiskProfile = "beginner-safe" | "rng-heavy";

export interface GuideReviewEvidence {
  runs?: number;
  date: string;
  server?: string;
  gear?: string;
  market?: string;
  rawLootSilver?: number;
  deathsOrKnockdowns?: number;
  netSilver?: number;
  sourceTitle?: string;
  sourceUrl?: string;
  /** When set, shown instead of a single source link. */
  sources?: { title: string; url: string }[];
  notes?: string;
}

export interface GuideReliability {
  status: GuideReviewStatus;
  /** ISO date (YYYY-MM-DD) when the guide content was last reviewed or updated. */
  lastUpdated: string;
  evidence?: GuideReviewEvidence;
}

/** Four-band profit estimate shown on cards and calculators. */
export interface GuideProfitOutcomes {
  conservative: number | null;
  median: number | null;
  expected: number | null;
  highRoll: number | null;
}

export const profitOutcomeLabels: Record<keyof GuideProfitOutcomes, string> = {
  conservative: "Conservative",
  median: "Median",
  expected: "Expected value",
  highRoll: "High-roll",
};

export interface GuideReference {
  title: string;
  url: string;
}

export interface SilverTier {
  label: string;
  amount?: number;
  min?: number;
  max?: number;
}

export type EquipmentSlot =
  | "head"
  | "armor"
  | "shoes"
  | "mainhand"
  | "offhand"
  | "cape"
  | "bag"
  | "mount"
  | "food"
  | "potion";

export interface AlbionItem {
  id: string;
  name: string;
  hint?: string;
  /** Stack size shown on the item icon (defaults to 1). */
  quantity?: number;
}

export interface HourlyItem {
  id: string;
  name: string;
  quantity: number;
  /** Use buy-order average for inputs; defaults to sell for output. */
  side?: "buy" | "sell";
  /** Fixed silver per unit (e.g. mercenary journal loot) instead of market price. */
  fixedSilverPerUnit?: number;
  /** Used when no market listing exists (e.g. trade-chat-only artifacts). */
  estimatedSilverPerUnit?: number;
}

export interface SkillTier {
  id: string;
  label: string;
  description?: string;
  /** Scales hourly output quantities (1.0 = baseline in guide-economics config). */
  outputMultiplier: number;
  /** Scales input purchases; defaults to outputMultiplier. */
  inputMultiplier?: number;
  /** Scales consumable usage; defaults to outputMultiplier. */
  consumableMultiplier?: number;
  /** When set, replaces guide hourlyConsumables for this tier (e.g. safe build uses bait only). */
  hourlyConsumables?: HourlyItem[];
  /** When set, replaces guide hourlyOutput for this tier (still scaled by outputMultiplier). */
  hourlyOutput?: HourlyItem[];
  /** When set, replaces guide hourlyInputs for this tier (still scaled by inputMultiplier). */
  hourlyInputs?: HourlyItem[];
  /** Extra hourly output for this tier only (e.g. rare bonus catches). Not scaled. */
  bonusOutput?: HourlyItem[];
}

export interface GuideEconomics {
  /** Items produced or sold per hour at the baseline skill tier (multiplier 1.0). */
  hourlyOutput: HourlyItem[];
  /** Materials purchased per hour (arbitrage, crafting, transport). */
  hourlyInputs?: HourlyItem[];
  /** Consumables used up per hour (food, bait, potions). */
  hourlyConsumables?: HourlyItem[];
  /** Skill levels the player can pick to scale yields and profit. */
  skillTiers: SkillTier[];
  /** Which skillTiers id is selected by default on the guide page. */
  defaultSkillTierId: string;
  /** When set, the guide page shows an all-laborer specialty picker. */
  defaultLaborerSpecialtyId?: string;
}

/** JSON-safe price map passed from server to client profit calculator. */
export type SerializedPriceMap = Record<
  string,
  { sell: number | null; buy: number | null }
>;

/** Per-city price maps keyed by market city id (includes "average"). */
export type SerializedPricesByCity = Record<string, SerializedPriceMap>;

export interface PricedLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number | null;
  lineTotal: number | null;
  /** Where unitPrice came from, helps explain N/A vs estimate vs live market. */
  priceSource?: "market" | "fixed" | "estimated";
}

export interface LoadoutPricing {
  lines: PricedLine[];
  gearTotal: number | null;
  consumableTotal: number | null;
  total: number | null;
}

/** Per skill-tier loadout + pricing for the interactive guide page. */
export interface TierLoadoutBundle {
  tierId: string;
  loadout: EquipmentLoadout;
  pricing: LoadoutPricing;
  variant: "safe" | "profit" | "default";
}

export interface HourlyEconomicsResult {
  output: PricedLine[];
  outputTotal: number | null;
  input: PricedLine[];
  inputTotal: number | null;
  consumables: PricedLine[];
  consumableTotal: number | null;
  /** Before listing tax: output - inputs - consumables. */
  netTotal: number | null;
  /** Premium sell-order tax (~6.5% of gross output). */
  marketTaxTotal: number | null;
  /** netTotal minus marketTaxTotal. Best estimate of take-home silver. */
  netAfterTax: number | null;
  pricedAt: string;
  locationNote: string;
  /** True when any line uses estimatedSilverPerUnit (thin market data). */
  hasEstimatedPrices?: boolean;
}

export interface EquipmentLoadout {
  title: string;
  description: string;
  slots: Partial<Record<EquipmentSlot, AlbionItem>>;
  inventory?: AlbionItem[];
  /** T8 laborer houses needed (one per laborer); shows wiki build cost. */
  houseCount?: number;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  difficulty: Difficulty;
  zoneType: ZoneType;
  silverPerHour: { min: number; max: number };
  silverByLevel?: SilverTier[];
  safeBuild?: EquipmentLoadout;
  profitBuild?: EquipmentLoadout;
  requirements: string[];
  steps: string[];
  tips: string[];
  /** External videos, posts, or docs this guide is based on. */
  references?: GuideReference[];
  featured: boolean;
  readTime: number;
  reliability: GuideReliability;
  /** Preferred market city for price estimates on this guide. */
  defaultMarketCity?: MarketCityId;
  riskProfile?: GuideRiskProfile;
}

export const categoryLabels: Record<GuideCategory, string> = {
  gathering: "Gathering",
  crafting: "Crafting",
  dungeons: "Dungeons & PvE",
  fishing: "Fishing",
  laborers: "Laborers",
};

export const categoryDescriptions: Record<GuideCategory, string> = {
  gathering: "Harvest resources from the open world for steady silver income.",
  crafting: "Craft consumables and gear from gathered or bought materials.",
  dungeons: "Run solo or group content for loot, fame, and silver drops.",
  fishing: "Relaxing shoreline income with surprisingly strong returns.",
  laborers: "Passive income through island workers and journals.",
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const zoneTypeLabels: Record<ZoneType, string> = {
  safe: "Safe Zones",
  dangerous: "Dangerous Zones",
};

export const reviewStatusLabels: Record<GuideReviewStatus, string> = {
  "tested-by-me": "Tested by me",
  "community-checked": "Community checked",
  "tested-and-community-checked": "Tested & community checked",
  "needs-review": "Needs review",
};

export const riskProfileLabels: Record<GuideRiskProfile, string> = {
  "beginner-safe": "Beginner friendly",
  "rng-heavy": "Risk / RNG heavy",
};
