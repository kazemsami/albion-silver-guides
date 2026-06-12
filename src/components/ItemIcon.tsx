"use client";

import { useState } from "react";
import { getItemIconUrl } from "@/lib/albion-items";

interface ItemIconProps {
  id: string;
  name: string;
  size?: number;
}

export function ItemIcon({ id, name, size = 32 }: ItemIconProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded border border-[#4a3f2a] bg-[#1a1510]"
      style={{ width: size, height: size }}
      title={name}
    >
      {imgError ? (
        <span className="text-[10px] text-parchment/40">?</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getItemIconUrl(id, size)}
          alt=""
          width={size}
          height={size}
          className="pointer-events-none object-contain p-0.5"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
