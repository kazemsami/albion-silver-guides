import type { Guide, GuideReliability } from "@/types/guide";

type GuideReliabilityEntry = GuideReliability;

export const guideReliabilityBySlug: Record<string, GuideReliabilityEntry> = {
  "laborer-passive-income": {
    status: "community-checked",
    lastUpdated: "2026-06-13",
    evidence: {
      date: "External references",
      gear: "T8 laborers, T7 journals, 150% yield (T8 bed + table)",
      sources: [
        {
          title: "Albion Online Grind: Laborers Profit Calculator",
          url: "https://albiononlinegrind.com/laborers-profit-calculator",
        },
        {
          title: "Albion Online Wiki: Laborer",
          url: "https://wiki.albiononline.com/wiki/Laborer",
        },
      ],
      notes:
        "Return amounts and crafting material weights from Grind. Mechanics (22h jobs, happiness, journal tiers, 7-day pickup) from the wiki. Calculator uses estimated snapshot prices.",
    },
  },
  "mists-fishing": {
    status: "tested-and-community-checked",
    lastUpdated: "2026-06-13",
    evidence: {
      runs: 1,
      date: "2026-06-13",
      gear: "Level 78 fishing, yellow Mists setup from guide",
      rawLootSilver: 450_000,
      netSilver: 450_000,
      deathsOrKnockdowns: 0,
      sources: [
        {
          title: "GremmyAngler: Beginner's Fishing Guide (Zero to Hero, Part 1)",
          url: "https://www.youtube.com/watch?v=oTcuphnd1io",
        },
        {
          title: "Albion Online Wiki: Mists",
          url: "https://wiki.albiononline.com/wiki/Mists",
        },
      ],
      notes:
        "My run: ~450k in ~30 min at fishing level 78. Community reference (GremmyAngler): ~300k in ~30 min at fishing level 1-10 (~600k/hr).",
    },
  },
  "ava-roads-fishing": {
    status: "tested-and-community-checked",
    lastUpdated: "2026-06-13",
    evidence: {
      runs: 1,
      date: "2026-06-13",
      gear: "Safe escape build (calculator safe preset)",
      rawLootSilver: 600_000,
      netSilver: 600_000,
      deathsOrKnockdowns: 0,
      sources: [
        {
          title: "GremmyAngler: Fishing on the Avalonian Roads (Beginners Guide)",
          url: "https://www.youtube.com/watch?v=sHCPd84O-50",
        },
      ],
      notes:
        "My run: ~600k in ~30 min on Safe escape. Community reference (GremmyAngler): ~1.1M in ~40 min including ~15 min to find a T8 road (~5 min with luck).",
    },
  },
  "high-tier-group-tracking": {
    status: "community-checked",
    lastUpdated: "2026-06-13",
    evidence: {
      runs: 1,
      date: "YouTube session (see source)",
      gear: "4-man veteran comp, T7 tracking toolkit",
      rawLootSilver: 19_800_000,
      deathsOrKnockdowns: 0,
      netSilver: 4_950_000,
      sourceTitle: "Group Tracking In Roads of Avalon | Albion Online",
      sourceUrl: "https://www.youtube.com/watch?v=rYnjYIeOCNU",
      notes:
        "Reference session from a YouTube video: 22 kills, 3.6 hr, 4 players (~4.95M per player group loot). Server and market prices from the video are unknown; calculator uses estimated snapshot prices.",
    },
  },
  "abyssal-depths-farming": {
    status: "needs-review",
    lastUpdated: "2026-06-13",
  },
  "t4-ore-mining-yellow-zone": {
    status: "needs-review",
    lastUpdated: "2026-05-15",
  },
  "fiber-farming-solo": {
    status: "needs-review",
    lastUpdated: "2026-05-15",
  },
  "solo-dungeon-farming": {
    status: "needs-review",
    lastUpdated: "2026-05-15",
  },
  "corrupted-dungeons-pvpve": {
    status: "needs-review",
    lastUpdated: "2026-06-12",
  },
  "potions-crafting-bulk": {
    status: "needs-review",
    lastUpdated: "2026-06-12",
  },
};

export function attachGuideReliability(
  guideList: Omit<Guide, "reliability" | "defaultMarketCity" | "riskProfile">[],
): Guide[] {
  return guideList.map((guide) => {
    const reliability = guideReliabilityBySlug[guide.slug];
    if (!reliability) {
      throw new Error(`Missing reliability data for guide: ${guide.slug}`);
    }
    return { ...guide, reliability };
  });
}
