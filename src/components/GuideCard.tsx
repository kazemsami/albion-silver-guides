"use client";

import Link from "next/link";
import { useMarketCity } from "@/components/MarketCityProvider";
import type { Guide } from "@/types/guide";
import {
  categoryLabels,
  difficultyLabels,
  zoneTypeLabels,
} from "@/types/guide";
import { GuideReliabilityBadges } from "@/components/GuideReliabilityBadges";
import { GuideRiskBadge } from "@/components/GuideRiskBadge";
import {
  getGuideSilverDisplay,
  getCardPriceSourceLabel,
} from "@/lib/guide-display";
import type { GuideProfitRange } from "@/lib/guide-economics";
import { formatSilverPrice } from "@/lib/format";

const difficultyColors = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  advanced: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

const zoneTypeColors = {
  safe: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  dangerous: "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

export function GuideCard({
  guide,
  profitRange,
}: {
  guide: Guide;
  profitRange?: GuideProfitRange | null;
}) {
  const { useLivePrices } = useMarketCity();
  const priceSourceLabel = getCardPriceSourceLabel(useLivePrices);
  const profitUnit =
    guide.slug === "potions-crafting-bulk" ? "/10k focus" : "/hr";
  const profitRangeLabel =
    guide.slug === "potions-crafting-bulk"
      ? "Profit range / 10k focus"
      : "Profit range / hr";
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="theme-surface card-interactive group flex flex-col rounded-xl border border-gold/15 bg-obsidian-light p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-gold/25 bg-gold/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-gold/80">
          {categoryLabels[guide.category]}
        </span>
        <span
          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${difficultyColors[guide.difficulty]}`}
        >
          {difficultyLabels[guide.difficulty]}
        </span>
        <span
          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${zoneTypeColors[guide.zoneType]}`}
        >
          {zoneTypeLabels[guide.zoneType]}
        </span>
        {guide.riskProfile && (
          <GuideRiskBadge riskProfile={guide.riskProfile} />
        )}
        <GuideReliabilityBadges reliability={guide.reliability} />
      </div>

      <h3 className="font-display text-lg font-semibold text-parchment transition-colors group-hover:text-gold">
        {guide.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-parchment/55">
        {guide.description}
      </p>

      <div className="mt-4 border-t border-gold/10 pt-4">
        <span className="text-[10px] uppercase tracking-widest text-parchment/35">
          {profitRangeLabel}
        </span>
        {profitRange ? (
          <p className="mt-1 text-sm font-semibold text-gold tabular-nums">
            {profitRange.min !== profitRange.max
              ? `${formatSilverPrice(profitRange.min)} – ${formatSilverPrice(profitRange.max)}${profitUnit}`
              : `${formatSilverPrice(profitRange.max)}${profitUnit}`}
            <span className="ml-1 font-normal text-parchment/40">
              · {priceSourceLabel}
            </span>
          </p>
        ) : (
          <p className="mt-1 text-sm font-semibold text-gold">
            {getGuideSilverDisplay(guide, null)}
            <span className="font-normal text-parchment/40">
              {" "}
              {profitUnit} · {priceSourceLabel}
            </span>
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-parchment/40">
            {guide.readTime} min read →
          </span>
        </div>
      </div>
    </Link>
  );
}
