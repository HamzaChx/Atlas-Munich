import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { guides } from "@/data/guides";
import { localizeGuides } from "@/data/guides-i18n";
import { searchPlaces } from "@/data/places";
import { searchFaqs } from "@/data/faqs";
import { locales, defaultLocale, type Locale } from "@/i18n";

/**
 * Backs the mobile "Search or ask" overlay. Runs server-side so the full
 * guides/places/faqs data files (and the ~50KB-per-locale guide translation
 * overlays) never reach the client bundle just for a nav search box.
 */

const LIMIT_PER_TYPE = 4;

function parseLocale(value: string | null): Locale {
  return (locales as readonly string[]).includes(value ?? "") ? (value as Locale) : defaultLocale;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const locale = parseLocale(searchParams.get("locale"));

  if (query.length < 2) {
    return NextResponse.json({ guides: [], places: [], faqs: [] });
  }

  const q = query.toLowerCase();

  const localizedGuides = await localizeGuides(guides, locale);
  const matchedGuides = localizedGuides
    .filter(
      (guide) =>
        guide.title.toLowerCase().includes(q) ||
        guide.summary.toLowerCase().includes(q) ||
        guide.tags.some((tag) => tag.toLowerCase().includes(q))
    )
    .slice(0, LIMIT_PER_TYPE)
    .map((guide) => ({
      slug: guide.slug,
      title: guide.title,
      summary: guide.summary,
      categoryKey: guide.categoryKey,
    }));

  const matchedPlaces = searchPlaces(query).slice(0, LIMIT_PER_TYPE);
  const placesData =
    matchedPlaces.length > 0 ? await getTranslations({ locale, namespace: "placesData" }) : null;
  const localizedPlaces = matchedPlaces.map((place) => {
    const nameKey = `places.${place.slug}.name`;
    const translatedName = placesData?.(nameKey) ?? place.name;
    return {
      slug: place.slug,
      name: translatedName === nameKey ? place.name : translatedName,
      category: place.category,
      district: place.district,
    };
  });

  const matchedFaqs = searchFaqs(query)
    .slice(0, LIMIT_PER_TYPE)
    .map((faq) => ({
      id: faq.id,
      question: faq.question,
      categoryKey: faq.categoryKey ?? "general",
    }));

  return NextResponse.json({ guides: matchedGuides, places: localizedPlaces, faqs: matchedFaqs });
}
