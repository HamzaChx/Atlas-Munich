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
      <PlacesExplorer places={localizedPlaces} />
    </div>
  );
}
