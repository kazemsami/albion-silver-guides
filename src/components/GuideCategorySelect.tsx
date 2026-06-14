"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { GuideCategory } from "@/types/guide";
import { categoryLabels } from "@/types/guide";
import { getActiveCategoryFilter } from "@/lib/guide-display";

const categories: (GuideCategory | "all")[] = [
  "all",
  "gathering",
  "crafting",
  "dungeons",
  "fishing",
  "laborers",
];

export function GuideCategorySelect({
  className = "",
  compact = false,
  id = "guide-category-select",
}: {
  className?: string;
  compact?: boolean;
  id?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = getActiveCategoryFilter(
    searchParams.get("category"),
  );

  function onChange(value: string) {
    const params = new URLSearchParams(
      pathname === "/guides" ? searchParams.toString() : "",
    );
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const query = params.toString();
    router.push(query ? `/guides?${query}` : "/guides");
  }

  return (
    <label
      className={`flex flex-col gap-2 ${className}`}
      htmlFor={id}
    >
      {!compact && (
        <span className="text-xs font-semibold uppercase tracking-widest text-parchment/40">
          Category
        </span>
      )}
      <span className="ui-select-wrap block">
        <select
          id={id}
          value={activeCategory}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Guide category"
          className={`ui-control ui-select w-full ${
            compact ? "min-w-[10.5rem]" : ""
          }`}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All categories" : categoryLabels[cat]}
            </option>
          ))}
        </select>
        <svg
          className="ui-select-chevron"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}
