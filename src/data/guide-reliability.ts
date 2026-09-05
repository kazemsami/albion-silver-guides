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
    lastUpdated: "2026-06-14",
    evidence: {
      runs: 3,
      date: "2026-06-14",
      gear:
        "T7 fisherman set, T7 Avalonian fishing rod in bag, Pork Pie, Grandmaster journal, no Premium",
      market: "Martlock (chopped fish ~330 silver avg sell)",
      rawLootSilver: 386_430,
      netSilver: 386_430,
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
        "Latest logged 30-min yellow Mists run: 999 + 172 chopped fish (1,171 total), Grandmaster journal 5,580/6,640 fill, no Premium. Chopped fish gross ~386k in 30 min at ~330/chop avg; calculator extrapolates to 1 hr and uses saved Martlock prices. Earlier runs at fishing 78 (~300k/30 min) and ~450k with Premium. Snapper not included in baseline.",
    },
  },
  "ava-roads-fishing": {
    status: "reviewed",
    lastUpdated: "2026-06-14",
    evidence: {
      runs: 2,
      date: "2026-06-14",
      gear:
        "Safe escape set (Bloodletter, Assassin Jacket, Miner Workboots, T3 horse; Grandmaster rod and journal in bag)",
      market: "Caerleon (est. market value from bag screenshot)",
      rawLootSilver: 543_000,
      netSilver: 462_000,
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
        "2 personal runs logged (30 min each, Safe escape build). Latest run (2026-06-14, no Premium): 447k est. market value in bag (8 River Sturgeon, 2 Puremist Snapper, 25 T7 catfish, 18 T6 Brightscale Zander, 18 T3 Whitefog Snapper, 2 T5 Clearhaze Snapper, 56 seaweed) plus 0.84 of a full Grandmaster Fisherman's Journal (5600/6640 fame, ~96k net progress at saved prices: 0.84 × (150k full − 36k empty sell)) = ~543k session gross in 30 min. 24k spent on 2 Brecilien portal returns while scouting for a better T8 fishing road; 0 deaths. ~462k net in 30 min after Standard sell-order market fees (2.5% setup fee + 8% transaction tax) and portal fees; ~924k/hr at ×2. Calculator Safe escape and Normal presets use the same fixed 0.84 journal fill (×2 to /hr); fish scale with Premium and gear, journal does not. Earlier run (2026-06-13, with Premium): ~600k raw fish in 30 min at similar journal fill, ~561k net after Premium tax (~1.1M/hr at ×2). Portal scouting and road quality swing effective fish/hr heavily. Calculator models portal downtime on Normal but not per-return silver fees.",
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
    status: "reviewed",
    lastUpdated: "2026-06-14",
    evidence: {
      runs: 1,
      date: "2026-06-14",
      gear:
        "T5 miner set + Expert pickaxe, Pork Pie, Expert's Miner Backpack, Adept's Bag, Eldon Hill (Martlock yellow highland), no Premium",
      market: "Martlock",
      rawLootSilver: 124_000,
      netSilver: 105_000,
      deathsOrKnockdowns: 0,
      notes:
        "1 logged run (~30 min), intermediate tier, no Premium, mined every ore on path (not iron-only). 190 iron, 405 tin, 68 titanium, 28 uncommon iron, 17 uncommon titanium. Hourly calculator uses ×1.9 yield extrapolation (not ×2). Saved Martlock ore averages: iron 170, tin 105, titanium 490, uncommon iron 180, uncommon titanium 650. ~124k gross before tax in 30 min; ~105k net after Standard sell-order market fees (2.5% setup fee + 8% transaction tax) and 1 Pork Pie at session sell prices. Prospector journal was not confirmed on this run. Calculator mid tier uses logged yields ×1.9/hr at saved Martlock prices; high tier is projected iron-focused (+15% output, not logged). Premium figures in tips are projected only.",
    },
  },
  "fiber-farming-solo": {
    status: "reviewed",
    lastUpdated: "2026-06-13",
    evidence: {
      runs: 1,
      date: "2026-06-13",
      gear: "T5 harvester set + Expert sickle + Pork Pie, Lazygrass Plain (Bridgewatch), no Premium",
      market: "Bridgewatch",
      rawLootSilver: 140_000,
      netSilver: 125_000,
      deathsOrKnockdowns: 0,
      notes:
        "1 logged run (~30 min). Lazygrass Plain near Bridgewatch (steppe, fiber secondary). T5 harvester gear with 1 Pork Pie. ~225 T3 flax, ~250 T4 hemp, ~141 T5 skyflower, one Expert journal filled. Yields include Pork Pie gather bonus. Session take-home: 125k net in 30 min (~140k gross before tax at session sell prices). Saved Bridgewatch prices in the calculator model the default logged tier at Standard sell-order fees with 1 Pork Pie and no Premium. Premium upside figures in tips are projected only.",
    },
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
        "Recipes and material counts checked against game data. Focus per batch read from craft UI at tested alchemy/potions spec (costs vary with spec and focus efficiency). Saved Bridgewatch prices used for income modeling. Example focus per batch of 5 pots at tested spec: T6 Major Healing .1 = 3,461, .2 = 4,895 (+ 2,500 silver lab fee each), Major Energy .1 = 4,188, .2 = 5,923, Poison 1,635; T7 Major Gigantify .1 = 5,278, .2 = 7,009, Major Resistance .1 = 6,368, .2 = 8,103, Major Sticky 5,503.",
    },
  },
  "resource-refining-focus": {
    status: "needs-review",
    lastUpdated: "2026-08-21",
    evidence: {
      runs: 0,
      date: "2026-08-21",
      gear:
        "Model assumes mid Destiny Board refining efficiency (~10,000 focus-cost efficiency) at a royal city station with the matching local production bonus",
      market:
        "Saved city averages for raw and refined resources; default calculator city is Thetford for metal bars",
      notes:
        "Recipes and base focus costs follow the official refining guide and Crafting Focus wiki table. Resource return rates use common royal-city tables (53.9% / 36.7% with bonus; 43.5% / 15.2% without). Not logged against a live refining session; recheck station fee and your real focus cost in-game before large batches.",
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
