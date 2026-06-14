import { readFileSync } from "node:fs";
import { getItemIconUrl } from "@/lib/albion-items";

const ITEM_ID_SOURCES = [
  "src/data/guides.ts",
  "src/data/guide-economics.ts",
  "src/data/guide-loadouts.ts",
  "src/data/laborer-specialties.ts",
  "src/data/t8-house-cost.ts",
  "src/data/potion-economics.ts",
  "src/data/tracking-economics.ts",
  "src/data/ava-roads-economics.ts",
  "src/data/abyssal-economics.ts",
] as const;

const ITEM_ID_PATTERN = /^T\d+_/;

/** Item IDs referenced across guide data, loadouts, and calculator economics. */
export function collectConfiguredItemIds(): string[] {
  const ids = new Set<string>();

  for (const file of ITEM_ID_SOURCES) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(/id: "([^"]+)"/g)) {
      if (ITEM_ID_PATTERN.test(match[1])) {
        ids.add(match[1]);
      }
    }
  }

  return [...ids].sort();
}

/** Parse the Albion item identifier embedded in a render.albiononline.com icon URL. */
export function parseItemIdFromIconSrc(src: string): string {
  let pathname: string;
  try {
    pathname = new URL(src).pathname;
  } catch {
    throw new Error(`Invalid icon URL: ${src}`);
  }

  const match = pathname.match(/\/v1\/item\/(.+)\.png$/i);
  if (!match) {
    throw new Error(`Not an Albion item icon URL: ${src}`);
  }

  return decodeURIComponent(match[1]);
}

export function iconSrcMatchesItemId(src: string, itemId: string): boolean {
  return parseItemIdFromIconSrc(src) === itemId;
}

export function iconUrlForItemId(itemId: string): string {
  return getItemIconUrl(itemId, 16);
}
