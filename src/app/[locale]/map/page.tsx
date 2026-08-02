import { getTranslations, setRequestLocale } from "next-intl/server";

import { places } from "@/data/places";
import { getFaqsByHub } from "@/data/faqs";
import { faqPageJsonLd } from "@/lib/structured-data";
import { FAQAccordion } from "@/components/shared";
import { PlacesExplorer } from "./PlacesExplorer";

/**
 * Server shell for /map. The place names and descriptions are localized
 * here rather than in the browser: the `placesData` namespace is ~46 KB of
 * JSON, and resolving it on the server keeps it out of the client bundle
 * entirely (see the namespace filtering in the root layout).
 */
export default async function PlacesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("places");
  const tHubs = await getTranslations("hubs");
  const placesData = await getTranslations("placesData");

  /* Housing and food questions live on this hub now, so a reader looking at
     where to live also finds what a Kaution is. */
  const hubFaqs = getFaqsByHub("map");
  const faqSchema = faqPageJsonLd(hubFaqs);

  const localizedPlaces = places.map((p) => {
    const nameKey = `places.${p.slug}.name`;
    const descKey = `places.${p.slug}.description`;

    // next-intl echoes the key back when a translation is missing, which is
    // the signal to fall back to the English value already in the data file.
    const translatedName = placesData(nameKey);
    const translatedDescription = p.description ? placesData(descKey) : undefined;

    return {
      ...p,
      name: translatedName === nameKey ? p.name : translatedName,
      description:
        translatedDescription === descKey
          ? p.description
          : (translatedDescription ?? p.description),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ========== HERO ========== */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-8 pt-14 text-center sm:pb-10 sm:pt-20 2xl:max-w-3xl">
        <h1 className="rise rise-1 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl 2xl:text-6xl">
          {t("title")} <span className="text-bloom">{t("titleHighlight")}</span>
        </h1>
        <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg 2xl:max-w-lg 2xl:text-xl">
          {t("subtitle")}
        </p>
      </section>

      <PlacesExplorer places={localizedPlaces} />

      {hubFaqs.length > 0 && (
        <section
          id="questions"
          className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8"
        >
          <h2 className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {tHubs("questionsTitle")}
          </h2>
          <div className="mt-5">
            <FAQAccordion faqs={hubFaqs} />
          </div>
        </section>
      )}

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </div>
  );
}
