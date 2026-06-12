import Link from "next/link";
import { categoryLabels } from "@/types/guide";
import type { GuideCategory } from "@/types/guide";
import { FeedbackButton } from "@/components/FeedbackDialog";
import { paypalDonateUrl, sourceLicenseUrl } from "@/lib/site";

const footerCategories: GuideCategory[] = [
  "gathering",
  "crafting",
  "dungeons",
  "fishing",
  "laborers",
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/10 bg-obsidian-light">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-gold">
              Albion Silver
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-parchment/50">
              Community-driven money making guides for Albion Online. Learn
              proven strategies to grow your silver stack, from safe gathering
              routes to high-risk corrupted dungeons.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <FeedbackButton />
              <a
                href={paypalDonateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Support this site
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-parchment/40">
              Categories
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {footerCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/guides?category=${cat}`}
                    className="text-sm text-parchment/60 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {categoryLabels[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-parchment/40">
              Disclaimer
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-parchment/40">
              Silver/hour estimates are approximate and vary by server, patch,
              and player skill. This is a fan site, not affiliated with
              Sandbox Interactive.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-gold/10 pt-6 text-center text-xs text-parchment/30">
          <p>
            © {new Date().getFullYear()} Kazem Abou Setta. All rights reserved.
          </p>
          <p className="mt-1">
            Albion Silver Guides · Fan-made project ·{" "}
            <a
              href={sourceLicenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-parchment/45 underline-offset-2 transition-colors hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Source-available license
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
