import type { PricedLine } from "@/types/guide";

const estTitles: Partial<Record<NonNullable<PricedLine["priceSource"]>, string>> = {
  snapshot: "Saved price snapshot (not live market)",
  estimated: "No royal market listing; trade-chat or fallback estimate",
};

export function PriceSourceBadge({
  source,
  className = "",
}: {
  source?: PricedLine["priceSource"];
  className?: string;
}) {
  if (source !== "estimated" && source !== "snapshot") return null;

  return (
    <span
      className={`text-[10px] font-medium uppercase text-amber-400/80 ${className}`}
      title={estTitles[source]}
    >
      est.
    </span>
  );
}
