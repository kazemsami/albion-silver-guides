import type { GuideCategory } from "@/types/guide";
import { parseGuideFilters } from "@/lib/guide-display";

export type GuidesSeoEntry = {
  title: string;
  description: string;
  /** Path including query string for canonical / Open Graph URLs. */
  path: string;
};

export const guidesListSeo: GuidesSeoEntry = {
  title: "Albion Online Money Making Guides",
  description:
    "Browse Albion Online silver guides for gathering, crafting, dungeons, fishing, and laborers. Compare saved-price profit ranges, gear, and risk on each route.",
  path: "/guides",
};

export const guidesCategorySeo: Record<GuideCategory, GuidesSeoEntry> = {
  gathering: {
    title: "Albion Online Gathering Silver Guides",
    description:
      "Compare Albion Online gathering routes with silver/hour estimates, gear suggestions, risk level, and updated market assumptions.",
    path: "/guides?category=gathering",
  },
  crafting: {
    title: "Albion Online Crafting Profit Guides",
    description:
      "Compare Albion Online crafting and refining profit guides with silver/hour or focus-based estimates, material costs, and saved market prices.",
    path: "/guides?category=crafting",
  },
  dungeons: {
    title: "Albion Online Dungeon & PvE Silver Guides",
    description:
      "Compare Albion Online dungeon and PvE money-making methods with realistic silver/hour estimates, risk notes, gear assumptions, and updated calculator data.",
    path: "/guides?category=dungeons",
  },
  fishing: {
    title: "Albion Online Fishing Silver Guides",
    description:
      "Find Albion Online fishing money-making guides with silver/hour estimates, zone risk, gear assumptions, and market-based profit ranges.",
    path: "/guides?category=fishing",
  },
  laborers: {
    title: "Albion Online Laborer Passive Income Guides",
    description:
      "Compare Albion Online laborer and island passive income guides with journal economics, house setup costs, and saved-price profit ranges.",
    path: "/guides?category=laborers",
  },
};

/** Category-only landing pages (no extra filters) get their own indexable SEO entry. */
export function isGuidesCategoryLandingPage(params: {
  category?: string;
  difficulty?: string;
  zone?: string;
  sort?: string;
}): boolean {
  const { category, difficulty, zone, sort } = parseGuideFilters(params);
  return Boolean(category && !difficulty && !zone && sort === "profit-desc");
}

/** Multi-filter or non-category filter views should not compete in search indexes. */
export function shouldNoIndexGuidesList(params: {
  category?: string;
  difficulty?: string;
  zone?: string;
  sort?: string;
}): boolean {
  if (isGuidesCategoryLandingPage(params)) return false;
  const { category, difficulty, zone, sort } = parseGuideFilters(params);
  return Boolean(
    category || difficulty || zone || sort !== "profit-desc",
  );
}

export function resolveGuidesListSeo(params: {
  category?: string;
  difficulty?: string;
  zone?: string;
  sort?: string;
}): GuidesSeoEntry {
  const { category } = parseGuideFilters(params);
  if (isGuidesCategoryLandingPage(params) && category) {
    return guidesCategorySeo[category];
  }
  return guidesListSeo;
}
