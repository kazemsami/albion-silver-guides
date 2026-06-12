import type { EquipmentLoadout, HourlyItem, SkillTier } from "@/types/guide";

/** T8 house + T7 journal at 150% happiness, ~58 unrefined resources per job. */
const GATHERING_RETURN = 58;
/** T8 house + T7 crafting journal at 150%, ~14 refined materials per job. */
const CRAFTING_RETURN = 14;
/** T8 house + T7 mercenary journal at 150%, fixed silver loot per job. */
const MERCENARY_SILVER = 6303;

const BASE_LABORERS = 10;
const HOURS_PER_JOB = 22;

export interface LaborerSpecialty {
  id: string;
  label: string;
  laborerName: string;
  fillActivity: string;
  journalEmptyId: string;
  journalFullId: string;
  journalEmptyName: string;
  journalFullName: string;
  outputId: string;
  outputName: string;
  /** Resources returned per completed journal at 150% yield. */
  returnPerJournal: number;
  /** When set, output is fixed silver per journal instead of a market item. */
  silverPerJournal?: number;
  trophyId?: string;
  trophyName?: string;
}

export const LABORER_SPECIALTIES: LaborerSpecialty[] = [
  {
    id: "prospector",
    label: "Prospector",
    laborerName: "prospector",
    fillActivity: "mining T7/T8 ore",
    journalEmptyId: "T7_JOURNAL_ORE_EMPTY",
    journalFullId: "T7_JOURNAL_ORE_FULL",
    journalEmptyName: "Grandmaster Prospector's Journal (Empty)",
    journalFullName: "Grandmaster Prospector's Journal (Full)",
    outputId: "T7_ORE",
    outputName: "Meteorite Ore",
    returnPerJournal: GATHERING_RETURN,
    trophyId: "T8_FURNITUREITEM_TROPHY_ORE",
    trophyName: "Adamantium Ore Sample",
  },
  {
    id: "lumberjack",
    label: "Lumberjack",
    laborerName: "lumberjack",
    fillActivity: "chopping T7/T8 wood",
    journalEmptyId: "T7_JOURNAL_WOOD_EMPTY",
    journalFullId: "T7_JOURNAL_WOOD_FULL",
    journalEmptyName: "Grandmaster Lumberjack's Journal (Empty)",
    journalFullName: "Grandmaster Lumberjack's Journal (Full)",
    outputId: "T7_WOOD",
    outputName: "Cedar Logs",
    returnPerJournal: GATHERING_RETURN,
    trophyId: "T8_FURNITUREITEM_TROPHY_WOOD",
    trophyName: "Cedar Logs Trophy",
  },
  {
    id: "cropper",
    label: "Cropper",
    laborerName: "cropper",
    fillActivity: "harvesting T7/T8 fiber",
    journalEmptyId: "T7_JOURNAL_FIBER_EMPTY",
    journalFullId: "T7_JOURNAL_FIBER_FULL",
    journalEmptyName: "Grandmaster Cropper's Journal (Empty)",
    journalFullName: "Grandmaster Cropper's Journal (Full)",
    outputId: "T7_FIBER",
    outputName: "Sunflax",
    returnPerJournal: GATHERING_RETURN,
    trophyId: "T8_FURNITUREITEM_TROPHY_FIBER",
    trophyName: "Sunflax Trophy",
  },
  {
    id: "gamekeeper",
    label: "Gamekeeper",
    laborerName: "gamekeeper",
    fillActivity: "skinning T7/T8 hide",
    journalEmptyId: "T7_JOURNAL_HIDE_EMPTY",
    journalFullId: "T7_JOURNAL_HIDE_FULL",
    journalEmptyName: "Grandmaster Gamekeeper's Journal (Empty)",
    journalFullName: "Grandmaster Gamekeeper's Journal (Full)",
    outputId: "T7_HIDE",
    outputName: "Redleaf Cotton",
    returnPerJournal: GATHERING_RETURN,
    trophyId: "T8_FURNITUREITEM_TROPHY_HIDE",
    trophyName: "Redleaf Cotton Trophy",
  },
  {
    id: "stonecutter",
    label: "Stonecutter",
    laborerName: "stonecutter",
    fillActivity: "quarrying T7/T8 stone",
    journalEmptyId: "T7_JOURNAL_STONE_EMPTY",
    journalFullId: "T7_JOURNAL_STONE_FULL",
    journalEmptyName: "Grandmaster Stonecutter's Journal (Empty)",
    journalFullName: "Grandmaster Stonecutter's Journal (Full)",
    outputId: "T7_ROCK",
    outputName: "Gneiss",
    returnPerJournal: GATHERING_RETURN,
    trophyId: "T8_FURNITUREITEM_TROPHY_ROCK",
    trophyName: "Gneiss Trophy",
  },
  {
    id: "fisherman",
    label: "Fisherman",
    laborerName: "fisherman",
    fillActivity: "fishing T7/T8 waters",
    journalEmptyId: "T7_JOURNAL_FISHING_EMPTY",
    journalFullId: "T7_JOURNAL_FISHING_FULL",
    journalEmptyName: "Grandmaster Fisherman's Journal (Empty)",
    journalFullName: "Grandmaster Fisherman's Journal (Full)",
    outputId: "T7_FISH_FRESHWATER_ALL_COMMON",
    outputName: "Common Freshwater Fish",
    returnPerJournal: GATHERING_RETURN,
    trophyId: "T8_FURNITUREITEM_TROPHY_FISH",
    trophyName: "Common Fish Trophy",
  },
  {
    id: "mercenary",
    label: "Mercenary",
    laborerName: "mercenary",
    fillActivity: "earning combat fame",
    journalEmptyId: "T7_JOURNAL_MERCENARY_EMPTY",
    journalFullId: "T7_JOURNAL_MERCENARY_FULL",
    journalEmptyName: "Grandmaster Mercenary's Journal (Empty)",
    journalFullName: "Grandmaster Mercenary's Journal (Full)",
    outputId: "T7_JOURNAL_MERCENARY_EMPTY",
    outputName: "Silver (mercenary loot)",
    returnPerJournal: 1,
    silverPerJournal: MERCENARY_SILVER,
    trophyId: "T8_FURNITUREITEM_TROPHY_MERCENARY",
    trophyName: "Mercenary Trophy",
  },
  {
    id: "blacksmith",
    label: "Blacksmith",
    laborerName: "blacksmith",
    fillActivity: "crafting with warrior fame",
    journalEmptyId: "T7_JOURNAL_WARRIOR_EMPTY",
    journalFullId: "T7_JOURNAL_WARRIOR_FULL",
    journalEmptyName: "Grandmaster Blacksmith's Journal (Empty)",
    journalFullName: "Grandmaster Blacksmith's Journal (Full)",
    outputId: "T7_METALBAR",
    outputName: "Meteorite Steel Bar",
    returnPerJournal: CRAFTING_RETURN,
  },
  {
    id: "fletcher",
    label: "Fletcher",
    laborerName: "fletcher",
    fillActivity: "crafting with hunter fame",
    journalEmptyId: "T7_JOURNAL_HUNTER_EMPTY",
    journalFullId: "T7_JOURNAL_HUNTER_FULL",
    journalEmptyName: "Grandmaster Fletcher's Journal (Empty)",
    journalFullName: "Grandmaster Fletcher's Journal (Full)",
    outputId: "T7_PLANKS",
    outputName: "Cedar Planks",
    returnPerJournal: CRAFTING_RETURN,
  },
  {
    id: "imbuer",
    label: "Imbuer",
    laborerName: "imbuer",
    fillActivity: "crafting with mage fame",
    journalEmptyId: "T7_JOURNAL_MAGE_EMPTY",
    journalFullId: "T7_JOURNAL_MAGE_FULL",
    journalEmptyName: "Grandmaster Imbuer's Journal (Empty)",
    journalFullName: "Grandmaster Imbuer's Journal (Full)",
    outputId: "T7_CLOTH",
    outputName: "Sunflax Cloth",
    returnPerJournal: CRAFTING_RETURN,
  },
  {
    id: "tinker",
    label: "Tinker",
    laborerName: "tinker",
    fillActivity: "crafting with toolmaker fame",
    journalEmptyId: "T7_JOURNAL_TOOLMAKER_EMPTY",
    journalFullId: "T7_JOURNAL_TOOLMAKER_FULL",
    journalEmptyName: "Grandmaster Tinker's Journal (Empty)",
    journalFullName: "Grandmaster Tinker's Journal (Full)",
    outputId: "T7_LEATHER",
    outputName: "Redleaf Leather",
    returnPerJournal: CRAFTING_RETURN,
  },
];

