import { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";

const BASE_URL = "https://atlasmunich.de";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages have no tracked "last updated" value in the data model, so
  // stamping build time here would just be a fake freshness signal — omit
  // lastModified rather than lie about it. Only guide/category pages have a
  // real date to report, derived from content in `guides.ts`.

  // Core pages — highest priority, change frequently
  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/guides`,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/places`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/faq`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Topic hub pages — high-intent landing pages per domain
  const topicPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/housing`,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/bureaucracy`,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/academic`,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/healthcare`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/tools`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Secondary / informational pages
  const secondaryPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Category pages — grouped topic indexes. Real freshness signal: the most
  // recently updated guide within that category, when there is one.
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => {
    const categoryGuideDates = guides
      .filter((guide) => guide.categoryKey === category.key)
      .map((guide) => new Date(guide.lastUpdated).getTime());
    const lastModified =
      categoryGuideDates.length > 0 ? new Date(Math.max(...categoryGuideDates)) : undefined;

    return {
      url: `${BASE_URL}/category/${category.key}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.82,
    };
  });

  // Individual guide pages — most valuable content pieces
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.lastUpdated),
    changeFrequency: "monthly",
    priority: guide.featured ? 0.92 : 0.78,
  }));

  return [...corePages, ...topicPages, ...categoryPages, ...guidePages, ...secondaryPages];
}
