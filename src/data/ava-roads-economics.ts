/** Avalonian Roads fishing profit model for ava-roads-fishing. */

export type AvaRoadsPresetId = "safe" | "normal" | "greedy";
export type AvaRoadsSnapperViewId = "expected" | "lucky";

export const AVA_CHOPS_PER_FISH = 15;

/** One Puremist Snapper school catch yields four fish in inventory. */
export const PUREMIST_SNAPPER_PER_CATCH = 4;

/** T7 gear: ~2/5 of fish are Sturgeon. */
export const AVA_T7_STURGEON_SHARE = 2 / 5;
/** T8 gear: ~3/7 of fish are Sturgeon. */
export const AVA_T8_STURGEON_SHARE = 3 / 7;

/** Logged Safe escape 30-min session (2026-06-14), extrapolated to 1 hr before uptime/yield scaling. */
export interface AvaLoggedCatchLine {
  id: string;
  name: string;
  /** Quantity per 30 min at logged pace (T7 cap + pork pie, no Premium). Hourly = ×2. */
  quantityPerHour: number;
}

/** Logged Safe escape 30-min session (2026-06-14, no Premium). Counts include T7 fisherman cap (+12.5% on non-Sturgeon). Puremist Snapper is modeled separately (RNG line). */
export const AVA_SAFE_LOGGED_CATCH_PER_30MIN: AvaLoggedCatchLine[] = [
  { id: "T8_FISH_FRESHWATER_ALL_COMMON", name: "River Sturgeon", quantityPerHour: 8 },
  { id: "T7_FISH_FRESHWATER_ALL_COMMON", name: "Danglemouth Catfish", quantityPerHour: 25 },
  { id: "T6_FISH_FRESHWATER_ALL_COMMON", name: "Brightscale Zander", quantityPerHour: 18 },
  { id: "T5_FISH_FRESHWATER_AVALON_RARE", name: "Clearhaze Snapper", quantityPerHour: 2 },
  { id: "T3_FISH_FRESHWATER_AVALON_RARE", name: "Whitefog Snapper", quantityPerHour: 18 },
  { id: "T1_SEAWEED", name: "Seaweed", quantityPerHour: 56 },
];

/** Puremist Snapper fish from the same logged 30-min session (separate RNG line in calculator). */
export const AVA_SAFE_LOGGED_SNAPPER_FISH_PER_30MIN = 2;

/** Logged session: 2 Snapper fish in 30 min → 4 fish/hr → 1 school catch/hr at 4 fish per catch. */
export const AVA_SAFE_LOGGED_SNAPPER_CATCHES_PER_HOUR =
  (AVA_SAFE_LOGGED_SNAPPER_FISH_PER_30MIN / PUREMIST_SNAPPER_PER_CATCH) * 2;

/** River Sturgeon is excluded from fisherman garb and workboots yield bonuses. */
export const AVA_STURGEON_ITEM_ID = "T8_FISH_FRESHWATER_ALL_COMMON";

/** Seaweed is not affected by fisherman gear yield bonuses. */
export const AVA_SEAWEED_ITEM_ID = "T1_SEAWEED";

function sumAvaLoggedFish(catchLines: AvaLoggedCatchLine[]): number {
  return catchLines
    .filter((item) => item.id !== AVA_SEAWEED_ITEM_ID)
    .reduce((sum, item) => sum + item.quantityPerHour, 0);
}

/** Same school-fish mix extrapolated to 1 hr (×2). Snapper excluded; see snapper constants above. */
export const AVA_SAFE_LOGGED_CATCH_PER_HOUR: AvaLoggedCatchLine[] =
  AVA_SAFE_LOGGED_CATCH_PER_30MIN.map((item) => ({
    ...item,
    quantityPerHour: item.quantityPerHour * 2,
  }));

/** Fish only (excludes seaweed and Puremist Snapper), logged hourly baseline before uptime/Premium scaling. */
export const AVA_SAFE_LOGGED_FISH_PER_HOUR = sumAvaLoggedFish(
  AVA_SAFE_LOGGED_CATCH_PER_HOUR,
);

