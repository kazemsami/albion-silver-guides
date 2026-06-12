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

export function guideHowToJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    url: absoluteUrl(`/guides/${guide.slug}`),
    inLanguage: "en-US",
    step: guide.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}
