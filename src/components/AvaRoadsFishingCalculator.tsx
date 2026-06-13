"use client";

import { useMemo, useState } from "react";
import { EquipmentPanel } from "@/components/EquipmentPanel";
import { useMarketCity, useEffectiveMarketCity } from "@/components/MarketCityProvider";
import type { MarketCityId } from "@/lib/market-cities";
import {
  EconomicsSummaryRow,
  EconomicsTable,
} from "@/components/EconomicsTable";
import {
  AVA_ROADS_PRESETS,
  AVA_ROADS_SNAPPER_META,
  type AvaRoadsPresetId,
  type AvaRoadsSnapperViewId,
} from "@/data/ava-roads-economics";
import { loadoutVariantForTier } from "@/data/guide-loadouts";
import { listingTaxRowLabel } from "@/lib/listing-tax";
import {
  computeAvaRoadsEconomics,
  computeAvaRoadsProfitRange,
} from "@/lib/ava-roads-economics";
import {
  computeLoadoutPricing,
  deserializePriceMap,
  enrichLoadoutWithQuantities,
  pickSerializedPrices,
} from "@/lib/guide-economics";
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

interface AvaRoadsFishingCalculatorProps {
  economics: GuideEconomics;
  pricesByCity: SerializedPricesByCity;
  pricedAt: string;
  tierLoadouts: TierLoadoutBundle[];
  defaultMarketCity?: MarketCityId;
}

