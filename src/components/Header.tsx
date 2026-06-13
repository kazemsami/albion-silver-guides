import Link from "next/link";
import { MarketCitySelect } from "@/components/MarketCitySelect";
import { LivePricesToggle } from "@/components/LivePricesToggle";
import { PremiumTaxToggle } from "@/components/PremiumTaxToggle";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FeedbackButton } from "@/components/FeedbackDialog";
import { paypalDonateUrl } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-gold/20 bg-obsidian/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-x-4 px-4 py-3 sm:px-6 lg:gap-x-6 lg:py-3.5">
        <div className="flex min-w-0 items-center gap-x-1 sm:gap-x-2">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <img
              src="/icon.png?v=2"
              alt=""
              width={36}
              height={36}
              decoding="async"
              className="site-logo h-9 w-9 shrink-0 bg-transparent transition-transform group-hover:scale-105"
            />
            <div className="flex min-w-0 flex-col leading-snug">
              <span className="font-display text-base font-semibold tracking-wide text-parchment">
                Albion Silver
              </span>
              <span className="hidden text-[10px] uppercase tracking-widest text-gold/60 sm:block">
                Money Making Guides
              </span>
            </div>
          </Link>

          <nav className="hidden lg:block" aria-label="Main">
            <Link
              href="/guides"
              className="shrink-0 rounded-md px-3 py-2 text-sm text-parchment/70 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              All Guides
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          <div className="hidden items-center gap-2.5 rounded-lg border border-gold/15 bg-obsidian-light/40 px-2.5 py-1.5 lg:flex">
            <LivePricesToggle />
            <span
              className="hidden h-4 w-px shrink-0 bg-gold/20 xl:block"
              aria-hidden
            />
            <MarketCitySelect compact />
            <span
              className="hidden h-4 w-px shrink-0 bg-gold/20 xl:block"
              aria-hidden
            />
            <PremiumTaxToggle />
          </div>
          <ThemeToggle />
          <FeedbackButton className="btn-secondary hidden px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:inline-flex" />
          <a
            href={paypalDonateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary hidden px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold xl:inline-flex"
          >
            Donate
          </a>
          <div className="relative lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
