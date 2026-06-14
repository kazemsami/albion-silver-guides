import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GuidesGrid } from "@/components/GuidesGrid";
import { GuideFilters } from "@/components/GuideFilters";
import { GuideCategorySelect } from "@/components/GuideCategorySelect";
import { guides } from "@/data/guides";
import {
  computeGuideListProfitRanges,
  fetchAllGuidesMarketDataByCity,
} from "@/lib/guide-economics";
import {
  buildGuidesFilterUrl,
  hasInvalidFilterParams,
  parseGuideFilters,
} from "@/lib/guide-display";
import {
  isGuidesCategoryLandingPage,
  resolveGuidesListSeo,
  shouldNoIndexGuidesList,
} from "@/lib/guides-seo";
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
  const seo = resolveGuidesListSeo(params);

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
    noIndex: shouldNoIndexGuidesList(params),
  });
}

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;

  if (hasInvalidFilterParams(params)) {
    redirect(buildGuidesFilterUrl(parseGuideFilters(params)));
  }

  const { category, difficulty, zone, sort } = parseGuideFilters(params);
  const hasFilters = hasActiveListFilters(params);
  const categoryLanding = isGuidesCategoryLandingPage(params);
  const marketData = await fetchAllGuidesMarketDataByCity();

  const filtered = guides.filter((g) => {
    if (category && g.category !== category) return false;
    if (difficulty && g.difficulty !== difficulty) return false;
    if (zone && g.zoneType !== zone) return false;
    return true;
  });

  const serverProfitRanges = computeGuideListProfitRanges(marketData, filtered);

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

  const pageTitle = categoryLanding && category
    ? `${categoryLabels[category]} Silver Guides`
    : "Money Making Guides";

  const pageIntro =
    categoryLanding && category
      ? resolveGuidesListSeo(params).description
      : `${filtered.length} guide${filtered.length !== 1 ? "s" : ""} found${
          filterDescription ? ` for ${filterDescription}` : ""
        }. Pick a strategy, follow the steps, and start stacking silver.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {!hasFilters || categoryLanding ? (
        <JsonLd
          data={guideListJsonLd(
            filtered,
            categoryLanding && category
              ? `${categoryLabels[category]} Silver Guides`
              : undefined,
          )}
        />
      ) : null}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="wiki-heading font-display text-3xl font-bold text-parchment sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-parchment/55">{pageIntro}</p>
        </div>
        <Suspense
          fallback={
            <div className="h-10 w-full min-w-[12rem] animate-pulse rounded-lg border border-gold/15 bg-obsidian-light sm:w-48" />
          }
        >
          <GuideCategorySelect
            id="guides-page-category"
            className="w-full shrink-0 sm:w-52"
          />
        </Suspense>
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
              marketData={marketData}
              sort={sort}
              serverProfitRanges={serverProfitRanges}
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
