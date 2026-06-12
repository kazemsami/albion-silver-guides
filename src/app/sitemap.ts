import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const guidePages = guides.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...guidePages,
  ];
}
