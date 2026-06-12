import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuideBySlug } from "@/data/guides";
import { getGuideEconomics } from "@/data/guide-economics";
import {
  categoryLabels,
  difficultyLabels,
} from "@/types/guide";
import {
  fetchAllGuidesProfitRangesByCity,
  fetchGuidePricing,
} from "@/lib/guide-economics";
import { GuideReliabilityBadges } from "@/components/GuideReliabilityBadges";
import { GuideComments } from "@/components/GuideComments";
import { RelatedGuides } from "@/components/RelatedGuides";
import { GuideProfitCalculator } from "@/components/GuideProfitCalculator";
import { JsonLd } from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/site";
import { guideHowToJsonLd } from "@/lib/structured-data";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {
      title: "Guide Not Found",
      robots: { index: false, follow: true },
    };
  }

  return createPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article",
  });
}

const difficultyColors = {
  beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  intermediate: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  advanced: "text-rose-400 border-rose-400/30 bg-rose-400/10",
};

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  const economicsConfig = getGuideEconomics(slug);
  const [marketPricing, profitRangesByCity] = await Promise.all([
    fetchGuidePricing(slug, economicsConfig),
    fetchAllGuidesProfitRangesByCity(),
  ]);

  const related = guides
    .filter((g) => g.category === guide.category && g.slug !== guide.slug)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <JsonLd data={guideHowToJsonLd(guide)} />
      <nav aria-label="Breadcrumb" className="text-sm text-parchment/45">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="text-parchment/25">/</li>
          <li>
            <Link
              href="/guides"
              className="transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Guides
            </Link>
          </li>
          <li aria-hidden className="text-parchment/25">/</li>
          <li>
            <Link
              href={`/guides?category=${guide.category}`}
              className="transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {categoryLabels[guide.category]}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="guide-intro mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-gold/25 bg-gold/5 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-gold/80">
            {categoryLabels[guide.category]}
          </span>
          <span
            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${difficultyColors[guide.difficulty]}`}
          >
            {difficultyLabels[guide.difficulty]}
          </span>
          <GuideReliabilityBadges reliability={guide.reliability} size="md" />
          <span className="text-xs text-parchment/40">
            {guide.readTime} min read
          </span>
        </div>

        <h1 className="font-display mt-4 text-3xl font-bold leading-tight text-parchment sm:text-4xl">
          {guide.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-parchment/60">
          {guide.description}
        </p>
      </div>

      {economicsConfig && marketPricing.serializedPricesByCity && (
        <GuideProfitCalculator
          economics={economicsConfig}
          pricesByCity={marketPricing.serializedPricesByCity}
          pricedAt={
            marketPricing.hourlyEconomics?.pricedAt ?? new Date().toISOString()
          }
          tierLoadouts={marketPricing.tierLoadoutBundles}
        />
      )}

      <section className="mt-10">
        <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
          Requirements
        </h2>
        <ul className="mt-4 space-y-2">
          {guide.requirements.map((req, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-parchment/70"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {req}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
          Step-by-Step
        </h2>
        <ol className="mt-4 space-y-4">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xs font-bold text-gold">
                {i + 1}
              </span>
              <p className="pt-0.5 leading-relaxed text-parchment/70">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wiki-note theme-surface mt-10 rounded-xl border border-gold/15 bg-obsidian-light p-6">
        <h2 className="font-display text-xl font-semibold text-gold">
          Pro Tips
        </h2>
        <ul className="mt-4 space-y-3">
          {guide.tips.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed text-parchment/65"
            >
              <span className="text-gold">★</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {guide.references && guide.references.length > 0 && (
        <section className="mt-10">
          <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
            References
          </h2>
          <ul className="mt-4 space-y-2">
            {guide.references.map((ref) => (
              <li key={ref.url}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/90 underline decoration-gold/30 underline-offset-2 transition-colors hover:text-gold hover:decoration-gold/60"
                >
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <RelatedGuides guides={related} profitRangesByCity={profitRangesByCity} />
      )}

      <GuideComments slug={guide.slug} />
    </article>
  );
}
