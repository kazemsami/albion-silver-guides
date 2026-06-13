import type { GuideReliability } from "@/types/guide";
import {
  verificationStatusDescriptions,
  verificationStatusLabels,
} from "@/types/guide";
import { formatGuideLastUpdated } from "@/lib/guide-display";

const verificationStatusColors = {
  reviewed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
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
        className={`${badgeClass} ${verificationStatusColors[reliability.status]}`}
        title={verificationStatusDescriptions[reliability.status]}
      >
        {verificationStatusLabels[reliability.status]}
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
