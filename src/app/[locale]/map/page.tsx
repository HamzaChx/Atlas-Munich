import { getTranslations, setRequestLocale } from "next-intl/server";

import { places } from "@/data/places";
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
  const placesData = await getTranslations("placesData");

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
    </div>
  );
}
