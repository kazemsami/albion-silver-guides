import { ItemIcon } from "@/components/ItemIcon";
import type { PricedLine } from "@/types/guide";
import {
  formatItemQuantity,
  formatSilverExact,
  formatSilverPrice,
} from "@/lib/format";

interface EconomicsTableProps {
  title: string;
  lines: PricedLine[];
  total: number | null;
  totalLabel?: string;
  variant?: "output" | "input" | "neutral";
}

const variantStyles = {
  output: "text-emerald-400",
  input: "text-rose-400",
  neutral: "text-gold",
};

export function EconomicsTable({
  title,
  lines,
  total,
  totalLabel = "Subtotal",
  variant = "neutral",
}: EconomicsTableProps) {
  if (lines.length === 0) return null;

  return (
    <div className="wiki-table-wrap economics-table-inner theme-surface mt-4 rounded-lg border border-parchment/10 bg-slot-bg p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
        {title}
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-parchment/10 text-[10px] uppercase tracking-wider text-parchment/35">
              <th className="pb-2 pr-3 font-medium">Item</th>
              <th className="pb-2 pr-3 text-right font-medium">Qty/hr</th>
              <th className="pb-2 pr-3 text-right font-medium">Unit</th>
              <th className="pb-2 text-right font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr
                key={`${line.id}-${line.name}`}
                className="border-b border-parchment/5 text-parchment/70"
              >
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2.5">
                    <ItemIcon id={line.id} name={line.name} />
                    <span className="min-w-0">{line.name}</span>
                  </div>
                </td>
                <td className="py-2 pr-3 text-right tabular-nums">
                  {formatItemQuantity(line.quantity)}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums text-parchment/50">
                  {line.unitPrice != null ? (
                    <span className="inline-flex items-center justify-end gap-1">
                      {line.priceSource === "estimated" && (
                        <span
                          className="text-[10px] font-medium uppercase text-amber-400/80"
                          title="No royal market listing; trade-chat estimate"
                        >
                          est.
                        </span>
                      )}
                      {formatSilverExact(line.unitPrice)}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {line.lineTotal != null
                    ? formatSilverExact(line.lineTotal)
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total != null && (
        <p className={`mt-3 text-right text-sm font-semibold ${variantStyles[variant]}`}>
          {totalLabel}: {formatSilverExact(total)} silver
        </p>
      )}
    </div>
  );
}

export function EconomicsSummaryRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: number | null;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-parchment/10 py-2 text-sm ${
        emphasis ? "font-semibold text-parchment" : "text-parchment/70"
      }`}
    >
      <span>{label}</span>
      <span className={`tabular-nums ${emphasis ? "text-gold" : ""}`}>
        {formatSilverPrice(value)}
      </span>
    </div>
  );
}
