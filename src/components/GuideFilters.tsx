"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { GuideCategory, Difficulty, ZoneType } from "@/types/guide";
import { categoryLabels, difficultyLabels, zoneTypeLabels } from "@/types/guide";
import {
  getActiveCategoryFilter,
  getActiveDifficultyFilter,
  getActiveSortFilter,
  getActiveZoneFilter,
  type GuideSort,
} from "@/lib/guide-display";

const categories: (GuideCategory | "all")[] = [
  "all",
  "gathering",
  "crafting",
  "dungeons",
  "fishing",
  "laborers",
];

const difficulties: (Difficulty | "all")[] = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
];

const zoneTypes: (ZoneType | "all")[] = ["all", "safe", "dangerous"];

const sortOptions: { value: GuideSort; label: string }[] = [
  { value: "profit-desc", label: "Highest profit" },
  { value: "profit-asc", label: "Lowest profit" },
  { value: "default", label: "Default order" },
];

export function GuideFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = getActiveCategoryFilter(
    searchParams.get("category"),
  );
  const activeDifficulty = getActiveDifficultyFilter(
    searchParams.get("difficulty"),
  );
  const activeZone = getActiveZoneFilter(searchParams.get("zone"));
  const activeSort = getActiveSortFilter(searchParams.get("sort"));
  const hasActiveFilters =
    activeCategory !== "all" ||
    activeDifficulty !== "all" ||
    activeZone !== "all" ||
    activeSort !== "profit-desc";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || (key === "sort" && value === "profit-desc")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `/guides?${query}` : "/guides");
  }

  return (
    <div className="space-y-4">
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-parchment/45">Filters active</p>
          <Link
            href="/guides"
            className="text-xs font-medium text-gold transition-colors hover:text-gold/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Clear all
          </Link>
        </div>
      )}

      <div>
        <p
          id="filter-sort-label"
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-parchment/40"
        >
          Sort by
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="filter-sort-label"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={activeSort === option.value}
              onClick={() => updateFilter("sort", option.value)}
              className={`filter-chip px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                activeSort === option.value ? "filter-chip-active" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p
          id="filter-category-label"
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-parchment/40"
        >
          Category
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="filter-category-label"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={activeCategory === cat}
              onClick={() => updateFilter("category", cat)}
              className={`filter-chip px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                activeCategory === cat ? "filter-chip-active" : ""
              }`}
            >
              {cat === "all" ? "All" : categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p
          id="filter-difficulty-label"
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-parchment/40"
        >
          Difficulty
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="filter-difficulty-label"
        >
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              aria-pressed={activeDifficulty === diff}
              onClick={() => updateFilter("difficulty", diff)}
              className={`filter-chip px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                activeDifficulty === diff ? "filter-chip-active" : ""
              }`}
            >
              {diff === "all" ? "All Levels" : difficultyLabels[diff]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p
          id="filter-zone-label"
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-parchment/40"
        >
          Zone Risk
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="filter-zone-label"
        >
          {zoneTypes.map((zone) => (
            <button
              key={zone}
              type="button"
              aria-pressed={activeZone === zone}
              onClick={() => updateFilter("zone", zone)}
              className={`filter-chip px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                activeZone === zone ? "filter-chip-active" : ""
              }`}
            >
              {zone === "all" ? "All Zones" : zoneTypeLabels[zone]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
