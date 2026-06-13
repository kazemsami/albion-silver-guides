"use client";

import { useMemo, useState } from "react";
import { useMarketCity, useEffectiveMarketCity } from "@/components/MarketCityProvider";
import type { MarketCityId } from "@/lib/market-cities";
import {
  EconomicsSummaryRow,
  EconomicsTable,
} from "@/components/EconomicsTable";
import {
  DEFAULT_POTION_DEFAULTS,
  MAJOR_HEALING_CRAFT_SILVER,
  POTION_RECIPE_GROUPS,
  POTION_SELL_THROUGH_META,
  getPotionRecipe,
  type PotionRecipeId,
  type PotionSellThroughId,
} from "@/data/potion-economics";
import {
  deserializePriceMap,
  pickSerializedPrices,
} from "@/lib/guide-economics";
import { listingTaxRowLabel } from "@/lib/listing-tax";
import {
  computePotionEconomics,
  computePotionProfitRange,
  type PotionFocusMode,
} from "@/lib/potion-economics";
import type {
  GuideEconomics,
  PricedLine,
  SerializedPricesByCity,
  TierLoadoutBundle,
} from "@/types/guide";
import {
  formatItemQuantity,
  formatSilverExact,
  formatSilverPrice,
  formatSilverRange,
  roundSilver,
} from "@/lib/format";

interface PotionProfitCalculatorProps {
  economics: GuideEconomics;
  pricesByCity: SerializedPricesByCity;
  pricedAt: string;
  tierLoadouts: TierLoadoutBundle[];
  defaultMarketCity?: MarketCityId;
}

const FOCUS_MODE_META: Record<PotionFocusMode, { label: string; note: string }> =
  {
    "with-focus": {
      label: "With focus (45% return)",
      note: "Spend focus on the craft. Royal city lab material return at 45%.",
    },
    "without-focus": {
      label: "Without focus (15% return)",
      note: "No focus spent. Royal city lab material return at 15% only.",
    },
  };

