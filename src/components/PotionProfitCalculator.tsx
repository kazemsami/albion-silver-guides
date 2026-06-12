"use client";

import { useMemo, useState } from "react";
import { EquipmentPanel } from "@/components/EquipmentPanel";
import { useMarketCity } from "@/components/MarketCityProvider";
import {
  EconomicsSummaryRow,
  EconomicsTable,
} from "@/components/EconomicsTable";
import { loadoutVariantForTier } from "@/data/guide-loadouts";
import {
  DEFAULT_DAILY_FOCUS_BUDGET,
  DEFAULT_FOCUS_SESSION_HOURS,
  DEFAULT_POTION_DEFAULTS,
  POTION_SELL_THROUGH_META,
  type PotionSellThroughId,
} from "@/data/potion-economics";
import { getMarketCityLabel } from "@/lib/market-cities";
import {
  computeLoadoutPricing,
  deserializePriceMap,
  enrichLoadoutWithQuantities,
  pickSerializedPrices,
} from "@/lib/guide-economics";
import {
  computePotionEconomics,
  computePotionProfitRange,
} from "@/lib/potion-economics";
import type {
  GuideEconomics,
  SerializedPricesByCity,
  TierLoadoutBundle,
} from "@/types/guide";
import {
  formatPercent,
  formatSilverExact,
  formatSilverPrice,
  formatSilverRange,
} from "@/lib/format";

interface PotionProfitCalculatorProps {
  economics: GuideEconomics;
  pricesByCity: SerializedPricesByCity;
  pricedAt: string;
  tierLoadouts: TierLoadoutBundle[];
}

