import type { Metadata } from "next";
import Link from "next/link";
import { FeaturedGuidesGrid } from "@/components/FeaturedGuidesGrid";
import { HomeProfitRangeStat } from "@/components/HomeProfitRangeStat";
import { CategoryCard } from "@/components/CategoryCard";
import { JsonLd } from "@/components/JsonLd";
import { getFeaturedGuides } from "@/data/guides";
import type { GuideCategory } from "@/types/guide";
import { guides } from "@/data/guides";
import { fetchAllGuidesProfitRangesByCity } from "@/lib/guide-economics";
import { createPageMetadata } from "@/lib/site";
import { websiteJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Albion Online Money Making Guides",
  description:
    "Stack silver faster with proven Albion Online guides: gathering, fishing, dungeons, crafting, and laborers. Profit per hour from estimated price snapshots.",
  path: "/",
});

const allCategories: GuideCategory[] = [
  "gathering",
  "crafting",
  "dungeons",
  "fishing",
  "laborers",
];

export const revalidate = 3600;

export default async function Home() {
  const featured = getFeaturedGuides();
  const profitRangesByCity = await fetchAllGuidesProfitRangesByCity();

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      {/* Hero */}
      <section className="hero-section relative overflow-hidden border-b border-gold/10">
        <div className="hero-glow absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/70">
            Albion Online · Fan Guides
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-tight text-parchment sm:text-5xl lg:text-6xl">
            Stack Silver Faster with Proven Guides
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-parchment/60">
            From safe yellow-zone gathering to high-risk corrupted dungeons,
            find the money making method that fits your playstyle, gear, and
            risk tolerance.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/guides"
              className="btn-primary px-6 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Explore All Guides
            </Link>
            <Link
              href="/guides?difficulty=beginner"
              className="btn-secondary px-6 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              New Player Friendly
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="theme-surface rounded-xl border border-gold/15 bg-obsidian-light p-4">
              <p className="text-2xl font-bold text-gold">{guides.length}</p>
              <p className="mt-1 text-xs text-parchment/50">Guides</p>
            </div>
            <div className="theme-surface rounded-xl border border-gold/15 bg-obsidian-light p-4">
              <p className="text-2xl font-bold text-gold">{allCategories.length}</p>
              <p className="mt-1 text-xs text-parchment/50">Categories</p>
            </div>
            <div className="theme-surface rounded-xl border border-gold/15 bg-obsidian-light p-4">
              <HomeProfitRangeStat
                guides={guides}
                profitRangesByCity={profitRangesByCity}
              />
              <p className="mt-1 text-xs text-parchment/50">Silver/hr Range</p>
            </div>
            <div className="theme-surface rounded-xl border border-gold/15 bg-obsidian-light p-4">
              <p className="text-2xl font-bold text-gold">100%</p>
              <p className="mt-1 text-xs text-parchment/50">Free to Read</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="wiki-heading font-display text-2xl font-bold text-parchment sm:text-3xl">
              Featured Guides
            </h2>
            <p className="mt-2 text-parchment/50">
              Hand-picked strategies for consistent silver income
            </p>
          </div>
          <Link
            href="/guides"
            className="text-sm text-gold transition-colors hover:text-gold/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            View all →
          </Link>
        </div>

        <FeaturedGuidesGrid
          guides={featured}
          profitRangesByCity={profitRangesByCity}
        />
      </section>

      {/* Categories */}
      <section className="category-band border-t border-gold/10 bg-obsidian-light/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="wiki-heading font-display text-2xl font-bold text-parchment sm:text-3xl">
            Browse by Category
          </h2>
          <p className="mt-2 text-parchment/50">
            Find guides that match how you want to play
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {allCategories.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