/** Grandmaster journal fill from the same logged 30-min session. */
export const AVA_SAFE_LOGGED_JOURNAL_FILL_PER_30MIN = 5600 / 6640;

/** Extrapolated to 1 hr at the same fill pace (×2). */
export const AVA_SAFE_LOGGED_JOURNAL_FILL_PER_HOUR =
  AVA_SAFE_LOGGED_JOURNAL_FILL_PER_30MIN * 2;

/** T7 cap on Safe escape logged run: +12.5% on all fish except River Sturgeon (already in baseline). */
export const AVA_T7_FISHERMAN_CAP_YIELD = 1.125;

/** T7 Grandmaster Fisherman Garb: +30% fish yield (not Sturgeon). */
export const AVA_T7_FISHERMAN_GARB_YIELD = 1.3;

/** T7 Grandmaster Fisherman Workboots: +12.5% fish yield (not Sturgeon). */
export const AVA_T7_FISHERMAN_WORKBOOTS_YIELD = 1.125;

/** Combined T7 garb + workboots on bycatch (multiplicative). */
export const AVA_NORMAL_BYCATCH_GEAR_YIELD =
  AVA_T7_FISHERMAN_GARB_YIELD * AVA_T7_FISHERMAN_WORKBOOTS_YIELD;

/** T8 Elder cap, garb, and workboots: +17.5%, +35%, +17.5% on all fish (Greedy preset). */
export const AVA_T8_FISHERMAN_CAP_YIELD = 1.175;
export const AVA_T8_FISHERMAN_GARB_YIELD = 1.35;
export const AVA_T8_FISHERMAN_WORKBOOTS_YIELD = 1.175;
export const AVA_T8_FULL_GEAR_YIELD =
  AVA_T8_FISHERMAN_CAP_YIELD *
  AVA_T8_FISHERMAN_GARB_YIELD *
  AVA_T8_FISHERMAN_WORKBOOTS_YIELD;

function isAvaGearBonusFish(item: AvaLoggedCatchLine): boolean {
  return item.id !== AVA_STURGEON_ITEM_ID && item.id !== AVA_SEAWEED_ITEM_ID;
}

/** Apply T7 garb/boots on top of Safe escape logged mix (Sturgeon and seaweed unchanged). */
export function applyAvaBycatchGearYield(
  catchLines: AvaLoggedCatchLine[],
  gearYieldOnBycatch: number,
): AvaLoggedCatchLine[] {
  return catchLines.map((item) => ({
    ...item,
    quantityPerHour: isAvaGearBonusFish(item)
      ? item.quantityPerHour * gearYieldOnBycatch
      : item.quantityPerHour,
  }));
}

/**
 * Apply full T8 fisherman set on top of Safe escape logged mix.
 * Non-Sturgeon counts already include T7 cap; upgrade to T8 cap + garb + boots.
 * Sturgeon gets full T8 set (no T7 cap in baseline).
 */
export function applyAvaGreedyT8GearYield(
  catchLines: AvaLoggedCatchLine[],
): AvaLoggedCatchLine[] {
  return catchLines.map((item) => {
    if (item.id === AVA_SEAWEED_ITEM_ID) return item;
    if (item.id === AVA_STURGEON_ITEM_ID) {
      return {
        ...item,
        quantityPerHour: item.quantityPerHour * AVA_T8_FULL_GEAR_YIELD,
      };
    }
    return {
      ...item,
      quantityPerHour:
        item.quantityPerHour *
        (AVA_T8_FULL_GEAR_YIELD / AVA_T7_FISHERMAN_CAP_YIELD),
    };
  });
}

/** Apply a fish yield multiplier (skill, spec, etc.). Seaweed unchanged. */
export function applyAvaFishYieldBonus(
  catchLines: AvaLoggedCatchLine[],
  multiplier: number,
): AvaLoggedCatchLine[] {
  return catchLines.map((item) => ({
    ...item,
    quantityPerHour:
      item.id === AVA_SEAWEED_ITEM_ID
        ? item.quantityPerHour
        : item.quantityPerHour * multiplier,
  }));
}

