import type { GuideReliability } from "@/types/guide";
import { reviewStatusLabels } from "@/types/guide";
import { formatGuideLastUpdated } from "@/lib/guide-display";

const reviewStatusColors = {
  "tested-by-me":
    "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  "community-checked":
    "text-violet-400 bg-violet-400/10 border-violet-400/30",
  "needs-review": "text-amber-400 bg-amber-400/10 border-amber-400/30",
} as const;

export function GuideReliabilityBadges({
  reliability,
  size = "sm",
}: {
  reliability: GuideReliability;
  size?: "sm" | "md";
}) {
  const badgeClass =
    size === "md"
      ? "rounded-md border px-2.5 py-1 text-xs font-medium"
      : "rounded-md border px-2 py-0.5 text-[11px] font-medium";

  return (
    <>
      <span
        className={`${badgeClass} ${reviewStatusColors[reliability.status]}`}
      >
        {reviewStatusLabels[reliability.status]}
      </span>
      <span
        className={`${badgeClass} border-parchment/15 bg-parchment/5 text-parchment/55`}
        title={`Last updated ${reliability.lastUpdated}`}
      >
        Last updated {formatGuideLastUpdated(reliability.lastUpdated)}
      </span>
    </>
  );
}
