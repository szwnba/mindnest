import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PERSONALITY_TYPES } from "@/lib/data/personality-types";
import { ARTICLES } from "@/lib/data/articles";

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
    {
      url: `${SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
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
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
  const typeUrls: MetadataRoute.Sitemap = PERSONALITY_TYPES.map((t) => ({
    url: `${SITE_URL}/types/${t.code}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const resourceUrls: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE_URL}/resources/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticUrls, ...typeUrls, ...resourceUrls];
}
