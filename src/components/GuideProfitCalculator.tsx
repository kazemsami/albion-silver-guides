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
  buildLaborerCycleEconomics,
  buildLaborerHourlyEconomics,
  buildLaborerLoadout,
  getLaborerSpecialty,
  laborerCountForTier,
} from "@/data/laborer-specialties";
import { loadoutVariantForTier } from "@/data/guide-loadouts";
import {
  getGatheringYieldMultiplier,
  getListingTaxRate,
  listingTaxRowLabel,
  PREMIUM_MARKET_FEE_LABEL,
  STANDARD_LISTING_TAX_RATE,
  STANDARD_MARKET_FEE_LABEL,
  takeHomeFormulaNote,
  type TakeHomeFormulaNoteKind,
} from "@/lib/listing-tax";
import {
  computeHourlyEconomics,
  computeLoadoutPricing,
  computeProfitRange,
  enrichLoadoutWithQuantities,
  guideUsesGatheringYield,
  scaleGuideEconomics,
} from "@/lib/guide-economics";
import {
  formatSilverExact,
  formatSilverPrice,
  formatSilverRange,
} from "@/lib/format";
import {
  computeT8HouseBuildPricing,
} from "@/data/t8-house-cost";
import {
  LABORER_JOB_HOURS,
  computeLaborerFullSetupCosts,
  computeLaborerPayback,
  formatPaybackDays,
  laborerCycleProfit,
  profitUnitLabel,
} from "@/lib/laborer-display";

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
        pricing: computeLoadoutPricing(loadout, priceMap, mapKind),
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
      pricing: computeLoadoutPricing(loadout, priceMap, mapKind),
    };
  }, [
    economics,
    hasLaborerSpecialtyPicker,
    specialty,
    tier,
    tierId,
    tierLoadouts,
    priceMap,
    mapKind,
    gatheringYieldMultiplier,
  ]);

  const yieldOptions = { gatheringYieldMultiplier, premiumSeller };

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
  const formulaNoteKind: TakeHomeFormulaNoteKind =
    economics.takeHomeFormulaNoteKind ??
    (economics.defaultLaborerSpecialtyId
      ? "laborer"
      : guideUsesGatheringYield(economics)
        ? "gathering"
        : "none");

  const loggedBaselineResult = useMemo(() => {
    if (!usesLoggedStandardBaseline) return null;
    const scaled = hasLaborerSpecialtyPicker
      ? buildLaborerHourlyEconomics(specialty, tier)
      : scaleGuideEconomics(economics, tier, {
          gatheringYieldMultiplier: 1,
          premiumSeller: false,
        });
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
          premiumSeller: true,
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

  const cycleBreakdownResult = useMemo(() => {
    if (!hasLaborerSpecialtyPicker) return null;
    const scaled = buildLaborerCycleEconomics(specialty, tier);
    const taxRate =
      usesLoggedStandardBaseline && !premiumSeller
        ? STANDARD_LISTING_TAX_RATE
        : listingTaxRate;
    return computeHourlyEconomics(
      { ...economics, ...scaled },
      priceMap,
      marketCity,
      taxRate,
      mapKind,
    );
  }, [
    economics,
    hasLaborerSpecialtyPicker,
    listingTaxRate,
    mapKind,
    marketCity,
    priceMap,
    specialty,
    tier,
    usesLoggedStandardBaseline,
  ]);

  const laborerBreakdown =
    hasLaborerSpecialtyPicker && cycleBreakdownResult
      ? cycleBreakdownResult
      : breakdownResult;

  const laborerCount = hasLaborerSpecialtyPicker
    ? laborerCountForTier(tier)
    : 0;
  const laborerProfitUnit = profitUnitLabel("laborer-passive-income");

  const displayTakeHome = hasLaborerSpecialtyPicker
    ? laborerCycleProfit(heroTakeHome ?? null)
    : heroTakeHome;
  const displayBeforeTax = hasLaborerSpecialtyPicker
    ? laborerCycleProfit(heroBeforeTax ?? null)
    : heroBeforeTax;

  const laborerSetupCosts = useMemo(() => {
    if (!hasLaborerSpecialtyPicker || !activeLoadout?.pricing?.total) return null;
    const houses = activeLoadout.loadout.houseCount ?? 0;
    const houseBuild =
      houses > 0
        ? computeT8HouseBuildPricing(
            priceMap,
            houses,
            mapKind,
          ).total ?? 0
        : 0;
    return computeLaborerFullSetupCosts({
      specialty,
      tier,
      priceMap,
      furnitureSilver: activeLoadout.pricing.total,
      houseBuildSilver: houseBuild,
      mapKind,
    });
  }, [
    activeLoadout,
    hasLaborerSpecialtyPicker,
    mapKind,
    priceMap,
    specialty,
    tier,
  ]);

  const laborerPayback = useMemo(() => {
    if (!laborerSetupCosts || displayTakeHome == null) return null;
    return computeLaborerPayback(laborerSetupCosts.total, displayTakeHome);
  }, [displayTakeHome, laborerSetupCosts]);

  const hasBonusOutput =
    economics.bonusOutputExcludedFromTakeHome === true &&
    (laborerBreakdown.bonusOutput?.length ?? 0) > 0 &&
    laborerBreakdown.bonusOutputTotal != null;

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
              {hasLaborerSpecialtyPicker
                ? "Est. take-home / 22h cycle (after tax)"
                : usesLoggedStandardBaseline && premiumSeller
                  ? "Est. take-home / hour (with Premium)"
                  : usesLoggedStandardBaseline && !premiumSeller
                    ? hasBonusOutput
                      ? "Logged take-home / hour (excludes Snapper EV)"
                      : "Logged take-home / hour (Standard tax, no Premium)"
                    : "Est. take-home / hour (after tax)"}
            </p>
            <p className="mt-1 text-3xl font-bold text-gold tabular-nums">
              {displayTakeHome != null ? formatSilverPrice(displayTakeHome) : "N/A"}
            </p>
            {displayBeforeTax != null && displayTakeHome != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Before{" "}
                {usesLoggedStandardBaseline && premiumSeller
                  ? "Premium sell-order fees"
                  : usesLoggedStandardBaseline
                    ? "Standard sell-order fees"
                    : "tax"}
                : {formatSilverPrice(displayBeforeTax)}
                {hasLaborerSpecialtyPicker ? "/22h cycle" : "/hr"}
              </p>
            )}
            {hasLaborerSpecialtyPicker && heroTakeHome != null && (
              <p className="mt-1 text-xs text-parchment/45">
                Amortized {formatSilverPrice(heroTakeHome)}/hr across the wait:{" "}
                {laborerCount} laborers each finish one journal every {LABORER_JOB_HOURS}h.
                Not active play income.
              </p>
            )}
            {usesLoggedStandardBaseline && premiumSeller && loggedBaselineResult && (
              <p className="mt-2 text-xs text-parchment/50">
                Logged run without Premium:{" "}
                <span className="font-semibold text-parchment/70 tabular-nums">
                  {loggedBaselineResult.netAfterTax != null
                    ? formatSilverPrice(
                        hasLaborerSpecialtyPicker
                          ? laborerCycleProfit(loggedBaselineResult.netAfterTax)
                          : loggedBaselineResult.netAfterTax,
                      )
                    : "N/A"}
                  {hasLaborerSpecialtyPicker ? "/22h cycle" : "/hr"}
                </span>
                {" "}(Standard tax, no yield bonus)
              </p>
            )}
            {usesLoggedStandardBaseline && !premiumSeller && projectedPremiumResult && (
              <p className="mt-2 text-xs text-parchment/50">
                Projected with Premium:{" "}
                <span className="font-semibold text-parchment/70 tabular-nums">
                  {projectedPremiumResult.netAfterTax != null
                    ? formatSilverPrice(
                        hasLaborerSpecialtyPicker
                          ? laborerCycleProfit(projectedPremiumResult.netAfterTax)
                          : projectedPremiumResult.netAfterTax,
                      )
                    : "N/A"}
                  {hasLaborerSpecialtyPicker ? "/22h cycle" : "/hr"}
                </span>
                {" "}(toggle Premium in the header)
              </p>
            )}
            {profitRange?.min != null && profitRange.max != null && (
              <p className="mt-1 text-xs text-parchment/45">
                {hasLaborerSpecialtyPicker
                  ? "All calculator extremes (all specialties and house counts, after tax): "
                  : usesLoggedStandardBaseline
                    ? "All tiers (logged baseline, Standard tax): "
                    : "All skill levels (after tax): "}
                {formatSilverRange(profitRange.min, profitRange.max)}
                {hasLaborerSpecialtyPicker ? laborerProfitUnit : "/hr"}
              </p>
            )}
            {laborerPayback && laborerSetupCosts && (
              <p className="mt-2 text-xs text-parchment/50">
                Setup payback (furniture, houses, island L6, T8 contracts):{" "}
                <span className="font-semibold text-parchment/70 tabular-nums">
                  ~{Math.ceil(laborerPayback.cycles)} cycles (
                  {formatPaybackDays(laborerPayback.days)})
                </span>
                {" "}on {formatSilverExact(laborerSetupCosts.total)} upfront.
                {laborerSetupCosts.laborerContractsSilver == null &&
                  " Laborer contract prices missing from snapshot."}
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
              priceMapKind={mapKind}
              laborerSetup={
                hasLaborerSpecialtyPicker
                  ? {
                      laborerCount,
                      contractItemId: specialty.contractItemId,
                      contractName: `Elder ${specialty.label} Contract`,
                    }
                  : undefined
              }
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
              ? `Projected with Premium enabled: yields scaled +50% vs the logged no-Premium baseline, ${PREMIUM_MARKET_FEE_LABEL}. Toggle Premium off in the header to see the logged Standard-tax result.`
              : "Reviewed without Premium. Yields and tax match the logged run. Toggle Premium in the header to model projected upside (+50% gather yield, 2.5% setup fee + 4% transaction tax)."}
          </p>
        )}
        <p className="mt-2 text-sm text-parchment/50">
          {hasLaborerSpecialtyPicker
            ? `Calculated for one full ${LABORER_JOB_HOURS}h island cycle at `
            : "Calculated from 1-hour output at "}
          <span className="text-parchment/70">
            {hasLaborerSpecialtyPicker ? `${specialty.label}, ` : ""}
            {tier.label}
          </span>{" "}
          yield.{" "}
          {premiumSeller
            ? `${PREMIUM_MARKET_FEE_LABEL}.`
            : `${STANDARD_MARKET_FEE_LABEL}.`}{" "}
          {useLivePrices
            ? "Live royal market prices (Albion Online Data)."
            : "Site snapshot averages."}{" "}
          Updated {formattedAt}.
        </p>

        <EconomicsTable
          title={
            hasLaborerSpecialtyPicker
              ? "22h Cycle Output (sell value)"
              : "1-Hour Output (sell value)"
          }
          lines={laborerBreakdown.output}
          total={laborerBreakdown.outputTotal}
          totalLabel="Gross output"
          variant="output"
        />

        {hasBonusOutput && (
          <EconomicsTable
            title="RNG upside (not in logged take-home)"
            lines={laborerBreakdown.bonusOutput!}
            total={laborerBreakdown.bonusOutputTotal ?? null}
            totalLabel="Snapper EV (optional)"
            variant="output"
          />
        )}

        {laborerBreakdown.input.length > 0 && (
          <EconomicsTable
            title={
              hasLaborerSpecialtyPicker
                ? "22h Cycle Input Costs"
                : "1-Hour Input Costs"
            }
            lines={laborerBreakdown.input}
            total={laborerBreakdown.inputTotal}
            totalLabel="Input cost"
            variant="input"
          />
        )}

        {laborerBreakdown.consumables.length > 0 && (
          <EconomicsTable
            title={
              hasLaborerSpecialtyPicker
                ? "22h Cycle Consumables"
                : "1-Hour Consumables"
            }
            lines={laborerBreakdown.consumables}
            total={laborerBreakdown.consumableTotal}
            totalLabel="Consumable cost"
            variant="input"
          />
        )}

        <div className="profit-summary-box mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3">
          <EconomicsSummaryRow
            label={
              hasLaborerSpecialtyPicker
                ? "Gross output / 22h cycle"
                : "Gross output / hour"
            }
            value={laborerBreakdown.outputTotal}
          />
          {laborerBreakdown.inputTotal != null && (
            <EconomicsSummaryRow
              label="Minus input costs"
              value={-laborerBreakdown.inputTotal}
            />
          )}
          {laborerBreakdown.consumableTotal != null && (
            <EconomicsSummaryRow
              label="Minus consumables"
              value={-laborerBreakdown.consumableTotal}
            />
          )}
          <EconomicsSummaryRow
            label="Net before sell-order fees"
            value={laborerBreakdown.netTotal}
          />
          {laborerBreakdown.marketTaxTotal != null && (
            <EconomicsSummaryRow
              label={listingTaxRowLabel(premiumSeller)}
              value={-laborerBreakdown.marketTaxTotal}
            />
          )}
          <EconomicsSummaryRow
            label={
              hasLaborerSpecialtyPicker
                ? "Est. take-home / 22h cycle"
                : usesLoggedStandardBaseline && !premiumSeller
                  ? hasBonusOutput
                    ? "Logged take-home / hour (excludes Snapper EV)"
                    : "Logged take-home / hour"
                  : usesLoggedStandardBaseline
                    ? "Est. take-home / hour (with Premium)"
                    : "Est. take-home / hour"
            }
            value={laborerBreakdown.netAfterTax ?? laborerBreakdown.netTotal}
            emphasis
          />
          {hasBonusOutput && (
            <EconomicsSummaryRow
              label="Plus Snapper EV (RNG upside)"
              value={laborerBreakdown.bonusOutputTotal ?? null}
            />
          )}
        </div>

        <p className="mt-3 text-xs text-parchment/40">
          {takeHomeFormulaNote(
            premiumSeller,
            gatherYieldBaseline,
            formulaNoteKind,
          )}
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