/** Logged run was fishing 78; Greedy models fishing 100 + fishing spec 100. */
export const AVA_LOGGED_FISHING_LEVEL = 78;
export const AVA_GREEDY_FISHING_LEVEL = 100;
export const AVA_LOGGED_FISHING_SPEC_LEVEL = 33;
export const AVA_GREEDY_FISHING_SPEC_LEVEL = 100;
export const AVA_FISHING_SKILL_YIELD_PER_LEVEL = 0.0015;
export const AVA_FISHING_SPEC_YIELD_PER_LEVEL = 0.0035;

/** +26.75% fish vs logged run: spec 33→100 (+23.45%) + fishing 78→100 (+3.3%), additive. Journal unchanged. */
export const AVA_GREEDY_SKILL_SPEC_YIELD =
  1 +
  (AVA_GREEDY_FISHING_SPEC_LEVEL - AVA_LOGGED_FISHING_SPEC_LEVEL) *
    AVA_FISHING_SPEC_YIELD_PER_LEVEL +
  (AVA_GREEDY_FISHING_LEVEL - AVA_LOGGED_FISHING_LEVEL) *
    AVA_FISHING_SKILL_YIELD_PER_LEVEL;

/** Safe escape logged mix with T7 garb (+30%) and workboots (+12.5%) on non-Sturgeon fish. */
export const AVA_NORMAL_LOGGED_CATCH_PER_30MIN = applyAvaBycatchGearYield(
  AVA_SAFE_LOGGED_CATCH_PER_30MIN,
  AVA_NORMAL_BYCATCH_GEAR_YIELD,
);

/** Same mix extrapolated to 1 hr (×2). School fish only; Puremist Snapper is a separate RNG line. */
export const AVA_NORMAL_LOGGED_CATCH_PER_HOUR: AvaLoggedCatchLine[] =
  AVA_NORMAL_LOGGED_CATCH_PER_30MIN.map((item) => ({
    ...item,
    quantityPerHour: item.quantityPerHour * 2,
  }));

/** Fish only (excludes seaweed), Normal preset hourly baseline before uptime/Premium scaling. */
export const AVA_NORMAL_LOGGED_FISH_PER_HOUR = sumAvaLoggedFish(
  AVA_NORMAL_LOGGED_CATCH_PER_HOUR,
);

/** Greedy preset: T8 gear + max fishing/spec yield on logged Safe escape mix. */
export const AVA_GREEDY_LOGGED_CATCH_PER_30MIN = applyAvaFishYieldBonus(
  applyAvaGreedyT8GearYield(AVA_SAFE_LOGGED_CATCH_PER_30MIN),
  AVA_GREEDY_SKILL_SPEC_YIELD,
);

export const AVA_GREEDY_LOGGED_CATCH_PER_HOUR: AvaLoggedCatchLine[] =
  AVA_GREEDY_LOGGED_CATCH_PER_30MIN.map((item) => ({
    ...item,
    quantityPerHour: item.quantityPerHour * 2,
  }));

export const AVA_GREEDY_LOGGED_FISH_PER_HOUR = sumAvaLoggedFish(
  AVA_GREEDY_LOGGED_CATCH_PER_HOUR,
);

/** Logged journal fill is fixed at 5600/6640 per 30 min; gear and Premium fish boosts do not change it. */
export const AVA_LOGGED_JOURNAL_FILL_PER_HOUR = AVA_SAFE_LOGGED_JOURNAL_FILL_PER_HOUR;

/** Bank every 30-40 min on full-loot roads; 35 min used for death/loot-at-risk modeling. */
export const AVA_BANKING_INTERVAL_MINUTES = 35;

