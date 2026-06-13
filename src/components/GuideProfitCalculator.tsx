"use client";

import { useMemo, useState } from "react";
import { EquipmentPanel } from "@/components/EquipmentPanel";
import { useMarketCity, useEffectiveMarketCity } from "@/components/MarketCityProvider";
import type { MarketCityId } from "@/lib/market-cities";
import type {
  GuideEconomics,
  SerializedPricesByCity,
  SkillTier,
  TierLoadoutBundle,
} from "@/types/guide";
import {
  EconomicsSummaryRow,
  EconomicsTable,
} from "@/components/EconomicsTable";
import {
  LABORER_SPECIALTIES,
  buildLaborerHourlyEconomics,
  buildLaborerLoadout,
  getLaborerSpecialty,
} from "@/data/laborer-specialties";
import { loadoutVariantForTier } from "@/data/guide-loadouts";
import { listingTaxRowLabel } from "@/lib/listing-tax";
import {
  computeHourlyEconomics,
  computeLoadoutPricing,
  computeProfitRange,
  deserializePriceMap,
  enrichLoadoutWithQuantities,
  pickSerializedPrices,
  scaleGuideEconomics,
} from "@/lib/guide-economics";
import {
  formatSilverExact,
  formatSilverPrice,
  formatSilverRange,
} from "@/lib/format";

interface GuideProfitCalculatorProps {
  economics: GuideEconomics;
  pricesByCity: SerializedPricesByCity;
  pricedAt: string;
  tierLoadouts: TierLoadoutBundle[];
  defaultMarketCity?: MarketCityId;
}

