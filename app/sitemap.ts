import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PERSONALITY_TYPES } from "@/lib/data/personality-types";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/types`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
  const typeUrls: MetadataRoute.Sitemap = PERSONALITY_TYPES.map((t) => ({
    url: `${SITE_URL}/types/${t.code}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...staticUrls, ...typeUrls];
}