export interface AvaRoadsPreset {
  id: AvaRoadsPresetId;
  label: string;
  description: string;
  tierId: string;
  fishPerHour: number;
  sturgeonShare: number;
  /** Deaths per hour on full-loot roads. */
  deathsPerHour: number;
  /** Fraction of hour spent finding/portaling to a good T8 road. */
  portalSearchDowntime: number;
  /** Bank every N minutes on average. */
  bankingIntervalMinutes: number;
  /** Expected Puremist Snapper catches per hour (RNG average). Each catch = 4 fish. */
  snapperExpectedPerHour: number;
  /** Lucky hour: bonus Snapper catches (shown separately). Each catch = 4 fish. */
  snapperLuckyCount: number;
  /** Geared preset: rod id for death replacement (0.65× per death). */
  fishingRodId?: string;
  geared: boolean;
  consumables: {
    baitPerHour: number;
    porkPiePerHour: number;
    invisPerHour: number;
  };
}

export const AVA_ROADS_PRESETS: AvaRoadsPreset[] = [
  {
    id: "safe",
    label: "Safe escape",
    description:
      "Logged Safe escape mix (30-min session × 2 for /hr). T7 fisherman cap (+12.5% on non-Sturgeon) is already in the counts. Bank every 30-40 min. Premium yield scales fish only.",
    tierId: "safe",
    fishPerHour: AVA_SAFE_LOGGED_FISH_PER_HOUR,
    sturgeonShare: AVA_T7_STURGEON_SHARE,
    deathsPerHour: 0.06,
    portalSearchDowntime: 0.22,
    bankingIntervalMinutes: AVA_BANKING_INTERVAL_MINUTES,
    snapperExpectedPerHour: 0.12,
    snapperLuckyCount: 0,
    geared: false,
    consumables: { baitPerHour: 10, porkPiePerHour: 2, invisPerHour: 0 },
  },
  {
    id: "normal",
    label: "Normal",
    description:
      "Same logged mix as Safe escape plus T7 garb (+30%) and workboots (+12.5%) on non-Sturgeon fish. Bank every 30-40 min on all presets. Premium scales fish only.",
    tierId: "grandmaster",
    fishPerHour: AVA_NORMAL_LOGGED_FISH_PER_HOUR,
    sturgeonShare: AVA_T7_STURGEON_SHARE,
    deathsPerHour: 0.1,
    portalSearchDowntime: 0.15,
    bankingIntervalMinutes: AVA_BANKING_INTERVAL_MINUTES,
    snapperExpectedPerHour: 0.35,
    snapperLuckyCount: 1,
    fishingRodId: "T7_2H_TOOL_FISHINGROD",
    geared: true,
    consumables: { baitPerHour: 10, porkPiePerHour: 2, invisPerHour: 0.6 },
  },
  {
    id: "greedy",
    label: "Greedy max profit",
    description:
      "Full T8 fisherman set plus max fishing 100 and fishing spec 100 (+26.75% fish vs logged run at fishing 78 / spec 33). Bank every 30-40 min. Journal fill stays at logged 0.84. Premium scales fish only.",
    tierId: "expert",
    fishPerHour: AVA_GREEDY_LOGGED_FISH_PER_HOUR,
    sturgeonShare: AVA_T8_STURGEON_SHARE,
    deathsPerHour: 0.16,
    portalSearchDowntime: 0.1,
    bankingIntervalMinutes: AVA_BANKING_INTERVAL_MINUTES,
    snapperExpectedPerHour: 1.2,
    snapperLuckyCount: 2,
    fishingRodId: "T8_2H_TOOL_FISHINGROD",
    geared: true,
    consumables: { baitPerHour: 10, porkPiePerHour: 2, invisPerHour: 1 },
  },
];

export function getAvaRoadsPreset(id: AvaRoadsPresetId): AvaRoadsPreset {
  return AVA_ROADS_PRESETS.find((p) => p.id === id) ?? AVA_ROADS_PRESETS[1];
}

export const AVA_ROADS_SNAPPER_META: Record<
  AvaRoadsSnapperViewId,
  { label: string; note: string }
> = {
  expected: {
    label: "Expected Snapper",
    note: "Zone-tier RNG average on normal schools. Each catch yields 4 Snapper. Dry hours with zero catches are common.",
  },
  lucky: {
    label: "Lucky Snapper hour",
    note: "Extra Snapper catches on top of expected fish income. Each catch yields 4 fish. Not a stable hourly rate.",
  },
};
