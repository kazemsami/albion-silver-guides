import type { Guide, GuideReliability } from "@/types/guide";

type GuideReliabilityEntry = GuideReliability;

export const guideReliabilityBySlug: Record<string, GuideReliabilityEntry> = {
  "laborer-passive-income": {
    status: "reviewed",
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
    status: "reviewed",
    lastUpdated: "2026-06-13",
    evidence: {
      runs: 2,
      date: "2026-06-13",
      gear: "Level 78 fishing, max gear, yellow Mists setup, no Premium",
      rawLootSilver: 300_000,
      netSilver: 300_000,
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
        "2 personal runs logged. Latest run (no Premium): ~240k fish + ~60k from half Grandmaster journal filled = ~300k in ~30 min at fishing 78. Earlier run ~450k with Premium. GremmyAngler video is a reference only. Yellow-zone Mists knockdown rules checked against the wiki.",
    },
  },
  "ava-roads-fishing": {
    status: "reviewed",
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
        {
          title: "Albion Online: Roads of Avalon guide",
          url: "https://albiononline.com/en/news/roads-of-avalon-guide",
        },
      ],
      notes:
        "1 personal run: ~600k in ~30 min on Safe escape. Full-loot Roads mechanics supported by official Roads guide. Income varies with portal search time, competition, deaths, and market.",
    },
  },
  "high-tier-group-tracking": {
    status: "reviewed",
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
        "Single YouTube reference session: 22 kills, 3.6 hr, 4 players (~4.95M per player group loot). Server and market prices from the video are unknown; calculator uses estimated snapshot prices and session loot averages from screenshots.",
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
    status: "reviewed",
    lastUpdated: "2026-06-13",
    evidence: {
      runs: 1,
      date: "2026-06-13",
      gear: "T5 harvester set + Expert sickle, Lazygrass Plain (Bridgewatch), no Premium, no Pork Pie",
      market: "Bridgewatch",
      rawLootSilver: 140_000,
      netSilver: 125_000,
      deathsOrKnockdowns: 0,
      notes:
        "1 logged run (~30 min). Guide, calculator, and evidence all match this route: Lazygrass Plain near Bridgewatch (steppe, fiber secondary). ~225 T3 flax, ~250 T4 hemp, ~141 T5 skyflower, one Expert journal filled. ~140k gross before tax (~280k/hr gross); ~125k net after Standard listing tax (~250k/hr). Pork Pie and Premium were not used; those upside figures in tips are projected only.",
    },
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
    status: "reviewed",
    lastUpdated: "2026-06-13",
    evidence: {
      runs: 1,
      date: "2026-06-13",
      gear:
        "T6+ alchemy at a royal city alchemist station in Bridgewatch; focus costs read from the craft UI per batch of 5 pots",
      market:
        "Average buy/sell prices logged in Bridgewatch and saved as calculator defaults (see guide tips for the full table)",
      notes:
        "Recipes and material counts checked against game data. Focus per batch read from craft UI. Saved Bridgewatch prices used for income modeling. Focus per batch (5 pots): T6 Major Healing .1 = 3,461, .2 = 4,895 (+ 2,500 silver lab fee each), Major Energy .1 = 4,188, .2 = 5,923, Poison 1,635; T7 Major Gigantify .1 = 5,278, .2 = 7,009, Major Resistance .1 = 6,368, .2 = 8,103, Major Sticky 5,503.",
    },
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
