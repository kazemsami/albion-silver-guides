/** Yellow-zone Mists fishing logged baseline for mists-fishing. */

import type { HourlyItem } from "@/types/guide";
import {
  AVA_FISHING_SKILL_YIELD_PER_LEVEL,
  AVA_FISHING_SPEC_YIELD_PER_LEVEL,
  AVA_GREEDY_FISHING_LEVEL,
  AVA_GREEDY_FISHING_SPEC_LEVEL,
  AVA_LOGGED_FISHING_LEVEL,
  AVA_LOGGED_FISHING_SPEC_LEVEL,
} from "@/data/ava-roads-economics";

/** Chopped fish from a 30-min session (999 + 172), no Premium, T7 fisherman + T7 Avalonian rod + Pork Pie. */
export const MISTS_LOGGED_CHOPS_PER_30MIN = 999 + 172;

/** Grandmaster Fisherman's Journal fill in the same session (5,580 / 6,640 fame). */
export const MISTS_LOGGED_JOURNAL_FILL_PER_30MIN = 5580 / 6640;

/** Extrapolated to 1 hr at the same pace (×2). */
export const MISTS_LOGGED_CHOPS_PER_HOUR = MISTS_LOGGED_CHOPS_PER_30MIN * 2;

export const MISTS_LOGGED_JOURNAL_FILL_PER_HOUR =
  Math.round(MISTS_LOGGED_JOURNAL_FILL_PER_30MIN * 2 * 100) / 100;

/** Incremental fish yield bonus points vs logged T7 gear (stack additively). */
export const MISTS_T8_AVALON_ROD_YIELD_BONUS = 0.025;
export const MISTS_T8_FISHERMAN_GARB_YIELD_BONUS = 0.1;
export const MISTS_T8_FISHERMAN_CAP_YIELD_BONUS = 0.05;
export const MISTS_T8_FISHERMAN_BOOTS_YIELD_BONUS = 0.05;

export const MISTS_T7_TO_T8_GEAR_YIELD_BONUS =
  MISTS_T8_AVALON_ROD_YIELD_BONUS +
  MISTS_T8_FISHERMAN_GARB_YIELD_BONUS +
  MISTS_T8_FISHERMAN_CAP_YIELD_BONUS +
  MISTS_T8_FISHERMAN_BOOTS_YIELD_BONUS;

/** Skill levels assumed inside the logged T7 session (same as Ava Roads logged baseline). */
export const MISTS_LOGGED_FISHING_LEVEL = AVA_LOGGED_FISHING_LEVEL;
export const MISTS_LOGGED_FISHING_SPEC_LEVEL = AVA_LOGGED_FISHING_SPEC_LEVEL;

/** Fishing 100 + fishing spec 100 vs logged fishing 78 / spec 33 (+26.75% bonus points). */
export const MISTS_MAX_SPEC_SKILL_SPEC_BONUS =
  (AVA_GREEDY_FISHING_SPEC_LEVEL - MISTS_LOGGED_FISHING_SPEC_LEVEL) *
    AVA_FISHING_SPEC_YIELD_PER_LEVEL +
  (AVA_GREEDY_FISHING_LEVEL - MISTS_LOGGED_FISHING_LEVEL) *
    AVA_FISHING_SKILL_YIELD_PER_LEVEL;

/**
 * Max-spec chopped fish vs logged run: +22.5% gear (2.5 + 10 + 5 + 5) plus +26.75% skill/spec
 * stacked additively for +49.25% total. Journal fill unchanged.
 */
export const MISTS_MAX_SPEC_FISH_YIELD =
  1 + MISTS_T7_TO_T8_GEAR_YIELD_BONUS + MISTS_MAX_SPEC_SKILL_SPEC_BONUS;

export const MISTS_MAX_SPEC_CHOPS_PER_HOUR = Math.round(
  MISTS_LOGGED_CHOPS_PER_HOUR * MISTS_MAX_SPEC_FISH_YIELD,
);

export const MISTS_MAX_SPEC_FISH_YIELD_PERCENT = Math.round(
  (MISTS_MAX_SPEC_FISH_YIELD - 1) * 1000,
) / 10;

/** Expected Puremist Snapper hook rate per hour in Epic+ T7 Mists (RNG upside). */
export const MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_30_60 = 0.25;
/** ~1 Snapper hook every 2 hours at fishing 60+ in Epic+ T7 Mists. */
export const MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_60PLUS = 0.5;
export const MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_MAX_SPEC =
  MISTS_PUREMIST_SNAPPER_CATCHES_PER_HOUR_60PLUS;

/** Fish per Snapper hook when you land one (logged). */
export const MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_STANDARD = 2;
export const MISTS_PUREMIST_SNAPPER_PER_CATCH_60PLUS_PREMIUM = 3;
export const MISTS_PUREMIST_SNAPPER_PER_CATCH_MAX_SPEC_STANDARD = 4;
export const MISTS_PUREMIST_SNAPPER_PER_CATCH_MAX_SPEC_PREMIUM = 5;

export function mistsPuremistSnapperBonusLine(
  catchesPerHour: number,
  perCatchStandard: number,
  perCatchPremium: number,
): HourlyItem {
  return {
    id: "T7_FISH_FRESHWATER_AVALON_RARE",
    name: `Puremist Snapper (Epic+ T7 mist, ~1 catch / 2 hr, ${perCatchStandard} per catch)`,
    quantity: Math.round(catchesPerHour * perCatchStandard * 100) / 100,
    quantityPremium: Math.round(catchesPerHour * perCatchPremium * 100) / 100,
  };
}