export function GuideProfitCalculator({
  economics,
  pricesByCity,
  pricedAt,
  tierLoadouts,
  defaultMarketCity,
}: GuideProfitCalculatorProps) {
  const { marketCity, listingTaxRate, premiumSeller, gatheringYieldMultiplier } =
    useMarketCity();
  const effectiveCity = useEffectiveMarketCity(defaultMarketCity);
  const prices = pickSerializedPrices(pricesByCity, effectiveCity);
  const [tierId, setTierId] = useState(economics.defaultSkillTierId);
  const [specialtyId, setSpecialtyId] = useState(
    economics.defaultLaborerSpecialtyId ?? LABORER_SPECIALTIES[0].id,
  );

  const hasLaborerSpecialtyPicker = economics.defaultLaborerSpecialtyId != null;
  const tier = economics.skillTiers.find((t) => t.id === tierId) ?? economics.skillTiers[0];
  const specialty = getLaborerSpecialty(specialtyId);

  const activeLoadout = useMemo(() => {
    const priceMap = deserializePriceMap(prices);

    if (hasLaborerSpecialtyPicker) {
      const loadout = buildLaborerLoadout(specialty, tier);
      return {
        tierId: tier.id,
        loadout,
        pricing: computeLoadoutPricing(loadout, priceMap),
        variant: loadoutVariantForTier(tier.id),
      };
    }

    const bundle = tierLoadouts.find((b) => b.tierId === tierId);
    if (!bundle) return undefined;

    const loadout = enrichLoadoutWithQuantities(
      bundle.loadout,
      economics,
      tier,
      gatheringYieldMultiplier,
    );

    return {
      ...bundle,
      loadout,
      pricing: computeLoadoutPricing(loadout, priceMap),
    };
  }, [
    economics,
    hasLaborerSpecialtyPicker,
    specialty,
    tier,
    tierId,
    tierLoadouts,
    prices,
    gatheringYieldMultiplier,
  ]);

  const yieldOptions = { gatheringYieldMultiplier };

  const result = useMemo(() => {
    const priceMap = deserializePriceMap(prices);
    const scaled = hasLaborerSpecialtyPicker
      ? buildLaborerHourlyEconomics(specialty, tier)
      : scaleGuideEconomics(economics, tier, yieldOptions);
    return computeHourlyEconomics(
      { ...economics, ...scaled },
      priceMap,
      marketCity,
      listingTaxRate,
    );
  }, [
    economics,
    gatheringYieldMultiplier,
    hasLaborerSpecialtyPicker,
    listingTaxRate,
    marketCity,
    prices,
    specialty,
    tier,
  ]);

  const profitRange = useMemo(() => {
    const priceMap = deserializePriceMap(prices);
    return computeProfitRange(
      economics,
      priceMap,
      listingTaxRate,
      gatheringYieldMultiplier,
    );
  }, [economics, gatheringYieldMultiplier, listingTaxRate, prices]);

  const formattedAt = new Date(pricedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <div className="profit-hero-panel wiki-note theme-surface mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Est. take-home / hour (after tax)
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {result.netAfterTax != null
                ? formatSilverPrice(result.netAfterTax)
                : result.netTotal != null
                  ? formatSilverPrice(result.netTotal)
                  : "N/A"}
            </p>
            {result.netTotal != null && result.netAfterTax != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Before tax: {formatSilverPrice(result.netTotal)}/hr
              </p>
            )}
            {profitRange?.min != null && profitRange.max != null && (
              <p className="mt-1 text-xs text-parchment/45">
                All skill levels (after tax): {formatSilverRange(profitRange.min, profitRange.max)}/hr
              </p>
            )}
          </div>
          {result.outputTotal != null && (
            <div className="text-right text-sm text-parchment/50">
              <p>Gross output</p>
              <p className="font-semibold text-emerald-400/90 tabular-nums">
                {formatSilverExact(result.outputTotal)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
            Your skill level
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Skill level"
          >
            {economics.skillTiers.map((option) => (
              <SkillTierButton
                key={option.id}
                tier={option}
                selected={tierId === option.id}
                onSelect={() => setTierId(option.id)}
              />
            ))}
          </div>
          {tier.description && (
            <p className="mt-2 text-sm text-parchment/55">{tier.description}</p>
          )}
        </div>

        {hasLaborerSpecialtyPicker && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment/40">
              Laborer specialty
            </p>
            <p className="mt-1 text-xs text-parchment/45">
              All houses run the same journal type. Pick what you fill while playing.
            </p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Laborer specialty"
            >
              {LABORER_SPECIALTIES.map((option) => (
                <SpecialtyButton
                  key={option.id}
                  label={option.label}
                  selected={specialtyId === option.id}
                  onSelect={() => setSpecialtyId(option.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {activeLoadout && (
        <section className="mt-10">
          <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
            Recommended Gear
          </h2>
          <p className="mt-1 text-sm text-parchment/50">
            Loadout for{" "}
            <span className="text-parchment/70">
              {hasLaborerSpecialtyPicker ? `${specialty.label}, ` : ""}
              {tier.label}
            </span>
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
          Calculated from 1-hour output at{" "}
          <span className="text-parchment/70">
            {hasLaborerSpecialtyPicker ? `${specialty.label}, ` : ""}
            {tier.label}
          </span>{" "}
          yield. Estimated snapshot prices. Updated {formattedAt}.
        </p>

        <EconomicsTable
          title="1-Hour Output (sell value)"
          lines={result.output}
          total={result.outputTotal}
          totalLabel="Gross output"
          variant="output"
        />

        {result.input.length > 0 && (
          <EconomicsTable
            title="1-Hour Input Costs"
            lines={result.input}
            total={result.inputTotal}
            totalLabel="Input cost"
            variant="input"
          />
        )}

        {result.consumables.length > 0 && (
          <EconomicsTable
            title="1-Hour Consumables"
            lines={result.consumables}
            total={result.consumableTotal}
            totalLabel="Consumable cost"
            variant="input"
          />
        )}

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow
            label="Gross output / hour"
            value={result.outputTotal}
          />
          {result.inputTotal != null && (
            <EconomicsSummaryRow
              label="Minus input costs"
              value={-result.inputTotal}
            />
          )}
          {result.consumableTotal != null && (
            <EconomicsSummaryRow
              label="Minus consumables"
              value={-result.consumableTotal}
            />
          )}
          <EconomicsSummaryRow
            label="Net before listing tax"
            value={result.netTotal}
          />
          {result.marketTaxTotal != null && (
            <EconomicsSummaryRow
              label={listingTaxRowLabel(premiumSeller)}
              value={-result.marketTaxTotal}
            />
          )}
          <EconomicsSummaryRow
            label="Est. take-home / hour"
            value={result.netAfterTax ?? result.netTotal}
            emphasis
          />
        </div>

        <p className="mt-3 text-xs text-parchment/40">
          Take-home = output sell value - input buys - consumables - ~6.5% Premium
          listing tax on gross output. Deaths, repairs, and station fees are not
          included unless listed as inputs. Yields scale with your selected skill
          level.
        </p>
      </section>
    </>
  );
}

function SpecialtyButton({
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

function SkillTierButton({
  tier,
  selected,
  onSelect,
}: {
  tier: SkillTier;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`filter-chip px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        selected ? "filter-chip-active" : ""
      }`}
    >
      {tier.label}
    </button>
  );
}
