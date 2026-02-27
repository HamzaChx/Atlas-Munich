import { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";

const BASE_URL = "https://atlasmunich.de";

export default function sitemap(): MetadataRoute.Sitemap {
  // Core pages — highest priority, change frequently
  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/places`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Topic hub pages — high-intent landing pages per domain
  const topicPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/housing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/bureaucracy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/academic`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/healthcare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Secondary / informational pages
  const secondaryPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Category pages — grouped topic indexes
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.key}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.82,
  }));

  // Individual guide pages — most valuable content pieces
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.lastUpdated),
    changeFrequency: "monthly",
    priority: guide.featured ? 0.92 : 0.78,
  }));

  return [...corePages, ...topicPages, ...categoryPages, ...guidePages, ...secondaryPages];
}
