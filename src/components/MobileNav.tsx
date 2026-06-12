"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MarketCitySelect } from "@/components/MarketCitySelect";
import { useFeedback } from "@/components/FeedbackDialog";
import { paypalDonateUrl } from "@/lib/site";

const navLinks = [
  { href: "/guides", label: "All Guides" },
  { href: "/guides?category=gathering", label: "Gathering" },
  { href: "/guides?category=fishing", label: "Fishing" },
  { href: "/guides?category=crafting", label: "Crafting" },
  { href: "/guides?category=dungeons", label: "Dungeons" },
  { href: "/guides?difficulty=beginner", label: "Beginner Friendly" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { openFeedback } = useFeedback();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/30 text-parchment transition-colors hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="mobile-nav-overlay fixed inset-0 top-16 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav-menu"
            aria-label="Mobile"
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-gold/20 bg-obsidian-light p-2 shadow-xl"
          >
            <div className="border-b border-gold/10 px-2 py-2.5">
              <MarketCitySelect />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-parchment/80 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openFeedback();
              }}
              className="mt-1 block w-full rounded-lg border border-gold/20 px-3 py-2.5 text-left text-sm text-parchment/80 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Send feedback
            </button>
            <a
              href={paypalDonateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-lg border border-gold/25 bg-gold/5 px-3 py-2.5 text-center text-sm font-medium text-gold transition-colors hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Donate via PayPal
            </a>
          </nav>
        </>
      )}
    </div>
  );
}
