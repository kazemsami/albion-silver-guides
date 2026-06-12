import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GuidesGrid } from "@/components/GuidesGrid";
import { GuideFilters } from "@/components/GuideFilters";
import { guides } from "@/data/guides";
import { fetchAllGuidesProfitRangesByCity } from "@/lib/guide-economics";
import {
  buildGuidesFilterUrl,
  hasInvalidFilterParams,
  parseGuideFilters,
} from "@/lib/guide-display";
import { categoryLabels, difficultyLabels, zoneTypeLabels } from "@/types/guide";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/site";
import { guideListJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

interface GuidesPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    zone?: string;
    sort?: string;
  }>;
}

function hasActiveListFilters(params: {
  category?: string;
  difficulty?: string;
  zone?: string;
  sort?: string;
}): boolean {
  return Boolean(
    params.category ||
      params.difficulty ||
      params.zone ||
      (params.sort && params.sort !== "profit-desc"),
  );
}

export async function generateMetadata({
  searchParams,
}: GuidesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const filtered = hasActiveListFilters(params);

  return createPageMetadata({
    title: "All Albion Online Money Making Guides",
    description:
      "Browse Albion Online silver guides for gathering, fishing, dungeons, crafting, and laborers. Sort by live market profit per hour.",
    path: "/guides",
    noIndex: filtered,
  });
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;

  if (hasInvalidFilterParams(params)) {
    redirect(buildGuidesFilterUrl(parseGuideFilters(params)));
  }

  const { category, difficulty, zone, sort } = parseGuideFilters(params);
  const hasFilters = hasActiveListFilters(params);
  const profitRangesByCity = await fetchAllGuidesProfitRangesByCity();

  const filtered = guides.filter((g) => {
    if (category && g.category !== category) return false;
    if (difficulty && g.difficulty !== difficulty) return false;
    if (zone && g.zoneType !== zone) return false;
    return true;
  });

  const filterDescription =
    category || difficulty || zone
      ? [
          category ? categoryLabels[category] : null,
          difficulty ? difficultyLabels[difficulty] : null,
          zone ? zoneTypeLabels[zone] : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {!hasFilters && <JsonLd data={guideListJsonLd(guides)} />}
      <div className="mb-10">
        <h1 className="wiki-heading font-display text-3xl font-bold text-parchment sm:text-4xl">
          Money Making Guides
        </h1>
        <p className="mt-3 max-w-2xl text-parchment/55">
          {filtered.length} guide{filtered.length !== 1 ? "s" : ""} found
          {filterDescription ? ` for ${filterDescription}` : ""}. Pick a
          strategy, follow the steps, and start stacking silver.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense
            fallback={
              <div className="text-sm text-parchment/40">Loading filters…</div>
            }
          >
            <GuideFilters />
          </Suspense>
        </aside>

        <div>
          {filtered.length > 0 ? (
            <GuidesGrid
              guides={filtered}
              profitRangesByCity={profitRangesByCity}
              sort={sort}
            />
          ) : (
            <div className="theme-surface rounded-xl border border-gold/15 bg-obsidian-light p-12 text-center">
              <p className="text-lg text-parchment/60">
                No guides match your filters.
              </p>
              <p className="mt-2 text-sm text-parchment/40">
                Try removing a filter to see more results.
              </p>
              <Link
                href="/guides"
                className="mt-6 inline-flex rounded-lg border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
