"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMarketCity, useGuidePriceMap } from "@/components/MarketCityProvider";
import {
  AVERAGE_MARKET_CITY_ID,
  getMarketCityLabel,
  type MarketCityId,
} from "@/lib/market-cities";
import {
  EconomicsSummaryRow,
  EconomicsTable,
} from "@/components/EconomicsTable";
import {
  DEFAULT_REFINING_DEFAULTS,
  DEFAULT_REFINING_ENCHANT,
  DEFAULT_REFINING_FOCUS_EFFICIENCY,
  DEFAULT_REFINING_RESOURCE_ID,
  DEFAULT_REFINING_TIER,
  REFINING_ENCHANT_META,
  REFINING_ENCHANTS,
  REFINING_FOCUS_COST_NOTE,
  REFINING_FOCUS_EFFICIENCY,
  REFINING_RAW_PER_CRAFT,
  REFINING_RESOURCES,
  REFINING_RETURN_RATES,
  REFINING_TIERS,
  defaultReturnRateForFocus,
  getRefiningResource,
  refiningFocusCost,
  resolveRefiningItem,
  type RefiningEnchant,
  type RefiningFocusEfficiencyId,
  type RefiningResourceId,
  type RefiningTier,
} from "@/data/refining-economics";
import { listingTaxRowLabel } from "@/lib/listing-tax";
import {
  computeRefiningEconomics,
  computeRefiningProfitRange,
  type RefiningFocusMode,
} from "@/lib/refining-economics";
import type { GuideEconomics, GuideMarketPrices } from "@/types/guide";
import {
  formatItemQuantity,
  formatSilverExact,
  formatSilverPrice,
  formatSilverRange,
} from "@/lib/format";

interface RefiningProfitCalculatorProps {
  economics: GuideEconomics;
  guidePrices: GuideMarketPrices;
  pricedAt: string;
  defaultMarketCity?: MarketCityId;
}

const FOCUS_MODE_META: Record<
  RefiningFocusMode,
  { label: string; note: string }
> = {
  "with-focus": {
    label: "With focus",
    note: "Spend focus on each craft. Measure profit per 10,000 focus.",
  },
  "without-focus": {
    label: "Without focus",
    note: "No focus spent. Measure profit per single craft.",
  },
};

type PriceInputMode = "market" | "custom";

function parseSilverInput(value: string): number | null {
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed);
}

