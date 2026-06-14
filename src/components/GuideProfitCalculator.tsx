"use client";

import { useMemo, useState } from "react";
import { EquipmentPanel } from "@/components/EquipmentPanel";
import { useMarketCity, useGuidePriceMap } from "@/components/MarketCityProvider";
import type { MarketCityId } from "@/lib/market-cities";
import type {
  GuideEconomics,
  GuideMarketPrices,
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
import {
  getGatheringYieldMultiplier,
  getListingTaxRate,
  listingTaxRowLabel,
  STANDARD_LISTING_TAX_RATE,
  takeHomeFormulaNote,
} from "@/lib/listing-tax";
import {
  computeHourlyEconomics,
  computeLoadoutPricing,
  computeProfitRange,
  enrichLoadoutWithQuantities,
  scaleGuideEconomics,
} from "@/lib/guide-economics";
import {
  formatSilverExact,
  formatSilverPrice,
  formatSilverRange,
} from "@/lib/format";

interface GuideProfitCalculatorProps {
  economics: GuideEconomics;
  guidePrices: GuideMarketPrices;
  pricedAt: string;
  tierLoadouts: TierLoadoutBundle[];
  defaultMarketCity?: MarketCityId;
}

export function GuideProfitCalculator({
  economics,
  guidePrices,
  pricedAt,
  tierLoadouts,
  defaultMarketCity,
}: GuideProfitCalculatorProps) {
  const { marketCity, listingTaxRate, premiumSeller } = useMarketCity();
  const gatheringYieldMultiplier = getGatheringYieldMultiplier(
    premiumSeller,
    economics.gatherYieldBaseline,
  );
  const { priceMap, mapKind, useLivePrices, serializedPrices } = useGuidePriceMap(
    guidePrices,
    defaultMarketCity,
  );
  const [tierId, setTierId] = useState(economics.defaultSkillTierId);
  const [specialtyId, setSpecialtyId] = useState(
    economics.defaultLaborerSpecialtyId ?? LABORER_SPECIALTIES[0].id,
  );

  const hasLaborerSpecialtyPicker = economics.defaultLaborerSpecialtyId != null;
  const tier = economics.skillTiers.find((t) => t.id === tierId) ?? economics.skillTiers[0];
  const specialty = getLaborerSpecialty(specialtyId);

  const activeLoadout = useMemo(() => {
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
    priceMap,
    gatheringYieldMultiplier,
  ]);

  const yieldOptions = { gatheringYieldMultiplier };

  const result = useMemo(() => {
    const scaled = hasLaborerSpecialtyPicker
      ? buildLaborerHourlyEconomics(specialty, tier)
      : scaleGuideEconomics(economics, tier, yieldOptions);
    return computeHourlyEconomics(
      { ...economics, ...scaled },
      priceMap,
      marketCity,
      listingTaxRate,
      mapKind,
    );
  }, [
    economics,
    gatheringYieldMultiplier,
    hasLaborerSpecialtyPicker,
    listingTaxRate,
    mapKind,
    marketCity,
    priceMap,
    specialty,
    tier,
  ]);

  const gatherYieldBaseline = economics.gatherYieldBaseline ?? "premium";
  const usesLoggedStandardBaseline = gatherYieldBaseline === "standard";

  const loggedBaselineResult = useMemo(() => {
    if (!usesLoggedStandardBaseline) return null;
    const scaled = hasLaborerSpecialtyPicker
      ? buildLaborerHourlyEconomics(specialty, tier)
      : scaleGuideEconomics(economics, tier, { gatheringYieldMultiplier: 1 });
    return computeHourlyEconomics(
      { ...economics, ...scaled },
      priceMap,
      marketCity,
      STANDARD_LISTING_TAX_RATE,
      mapKind,
    );
  }, [
    economics,
    hasLaborerSpecialtyPicker,
    mapKind,
    marketCity,
    priceMap,
    specialty,
    tier,
    usesLoggedStandardBaseline,
  ]);

  const projectedPremiumResult = useMemo(() => {
    if (!usesLoggedStandardBaseline || premiumSeller) return null;
    const scaled = hasLaborerSpecialtyPicker
      ? buildLaborerHourlyEconomics(specialty, tier)
      : scaleGuideEconomics(economics, tier, {
          gatheringYieldMultiplier: getGatheringYieldMultiplier(
            true,
            gatherYieldBaseline,
          ),
        });
    return computeHourlyEconomics(
      { ...economics, ...scaled },
      priceMap,
      marketCity,
      getListingTaxRate(true),
      mapKind,
    );
  }, [
    economics,
    gatherYieldBaseline,
    hasLaborerSpecialtyPicker,
    mapKind,
    marketCity,
    premiumSeller,
    priceMap,
    specialty,
    tier,
    usesLoggedStandardBaseline,
  ]);

  // When using a logged Standard baseline, the hero and breakdown follow the Premium toggle:
  // - Premium OFF → hero shows the logged result (Standard tax, no yield scaling)
  // - Premium ON  → hero shows the Premium projection (Premium tax, +50% yield)
  // Both the hero and the breakdown always reflect the same mode so the numbers match.
  const heroTakeHome = usesLoggedStandardBaseline
    ? premiumSeller
      ? (result.netAfterTax ?? result.netTotal)
      : (loggedBaselineResult?.netAfterTax ?? loggedBaselineResult?.netTotal)
    : (result.netAfterTax ?? result.netTotal);

  const heroBeforeTax = usesLoggedStandardBaseline
    ? premiumSeller
      ? result.netTotal
      : loggedBaselineResult?.netTotal
    : result.netTotal;

  const breakdownResult =
    usesLoggedStandardBaseline && !premiumSeller && loggedBaselineResult
      ? loggedBaselineResult
      : result;

  const profitRange = useMemo(() => {
    if (!usesLoggedStandardBaseline) {
      return computeProfitRange(
        economics,
        priceMap,
        listingTaxRate,
        gatheringYieldMultiplier,
      );
    }
    return computeProfitRange(
      economics,
      priceMap,
      STANDARD_LISTING_TAX_RATE,
      1,
    );
  }, [
    economics,
    gatheringYieldMultiplier,
    listingTaxRate,
    priceMap,
    usesLoggedStandardBaseline,
  ]);

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
              {usesLoggedStandardBaseline && premiumSeller
                ? "Est. take-home / hour (with Premium)"
                : usesLoggedStandardBaseline
                  ? "Logged take-home / hour (Standard tax, no Premium)"
                  : "Est. take-home / hour (after tax)"}
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {heroTakeHome != null ? formatSilverPrice(heroTakeHome) : "N/A"}
            </p>
            {heroBeforeTax != null && heroTakeHome != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Before{" "}
                {usesLoggedStandardBaseline && premiumSeller
                  ? "Premium listing tax"
                  : usesLoggedStandardBaseline
                    ? "Standard listing tax"
                    : "tax"}
                : {formatSilverPrice(heroBeforeTax)}/hr
              </p>
            )}
            {usesLoggedStandardBaseline && premiumSeller && loggedBaselineResult && (
              <p className="mt-2 text-xs text-parchment/50">
                Logged run without Premium:{" "}
                <span className="font-semibold text-parchment/70 tabular-nums">
                  {loggedBaselineResult.netAfterTax != null
                    ? formatSilverPrice(loggedBaselineResult.netAfterTax)
                    : "N/A"}
                  /hr
                </span>
                {" "}(Standard tax, no yield bonus)
              </p>
            )}
            {usesLoggedStandardBaseline && !premiumSeller && projectedPremiumResult && (
              <p className="mt-2 text-xs text-parchment/50">
                Projected with Premium:{" "}
                <span className="font-semibold text-parchment/70 tabular-nums">
                  {projectedPremiumResult.netAfterTax != null
                    ? formatSilverPrice(projectedPremiumResult.netAfterTax)
                    : "N/A"}
                  /hr
                </span>
                {" "}(toggle Premium in the header)
              </p>
            )}
            {profitRange?.min != null && profitRange.max != null && (
              <p className="mt-1 text-xs text-parchment/45">
                {usesLoggedStandardBaseline
                  ? "All tiers (logged baseline, Standard tax): "
                  : "All skill levels (after tax): "}
                {formatSilverRange(profitRange.min, profitRange.max)}/hr
              </p>
            )}
          </div>
          {(usesLoggedStandardBaseline
            ? loggedBaselineResult?.outputTotal
            : result.outputTotal) != null && (
            <div className="text-right text-sm text-parchment/50">
              <p>Gross output</p>
              <p className="font-semibold text-emerald-400/90 tabular-nums">
                {formatSilverExact(
                  (usesLoggedStandardBaseline
                    ? loggedBaselineResult?.outputTotal
                    : result.outputTotal) ?? 0,
                )}
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
              prices={serializedPrices}
            />
          </div>
        </section>
      )}

      <section className="theme-surface mt-10 rounded-xl border border-gold/20 bg-obsidian-light p-6">
        <h2 className="wiki-heading font-display text-xl font-semibold text-parchment">
          {usesLoggedStandardBaseline && premiumSeller
            ? "Profit breakdown (projected with Premium)"
            : "Profit breakdown"}
        </h2>
        {usesLoggedStandardBaseline && (
          <p className="mt-2 text-sm text-parchment/55">
            {premiumSeller
              ? "Projected with Premium enabled: yields scaled +50% vs the logged no-Premium baseline, Premium listing tax (~6.5%). Toggle Premium off in the header to see the logged Standard-tax result."
              : "Reviewed without Premium. Yields and tax match the logged run. Toggle Premium in the header to model projected upside (+50% gather yield, ~6.5% listing tax)."}
          </p>
        )}
        <p className="mt-2 text-sm text-parchment/50">
          Calculated from 1-hour output at{" "}
          <span className="text-parchment/70">
            {hasLaborerSpecialtyPicker ? `${specialty.label}, ` : ""}
            {tier.label}
          </span>{" "}
          yield.{" "}
          {premiumSeller
            ? "Premium listing tax (~6.5%)."
            : "Standard listing tax (~10.5%)."}{" "}
          {useLivePrices
            ? "Live royal market prices (Albion Online Data)."
            : "Site snapshot averages."}{" "}
          Updated {formattedAt}.
        </p>

        <EconomicsTable
          title="1-Hour Output (sell value)"
          lines={breakdownResult.output}
          total={breakdownResult.outputTotal}
          totalLabel="Gross output"
          variant="output"
        />

        {breakdownResult.input.length > 0 && (
          <EconomicsTable
            title="1-Hour Input Costs"
            lines={breakdownResult.input}
            total={breakdownResult.inputTotal}
            totalLabel="Input cost"
            variant="input"
          />
        )}

        {breakdownResult.consumables.length > 0 && (
          <EconomicsTable
            title="1-Hour Consumables"
            lines={breakdownResult.consumables}
            total={breakdownResult.consumableTotal}
            totalLabel="Consumable cost"
            variant="input"
          />
        )}

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow
            label="Gross output / hour"
            value={breakdownResult.outputTotal}
          />
          {breakdownResult.inputTotal != null && (
            <EconomicsSummaryRow
              label="Minus input costs"
              value={-breakdownResult.inputTotal}
            />
          )}
          {breakdownResult.consumableTotal != null && (
            <EconomicsSummaryRow
              label="Minus consumables"
              value={-breakdownResult.consumableTotal}
            />
          )}
          <EconomicsSummaryRow
            label="Net before listing tax"
            value={breakdownResult.netTotal}
          />
          {breakdownResult.marketTaxTotal != null && (
            <EconomicsSummaryRow
              label={listingTaxRowLabel(premiumSeller)}
              value={-breakdownResult.marketTaxTotal}
            />
          )}
          <EconomicsSummaryRow
            label={
              usesLoggedStandardBaseline && !premiumSeller
                ? "Logged take-home / hour"
                : usesLoggedStandardBaseline
                  ? "Est. take-home / hour (with Premium)"
                  : "Est. take-home / hour"
            }
            value={breakdownResult.netAfterTax ?? breakdownResult.netTotal}
            emphasis
          />
        </div>

        <p className="mt-3 text-xs text-parchment/40">
          {takeHomeFormulaNote(premiumSeller, gatherYieldBaseline)}
        </p>
        {economics.consumableNote && (
          <p className="mt-2 text-xs text-parchment/40">
            {economics.consumableNote}
          </p>
        )}
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
