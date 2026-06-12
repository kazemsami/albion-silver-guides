import type { Metadata } from "next";

export const siteName = "Albion Silver";
export const siteTagline = "Money Making Guides";
export const siteTitle = `${siteName} | ${siteTagline}`;

export const siteDescription =
  "Proven Albion Online money making guides. Gathering routes, dungeon farming, fishing, crafting, laborers, and more, with live silver/hour estimates from market data.";

export const siteKeywords = [
  "Albion Online",
  "Albion Online silver",
  "Albion money making",
  "Albion gathering guide",
  "Albion fishing guide",
  "Albion laborers",
  "Albion dungeons",
  "silver per hour Albion",
];

function normalizeSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.albion-silver.me"
  ).replace(
    /\/$/,
    "",
  );
}

export const siteUrl = normalizeSiteUrl();

export const paypalDonateUrl = "https://www.paypal.me/kazemsam";

export const sourceRepoUrl = "https://github.com/kazemsami/albion-silver-guides";
export const sourceLicenseUrl = `${sourceRepoUrl}/blob/main/LICENSE`;
export const siteLicensePath = "/license";

/** Feedback form deliveries (FormSubmit). Override with FEEDBACK_EMAIL if needed. */
export const feedbackEmail = "support@albion-silver.me";

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultOgImage = {
  url: "/icon.png",
  width: 512,
  height: 512,
  alt: `${siteName}, Albion Online money making guides`,
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const pageTitle = title ?? siteTitle;
  const pageDescription = description ?? siteDescription;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: "en_US",
      siteName,
      title: pageTitle,
      description: pageDescription,
      url,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: pageDescription,
      images: [defaultOgImage.url],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}
