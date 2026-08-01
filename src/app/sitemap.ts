import { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";
import { locales, defaultLocale } from "@/i18n";

const BASE_URL = "https://atlasmunich.de";

/** `as-needed` prefixing: English keeps the bare path, the others are prefixed. */
function localizedUrl(locale: string, path: string) {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path === "/" ? "" : path}` || BASE_URL;
}

/**
 * Every page is emitted once per locale, and each entry declares the full set
 * of translations. This is the half of the i18n work that makes the French and
 * German content discoverable: without distinct URLs plus these alternates,
 * search engines only ever saw the English rendering.
 */
function entry(
  path: string,
  options: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  }
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, localizedUrl(locale, path)])
  );

  return locales.map((locale) => ({
    url: localizedUrl(locale, path),
    ...(options.lastModified ? { lastModified: options.lastModified } : {}),
    changeFrequency: options.changeFrequency,
    // The prefixed locales are translations of the canonical English page, not
    // competitors to it, so they rank slightly below it.
    priority: locale === defaultLocale ? options.priority : options.priority - 0.1,
    alternates: {
      languages: {
        ...languages,
        // Tells Google which version to serve when no language matches.
        "x-default": localizedUrl(defaultLocale, path),
      },
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages have no tracked "last updated" value in the data model, so
  // stamping build time here would just be a fake freshness signal — omit
  // lastModified rather than lie about it. Only guide/category pages have a
  // real date to report, derived from content in `guides.ts`.

  // Core pages — highest priority, change frequently
  const corePages = [
    ...entry("/", { changeFrequency: "weekly", priority: 1.0 }),
    ...entry("/guides", { changeFrequency: "weekly", priority: 0.95 }),
    ...entry("/places", { changeFrequency: "weekly", priority: 0.9 }),
    ...entry("/faq", { changeFrequency: "weekly", priority: 0.9 }),
  ];

  // Topic hub pages — high-intent landing pages per domain
  const topicPages = [
    ...entry("/housing", { changeFrequency: "weekly", priority: 0.88 }),
    ...entry("/bureaucracy", { changeFrequency: "weekly", priority: 0.88 }),
    ...entry("/academic", { changeFrequency: "weekly", priority: 0.88 }),
    ...entry("/healthcare", { changeFrequency: "weekly", priority: 0.85 }),
    ...entry("/tools", { changeFrequency: "monthly", priority: 0.8 }),
  ];

  // Secondary / informational pages
  const secondaryPages = [
    ...entry("/about", { changeFrequency: "monthly", priority: 0.55 }),
    ...entry("/privacy", { changeFrequency: "yearly", priority: 0.2 }),
    ...entry("/terms", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  // Category pages — grouped topic indexes. Real freshness signal: the most
  // recently updated guide within that category, when there is one.
  const categoryPages = categories.flatMap((category) => {
    const categoryGuideDates = guides
      .filter((guide) => guide.categoryKey === category.key)
      .map((guide) => new Date(guide.lastUpdated).getTime());
    const lastModified =
      categoryGuideDates.length > 0 ? new Date(Math.max(...categoryGuideDates)) : undefined;

    return entry(`/category/${category.key}`, {
      changeFrequency: "weekly",
      priority: 0.82,
      lastModified,
    });
  });

  // Individual guide pages — most valuable content pieces. Slugs are shared
  // across locales; only the prose differs (see guides.fr.ts / guides.de.ts).
  const guidePages = guides.flatMap((guide) =>
    entry(`/guides/${guide.slug}`, {
      changeFrequency: "monthly",
      priority: guide.featured ? 0.92 : 0.78,
      lastModified: new Date(guide.lastUpdated),
    })
  );

  return [...corePages, ...topicPages, ...categoryPages, ...guidePages, ...secondaryPages];
}
