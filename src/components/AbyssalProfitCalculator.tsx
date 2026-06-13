"use client";

import { useEffect, useMemo, useState } from "react";
import { EquipmentPanel } from "@/components/EquipmentPanel";
import { useMarketCity, useGuidePriceMap } from "@/components/MarketCityProvider";
import type { MarketCityId } from "@/lib/market-cities";
import {
  EconomicsSummaryRow,
  EconomicsTable,
} from "@/components/EconomicsTable";
import {
  ABYSSAL_RUN_DURATIONS,
  ABYSSAL_SCENARIOS,
  ABYSSAL_TEAM_META,
  ABYSSAL_WIN_RATE_BOUNDS,
  DEFAULT_ABYSSAL_RUN_DURATION,
  getAbyssalScenario,
  type AbyssalRunDurationMinutes,
  type AbyssalScenarioId,
  type AbyssalTeamSizeId,
} from "@/data/abyssal-economics";
import { loadoutVariantForTier } from "@/data/guide-loadouts";
import { listingTaxRowLabel } from "@/lib/listing-tax";
import {
  computeAbyssalEconomics,
  computeAbyssalProfitRange,
} from "@/lib/abyssal-economics";
import { computeLoadoutPricing, enrichLoadoutWithQuantities } from "@/lib/guide-economics";
import type {
  GuideEconomics,
  GuideMarketPrices,
  TierLoadoutBundle,
} from "@/types/guide";
import {
  formatPercent,
  formatSilverExact,
  formatSilverPrice,
  formatSilverRange,
} from "@/lib/format";

interface AbyssalProfitCalculatorProps {
  economics: GuideEconomics;
  guidePrices: GuideMarketPrices;
  pricedAt: string;
  tierLoadouts: TierLoadoutBundle[];
  defaultMarketCity?: MarketCityId;
}

