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
      "Cheap escape kit, bank often, accept lower fish/hr. Lower gear replacement cost if caught.",
    tierId: "safe",
    fishPerHour: 345,
    sturgeonShare: AVA_T7_STURGEON_SHARE,
    deathsPerHour: 0.06,
    portalSearchDowntime: 0.22,
    bankingIntervalMinutes: 12,
    snapperExpectedPerHour: 0.12,
    snapperLuckyCount: 0,
    geared: false,
    consumables: { baitPerHour: 10, porkPiePerHour: 2, invisPerHour: 0 },
  },
  {
    id: "normal",
    label: "Normal",
    description:
      "Grandmaster fisherman set + GM rod on a decent T8 road. Balanced banking, moderate death and portal time.",
    tierId: "grandmaster",
    fishPerHour: 400,
    sturgeonShare: AVA_T7_STURGEON_SHARE,
    deathsPerHour: 0.1,
    portalSearchDowntime: 0.15,
    bankingIntervalMinutes: 22,
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
      "Full T8 fisherman set + Elder's rod on deep roads. Fish until bag is heavy before banking.",
    tierId: "expert",
    fishPerHour: 550,
    sturgeonShare: AVA_T8_STURGEON_SHARE,
    deathsPerHour: 0.16,
    portalSearchDowntime: 0.1,
    bankingIntervalMinutes: 35,
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
