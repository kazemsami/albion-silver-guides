"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categoryLabels } from "@/types/guide";
import { guideNavCategories } from "@/lib/guide-categories";

export function GuidesNavDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onGuides =
    pathname === "/guides" || pathname.startsWith("/guides/");

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Link
        href="/guides"
        onClick={() => setOpen(false)}
        className={`inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
          onGuides ? "text-gold" : "text-parchment/70"
        }`}
      >
        All Guides
        <svg
          className={`h-3.5 w-3.5 opacity-60 transition-transform ${
            open ? "rotate-180" : ""
          }`}
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
      </Link>
      <div
        className={`absolute left-0 top-full z-50 pt-1 transition-opacity ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        role="menu"
        aria-label="Guide categories"
        aria-hidden={!open}
      >
        <div className="min-w-[11.5rem] rounded-lg border border-gold/20 bg-obsidian-light py-1 shadow-xl">
          {guideNavCategories.map((category) => (
            <Link
              key={category}
              href={`/guides?category=${category}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-parchment/80 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:bg-gold/10 focus-visible:text-gold focus-visible:outline-none"
            >
              {categoryLabels[category]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
