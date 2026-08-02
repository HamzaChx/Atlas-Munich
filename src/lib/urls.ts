import { locales, defaultLocale } from "@/i18n";
import type { Metadata } from "next";

export const BASE_URL = "https://atlasmunich.de";

/**
 * `as-needed` prefixing: English keeps the bare path, the others are prefixed.
 * A page is therefore only ever reachable at one address per locale.
 */
export function localizedUrl(locale: string, path: string): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path === "/" ? "" : path}` || BASE_URL;
}

/**
 * The canonical + hreflang cluster for one path.
 *
 * The sitemap has always declared these alternates, but nothing was emitting
 * them into the document head, so the three locales read to a crawler as near
 * duplicates of each other. Spread this into every `generateMetadata`.
 */
export function alternatesFor(locale: string, path: string): Metadata["alternates"] {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)])),
      // Which version to serve when the visitor's language matches none of ours.
      "x-default": localizedUrl(defaultLocale, path),
    },
  };
}