export const DEFAULT_LABORER_SPECIALTY_ID = "prospector";

export function getLaborerSpecialty(id: string): LaborerSpecialty {
  return (
    LABORER_SPECIALTIES.find((s) => s.id === id) ??
    LABORER_SPECIALTIES[0]
  );
}

function scaleLaborerCount(quantity: number, multiplier: number): number {
  const scaled = quantity * multiplier;
  if (scaled < 1) {
    return Math.round(scaled * 100) / 100;
  }
  return Math.max(1, Math.round(scaled));
}

export function laborerCountForTier(tier: SkillTier): number {
  return scaleLaborerCount(BASE_LABORERS, tier.outputMultiplier);
}

function jobsPerHourForTier(tier: SkillTier): number {
  const laborers = scaleLaborerCount(BASE_LABORERS, tier.outputMultiplier);
  return Math.round((laborers / HOURS_PER_JOB) * 100) / 100;
}

export function buildLaborerHourlyEconomics(
  specialty: LaborerSpecialty,
  tier: SkillTier,
): Pick<{ hourlyOutput: HourlyItem[]; hourlyInputs: HourlyItem[] }, "hourlyOutput" | "hourlyInputs"> {
  const jobsPerHour = jobsPerHourForTier(tier);

  const hourlyInputs: HourlyItem[] = [
    {
      id: specialty.journalFullId,
      name: specialty.journalFullName,
      quantity: jobsPerHour,
      side: "buy",
    },
  ];

  const hourlyOutput: HourlyItem[] = [
    {
      id: specialty.journalEmptyId,
      name: specialty.journalEmptyName,
      quantity: jobsPerHour,
    },
  ];

  if (specialty.silverPerJournal != null) {
    hourlyOutput.unshift({
      id: specialty.outputId,
      name: specialty.outputName,
      quantity: jobsPerHour,
      fixedSilverPerUnit: specialty.silverPerJournal,
    });
  } else {
    hourlyOutput.unshift({
      id: specialty.outputId,
      name: specialty.outputName,
      quantity: Math.round(specialty.returnPerJournal * jobsPerHour * 100) / 100,
    });
  }

  return { hourlyOutput, hourlyInputs };
}

