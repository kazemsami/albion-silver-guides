"use client";

import { useState } from "react";
import { getItemIconUrl } from "@/lib/albion-items";
import { formatLoadoutQuantity } from "@/lib/format";
import type { AlbionItem } from "@/types/guide";

interface ItemSlotProps {
  item: AlbionItem;
  label: string;
  size?: "sm" | "md";
  quantity?: number;
}

export function ItemSlot({ item, label, size = "md", quantity }: ItemSlotProps) {
  const [imgError, setImgError] = useState(false);
  const dim = size === "sm" ? 52 : 64;
  const explicitQty = quantity ?? item.quantity;
  const count =
    explicitQty != null ? Math.max(1, Math.round(explicitQty)) : 1;
  const showCount = explicitQty != null || count > 1;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`item-slot relative flex items-center justify-center rounded border-2 border-item-slot-border bg-item-slot-bg ${
          size === "sm" ? "h-[52px] w-[52px]" : "h-16 w-16"
        }`}
        title={showCount ? `${item.name} ×${count}` : item.name}
      >
        {imgError ? (
          <span className="px-1 text-center text-[9px] leading-tight text-parchment/40">
            ?
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getItemIconUrl(item.id, dim)}
            alt=""
            width={dim}
            height={dim}
            className="pointer-events-none object-contain p-0.5"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {showCount && (
          <span
            className={`absolute -bottom-1 -right-1 max-w-[calc(100%+0.5rem)] truncate rounded border border-gold/40 bg-item-slot-badge-bg px-1 text-center font-bold leading-tight text-gold tabular-nums shadow-sm ${
              count >= 1000 ? "text-[8px]" : "text-[10px]"
            }`}
          >
            ×{formatLoadoutQuantity(count)}
          </span>
        )}
      </div>
      <span
        className="max-w-[80px] text-center text-[9px] leading-tight text-parchment/50"
        title={item.name}
      >
        {label}
      </span>
    </div>
  );
}
