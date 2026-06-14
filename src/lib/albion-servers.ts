export const ALBION_PRICE_SERVERS = [
  {
    id: "west",
    label: "Americas (West)",
    shortLabel: "West",
    apiHost: "https://west.albion-online-data.com",
  },
  {
    id: "europe",
    label: "Europe",
    shortLabel: "Europe",
    apiHost: "https://europe.albion-online-data.com",
  },
  {
    id: "east",
    label: "Asia (East)",
    shortLabel: "Asia",
    apiHost: "https://east.albion-online-data.com",
  },
] as const;

export type AlbionPriceServerId = (typeof ALBION_PRICE_SERVERS)[number]["id"];

export const ALBION_PRICE_SERVER_STORAGE_KEY = "albion-silver-price-server";

export const DEFAULT_ALBION_PRICE_SERVER_ID: AlbionPriceServerId = "west";

export function isAlbionPriceServerId(
  value: string | null,
): value is AlbionPriceServerId {
  return ALBION_PRICE_SERVERS.some((server) => server.id === value);
}

export function getAlbionPriceServerLabel(id: AlbionPriceServerId): string {
  return (
    ALBION_PRICE_SERVERS.find((server) => server.id === id)?.label ?? id
  );
}

export function getAlbionPriceServerApiHost(id: AlbionPriceServerId): string {
  return (
    ALBION_PRICE_SERVERS.find((server) => server.id === id)?.apiHost ??
    ALBION_PRICE_SERVERS[0].apiHost
  );
}

export function resolveDefaultAlbionPriceServerFromEnv(): AlbionPriceServerId {
  const host = (process.env.ALBION_API_HOST ?? "").toLowerCase();
  if (host.includes("europe")) return "europe";
  if (host.includes("east")) return "east";
  return DEFAULT_ALBION_PRICE_SERVER_ID;
}
