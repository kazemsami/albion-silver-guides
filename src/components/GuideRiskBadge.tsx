import type { GuideRiskProfile } from "@/types/guide";
import { riskProfileLabels } from "@/types/guide";

const riskProfileColors: Record<GuideRiskProfile, string> = {
  "beginner-safe":
    "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  "safe-passive": "text-sky-400 bg-sky-400/10 border-sky-400/30",
  "rng-heavy": "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

export function GuideRiskBadge({
  riskProfile,
  size = "sm",
}: {
  riskProfile: GuideRiskProfile;
  size?: "sm" | "md";
}) {
  const badgeClass =
    size === "md"
      ? "rounded-md border px-2.5 py-1 text-xs font-medium"
      : "rounded-md border px-2 py-0.5 text-[11px] font-medium";

  return (
    <span className={`${badgeClass} ${riskProfileColors[riskProfile]}`}>
      {riskProfileLabels[riskProfile]}
    </span>
  );
}
