import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, sourceLicenseUrl, sourceRepoUrl } from "@/lib/site";
import {
  copyrightHolder,
  copyrightYear,
  gplLicenseUrl,
  licenseGrant,
  licenseName,
  licenseShortNotice,
  licenseSummary,
  programName,
} from "@/lib/license";

export const metadata: Metadata = createPageMetadata({
  title: "License",
  description: `License and source code information for ${programName}.`,
  path: "/license",
});

export default function LicensePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-parchment/45">
        <Link
          href="/"
          className="transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-parchment/70">License</span>
      </nav>

      <h1 className="wiki-heading mt-6 font-display text-3xl font-bold text-parchment sm:text-4xl">
        License
      </h1>

      <p className="mt-4 leading-relaxed text-parchment/70">
        {licenseSummary}
      </p>

      <section className="theme-surface mt-8 rounded-xl border border-gold/15 bg-obsidian-light p-6">
        <h2 className="font-display text-xl font-semibold text-parchment">
          Copyright
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-parchment/65">
          Copyright © {copyrightYear} {copyrightHolder}
        </p>
      </section>

      <section className="theme-surface mt-6 rounded-xl border border-gold/15 bg-obsidian-light p-6">
        <h2 className="font-display text-xl font-semibold text-parchment">
          Warranty disclaimer
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-parchment/65">
          {licenseGrant} See the LICENSE file or GPLv3 text for details.
        </p>
      </section>

      <section className="theme-surface mt-6 rounded-xl border border-gold/15 bg-obsidian-light p-6">
        <h2 className="font-display text-xl font-semibold text-parchment">
          Program notice
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-parchment/65">
          The repository LICENSE file contains the complete GPLv3 text. This
          notice identifies {programName} and its copyright holder.
        </p>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg border border-parchment/10 bg-slot-bg p-4 font-mono text-xs leading-relaxed text-parchment/70">
          {licenseShortNotice}
        </pre>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <a
              href={gplLicenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-2 hover:underline"
            >
              Read GPLv3 on gnu.org
            </a>
          </li>
          <li>
            <a
              href={sourceLicenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-2 hover:underline"
            >
              LICENSE file in the repository
            </a>
          </li>
          <li>
            <a
              href={sourceRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-2 hover:underline"
            >
              Source code on GitHub
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