export function RefiningProfitCalculator({
  guidePrices,
  pricedAt,
  defaultMarketCity,
}: RefiningProfitCalculatorProps) {
  const { listingTaxRate, premiumSeller, useLivePrices, marketCity } =
    useMarketCity();
  const { priceMap, mapKind, effectiveCity } = useGuidePriceMap(
    guidePrices,
    defaultMarketCity,
  );

  const [resourceId, setResourceId] = useState<RefiningResourceId>(
    DEFAULT_REFINING_RESOURCE_ID,
  );
  const [tier, setTier] = useState<RefiningTier>(DEFAULT_REFINING_TIER);
  const [enchant, setEnchant] = useState<RefiningEnchant>(
    DEFAULT_REFINING_ENCHANT,
  );
  const [focusMode, setFocusMode] = useState<RefiningFocusMode>("with-focus");
  const [focusEfficiencyId, setFocusEfficiencyId] =
    useState<RefiningFocusEfficiencyId>(DEFAULT_REFINING_FOCUS_EFFICIENCY);
  const [defaults, setDefaults] = useState(DEFAULT_REFINING_DEFAULTS);
  const [rrrTouched, setRrrTouched] = useState(false);
  const [craftCountInput, setCraftCountInput] = useState("1");
  const [priceInputMode, setPriceInputMode] = useState<PriceInputMode>("market");
  const [customRawPrice, setCustomRawPrice] = useState("");
  const [customLowerPrice, setCustomLowerPrice] = useState("");
  const [customOutputPrice, setCustomOutputPrice] = useState("");
  const craftCount = Math.max(
    1,
    Math.floor(Number(craftCountInput)) || 1,
  );

  const family = getRefiningResource(resourceId);
  const lowerTier = (tier - 1) as 3 | 4 | 5 | 6 | 7;
  const rawItem = resolveRefiningItem(family.rawByTier[tier], enchant, tier);
  const lowerItem = resolveRefiningItem(
    family.refinedByTier[lowerTier],
    enchant,
    lowerTier,
  );
  const outputItem = resolveRefiningItem(
    family.refinedByTier[tier],
    enchant,
    tier,
  );
  const outputName = outputItem.name;
  const recipeKey = `${resourceId}-${tier}-${enchant}`;
  const lastSeededRecipeKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (rrrTouched) return;
    setDefaults((prev) => ({
      ...prev,
      materialReturnRate: defaultReturnRateForFocus(
        focusMode === "with-focus",
        true,
      ),
    }));
  }, [focusMode, rrrTouched]);

  const marketResult = useMemo(
    () =>
      computeRefiningEconomics(
        priceMap,
        {
          resourceId,
          tier,
          enchant,
          focusMode,
          focusEfficiencyId,
          defaults,
          craftCount,
          priceMapKind: mapKind,
        },
        listingTaxRate,
      ),
    [
      priceMap,
      resourceId,
      tier,
      enchant,
      focusMode,
      focusEfficiencyId,
      defaults,
      craftCount,
      listingTaxRate,
      mapKind,
    ],
  );

  useEffect(() => {
    if (priceInputMode !== "custom") return;
    if (lastSeededRecipeKeyRef.current === recipeKey) return;

    const { craft } = marketResult;
    setCustomRawPrice(
      craft.rawLine.unitPrice != null ? String(craft.rawLine.unitPrice) : "",
    );
    setCustomLowerPrice(
      craft.lowerRefinedLine.unitPrice != null
        ? String(craft.lowerRefinedLine.unitPrice)
        : "",
    );
    setCustomOutputPrice(
      craft.outputLine.unitPrice != null
        ? String(craft.outputLine.unitPrice)
        : "",
    );
    lastSeededRecipeKeyRef.current = recipeKey;
  }, [recipeKey, priceInputMode, marketResult]);

  const unitPriceOverrides = useMemo(() => {
    if (priceInputMode !== "custom") return undefined;
    const overrides: Record<string, number> = {};
    const raw = parseSilverInput(customRawPrice);
    const lower = parseSilverInput(customLowerPrice);
    const output = parseSilverInput(customOutputPrice);
    if (raw != null) overrides[rawItem.id] = raw;
    if (lower != null) overrides[lowerItem.id] = lower;
    if (output != null) overrides[outputItem.id] = output;
    return Object.keys(overrides).length > 0 ? overrides : undefined;
  }, [
    priceInputMode,
    customRawPrice,
    customLowerPrice,
    customOutputPrice,
    rawItem.id,
    lowerItem.id,
    outputItem.id,
  ]);

  const result = useMemo(
    () =>
      computeRefiningEconomics(
        priceMap,
        {
          resourceId,
          tier,
          enchant,
          focusMode,
          focusEfficiencyId,
          defaults,
          craftCount,
          priceMapKind: mapKind,
          unitPriceOverrides,
        },
        listingTaxRate,
      ),
    [
      priceMap,
      resourceId,
      tier,
      enchant,
      focusMode,
      focusEfficiencyId,
      defaults,
      craftCount,
      listingTaxRate,
      mapKind,
      unitPriceOverrides,
    ],
  );

  const profitRange = useMemo(
    () => computeRefiningProfitRange(priceMap, listingTaxRate, mapKind),
    [priceMap, listingTaxRate, mapKind],
  );

  const craft = result.craft;
  const usesFocusMetric =
    focusMode === "with-focus" && craft.focusPointsPerCraft > 0;
  const heroProfit = usesFocusMetric
    ? result.profitPerTenThousandFocus
    : craft.netBatch;

  const formattedAt = new Date(pricedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const focusMeta = FOCUS_MODE_META[focusMode];
  const efficiencyMeta = REFINING_FOCUS_EFFICIENCY[focusEfficiencyId];
  const rawQty = REFINING_RAW_PER_CRAFT[tier];
  const previewFocus =
    focusMode === "with-focus"
      ? refiningFocusCost(tier, focusEfficiencyId, enchant)
      : 0;

  function resetCustomPricesFromMarket() {
    const { craft } = marketResult;
    setCustomRawPrice(
      craft.rawLine.unitPrice != null ? String(craft.rawLine.unitPrice) : "",
    );
    setCustomLowerPrice(
      craft.lowerRefinedLine.unitPrice != null
        ? String(craft.lowerRefinedLine.unitPrice)
        : "",
    );
    setCustomOutputPrice(
      craft.outputLine.unitPrice != null
        ? String(craft.outputLine.unitPrice)
        : "",
    );
  }

  return (
    <>
      <div className="wiki-note mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-parchment/75">
        <p className="font-semibold text-amber-200/95">
          Refining is measured per 10,000 focus when you spend focus
        </p>
        <p className="mt-1">
          Refine in the bonus city for the best resource return rate: Thetford
          (bars), Fort Sterling (planks), Lymhurst (cloth), Martlock (leather).
          Each craft needs {rawQty} raw + 1 lower-tier refined for T{tier}.{" "}
          {REFINING_FOCUS_COST_NOTE}
        </p>
      </div>

      <div className="profit-hero-panel wiki-note theme-surface mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Resource
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Refining resource"
          >
            {REFINING_RESOURCES.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={resourceId === option.id}
                onSelect={() => {
                  setResourceId(option.id);
                  setRrrTouched(false);
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            {family.station} in {family.bonusCity} for the local production
            bonus. RRR assumes bonus-city refining. Header city picks which
            market prices load
            {useLivePrices && marketCity === AVERAGE_MARKET_CITY_ID
              ? " (select a royal city for live quotes)."
              : "."}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Tier
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Refining tier"
          >
            {REFINING_TIERS.map((option) => (
              <FilterChip
                key={option}
                label={`T${option}`}
                selected={tier === option}
                onSelect={() => setTier(option)}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Enchant
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Resource enchant"
          >
            {REFINING_ENCHANTS.map((option) => (
              <FilterChip
                key={option}
                label={REFINING_ENCHANT_META[option].label}
                selected={enchant === option}
                onSelect={() => setEnchant(option)}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-parchment/55">
            Raw and lower-tier refined must match the same enchant when T4+.
            T3 refined (e.g. Thick Leather) is always flat. Focus cost rises
            with uncommon / rare / exceptional / pristine. Live prices for .1–.4
            scale from flat sell orders when enchanted quotes are missing.
          </p>
        </div>

        <div className="mt-5">
          <label className="block text-sm text-parchment/60">
            Quantity to refine ({outputName})
            <input
              type="number"
              min={1}
              step={1}
              value={craftCountInput}
              onChange={(e) => setCraftCountInput(e.target.value)}
              onBlur={() => {
                if (!craftCountInput.trim() || Number(craftCountInput) < 1) {
                  setCraftCountInput("1");
                } else {
                  setCraftCountInput(String(craftCount));
                }
              }}
              className="mt-1 w-full max-w-xs rounded-md border border-gold/20 bg-obsidian px-3 py-2 text-parchment tabular-nums"
              aria-label={`Quantity of ${outputName} to refine`}
            />
            <span className="mt-1 block text-xs text-parchment/40">
              Scales materials, returns, fees, and batch profit. Focus efficiency
              and /10k focus stay per craft.
            </span>
          </label>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Focus
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Focus mode"
          >
            {(Object.keys(FOCUS_MODE_META) as RefiningFocusMode[]).map(
              (mode) => (
                <FilterChip
                  key={mode}
                  label={FOCUS_MODE_META[mode].label}
                  selected={focusMode === mode}
                  onSelect={() => {
                    setFocusMode(mode);
                    setRrrTouched(false);
                  }}
                />
              ),
            )}
          </div>
          <p className="mt-2 text-sm text-parchment/55">{focusMeta.note}</p>
        </div>

        {focusMode === "with-focus" && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Focus efficiency
            </p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Focus efficiency"
            >
              {(
                Object.keys(
                  REFINING_FOCUS_EFFICIENCY,
                ) as RefiningFocusEfficiencyId[]
              ).map((id) => (
                <FilterChip
                  key={id}
                  label={REFINING_FOCUS_EFFICIENCY[id].label}
                  selected={focusEfficiencyId === id}
                  onSelect={() => setFocusEfficiencyId(id)}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-parchment/55">
              {efficiencyMeta.note} About {formatSilverExact(previewFocus)}{" "}
              focus per T{tier}
              {REFINING_ENCHANT_META[enchant].shortLabel} craft.
            </p>
          </div>
        )}

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Material prices
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Material price source"
          >
            <FilterChip
              label="Market prices"
              selected={priceInputMode === "market"}
              onSelect={() => setPriceInputMode("market")}
            />
            <FilterChip
              label="Custom prices"
              selected={priceInputMode === "custom"}
              onSelect={() => setPriceInputMode("custom")}
            />
          </div>
          {priceInputMode === "market" ? (
            <p className="mt-2 text-sm text-parchment/55">
              Uses site snapshots or live quotes from the header. Switch to custom
              to type the silver per item you see in game.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-parchment/55">
                Enter silver per item from the market board. Returned materials
                use the same unit prices.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block text-sm text-parchment/60">
                  {rawItem.name}
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={customRawPrice}
                    onChange={(e) => setCustomRawPrice(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gold/20 bg-obsidian px-3 py-2 text-parchment tabular-nums"
                    aria-label={`Custom price for ${rawItem.name}`}
                  />
                </label>
                <label className="block text-sm text-parchment/60">
                  {lowerItem.name}
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={customLowerPrice}
                    onChange={(e) => setCustomLowerPrice(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gold/20 bg-obsidian px-3 py-2 text-parchment tabular-nums"
                    aria-label={`Custom price for ${lowerItem.name}`}
                  />
                </label>
                <label className="block text-sm text-parchment/60">
                  {outputItem.name}
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={customOutputPrice}
                    onChange={(e) => setCustomOutputPrice(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gold/20 bg-obsidian px-3 py-2 text-parchment tabular-nums"
                    aria-label={`Custom price for ${outputItem.name}`}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={resetCustomPricesFromMarket}
                className="text-sm text-gold/90 underline decoration-gold/30 underline-offset-2 hover:text-gold"
              >
                Reset to current market prices
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-parchment/60">
            Material return rate (%)
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={Math.round(defaults.materialReturnRate * 1000) / 10}
              onChange={(e) => {
                setRrrTouched(true);
                const pct = Number(e.target.value);
                setDefaults((prev) => ({
                  ...prev,
                  materialReturnRate: Number.isFinite(pct)
                    ? Math.min(100, Math.max(0, pct)) / 100
                    : prev.materialReturnRate,
                }));
              }}
              className="mt-1 w-full rounded-md border border-gold/20 bg-obsidian px-3 py-2 text-parchment tabular-nums"
            />
            <span className="mt-1 block text-xs text-parchment/40">
              Presets: bonus city{" "}
              {(REFINING_RETURN_RATES.bonusCityWithFocus * 100).toFixed(1)}%
              with focus /{" "}
              {(REFINING_RETURN_RATES.bonusCityNoFocus * 100).toFixed(1)}%
              without; other city{" "}
              {(REFINING_RETURN_RATES.otherCityWithFocus * 100).toFixed(1)}% /{" "}
              {(REFINING_RETURN_RATES.otherCityNoFocus * 100).toFixed(1)}%.
            </span>
          </label>
          <label className="block text-sm text-parchment/60">
            Station usage fee (% of sell value)
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={defaults.stationFeePercent}
              onChange={(e) => {
                const pct = Number(e.target.value);
                setDefaults((prev) => ({
                  ...prev,
                  stationFeePercent: Number.isFinite(pct)
                    ? Math.min(100, Math.max(0, pct))
                    : prev.stationFeePercent,
                }));
              }}
              className="mt-1 w-full rounded-md border border-gold/20 bg-obsidian px-3 py-2 text-parchment tabular-nums"
            />
            <span className="mt-1 block text-xs text-parchment/40">
              0% on your own island station. Check city player-station tax
              before large batches.
            </span>
          </label>
        </div>

        <div className="mt-6 border-t border-gold/15 pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            {usesFocusMetric
              ? "Est. profit / 10k focus (after tax)"
              : craftCount > 1
                ? `Est. profit / ${craftCount} crafts (after tax)`
                : "Est. profit / craft (after tax)"}
          </p>
          <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
            {heroProfit != null ? formatSilverPrice(heroProfit) : "N/A"}
          </p>
          {craft.netBatch != null && (
            <p className="mt-1 text-xs text-parchment/45">
              Batch of {formatItemQuantity(craftCount)} {outputName}:{" "}
              <span className="font-semibold text-parchment/70 tabular-nums">
                {formatSilverPrice(craft.netBatch)}
              </span>
              {craft.netPerCraft != null && craftCount > 1 && (
                <>
                  {" "}
                  ({formatSilverPrice(craft.netPerCraft)} each)
                </>
              )}
              {usesFocusMetric && craft.focusPointsTotal > 0 && (
                <>
                  {" "}
                  · {formatSilverExact(craft.focusPointsTotal)} focus total
                </>
              )}
            </p>
          )}
          {profitRange.min != null && profitRange.max != null && (
            <p className="mt-1 text-xs text-parchment/45">
              All T4–T8 resources at mid focus efficiency (per 10k focus):{" "}
              {formatSilverRange(profitRange.min, profitRange.max)}/10k focus
            </p>
          )}
          {usesFocusMetric && result.craftsPerTenThousandFocus != null && (
            <p className="mt-1 text-xs text-parchment/45">
              About {formatItemQuantity(result.craftsPerTenThousandFocus)}{" "}
              crafts per 10k focus ·{" "}
              {formatSilverExact(craft.focusPointsPerCraft)} focus each
            </p>
          )}
        </div>
      </div>

      <section className="theme-surface mt-10 rounded-xl border border-gold/20 bg-obsidian-light p-6">
        <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
          Profit breakdown
        </h2>
        <p className="mt-2 text-sm text-parchment/50">
          {craftCount > 1
            ? `${formatItemQuantity(craftCount)}× T${tier} ${outputName} at ${family.station}.`
            : `One T${tier} ${outputName} craft at ${family.station}.`}{" "}
          {premiumSeller
            ? "Premium sell-order fees."
            : "Standard sell-order fees."}{" "}
          {priceInputMode === "custom"
            ? "Custom silver per item (your market board inputs)."
            : mapKind === "live"
              ? `Live ${getMarketCityLabel(effectiveCity)} prices (Albion Online Data).`
              : `${getMarketCityLabel(effectiveCity)} saved snapshot averages.`}{" "}
          Updated {formattedAt}.
        </p>

        <EconomicsTable
          title="Craft output (sell orders)"
          lines={[craft.outputLine]}
          total={craft.grossOutput}
          totalLabel="Gross output"
          variant="output"
          quantityLabel="Qty"
          unitLabel="Silver/ea"
        />

        <EconomicsTable
          title="Craft inputs (market buy cost)"
          lines={[craft.rawLine, craft.lowerRefinedLine]}
          total={craft.materialCost}
          totalLabel="Gross material cost"
          variant="input"
          quantityLabel="Qty"
          unitLabel="Silver/ea"
        />

        <EconomicsTable
          title={`Returned materials (${(craft.materialReturnRate * 100).toFixed(1)}% RRR)`}
          lines={[craft.returnedRawLine, craft.returnedLowerLine]}
          total={craft.returnedMaterialsTotal}
          totalLabel="Return value"
          variant="output"
          quantityLabel="Qty"
          unitLabel="Silver/ea"
        />

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow
            label="Gross output"
            value={craft.grossOutput}
          />
          <EconomicsSummaryRow
            label="Minus net materials"
            value={
              craft.netMaterialCost != null ? -craft.netMaterialCost : null
            }
          />
          {craft.stationFee != null && craft.stationFee > 0 && (
            <EconomicsSummaryRow
              label="Minus station fee"
              value={-craft.stationFee}
            />
          )}
          {craft.listingTax != null && (
            <EconomicsSummaryRow
              label={listingTaxRowLabel(premiumSeller)}
              value={-craft.listingTax}
            />
          )}
          <EconomicsSummaryRow
            label={
              craftCount > 1
                ? `Net for ${formatItemQuantity(craftCount)} crafts`
                : "Net per craft"
            }
            value={craft.netBatch}
            emphasis={!usesFocusMetric}
          />
          {craftCount > 1 && (
            <EconomicsSummaryRow
              label="Net per craft"
              value={craft.netPerCraft}
            />
          )}
          {usesFocusMetric && (
            <EconomicsSummaryRow
              label="Est. profit / 10k focus"
              value={result.profitPerTenThousandFocus}
              emphasis
            />
          )}
        </div>

        <p className="mt-3 text-xs text-parchment/40">
          {priceInputMode === "custom"
            ? "Custom prices apply to inputs, output, and returned materials. Listing tax applies when you sell the refined output."
            : "Silver/ea is the market sell-order price per item (what you pay to buy materials, and what you list the refined output at). Returned materials use the same price so net cost matches replacement cost. Listing tax applies when you sell the refined output."}{" "}
          {REFINING_FOCUS_COST_NOTE}
        </p>
      </section>
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
