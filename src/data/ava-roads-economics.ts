/** Avalonian Roads fishing profit model for ava-roads-fishing. */

export type AvaRoadsPresetId = "safe" | "normal" | "greedy";
export type AvaRoadsSnapperViewId = "expected" | "lucky";

export const AVA_CHOPS_PER_FISH = 15;

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
  /** Expected Puremist Snapper per hour (RNG average). */
  snapperExpectedPerHour: number;
  /** Lucky hour: bonus snapper count (shown separately). */
  snapperLuckyCount: number;
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
      "T8 fisherman set on a decent T8 road. Balanced banking, moderate death and portal time.",
    tierId: "profit",
    fishPerHour: 450,
    sturgeonShare: AVA_T8_STURGEON_SHARE,
    deathsPerHour: 0.1,
    portalSearchDowntime: 0.15,
    bankingIntervalMinutes: 22,
    snapperExpectedPerHour: 0.5,
    snapperLuckyCount: 1,
    geared: true,
    consumables: { baitPerHour: 10, porkPiePerHour: 2, invisPerHour: 0.6 },
  },
  {
    id: "greedy",
    label: "Greedy max profit",
    description:
      "Deep T8 road, fish until bag is heavy before banking. Highest upside and highest death swing.",
    tierId: "expert",
    fishPerHour: 550,
    sturgeonShare: AVA_T8_STURGEON_SHARE,
    deathsPerHour: 0.16,
    portalSearchDowntime: 0.1,
    bankingIntervalMinutes: 35,
    snapperExpectedPerHour: 1.2,
    snapperLuckyCount: 2,
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
    note: "Zone-tier RNG average on normal schools. Dry hours with zero Snapper are common.",
  },
  lucky: {
    label: "Lucky Snapper hour",
    note: "Extra Snapper on top of expected fish income. Not a stable hourly rate.",
  },
};
