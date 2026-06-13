"use client";

import { useMemo, useState } from "react";
import { useMarketCity, useGuidePriceMap } from "@/components/MarketCityProvider";
import type { MarketCityId } from "@/lib/market-cities";
import {
  EconomicsSummaryRow,
  EconomicsTable,
} from "@/components/EconomicsTable";
import {
  DEFAULT_POTION_DEFAULTS,
  DEFAULT_POTION_EXTRACT_LEVEL,
  MAJOR_HEALING_CRAFT_SILVER,
  POTION_EXTRACT_META,
  POTION_EXTRACT_LEVELS,
  POTION_EXTRACT_PER_BATCH,
  POTION_RECIPE_GROUPS,
  POTION_SELL_THROUGH_META,
  getPotionRecipe,
  potionRecipeSupportsExtract,
  resolvePotionBatch,
  type PotionExtractLevel,
  type PotionRecipeId,
  type PotionSellThroughId,
} from "@/data/potion-economics";
import { listingTaxRowLabel } from "@/lib/listing-tax";
import {
  computePotionEconomics,
  computePotionProfitRange,
  type PotionFocusMode,
} from "@/lib/potion-economics";
import type {
  GuideEconomics,
  GuideMarketPrices,
  PricedLine,
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
  guidePrices: GuideMarketPrices;
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
  guidePrices,
  pricedAt,
  defaultMarketCity,
}: PotionProfitCalculatorProps) {
  const { listingTaxRate, premiumSeller, useLivePrices } = useMarketCity();
  const { priceMap, mapKind } = useGuidePriceMap(guidePrices, defaultMarketCity);
  const [recipeId, setRecipeId] = useState<PotionRecipeId>("heal");
  const [sellThroughId, setSellThroughId] =
    useState<PotionSellThroughId>("normal");
  const [focusMode, setFocusMode] = useState<PotionFocusMode>("with-focus");
  const [extractLevel, setExtractLevel] = useState<PotionExtractLevel>(
    DEFAULT_POTION_EXTRACT_LEVEL,
  );
  const [defaults, setDefaults] = useState(DEFAULT_POTION_DEFAULTS);

  const recipe = getPotionRecipe(recipeId);
  const supportsExtract = potionRecipeSupportsExtract(recipe);
  const resolvedBatch = useMemo(
    () => resolvePotionBatch(recipe, extractLevel),
    [recipe, extractLevel],
  );
  const extractMeta = POTION_EXTRACT_META[extractLevel];

  const result = useMemo(
    () =>
      computePotionEconomics(
        priceMap,
        {
          recipeId,
          tierId: "t6",
          sellThroughId,
          focusMode,
          extractLevel,
          defaults,
          priceMapKind: mapKind,
        },
        listingTaxRate,
      ),
    [
      priceMap,
      recipeId,
      sellThroughId,
      focusMode,
      extractLevel,
      defaults,
      listingTaxRate,
      mapKind,
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
    focusMode === "with-focus" && resolvedBatch.focusCost > 0;
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
            {resolvedBatch.outputName}: {recipe.materials.length} farm inputs
            {supportsExtract && extractMeta.usesExtract ? (
              <>
                {" "}
                + {POTION_EXTRACT_PER_BATCH} {extractMeta.extractName!.toLowerCase()} per batch
              </>
            ) : supportsExtract ? (
              " (normal .0, no extract)"
            ) : (
              " (no enchantment tiers)"
            )}
            ,{" "}
            {resolvedBatch.focusCost > 0
              ? `${formatSilverExact(resolvedBatch.focusCost)} focus per batch`
              : "no focus"}
            {recipe.craftSilverCost != null && recipe.craftSilverCost > 0
              ? `, ${formatSilverExact(recipe.craftSilverCost)} lab silver`
              : ""}
          </p>
        </div>

        {supportsExtract && (
        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Potion tier
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {POTION_EXTRACT_LEVELS.map((level) => (
              <FilterChip
                key={level}
                label={
                  level === 0
                    ? `Normal (${POTION_EXTRACT_META[level].outputEnchantmentLabel})`
                    : `${level} · ${POTION_EXTRACT_META[level].label} (${POTION_EXTRACT_META[level].outputEnchantmentLabel})`
                }
                selected={extractLevel === level}
                onSelect={() => setExtractLevel(level)}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            {extractMeta.usesExtract
              ? `Crafts ${extractMeta.outputEnchantmentLabel} potions with the same farm goods as normal plus ${POTION_EXTRACT_PER_BATCH} ${extractMeta.extractName!.toLowerCase()} per batch of ${recipe.outputQuantity} pots.`
              : `Crafts normal ${extractMeta.outputEnchantmentLabel} potions with flat farm goods and no arcane extract.`}
          </p>
        </div>
        )}

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
              profitRange.min != null &&
              profitRange.max != null && (
                <p className="mt-1 text-xs text-parchment/45">
                  Major Healing normal vs event hold:{" "}
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
            Sell strategy
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
          {focusMeta.label}.
          {supportsExtract
            ? extractMeta.usesExtract
              ? ` ${extractMeta.label} (${extractMeta.outputEnchantmentLabel} output).`
              : ` Normal ${extractMeta.outputEnchantmentLabel} (no extract).`
            : " Flat output (no enchantment tiers)."}{" "}
          Lab craft silver: {craftSilverLabel}.{" "}
          {useLivePrices
            ? "Live royal market prices (Albion Online Data)."
            : "Site snapshot averages."}{" "}
          Updated {formattedAt}.
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
            {result.perTenThousandStationFee != null &&
              result.perTenThousandStationFee > 0 && (
                <EconomicsSummaryRow
                  label={`Minus station fee (${formatSilverExact(batch.stationFeePerBatch)} × batches)`}
                  value={-result.perTenThousandStationFee}
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
              result.perTenThousandSellThroughHaircut !== 0 && (
                <EconomicsSummaryRow
                  label={
                    result.perTenThousandSellThroughHaircut > 0
                      ? `Minus sell friction (${result.sellThroughLabel})`
                      : `Plus event price uplift (${result.sellThroughLabel})`
                  }
                  value={-result.perTenThousandSellThroughHaircut}
                />
              )}
            <EconomicsSummaryRow
              label="Profit / 10,000 focus"
              value={result.profitPerTenThousandFocus}
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
          Listing tax and sell strategy adjustment are included above. Set station fee
          per batch under Model assumptions (0 if you craft on your own island).
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
    focusMode === "with-focus" && batch.focusPointsPerBatch > 0
      ? `, ${formatSilverExact(batch.focusPointsPerBatch)} focus`
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
        {batch.stationFeePerBatch > 0 && (
          <EconomicsSummaryRow
            label="Minus station fee"
            value={-batch.stationFeePerBatch}
          />
        )}
        {batch.listingTax != null && (
          <EconomicsSummaryRow label="Minus listing tax" value={-batch.listingTax} />
        )}
        {batch.sellThroughHaircut != null && batch.sellThroughHaircut !== 0 && (
          <EconomicsSummaryRow
            label={
              batch.sellThroughHaircut > 0
                ? "Minus sell friction"
                : "Plus event price uplift"
            }
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
          id="station-fee"
          label="Station fee per batch"
          value={defaults.stationFeePerBatch}
          min={0}
          max={5000}
          step={50}
          format={(v) => `${formatSilverExact(v)} silver`}
          onChange={(v) => onChange({ ...defaults, stationFeePerBatch: v })}
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
