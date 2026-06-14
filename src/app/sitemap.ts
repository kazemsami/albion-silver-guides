import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { guidesCategorySeo } from "@/lib/guides-seo";
import { absoluteUrl } from "@/lib/site";

function latestGuideUpdateFromGuides(guideList: typeof guides) {
  return guideList.reduce((latest, guide) => {
    const updated = new Date(guide.reliability.lastUpdated);
    return updated > latest ? updated : latest;
  }, new Date(0));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latestGuideUpdate = latestGuideUpdateFromGuides(guides);

  const guidePages = guides.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(guide.reliability.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = Object.values(guidesCategorySeo).map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: latestGuideUpdate,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestGuideUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: latestGuideUpdate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categoryPages,
    {
      url: absoluteUrl("/license"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...guidePages,
  ];
}