export function PotionProfitCalculator({
  pricesByCity,
  pricedAt,
  defaultMarketCity,
}: PotionProfitCalculatorProps) {
  const { listingTaxRate, premiumSeller } = useMarketCity();
  const effectiveCity = useEffectiveMarketCity(defaultMarketCity);
  const prices = pickSerializedPrices(pricesByCity, effectiveCity);
  const [recipeId, setRecipeId] = useState<PotionRecipeId>("heal");
  const [sellThroughId, setSellThroughId] =
    useState<PotionSellThroughId>("instant");
  const [focusMode, setFocusMode] = useState<PotionFocusMode>("with-focus");
  const [valueFocus, setValueFocus] = useState(false);
  const [defaults, setDefaults] = useState(DEFAULT_POTION_DEFAULTS);

  const recipe = getPotionRecipe(recipeId);

  const priceMap = useMemo(() => deserializePriceMap(prices), [prices]);

  const result = useMemo(
    () =>
      computePotionEconomics(
        priceMap,
        {
          recipeId,
          tierId: "t6",
          sellThroughId,
          focusMode,
          valueFocus,
          defaults,
        },
        listingTaxRate,
      ),
    [
      priceMap,
      recipeId,
      sellThroughId,
      focusMode,
      valueFocus,
      defaults,
      listingTaxRate,
    ],
  );

  const profitRange = useMemo(
    () => computePotionProfitRange(priceMap),
    [priceMap],
  );

  const formattedAt = new Date(pricedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const focusMeta = FOCUS_MODE_META[focusMode];
  const batch = result.batch;
  const usesFocusMetric =
    focusMode === "with-focus" && recipe.focusCost > 0;
  const heroProfit = usesFocusMetric
    ? result.profitPerTenThousandFocus
    : batch.netAfterSellThrough;
  const craftSilverLabel =
    batch.craftSilverCost > 0
      ? formatSilverExact(batch.craftSilverCost)
      : "none";

  return (
    <>
      <div className="wiki-note mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-parchment/75">
        <p className="font-semibold text-amber-200/95">
          Bulk crafting is measured per 10,000 focus, not silver/hour
        </p>
        <p className="mt-1">
          Pick a potion and compare with or without focus. Each craft makes 5 or
          10 pots depending on the recipe (specialty T6/T7/T8 pots are usually
          10). Major Healing includes{" "}
          {formatSilverExact(MAJOR_HEALING_CRAFT_SILVER)} silver lab cost per
          batch. Energy filler is usually no focus; plan heal and war pots by
          profit per 10,000 focus.
        </p>
      </div>

      <div className="profit-hero-panel wiki-note theme-surface mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Potion recipe
          </p>
          <div className="mt-2 space-y-4">
            {POTION_RECIPE_GROUPS.map((group) => (
              <div key={group.tier}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/35">
                  {group.tier}
                </p>
                {group.comingSoon ? (
                  <p className="mt-2 text-sm text-parchment/45">Coming soon</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
                    {group.recipeIds.map((id) => (
                      <FilterChip
                        key={id}
                        label={getPotionRecipe(id).shortName}
                        selected={recipeId === id}
                        onSelect={() => setRecipeId(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            {recipe.outputName}: {recipe.materials.length} inputs,{" "}
            {recipe.focusCost > 0
              ? `${formatSilverExact(recipe.focusCost)} focus per batch`
              : "no focus"}
            {recipe.craftSilverCost != null && recipe.craftSilverCost > 0
              ? `, ${formatSilverExact(recipe.craftSilverCost)} lab silver`
              : ""}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Craft mode
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="tablist">
            {(Object.keys(FOCUS_MODE_META) as PotionFocusMode[]).map((id) => (
              <FilterChip
                key={id}
                label={FOCUS_MODE_META[id].label}
                selected={focusMode === id}
                onSelect={() => setFocusMode(id)}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">{focusMeta.note}</p>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              {usesFocusMetric
                ? "Profit / 10,000 focus"
                : `Batch profit (${recipe.outputQuantity} pots)`}
              {valueFocus && usesFocusMetric ? " (focus valued)" : ""}
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {heroProfit != null ? formatSilverPrice(heroProfit) : "N/A"}
            </p>
            {usesFocusMetric && result.totalPotsPerTenThousandFocus != null && (
              <p className="mt-2 text-sm font-semibold text-parchment/75">
                {formatItemQuantity(result.totalPotsPerTenThousandFocus)}{" "}
                {recipe.outputName}
                {result.totalPotsPerTenThousandFocus === 1 ? "" : "s"} per
                10,000 focus
                {result.batchesPerTenThousandFocus != null && (
                  <span className="font-normal text-parchment/45">
                    {" "}
                    ({formatItemQuantity(result.batchesPerTenThousandFocus)}{" "}
                    batches × {recipe.outputQuantity})
                  </span>
                )}
              </p>
            )}
            {usesFocusMetric &&
              result.perTenThousandNetBeforeFocus != null &&
              valueFocus &&
              result.perTenThousandFocusOpportunityCost != null &&
              result.perTenThousandFocusOpportunityCost > 0 && (
                <p className="mt-1 text-xs text-parchment/45">
                  Before focus opportunity cost:{" "}
                  {formatSilverPrice(result.perTenThousandNetBeforeFocus)}
                  /10k focus at{" "}
                  {formatSilverExact(defaults.focusSilverPerPoint)}/pt
                </p>
              )}
            {usesFocusMetric &&
              profitRange.min != null &&
              profitRange.max != null && (
                <p className="mt-1 text-xs text-parchment/45">
                  Major Healing slow to typical:{" "}
                  {formatSilverRange(profitRange.min, profitRange.max)}/10k
                  focus
                </p>
              )}
          </div>

          <div className="space-y-2 text-sm">
            <MetricRow
              label={`Batch profit (${recipe.outputQuantity} ${recipe.shortName})`}
              value={batch.netAfterSellThrough}
            />
            {usesFocusMetric && result.batchesPerTenThousandFocus != null && (
              <MetricRow
                label="Batches per 10,000 focus"
                value={result.batchesPerTenThousandFocus}
                text
              />
            )}
            {usesFocusMetric && result.totalPotsPerTenThousandFocus != null && (
              <MetricRow
                label="Pots per 10,000 focus"
                value={result.totalPotsPerTenThousandFocus}
                text
              />
            )}
            <MetricRow label="Lab craft silver per batch" value={batch.craftSilverCost} />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Sell-through assumption
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {(Object.keys(POTION_SELL_THROUGH_META) as PotionSellThroughId[]).map(
              (id) => (
                <FilterChip
                  key={id}
                  label={POTION_SELL_THROUGH_META[id].label}
                  selected={sellThroughId === id}
                  onSelect={() => setSellThroughId(id)}
                />
              ),
            )}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            {result.sellThroughNote}
          </p>
        </div>

        {focusMode === "with-focus" && recipe.focusCost > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-parchment/70">
              <input
                type="checkbox"
                checked={valueFocus}
                onChange={(e) => setValueFocus(e.target.checked)}
                className="accent-gold"
              />
              Value focus at {formatSilverExact(defaults.focusSilverPerPoint)}{" "}
              silver/point (optional opportunity cost on 10,000 focus)
            </label>
          </div>
        )}
      </div>

      <section className="theme-surface mt-10 rounded-xl border border-gold/20 bg-obsidian-light p-6">
        <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
          Profit breakdown
        </h2>
        <p className="mt-2 text-sm text-parchment/50">
          {recipe.outputName} per batch, then scaled to 10,000 focus when focus
          is used.
          {usesFocusMetric && result.totalPotsPerTenThousandFocus != null && (
            <>
              {" "}
              Output:{" "}
              <span className="text-parchment/70">
                {formatItemQuantity(result.totalPotsPerTenThousandFocus)} pots
              </span>{" "}
              per 10,000 focus.
            </>
          )}{" "}
          {focusMeta.label}. Lab craft silver: {craftSilverLabel}. Estimated
          snapshot prices. Updated {formattedAt}.
        </p>

        <BatchBreakdown
          batch={batch}
          focusMode={focusMode}
          showFocusMetrics={usesFocusMetric}
          potsPerTenThousandFocus={result.totalPotsPerTenThousandFocus}
          grossPerTenThousandFocus={result.perTenThousandGrossOutput}
          batchesPerTenThousandFocus={result.batchesPerTenThousandFocus}
        />

        {usesFocusMetric ? (
          <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
            <EconomicsSummaryRow
              label="Gross output / 10,000 focus"
              value={result.perTenThousandGrossOutput}
            />
            <EconomicsSummaryRow
              label={`Minus materials (after ${Math.round(batch.materialReturnRate * 100)}% return)`}
              value={
                result.perTenThousandMaterialCost != null
                  ? -result.perTenThousandMaterialCost
                  : null
              }
            />
            {result.perTenThousandCraftSilver != null &&
              result.perTenThousandCraftSilver > 0 && (
                <EconomicsSummaryRow
                  label={`Minus lab craft silver (${formatSilverExact(batch.craftSilverCost)} × batches)`}
                  value={-result.perTenThousandCraftSilver}
                />
              )}
            <EconomicsSummaryRow
              label={listingTaxRowLabel(premiumSeller)}
              value={
                result.perTenThousandListingTax != null
                  ? -result.perTenThousandListingTax
                  : null
              }
            />
            {result.perTenThousandSellThroughHaircut != null &&
              result.perTenThousandSellThroughHaircut > 0 && (
                <EconomicsSummaryRow
                  label={`Minus sell-through haircut (${result.sellThroughLabel})`}
                  value={-result.perTenThousandSellThroughHaircut}
                />
              )}
            <EconomicsSummaryRow
              label="Net / 10,000 focus before focus cost"
              value={result.perTenThousandNetBeforeFocus}
            />
            {valueFocus && result.perTenThousandFocusOpportunityCost != null && (
              <EconomicsSummaryRow
                label={`Minus focus opportunity cost (10,000 pts)`}
                value={-result.perTenThousandFocusOpportunityCost}
              />
            )}
            <EconomicsSummaryRow
              label="Profit / 10,000 focus"
              value={result.perTenThousandNetAfterFocus}
              emphasis
            />
          </div>
        ) : (
          <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
            <EconomicsSummaryRow
              label="Batch profit (no focus spent)"
              value={batch.netAfterSellThrough}
              emphasis
            />
          </div>
        )}

        <AssumptionSliders defaults={defaults} onChange={setDefaults} />

        <p className="mt-3 text-xs text-parchment/40">
          Listing tax and sell-through haircut are included above. Focus defaults
          to free daily regen unless you opt into focus valuation at{" "}
          {formatSilverExact(defaults.focusSilverPerPoint)}/point for each 10,000
          focus block.
        </p>
      </section>
    </>
  );
}

function scalePricedLines(
  lines: PricedLine[],
  multiplier: number,
): PricedLine[] {
  return lines.map((line) => {
    const quantity = Math.round(line.quantity * multiplier * 100) / 100;
    return {
      ...line,
      quantity,
      lineTotal:
        line.unitPrice != null ? roundSilver(line.unitPrice * quantity) : null,
    };
  });
}

function netMaterialLines(
  usedLines: PricedLine[],
  returnedLines: PricedLine[],
): PricedLine[] {
  return usedLines.map((used, index) => {
    const returned = returnedLines[index];
    const quantity =
      Math.round((used.quantity - (returned?.quantity ?? 0)) * 100) / 100;
    return {
      ...used,
      quantity,
      lineTotal:
        used.unitPrice != null ? roundSilver(used.unitPrice * quantity) : null,
    };
  });
}

function BatchBreakdown({
  batch,
  showFocusMetrics,
  focusMode,
  potsPerTenThousandFocus,
  grossPerTenThousandFocus,
  batchesPerTenThousandFocus,
}: {
  batch: ReturnType<typeof computePotionEconomics>["batch"];
  showFocusMetrics: boolean;
  focusMode: PotionFocusMode;
  potsPerTenThousandFocus?: number | null;
  grossPerTenThousandFocus?: number | null;
  batchesPerTenThousandFocus?: number | null;
}) {
  const returnPct = Math.round(batch.materialReturnRate * 100);
  const focusNote =
    focusMode === "with-focus" && batch.recipe.focusCost > 0
      ? `, ${formatSilverExact(batch.recipe.focusCost)} focus`
      : "";

  const scaledOutputLine =
    showFocusMetrics &&
    potsPerTenThousandFocus != null &&
    grossPerTenThousandFocus != null
      ? {
          ...batch.outputLine,
          quantity: potsPerTenThousandFocus,
          lineTotal: grossPerTenThousandFocus,
        }
      : null;

  const focusScale =
    showFocusMetrics && batchesPerTenThousandFocus != null
      ? batchesPerTenThousandFocus
      : null;

  const netMaterialLinesForView =
    focusScale != null
      ? netMaterialLines(
          scalePricedLines(batch.materialLines, focusScale),
          scalePricedLines(batch.returnedMaterialLines, focusScale),
        )
      : netMaterialLines(batch.materialLines, batch.returnedMaterialLines);

  const netMaterialTotal = showFocusMetrics
    ? focusScale != null && batch.netMaterialCost != null
      ? roundSilver(batch.netMaterialCost * focusScale)
      : null
    : batch.netMaterialCost;

  return (
    <div className="mt-4">
      {scaledOutputLine != null && grossPerTenThousandFocus != null && (
        <EconomicsTable
          title={`${batch.outputLine.name} per 10,000 focus`}
          lines={[scaledOutputLine]}
          total={grossPerTenThousandFocus}
          totalLabel="Gross sell value (10,000 focus)"
          variant="output"
          quantityLabel="Pots crafted"
        />
      )}
      {!showFocusMetrics && (
        <EconomicsTable
          title={`${batch.outputLine.name} (${batch.recipe.outputQuantity} per batch${focusNote})`}
          lines={[batch.outputLine]}
          total={batch.grossOutput}
          totalLabel="Gross batch output"
          variant="output"
          quantityLabel="Qty"
        />
      )}
      <EconomicsTable
        title={
          showFocusMetrics
            ? `Net materials per 10,000 focus (after ${returnPct}% return)`
            : `Net materials per batch (after ${returnPct}% return)`
        }
        lines={netMaterialLinesForView}
        total={netMaterialTotal}
        totalLabel={
          showFocusMetrics
            ? "Net material cost (10,000 focus)"
            : "Net material cost (batch)"
        }
        variant="input"
        quantityLabel="Net qty"
      />
      {!showFocusMetrics && (
      <div className="profit-summary-box mt-2 rounded-lg border border-parchment/10 bg-slot-bg px-4 py-2 text-sm">
        {batch.netMaterialCost != null && (
          <EconomicsSummaryRow
            label={`Minus net materials (after ${returnPct}% return)`}
            value={-batch.netMaterialCost}
          />
        )}
        {batch.craftSilverCost > 0 && (
          <EconomicsSummaryRow
            label="Minus lab craft silver"
            value={-batch.craftSilverCost}
          />
        )}
        {batch.listingTax != null && (
          <EconomicsSummaryRow label="Minus listing tax" value={-batch.listingTax} />
        )}
        {batch.sellThroughHaircut != null && batch.sellThroughHaircut > 0 && (
          <EconomicsSummaryRow
            label="Minus sell-through haircut"
            value={-batch.sellThroughHaircut}
          />
        )}
        <EconomicsSummaryRow
          label="Batch profit (before focus cost)"
          value={batch.netAfterSellThrough}
        />
      </div>
      )}
    </div>
  );
}

function QuantitySummaryRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-parchment/10 py-2 text-sm font-semibold text-parchment">
      <span>{label}</span>
      <span className="tabular-nums text-gold">
        {formatItemQuantity(value)} {unit}
        {value === 1 ? "" : "s"}
      </span>
    </div>
  );
}

function MetricRow({
  label,
  value,
  text,
}: {
  label: string;
  value: number | string | null;
  text?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 text-parchment/65">
      <span>{label}</span>
      <span className="font-semibold tabular-nums text-parchment/85">
        {value == null
          ? "N/A"
          : text
            ? String(value)
            : formatSilverPrice(value as number)}
      </span>
    </div>
  );
}

function FilterChip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`filter-chip px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        selected ? "filter-chip-active" : ""
      }`}
    >
      {label}
    </button>
  );
}

function AssumptionSliders({
  defaults,
  onChange,
}: {
  defaults: typeof DEFAULT_POTION_DEFAULTS;
  onChange: (d: typeof DEFAULT_POTION_DEFAULTS) => void;
}) {
  return (
    <div className="mt-5 rounded-lg border border-parchment/10 bg-slot-bg p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
        Model assumptions
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-1">
        <SliderField
          id="focus-value"
          label="Focus silver/point"
          value={defaults.focusSilverPerPoint}
          min={0}
          max={200}
          step={5}
          format={(v) => `${formatSilverExact(v)} silver`}
          onChange={(v) => onChange({ ...defaults, focusSilverPerPoint: v })}
        />
      </div>
    </div>
  );
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-parchment/60">
        {label}: <span className="text-parchment/85">{format(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-gold"
      />
    </div>
  );
}
