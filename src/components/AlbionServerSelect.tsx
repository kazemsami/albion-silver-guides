"use client";

import { ALBION_PRICE_SERVERS } from "@/lib/albion-servers";
import { useMarketCity } from "@/components/MarketCityProvider";

export function AlbionServerSelect({ compact = false }: { compact?: boolean }) {
  const { priceServer, setPriceServer, useLivePrices } = useMarketCity();
  const serverPickerEnabled = useLivePrices;

  return (
    <label
      className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} ${
        serverPickerEnabled ? "" : "cursor-not-allowed opacity-50"
      }`}
      title={
        serverPickerEnabled
          ? "Albion server region for live market prices"
          : "Enable live prices to pick a server region"
      }
    >
      <span className="sr-only">Albion server region for prices</span>
      {!compact && (
        <span className="text-muted hidden whitespace-nowrap lg:inline">
          Server
        </span>
      )}
      <span className="ui-select-wrap">
        <select
          value={priceServer}
          disabled={!serverPickerEnabled}
          onChange={(event) =>
            setPriceServer(event.target.value as typeof priceServer)
          }
          aria-label="Albion server region for prices"
          aria-disabled={!serverPickerEnabled}
          className={`ui-control ui-select w-full disabled:cursor-not-allowed disabled:opacity-70 ${
            compact
              ? "min-w-[6.75rem] max-w-[7.75rem] xl:min-w-[7.5rem] xl:max-w-[8.25rem]"
              : "max-w-[11rem] sm:max-w-none sm:min-w-[10.5rem]"
          }`}
        >
          {ALBION_PRICE_SERVERS.map((server) => (
            <option key={server.id} value={server.id}>
              {compact && server.shortLabel ? server.shortLabel : server.label}
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
