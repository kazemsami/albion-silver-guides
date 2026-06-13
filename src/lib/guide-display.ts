import type { Guide } from "@/types/guide";
import type { GuideProfitRange } from "@/lib/guide-economics";
import { formatSilverRange } from "@/lib/format";

export function getGuideSilverDisplay(
  guide: Guide,
  profitRange?: GuideProfitRange | null,
): string {
  if (profitRange) {
    return formatSilverRange(profitRange.min, profitRange.max);
  }
  return formatSilverRange(guide.silverPerHour.min, guide.silverPerHour.max);
}

export function getCardPriceSourceLabel(useLivePrices: boolean): string {
  return useLivePrices ? "live prices" : "saved prices";
}

export function hasLiveProfitRange(
  profitRange?: GuideProfitRange | null,
): profitRange is GuideProfitRange {
  return profitRange != null;
}

export function formatGuideLastUpdated(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

const VALID_CATEGORIES = new Set<Guide["category"]>([
  "gathering",
  "crafting",
  "dungeons",
  "fishing",
  "laborers",
]);

const VALID_DIFFICULTIES = new Set<Guide["difficulty"]>([
  "beginner",
  "intermediate",
  "advanced",
]);

const VALID_ZONE_TYPES = new Set<Guide["zoneType"]>(["safe", "dangerous"]);

export type GuideSort = "profit-desc" | "profit-asc" | "default";

const VALID_SORTS = new Set<GuideSort>(["profit-desc", "profit-asc", "default"]);

export function parseGuideSort(param?: string): GuideSort {
  if (param && VALID_SORTS.has(param as GuideSort)) {
    return param as GuideSort;
  }
  return "profit-desc";
}

export function getActiveSortFilter(param: string | null): GuideSort {
  return parseGuideSort(param ?? undefined);
}

export function getGuideProfitSortValue(
  guide: Guide,
  profitRanges: Record<string, GuideProfitRange>,
  sort: GuideSort,
): number {
  const range = profitRanges[guide.slug];
  if (sort === "profit-asc") {
    return range?.min ?? guide.silverPerHour.min;
  }
  if (sort === "profit-desc") {
    return range?.max ?? guide.silverPerHour.max;
  }
  return 0;
}

export function sortGuidesByProfit(
  list: Guide[],
  profitRanges: Record<string, GuideProfitRange>,
  sort: GuideSort,
): Guide[] {
  if (sort === "default") return list;

  return [...list].sort((a, b) => {
    const aVal = getGuideProfitSortValue(a, profitRanges, sort);
    const bVal = getGuideProfitSortValue(b, profitRanges, sort);
    return sort === "profit-asc" ? aVal - bVal : bVal - aVal;
  });
}

export function parseGuideFilters(params: {
  category?: string;
  difficulty?: string;
  zone?: string;
  sort?: string;
}): {
  category?: Guide["category"];
  difficulty?: Guide["difficulty"];
  zone?: Guide["zoneType"];
  sort: GuideSort;
} {
  const category =
    params.category && VALID_CATEGORIES.has(params.category as Guide["category"])
      ? (params.category as Guide["category"])
      : undefined;
  const difficulty =
    params.difficulty &&
    VALID_DIFFICULTIES.has(params.difficulty as Guide["difficulty"])
      ? (params.difficulty as Guide["difficulty"])
      : undefined;
  const zone =
    params.zone && VALID_ZONE_TYPES.has(params.zone as Guide["zoneType"])
      ? (params.zone as Guide["zoneType"])
      : undefined;
  const sort = parseGuideSort(params.sort);
  return { category, difficulty, zone, sort };
}

export function getActiveCategoryFilter(
  param: string | null,
): Guide["category"] | "all" {
  if (param && VALID_CATEGORIES.has(param as Guide["category"])) {
    return param as Guide["category"];
  }
  return "all";
}

export function getActiveDifficultyFilter(
  param: string | null,
): Guide["difficulty"] | "all" {
  if (param && VALID_DIFFICULTIES.has(param as Guide["difficulty"])) {
    return param as Guide["difficulty"];
  }
  return "all";
}

export function getActiveZoneFilter(
  param: string | null,
): Guide["zoneType"] | "all" {
  if (param && VALID_ZONE_TYPES.has(param as Guide["zoneType"])) {
    return param as Guide["zoneType"];
  }
  return "all";
}

export function hasInvalidFilterParams(params: {
  category?: string;
  difficulty?: string;
  zone?: string;
  sort?: string;
}): boolean {
  const { category, difficulty, zone } = parseGuideFilters(params);
  return (
    (!!params.category && !category) ||
    (!!params.difficulty && !difficulty) ||
    (!!params.zone && !zone) ||
    (!!params.sort && !VALID_SORTS.has(params.sort as GuideSort))
  );
}

export function buildGuidesFilterUrl(filters: {
  category?: Guide["category"];
  difficulty?: Guide["difficulty"];
  zone?: Guide["zoneType"];
  sort?: GuideSort;
}): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.zone) params.set("zone", filters.zone);
  if (filters.sort && filters.sort !== "profit-desc") {
    params.set("sort", filters.sort);
  }
  const query = params.toString();
  return query ? `/guides?${query}` : "/guides";
}
