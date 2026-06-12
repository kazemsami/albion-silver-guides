import Link from "next/link";
import type { Guide } from "@/types/guide";
import {
  categoryLabels,
  difficultyLabels,
  zoneTypeLabels,
} from "@/types/guide";
import { GuideReliabilityBadges } from "@/components/GuideReliabilityBadges";
import {
  getGuideSilverDisplay,
  hasLiveProfitRange,
} from "@/lib/guide-display";
import { getMarketCityLabel, type MarketCityId } from "@/lib/market-cities";
import type { GuideProfitRange } from "@/lib/guide-economics";

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
  marketCity,
}: {
  guide: Guide;
  profitRange?: GuideProfitRange | null;
  marketCity?: MarketCityId;
}) {
  const liveProfit = hasLiveProfitRange(profitRange);
  const marketLabel =
    marketCity && marketCity !== "average"
      ? getMarketCityLabel(marketCity)
      : null;
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
        <GuideReliabilityBadges reliability={guide.reliability} />
      </div>

      <h3 className="font-display text-lg font-semibold text-parchment transition-colors group-hover:text-gold">
        {guide.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-parchment/55">
        {guide.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-gold/10 pt-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-parchment/35">
            Profit / hr
          </span>
          <p className="text-sm font-semibold text-gold">
            {getGuideSilverDisplay(guide, profitRange)}
            <span className="font-normal text-parchment/40">
              {" "}
              · {liveProfit ? (marketLabel ?? "live market") : "estimate"}
            </span>
          </p>
        </div>
        <span className="text-xs text-parchment/40">
          {guide.readTime} min read →
        </span>
      </div>
    </Link>
  );
}
