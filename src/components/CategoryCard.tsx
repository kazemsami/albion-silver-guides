import Link from "next/link";
import type { GuideCategory } from "@/types/guide";
import { categoryDescriptions, categoryLabels } from "@/types/guide";
import { getGuidesByCategory } from "@/data/guides";

const categoryIcons: Record<GuideCategory, string> = {
  gathering: "⛏",
  crafting: "🔨",
  dungeons: "⚔",
  fishing: "🎣",
  laborers: "🏠",
};

export function CategoryCard({ category }: { category: GuideCategory }) {
  const count = getGuidesByCategory(category).length;

  return (
    <Link
      href={`/guides?category=${category}`}
      className="theme-surface card-interactive group flex items-start gap-4 rounded-xl border border-gold/15 bg-obsidian-light p-5 hover:bg-gold/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/5 text-xl transition-colors group-hover:bg-gold/10">
        {categoryIcons[category]}
      </span>
      <div>
        <h3 className="font-display font-semibold text-parchment transition-colors group-hover:text-gold">
          {categoryLabels[category]}
        </h3>
        <p className="mt-1 text-sm text-parchment/50">
          {categoryDescriptions[category]}
        </p>
        <p className="mt-2 text-xs text-gold/60">
          {count} guide{count !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