export function PotionProfitCalculator({
  economics,
  pricesByCity,
  pricedAt,
  tierLoadouts,
}: PotionProfitCalculatorProps) {
  const { marketCity } = useMarketCity();
  const prices = pickSerializedPrices(pricesByCity, marketCity);
  const [tierId, setTierId] = useState(economics.defaultSkillTierId);
  const [sellThroughId, setSellThroughId] =
    useState<PotionSellThroughId>("typical");
  const [valueFocus, setValueFocus] = useState(false);
  const [defaults, setDefaults] = useState(DEFAULT_POTION_DEFAULTS);

  const tier =
    economics.skillTiers.find((t) => t.id === tierId) ?? economics.skillTiers[0];
  const priceMap = useMemo(() => deserializePriceMap(prices), [prices]);

  const result = useMemo(
    () =>
      computePotionEconomics(priceMap, {
        tierId,
        sellThroughId,
        valueFocus,
        defaults,
      }),
    [priceMap, tierId, sellThroughId, valueFocus, defaults],
  );

  const profitRange = useMemo(
    () => computePotionProfitRange(priceMap),
    [priceMap],
  );

  const activeLoadout = useMemo(() => {
    const bundle = tierLoadouts.find((b) => b.tierId === tierId);
    if (!bundle) return undefined;
    const loadout = enrichLoadoutWithQuantities(
      bundle.loadout,
      economics,
      tier,
    );
    return {
      ...bundle,
      loadout,
      pricing: computeLoadoutPricing(loadout, priceMap),
    };
  }, [economics, tier, tierId, tierLoadouts, priceMap]);

  const formattedAt = new Date(pricedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <div className="wiki-note mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-parchment/75">
        <p className="font-semibold text-amber-200/95">
          Bulk crafting is not a clean silver/hour farm
        </p>
        <p className="mt-1">
          Margins depend on buy prices, Brecilien station fees, listing tax, and how
          fast stacks sell. Focus on heal pots is your daily crafting budget, not
          silver you spend at the lab. Use batch profit and profit per 10,000 focus;
          the hourly line models one active craft hour, not passive income.
        </p>
      </div>

      <div className="profit-hero-panel wiki-note theme-surface mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Realistic session profit / hour
              {valueFocus ? " (focus valued)" : " (focus free)"}
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {result.hourlyNetAfterFocus != null
                ? formatSilverPrice(result.hourlyNetAfterFocus)
                : "N/A"}
            </p>
            {result.hourlyNetBeforeFocus != null &&
              valueFocus &&
              result.hourlyFocusOpportunityCost != null &&
              result.hourlyFocusOpportunityCost > 0 && (
                <p className="mt-1 text-xs text-parchment/45">
                  Before focus opportunity cost:{" "}
                  {formatSilverPrice(result.hourlyNetBeforeFocus)}/hr
                  {" · "}
                  {formatSilverExact(result.hourlyFocusPointsBilled)} focus billed
                  at {formatSilverExact(defaults.focusSilverPerPoint)}/pt
                </p>
              )}
            {profitRange.min != null && profitRange.max != null && (
              <p className="mt-1 text-xs text-parchment/45">
                T5 slow to T6 typical (focus free):{" "}
                {formatSilverRange(profitRange.min, profitRange.max)}/hr
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <MetricRow
              label="Batch profit (Major Healing, 5 pots)"
              value={result.healBatch.netBeforeFocus}
            />
            <MetricRow
              label="Batch profit (Major Energy, 5 pots)"
              value={result.energyBatch.netBeforeFocus}
            />
            <MetricRow
              label="Profit per 10,000 focus (heal batch)"
              value={result.profitPerTenThousandFocus}
            />
            <MetricRow
              label="Profit per crafting minute"
              value={result.profitPerCraftingMinute}
            />
            <MetricRow
              label="Est. hours to sell session output"
              value={
                result.estimatedSellThroughHours != null
                  ? `${result.estimatedSellThroughHours} hr at ~${defaults.sellThroughPotsPerHour} pots/hr`
                  : null
              }
              text
            />
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

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-parchment/70">
            <input
              type="checkbox"
              checked={valueFocus}
              onChange={(e) => setValueFocus(e.target.checked)}
              className="accent-gold"
            />
            Value focus at {formatSilverExact(defaults.focusSilverPerPoint)}{" "}
            silver/point (optional opportunity cost, capped to daily budget)
          </label>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Alchemy tier
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {economics.skillTiers.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={tierId === option.id}
                onSelect={() => setTierId(option.id)}
              />
            ))}
          </div>
          {tier.description && (
            <p className="mt-2 text-sm text-parchment/55">{tier.description}</p>
          )}
        </div>
      </div>

      {activeLoadout && (
        <section className="mt-10">
          <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
            Materials per batch
          </h2>
          <p className="mt-1 text-sm text-parchment/50">
            Stock list for <span className="text-parchment/70">{tier.label}</span>
          </p>
          <div className="mt-4">
            <EquipmentPanel
              loadout={activeLoadout.loadout}
              variant={activeLoadout.variant}
              pricing={activeLoadout.pricing}
              prices={prices}
            />
          </div>
        </section>
      )}

      <section className="theme-surface mt-10 rounded-xl border border-gold/20 bg-obsidian-light p-6">
        <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
          Profit breakdown
        </h2>
        <p className="mt-2 text-sm text-parchment/50">
          Modeled session: {result.healBatchesPerHour} heal batches +{" "}
          {result.energyBatchesPerHour} energy batches per hour (
          {result.totalPotsPerHour} pots total). Prices from{" "}
          {getMarketCityLabel(marketCity).toLowerCase()} (Albion Data Project).
          Updated {formattedAt}.
        </p>

        <BatchBreakdown title="Major Healing batch (5 pots, 768 focus)" batch={result.healBatch} />
        <BatchBreakdown title="Major Energy batch (5 pots, no focus)" batch={result.energyBatch} />

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow
            label="Gross output / hour (both recipes)"
            value={result.hourlyGrossOutput}
          />
          <EconomicsSummaryRow
            label="Minus material buys"
            value={
              result.hourlyMaterialCost != null
                ? -result.hourlyMaterialCost
                : null
            }
          />
          <EconomicsSummaryRow
            label={`Minus Brecilien station fees (~${formatPercent(defaults.stationFeeRate)})`}
            value={
              result.hourlyStationFees != null ? -result.hourlyStationFees : null
            }
          />
          <EconomicsSummaryRow
            label="Minus Premium listing tax (~6.5%)"
            value={
              result.hourlyListingTax != null ? -result.hourlyListingTax : null
            }
          />
          {result.hourlySellThroughHaircut != null &&
            result.hourlySellThroughHaircut > 0 && (
              <EconomicsSummaryRow
                label={`Minus sell-through haircut (${result.sellThroughLabel})`}
                value={-result.hourlySellThroughHaircut}
              />
            )}
          <EconomicsSummaryRow
            label="Net / hour before focus cost"
            value={result.hourlyNetBeforeFocus}
          />
          {valueFocus && result.hourlyFocusOpportunityCost != null && (
            <EconomicsSummaryRow
              label={`Minus focus opportunity cost (${formatSilverExact(result.hourlyFocusPointsBilled)} pts)`}
              value={-result.hourlyFocusOpportunityCost}
            />
          )}
          <EconomicsSummaryRow
            label="Realistic session profit / hour"
            value={result.hourlyNetAfterFocus}
            emphasis
          />
        </div>

        <AssumptionSliders defaults={defaults} onChange={setDefaults} />

        <p className="mt-3 text-xs text-parchment/40">
          Station fee, listing tax, and sell-through haircut are all included in
          the breakdown above. Focus defaults to free (daily regen you spend on
          heal pots). Optional focus valuation bills at most{" "}
          {formatSilverExact(
            DEFAULT_DAILY_FOCUS_BUDGET / DEFAULT_FOCUS_SESSION_HOURS,
          )}{" "}
          points per craft hour. Hourly batch counts are focus-realistic for T6,
          not max lab throughput.
        </p>
      </section>
    </>
  );
}