export function AbyssalProfitCalculator({
  economics,
  guidePrices,
  pricedAt,
  tierLoadouts,
  defaultMarketCity,
}: AbyssalProfitCalculatorProps) {
  const { listingTaxRate, premiumSeller, useLivePrices } = useMarketCity();
  const { priceMap, mapKind, serializedPrices } = useGuidePriceMap(
    guidePrices,
    defaultMarketCity,
  );
  const [scenarioId, setScenarioId] = useState<AbyssalScenarioId>("floor2");
  const [teamSizeId, setTeamSizeId] = useState<AbyssalTeamSizeId>("duo");
  const [runDurationMinutes, setRunDurationMinutes] =
    useState<AbyssalRunDurationMinutes>(DEFAULT_ABYSSAL_RUN_DURATION);
  const [winRate, setWinRate] = useState(
    getAbyssalScenario("floor2").defaultWinRate,
  );
  const [includePvpLoot, setIncludePvpLoot] = useState(false);
  const [includeMercJournal, setIncludeMercJournal] = useState(false);

  const scenario = getAbyssalScenario(scenarioId);

  useEffect(() => {
    setWinRate(scenario.defaultWinRate);
    setIncludePvpLoot(scenario.includePvpByDefault);
  }, [scenario.defaultWinRate, scenario.includePvpByDefault, scenarioId]);

  const result = useMemo(
    () =>
      computeAbyssalEconomics(priceMap, {
        scenarioId,
        teamSizeId,
        winRate,
        runDurationMinutes,
        includePvpLoot,
        includeMercJournal,
        priceMapKind: mapKind,
      }, listingTaxRate),
    [
      priceMap,
      scenarioId,
      teamSizeId,
      winRate,
      runDurationMinutes,
      includePvpLoot,
      includeMercJournal,
      listingTaxRate,
      mapKind,
    ],
  );

  const profitRange = useMemo(
    () => computeAbyssalProfitRange(priceMap),
    [priceMap],
  );

  const activeLoadout = useMemo(() => {
    const bundle = tierLoadouts.find((b) => b.tierId === scenario.tierId);
    if (!bundle) return undefined;
    const tier =
      economics.skillTiers.find((t) => t.id === scenario.tierId) ??
      economics.skillTiers[0];
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
  }, [economics, scenario.tierId, tierLoadouts, priceMap]);

  const formattedAt = new Date(pricedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const { deathBreakdown: death } = result;
  const loadoutKitCost = activeLoadout?.pricing?.gearTotal ?? null;

  return (
    <>
      <div className="wiki-note mt-6 rounded-xl border border-sky-500/25 bg-sky-500/10 p-4 text-sm leading-relaxed text-parchment/75">
        <p className="font-semibold text-sky-200/95">
          Gear stays equipped on death. Only bag loot is at risk.
        </p>
        <p className="mt-1">
          The Depths use orange-zone rules: your kit locks in when you enter and
          does not drop on death. The loadout panel shows full replacement cost
          {loadoutKitCost != null && (
            <>
              {" "}
              (about{" "}
              <span className="font-semibold text-sky-200/90">
                {formatSilverPrice(loadoutKitCost)}
              </span>
              {" "}
              for this tab)
            </>
          )}
          , but that is not a per-death expense. Profit is driven by extract
          timing, queue time, win rate, and how much loot you carry in your bag.
          A Master&apos;s Astral Staff (.4) is for clear speed and Fame Bonus
          under the 1200 IP softcap, not because you lose 9M silver when you
          wipe.
        </p>
      </div>

      {death.avgBagLootAtDeath != null && death.deathsPerHour > 0 && (
        <div className="wiki-note mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-relaxed text-parchment/75">
          <p className="font-semibold text-rose-200/95">
            Inventory-only death risk
          </p>
          <p className="mt-1">
            Modeled bag loss is death probability × average loot in your bag, not
            gear replacement. At this preset, expected bag loss is about{" "}
            <span className="font-semibold text-rose-200/90">
              {formatSilverPrice(death.expectedBagLossPerHour ?? 0)}/hr
            </span>
            {death.avgBagLootAtDeath != null && (
              <>
                {" "}
                (avg{" "}
                {formatSilverPrice(death.avgBagLootAtDeath)} in bag when you
                die).
              </>
            )}
          </p>
        </div>
      )}

      <div className="profit-hero-panel wiki-note theme-surface mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Realistic take-home / hour ({result.scenarioLabel})
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {result.netAfterTaxAndDeath != null
                ? formatSilverPrice(result.netAfterTaxAndDeath)
                : "N/A"}
            </p>
            {result.netBeforeDeath != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Before bag death loss: {formatSilverPrice(result.netBeforeDeath)}
                /hr
              </p>
            )}
            {death.expectedBagLossPerHour != null &&
              death.expectedBagLossPerHour > 0 && (
                <p className="mt-1 text-xs text-rose-300/80">
                  Includes ~{formatSilverPrice(death.expectedBagLossPerHour)}/hr
                  expected bag loot lost on death
                </p>
              )}
            {profitRange.min != null && profitRange.max != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Typical range: {formatSilverRange(profitRange.min, profitRange.max)}
                /hr
                {"highRoll" in profitRange && profitRange.highRoll != null && (
                  <>
                    {" "}
                    · Floor-3 high-roll up to{" "}
                    {formatSilverPrice(profitRange.highRoll)}
                  </>
                )}
              </p>
            )}
            {result.highVariance && (
              <p className="mt-2 text-xs text-amber-300/80">
                High-variance preset: many runs reset or wipe before vault payout.
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <MetricRow
              label="Runs / hour (run + queue)"
              value={result.runsPerHour}
              text
            />
            <MetricRow
              label="Win rate (effective)"
              value={result.effectiveWinRate}
              percent
            />
            <MetricRow
              label="Gross / successful run"
              value={result.grossPerSuccessfulRun}
            />
            <MetricRow
              label="Expected bag loot lost / hr"
              value={death.expectedBagLossPerHour}
              danger
            />
            <MetricRow
              label="Run duration + queue"
              value={null}
              textValue={`${result.runDurationMinutes} + ${result.queueMinutes} min`}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Extract scenario
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {ABYSSAL_SCENARIOS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={scenarioId === option.id}
                onSelect={() => setScenarioId(option.id)}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            {result.scenarioDescription}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Team size
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {(Object.keys(ABYSSAL_TEAM_META) as AbyssalTeamSizeId[]).map(
              (id) => (
                <FilterChip
                  key={id}
                  label={ABYSSAL_TEAM_META[id].label}
                  selected={teamSizeId === id}
                  onSelect={() => setTeamSizeId(id)}
                />
              ),
            )}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            {ABYSSAL_TEAM_META[teamSizeId].description}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Run duration (in-instance)
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {ABYSSAL_RUN_DURATIONS.map((minutes) => (
              <FilterChip
                key={minutes}
                label={`${minutes} min`}
                selected={runDurationMinutes === minutes}
                onSelect={() => setRunDurationMinutes(minutes)}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            Silver/hr scales with how long each run takes plus queue time (
            {result.queueMinutes} min modeled for {result.teamLabel}).
          </p>
        </div>

        <div className="mt-5 rounded-lg border border-parchment/10 bg-slot-bg p-4">
          <RiskSlider
            id="abyssal-win-rate"
            label="Win rate (successful extract or reset avoided)"
            value={winRate}
            min={ABYSSAL_WIN_RATE_BOUNDS.min}
            max={ABYSSAL_WIN_RATE_BOUNDS.max}
            step={ABYSSAL_WIN_RATE_BOUNDS.step}
            format={(v) => formatPercent(v)}
            onChange={setWinRate}
          />
          <p className="mt-2 text-xs text-parchment/40">
            Effective win rate after team modifier:{" "}
            {formatPercent(result.effectiveWinRate)}. Failed runs modeled as
            zero loot.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-4">
          <ToggleRow
            id="pvp-loot"
            label="Include PvP kill loot EV"
            checked={includePvpLoot}
            onChange={setIncludePvpLoot}
            hint="Altar souls, player kills, greed chests. Off for pure PvE extracts."
          />
          {scenarioId === "floor3Vault" && (
            <ToggleRow
              id="merc-journal"
              label="Fill T8 mercenary journals (floor 3)"
              checked={includeMercJournal}
              onChange={setIncludeMercJournal}
              hint="~300k per 15 filled; lost only if you die with journals in bag."
            />
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
            <span className="text-parchment/70">{result.scenarioLabel}</span>.
            Kit cost is informational; only bag loot drops on death.
          </p>
          <div className="mt-4">
            <EquipmentPanel
              loadout={activeLoadout.loadout}
              variant={loadoutVariantForTier(scenario.tierId)}
              pricing={activeLoadout.pricing}
              prices={serializedPrices}
            />
          </div>
        </section>
      )}

      <section className="theme-surface mt-10 rounded-xl border border-gold/20 bg-obsidian-light p-6">
        <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
          Profit breakdown
        </h2>
        <p className="mt-2 text-sm text-parchment/50">
          {result.scenarioLabel}, {result.teamLabel}, {runDurationMinutes} min
          run,{" "}
          {useLivePrices
            ? "live royal market prices (Albion Online Data)."
            : "site snapshot averages."}{" "}
          Updated {formattedAt}.
        </p>

        <div className="wiki-table-wrap theme-surface mt-4 rounded-lg border border-parchment/10 bg-slot-bg p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Session assumptions
          </p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <AssumptionRow
              label="Runs per hour"
              value={String(result.runsPerHour)}
            />
            <AssumptionRow
              label="Win rate (slider × team)"
              value={formatPercent(result.effectiveWinRate)}
            />
            <AssumptionRow
              label="Deaths per run (modeled)"
              value={death.deathsPerRun.toFixed(2)}
            />
            <AssumptionRow
              label="Bag fill at death (avg)"
              value={formatPercent(death.bagFillAtDeath)}
            />
            <AssumptionRow
              label="Loot in bag when you die"
              value={
                death.avgBagLootAtDeath != null
                  ? formatSilverExact(death.avgBagLootAtDeath)
                  : "N/A"
              }
            />
            <AssumptionRow
              label="Gross on a winning run"
              value={
                result.grossPerSuccessfulRun != null
                  ? formatSilverExact(result.grossPerSuccessfulRun)
                  : "N/A"
              }
            />
          </dl>
        </div>

        <EconomicsTable
          title="PvE extract loot / successful run"
          lines={result.pveOutputLines}
          total={sumLineTotals(result.pveOutputLines)}
          totalLabel="PvE gross per run"
          variant="output"
        />

        {result.pvpOutputLines.length > 0 && (
          <EconomicsTable
            title="PvP kill loot EV / successful run (optional)"
            lines={result.pvpOutputLines}
            total={sumLineTotals(result.pvpOutputLines)}
            totalLabel="PvP gross per run"
            variant="output"
          />
        )}

        <EconomicsTable
          title="Consumables per run (scaled to duration)"
          lines={result.consumableLines}
          total={sumLineTotals(result.consumableLines)}
          totalLabel="Consumables per run"
          variant="input"
        />

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow
            label="Expected gross / hour (× win rate × runs)"
            value={result.expectedGrossPerHour}
          />
          <EconomicsSummaryRow
            label="Minus consumables / hour"
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
            label="Net before bag death loss"
            value={result.netBeforeDeath}
          />
          <EconomicsSummaryRow
            label={`Minus bag loot lost (${death.deathsPerHour.toFixed(2)} deaths/hr)`}
            value={
              death.expectedBagLossPerHour != null
                ? -death.expectedBagLossPerHour
                : null
            }
          />
          <EconomicsSummaryRow
            label="Realistic take-home / hour"
            value={result.netAfterTaxAndDeath}
            emphasis
          />
        </div>

        <p className="mt-3 text-xs text-parchment/40">
          Hourly profit = successful-run loot × effective win rate × runs per
          hour, minus tax, consumables, and expected bag loss. Gear replacement
          is excluded because equipped items do not drop. PvP loot is optional
          EV, not a stable hourly floor.
        </p>
      </section>
    </>
  );
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
  textValue,
  percent,
  danger,
}: {
  label: string;
  value: number | null;
  text?: boolean;
  textValue?: string;
  percent?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${danger ? "text-rose-300/85" : "text-parchment/65"}`}
    >
      <span>{label}</span>
      <span className="font-semibold tabular-nums">
        {textValue ??
          (value == null
            ? "N/A"
            : text
              ? String(value)
              : percent
                ? formatPercent(value)
                : formatSilverPrice(value))}
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

function RiskSlider({
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
  format: (value: number) => string;
  onChange: (value: number) => void;
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

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-gold"
      />
      <span>
        <span className="text-parchment/75">{label}</span>
        <span className="mt-0.5 block text-xs text-parchment/40">{hint}</span>
      </span>
    </label>
  );
}
