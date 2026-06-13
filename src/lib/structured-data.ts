import type { Guide } from "@/types/guide";
import { absoluteUrl, siteName, siteUrl } from "@/lib/site";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description:
      "Fan-made Albion Online money making guides with live profit estimates.",
    inLanguage: "en-US",
  };
}

export function guideListJsonLd(guides: Guide[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Albion Online Money Making Guides",
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/guides/${guide.slug}`),
      name: guide.title,
    })),
  };
}

export function guideArticleJsonLd(guide: Guide) {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  const published = guide.reliability.lastUpdated;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-US",
    datePublished: published,
    dateModified: published,
    image: absoluteUrl("/opengraph-image"),
    author: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
