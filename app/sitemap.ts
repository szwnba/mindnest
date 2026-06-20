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
    // QA-V2 P1-NEW-4：stub 页面也纳入 sitemap，priority 较低。
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
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