export function AvaRoadsFishingCalculator({
  economics,
  pricesByCity,
  pricedAt,
  tierLoadouts,
  defaultMarketCity,
}: AvaRoadsFishingCalculatorProps) {
  const { listingTaxRate, premiumSeller, gatheringYieldMultiplier } =
    useMarketCity();
  const effectiveCity = useEffectiveMarketCity(defaultMarketCity);
  const prices = pickSerializedPrices(pricesByCity, effectiveCity);
  const [presetId, setPresetId] = useState<AvaRoadsPresetId>("normal");
  const [snapperViewId, setSnapperViewId] =
    useState<AvaRoadsSnapperViewId>("expected");

  const preset = AVA_ROADS_PRESETS.find((p) => p.id === presetId) ?? AVA_ROADS_PRESETS[1];
  const tier =
    economics.skillTiers.find((t) => t.id === preset.tierId) ??
    economics.skillTiers[0];

  const priceMap = useMemo(() => deserializePriceMap(prices), [prices]);

  const result = useMemo(
    () =>
      computeAvaRoadsEconomics(priceMap, {
        presetId,
        snapperViewId,
      }, listingTaxRate, gatheringYieldMultiplier),
    [priceMap, presetId, snapperViewId, listingTaxRate, gatheringYieldMultiplier],
  );

  const profitRange = useMemo(
    () => computeAvaRoadsProfitRange(priceMap),
    [priceMap],
  );

  const activeLoadout = useMemo(() => {
    const bundle = tierLoadouts.find((b) => b.tierId === preset.tierId);
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
  }, [economics, preset.tierId, tier, tierLoadouts, priceMap]);

  const formattedAt = new Date(pricedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const { deathBreakdown: death } = result;

  return (
    <>
      <div className="wiki-note mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-relaxed text-parchment/75">
        <p className="font-semibold text-rose-200/95">
          Full-loot roads: one death can erase multiple hours of fish
        </p>
        <p className="mt-1">
          Roads fishing depends on finding a good T8 road, school density, escape
          skill, and how much loot you carry before banking. The headline below
          subtracts expected gear loss and{" "}
          <span className="text-parchment/90">
            death probability × fish in your bag
          </span>
          , not just kit replacement.
          {death.maxSingleDeathLoss != null && (
            <>
              {" "}
              A single death with a full bag can cost up to{" "}
              <span className="font-semibold text-rose-200/90">
                {formatSilverPrice(death.maxSingleDeathLoss)}
              </span>
              .
            </>
          )}
        </p>
      </div>

      <div className="profit-hero-panel wiki-note theme-surface mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Realistic take-home / hour ({result.presetLabel})
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {result.netAfterTaxAndDeath != null
                ? formatSilverPrice(result.netAfterTaxAndDeath)
                : "N/A"}
            </p>
            {result.netBeforeDeath != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Before death costs: {formatSilverPrice(result.netBeforeDeath)}/hr
              </p>
            )}
            {death.totalExpectedDeathLoss != null && death.totalExpectedDeathLoss > 0 && (
              <p className="mt-1 text-xs text-rose-300/80">
                Includes ~{formatSilverPrice(death.totalExpectedDeathLoss)}/hr
                expected death loss (gear + carried fish)
              </p>
            )}
            {profitRange.min != null && profitRange.max != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Expected range: {formatSilverRange(profitRange.min, profitRange.max)}/hr
                {"luckyMax" in profitRange && profitRange.luckyMax != null && (
                  <> · Lucky greedy up to {formatSilverPrice(profitRange.luckyMax)}</>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <MetricRow label="Gross output / hr" value={result.grossOutput} />
            <MetricRow
              label="Expected death loss / hr"
              value={death.totalExpectedDeathLoss}
              danger
            />
            <MetricRow
              label="Loot at risk per death (avg bag)"
              value={death.carriedFishValue}
            />
            <MetricRow
              label="Gear replacement / death"
              value={
                death.gearReplacementCost != null && death.deathsPerHour > 0
                  ? Math.round(death.gearReplacementCost / death.deathsPerHour)
                  : null
              }
            />
            <MetricRow
              label="Effective fish / hr (after portal time)"
              value={result.effectiveFishPerHour}
              text
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Playstyle preset
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {AVA_ROADS_PRESETS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={presetId === option.id}
                onSelect={() => setPresetId(option.id)}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">{result.presetDescription}</p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Puremist Snapper (RNG, separate line)
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {(Object.keys(AVA_ROADS_SNAPPER_META) as AvaRoadsSnapperViewId[]).map(
              (id) => (
                <FilterChip
                  key={id}
                  label={AVA_ROADS_SNAPPER_META[id].label}
                  selected={snapperViewId === id}
                  onSelect={() => setSnapperViewId(id)}
                />
              ),
            )}
          </div>
          <p className="mt-2 text-sm text-parchment/55">{result.snapperNote}</p>
          {result.snapperRngValue != null && (
            <p className="mt-1 text-xs text-parchment/45">
              Snapper line this hour: {formatSilverExact(result.snapperRngValue)} silver
            </p>
          )}
        </div>
      </div>

      {activeLoadout && (
        <section className="mt-10">
          <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
            Recommended Gear
          </h2>
          <p className="mt-1 text-sm text-parchment/50">
            Loadout for{" "}
            <span className="text-parchment/70">{result.presetLabel}</span>
          </p>
          <div className="mt-4">
            <EquipmentPanel
              loadout={activeLoadout.loadout}
              variant={loadoutVariantForTier(preset.tierId)}
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
          {result.presetLabel} preset, {result.snapperViewId} Snapper view.
          Estimated snapshot prices. Updated {formattedAt}.
        </p>

        <div className="wiki-table-wrap theme-surface mt-4 rounded-lg border border-parchment/10 bg-slot-bg p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Session assumptions
          </p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <AssumptionRow
              label="Portal / search downtime"
              value={formatPercent(preset.portalSearchDowntime)}
            />
            <AssumptionRow
              label="Effective fish / hr"
              value={String(result.effectiveFishPerHour)}
            />
            <AssumptionRow
              label="Bank every (avg)"
              value={`${death.bankingIntervalMinutes} min`}
            />
            <AssumptionRow
              label="Fish value in bag at death (avg)"
              value={
                death.carriedFishValue != null
                  ? formatSilverExact(death.carriedFishValue)
                  : "N/A"
              }
            />
            <AssumptionRow
              label="Deaths / hour (modeled)"
              value={String(death.deathsPerHour)}
            />
            <AssumptionRow
              label="Max single-death swing"
              value={
                death.maxSingleDeathLoss != null
                  ? formatSilverExact(death.maxSingleDeathLoss)
                  : "N/A"
              }
            />
          </dl>
        </div>

        <EconomicsTable
          title="Base fish output / hour (Sturgeon + chops)"
          lines={result.baseOutputLines}
          total={sumLineTotals(result.baseOutputLines)}
          totalLabel="Base fish gross"
          variant="output"
        />

        {result.snapperLine && (
          <EconomicsTable
            title="Puremist Snapper (RNG, separate from base fish)"
            lines={[result.snapperLine]}
            total={result.snapperLine.lineTotal}
            totalLabel="Snapper gross"
            variant="output"
          />
        )}

        <EconomicsTable
          title="Journal + consumables"
          lines={[
            result.journalLines.full,
            ...result.consumableLines.filter(
              (l) => l.id !== "T7_JOURNAL_FISHING_EMPTY",
            ),
            result.journalLines.empty,
          ]}
          total={result.consumableTotal}
          totalLabel="Net input + consumables"
          variant="input"
        />

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow label="Gross output / hour" value={result.grossOutput} />
          <EconomicsSummaryRow
            label="Minus consumables + empty journal"
            value={
              result.consumableTotal != null ? -result.consumableTotal : null
            }
          />
          <EconomicsSummaryRow
            label={listingTaxRowLabel(premiumSeller)}
            value={
              result.marketTaxTotal != null ? -result.marketTaxTotal : null
            }
          />
          <EconomicsSummaryRow
            label="Net before death costs"
            value={result.netBeforeDeath}
          />
          {death.gearReplacementCost != null && (
            <EconomicsSummaryRow
              label={`Minus gear deaths (${death.deathsPerHour}/hr × kit)`}
              value={-death.gearReplacementCost}
            />
          )}
          {death.carriedFishValue != null && death.deathsPerHour > 0 && (
            <EconomicsSummaryRow
              label={`Minus fish lost on death (${death.deathsPerHour}/hr × ~${formatPercent(death.carriedLootFraction)} bag)`}
              value={-roundDeathFishLoss(death)}
            />
          )}
          <EconomicsSummaryRow
            label="Realistic take-home / hour"
            value={result.netAfterTaxAndDeath}
            emphasis
          />
        </div>

        <p className="mt-3 text-xs text-parchment/40">
          Carried fish value = base fish gross × (bank interval ÷ 60). Expected
          fish loss = deaths/hr × carried fish value. Gear loss = deaths/hr × full
          kit buy price. Portal downtime reduces effective fish/hr before all other
          lines. Snapper is shown separately because it is high-variance RNG.
        </p>
      </section>
    </>
  );
}

function roundDeathFishLoss(
  death: ReturnType<typeof computeAvaRoadsEconomics>["deathBreakdown"],
): number {
  if (death.carriedFishValue == null) return 0;
  return Math.round(death.carriedFishValue * death.deathsPerHour);
}

function sumLineTotals(lines: { lineTotal: number | null }[]): number | null {
  let total = 0;
  let has = false;
  for (const line of lines) {
    if (line.lineTotal == null) continue;
    total += line.lineTotal;
    has = true;
  }
  return has ? total : null;
}

function MetricRow({
  label,
  value,
  text,
  danger,
}: {
  label: string;
  value: number | null;
  text?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${danger ? "text-rose-300/85" : "text-parchment/65"}`}
    >
      <span>{label}</span>
      <span className="font-semibold tabular-nums">
        {value == null
          ? "N/A"
          : text
            ? String(value)
            : formatSilverPrice(value)}
      </span>
    </div>
  );
}

function AssumptionRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-parchment/50">{label}</dt>
      <dd className="tabular-nums text-parchment/80">{value}</dd>
    </>
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
