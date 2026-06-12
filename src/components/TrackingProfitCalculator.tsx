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
  DEFAULT_GROUP_SIZE,
  DEFAULT_TRACKING_RISK,
  MAX_GROUP_SIZE,
  MIN_GROUP_SIZE,
  TRACKING_SCENARIO_META,
  TRACKING_TIER_CONFIGS,
  type TrackingScenarioId,
} from "@/data/tracking-economics";
import {
  computeLoadoutPricing,
  deserializePriceMap,
  enrichLoadoutWithQuantities,
  pickSerializedPrices,
} from "@/lib/guide-economics";
import {
  computeTrackingEconomics,
  computeTrackingProfitRange,
  type TrackingRiskInputs,
} from "@/lib/tracking-economics";
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

interface TrackingProfitCalculatorProps {
  economics: GuideEconomics;
  pricesByCity: SerializedPricesByCity;
  pricedAt: string;
  tierLoadouts: TierLoadoutBundle[];
}

export function TrackingProfitCalculator({
  economics,
  pricesByCity,
  pricedAt,
  tierLoadouts,
}: TrackingProfitCalculatorProps) {
  const { marketCity } = useMarketCity();
  const prices = pickSerializedPrices(pricesByCity, marketCity);
  const [tierId, setTierId] = useState(economics.defaultSkillTierId);
  const [scenarioId, setScenarioId] = useState<TrackingScenarioId>("expected");
  const [groupSize, setGroupSize] = useState(DEFAULT_GROUP_SIZE);
  const [risk, setRisk] = useState<TrackingRiskInputs>(DEFAULT_TRACKING_RISK);

  const tier =
    economics.skillTiers.find((t) => t.id === tierId) ?? economics.skillTiers[0];
  const tierConfig =
    TRACKING_TIER_CONFIGS.find((t) => t.id === tierId) ??
    TRACKING_TIER_CONFIGS[1];

  const priceMap = useMemo(() => deserializePriceMap(prices), [prices]);

  const result = useMemo(
    () =>
      computeTrackingEconomics(priceMap, {
        tierId,
        scenarioId,
        groupSize,
        risk,
      }),
    [priceMap, tierId, scenarioId, groupSize, risk],
  );

  const profitRange = useMemo(
    () => computeTrackingProfitRange(priceMap),
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

  const isLucky = scenarioId === "lucky";

  return (
    <>
      <div className="wiki-note mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-parchment/75">
        <p className="font-semibold text-amber-200/95">
          Tracking income is RNG-heavy
        </p>
        <p className="mt-1">
          Rare remnant drops can make one hour look amazing, but dry streaks are
          normal. Top Roads groups rotate Golem, Dawnbird, Panther, Werewolf, and
          Rare Quarry hunts rather than farming one target. Use{" "}
          <span className="text-parchment/90">Expected</span> profit for planning,{" "}
          <span className="text-parchment/90">Good</span> for clean mixed-rotation
          routes (~700-750k group loot per kill), and{" "}
          <span className="text-parchment/90">Lucky</span> profit only as upside.
        </p>
      </div>

      <div className="profit-hero-panel wiki-note theme-surface mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Net per player / hour ({result.scenarioLabel})
              {isLucky && (
                <span className="ml-2 normal-case text-amber-300/90">
                  upside only
                </span>
              )}
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {result.netPerPlayer != null
                ? formatSilverPrice(result.netPerPlayer)
                : "N/A"}
            </p>
            {result.adjustedNetGroup != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Group total after costs & downtime:{" "}
                {formatSilverPrice(result.adjustedNetGroup)}/hr split across{" "}
                {groupSize} players
              </p>
            )}
            {profitRange.min != null && profitRange.max != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Per player by scenario:{" "}
                {formatSilverRange(profitRange.min, profitRange.max)}/hr
                {"luckyMax" in profitRange && profitRange.luckyMax != null && (
                  <>
                    {" "}
                    · Lucky upside up to{" "}
                    {formatSilverPrice(profitRange.luckyMax)}/player
                  </>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <HeadlineStat
              label="Gross group loot / hr"
              value={result.grossGroupLoot}
            />
            <HeadlineStat
              label="Net group / hr (before split)"
              value={result.adjustedNetGroup}
            />
            <HeadlineStat
              label="Gross per player / hr"
              value={
                result.grossGroupLoot != null
                  ? Math.round(result.grossGroupLoot / groupSize)
                  : null
              }
              muted
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Profit scenario
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Profit scenario"
          >
            {(Object.keys(TRACKING_SCENARIO_META) as TrackingScenarioId[]).map(
              (id) => (
                <FilterChip
                  key={id}
                  label={TRACKING_SCENARIO_META[id].label}
                  selected={scenarioId === id}
                  onSelect={() => setScenarioId(id)}
                />
              ),
            )}
          </div>
          <p className="mt-2 text-sm text-parchment/55">{result.scenarioNote}</p>
        </div>

        {TRACKING_TIER_CONFIGS.length > 1 && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Hunt target
            </p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Hunt target"
            >
              {TRACKING_TIER_CONFIGS.map((option) => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={tierId === option.id}
                  onSelect={() => setTierId(option.id)}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-parchment/55">{tierConfig.description}</p>
          </div>
        )}

        {TRACKING_TIER_CONFIGS.length === 1 && (
          <p className="mt-5 text-sm text-parchment/55">{tierConfig.description}</p>
        )}

        <div className="mt-5">
          <label
            htmlFor="tracking-group-size"
            className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40"
          >
            Group size ({groupSize} players)
          </label>
          <input
            id="tracking-group-size"
            type="range"
            min={MIN_GROUP_SIZE}
            max={MAX_GROUP_SIZE}
            value={groupSize}
            onChange={(e) => setGroupSize(Number(e.target.value))}
            className="mt-2 w-full max-w-md accent-gold"
          />
          <p className="mt-1 text-xs text-parchment/45">
            All loot values below are group totals unless labeled per player.
            Per-player profit = adjusted net group profit ÷ {groupSize}.
          </p>
        </div>
      </div>

      {activeLoadout && (
        <section className="mt-10">
          <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
            Recommended Gear
          </h2>
          <p className="mt-1 text-sm text-parchment/50">
            Avalonian Roads group tracking loadout.
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
          Modeled for a {groupSize}-player group at{" "}
          <span className="text-parchment/70">{tierConfig.label}</span>,{" "}
          <span className="text-parchment/70">{result.scenarioLabel}</span>{" "}
          scenario. Average material loot is calibrated to a reference session
          (~4.95M per player, ~19.8M group in 3.6 hours, ~22 kills). Estimated
          snapshot prices. Updated {formattedAt}.
        </p>

        <div className="wiki-table-wrap theme-surface mt-4 rounded-lg border border-parchment/10 bg-slot-bg p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Reference session ({result.scenarioLabel})
          </p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <AssumptionRow
              label="Reference per player loot"
              value={formatSilverExact(result.remnantAssumptions.referencePerPlayerLoot)}
            />
            <AssumptionRow
              label="Reference group loot (4-man)"
              value={formatSilverExact(result.remnantAssumptions.referenceGroupLoot)}
            />
            <AssumptionRow
              label="Reference active hours"
              value={String(result.remnantAssumptions.referenceHours)}
            />
            <AssumptionRow
              label="Reference kills (sample)"
              value={String(result.remnantAssumptions.referenceKills)}
            />
            <AssumptionRow
              label="Kills per hour (group)"
              value={result.remnantAssumptions.killsPerHour.toFixed(2)}
            />
            <AssumptionRow
              label="Reference hourly gross (group)"
              value={formatSilverExact(result.remnantAssumptions.referenceHourlyGross)}
            />
            <AssumptionRow
              label="Reference hourly gross (per player)"
              value={formatSilverExact(
                result.remnantAssumptions.referencePerPlayerHourlyGross,
              )}
            />
            <AssumptionRow
              label="Loot quantity scale (Expected)"
              value={result.remnantAssumptions.lootQuantityScale.toFixed(3)}
            />
          </dl>
          <p className="mt-3 text-xs text-parchment/40">
            Expected scenario scales loot quantities so hourly gross matches the
            reference session at current estimated prices. Good and Lucky apply
            higher pace or loot multipliers on top. Shapeshifter remnants are
            averaged into the loot table, not rolled twice.
          </p>
        </div>

        <EconomicsTable
          title="Group loot / hour (sell value)"
          lines={result.outputLines}
          total={result.grossGroupLoot}
          totalLabel="Gross group loot"
          variant="output"
        />

        <EconomicsTable
          title="Group costs / hour"
          lines={result.consumableLines}
          total={result.consumableTotal}
          totalLabel="Consumables + toolkit wear"
          variant="input"
        />

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow
            label="Gross group loot / hour"
            value={result.grossGroupLoot}
          />
          {result.consumableTotal != null && (
            <EconomicsSummaryRow
              label="Minus consumables (all players + toolkit)"
              value={-result.consumableTotal}
            />
          )}
          {result.marketTaxTotal != null && (
            <EconomicsSummaryRow
              label="Minus Premium listing tax (~6.5%)"
              value={-result.marketTaxTotal}
            />
          )}
          <EconomicsSummaryRow
            label="Minus repairs (modeled)"
            value={-result.repairCostTotal}
          />
          <EconomicsSummaryRow
            label="Minus expected death loss (modeled)"
            value={-result.deathLossTotal}
          />
          <EconomicsSummaryRow
            label="Net group / hour (before downtime)"
            value={result.netGroupBeforeRisk}
          />
          <EconomicsSummaryRow
            label={`Adjusted net group (×${((1 - risk.downtimePercent) * (1 - risk.failedHuntPercent)).toFixed(2)} uptime)`}
            value={result.adjustedNetGroup}
          />
          <EconomicsSummaryRow
            label={`Net per player (÷ ${groupSize})`}
            value={result.netPerPlayer}
            emphasis
          />
        </div>

        <RiskAssumptionsPanel risk={risk} onChange={setRisk} />

        <p className="mt-3 text-xs text-parchment/40">
          Group loot is split across {groupSize} players in this model (equal
          split). Tax applies to gross sell value. Repairs and deaths are
          modeled per player then summed. Downtime and failed hunts reduce
          effective uptime; they are not double-counted with consumables.
        </p>
      </section>
    </>
  );
}

function HeadlineStat({
  label,
  value,
  muted,
}: {
  label: string;
  value: number | null;
  muted?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-4 ${muted ? "text-parchment/45" : "text-parchment/65"}`}>
      <span>{label}</span>
      <span className="font-semibold tabular-nums">
        {value != null ? formatSilverPrice(value) : "N/A"}
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

function RiskAssumptionsPanel({
  risk,
  onChange,
}: {
  risk: TrackingRiskInputs;
  onChange: (risk: TrackingRiskInputs) => void;
}) {
  return (
    <div className="mt-5 rounded-lg border border-parchment/10 bg-slot-bg p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
        Downtime & risk assumptions (conservative defaults)
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <RiskSlider
          id="downtime"
          label="Travel / banking downtime"
          value={risk.downtimePercent}
          min={0}
          max={0.35}
          step={0.01}
          format={(v) => formatPercent(v)}
          onChange={(v) => onChange({ ...risk, downtimePercent: v })}
        />
        <RiskSlider
          id="failed-hunt"
          label="Failed / escaped hunts"
          value={risk.failedHuntPercent}
          min={0}
          max={0.3}
          step={0.01}
          format={(v) => formatPercent(v)}
          onChange={(v) => onChange({ ...risk, failedHuntPercent: v })}
        />
        <RiskSlider
          id="repair"
          label="Repair cost per player / hr"
          value={risk.repairCostPerPlayerHour}
          min={0}
          max={80_000}
          step={1_000}
          format={(v) => formatSilverPrice(v)}
          onChange={(v) => onChange({ ...risk, repairCostPerPlayerHour: v })}
        />
        <RiskSlider
          id="death-prob"
          label="Death probability per player / hr"
          value={risk.deathProbabilityPerPlayerHour}
          min={0}
          max={0.15}
          step={0.005}
          format={(v) => formatPercent(v)}
          onChange={(v) =>
            onChange({ ...risk, deathProbabilityPerPlayerHour: v })
          }
        />
      </div>
    </div>
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
