import type { Guide, GuideReliability } from "@/types/guide";

export const guideReliabilityBySlug: Record<string, GuideReliability> = {
  "laborer-passive-income": {
    status: "tested-by-me",
    lastUpdated: "2026-06-12",
  },
  "mists-fishing": {
    status: "tested-by-me",
    lastUpdated: "2026-06-12",
  },
  "ava-roads-fishing": {
    status: "tested-by-me",
    lastUpdated: "2026-06-12",
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
  "abyssal-depths-farming": {
    status: "community-checked",
    lastUpdated: "2026-06-12",
  },
  "high-tier-group-tracking": {
    status: "needs-review",
    lastUpdated: "2026-06-12",
  },
  "shoreline-fishing-guide": {
    status: "needs-review",
    lastUpdated: "2026-05-15",
  },
  "potions-crafting-bulk": {
    status: "needs-review",
    lastUpdated: "2026-06-12",
  },
  "t2-blackzone-roaming": {
    status: "community-checked",
    lastUpdated: "2026-06-12",
  },
};

export function attachGuideReliability(
  guideList: Omit<Guide, "reliability">[],
): Guide[] {
  return guideList.map((guide) => {
    const reliability = guideReliabilityBySlug[guide.slug];
    if (!reliability) {
      throw new Error(`Missing reliability data for guide: ${guide.slug}`);
    }
    return { ...guide, reliability };
  });
}
