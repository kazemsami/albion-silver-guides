"use client";

import { MARKET_CITY_OPTIONS } from "@/lib/market-cities";
import { useMarketCity } from "@/components/MarketCityProvider";

export function MarketCitySelect({ compact = false }: { compact?: boolean }) {
  const { marketCity, setMarketCity } = useMarketCity();

  return (
    <label
      className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}
    >
      <span className="sr-only">Market city for prices</span>
      {!compact && (
        <span className="text-muted hidden whitespace-nowrap lg:inline">
          Market prices
        </span>
      )}
      <span className="ui-select-wrap">
        <select
          value={marketCity}
          onChange={(event) =>
            setMarketCity(event.target.value as typeof marketCity)
          }
          aria-label="Market city for prices"
          className={`ui-control ui-select w-full ${
            compact
              ? "min-w-[8.25rem] max-w-[9.5rem] xl:min-w-[10.5rem] xl:max-w-none"
              : "max-w-[11rem] sm:max-w-none sm:min-w-[10.5rem]"
          }`}
        >
          {MARKET_CITY_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {compact && option.shortLabel ? option.shortLabel : option.label}
            </option>
          ))}
        </select>
        <svg
          className="ui-select-chevron"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}