function BatchBreakdown({
  title,
  batch,
}: {
  title: string;
  batch: ReturnType<typeof computePotionEconomics>["healBatch"];
}) {
  return (
    <div className="mt-4">
      <EconomicsTable
        title={title}
        lines={[batch.outputLine, ...batch.materialLines]}
        total={batch.grossOutput}
        totalLabel="Gross batch output"
        variant="output"
      />
      <div className="profit-summary-box mt-2 rounded-lg border border-parchment/10 bg-slot-bg px-4 py-2 text-sm">
        {batch.materialCost != null && (
          <EconomicsSummaryRow label="Minus materials" value={-batch.materialCost} />
        )}
        {batch.stationFee != null && (
          <EconomicsSummaryRow label="Minus station fee" value={-batch.stationFee} />
        )}
        {batch.listingTax != null && (
          <EconomicsSummaryRow label="Minus listing tax" value={-batch.listingTax} />
        )}
        <EconomicsSummaryRow label="Batch profit (before focus)" value={batch.netBeforeFocus} />
        {batch.recipe.focusCost > 0 && (
          <EconomicsSummaryRow
            label="Profit per 10,000 focus"
            value={batch.profitPerTenThousandFocus}
            emphasis
          />
        )}
      </div>
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
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SliderField
          id="station-fee"
          label="Station fee (% of output)"
          value={defaults.stationFeeRate}
          min={0.02}
          max={0.08}
          step={0.005}
          format={(v) => formatPercent(v)}
          onChange={(v) => onChange({ ...defaults, stationFeeRate: v })}
        />
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
        <SliderField
          id="sell-rate"
          label="Sell-through rate (pots/hr at list)"
          value={defaults.sellThroughPotsPerHour}
          min={100}
          max={800}
          step={25}
          format={(v) => `${v} pots/hr`}
          onChange={(v) => onChange({ ...defaults, sellThroughPotsPerHour: v })}
        />
        <SliderField
          id="batch-time"
          label="Minutes per batch action"
          value={defaults.minutesPerBatch}
          min={0.25}
          max={1}
          step={0.05}
          format={(v) => `${v.toFixed(2)} min`}
          onChange={(v) => onChange({ ...defaults, minutesPerBatch: v })}
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