export function buildLaborerLoadout(
  specialty: LaborerSpecialty,
  tier: SkillTier,
): EquipmentLoadout {
  const laborers = laborerCountForTier(tier);
  const tables = Math.ceil(laborers / 4);

  const inventory = [
    {
      id: "T8_FURNITUREITEM_BED",
      name: "Elder's Bed",
      quantity: laborers,
      hint: "One T8 bed per laborer (one per house)",
    },
    {
      id: "T8_FURNITUREITEM_TABLE",
      name: "Elder's Table",
      quantity: tables,
      hint: "One T8 table per four laborers",
    },
    {
      id: "T8_FURNITUREITEM_TROPHY_GENERAL",
      name: "Ledger of Truths",
      quantity: laborers,
      hint: "T8 generalist trophy, one per house for 150%",
    },
    ...(specialty.trophyId && specialty.trophyName
      ? [
          {
            id: specialty.trophyId,
            name: specialty.trophyName,
            quantity: laborers,
            hint: `T8 ${specialty.laborerName} trophy, one per house`,
          },
        ]
      : []),
    {
      id: specialty.journalFullId,
      name: specialty.journalFullName,
      quantity: laborers,
      hint: `Hand to ${specialty.laborerName}, one full journal per 22h job`,
    },
  ];

  return {
    title: `All ${specialty.label}, ${tier.label}`,
    description: `Every T8 laborer is a ${specialty.laborerName} on T7 journals at 150% yield. ${laborers} T8 houses on the island.`,
    slots: {},
    inventory,
    houseCount: laborers,
  };
}

export function collectLaborerSpecialtyItemIds(): string[] {
  const ids = new Set<string>([
    "T8_FURNITUREITEM_BED",
    "T8_FURNITUREITEM_TABLE",
    "T8_FURNITUREITEM_TROPHY_GENERAL",
  ]);
  for (const specialty of LABORER_SPECIALTIES) {
    ids.add(specialty.journalEmptyId);
    ids.add(specialty.journalFullId);
    if (!specialty.silverPerJournal) {
      ids.add(specialty.outputId);
    }
    if (specialty.trophyId) ids.add(specialty.trophyId);
  }
  return [...ids];
}
