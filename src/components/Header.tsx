import Link from "next/link";
import { MarketCitySelect } from "@/components/MarketCitySelect";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FeedbackButton } from "@/components/FeedbackDialog";
import { paypalDonateUrl } from "@/lib/site";

const navLinks = [
  { href: "/guides", label: "All Guides" },
  { href: "/guides?category=gathering", label: "Gathering" },
  { href: "/guides?category=fishing", label: "Fishing" },
  { href: "/guides?category=crafting", label: "Crafting" },
  { href: "/guides?category=dungeons", label: "Dungeons" },
];

export function Header() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-gold/20 bg-obsidian/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <img
            src="/icon.png?v=2"
            alt=""
            width={36}
            height={36}
            decoding="async"
            className="site-logo h-9 w-9 shrink-0 bg-transparent transition-transform group-hover:scale-105"
          />
          <div className="flex min-w-0 flex-col">
            <span className="font-display truncate text-sm font-semibold tracking-wide text-parchment sm:text-base">
              Albion Silver
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest text-gold/60 xl:block">
              Money Making Guides
            </span>
          </div>
        </Link>

        <nav
          className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-2 text-sm text-parchment/70 transition-colors hover:bg-gold/10 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold xl:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-0">
          <div className="hidden lg:block">
            <MarketCitySelect compact />
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
