import type { GuideProfitOutcomes } from "@/types/guide";
import { profitOutcomeLabels } from "@/types/guide";
import { formatSilverPrice } from "@/lib/format";

const outcomeOrder: (keyof GuideProfitOutcomes)[] = [
  "conservative",
  "median",
  "expected",
  "highRoll",
];

const defaultOutcomeHints: Record<keyof GuideProfitOutcomes, string> = {
  conservative: "Bad luck, low spec, slower route, worse market",
  median: "Typical session for a normal player",
  expected: "Includes rare drops mathematically",
  highRoll: "Lucky drop or strong session",
};

export function ProfitOutcomesTable({
  outcomes,
  compact = false,
  highlight = "expected",
  unitLabel = "/hr",
  priceSourceLabel,
  outcomeHints: outcomeHintsOverride,
}: {
  outcomes: GuideProfitOutcomes;
  compact?: boolean;
  highlight?: keyof GuideProfitOutcomes;
  unitLabel?: string;
  priceSourceLabel?: string;
  outcomeHints?: Partial<Record<keyof GuideProfitOutcomes, string>>;
}) {
  const hints = { ...defaultOutcomeHints, ...outcomeHintsOverride };
  const hasAny = outcomeOrder.some((key) => outcomes[key] != null);
  if (!hasAny) return null;

  if (compact) {
    const lo = outcomes.conservative ?? outcomes.median;
    const hi = outcomes.highRoll ?? outcomes.expected ?? outcomes.median;
    if (lo == null && hi == null) return null;
    return (
      <p className="text-sm font-semibold text-gold tabular-nums">
        {lo != null && hi != null && lo !== hi
          ? `${formatSilverPrice(lo)} – ${formatSilverPrice(hi)}${unitLabel}`
          : `${formatSilverPrice(hi ?? lo!)}${unitLabel}`}
        <span className="ml-1 font-normal text-parchment/40">
          {priceSourceLabel ?? "est."}
        </span>
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[18rem] text-left text-sm">
        <thead>
          <tr className="border-b border-gold/10 text-[10px] uppercase tracking-widest text-parchment/40">
            <th className="pb-2 pr-3 font-semibold">Metric</th>
            <th className="pb-2 pr-3 font-semibold">Take-home{unitLabel}</th>
            <th className="pb-2 font-semibold">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {outcomeOrder.map((key) => {
            const value = outcomes[key];
            if (value == null) return null;
            return (
              <tr
                key={key}
                className={`border-b border-gold/5 ${key === highlight ? "bg-gold/5" : ""}`}
              >
                <td className="py-2 pr-3 font-medium text-parchment/80">
                  {profitOutcomeLabels[key]}
                </td>
                <td className="py-2 pr-3 font-semibold tabular-nums text-gold">
                  {formatSilverPrice(value)}
                </td>
                <td className="py-2 text-xs text-parchment/50">
                  {hints[key]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
