import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you requested could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-6xl font-bold text-gold/30">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold text-parchment">
        Page Not Found
      </h1>
      <p className="mt-3 text-parchment/50">
        This guide doesn&apos;t exist. Maybe it got ganked.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="btn-primary px-6 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Back to Home
        </Link>
        <Link
          href="/guides"
          className="btn-secondary px-6 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Browse Guides
        </Link>
      </div>
    </div>
  );
}
